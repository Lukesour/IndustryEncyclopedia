#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const ENTRY_DIR = path.join(ROOT, 'data', 'entries');
const OUT_JSON = path.join(ROOT, 'reports', '岗位别名字典_v1.64.0.json');
const OUT_MD = path.join(ROOT, 'reports', '岗位别名字典_v1.64.0.md');
const TODAY = '2026-02-24';

function canonical(name) {
  return (name || '')
    .replace(/岗位$/g, '')
    .replace(/岗$/g, '')
    .replace(/专员$/g, '')
    .replace(/工程师$/g, '工程')
    .replace(/经理$/g, '管理')
    .replace(/\s+/g, '')
    .trim();
}

const files = fs.readdirSync(ENTRY_DIR).filter((f) => f.endsWith('.json')).sort();
const byIndustry = [];

for (const f of files) {
  const entry = JSON.parse(fs.readFileSync(path.join(ENTRY_DIR, f), 'utf8'));
  const roles = entry.dynamic?.['岗位画像库']?.items || [];
  const group = new Map();

  for (const r of roles) {
    const key = canonical(r.role_name);
    if (!group.has(key)) group.set(key, []);
    group.get(key).push(r.role_name);
  }

  const aliases = [];
  for (const [key, names] of group.entries()) {
    const uniq = Array.from(new Set(names));
    if (uniq.length > 1) {
      aliases.push({
        canonical_role_name: key,
        aliases: uniq
      });
    }
  }

  if (aliases.length > 0) {
    byIndustry.push({
      industry_id: entry.industry_id,
      industry_name: entry['行业名称'],
      alias_groups: aliases
    });
  }
}

const payload = {
  generated_at: `${TODAY}T00:00:00Z`,
  version: 'v1.64.0',
  note: '用于岗位命名治理；canonical_role_name用于题库映射、搜索与横向比较。',
  industries: byIndustry
};

fs.writeFileSync(OUT_JSON, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

const lines = [];
lines.push('# 岗位别名字典（v1.64.0）');
lines.push('');
lines.push(`生成日期：${TODAY}`);
lines.push('');
for (const ind of byIndustry) {
  lines.push(`## ${ind.industry_name}（${ind.industry_id}）`);
  lines.push('');
  for (const g of ind.alias_groups) {
    lines.push(`- ${g.canonical_role_name}：${g.aliases.join(' / ')}`);
  }
  lines.push('');
}

fs.writeFileSync(OUT_MD, `${lines.join('\n')}\n`, 'utf8');
console.log(`Generated ${OUT_JSON}`);
console.log(`Generated ${OUT_MD}`);
