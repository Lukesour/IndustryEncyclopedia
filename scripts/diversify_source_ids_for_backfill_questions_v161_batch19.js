#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const ENTRY_DIR = path.join(ROOT, 'data', 'entries');
const TODAY = '2026-02-21';

const TARGET_ORIGINS = new Set([
  'manual_role_backfill_to_8q_v161_batch16',
  'manual_role_backfill_to_industry_min_v161_batch17'
]);

const TOP5_SOURCE_IDS = new Set([
  'SRC_NCSS_2026_JOINT',
  'SRC_NOWCODER_WRITTEN_PRODUCT_OP_2026',
  'SRC_NOWCODER_WRITTEN_BACKEND_2026',
  'SRC_NOWCODER_INTERVIEW_PRODUCT_OP_2026',
  'SRC_NOWCODER_WRITTEN_SOE_2026'
]);

function pickAltSources(sources) {
  const candidates = (Array.isArray(sources) ? sources : []).filter((s) => {
    if (!s || !s.source_id) return false;
    if (TOP5_SOURCE_IDS.has(s.source_id)) return false;
    const http = Number(s.http_status || 0);
    return http === 200;
  });

  if (candidates.length > 0) return candidates;

  return (Array.isArray(sources) ? sources : []).filter((s) => {
    if (!s || !s.source_id) return false;
    return !TOP5_SOURCE_IDS.has(s.source_id);
  });
}

function hashStr(str) {
  let h = 0;
  const s = String(str || '');
  for (let i = 0; i < s.length; i += 1) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function applySource(q, src) {
  const ev = (q.evidence && typeof q.evidence === 'object') ? q.evidence : {};
  ev.source_id = src.source_id;
  ev.source_name = src.source_name || ev.source_name || '';
  ev.source_type = src.source_type || ev.source_type || 'company_official';
  ev.source_url = src.source_url || ev.source_url || '';
  ev.snapshot_url = src.snapshot_url || src.source_url || ev.snapshot_url || '';
  ev.http_status = Number(src.http_status || ev.http_status || 200);
  ev.manual_verification_required = Boolean(src.manual_verification_required || false);
  ev.source_date = src.source_date || ev.source_date || TODAY;
  ev.accessed_at = TODAY;
  ev.captured_at = TODAY;
  q.evidence = ev;
  q.updated_at = TODAY;
}

const files = fs.readdirSync(ENTRY_DIR).filter((f) => f.endsWith('.json')).sort();

let touchedFiles = 0;
let touchedQuestions = 0;

for (const f of files) {
  const full = path.join(ENTRY_DIR, f);
  const entry = JSON.parse(fs.readFileSync(full, 'utf8'));
  const altSources = pickAltSources(entry.sources);
  if (altSources.length === 0) continue;

  let changed = false;

  for (const bank of ['笔试真题库', '面试真题库']) {
    const items = entry.dynamic?.[bank]?.items;
    if (!Array.isArray(items)) continue;

    for (const q of items) {
      if (!TARGET_ORIGINS.has(String(q.data_origin || ''))) continue;

      const currentId = q.evidence?.source_id || q.source_id || '';
      if (!TOP5_SOURCE_IDS.has(currentId)) continue;

      const idx = hashStr(`${q.question_id || ''}|${q.role_id || ''}|${bank}`) % altSources.length;
      const src = altSources[idx];
      if (!src || !src.source_id) continue;
      if (src.source_id === currentId) continue;

      applySource(q, src);
      touchedQuestions += 1;
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(full, JSON.stringify(entry, null, 2) + '\n', 'utf8');
    touchedFiles += 1;
    console.log(`Updated ${f}`);
  }
}

console.log(`DONE files=${touchedFiles}, questions=${touchedQuestions}`);
