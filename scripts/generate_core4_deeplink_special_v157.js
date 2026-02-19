#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DATA_PATH = process.argv[2] || path.join(ROOT, '行业百科.json');
const DATE_TAG =
  process.argv[3] ||
  new Date().toISOString().slice(0, 10).replace(/-/g, '');
const REPORT_DIR = path.join(ROOT, 'reports');

const VERSION = 'v1.57.0';
const DEFAULT_SCOPE = [
  'IND_INTERNET_AI',
  'IND_FIN_BANK',
  'IND_ENERGY_UTILITIES',
  'IND_PUBLIC_INSTITUTION',
  'IND_FIN_SECURITIES_FUND',
  'IND_NEW_ENERGY',
  'IND_TELECOM_OPERATOR',
  'IND_AUTO_INTELLIGENT_DRIVING'
];
const STAGES = ['提前批', '主批', '补录', '实习转正'];
const STAGE_MAP = [
  { label: '提前批', tokens: ['early', '提前'] },
  { label: '主批', tokens: ['main', '主批', '秋招'] },
  { label: '补录', tokens: ['supplement', '补录', '补招'] },
  { label: '实习转正', tokens: ['internship_conversion', '实习转正'] }
];
const DEFAULT_NEED_FIELDS = [
  '岗位名称',
  '岗位详情深链URL',
  '城市',
  '公司层级',
  '批次/轮次',
  '发布时间',
  '样本量',
  '截图路径',
  '来源类型',
  '备注'
];
const DEFAULT_HOW_TO_SEARCH = [
  '先查企业官网/主管部门岗位详情页，锁定岗位定义与批次口径。',
  '再查BOSS直聘补齐城市/薪资/公司层级样本，同城同岗去重后统计。',
  '最后用小红书补面经/回忆题，必须记录帖子ID、截图时间戳并降权。'
];

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function writeJson(p, obj) {
  fs.writeFileSync(p, `${JSON.stringify(obj, null, 2)}\n`, 'utf8');
}

function uniqBy(arr, keyFn) {
  const seen = new Set();
  const out = [];
  for (const item of arr) {
    const key = keyFn(item);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}

function urlDepth(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return 0;
  try {
    const u = new URL(rawUrl);
    return u.pathname.split('/').filter(Boolean).length;
  } catch {
    return 0;
  }
}

function stageSet(items, roleId) {
  return new Set(
    (items || [])
      .filter((x) => x && x.role_id === roleId && typeof x.recruitment_stage === 'string')
      .map((x) => x.recruitment_stage)
  );
}

function normalizeStage(stage) {
  if (!stage || typeof stage !== 'string') return null;
  const lower = stage.toLowerCase();
  for (const item of STAGE_MAP) {
    if (item.tokens.some((token) => lower.includes(String(token).toLowerCase()))) {
      return item.label;
    }
  }
  return null;
}

function asPercent(numerator, denominator) {
  if (!denominator) return 0;
  return (numerator * 100) / denominator;
}

function pickSearchPlan(entry) {
  const roles = (((entry.dynamic || {})['岗位画像库'] || {}).items) || [];
  const roleGap = roles[0] && roles[0].platform_backfill_gap ? roles[0].platform_backfill_gap : {};
  const extItems = ((((entry.dynamic || {})['自定义扩展'] || {}).items) || []);
  let extPlan = null;
  for (const item of extItems) {
    if (item && item.x_platform_backfill_plan) {
      extPlan = item.x_platform_backfill_plan;
      break;
    }
    if (item && item.x_landing_progress_v155 && item.x_landing_progress_v155.where_to_search) {
      extPlan = item.x_landing_progress_v155;
      break;
    }
  }

  const whereToSearch =
    (extPlan && extPlan.where_to_search) ||
    {
      boss: {
        query: `${entry['行业名称']} 校招 核心岗`,
        url: 'https://www.zhipin.com/web/geek/job?query=校招'
      },
      xiaohongshu: {
        query: `${entry['行业名称']} 校招 面经 薪资`,
        url: 'https://www.xiaohongshu.com/search_result/?keyword=校招'
      },
      official_priority: `${entry['行业名称']}头部企业校招岗位详情页`,
      official_source_links: []
    };

  return {
    need_fields: (extPlan && extPlan.need_fields) || roleGap.required_info || DEFAULT_NEED_FIELDS,
    how_to_search: (extPlan && extPlan.how_to_search) || roleGap.how_to_search || DEFAULT_HOW_TO_SEARCH,
    where_to_search: whereToSearch,
    capture_rule:
      (extPlan && extPlan.capture_rule) ||
      roleGap.capture_rule ||
      '无法稳定获取BOSS/小红书样本时，保留pending_platform_verification槽位，并记录缺失字段、检索词、时间戳与责任人。'
  };
}

function pickDeepSourcePool(entry) {
  const sources = entry.sources || [];
  const deepSources = sources
    .filter((s) => s && typeof s.source_url === 'string' && urlDepth(s.source_url) >= 2)
    .map((s) => ({
      source_id: s.source_id || '',
      source_name: s.source_name || '',
      source_type: s.source_type || '',
      source_url: s.source_url,
      publish_date: s.publish_date || '',
      http_status: s.http_status || null
    }));

  const officialTypes = new Set([
    'company_official',
    'government',
    'public_recruitment',
    'exam_official',
    'association'
  ]);

  const official = uniqBy(
    deepSources.filter((s) => officialTypes.has(s.source_type)),
    (s) => s.source_url
  );
  const allUnique = uniqBy(deepSources, (s) => s.source_url);

  return {
    official: official.slice(0, 8),
    all_candidates: allUnique.slice(0, 12)
  };
}

function buildIndustryCard(entry) {
  const roles = (((entry.dynamic || {})['岗位画像库'] || {}).items) || [];
  const written = (((entry.dynamic || {})['笔试真题库'] || {}).items) || [];
  const interview = (((entry.dynamic || {})['面试真题库'] || {}).items) || [];
  const coreNames = (((entry.static || {})['招聘与成长'] || {})['岗位家族导航'] || {})['核心岗'] || [];

  const coreRoles = roles.filter((r) => coreNames.includes(r.role_name));
  const coreMissingProfiles = coreNames.filter(
    (name) => !coreRoles.some((r) => r.role_name === name)
  );

  const coreRoleGaps = [];
  let coreFull4Count = 0;
  for (const role of coreRoles) {
    const wSet = stageSet(written, role.role_id);
    const iSet = stageSet(interview, role.role_id);
    const wNormalized = new Set([...wSet].map(normalizeStage).filter(Boolean));
    const iNormalized = new Set([...iSet].map(normalizeStage).filter(Boolean));
    const missingWritten = STAGES.filter((s) => !wNormalized.has(s));
    const missingInterview = STAGES.filter((s) => !iNormalized.has(s));
    const isFull4 = wSet.size >= 4 && iSet.size >= 4;
    if (isFull4) coreFull4Count += 1;
    else {
      coreRoleGaps.push({
        role_id: role.role_id,
        role_name: role.role_name,
        written_stage_count: wSet.size,
        interview_stage_count: iSet.size,
        written_stages_raw: [...wSet],
        interview_stages_raw: [...iSet],
        missing_written_stages: missingWritten,
        missing_interview_stages: missingInterview,
        pending_info_slot: {
          status: 'pending_stage_question_backfill',
          need_fields: [
            '岗位名称',
            '批次/轮次',
            '题目原文或高质量回忆',
            '题目来源深链',
            '发布时间',
            '样本量',
            '截图路径'
          ]
        }
      });
    }
  }

  const deepPool = pickDeepSourcePool(entry);
  const deepLinkReady = roles.filter((r) => urlDepth((((r || {}).evidence || {}).source_url) || '') >= 2).length;
  const deepLinkGaps = roles
    .filter((r) => urlDepth((((r || {}).evidence || {}).source_url) || '') < 2)
    .map((r, idx) => ({
      role_id: r.role_id,
      role_name: r.role_name,
      current_source_url: (((r || {}).evidence || {}).source_url) || '',
      recommended_deep_sources: deepPool.official.length
        ? [deepPool.official[idx % deepPool.official.length]]
        : [],
      pending_info_slot: {
        status: 'pending_deep_link_backfill',
        need_fields: DEFAULT_NEED_FIELDS
      }
    }));

  const searchPlan = pickSearchPlan(entry);
  const core4Pct = asPercent(coreFull4Count, coreRoles.length);
  const deepLinkPct = asPercent(deepLinkReady, roles.length);
  const gapScore = ((100 - core4Pct) * 0.6) + ((100 - deepLinkPct) * 0.4);

  return {
    industry_id: entry.industry_id,
    industry_name: entry['行业名称'],
    baseline: {
      core_role_total: coreRoles.length,
      core_role_full4_count: coreFull4Count,
      core_role_full4_percent: Number(core4Pct.toFixed(2)),
      role_total: roles.length,
      role_deep_link_count: deepLinkReady,
      role_deep_link_percent: Number(deepLinkPct.toFixed(2))
    },
    gap_score: Number(gapScore.toFixed(2)),
    missing_core_role_profiles: coreMissingProfiles,
    core_role_stage_gaps: coreRoleGaps,
    role_deep_link_gaps: deepLinkGaps,
    source_pool: deepPool,
    platform_search_guide: searchPlan,
    priority_actions: [
      '先补核心岗缺失阶段题：优先补齐“提前批/主批/补录/实习转正”四阶段。',
      '再替换岗位画像来源为岗位详情深链：优先企业校招岗位页，其次官方公告页。',
      '平台样本受限时保留pending槽位，写清缺失字段、检索词、来源入口、责任人与截止时间。'
    ]
  };
}

function writeMarkdown(report, mdPath) {
  const lines = [];
  lines.push('# 核心岗4阶段覆盖与岗位深链率专项（v1.57.0）');
  lines.push('');
  lines.push(`生成时间：${report.generated_at}`);
  lines.push(`专项范围：${report.scope.length}个行业`);
  lines.push('');
  lines.push('## 基线快照');
  lines.push(
    `- 全库核心岗4阶段覆盖：${report.baseline_summary.overall.core_role_full4_percent.toFixed(2)}%`
  );
  lines.push(
    `- 全库岗位深链率：${report.baseline_summary.overall.role_deep_link_percent.toFixed(2)}%`
  );
  lines.push(
    `- 本专项核心岗4阶段覆盖：${report.baseline_summary.scope.core_role_full4_percent.toFixed(2)}%`
  );
  lines.push(
    `- 本专项岗位深链率：${report.baseline_summary.scope.role_deep_link_percent.toFixed(2)}%`
  );
  lines.push('');
  lines.push('## 专项目标');
  lines.push(`- 核心岗4阶段覆盖目标：${report.targets.scope_core_role_four_stage_min_percent}%`);
  lines.push(`- 岗位深链率目标：${report.targets.scope_role_profile_deep_link_min_percent}%`);
  lines.push('- 专项口径：先补核心岗，再补全角色深链；平台受限必须留待补槽位。');
  lines.push('');
  lines.push('## 行业清单（按缺口优先级）');

  report.scope.forEach((item, idx) => {
    lines.push('');
    lines.push(`### ${idx + 1}. ${item.industry_name}（${item.industry_id}）`);
    lines.push(
      `- 当前核心岗4阶段：${item.baseline.core_role_full4_count}/${item.baseline.core_role_total}（${item.baseline.core_role_full4_percent.toFixed(2)}%）`
    );
    lines.push(
      `- 当前岗位深链：${item.baseline.role_deep_link_count}/${item.baseline.role_total}（${item.baseline.role_deep_link_percent.toFixed(2)}%）`
    );
    if (item.missing_core_role_profiles.length) {
      lines.push(`- 核心岗画像缺失：${item.missing_core_role_profiles.join('、')}`);
    }
    lines.push(`- 核心岗阶段待补角色数：${item.core_role_stage_gaps.length}`);
    lines.push(`- 岗位深链待补角色数：${item.role_deep_link_gaps.length}`);
    lines.push('- 待补字段：');
    item.platform_search_guide.need_fields.forEach((f) => {
      lines.push(`  - ${f}`);
    });
    lines.push('- 如何搜索：');
    item.platform_search_guide.how_to_search.forEach((s) => {
      lines.push(`  - ${s}`);
    });
    const w = item.platform_search_guide.where_to_search || {};
    lines.push('- 从哪里搜索：');
    if (w.boss) {
      lines.push(`  - BOSS：${w.boss.query || ''}（${w.boss.url || ''}）`);
    }
    if (w.xiaohongshu) {
      lines.push(`  - 小红书：${w.xiaohongshu.query || ''}（${w.xiaohongshu.url || ''}）`);
    }
    if (w.official_priority) {
      lines.push(`  - 官方优先：${w.official_priority}`);
    }
    if (Array.isArray(w.official_source_links) && w.official_source_links.length) {
      lines.push(`  - 官方入口：${w.official_source_links.join('；')}`);
    }
    lines.push(`- 受限处理：${item.platform_search_guide.capture_rule}`);
  });

  lines.push('');
  lines.push('## 信息源优先级');
  lines.push('- L1 官方与企业岗位详情：教育部、人社部、NCSS、行业主管部门、企业校招岗位详情页。');
  lines.push('- L2 平台与研究：BOSS、智联、前程无忧、猎聘（用于城市/薪资/岗位分布交叉验证）。');
  lines.push('- L3 题库与社区：牛客、小红书、论坛（用于扩题，结论需降权并留证）。');

  fs.writeFileSync(mdPath, `${lines.join('\n')}\n`, 'utf8');
}

function main() {
  const data = readJson(DATA_PATH);
  const specialCfg = (((data['治理配置'] || {})['下一批次专项_v157_core4_deeplink']) || {});
  const scopeIds = specialCfg.scope_industry_ids || DEFAULT_SCOPE;

  const allEntries = data['行业词条'] || [];
  const entryMap = new Map(allEntries.map((e) => [e.industry_id, e]));
  const scopeEntries = scopeIds.map((id) => entryMap.get(id)).filter(Boolean);

  const scopeCards = scopeEntries.map(buildIndustryCard).sort((a, b) => b.gap_score - a.gap_score);
  const allCards = allEntries.map(buildIndustryCard);

  function summary(cards) {
    const coreTotal = cards.reduce((s, x) => s + x.baseline.core_role_total, 0);
    const coreFull = cards.reduce((s, x) => s + x.baseline.core_role_full4_count, 0);
    const roleTotal = cards.reduce((s, x) => s + x.baseline.role_total, 0);
    const deep = cards.reduce((s, x) => s + x.baseline.role_deep_link_count, 0);
    return {
      core_role_total: coreTotal,
      core_role_full4_count: coreFull,
      core_role_full4_percent: asPercent(coreFull, coreTotal),
      role_total: roleTotal,
      role_deep_link_count: deep,
      role_deep_link_percent: asPercent(deep, roleTotal)
    };
  }

  const report = {
    special_version: VERSION,
    generated_at: new Date().toISOString(),
    based_on_data_version: (((data['文档元数据'] || {})['版本']) || ''),
    focus_metrics: ['core_role_four_stage_coverage', 'role_profile_deep_link_rate'],
    targets: {
      scope_core_role_four_stage_min_percent:
        specialCfg.targets?.scope_core_role_four_stage_min_percent || 85,
      scope_role_profile_deep_link_min_percent:
        specialCfg.targets?.scope_role_profile_deep_link_min_percent || 60,
      stage_list: STAGES,
      gate_mode: specialCfg.gate_mode || 'report_only'
    },
    baseline_summary: {
      overall: summary(allCards),
      scope: summary(scopeCards)
    },
    scope: scopeCards,
    pending_slot_rule: {
      when_to_keep_pending:
        '平台限制、链接不可达、样本量不足、字段缺失（城市/发布时间/批次/截图）时必须保留pending。',
      minimum_fields: DEFAULT_NEED_FIELDS,
      minimum_search_steps: DEFAULT_HOW_TO_SEARCH
    }
  };

  const base = `core4_deeplink_special_${DATE_TAG}`;
  const jsonPath = path.join(REPORT_DIR, `${base}.json`);
  const mdPath = path.join(REPORT_DIR, `${base}.md`);
  const latestJson = path.join(REPORT_DIR, 'core4_deeplink_special_latest.json');
  const latestMd = path.join(REPORT_DIR, 'core4_deeplink_special_latest.md');

  fs.mkdirSync(REPORT_DIR, { recursive: true });
  writeJson(jsonPath, report);
  fs.copyFileSync(jsonPath, latestJson);
  writeMarkdown(report, mdPath);
  fs.copyFileSync(mdPath, latestMd);

  console.log(`Generated ${path.relative(ROOT, jsonPath)}`);
  console.log(`Generated ${path.relative(ROOT, mdPath)}`);
  console.log(`Updated ${path.relative(ROOT, latestJson)}`);
  console.log(`Updated ${path.relative(ROOT, latestMd)}`);
}

main();
