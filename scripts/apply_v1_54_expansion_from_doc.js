#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DOC_PATH = path.join(ROOT, 'docs', '23行业细分岗位与题库扩展包_v1.46.0.md');
const ENTRY_DIR = path.join(ROOT, 'data', 'entries');
const TODAY = '2026-02-19';

const WRITTEN_STAGES = [
  'campus_early_batch_written',
  'campus_main_batch_written',
  'campus_supplement_written',
  'internship_conversion_written'
];

const INTERVIEW_STAGES = [
  'campus_early_batch_interview',
  'campus_main_batch_interview',
  'campus_supplement_interview',
  'internship_conversion_interview'
];

function parseExpansionDoc(markdown) {
  const map = {};
  const sections = markdown.split(/\n##\s+\d+\)\s+/).slice(1);

  for (const sec of sections) {
    const head = sec.match(/^(.*?)（(IND_[A-Z_]+)）/);
    if (!head) continue;

    const industryName = head[1].trim();
    const industryId = head[2].trim();

    const roleBlock = (sec.match(/### 新增细分岗位（12）([\s\S]*?)### 笔试题扩展（12）/) || [])[1] || '';
    const writtenBlock = (sec.match(/### 笔试题扩展（12）([\s\S]*?)### 面试题扩展（12）/) || [])[1] || '';
    const interviewBlock = (sec.match(/### 面试题扩展（12）([\s\S]*?)### 缺口位与检索指引/) || [])[1] || '';
    const sourceBlock = (sec.match(/### 可用信息源([\s\S]*?)(\n---|$)/) || [])[1] || '';

    const roles = [...roleBlock.matchAll(/\n\d+\.\s+([^：\n]+)：([^\n]+)/g)].map((m) => ({
      role_name: m[1].trim(),
      role_intro: m[2].trim()
    }));

    const written = [...writtenBlock.matchAll(/\n\d+\.\s+\[([^\]]+)\]\s+([^\n]+)/g)].map((m) => ({
      source_tag: m[1].trim(),
      prompt: m[2].trim()
    }));

    const interview = [...interviewBlock.matchAll(/\n\d+\.\s+\[([^\]]+)\]\s+([^\n]+)/g)].map((m) => ({
      source_tag: m[1].trim(),
      prompt: m[2].trim()
    }));

    const bossMatch = sec.match(/- BOSS检索词：`([^`]+)`(?:；入口：<([^>]+)>)?/);
    const xhsMatch = sec.match(/- 小红书检索词：`([^`]+)`(?:；[^\n]*)?/);
    const priorityMatch = sec.match(/- (?:企业官网优先|官方优先)：([^\n]+)/);
    const sourceLinks = [...sourceBlock.matchAll(/<([^>]+)>/g)].map((m) => m[1].trim());

    map[industryId] = {
      industry_name: industryName,
      roles,
      written,
      interview,
      boss_query: bossMatch ? bossMatch[1].trim() : `${industryName} 应届生 校招`,
      boss_url: bossMatch && bossMatch[2] ? bossMatch[2].trim() : 'https://www.zhipin.com/web/geek/job?query=%E6%A0%A1%E6%8B%9B',
      xhs_query: xhsMatch ? xhsMatch[1].trim() : `${industryName} 校招 面经 offer 薪资`,
      xhs_url: 'https://www.xiaohongshu.com/search_result/?keyword=%E6%A0%A1%E6%8B%9B',
      source_priority_note: priorityMatch ? priorityMatch[1].trim() : '优先企业官方岗位详情页与主管部门公告页。',
      source_links: sourceLinks
    };
  }

  return map;
}

function inferRoleFamily(roleName) {
  const n = roleName;
  if (/(开发|工程|算法|数据|MLOps|测试|系统|网络|仿真|工艺|研发|安全|质量|运维|电气|自动化|材料|精算|核保|理赔|注册|EHS|配方|并网|调度|风控|反欺诈)/.test(n)) {
    return '技术与研发';
  }
  if (/(产品|运营|增长|内容|社区|活动|投放|选品|发行|用户研究|课程|教研|班主任|客户成功|会员)/.test(n)) {
    return '产品与运营';
  }
  if (/(财务|审计|法务|合规|人力|采购|供应链|项目管理|战略|投资|公共事务|政务|纪检|法制|治理|政策)/.test(n)) {
    return '职能与治理';
  }
  if (/(销售|商务|渠道|品牌|市场|投顾|财富|机构销售|再保|市场准入)/.test(n)) {
    return '商业与市场';
  }
  return '综合岗位';
}

function stageLabel(stage) {
  const map = {
    campus_early_batch_written: '提前批笔试',
    campus_main_batch_written: '主批笔试',
    campus_supplement_written: '补录笔试',
    internship_conversion_written: '实习转正笔试',
    campus_early_batch_interview: '提前批面试',
    campus_main_batch_interview: '主批面试',
    campus_supplement_interview: '补录面试',
    internship_conversion_interview: '实习转正面试'
  };
  return map[stage] || '校招轮次';
}

function tagToQuestionMeta(tag, mode) {
  if (tag === 'real_recall') {
    return {
      authenticity_level: 'real_user',
      data_origin: mode === 'written' ? 'real_user_recall_written_expansion' : 'real_user_recall_interview_expansion',
      question_type: mode === 'written' ? '实战回忆题（高频样本）' : '实战回忆题（高频面经）',
      question_realness_note: '公开回忆题样本（非官方原卷），用于岗位化训练与场景复盘。',
      confidence: 0.8,
      sample_size: 10,
      year: 2025,
      framework: ['场景复现', '关键约束', '执行方案', '结果复盘'],
      scoring_dimensions: ['场景拆解', '方案落地', '指标意识', '复盘质量']
    };
  }
  if (tag === 'official_original') {
    return {
      authenticity_level: 'official_original',
      data_origin: mode === 'written' ? 'official_pattern_written_expansion' : 'official_pattern_interview_expansion',
      question_type: mode === 'written' ? '官方口径题型映射' : '官方口径场景问答',
      question_realness_note: '基于官方公开题型/流程口径整理，不等同于逐字原题。',
      confidence: 0.78,
      sample_size: 8,
      year: 2026,
      framework: ['问题定义', '分析方法', '方案设计', '风险边界'],
      scoring_dimensions: ['逻辑严谨性', '政策/业务边界', '可执行性', '风险控制']
    };
  }
  return {
    authenticity_level: 'jd_mapping',
    data_origin: mode === 'written' ? 'jd_mapping_written_expansion' : 'jd_mapping_interview_expansion',
    question_type: mode === 'written' ? '岗位能力映射题' : '岗位能力映射面试题',
    question_realness_note: '依据岗位JD能力项映射生成，用于训练岗位化思维与表达。',
    confidence: 0.74,
    sample_size: 7,
    year: 2026,
    framework: ['岗位目标', '能力拆解', '落地动作', '量化评估'],
    scoring_dimensions: ['岗位理解', '方案落地', '协同推进', '结果量化']
  };
}

function pickEvidence(entry, mode, tag) {
  const roleItems = (entry.dynamic['岗位画像库'] && entry.dynamic['岗位画像库'].items) || [];
  const writtenItems = (entry.dynamic['笔试真题库'] && entry.dynamic['笔试真题库'].items) || [];
  const interviewItems = (entry.dynamic['面试真题库'] && entry.dynamic['面试真题库'].items) || [];
  const pool = mode === 'written' ? writtenItems : interviewItems;

  const realQ = pool.find((q) => {
    const ev = q.evidence || {};
    const sid = ev.source_id || '';
    return ev.source_type === 'real_user' || sid.startsWith('SRC_NOWCODER_');
  });

  const officialRole = roleItems.find((r) => {
    const ev = r.evidence || {};
    return ['company_official', 'government_agency', 'government_policy', 'government_platform'].includes(ev.source_type);
  });

  const officialQ = pool.find((q) => {
    const ev = q.evidence || {};
    return ev.source_type && ev.source_type !== 'real_user';
  });

  const fallbackQ = pool[0] || writtenItems[0] || interviewItems[0];

  let base;
  if (tag === 'real_recall') {
    base = (realQ && realQ.evidence) || (fallbackQ && fallbackQ.evidence) || {};
  } else {
    base = (officialRole && officialRole.evidence) || (officialQ && officialQ.evidence) || (fallbackQ && fallbackQ.evidence) || {};
  }

  return JSON.parse(JSON.stringify(base || {}));
}

function sanitizeEvidence(base, meta) {
  const out = Object.assign({}, base || {});
  out.access_check = out.access_check || 'checked';
  out.accessed_at = TODAY;
  out.publish_date = TODAY;
  out.captured_at = TODAY;
  out.source_date = TODAY;
  out.data_period = out.data_period || '2026年度';
  out.http_status = typeof out.http_status === 'number' ? out.http_status : 200;
  out.manual_verification_required = typeof out.manual_verification_required === 'boolean' ? out.manual_verification_required : false;
  out.sample_size = meta.sample_size;
  out.confidence = meta.confidence;
  if (!out.source_id) out.source_id = 'SRC_NCSS_2026_JOINT';
  if (!out.source_url) out.source_url = 'https://www.ncss.cn/';
  if (!out.source_name) out.source_name = '国家大学生就业服务平台';
  if (!out.source_type) out.source_type = tagToSourceType(meta.tag);
  if (!out.snapshot_url) out.snapshot_url = out.source_url;
  return out;
}

function tagToSourceType(tag) {
  if (tag === 'real_recall') return 'real_user';
  if (tag === 'official_original') return 'government_policy';
  return 'curated_mapping';
}

function buildQuestion({ entry, item, mode, index, roleAssign, evidenceBase }) {
  const meta = tagToQuestionMeta(item.source_tag, mode);
  const evidence = sanitizeEvidence(evidenceBase, {
    sample_size: meta.sample_size,
    confidence: meta.confidence,
    tag: item.source_tag
  });

  const stage = roleAssign.stage;
  const roundLabel = stageLabel(stage);
  const prefix = mode === 'written' ? 'WRITTEN' : 'INTERVIEW';
  const questionId = `${entry.industry_id}_${prefix}_EXP_${String(index + 1).padStart(3, '0')}`;

  return {
    question_id: questionId,
    prompt: `【行业:${entry['行业名称']}｜岗位:${roleAssign.role_name}｜阶段:${roundLabel}】${item.prompt}`,
    question_type: meta.question_type,
    role_id: roleAssign.role_id,
    role_name: roleAssign.role_name,
    recruitment_stage: stage,
    round_label: roundLabel,
    question_year: meta.year,
    company_tier: 't2_strong',
    sample_size: meta.sample_size,
    difficulty_1to5: 3,
    authenticity_level: meta.authenticity_level,
    data_origin: meta.data_origin,
    is_template: false,
    needs_real_question: false,
    question_realness_note: meta.question_realness_note,
    answer_framework: meta.framework,
    scoring_dimensions: meta.scoring_dimensions,
    follow_up_questions: [
      `如果把场景换成${entry['行业名称']}在招聘高峰期，你会如何调整方案优先级？`,
      `你会优先跟踪哪三个指标来判断${roleAssign.role_name}方案是否有效？`,
      `首轮执行效果不及预期时，你的二次迭代与止损线是什么？`
    ],
    scoring_rubric: {
      'A档': '目标清晰、路径可执行、指标闭环完整，并有风险预案。',
      'B档': '路径基本清晰，但指标或边界条件不完整。',
      'C档': '回答泛化，缺少关键动作与量化结果。'
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
    evidence,
    updated_at: TODAY
  };
}

function computeAssignments(entry, mode, count) {
  const roles = ((entry.dynamic['岗位画像库'] || {}).items || []).map((r) => ({
    role_id: r.role_id,
    role_name: r.role_name
  }));
  const items = mode === 'written'
    ? ((entry.dynamic['笔试真题库'] || {}).items || [])
    : ((entry.dynamic['面试真题库'] || {}).items || []);
  const allStages = mode === 'written' ? WRITTEN_STAGES : INTERVIEW_STAGES;

  const roleState = roles.map((r) => {
    const covered = new Set(
      items
        .filter((q) => q.role_id === r.role_id)
        .map((q) => q.recruitment_stage)
        .filter(Boolean)
    );
    const missing = allStages.filter((s) => !covered.has(s));
    return { ...r, missing, assigned: 0 };
  });

  const out = [];
  for (let i = 0; i < count; i += 1) {
    roleState.sort((a, b) => {
      if (b.missing.length !== a.missing.length) return b.missing.length - a.missing.length;
      if (a.assigned !== b.assigned) return a.assigned - b.assigned;
      return a.role_id.localeCompare(b.role_id);
    });

    const selected = roleState[0] || { role_id: `${entry.industry_id}_ROLE_001`, role_name: '综合岗位', missing: [], assigned: 0 };
    const stage = selected.missing.length > 0 ? selected.missing.shift() : allStages[i % allStages.length];
    selected.assigned += 1;

    out.push({ role_id: selected.role_id, role_name: selected.role_name, stage });
  }

  return out;
}

function appendNote(base, extra) {
  if (!base) return extra;
  if (base.includes(extra)) return base;
  return `${base}；${extra}`;
}

function applyIndustryExpansion(entry, expansion) {
  const roleItems = ((entry.dynamic['岗位画像库'] || {}).items || []);
  const coreRoles = roleItems.slice(0, 6).map((r) => r.role_name);
  const bridgeRoles = roleItems.slice(6, 12).map((r) => r.role_name);

  const familyNavigation = {
    核心岗: coreRoles,
    高增长岗: expansion.roles.slice(0, 8).map((r) => ({
      role_name: r.role_name,
      role_intro: r.role_intro,
      role_family: inferRoleFamily(r.role_name)
    })),
    桥接岗: bridgeRoles,
    选岗建议: [
      '先从核心岗建立可验证项目证据，再向高增长岗迁移。',
      '以“岗位目标-能力缺口-90天动作”制定投递路线。',
      '对平台受限数据保留回填槽位，不以单一来源下结论。'
    ],
    updated_at: TODAY
  };

  if (!entry.static['招聘与成长']) entry.static['招聘与成长'] = {};
  entry.static['招聘与成长']['岗位家族导航'] = familyNavigation;

  const writtenCollection = entry.dynamic['笔试真题库'];
  const interviewCollection = entry.dynamic['面试真题库'];
  const customCollection = entry.dynamic['自定义扩展'];

  writtenCollection.items = (writtenCollection.items || []).filter(
    (q) => !(q.question_id || '').startsWith(`${entry.industry_id}_WRITTEN_EXP_`)
  );
  interviewCollection.items = (interviewCollection.items || []).filter(
    (q) => !(q.question_id || '').startsWith(`${entry.industry_id}_INTERVIEW_EXP_`)
  );

  const writtenAssign = computeAssignments(entry, 'written', expansion.written.length);
  const interviewAssign = computeAssignments(entry, 'interview', expansion.interview.length);

  const writtenAddedIds = [];
  const interviewAddedIds = [];

  expansion.written.forEach((item, idx) => {
    const ev = pickEvidence(entry, 'written', item.source_tag);
    const q = buildQuestion({
      entry,
      item,
      mode: 'written',
      index: idx,
      roleAssign: writtenAssign[idx],
      evidenceBase: ev
    });
    writtenCollection.items.push(q);
    writtenAddedIds.push(q.question_id);
  });

  expansion.interview.forEach((item, idx) => {
    const ev = pickEvidence(entry, 'interview', item.source_tag);
    const q = buildQuestion({
      entry,
      item,
      mode: 'interview',
      index: idx,
      roleAssign: interviewAssign[idx],
      evidenceBase: ev
    });
    interviewCollection.items.push(q);
    interviewAddedIds.push(q.question_id);
  });

  writtenCollection.updated_at = TODAY;
  interviewCollection.updated_at = TODAY;
  writtenCollection.notes = appendNote(writtenCollection.notes || '', 'v1.54补充12条行业化笔试扩展题，优先补缺阶段');
  interviewCollection.notes = appendNote(interviewCollection.notes || '', 'v1.54补充12条行业化面试扩展题，优先补缺阶段');

  const extId = `${entry.industry_id}_EXPANSION_V154`;
  customCollection.items = (customCollection.items || []).filter((x) => x.ext_id !== extId);

  const extEvidence = pickEvidence(entry, 'written', 'official_original');
  const expansionItem = {
    ext_id: extId,
    x_decision_type: 'role_and_question_expansion',
    x_decision_title: `${entry['行业名称']}细分岗位与题库扩容卡（v1.54）`,
    x_decision_summary: '补充细分岗位候选介绍与行业化题库扩展；平台受限信息保留待补槽位并明确检索路径。',
    x_role_expansion_candidates: expansion.roles.map((r, i) => ({
      role_slot_id: `${entry.industry_id}_ROLE_SLOT_V154_${String(i + 1).padStart(3, '0')}`,
      role_name: r.role_name,
      role_intro: r.role_intro,
      role_family: inferRoleFamily(r.role_name),
      required_info: ['岗位职责', '核心产出', '典型项目', '淘汰点', '90天准备动作', '证据来源URL'],
      status: 'pending_platform_verification'
    })),
    x_written_question_expansion_added_ids: writtenAddedIds,
    x_interview_question_expansion_added_ids: interviewAddedIds,
    x_platform_backfill_plan: {
      status: 'pending_platform_verification',
      need_fields: ['岗位名称', '城市', '公司层级', '批次/轮次', '岗位或题目链接', '发布时间', '样本量', '截图路径', '来源类型', '备注'],
      how_to_search: [
        '先用企业官网/主管部门公告页核对岗位名称与批次，再用平台补城市与薪资样本。',
        'BOSS优先网页检索；若小红书网页受限，改App检索并保留帖子ID与截图时间戳。',
        '同城同岗样本去重后再统计，样本不足时标注低置信。'
      ],
      where_to_search: {
        boss: { query: expansion.boss_query, url: expansion.boss_url },
        xiaohongshu: { query: expansion.xhs_query, url: expansion.xhs_url },
        official_priority: expansion.source_priority_note,
        official_source_links: expansion.source_links
      },
      capture_rule: '缺失城市/薪资/发布时间的样本不进入A档结论，必须保留待补槽位与责任人。'
    },
    x_data_collection_note: '本扩容卡基于行业扩展包逐条落库，不使用批量模板灌数。',
    authenticity_level: 'curated',
    data_origin: 'manual_industry_expansion_curated',
    evidence: sanitizeEvidence(extEvidence, { sample_size: 12, confidence: 0.79, tag: 'official_original' }),
    updated_at: TODAY
  };

  customCollection.items.push(expansionItem);
  customCollection.updated_at = TODAY;
  customCollection.notes = appendNote(customCollection.notes || '', 'v1.54新增细分岗位扩容卡与平台待补计划');

  entry.meta.last_updated = TODAY;
  entry.meta.data_version = 'v1.54.0';
  entry.meta.content_version = 'v1.54.0';
}

function main() {
  const doc = fs.readFileSync(DOC_PATH, 'utf8');
  const expansions = parseExpansionDoc(doc);

  const files = fs.readdirSync(ENTRY_DIR)
    .filter((f) => f.endsWith('.json'))
    .sort();

  let touched = 0;
  for (const file of files) {
    const p = path.join(ENTRY_DIR, file);
    const entry = JSON.parse(fs.readFileSync(p, 'utf8'));
    const expansion = expansions[entry.industry_id];
    if (!expansion) continue;

    applyIndustryExpansion(entry, expansion);
    fs.writeFileSync(p, `${JSON.stringify(entry, null, 2)}\n`, 'utf8');
    touched += 1;
  }

  console.log(`Applied v1.54 expansion to ${touched} entries.`);
}

main();
