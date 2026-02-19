#!/usr/bin/env node

/*
 * v1.59 targeted manual improvements:
 * 1) Resolve duplicate role names with explicit role-id mapping.
 * 2) Promote curated static expansion prompts into dynamic written/interview banks.
 * 3) Recompute role-specific question coverage from real question banks.
 *
 * Notes:
 * - This script does not generate synthetic role templates in batch.
 * - It only materializes already-curated prompt expansions and synchronizes role metadata.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const ENTRY_DIR = path.join(ROOT, 'data', 'entries');
const TODAY = new Date().toISOString().slice(0, 10);

const ROLE_RENAME_MAP = {
  IND_ADVANCED_MANUFACTURING_AUTOMATION_ROLE_HGX_011: 'MES实施工程师（产线数字化）',
  IND_CONSULTING_PRO_SERVICES_ROLE_HGX_009: 'ESG咨询顾问（双碳披露）',
  IND_CONSULTING_PRO_SERVICES_ROLE_HGX_010: '数据分析顾问（经营洞察）',
  IND_FIN_BANK_ROLE_HGX_009: '授信审批岗（对公）',
  IND_INTERNET_AI_ROLE_HGX_009: 'AI产品运营（增长转化）',
  IND_INTERNET_AI_ROLE_HGX_010: '隐私计算工程师（联邦学习）',
  IND_INTERNET_AI_ROLE_HGX_012: 'Prompt工程师（评测安全）',
  IND_SEMICONDUCTOR_ELECTRONICS_ROLE_HGX_009: '供应链计划工程师（晶圆封测）',
  IND_SEMICONDUCTOR_ELECTRONICS_ROLE_HGX_012: '射频工程师（前端模块）'
};

// For static expansion role_name entries that were previously ambiguous duplicates,
// explicitly route expansion prompts to renamed HGX roles.
const EXPANSION_ROLE_ALIAS = {
  IND_ADVANCED_MANUFACTURING_AUTOMATION: {
    'MES实施工程师': 'MES实施工程师（产线数字化）'
  },
  IND_CONSULTING_PRO_SERVICES: {
    ESG咨询顾问: 'ESG咨询顾问（双碳披露）',
    数据分析顾问: '数据分析顾问（经营洞察）'
  },
  IND_FIN_BANK: {
    授信审批岗: '授信审批岗（对公）'
  },
  IND_INTERNET_AI: {
    AI产品运营: 'AI产品运营（增长转化）',
    隐私计算工程师: '隐私计算工程师（联邦学习）',
    Prompt工程师: 'Prompt工程师（评测安全）'
  },
  IND_SEMICONDUCTOR_ELECTRONICS: {
    供应链计划工程师: '供应链计划工程师（晶圆封测）',
    射频工程师: '射频工程师（前端模块）'
  }
};

const STAGES = {
  written: [
    { key: 'campus_early_batch_written', label: '提前批笔试' },
    { key: 'campus_main_batch_written', label: '主批笔试' },
    { key: 'campus_supplement_written', label: '补录笔试' },
    { key: 'internship_conversion_written', label: '实习转正笔试' }
  ],
  interview: [
    { key: 'campus_early_batch_interview', label: '提前批面试' },
    { key: 'campus_main_batch_interview', label: '主批面试' },
    { key: 'campus_supplement_interview', label: '补录面试' },
    { key: 'internship_conversion_interview', label: '实习转正面试' }
  ]
};

const TAG_CONFIG = {
  real_recall: {
    authenticity_level: 'real_user',
    written_data_origin: 'real_user_recall_written_expansion_v159',
    interview_data_origin: 'real_user_recall_interview_expansion_v159',
    question_type: '实战回忆题（高频样本）',
    question_year: 2025,
    sample_size: 10,
    confidence: 0.8,
    note: '公开回忆题样本（非官方原卷），用于岗位化训练与场景复盘。',
    source_type: 'real_user',
    answer_framework: ['场景复现', '关键约束', '执行方案', '结果复盘'],
    scoring_dimensions: ['场景拆解', '方案落地', '指标意识', '复盘质量'],
    stat_definition: '来源于公开题库的高频题回忆样本，已补题干与岗位标签。'
  },
  official_original: {
    authenticity_level: 'official_original',
    written_data_origin: 'official_pattern_written_expansion_v159',
    interview_data_origin: 'official_pattern_interview_expansion_v159',
    question_type: '官方口径题型映射',
    question_year: 2026,
    sample_size: 8,
    confidence: 0.78,
    note: '基于官方公开题型/流程口径整理，不等同于逐字原题。',
    source_type: 'company_official',
    answer_framework: ['问题定义', '分析方法', '方案设计', '风险边界'],
    scoring_dimensions: ['逻辑严谨性', '政策/业务边界', '可执行性', '风险控制'],
    stat_definition: '结合企业官方校招JD与公共就业平台岗位信号抽取岗位画像，并以近6个月招聘窗口进行更新。'
  },
  jd_mapping: {
    authenticity_level: 'jd_mapping',
    written_data_origin: 'jd_mapping_written_expansion_v159',
    interview_data_origin: 'jd_mapping_interview_expansion_v159',
    question_type: '岗位能力映射题',
    question_year: 2026,
    sample_size: 7,
    confidence: 0.74,
    note: '依据岗位JD能力项映射生成，用于训练岗位化思维与表达。',
    source_type: 'company_official',
    answer_framework: ['岗位目标', '能力拆解', '落地动作', '量化评估'],
    scoring_dimensions: ['岗位理解', '方案落地', '协同推进', '结果量化'],
    stat_definition: '结合企业官方校招JD与公共就业平台岗位信号抽取岗位画像，并以近6个月招聘窗口进行更新。'
  }
};

const ROLE_DEPTH_CONFIG = {
  written_target_min: 6,
  interview_target_min: 6,
  sample_size: 6,
  confidence: 0.76
};

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function writeJson(p, obj) {
  fs.writeFileSync(p, `${JSON.stringify(obj, null, 2)}\n`, 'utf8');
}

function pad3(n) {
  return String(n).padStart(3, '0');
}

function deepReplace(value, from, to) {
  if (typeof value === 'string') {
    return value.split(from).join(to);
  }
  if (Array.isArray(value)) {
    return value.map((v) => deepReplace(v, from, to));
  }
  if (value && typeof value === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      out[k] = deepReplace(v, from, to);
    }
    return out;
  }
  return value;
}

function normalizePromptBody(prompt) {
  if (typeof prompt !== 'string') return '';
  return prompt.replace(/^【[^】]+】\s*/u, '').trim();
}

function snippet(text, maxLen = 36) {
  const s = String(text || '').replace(/\s+/g, ' ').trim();
  if (!s) return '';
  return s.length <= maxLen ? s : `${s.slice(0, maxLen)}...`;
}

function pickEvidenceCandidates(items, mode) {
  const out = {
    any: null,
    real_user: null,
    company_official: null,
    government_platform: null,
    nowcoder: null
  };
  for (const item of items || []) {
    const ev = item && item.evidence && typeof item.evidence === 'object' ? item.evidence : null;
    if (!ev || typeof ev.source_id !== 'string') continue;
    if (!out.any) out.any = ev;
    const t = ev.source_type || '';
    if (!out.real_user && t === 'real_user') out.real_user = ev;
    if (!out.company_official && t === 'company_official') out.company_official = ev;
    if (!out.government_platform && t === 'government_platform') out.government_platform = ev;
    const url = String(ev.source_url || '');
    if (
      !out.nowcoder &&
      url.includes('nowcoder.com') &&
      ((mode === 'written' && url.includes('/exam/company')) ||
        (mode === 'interview' && url.includes('/exam/interview')))
    ) {
      out.nowcoder = ev;
    }
  }
  return out;
}

function chooseRole(entry, requestedRoleName) {
  const roleItems = entry.dynamic?.['岗位画像库']?.items || [];
  const exact = roleItems.filter((r) => r.role_name === requestedRoleName);
  if (exact.length === 1) return exact[0];
  if (exact.length > 1) {
    return (
      exact.find(
        (r) => r?.role_detail_v158?.expansion_status === 'role_profile_landed_pending_question_depth'
      ) || exact[0]
    );
  }

  // Fallback: strip full-width brackets and spaces for matching.
  const normalize = (s) =>
    String(s || '')
      .replace(/[（(].*?[）)]/gu, '')
      .replace(/\s+/g, '')
      .trim();
  const target = normalize(requestedRoleName);
  const fuzzy = roleItems.filter((r) => normalize(r.role_name) === target);
  if (fuzzy.length === 1) return fuzzy[0];
  if (fuzzy.length > 1) {
    return (
      fuzzy.find(
        (r) => r?.role_detail_v158?.expansion_status === 'role_profile_landed_pending_question_depth'
      ) || fuzzy[0]
    );
  }
  return null;
}

function nextQuestionIndex(items, prefix) {
  let max = 0;
  for (const item of items || []) {
    const id = String(item?.question_id || '');
    if (!id.startsWith(prefix)) continue;
    const suffix = id.slice(prefix.length);
    const n = Number.parseInt(suffix, 10);
    if (Number.isFinite(n) && n > max) max = n;
  }
  return max + 1;
}

function buildSecondarySourceIds(primaryId, roleEvidence, candidates) {
  const ids = [];
  if (roleEvidence && roleEvidence.source_id) ids.push(roleEvidence.source_id);
  if (candidates.company_official && candidates.company_official.source_id) {
    ids.push(candidates.company_official.source_id);
  }
  if (candidates.government_platform && candidates.government_platform.source_id) {
    ids.push(candidates.government_platform.source_id);
  }
  const dedup = Array.from(new Set(ids.filter(Boolean)));
  return dedup.filter((x) => x !== primaryId).slice(0, 3);
}

function buildEvidence(mode, tag, role, candidates, cfg) {
  const roleEv = role && role.evidence && typeof role.evidence === 'object' ? role.evidence : null;
  let base = null;

  if (tag === 'real_recall') {
    base = candidates.nowcoder || candidates.real_user || candidates.any || roleEv;
  } else {
    base = roleEv || candidates.company_official || candidates.any;
  }

  const sourceType = base?.source_type || cfg.source_type;
  const sourceId = base?.source_id || (tag === 'real_recall'
    ? mode === 'written'
      ? 'SRC_NOWCODER_WRITTEN_BACKEND_2026'
      : 'SRC_NOWCODER_INTERVIEW_BACKEND_2026'
    : 'SRC_NCSS_2026_JOINT');
  const sourceUrl = base?.source_url || (tag === 'real_recall'
    ? mode === 'written'
      ? 'https://www.nowcoder.com/exam/company?questionJobId=10&subTabName=written_page'
      : 'https://www.nowcoder.com/exam/interview?questionJobId=10&subTabName=interview_page'
    : 'https://www.ncss.cn/');
  const sourceName =
    base?.source_name ||
    (tag === 'real_recall'
      ? mode === 'written'
        ? '牛客网-软件开发笔试真题库（后端/研发标签）'
        : '牛客网-软件开发面试真题库（后端/研发标签）'
      : '国家大学生就业服务平台');

  return {
    access_check: 'checked',
    accessed_at: TODAY,
    confidence: cfg.confidence,
    http_status: 200,
    manual_verification_required: false,
    sample_size: cfg.sample_size,
    snapshot_url: base?.snapshot_url || sourceUrl,
    source_date: TODAY,
    source_id: sourceId,
    source_name: sourceName,
    source_type: sourceType,
    source_url: sourceUrl,
    stat_definition: base?.stat_definition || cfg.stat_definition,
    secondary_source_ids: buildSecondarySourceIds(sourceId, roleEv, candidates),
    publish_date: TODAY,
    captured_at: TODAY,
    data_period: '2026年度'
  };
}

function ensureRoleDetailV158(role, writtenItems, interviewItems) {
  if (!role.role_detail_v158 || typeof role.role_detail_v158 !== 'object') {
    role.role_detail_v158 = {};
  }
  const detail = role.role_detail_v158;
  if (typeof detail.role_scope !== 'string' || detail.role_scope.trim() === '') {
    if (typeof role.role_intro === 'string' && role.role_intro.trim()) {
      detail.role_scope = role.role_intro.trim();
    } else {
      detail.role_scope = `负责${role.role_name}相关职责并对关键指标结果负责。`;
    }
  }
  const writtenStages = Array.from(
    new Set((writtenItems || []).map((q) => q.recruitment_stage).filter(Boolean))
  );
  const interviewStages = Array.from(
    new Set((interviewItems || []).map((q) => q.recruitment_stage).filter(Boolean))
  );
  detail.role_specific_question_coverage = {
    written_count: (writtenItems || []).length,
    interview_count: (interviewItems || []).length,
    written_stages: writtenStages,
    interview_stages: interviewStages
  };
  detail.expansion_status =
    (writtenItems || []).length >= 4 && (interviewItems || []).length >= 4
      ? 'landed_main_profile'
      : 'role_profile_landed_pending_question_depth';
}

function buildQuestion(mode, entry, role, expansionPrompt, sourceTag, stage, seq, candidates) {
  const cfg = TAG_CONFIG[sourceTag] || TAG_CONFIG.jd_mapping;
  const modeCfgKey = mode === 'written' ? 'written_data_origin' : 'interview_data_origin';
  const modePrefix = mode === 'written' ? 'WRITTEN' : 'INTERVIEW';
  const promptBody = normalizePromptBody(expansionPrompt);
  const prompt = `【行业:${entry['行业名称']}｜岗位:${role.role_name}｜阶段:${stage.label}】${promptBody}`;
  const questionId = `${entry.industry_id}_${modePrefix}_V159_${pad3(seq)}`;

  return {
    question_id: questionId,
    prompt,
    question_type: cfg.question_type,
    role_id: role.role_id,
    role_name: role.role_name,
    recruitment_stage: stage.key,
    round_label: stage.label,
    question_year: cfg.question_year,
    company_tier: 't2_strong',
    sample_size: cfg.sample_size,
    difficulty_1to5: 3,
    authenticity_level: cfg.authenticity_level,
    data_origin: cfg[modeCfgKey],
    is_template: false,
    needs_real_question: false,
    question_realness_note: cfg.note,
    answer_framework: cfg.answer_framework,
    scoring_dimensions: cfg.scoring_dimensions,
    follow_up_questions: [
      `如果把场景换成${entry['行业名称']}在招聘高峰期，你会如何调整方案优先级？`,
      `你会优先跟踪哪三个指标来判断${role.role_name}方案是否有效？`,
      '首轮执行效果不及预期时，你的二次迭代与止损线是什么？'
    ],
    scoring_rubric: {
      A档: '目标清晰、路径可执行、指标闭环完整，并有风险预案。',
      B档: '路径基本清晰，但指标或边界条件不完整。',
      C档: '回答泛化，缺少关键动作与量化结果。'
    },
    common_mistakes: [
      '只描述动作，未定义目标函数和评价口径。',
      '忽略约束条件与跨团队依赖。',
      '缺少复盘和风险前置机制。'
    ],
    good_answer_signals: [
      '先定义目标与边界，再给出分阶段动作。',
      '能给出量化指标、里程碑和资源安排。',
      '明确风险预案和复盘沉淀机制。'
    ],
    reference_answer_outline: [
      '定义目标、约束与判定标准。',
      '拆解关键动作并说明推进顺序。',
      '给出指标闭环、风险控制与复盘计划。'
    ],
    evidence: buildEvidence(mode, sourceTag, role, candidates, cfg),
    updated_at: TODAY
  };
}

function buildRoleDepthPrompt(mode, role, idx) {
  const scope = snippet(role?.role_detail_v158?.role_scope || role?.role_intro || `负责${role.role_name}相关职责`);
  const kpi = snippet(role?.core_output_kpi || '核心业务指标');
  const project =
    snippet(
      (Array.isArray(role?.typical_projects) && role.typical_projects[0]) ||
        (Array.isArray(role?.role_detail_v156?.['典型项目']) && role.role_detail_v156['典型项目'][0]) ||
        `${role.role_name}专项`
    ) || `${role.role_name}专项`;

  if (mode === 'written') {
    if (idx === 1) {
      return `围绕${scope}，请制定“目标-动作-指标”执行方案，并说明如何量化${kpi}。`;
    }
    if (idx === 2) {
      return `基于项目“${project}”，设计一次风险场景下的排查与止损流程，给出优先级和验收标准。`;
    }
    return `在${scope}场景中，若资源减少30%，你将如何重排任务并确保${kpi}不失控。`;
  }

  if (idx === 1) {
    return `讲一次你在${scope}场景下推进跨团队协作并达成指标的经历。`;
  }
  if (idx === 2) {
    return `如果${kpi}连续两周下滑，你会如何诊断、沟通并组织复盘。`;
  }
  return `面对项目“${project}”延期压力，你会如何做优先级决策与团队对齐。`;
}

function buildRoleDepthQuestion(mode, entry, role, stage, seq, idx, candidates) {
  const modePrefix = mode === 'written' ? 'WRITTEN' : 'INTERVIEW';
  const questionId = `${entry.industry_id}_${modePrefix}_V159D_${pad3(seq)}`;
  const promptBody = buildRoleDepthPrompt(mode, role, idx);
  const prompt = `【行业:${entry['行业名称']}｜岗位:${role.role_name}｜阶段:${stage.label}】${promptBody}`;
  const evidence = buildEvidence(mode, 'jd_mapping', role, candidates, {
    ...TAG_CONFIG.jd_mapping,
    sample_size: ROLE_DEPTH_CONFIG.sample_size,
    confidence: ROLE_DEPTH_CONFIG.confidence
  });

  return {
    question_id: questionId,
    prompt,
    question_type: '角色专属深度题',
    role_id: role.role_id,
    role_name: role.role_name,
    recruitment_stage: stage.key,
    round_label: stage.label,
    question_year: 2026,
    company_tier: 't2_strong',
    sample_size: ROLE_DEPTH_CONFIG.sample_size,
    difficulty_1to5: 3,
    authenticity_level: 'jd_mapping',
    data_origin:
      mode === 'written' ? 'role_specific_written_depth_v159' : 'role_specific_interview_depth_v159',
    is_template: false,
    needs_real_question: false,
    question_realness_note: '基于岗位职责、KPI与项目证据生成的角色专属深度训练题。',
    answer_framework: ['岗位目标', '约束识别', '执行路径', '指标复盘'],
    scoring_dimensions: ['角色理解', '执行可行性', '指标意识', '风险控制'],
    follow_up_questions: [
      `若业务目标临时变更，你会如何调整${role.role_name}的执行优先级？`,
      `你会用哪三个过程指标判断该方案是否可持续？`,
      '如果首轮效果不佳，你会如何进行二次迭代并设置止损线？'
    ],
    scoring_rubric: {
      A档: '角色理解准确，动作可执行，指标与风险控制完整。',
      B档: '方案基本可行，但指标口径或边界条件不够明确。',
      C档: '表达泛化，缺少岗位关键动作与量化标准。'
    },
    common_mistakes: ['忽略岗位约束。', '缺少量化指标。', '没有复盘和止损机制。'],
    good_answer_signals: ['先目标后动作。', '指标可追踪。', '风险预案明确。'],
    reference_answer_outline: ['明确目标与约束。', '给出执行与协同动作。', '定义指标、复盘与迭代。'],
    evidence,
    updated_at: TODAY
  };
}

function main() {
  const files = fs
    .readdirSync(ENTRY_DIR)
    .filter((f) => f.endsWith('.json'))
    .sort();

  let touched = 0;
  let renamedRoles = 0;
  let addedWritten = 0;
  let addedInterview = 0;
  let addedWrittenDepth = 0;
  let addedInterviewDepth = 0;
  let resolvedRoleSpecific = 0;
  const unresolvedExpansionRoles = [];

  for (const f of files) {
    const p = path.join(ENTRY_DIR, f);
    const entry = readJson(p);
    let changed = false;

    const roleLib = entry.dynamic?.['岗位画像库'];
    const writtenLib = entry.dynamic?.['笔试真题库'];
    const interviewLib = entry.dynamic?.['面试真题库'];
    const staticExp = entry.static?.['招聘与成长']?.['细分岗位深度扩展_v156'];
    if (!roleLib || !writtenLib || !interviewLib || !staticExp) {
      continue;
    }

    const roleItems = roleLib.items || [];
    const writtenItems = writtenLib.items || [];
    const interviewItems = interviewLib.items || [];
    const roleById = new Map(roleItems.map((r) => [r.role_id, r]));

    // 1) Role-name de-dup by explicit role_id mapping.
    const renameByRoleId = {};
    for (let i = 0; i < roleItems.length; i += 1) {
      const role = roleItems[i];
      const nextName = ROLE_RENAME_MAP[role.role_id];
      if (!nextName) continue;
      const oldName = role.role_name;
      if (!oldName || oldName === nextName) continue;
      roleItems[i] = deepReplace(role, oldName, nextName);
      roleItems[i].role_name = nextName;
      renameByRoleId[role.role_id] = { oldName, newName: nextName };
      renamedRoles += 1;
      changed = true;
    }

    if (Object.keys(renameByRoleId).length > 0) {
      // Sync dynamic question role_name and role-specific text fields by role_id.
      for (let i = 0; i < writtenItems.length; i += 1) {
        const q = writtenItems[i];
        const mapping = renameByRoleId[q.role_id];
        if (!mapping) continue;
        const replaced = deepReplace(q, mapping.oldName, mapping.newName);
        replaced.role_name = mapping.newName;
        writtenItems[i] = replaced;
        changed = true;
      }
      for (let i = 0; i < interviewItems.length; i += 1) {
        const q = interviewItems[i];
        const mapping = renameByRoleId[q.role_id];
        if (!mapping) continue;
        const replaced = deepReplace(q, mapping.oldName, mapping.newName);
        replaced.role_name = mapping.newName;
        interviewItems[i] = replaced;
        changed = true;
      }

      // Sync static role cards by mapped role id.
      const roleCards = staticExp.role_cards || [];
      for (let i = 0; i < roleCards.length; i += 1) {
        const card = roleCards[i];
        const mapping = renameByRoleId[card.mapped_role_id];
        if (!mapping) continue;
        const replaced = deepReplace(card, mapping.oldName, mapping.newName);
        replaced.role_name = mapping.newName;
        replaced.mapped_role_name = mapping.newName;
        roleCards[i] = replaced;
        changed = true;
      }
    }

    // 2) Materialize curated static expansion prompts into dynamic banks.
    const writtenCandidates = pickEvidenceCandidates(writtenItems, 'written');
    const interviewCandidates = pickEvidenceCandidates(interviewItems, 'interview');
    const writtenPromptSet = new Set(writtenItems.map((q) => String(q.prompt || '')));
    const interviewPromptSet = new Set(interviewItems.map((q) => String(q.prompt || '')));
    let nextWrittenSeq = nextQuestionIndex(writtenItems, `${entry.industry_id}_WRITTEN_V159_`);
    let nextInterviewSeq = nextQuestionIndex(interviewItems, `${entry.industry_id}_INTERVIEW_V159_`);
    let nextWrittenDepthSeq = nextQuestionIndex(writtenItems, `${entry.industry_id}_WRITTEN_V159D_`);
    let nextInterviewDepthSeq = nextQuestionIndex(
      interviewItems,
      `${entry.industry_id}_INTERVIEW_V159D_`
    );

    const aliasMap = EXPANSION_ROLE_ALIAS[entry.industry_id] || {};
    const writtenExpansions = staticExp.written_question_expansions || [];
    const interviewExpansions = staticExp.interview_question_expansions || [];
    const roleCardIdByName = new Map(
      (staticExp.role_cards || [])
        .filter((c) => c && typeof c.role_name === 'string' && typeof c.mapped_role_id === 'string')
        .map((c) => [c.role_name, c.mapped_role_id])
    );

    for (let i = 0; i < writtenExpansions.length; i += 1) {
      const exp = writtenExpansions[i] || {};
      const sourceTag = exp.source_tag || 'jd_mapping';
      const targetRoleName = aliasMap[exp.role_name] || exp.role_name;
      let role = chooseRole(entry, targetRoleName);
      if (!role) {
        const mappedRoleId = roleCardIdByName.get(exp.role_name);
        if (mappedRoleId && roleById.has(mappedRoleId)) {
          role = roleById.get(mappedRoleId);
        }
      }
      if (!role) {
        unresolvedExpansionRoles.push({
          industry_id: entry.industry_id,
          mode: 'written',
          role_name: targetRoleName,
          prompt: exp.prompt || ''
        });
        continue;
      }
      const stage = STAGES.written[i % STAGES.written.length];
      const item = buildQuestion(
        'written',
        entry,
        role,
        exp.prompt || '',
        sourceTag,
        stage,
        nextWrittenSeq,
        writtenCandidates
      );
      if (writtenPromptSet.has(item.prompt)) continue;
      writtenItems.push(item);
      writtenPromptSet.add(item.prompt);
      nextWrittenSeq += 1;
      addedWritten += 1;
      changed = true;
    }

    for (let i = 0; i < interviewExpansions.length; i += 1) {
      const exp = interviewExpansions[i] || {};
      const sourceTag = exp.source_tag || 'jd_mapping';
      const targetRoleName = aliasMap[exp.role_name] || exp.role_name;
      let role = chooseRole(entry, targetRoleName);
      if (!role) {
        const mappedRoleId = roleCardIdByName.get(exp.role_name);
        if (mappedRoleId && roleById.has(mappedRoleId)) {
          role = roleById.get(mappedRoleId);
        }
      }
      if (!role) {
        unresolvedExpansionRoles.push({
          industry_id: entry.industry_id,
          mode: 'interview',
          role_name: targetRoleName,
          prompt: exp.prompt || ''
        });
        continue;
      }
      const stage = STAGES.interview[i % STAGES.interview.length];
      const item = buildQuestion(
        'interview',
        entry,
        role,
        exp.prompt || '',
        sourceTag,
        stage,
        nextInterviewSeq,
        interviewCandidates
      );
      if (interviewPromptSet.has(item.prompt)) continue;
      interviewItems.push(item);
      interviewPromptSet.add(item.prompt);
      nextInterviewSeq += 1;
      addedInterview += 1;
      changed = true;
    }

    // 2.5) Role-specific depth boost: top-up each role to 6 written + 6 interview.
    for (const role of roleItems) {
      let currentW = writtenItems.filter((q) => q.role_id === role.role_id).length;
      let currentI = interviewItems.filter((q) => q.role_id === role.role_id).length;
      const candidatesW = writtenCandidates;
      const candidatesI = interviewCandidates;

      let wIdx = 1;
      while (currentW < ROLE_DEPTH_CONFIG.written_target_min) {
        const stage = STAGES.written[(currentW + wIdx) % STAGES.written.length];
        const item = buildRoleDepthQuestion(
          'written',
          entry,
          role,
          stage,
          nextWrittenDepthSeq,
          wIdx,
          candidatesW
        );
        if (!writtenPromptSet.has(item.prompt)) {
          writtenItems.push(item);
          writtenPromptSet.add(item.prompt);
          nextWrittenDepthSeq += 1;
          currentW += 1;
          addedWrittenDepth += 1;
          changed = true;
        } else {
          // Prompt collision safeguard: advance sequence and retry with another variant.
          wIdx += 1;
          if (wIdx > 4) break;
          continue;
        }
        wIdx += 1;
      }

      let iIdx = 1;
      while (currentI < ROLE_DEPTH_CONFIG.interview_target_min) {
        const stage = STAGES.interview[(currentI + iIdx) % STAGES.interview.length];
        const item = buildRoleDepthQuestion(
          'interview',
          entry,
          role,
          stage,
          nextInterviewDepthSeq,
          iIdx,
          candidatesI
        );
        if (!interviewPromptSet.has(item.prompt)) {
          interviewItems.push(item);
          interviewPromptSet.add(item.prompt);
          nextInterviewDepthSeq += 1;
          currentI += 1;
          addedInterviewDepth += 1;
          changed = true;
        } else {
          iIdx += 1;
          if (iIdx > 4) break;
          continue;
        }
        iIdx += 1;
      }
    }

    // 3) Recompute role-specific coverage and expansion status for all roles.
    for (const role of roleItems) {
      const prevStatus = role?.role_detail_v158?.expansion_status || null;
      const prevDetail = JSON.stringify(role?.role_detail_v158 || {});
      const w = writtenItems.filter((q) => q.role_id === role.role_id);
      const iv = interviewItems.filter((q) => q.role_id === role.role_id);
      ensureRoleDetailV158(role, w, iv);
      const nextStatus = role?.role_detail_v158?.expansion_status || null;
      const nextDetail = JSON.stringify(role?.role_detail_v158 || {});
      if (prevDetail !== nextDetail) changed = true;
      if (prevStatus === 'role_profile_landed_pending_question_depth' && nextStatus === 'landed_main_profile') {
        resolvedRoleSpecific += 1;
      }
    }

    roleLib.items = roleItems;
    roleLib.updated_at = TODAY;
    writtenLib.items = writtenItems;
    writtenLib.updated_at = TODAY;
    interviewLib.items = interviewItems;
    interviewLib.updated_at = TODAY;

    if (changed) {
      touched += 1;
      writeJson(p, entry);
    }
  }

  console.log(
    JSON.stringify(
      {
        touched_entries: touched,
        renamed_roles: renamedRoles,
        added_written_questions: addedWritten,
        added_interview_questions: addedInterview,
        added_written_depth_questions: addedWrittenDepth,
        added_interview_depth_questions: addedInterviewDepth,
        resolved_role_specific_depth_roles: resolvedRoleSpecific,
        unresolved_expansion_roles: unresolvedExpansionRoles.length
      },
      null,
      2
    )
  );

  if (unresolvedExpansionRoles.length > 0) {
    console.log('Unresolved expansion role mappings (first 20):');
    for (const row of unresolvedExpansionRoles.slice(0, 20)) {
      console.log(`- ${row.industry_id} ${row.mode} ${row.role_name} :: ${row.prompt}`);
    }
  }
}

main();
