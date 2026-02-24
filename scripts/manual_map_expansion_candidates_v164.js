#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const ENTRY_DIR = path.join(ROOT, 'data', 'entries');
const TODAY = '2026-02-24';

function normalizeName(name) {
  return String(name || '')
    .replace(/[\s·•\-_/]/g, '')
    .replace(/岗位|岗|方向|专员|工程师|经理|分析师|助理/g, '')
    .trim();
}

function findMatch(candidateName, roles) {
  const c = normalizeName(candidateName);
  if (!c) return null;

  for (const r of roles) {
    if ((r.role_name || '') === candidateName) return r;
  }

  for (const r of roles) {
    if (normalizeName(r.role_name) === c) return r;
  }

  for (const r of roles) {
    const rn = normalizeName(r.role_name);
    if (!rn) continue;
    if (rn.includes(c) || c.includes(rn)) return r;
  }

  return null;
}

function processFile(filePath) {
  const entry = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const roles = entry.dynamic?.['岗位画像库']?.items || [];
  const extItems = entry.dynamic?.['自定义扩展']?.items || [];

  let mapped = 0;
  let touched = false;

  for (const ext of extItems) {
    if (!Array.isArray(ext.x_role_expansion_candidates)) continue;

    for (const cand of ext.x_role_expansion_candidates) {
      if ((cand.status || '') === 'landed_main_profile' && cand.mapped_role_id) continue;
      const role = findMatch(cand.role_name, roles);
      if (!role) continue;
      cand.status = 'landed_main_profile';
      cand.mapped_role_id = role.role_id;
      cand.mapped_role_name = role.role_name;
      mapped += 1;
      touched = true;
    }

    ext.updated_at = TODAY;
  }

  if (touched) {
    entry.dynamic['自定义扩展'].updated_at = TODAY;
    entry.meta.last_updated = TODAY;
    fs.writeFileSync(filePath, `${JSON.stringify(entry, null, 2)}\n`, 'utf8');
  }

  return {
    industryId: entry.industry_id,
    industry: entry['行业名称'],
    mapped
  };
}

function main() {
  const files = fs.readdirSync(ENTRY_DIR).filter((f) => f.endsWith('.json')).sort();
  const out = [];
  let total = 0;

  for (const f of files) {
    const s = processFile(path.join(ENTRY_DIR, f));
    total += s.mapped;
    out.push(s);
    console.log(`${s.industryId}: mapped=${s.mapped}`);
  }

  const report = {
    generated_at: `${TODAY}T00:00:00Z`,
    version: 'v1.64.1',
    total_mapped_candidates: total,
    by_industry: out
  };

  fs.writeFileSync(
    path.join(ROOT, 'reports', 'v1.64.1_扩容候选映射修复记录.json'),
    `${JSON.stringify(report, null, 2)}\n`,
    'utf8'
  );

  console.log(`TOTAL mapped=${total}`);
}

main();
