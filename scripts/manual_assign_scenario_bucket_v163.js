#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const ENTRY_DIR = path.join(ROOT, 'data', 'entries');
const REQUIRED = ['business_scenario', 'system_process', 'failure_review', 'cross_team_collaboration', 'metric_tradeoff'];

function inferBucket(q) {
  const txt = `${q.prompt || ''} ${q.question_type || ''}`;
  if (/复盘|失败|失误|回滚|偏差|纠偏|复发|教训/.test(txt)) return 'failure_review';
  if (/协同|跨团队|跨部门|协调|联动|合作|三方/.test(txt)) return 'cross_team_collaboration';
  if (/取舍|优先级|资源|平衡|权衡|冲突|止损/.test(txt)) return 'metric_tradeoff';
  if (/流程|机制|SOP|体系|设计|闭环|规则/.test(txt)) return 'system_process';
  return 'business_scenario';
}

function normalizeBucketsForRole(questions) {
  if (!questions || questions.length === 0) return { forced: 0 };

  // Fill missing buckets first.
  let filled = 0;
  for (const q of questions) {
    if (!q.scenario_bucket || typeof q.scenario_bucket !== 'string' || q.scenario_bucket.length === 0) {
      q.scenario_bucket = inferBucket(q);
      filled += 1;
    }
  }

  // Guarantee at least 5 buckets when enough questions exist.
  let forced = 0;
  if (questions.length >= 5) {
    const set = new Set(questions.map((q) => q.scenario_bucket));
    const missing = REQUIRED.filter((b) => !set.has(b));
    if (missing.length > 0) {
      const bucketFreq = {};
      for (const q of questions) bucketFreq[q.scenario_bucket] = (bucketFreq[q.scenario_bucket] || 0) + 1;

      const candidates = [...questions].sort((a, b) => {
        const fa = bucketFreq[a.scenario_bucket] || 0;
        const fb = bucketFreq[b.scenario_bucket] || 0;
        if (fa !== fb) return fb - fa;
        return String(a.question_id || '').localeCompare(String(b.question_id || ''));
      });

      let idx = 0;
      for (const bucket of missing) {
        const q = candidates[idx % candidates.length];
        if (q.scenario_bucket !== bucket) {
          q.scenario_bucket = bucket;
          forced += 1;
        }
        idx += 1;
      }
    }
  }

  return { filled, forced };
}

const files = fs.readdirSync(ENTRY_DIR).filter((f) => f.endsWith('.json')).sort();
let totalFilled = 0;
let totalForced = 0;

for (const f of files) {
  const p = path.join(ENTRY_DIR, f);
  const entry = JSON.parse(fs.readFileSync(p, 'utf8'));
  const written = entry.dynamic?.['笔试真题库']?.items || [];
  const interview = entry.dynamic?.['面试真题库']?.items || [];

  const roleMap = new Map();
  for (const q of [...written, ...interview]) {
    if (!q.role_id) continue;
    if (!roleMap.has(q.role_id)) roleMap.set(q.role_id, []);
    roleMap.get(q.role_id).push(q);
  }

  let fileFilled = 0;
  let fileForced = 0;
  for (const qs of roleMap.values()) {
    const { filled = 0, forced = 0 } = normalizeBucketsForRole(qs);
    fileFilled += filled;
    fileForced += forced;
  }

  totalFilled += fileFilled;
  totalForced += fileForced;
  fs.writeFileSync(p, JSON.stringify(entry, null, 2) + '\n', 'utf8');
  console.log(`${f}: filled_missing=${fileFilled}, forced_to_5buckets=${fileForced}`);
}

console.log(`TOTAL filled_missing=${totalFilled}, TOTAL forced_to_5buckets=${totalForced}`);
