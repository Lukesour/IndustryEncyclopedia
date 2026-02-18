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

function daysSince(dateStr, nowTs) {
  if (typeof dateStr !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return null;
  const ts = Date.parse(`${dateStr}T00:00:00Z`);
  if (!Number.isFinite(ts)) return null;
  return (nowTs - ts) / (24 * 3600 * 1000);
}

function ratioScore(actual, target) {
  if (target <= 0) return 100;
  const v = Math.min(1, actual / target);
  return round1(v * 100);
}

function getPublishDate(item) {
  if (!item || typeof item !== 'object') return null;
  return (
    item?.evidence?.publish_date
    || item?.publish_date
    || item?.evidence?.source_date
    || item?.source_date
    || null
  );
}

const entries = data['行业词条'] || [];
const nowTs = Date.parse('2026-02-18T00:00:00Z');

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

  const baseQualityScore = metricCount ? round1(sumQuality / metricCount) : 0;

  const salaryMicro = dynamic['薪酬快照_按城市_按公司层级_按岗位'] || {};
  const observedItems = Array.isArray(salaryMicro.observed_items) ? salaryMicro.observed_items : [];
  const salaryCityCoverage = new Set(observedItems.map((x) => x?.city_id).filter(Boolean)).size;
  const salaryRoleCoverage = new Set(observedItems.map((x) => x?.role_id).filter(Boolean)).size;
  const salaryTierCoverage = new Set(observedItems.map((x) => x?.company_tier).filter(Boolean)).size;
  const salaryCityTarget = Math.max(1, toNum(salaryMicro?.observed_requirements?.min_cities, 4));
  const salaryRoleTarget = Math.max(1, toNum(salaryMicro?.observed_requirements?.min_roles, 4));
  const salaryTierTarget = Math.max(1, toNum(salaryMicro?.observed_requirements?.min_company_tiers, 1));
  const salaryCoverageScore = round1(
    (
      ratioScore(Math.min(salaryCityCoverage, salaryCityTarget), salaryCityTarget)
      + ratioScore(Math.min(salaryRoleCoverage, salaryRoleTarget), salaryRoleTarget)
      + ratioScore(Math.min(salaryTierCoverage, salaryTierTarget), salaryTierTarget)
    ) / 3,
  );

  const writtenItems = Array.isArray(dynamic['笔试真题库']?.items) ? dynamic['笔试真题库'].items : [];
  const interviewItems = Array.isArray(dynamic['面试真题库']?.items) ? dynamic['面试真题库'].items : [];
  const roleTotal = Array.isArray(dynamic['岗位画像库']?.items) ? dynamic['岗位画像库'].items.length : 0;
  const questionRoleTarget = Math.max(1, Math.min(5, roleTotal || 5));
  const writtenRoleCoverage = new Set(writtenItems.map((x) => x?.role_id).filter(Boolean)).size;
  const interviewRoleCoverage = new Set(interviewItems.map((x) => x?.role_id).filter(Boolean)).size;
  const questionRoleCoverageScore = round1(
    (
      ratioScore(Math.min(writtenRoleCoverage, questionRoleTarget), questionRoleTarget)
      + ratioScore(Math.min(interviewRoleCoverage, questionRoleTarget), questionRoleTarget)
    ) / 2,
  );

  const decisionItems = Array.isArray(dynamic['自定义扩展']?.items) ? dynamic['自定义扩展'].items : [];
  const decisionEvidenceScore = decisionItems.length > 0
    ? round1(
      (decisionItems.reduce((acc, item) => {
        const minRequired = Math.max(1, toNum(item?.x_decision_min_sample_required, 8));
        const actual = toNum(item?.evidence?.sample_size, 0);
        return acc + ratioScore(Math.min(actual, minRequired), minRequired);
      }, 0)) / decisionItems.length,
    )
    : 0;

  const questionDepth = writtenItems.length + interviewItems.length;
  const questionDepthTarget = 18;
  const questionDepthScore = ratioScore(Math.min(questionDepth, questionDepthTarget), questionDepthTarget);

  const eventItems = Array.isArray(dynamic['行业事件日志']?.items) ? dynamic['行业事件日志'].items : [];
  const eventTotalTarget = Math.max(2, toNum(data?.['治理配置']?.['发布硬门槛']?.event_log_min_count, 6));
  const eventRecentTarget = Math.max(1, toNum(data?.['治理配置']?.['发布硬门槛']?.event_recent_180d_min_count, 4));
  const eventRecentCount = eventItems.filter((it) => {
    const d = getPublishDate(it);
    const days = daysSince(d, nowTs);
    return days !== null && days <= 180;
  }).length;
  const eventDensityScore = round1(
    (
      ratioScore(Math.min(eventItems.length, eventTotalTarget), eventTotalTarget)
      + ratioScore(Math.min(eventRecentCount, eventRecentTarget), eventRecentTarget)
    ) / 2,
  );

  const allItems = collections.flatMap(([, col]) => (Array.isArray(col?.items) ? col.items : []));
  const totalItems = allItems.length;
  const strongEvidenceCount = allItems.filter((item) => {
    const ev = item?.evidence;
    if (!ev || typeof ev !== 'object') return false;
    return !!(ev.source_id && ev.source_url && ev.source_date) && toNum(ev.sample_size, 0) >= 1;
  }).length;
  const evidenceStrengthScore = totalItems > 0 ? round1((strongEvidenceCount * 100) / totalItems) : 0;

  const sourceIds = new Set(
    allItems
      .map((item) => item?.evidence?.source_id || item?.source_id)
      .filter(Boolean),
  );
  const sourceDiversityScore = ratioScore(sourceIds.size, Math.min(18, Math.max(6, Math.floor(totalItems / 6) || 6)));
  const sourceIdList = allItems
    .map((item) => item?.evidence?.source_id || item?.source_id)
    .filter(Boolean);
  const sourceCounts = sourceIdList.reduce((acc, id) => {
    acc[id] = (acc[id] || 0) + 1;
    return acc;
  }, {});
  const topSourceCount = Object.values(sourceCounts).reduce((mx, n) => Math.max(mx, Number(n || 0)), 0);
  const top1SharePercent = sourceIdList.length > 0 ? round1((topSourceCount * 100) / sourceIdList.length) : 0;
  const sourceIndependenceScore = round1(Math.max(0, 100 - top1SharePercent));

  const datedItems = allItems
    .map((item) => getPublishDate(item))
    .filter(Boolean);
  const freshCount = datedItems.filter((d) => {
    const days = daysSince(d, nowTs);
    return days !== null && days <= 180;
  }).length;
  const freshnessLiveScore = datedItems.length > 0 ? round1((freshCount * 100) / datedItems.length) : 0;

  const personalizationSlots = (dynamic['岗位画像库']?.items || []).flatMap((role) => role?.project_evidence_slots || []);
  const personalizationTotal = personalizationSlots.length;
  const personalizationPending = personalizationSlots.filter((slot) => {
    const status = String(slot?.status || '');
    return status.startsWith('pending_personalization') || status === 'pending_user_fill';
  }).length;
  const personalizationCompletion = personalizationTotal > 0
    ? round1(((personalizationTotal - personalizationPending) * 100) / personalizationTotal)
    : 100;

  // v1.28: 在v1.25基础上加入题库深度与惩罚项（时效/来源集中/深度不足），提升行业区分度与可解释性。
  const stalePenalty = Math.max(0, (85 - freshnessLiveScore) * 0.12);
  const sourceConcentrationPenalty = Math.max(0, (top1SharePercent - 6.5) * 0.6);
  const depthPenalty = Math.max(0, (70 - questionDepthScore) * 0.08);
  const qualityRawScore =
    baseQualityScore * 0.34
    + salaryCoverageScore * 0.13
    + questionRoleCoverageScore * 0.1
    + questionDepthScore * 0.07
    + decisionEvidenceScore * 0.11
    + eventDensityScore * 0.06
    + sourceDiversityScore * 0.06
    + sourceIndependenceScore * 0.05
    + evidenceStrengthScore * 0.04
    + freshnessLiveScore * 0.04
    - stalePenalty
    - sourceConcentrationPenalty
    - depthPenalty;
  const qualityScoreOverall = round1(Math.max(0, Math.min(100, qualityRawScore)));

  entry.progress = {
    todo_collections: todo,
    in_progress_collections: inProgress,
    verified_collections: verified,
    confirmed_empty_collections: confirmedEmpty,
    tracked_collections: tracked,
    coverage_percent_overall: metricCount ? round1(sumCoverage / metricCount) : 0,
    evidence_percent_overall: evidenceStrengthScore,
    freshness_percent_overall: freshnessLiveScore,
    real_data_ratio_overall: metricCount ? round1(sumReal / metricCount) : 0,
    template_ratio_overall: metricCount ? round1(sumTemplate / metricCount) : 0,
    quality_score_overall: qualityScoreOverall,
    verified_ratio_percent: tracked ? round1((verified * 100) / tracked) : 0,
    weakest_collections: weakest.slice(0, 3).map((x) => x.key),
    manual_fill_required_total: manualRequiredTotal,
    manual_fill_pending_total: manualPendingTotal,
    manual_fill_completion_percent: completion,
    personalization_slots_total: personalizationTotal,
    personalization_pending_total: personalizationPending,
    personalization_completion_percent: personalizationCompletion,
    salary_micro_status: dynamic['薪酬快照_按城市_按公司层级_按岗位']?.data_status || 'not_collected',
    salary_macro_status: dynamic['薪酬实证_国家统计口径']?.data_status || 'not_collected',
    updated_at: '2026-02-18',
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
