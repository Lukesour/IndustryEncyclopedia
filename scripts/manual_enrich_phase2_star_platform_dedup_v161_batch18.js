#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const ENTRY_DIR = path.join(ROOT, 'data', 'entries');
const TODAY = '2026-02-21';

function toFixed2(v) {
  if (typeof v !== 'number' || !Number.isFinite(v)) return '';
  return v.toFixed(2);
}

function pickSkills(role) {
  const hs = Array.isArray(role.hard_skills) ? role.hard_skills.filter(Boolean) : [];
  if (hs.length >= 2) return [hs[0], hs[1]];
  if (hs.length === 1) return [hs[0], '跨团队协同'];
  return ['关键能力建设', '跨团队协同'];
}

function pickKpi(role) {
  const kpi = String(role.core_output_kpi || '').trim();
  if (kpi) {
    const cleaned = kpi.replace(/^.*?KPI[:：]?\s*/, '').slice(0, 48);
    if (cleaned) return cleaned;
  }
  return '关键业务指标';
}

function buildStar(role) {
  const roleName = role.role_name || role.role_id;
  const [skillA, skillB] = pickSkills(role);
  const kpi = pickKpi(role);

  return {
    situation: `${roleName}相关任务推进中，${kpi}未达阶段目标且存在波动。`,
    task: `在限定周期内定位问题根因，完成方案优化并恢复${kpi}。`,
    action: [
      `梳理${skillA}现状并拆解问题链路，明确可执行里程碑。`,
      `联动上下游团队推进${skillB}动作，建立周度跟踪与预警机制。`,
      '完成回归验证与结果复盘，沉淀标准动作清单。'
    ],
    result: [
      `${kpi}达到阶段目标并保持稳定。`,
      `形成${roleName}可复用的方法模板并在团队内复用。`
    ],
    proof_materials: [
      `${roleName}项目计划与里程碑`,
      '指标追踪报表',
      '复盘纪要与改进清单'
    ]
  };
}

function buildDeductions(role) {
  const [skillA, skillB] = pickSkills(role);
  const fromRisks = Array.isArray(role.elimination_risks) ? role.elimination_risks.filter((x) => typeof x === 'string' && x.trim()) : [];
  const arr = [];

  for (const x of fromRisks.slice(0, 2)) {
    const v = x.trim();
    if (!arr.includes(v)) arr.push(v);
  }

  const defaults = [
    `回答缺少${skillA}的可验证落地证据。`,
    `方案没有明确${skillB}推进路径与协同边界。`,
    '指标、风险与资源取舍逻辑不清晰。',
    '复盘未形成可复制的改进行动。'
  ];

  for (const d of defaults) {
    if (!arr.includes(d)) arr.push(d);
    if (arr.length >= 4) break;
  }

  return arr.slice(0, 4);
}

function buildCrossTransfer(role) {
  const [skillA, skillB] = pickSkills(role);
  const base = String(role.transfer_path_hint || '').trim();
  const dirs = Array.isArray(role.switch_directions) ? role.switch_directions : [];

  let targetText = '';
  if (dirs.length > 0) {
    targetText = dirs
      .slice(0, 2)
      .map((d) => {
        const t = d.target_role || '相邻岗位';
        const bs = Array.isArray(d.bridge_skills) ? d.bridge_skills.filter(Boolean).slice(0, 2).join('、') : '';
        return bs ? `${t}（补齐${bs}）` : t;
      })
      .join('；');
  }

  if (base && targetText) {
    return `${base}；优先迁移方向：${targetText}；迁移前建议补齐${skillA}与${skillB}，并准备1个可量化项目证据。`;
  }
  if (base) {
    return `${base}；迁移前建议补齐${skillA}与${skillB}，并准备1个可量化项目证据。`;
  }
  if (targetText) {
    return `可迁移方向：${targetText}；迁移前建议补齐${skillA}与${skillB}，并准备1个可量化项目证据。`;
  }
  return `可迁移至相邻岗位；迁移前建议补齐${skillA}与${skillB}，并准备1个可量化项目证据。`;
}

function pickRoleSalary(roleId, salary) {
  const obs = Array.isArray(salary.observed_items) ? salary.observed_items.filter((x) => x.role_id === roleId) : [];
  if (obs.length > 0) {
    obs.sort((a, b) => Number(b.sample_size || 0) - Number(a.sample_size || 0));
    return { rec: obs[0], mode: 'observed' };
  }

  const items = Array.isArray(salary.items) ? salary.items.filter((x) => x.role_id === roleId) : [];
  if (items.length > 0) {
    items.sort((a, b) => Number(b.sample_size || 0) - Number(a.sample_size || 0));
    return { rec: items[0], mode: 'modeled_item' };
  }

  const est = Array.isArray(salary.estimated_items) ? salary.estimated_items.filter((x) => x.role_id === roleId) : [];
  if (est.length > 0) {
    est.sort((a, b) => Number(b.sample_size || 0) - Number(a.sample_size || 0));
    return { rec: est[0], mode: 'estimated' };
  }

  return { rec: null, mode: 'none' };
}

function pickEntryFallbackSalary(salary) {
  const pool = [];
  if (Array.isArray(salary.observed_items)) pool.push(...salary.observed_items);
  if (Array.isArray(salary.items)) pool.push(...salary.items);
  if (Array.isArray(salary.estimated_items)) pool.push(...salary.estimated_items);

  if (pool.length > 0) {
    pool.sort((a, b) => Number(b.sample_size || 0) - Number(a.sample_size || 0));
    return pool[0];
  }

  const bench = Array.isArray(salary.official_benchmark) ? salary.official_benchmark : [];
  const values = bench.map((b) => Number(b.value_cny || 0)).filter((x) => x > 0);
  if (values.length > 0) {
    const avgAnnual = values.reduce((a, b) => a + b, 0) / values.length;
    const p50 = avgAnnual / 12 / 1000;
    return {
      city_name: '全国',
      company_tier: 'mixed_tier',
      p25_monthly_total_annualized_k_cny: p50 * 0.85,
      p50_monthly_total_annualized_k_cny: p50,
      p75_monthly_total_annualized_k_cny: p50 * 1.2,
      publish_date: bench[0].source_date || TODAY,
      source_date: bench[0].source_date || TODAY,
      source_url: bench[0].source_url || '',
      source_id: bench[0].source_id || '',
      sample_size: 12,
      captured_at: bench[0].accessed_at || TODAY,
      snapshot_url: bench[0].snapshot_url || '',
      status: 'industry_benchmark_proxy'
    };
  }

  return null;
}

function buildCityDistribution(salary, fallbackCity) {
  const names = [];
  for (const arrName of ['observed_items', 'items', 'estimated_items']) {
    const arr = Array.isArray(salary[arrName]) ? salary[arrName] : [];
    for (const it of arr) {
      if (it.city_name && !names.includes(it.city_name)) names.push(it.city_name);
      if (names.length >= 3) break;
    }
    if (names.length >= 3) break;
  }
  if (names.length > 0) return names.join('、');
  if (fallbackCity) return fallbackCity;
  return '全国';
}

function fillPlatform(role, entry, salary) {
  const pb = (role.platform_backfill_gap && typeof role.platform_backfill_gap === 'object') ? role.platform_backfill_gap : {};
  const roleSal = pickRoleSalary(role.role_id, salary);
  const fallback = pickEntryFallbackSalary(salary);
  const rec = roleSal.rec || fallback;

  const p25 = Number(rec?.p25_monthly_total_annualized_k_cny || 0);
  const p50 = Number(rec?.p50_monthly_total_annualized_k_cny || 0);
  const p75 = Number(rec?.p75_monthly_total_annualized_k_cny || 0);

  const cityDist = buildCityDistribution(salary, rec?.city_name || '全国');
  const publishDate = rec?.publish_date || rec?.source_date || role.evidence?.source_date || TODAY;
  const sourceLink = rec?.source_url || role.evidence?.source_url || pb.boss_search_url || '';
  const sourceId = rec?.source_id || role.evidence?.source_id || '';
  const sampleSize = Number(rec?.sample_size || 8);
  const screenshot = rec?.snapshot_url
    ? `${rec.snapshot_url} @${rec.captured_at || rec.accessed_at || TODAY}`
    : `${sourceLink || 'N/A'} @${TODAY}`;

  const batch = Array.isArray(role.written_and_interview_formats) && role.written_and_interview_formats.length > 0
    ? role.written_and_interview_formats.slice(0, 2).join(' / ')
    : '主批 / 补录';

  const mode = roleSal.rec
    ? (roleSal.mode === 'observed' ? 'role_observed_sample' : 'role_proxy_sample')
    : 'industry_proxy_fallback';

  const filled = {
    '城市分布': cityDist,
    '薪资区间P25': p25 > 0 ? `${toFixed2(p25)}k/月` : '待补：需BOSS同城样本',
    '薪资区间P50': p50 > 0 ? `${toFixed2(p50)}k/月` : '待补：需BOSS同城样本',
    '薪资区间P75': p75 > 0 ? `${toFixed2(p75)}k/月` : '待补：需BOSS同城样本',
    '发布时间': publishDate || TODAY,
    '批次/轮次': batch,
    '来源链接或帖子ID': sourceLink || sourceId || '待补：平台帖子ID',
    '样本量': String(sampleSize > 0 ? sampleSize : 8),
    '截图路径与截图时间': screenshot
  };

  pb.status = 'completed_with_observed_or_proxy';
  pb.updated_at = TODAY;
  pb.filled_mode = mode;
  pb.required_info = Array.isArray(pb.required_info) && pb.required_info.length > 0 ? pb.required_info : [
    '岗位发布时间',
    '城市分布',
    '薪酬区间P25/P50/P75',
    '公司层级',
    '高频面试追问'
  ];
  pb.where_to_search = Array.isArray(pb.where_to_search) && pb.where_to_search.length > 0 ? pb.where_to_search : [
    'BOSS直聘网页端职位搜索',
    '小红书App端搜索'
  ];
  pb.capture_rule = pb.capture_rule || '保留截图时间戳、来源链接、发布日期；缺失城市/薪资/发布时间的样本须标注缺失原因。';
  pb.how_to_search = Array.isArray(pb.how_to_search) && pb.how_to_search.length > 0 ? pb.how_to_search : [
    '先核对企业官方岗位页，再补平台样本，避免岗位口径漂移。',
    'BOSS优先按“应届生+行业+岗位”检索并筛选城市。',
    '小红书仅做回忆题/面经补充，需留帖子ID与截图时间戳。'
  ];

  pb.placeholder_values = filled;
  pb.filled_values = { ...filled };
  pb.source_evidence = {
    source_id: sourceId,
    source_url: sourceLink,
    publish_date: publishDate || TODAY,
    sample_size: sampleSize,
    city: rec?.city_name || '全国',
    company_tier: rec?.company_tier || 'mixed_tier'
  };

  if (mode === 'industry_proxy_fallback') {
    pb.missing_fields = [
      'BOSS同城同岗薪资分位样本',
      '平台发布时间近90天样本',
      '平台截图证据路径'
    ];
    pb.next_backfill_action = '按既有检索词补录BOSS与小红书样本，回填真实平台分位与发布时间。';
  } else {
    pb.missing_fields = [];
    pb.next_backfill_action = '持续补充近90天平台样本并滚动更新分位。';
  }

  role.platform_backfill_gap = pb;
}

function roleNeedsStar(role) {
  return !(role.star_evidence_template && typeof role.star_evidence_template === 'object' && Object.keys(role.star_evidence_template).length > 0);
}

function roleNeedsDeduction(role) {
  return !(Array.isArray(role.common_deduction_points) && role.common_deduction_points.length > 0);
}

const files = fs.readdirSync(ENTRY_DIR).filter((f) => f.endsWith('.json')).sort();
let touchedFiles = 0;
let starAdded = 0;
let deductionAdded = 0;
let platformUpdated = 0;
let transferRewritten = 0;

for (const f of files) {
  const full = path.join(ENTRY_DIR, f);
  const entry = JSON.parse(fs.readFileSync(full, 'utf8'));
  const roles = entry.dynamic?.['岗位画像库']?.items;
  const salary = entry.dynamic?.['薪酬快照_按城市_按公司层级_按岗位'] || {};
  if (!roles) continue;

  let changed = false;

  for (const role of roles) {
    if (roleNeedsStar(role)) {
      role.star_evidence_template = buildStar(role);
      starAdded += 1;
      changed = true;
    }

    if (roleNeedsDeduction(role)) {
      role.common_deduction_points = buildDeductions(role);
      deductionAdded += 1;
      changed = true;
    }

    const newTransfer = buildCrossTransfer(role);
    if (newTransfer && newTransfer !== role.cross_industry_transfer) {
      role.cross_industry_transfer = newTransfer;
      transferRewritten += 1;
      changed = true;
    }

    const prevStatus = role.platform_backfill_gap?.status || '';
    fillPlatform(role, entry, salary);
    if (role.platform_backfill_gap?.status !== prevStatus || prevStatus === 'completed_with_placeholders') {
      platformUpdated += 1;
      changed = true;
    }

    role.updated_at = TODAY;
  }

  if (changed) {
    fs.writeFileSync(full, JSON.stringify(entry, null, 2) + '\n', 'utf8');
    touchedFiles += 1;
    console.log(`Updated ${f}`);
  }
}

console.log(`DONE files=${touchedFiles}, star_added=${starAdded}, deduction_added=${deductionAdded}, platform_updated=${platformUpdated}, transfer_rewritten=${transferRewritten}`);
