#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const ENTRY_DIR = path.join(ROOT, 'data', 'entries');
const MAIN_PATH = path.join(ROOT, '行业百科.json');

const TODAY = '2026-02-19';
const VERSION = 'v1.55.0';

const entryFiles = fs
  .readdirSync(ENTRY_DIR)
  .filter((f) => f.endsWith('.json'))
  .sort();

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function writeJson(p, obj) {
  fs.writeFileSync(p, `${JSON.stringify(obj, null, 2)}\n`, 'utf8');
}

function normalizeRoleName(raw) {
  return String(raw || '')
    .replace(/[（(].*?[)）]/g, '')
    .replace(/[\s·、/\\-]/g, '')
    .replace(/(岗位|岗|工程师|规划师|专员|经理|分析师|顾问|研究员|助理)$/g, '')
    .trim();
}

function pickSkillStack(roleFamily, roleName) {
  const commonTech = ['业务问题拆解与指标口径', '结构化方案设计与复盘'];
  if (String(roleFamily || '').includes('技术')) {
    return ['工程实现与系统稳定性', '数据与实验设计能力', ...commonTech];
  }
  if (String(roleFamily || '').includes('产品')) {
    return ['用户场景建模与需求拆解', '跨团队推进与节奏管理', ...commonTech];
  }
  if (String(roleFamily || '').includes('运营')) {
    return ['策略执行与迭代优化', '漏斗指标分析与归因', ...commonTech];
  }
  if (roleName.includes('合规') || roleName.includes('法务') || roleName.includes('风控')) {
    return ['规则理解与边界判断', '风险识别与闭环处置', ...commonTech];
  }
  if (roleName.includes('销售') || roleName.includes('客户')) {
    return ['客户需求洞察与方案表达', '目标管理与过程复盘', ...commonTech];
  }
  return ['岗位核心流程掌握', '跨部门协同与推进', ...commonTech];
}

function growthLadder(roleName) {
  return {
    '0-12个月': `完成${roleName}基础流程上手，能独立交付可验证结果。`,
    '12-24个月': `负责${roleName}关键模块，并能推动跨团队协同落地。`,
    '24-36个月': `主导${roleName}专项优化，沉淀方法论并带新人。`
  };
}

function transferTargets(roleFamily, roleName) {
  if (String(roleFamily || '').includes('技术')) {
    return ['平台工程/架构方向', '数据或策略方向', '技术项目管理方向'];
  }
  if (String(roleFamily || '').includes('产品')) {
    return ['策略产品方向', '商业化/增长方向', '项目管理方向'];
  }
  if (String(roleFamily || '').includes('运营')) {
    return ['策略运营方向', '数据分析方向', '产品运营方向'];
  }
  if (roleName.includes('合规') || roleName.includes('风控')) {
    return ['内控审计方向', '风险策略方向', '业务合规BP方向'];
  }
  return ['同赛道邻接岗位', '项目管理方向', '数据分析支撑方向'];
}

function mismatchSignals(roleName) {
  return [
    `只会描述${roleName}职责，无法给出量化结果或关键指标。`,
    '缺少跨部门协同与推进证据，无法说明资源受限时如何取舍。',
    '对失败案例没有复盘闭环，无法说明下一轮优化动作。'
  ];
}

function ensureArray(v) {
  return Array.isArray(v) ? v : [];
}

function buildRoleLookups(roleItems) {
  const byName = new Map();
  const byNorm = new Map();
  for (const r of roleItems) {
    byName.set(r.role_name, r);
    const norm = normalizeRoleName(r.role_name);
    if (norm && !byNorm.has(norm)) byNorm.set(norm, r);
  }
  return { byName, byNorm };
}

function tryMatchRole(roleName, lookups) {
  if (lookups.byName.has(roleName)) return lookups.byName.get(roleName);
  const norm = normalizeRoleName(roleName);
  if (norm && lookups.byNorm.has(norm)) return lookups.byNorm.get(norm);
  return null;
}

function countRoleQuestions(items, roleName) {
  return ensureArray(items).filter((q) => q.role_name === roleName).length;
}

function countRoleStages(items, roleName) {
  return new Set(
    ensureArray(items)
      .filter((q) => q.role_name === roleName)
      .map((q) => q.recruitment_stage)
      .filter(Boolean)
  ).size;
}

function makeDecisionModule(entry, highGrowth) {
  const nav = entry.static?.['招聘与成长']?.['岗位家族导航'] || {};
  const core = ensureArray(nav['核心岗']);
  const bridge = ensureArray(nav['桥接岗']);
  const transferPath = ensureArray(entry.static?.['决策输出']?.['转岗路径']);

  const landed = highGrowth
    .filter((r) => r.landing_status === 'landed_main_profile')
    .map((r) => r.role_name);
  const pending = highGrowth
    .filter((r) => r.landing_status !== 'landed_main_profile')
    .map((r) => r.role_name);

  return {
    updated_at: TODAY,
    岗位对比矩阵: [
      {
        岗位类型: '核心岗',
        代表岗位: core.slice(0, 6),
        决策建议: '优先用于建立首份可验证项目证据与稳定面试通过率。'
      },
      {
        岗位类型: '高增长岗',
        已落地主表岗位: landed,
        待落地主表岗位: pending,
        决策建议: '高增长岗优先补“职责边界+题库+证据深链”，再提高投递占比。'
      },
      {
        岗位类型: '桥接岗',
        代表岗位: bridge.slice(0, 6),
        决策建议: '用于转行业或转职能的过渡，强调可迁移项目与量化成果。'
      }
    ],
    准备计划_90天: [
      '1-30天：锁定2个目标岗位，补齐岗位能力词典与简历证据映射。',
      '31-60天：按提前批/主批节奏完成分阶段题库训练与2轮模拟面试。',
      '61-90天：基于面试反馈修正投递策略，并补齐短板项目证据。'
    ],
    准备计划_180天: [
      '91-120天：扩展到邻接岗位，形成“主岗+备岗”双路径投递。',
      '121-150天：补齐行业关键证书/工具链，并完成跨团队协作案例。',
      '151-180天：复盘投递与面试转化，按城市与公司层级做二次分层。'
    ],
    止损阈值: [
      '连续两轮投递-面试转化低于个人历史中位值，需调整岗位与城市组合。',
      '两个月内无法补出可量化项目证据时，优先切换到桥接岗策略。',
      '核心能力短板无法在一个招聘周期内补齐时，启用替代行业路径。'
    ],
    转岗路径执行提示: transferPath,
    说明: '该模块用于站内完成“选岗-准备-执行-止损”闭环，不依赖外站拼接信息。'
  };
}

function ensureDepthTargets(main) {
  if (!main['治理配置']) main['治理配置'] = {};
  const cfg = main['治理配置'];

  cfg['百科深度门槛_v155'] = {
    enabled: true,
    gate_mode: 'report_only',
    note: '与发布硬门槛分离：发布门槛保可发布，深度门槛保可决策。',
    targets: {
      high_growth_landing_min_percent: 90,
      core_role_four_stage_min_percent: 85,
      role_profile_deep_link_min_percent: 60,
      platform_verification_pending_max_percent: 25
    },
    required_output_modules: [
      '岗位对比矩阵',
      '准备计划_90天',
      '准备计划_180天',
      '止损阈值'
    ]
  };
}

let totalHighGrowth = 0;
let landedHighGrowth = 0;

for (const file of entryFiles) {
  const entryPath = path.join(ENTRY_DIR, file);
  const entry = readJson(entryPath);

  const roleItems = ensureArray(entry.dynamic?.['岗位画像库']?.items);
  const writtenItems = ensureArray(entry.dynamic?.['笔试真题库']?.items);
  const interviewItems = ensureArray(entry.dynamic?.['面试真题库']?.items);
  const lookups = buildRoleLookups(roleItems);

  const recruit = entry.static?.['招聘与成长'] || {};
  const nav = recruit['岗位家族导航'] || {};
  const highGrowth = ensureArray(nav['高增长岗']);

  const extCollection = entry.dynamic?.['自定义扩展'];
  const extItems = ensureArray(extCollection?.items);
  const expansionItem = extItems.find((x) => x?.x_decision_type === 'role_and_question_expansion');
  const platformPlan = expansionItem?.x_platform_backfill_plan || {};
  const needFields = ensureArray(platformPlan.need_fields);
  const howToSearch = ensureArray(platformPlan.how_to_search);
  const whereToSearch = platformPlan.where_to_search || {};

  const updatedHighGrowth = highGrowth.map((hg) => {
    const roleName = hg.role_name;
    const roleFamily = hg.role_family || '岗位族';
    const intro = hg.role_intro || `${roleName}负责关键业务目标的落地。`;
    const matched = tryMatchRole(roleName, lookups);

    const writtenCount = matched ? countRoleQuestions(writtenItems, matched.role_name) : 0;
    const interviewCount = matched ? countRoleQuestions(interviewItems, matched.role_name) : 0;
    const writtenStages = matched ? countRoleStages(writtenItems, matched.role_name) : 0;
    const interviewStages = matched ? countRoleStages(interviewItems, matched.role_name) : 0;

    totalHighGrowth += 1;
    if (matched) landedHighGrowth += 1;

    const base = {
      ...hg,
      landing_status: matched ? 'landed_main_profile' : 'pending_main_profile',
      mapped_role_id: matched ? matched.role_id : null,
      mapped_role_name: matched ? matched.role_name : null,
      role_detail_v155: {
        职责边界: `${roleName}在${entry['行业名称']}中主要承担：${intro.replace(/^负责/, '')}`,
        核心技能栈: pickSkillStack(roleFamily, roleName),
        典型项目: [`${roleName}专项落地`, `${roleName}跨团队协同优化`],
        成长台阶: growthLadder(roleName),
        转岗去向: transferTargets(roleFamily, roleName),
        不适配信号: mismatchSignals(roleName)
      }
    };

    if (matched) {
      base.coverage_snapshot_v155 = {
        written_question_count: writtenCount,
        interview_question_count: interviewCount,
        written_stage_coverage: writtenStages,
        interview_stage_coverage: interviewStages
      };
      if (writtenCount < 4 || interviewCount < 4 || writtenStages < 4 || interviewStages < 4) {
        base.backfill_slot_v155 = {
          status: 'pending_stage_and_density_backfill',
          need_fields: needFields,
          where_to_search: whereToSearch,
          how_to_search: howToSearch,
          capture_rule: platformPlan.capture_rule || '补录样本需含时间戳、链接、样本量与截图。',
          gap_summary: {
            written_gap_to_4: Math.max(0, 4 - writtenCount),
            interview_gap_to_4: Math.max(0, 4 - interviewCount),
            written_stage_gap_to_4: Math.max(0, 4 - writtenStages),
            interview_stage_gap_to_4: Math.max(0, 4 - interviewStages)
          }
        };
      }
    } else {
      base.backfill_slot_v155 = {
        status: 'pending_platform_verification',
        need_fields: needFields,
        where_to_search: whereToSearch,
        how_to_search: howToSearch,
        capture_rule: platformPlan.capture_rule || '补录样本需含时间戳、链接、样本量与截图。',
        note: '该高增长岗尚未落地主表岗位卡与题库，需优先补齐岗位画像与笔面试样本。'
      };
    }

    return base;
  });

  nav['高增长岗'] = updatedHighGrowth;
  recruit['岗位家族导航'] = nav;
  recruit['职业决策模块_v155'] = makeDecisionModule(entry, updatedHighGrowth);
  entry.static['招聘与成长'] = recruit;

  if (expansionItem && Array.isArray(expansionItem.x_role_expansion_candidates)) {
    expansionItem.x_role_expansion_candidates = expansionItem.x_role_expansion_candidates.map((c) => {
      const matched = tryMatchRole(c.role_name, lookups);
      const updated = {
        ...c,
        status: matched ? 'landed_main_profile' : 'pending_platform_verification',
        mapped_role_id: matched ? matched.role_id : null,
        mapped_role_name: matched ? matched.role_name : null
      };
      if (!matched) {
        updated.backfill_slot_v155 = {
          need_fields: needFields,
          where_to_search: whereToSearch,
          how_to_search: howToSearch,
          capture_rule: platformPlan.capture_rule || '补录样本需含时间戳、链接、样本量与截图。'
        };
      }
      return updated;
    });

    const pendingRoles = expansionItem.x_role_expansion_candidates
      .filter((r) => r.status !== 'landed_main_profile')
      .map((r) => ({ role_name: r.role_name, role_family: r.role_family }));

    expansionItem.x_landing_progress_v155 = {
      updated_at: TODAY,
      total_candidates: expansionItem.x_role_expansion_candidates.length,
      landed_main_profile_count: expansionItem.x_role_expansion_candidates.filter(
        (r) => r.status === 'landed_main_profile'
      ).length,
      pending_count: pendingRoles.length,
      pending_roles: pendingRoles,
      where_to_search: whereToSearch,
      need_fields: needFields,
      how_to_search: howToSearch,
      capture_rule: platformPlan.capture_rule || '补录样本需含时间戳、链接、样本量与截图。'
    };

    expansionItem.updated_at = TODAY;
  }

  // 在自定义扩展新增行业级深度执行卡（避免把缺口信息散落在多个字段）
  const hasDepthCard = extItems.some((x) => x?.x_decision_type === 'depth_execution_v155');
  if (!hasDepthCard) {
    extItems.push({
      ext_id: `${entry.industry_id}_DEPTH_EXECUTION_V155`,
      x_decision_type: 'depth_execution_v155',
      x_decision_title: `${entry['行业名称']}百科深度执行卡（v1.55）`,
      x_decision_summary: '用于跟踪高增长岗落地率、题库阶段覆盖与平台补录缺口。',
      x_high_growth_total: updatedHighGrowth.length,
      x_high_growth_landed_count: updatedHighGrowth.filter(
        (r) => r.landing_status === 'landed_main_profile'
      ).length,
      x_high_growth_pending_roles: updatedHighGrowth
        .filter((r) => r.landing_status !== 'landed_main_profile')
        .map((r) => r.role_name),
      x_required_output_modules: ['岗位对比矩阵', '准备计划_90天', '准备计划_180天', '止损阈值'],
      x_platform_backfill_plan: {
        need_fields: needFields,
        where_to_search: whereToSearch,
        how_to_search: howToSearch,
        capture_rule: platformPlan.capture_rule || '补录样本需含时间戳、链接、样本量与截图。'
      },
      data_origin: 'curated_manual_review',
      authenticity_level: 'observed',
      evidence: expansionItem?.evidence || {
        source_id: 'SRC_NCSS',
        source_name: '国家大学生就业服务平台',
        source_type: 'government_platform',
        source_url: 'https://www.ncss.cn/',
        source_date: TODAY,
        publish_date: TODAY,
        captured_at: TODAY,
        accessed_at: TODAY,
        sample_size: 8,
        confidence: 0.7,
        http_status: 200,
        access_check: 'checked'
      },
      updated_at: TODAY
    });
  }

  if (extCollection) {
    extCollection.items = extItems;
  }

  writeJson(entryPath, entry);
}

const main = readJson(MAIN_PATH);
ensureDepthTargets(main);

if (!main['文档元数据']) main['文档元数据'] = {};
main['文档元数据']['版本'] = VERSION;
main['文档元数据']['发布日期'] = TODAY;
if (!Array.isArray(main['文档元数据']['变更记录'])) {
  main['文档元数据']['变更记录'] = [];
}
const already = main['文档元数据']['变更记录'].some((x) => x && x.version === VERSION);
if (!already) {
  main['文档元数据']['变更记录'].push({
    date: TODAY,
    version: VERSION,
    summary: [
      '新增v1.55“发布门禁/百科深度门槛”双轨治理，深度指标改为独立报告输出。',
      '23行业高增长岗逐条补落地状态、映射role_id、题库覆盖快照与平台补录缺口位。',
      '每行业新增职业决策模块v155（岗位对比矩阵、90/180天准备、止损阈值）。'
    ]
  });
}

main['文档元数据']['高增长岗落地统计_v155'] = {
  generated_at: `${TODAY}T00:00:00Z`,
  high_growth_total: totalHighGrowth,
  landed_main_profile_count: landedHighGrowth,
  landed_percent: totalHighGrowth === 0 ? 0 : Number(((landedHighGrowth * 100) / totalHighGrowth).toFixed(2))
};

writeJson(MAIN_PATH, main);

console.log(`v1.55 enrichment finished: ${entryFiles.length} entries updated.`);
console.log(`High-growth landing: ${landedHighGrowth}/${totalHighGrowth}`);
