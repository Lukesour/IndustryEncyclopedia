#!/usr/bin/env node
const fs = require('fs');

const path = process.argv[2] || '行业百科.json';
const raw = fs.readFileSync(path, 'utf8');
const data = JSON.parse(raw);

function toNum(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function round1(n) {
  return Math.round(n * 10) / 10;
}

const entries = data['行业词条'] || [];

for (const entry of entries) {
  const dynamic = entry.dynamic || {};
  const collections = Object.entries(dynamic);

  let todo = 0;
  let inProgress = 0;
  let verified = 0;
  let confirmedEmpty = 0;

  let sumCoverage = 0;
  let sumEvidence = 0;
  let sumFreshness = 0;
  let sumReal = 0;
  let sumTemplate = 0;
  let sumQuality = 0;

  let metricCount = 0;
  let manualRequiredTotal = 0;
  let manualPendingTotal = 0;

  const weakest = [];

  for (const [key, col] of collections) {
    if (!col || typeof col !== 'object') continue;

    const status = col.data_status || 'not_collected';
    if (status === 'not_collected') todo += 1;
    else if (status === 'in_progress') inProgress += 1;
    else if (status === 'verified') verified += 1;
    else if (status === 'confirmed_empty') confirmedEmpty += 1;

    const coverage = toNum(col.coverage_percent, 0);
    const evidence = toNum(col.quality?.evidence_completeness_percent, 0);
    const freshness = toNum(col.quality?.freshness_score, col.stale_status === 'fresh' ? 100 : 0);
    const real = toNum(col.real_data_ratio_percent, 0);
    const items = Array.isArray(col.items) ? col.items : [];
    const templateCount = items.filter((it) => {
      if (!it || typeof it !== 'object') return false;
      return it.authenticity_level === 'template' || it.is_template === true;
    }).length;
    const template = items.length > 0 ? (templateCount * 100) / items.length : 0;
    const quality = toNum(col.quality?.quality_score, 0);

    sumCoverage += coverage;
    sumEvidence += evidence;
    sumFreshness += freshness;
    sumReal += real;
    sumTemplate += template;
    sumQuality += quality;
    metricCount += 1;

    weakest.push({ key, score: quality });

    const mfp = col.manual_fill_progress || {};
    manualRequiredTotal += toNum(mfp.required_count, 0);
    manualPendingTotal += toNum(mfp.pending_count, 0);
  }

  const tracked = todo + inProgress + verified + confirmedEmpty;
  const completion = manualRequiredTotal > 0
    ? round1(((manualRequiredTotal - manualPendingTotal) * 100) / manualRequiredTotal)
    : 100;

  weakest.sort((a, b) => a.score - b.score);

  entry.progress = {
    todo_collections: todo,
    in_progress_collections: inProgress,
    verified_collections: verified,
    confirmed_empty_collections: confirmedEmpty,
    tracked_collections: tracked,
    coverage_percent_overall: metricCount ? round1(sumCoverage / metricCount) : 0,
    evidence_percent_overall: metricCount ? round1(sumEvidence / metricCount) : 0,
    freshness_percent_overall: metricCount ? round1(sumFreshness / metricCount) : 0,
    real_data_ratio_overall: metricCount ? round1(sumReal / metricCount) : 0,
    template_ratio_overall: metricCount ? round1(sumTemplate / metricCount) : 0,
    quality_score_overall: metricCount ? round1(sumQuality / metricCount) : 0,
    verified_ratio_percent: tracked ? round1((verified * 100) / tracked) : 0,
    weakest_collections: weakest.slice(0, 3).map((x) => x.key),
    manual_fill_required_total: manualRequiredTotal,
    manual_fill_pending_total: manualPendingTotal,
    manual_fill_completion_percent: completion,
    salary_micro_status: dynamic['薪酬快照_按城市_按公司层级_按岗位']?.data_status || 'not_collected',
    salary_macro_status: dynamic['薪酬实证_国家统计口径']?.data_status || 'not_collected',
    updated_at: '2026-02-17',
    ranking_percentile: 0,
  };
}

const sorted = [...entries].sort((a, b) => {
  return toNum(b.progress?.quality_score_overall, 0) - toNum(a.progress?.quality_score_overall, 0);
});
const n = sorted.length;
for (let i = 0; i < n; i += 1) {
  const pct = n <= 1 ? 100 : round1(((n - 1 - i) * 100) / (n - 1));
  sorted[i].progress.ranking_percentile = pct;
}

fs.writeFileSync(path, JSON.stringify(data, null, 2) + '\n', 'utf8');
console.log(`recomputed progress for ${entries.length} entries: ${path}`);
