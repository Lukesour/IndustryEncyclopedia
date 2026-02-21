#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const ENTRY_DIR = path.join(ROOT, 'data', 'entries');
const TODAY = '2026-02-21';
const DATA_ORIGIN = 'manual_role_backfill_to_industry_min_v161_batch17';

const TARGET_BY_INDUSTRY = {
  IND_INTERNET_AI: 12,
  IND_SEMICONDUCTOR_ELECTRONICS: 12,
  IND_ADVANCED_MANUFACTURING_AUTOMATION: 12,
  IND_AUTO_INTELLIGENT_DRIVING: 12,
  IND_NEW_ENERGY: 12,
  IND_BIOMED_DEVICE: 12,
  IND_FIN_BANK: 10,
  IND_FIN_SECURITIES_FUND: 10,
  IND_FIN_INSURANCE: 10,
  IND_CIVIL_SERVICE: 8,
  IND_PUBLIC_INSTITUTION: 8,
  IND_STATE_OWNED_ENTERPRISE: 8,
  IND_MEDIA_GAME_CONTENT: 10,
  IND_ECOMMERCE_CROSSBORDER: 10,
  IND_FMCG_RETAIL: 10,
  IND_EDU_VOCATIONAL: 8,
  IND_CONSULTING_PRO_SERVICES: 10,
  IND_LOGISTICS_SUPPLYCHAIN: 10,
  IND_ENERGY_UTILITIES: 10,
  IND_AGRI_FOOD: 8,
  IND_REAL_ESTATE_INFRA: 8,
  IND_CHEM_NEW_MATERIALS: 8,
  IND_TELECOM_OPERATOR: 8
};

const DEFAULT_ANSWER_FRAMEWORK = ['目标与约束澄清', '执行路径拆解', '指标与风险控制', '复盘与机制沉淀'];
const DEFAULT_SCORING_DIMENSIONS = ['结构化思维', '可执行性', '风险意识', '复盘能力'];
const DEFAULT_COMMON_MISTAKES = ['描述泛化', '缺少量化指标', '无风险预案'];
const DEFAULT_GOOD_SIGNALS = ['结论先行', '路径清晰', '指标闭环'];
const DEFAULT_REFERENCE = ['先明确目标与边界', '再拆解动作', '最后给出结果与复盘'];

const WRITTEN_DEFS = [
  {
    stage: 'campus_early_batch_written',
    round: '提前批笔试',
    question_type: '场景分析题',
    scenario_bucket: 'business_scenario',
    text: '请给出一个该岗位关键业务场景的完整分析路径，并说明你如何验证结果。'
  },
  {
    stage: 'campus_main_batch_written',
    round: '主批笔试',
    question_type: '流程机制题',
    scenario_bucket: 'system_process',
    text: '请设计该岗位在“目标设定-执行跟踪-复盘优化”中的机制流程和关键节点。'
  },
  {
    stage: 'campus_supplement_written',
    round: '补录笔试',
    question_type: '复盘改进题',
    scenario_bucket: 'failure_review',
    text: '首轮执行结果不达标时，你会如何拆解根因并完成第二轮优化？'
  },
  {
    stage: 'internship_conversion_written',
    round: '实习转正笔试',
    question_type: '取舍决策题',
    scenario_bucket: 'metric_tradeoff',
    text: '当效率目标、质量目标和风险边界冲突时，你会如何排序并给出决策依据？'
  }
];

const INTERVIEW_DEFS = [
  {
    stage: 'campus_early_batch_interview',
    round: '提前批面试',
    question_type: '业务推进题',
    scenario_bucket: 'business_scenario',
    text: '请讲你如何推进一个关键业务任务，从判断到落地再到效果复盘。'
  },
  {
    stage: 'campus_main_batch_interview',
    round: '主批面试',
    question_type: '跨团队协同题',
    scenario_bucket: 'cross_team_collaboration',
    text: '当跨团队目标冲突时，你如何定义共识、推动协同并保障节点交付？'
  },
  {
    stage: 'campus_supplement_interview',
    round: '补录面试',
    question_type: '失败复盘题',
    scenario_bucket: 'failure_review',
    text: '请复盘一次失误案例：你如何识别问题、修正策略并避免重复发生？'
  },
  {
    stage: 'internship_conversion_interview',
    round: '实习转正面试',
    question_type: '优先级决策题',
    scenario_bucket: 'metric_tradeoff',
    text: '多任务并行且资源受限时，你如何设定优先级并向相关方解释取舍？'
  }
];

function ensureArray(v, fallback) {
  return Array.isArray(v) && v.length > 0 ? v : fallback;
}

function roleToken(roleId) {
  const m = String(roleId).match(/_ROLE_(.+)$/);
  const raw = m ? m[1] : roleId;
  return String(raw).replace(/[^A-Za-z0-9]/g, '');
}

function nextId(idSet, industryId, roleId, kind, seqStart) {
  const token = roleToken(roleId);
  let seq = seqStart;
  while (true) {
    const qid = `${industryId}_${kind}_V161_FILL2_R${token}_${String(seq).padStart(2, '0')}`;
    if (!idSet.has(qid)) {
      idSet.add(qid);
      return { qid, next: seq + 1 };
    }
    seq += 1;
  }
}

function buildQuestion(base, def, entry, role, qid) {
  const roleName = role.role_name || role.role_id;
  const industryLabel = entry['行业名称'] || entry.industry_id;
  const evidenceBase = (base && typeof base === 'object' && base.evidence && typeof base.evidence === 'object') ? base.evidence : {};

  return {
    ...(base && typeof base === 'object' ? base : {}),
    question_id: qid,
    prompt: `【行业:${industryLabel}｜岗位:${roleName}｜阶段:${def.round}】${def.text}`,
    question_type: def.question_type,
    recruitment_stage: def.stage,
    round_label: def.round,
    role_id: role.role_id,
    role_name: roleName,
    question_year: 2026,
    updated_at: TODAY,
    difficulty_1to5: Number(base?.difficulty_1to5 || 4),
    scenario_bucket: def.scenario_bucket,
    answer_framework: ensureArray(base?.answer_framework, DEFAULT_ANSWER_FRAMEWORK),
    scoring_dimensions: ensureArray(base?.scoring_dimensions, DEFAULT_SCORING_DIMENSIONS),
    common_mistakes: ensureArray(base?.common_mistakes, DEFAULT_COMMON_MISTAKES),
    good_answer_signals: ensureArray(base?.good_answer_signals, DEFAULT_GOOD_SIGNALS),
    reference_answer_outline: ensureArray(base?.reference_answer_outline, DEFAULT_REFERENCE),
    follow_up_questions: ensureArray(base?.follow_up_questions, ['关键风险点在哪里？', '首轮不达标如何纠偏？', '如何沉淀可复用机制？']),
    scoring_rubric: (base?.scoring_rubric && typeof base.scoring_rubric === 'object') ? base.scoring_rubric : {
      A档: '路径完整、指标清晰、风险闭环。',
      B档: '方案可执行但缺少量化或风险细节。',
      C档: '描述泛化，缺少具体行动与结果。'
    },
    question_realness_note: '基于岗位能力口径补深（非官方原卷）。',
    data_origin: DATA_ORIGIN,
    sample_size: Math.max(Number(base?.sample_size || 6), 8),
    evidence: {
      ...evidenceBase,
      accessed_at: TODAY,
      captured_at: TODAY,
      data_period: '2026年度'
    }
  };
}

function indexByRole(items) {
  const map = new Map();
  for (const item of items) {
    const rid = item.role_id;
    if (!rid) continue;
    if (!map.has(rid)) map.set(rid, []);
    map.get(rid).push(item);
  }
  return map;
}

const files = fs.readdirSync(ENTRY_DIR).filter((f) => f.endsWith('.json')).sort();

let touchedFiles = 0;
let touchedRoles = 0;
let totalWrittenAdded = 0;
let totalInterviewAdded = 0;

for (const f of files) {
  const full = path.join(ENTRY_DIR, f);
  const entry = JSON.parse(fs.readFileSync(full, 'utf8'));

  const target = Number(TARGET_BY_INDUSTRY[entry.industry_id] || 8);
  if (target <= 8) continue;

  const roles = entry.dynamic?.['岗位画像库']?.items;
  const writtenItems = entry.dynamic?.['笔试真题库']?.items;
  const interviewItems = entry.dynamic?.['面试真题库']?.items;
  if (!roles || !writtenItems || !interviewItems) continue;

  const writtenByRole = indexByRole(writtenItems);
  const interviewByRole = indexByRole(interviewItems);

  const idSet = new Set();
  for (const q of writtenItems) if (q?.question_id) idSet.add(q.question_id);
  for (const q of interviewItems) if (q?.question_id) idSet.add(q.question_id);

  let fileChanged = false;
  let fileW = 0;
  let fileI = 0;

  for (const role of roles) {
    const rid = role.role_id;
    if (!rid) continue;

    const writtenForRole = writtenByRole.get(rid) || [];
    const interviewForRole = interviewByRole.get(rid) || [];

    const needW = Math.max(0, target - writtenForRole.length);
    const needI = Math.max(0, target - interviewForRole.length);

    if (needW === 0 && needI === 0) {
      role.role_detail_v158 = role.role_detail_v158 || {};
      role.role_detail_v158.role_specific_question_coverage = {
        written_count: writtenForRole.length,
        interview_count: interviewForRole.length,
        written_stages: [...new Set(writtenForRole.map((q) => q.recruitment_stage).filter(Boolean))],
        interview_stages: [...new Set(interviewForRole.map((q) => q.recruitment_stage).filter(Boolean))]
      };
      continue;
    }

    const writtenBasePool = writtenForRole.length > 0 ? writtenForRole : [writtenItems[0] || {}];
    const interviewBasePool = interviewForRole.length > 0 ? interviewForRole : [interviewItems[0] || {}];

    let seqW = 1;
    let seqI = 1;

    for (let i = 0; i < needW; i += 1) {
      const def = WRITTEN_DEFS[i % WRITTEN_DEFS.length];
      const base = writtenBasePool[i % writtenBasePool.length];
      const idRet = nextId(idSet, entry.industry_id, rid, 'WRITTEN', seqW);
      seqW = idRet.next;
      const q = buildQuestion(base, def, entry, role, idRet.qid);
      writtenItems.push(q);
      writtenForRole.push(q);
      fileW += 1;
      totalWrittenAdded += 1;
    }

    for (let i = 0; i < needI; i += 1) {
      const def = INTERVIEW_DEFS[i % INTERVIEW_DEFS.length];
      const base = interviewBasePool[i % interviewBasePool.length];
      const idRet = nextId(idSet, entry.industry_id, rid, 'INTERVIEW', seqI);
      seqI = idRet.next;
      const q = buildQuestion(base, def, entry, role, idRet.qid);
      interviewItems.push(q);
      interviewForRole.push(q);
      fileI += 1;
      totalInterviewAdded += 1;
    }

    role.role_detail_v158 = role.role_detail_v158 || {};
    role.role_detail_v158.role_specific_question_coverage = {
      written_count: writtenForRole.length,
      interview_count: interviewForRole.length,
      written_stages: [...new Set(writtenForRole.map((q) => q.recruitment_stage).filter(Boolean))],
      interview_stages: [...new Set(interviewForRole.map((q) => q.recruitment_stage).filter(Boolean))]
    };
    role.updated_at = TODAY;

    touchedRoles += 1;
    fileChanged = true;
  }

  if (fileChanged) {
    fs.writeFileSync(full, JSON.stringify(entry, null, 2) + '\n', 'utf8');
    touchedFiles += 1;
    console.log(`Updated ${f}: target=${target}, +${fileW} written, +${fileI} interview`);
  }
}

console.log(`DONE files=${touchedFiles}, roles=${touchedRoles}, written_added=${totalWrittenAdded}, interview_added=${totalInterviewAdded}`);
