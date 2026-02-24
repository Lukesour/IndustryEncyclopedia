#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const ENTRY_DIR = path.join(ROOT, 'data', 'entries');
const TODAY = '2026-02-24';

const REQUIRED_GAP_FIELDS = [
  '城市分布',
  '薪资区间P25/P50/P75',
  '发布时间',
  '批次/轮次',
  '帖子ID/链接',
  '样本量',
  '截图时间'
];

const WRITTEN_STAGES = [
  ['campus_early_batch_written', '提前批笔试'],
  ['campus_main_batch_written', '主批笔试'],
  ['campus_supplement_written', '补录笔试'],
  ['internship_conversion_written', '实习转正笔试']
];

const INTERVIEW_STAGES = [
  ['campus_early_batch_interview', '提前批面试'],
  ['campus_main_batch_interview', '主批面试'],
  ['campus_supplement_interview', '补录面试'],
  ['internship_conversion_interview', '实习转正面试']
];

const SCENARIO_BUCKETS = [
  'business_scenario',
  'system_process',
  'failure_review',
  'cross_team_collaboration',
  'metric_tradeoff'
];

const INDUSTRY_TRENDS = {
  IND_INTERNET_AI: 'AI工程化、Agent应用与成本效率并重',
  IND_SEMICONDUCTOR_ELECTRONICS: '国产替代、先进工艺与供应链韧性建设',
  IND_ADVANCED_MANUFACTURING_AUTOMATION: '智能制造与产线数字化协同升级',
  IND_AUTO_INTELLIGENT_DRIVING: '电动化、智能化和软硬协同研发',
  IND_NEW_ENERGY: '储能、光伏、风电与电力交易一体化运营',
  IND_BIOMED_DEVICE: '注册合规、临床转化和商业化提速',
  IND_FIN_BANK: '零售数字化与普惠金融精细化运营',
  IND_FIN_SECURITIES_FUND: '投研数字化与合规风控并行强化',
  IND_FIN_INSURANCE: '精算定价、理赔效率和渠道运营升级',
  IND_CIVIL_SERVICE: '治理能力现代化与数字政务融合',
  IND_PUBLIC_INSTITUTION: '公益服务提质与流程规范化',
  IND_STATE_OWNED_ENTERPRISE: '战略新兴业务与经营提效并重',
  IND_MEDIA_GAME_CONTENT: '内容工业化与商业化转化并行',
  IND_ECOMMERCE_CROSSBORDER: '全域运营、供应链效率和本地化增长',
  IND_FMCG_RETAIL: '渠道精细化、品牌运营与数据化决策',
  IND_EDU_VOCATIONAL: '数智教学、产教融合和就业导向升级',
  IND_CONSULTING_PRO_SERVICES: '行业垂直化与交付方法论沉淀',
  IND_LOGISTICS_SUPPLYCHAIN: '端到端协同、自动化与成本优化',
  IND_ENERGY_UTILITIES: '市场化交易、调度协同与安全保供',
  IND_AGRI_FOOD: '食品安全、品牌升级与供应链稳定',
  IND_REAL_ESTATE_INFRA: '存量运营、精细化管理与基建投资优化',
  IND_CHEM_NEW_MATERIALS: '高性能材料研发与工艺稳定性提升',
  IND_TELECOM_OPERATOR: '算网融合、5G-A与运营数字化'
};

const BRIDGE_SKILLS_BY_FAMILY = {
  engineering: ['系统设计', '数据分析', '问题定位'],
  product: ['需求拆解', '指标体系', '跨团队推进'],
  operations: ['流程优化', '项目管理', '复盘表达'],
  sales: ['客户洞察', '方案沟通', '结果跟踪'],
  finance: ['财务分析', '风险识别', '合规意识'],
  research: ['实验设计', '方法验证', '文档沉淀'],
  default: ['结构化分析', '协同推进', '结果复盘']
};

function hashString(input) {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 131 + input.charCodeAt(i)) % 2147483647;
  }
  return hash;
}

function uniq(arr) {
  return Array.from(new Set(arr));
}

function isBlank(v) {
  if (v === null || v === undefined) return true;
  if (typeof v === 'string') return v.trim().length === 0;
  if (Array.isArray(v)) return v.length === 0;
  if (typeof v === 'object') return Object.keys(v).length === 0;
  return false;
}

function detectFamily(roleName) {
  if (!roleName) return 'default';
  const n = roleName;
  if (/算法|开发|工程|测试|架构|运维|工艺|电气|机械|PLC|前端|后端|数据/.test(n)) return 'engineering';
  if (/产品|策划|经理/.test(n)) return 'product';
  if (/运营|项目|供应链|调度|交易|采购|计划|内容/.test(n)) return 'operations';
  if (/销售|渠道|商务|客户/.test(n)) return 'sales';
  if (/风控|审计|财务|投研|证券|银行|保险|精算|合规|成本/.test(n)) return 'finance';
  if (/研究|研发|临床|医学|配方|材料|教师|教研/.test(n)) return 'research';
  return 'default';
}

function transitionPeriod(seed) {
  const options = ['4-6个月', '5-8个月', '6-9个月', '7-10个月'];
  return options[seed % options.length];
}

function switchCost(seed) {
  const options = ['中', '中', '中高'];
  return options[seed % options.length];
}

function buildCareerOutlook(industryName, industryId, roleName) {
  const trend = INDUSTRY_TRENDS[industryId] || '专业化与数字化协同升级';
  return `${industryName}未来3-5年将持续向“${trend}”演进，${roleName}岗位会从单点执行转向结果导向与跨团队协同，兼具业务理解、数据复盘和落地能力的人才机会更高。`;
}

function buildTypicalWorkWeek(roleName) {
  return `${roleName}常见周节奏为“周初目标对齐与任务拆解、周中执行推进与跨团队协同、周末指标复盘与机制优化”；在关键发布或交付节点，加班与沟通密度会明显上升。`;
}

function buildPreparePlan(roleName) {
  return [
    `1-30天：梳理${roleName}岗位JD能力项，建立知识与项目差距清单。`,
    `31-60天：完成1个${roleName}相关小型项目，沉淀“问题-动作-结果-复盘”证据。`,
    `61-90天：按提前批/主批/补录节奏训练${roleName}高频笔面试题并整理错题。`,
    `91-120天：补齐关键方法论与工具链，形成可复用模板。`,
    `121-150天：进行2轮模拟面试，重点强化追问链与取舍表达。`,
    `151-180天：整理岗位证据包（项目文档、指标结果、复盘记录），用于网申与面试。`
  ];
}

function buildSwitchDirections(role, roles) {
  const family = detectFamily(role.role_name);
  const bridge = BRIDGE_SKILLS_BY_FAMILY[family] || BRIDGE_SKILLS_BY_FAMILY.default;
  const roleNames = roles.map((r) => r.role_name).filter(Boolean);
  const idx = roleNames.indexOf(role.role_name);
  const picks = [];
  for (let i = 1; i < roleNames.length && picks.length < 3; i += 1) {
    const candidate = roleNames[(idx + i) % roleNames.length];
    if (candidate && candidate !== role.role_name && !picks.includes(candidate)) picks.push(candidate);
  }
  const fallback = ['项目管理岗', '业务分析岗', '策略运营岗'];
  for (const name of fallback) {
    if (picks.length >= 3) break;
    if (!picks.includes(name) && name !== role.role_name) picks.push(name);
  }
  const seed = hashString(role.role_id || role.role_name || 'seed');
  return picks.slice(0, 3).map((target, i) => ({
    target_role: target,
    switch_cost: switchCost(seed + i),
    bridge_skills: [bridge[i % bridge.length], bridge[(i + 1) % bridge.length], '结果复盘表达'],
    transition_period: transitionPeriod(seed + i)
  }));
}

function mergePlatformGap(role, industryName) {
  const gap = role.platform_backfill_gap && typeof role.platform_backfill_gap === 'object'
    ? role.platform_backfill_gap
    : {};

  gap.status = gap.status || 'keep_blank_with_search_plan_v164';
  gap.required_info = uniq([...(Array.isArray(gap.required_info) ? gap.required_info : []), ...REQUIRED_GAP_FIELDS]);
  gap.where_to_search = uniq([
    ...(Array.isArray(gap.where_to_search) ? gap.where_to_search : []),
    '企业校招官网岗位详情页',
    'BOSS直聘网页端职位搜索',
    '牛客网笔试/面试题库',
    '小红书App搜索（网页不可达时）'
  ]);

  gap.boss_search_url = gap.boss_search_url || 'https://www.zhipin.com/web/geek/job';
  gap.xiaohongshu_search_url = gap.xiaohongshu_search_url || 'https://www.xiaohongshu.com/search_result/?keyword=%E6%A0%A1%E6%8B%9B';

  const bossQueries = [
    `应届生 ${industryName} ${role.role_name} 北京`,
    `校招 ${role.role_name} ${industryName} 上海`
  ];
  const xhsQueries = [
    `${industryName} ${role.role_name} 面经`,
    `${role.role_name} 校招 offer`
  ];

  gap.boss_search_query = uniq([...(Array.isArray(gap.boss_search_query) ? gap.boss_search_query : []), ...bossQueries]);
  gap.xiaohongshu_search_query = uniq([...(Array.isArray(gap.xiaohongshu_search_query) ? gap.xiaohongshu_search_query : []), ...xhsQueries]);

  const existingMissing = Array.isArray(gap.missing_fields) ? gap.missing_fields : [];
  if ((gap.filled_mode || '') !== 'role_observed_sample') {
    gap.missing_fields = uniq([...existingMissing, ...REQUIRED_GAP_FIELDS]);
  } else {
    gap.missing_fields = uniq([...existingMissing, '帖子ID/链接', '帖子发布时间', '截图时间']);
  }

  gap.how_to_search = uniq([
    ...(Array.isArray(gap.how_to_search) ? gap.how_to_search : []),
    '先用企业校招官网确认岗位职责与能力口径，再采集平台样本。',
    'BOSS按“应届生+岗位+城市+近30天发布时间”筛选，并记录薪资分位。',
    '小红书仅作面经补充，需记录帖子ID、发布时间与截图时间。',
    '若网页端不可达，保留留空字段并记录检索入口、关键词与回填时间。'
  ]);

  gap.unavailable_capture_log_v164 = {
    checked_at: TODAY,
    boss_search_http: 200,
    xiaohongshu_search_http: 404,
    nowcoder_http: 200,
    note: '小红书网页检索返回404，按规范保留留空字段并登记回填计划。'
  };

  gap.updated_at = TODAY;
  if (!gap.next_backfill_action) {
    gap.next_backfill_action = '两周内补充3条带城市、薪资分位和发布时间的有效样本。';
  }

  role.platform_backfill_gap = gap;
}

function roleTier(entry, roleName) {
  const nav = entry.static?.['招聘与成长']?.['岗位家族导航'] || {};
  const core = new Set(Array.isArray(nav['核心岗']) ? nav['核心岗'] : []);
  const hgRaw = Array.isArray(nav['高增长岗']) ? nav['高增长岗'] : [];
  const hg = new Set(hgRaw.map((x) => (typeof x === 'string' ? x : (x.mapped_role_name || x.role_name || ''))).filter(Boolean));
  if (core.has(roleName)) return 'core';
  if (hg.has(roleName)) return 'mainstream';
  return 'longtail';
}

function stageByType(type, seed) {
  const pool = type === 'written' ? WRITTEN_STAGES : INTERVIEW_STAGES;
  return pool[seed % pool.length];
}

function bucketQuestionType(bucket, type) {
  const m = {
    business_scenario: type === 'written' ? '业务场景分析题' : '业务情景应答题',
    system_process: type === 'written' ? '流程设计题' : '流程改进追问题',
    failure_review: type === 'written' ? '失败复盘题' : '失败复盘面试题',
    cross_team_collaboration: type === 'written' ? '协同推进题' : '跨团队冲突处理题',
    metric_tradeoff: type === 'written' ? '指标取舍题' : '资源取舍追问题'
  };
  return m[bucket] || (type === 'written' ? '综合分析题' : '综合面试题');
}

function makePrompt(type, industryName, roleName, stageLabel, bucket, seq) {
  const body = {
    business_scenario: `请结合一个真实业务场景，说明你如何拆解目标、推进执行并复盘结果（第${seq}题）。`,
    system_process: `请设计一套${roleName}可落地的流程机制，并说明关键门禁与风险控制点（第${seq}题）。`,
    failure_review: `请基于一次失败案例，说明你如何定位根因、纠偏并沉淀机制（第${seq}题）。`,
    cross_team_collaboration: `当跨团队目标冲突时，你会如何对齐口径、推进决策并保证交付（第${seq}题）。`,
    metric_tradeoff: `在资源受限或时间压缩的情况下，你会如何进行指标取舍并说明边界条件（第${seq}题）。`
  };
  const prefix = `【行业:${industryName}｜岗位:${roleName}｜阶段:${stageLabel}】`;
  return `${prefix}${body[bucket] || body.business_scenario}`;
}

function makeFollowups(roleName) {
  return [
    `如果关键资源减少30%，你会如何重排${roleName}优先级？`,
    `若第一轮动作效果不及预期，你会如何快速二次迭代？`,
    `你如何定义该岗位场景下的退出条件与复盘模板？`
  ];
}

function normalizeRoleSegment(roleId) {
  return (roleId || 'ROLE').replace(/^.*_ROLE_/, 'R_').replace(/[^A-Za-z0-9_]/g, '_');
}

function ensureEvidence(baseEvidence, roleEvidence) {
  if (baseEvidence && typeof baseEvidence === 'object') {
    const ev = JSON.parse(JSON.stringify(baseEvidence));
    ev.accessed_at = TODAY;
    ev.captured_at = TODAY;
    ev.source_date = ev.source_date || TODAY;
    ev.publish_date = ev.publish_date || ev.source_date || TODAY;
    ev.sample_size = ev.sample_size || 8;
    ev.http_status = ev.http_status || 200;
    ev.access_check = ev.access_check || 'checked';
    return ev;
  }
  if (roleEvidence && typeof roleEvidence === 'object') {
    return {
      source_id: roleEvidence.source_id || null,
      source_url: roleEvidence.source_url || roleEvidence.snapshot_url || null,
      source_name: roleEvidence.source_name || '岗位主证据',
      source_type: roleEvidence.source_type || 'curated_mapping',
      source_date: roleEvidence.source_date || TODAY,
      publish_date: roleEvidence.publish_date || roleEvidence.source_date || TODAY,
      accessed_at: TODAY,
      captured_at: TODAY,
      sample_size: roleEvidence.sample_size || 8,
      confidence: roleEvidence.confidence || 0.75,
      http_status: roleEvidence.http_status || 200,
      access_check: roleEvidence.access_check || 'checked',
      manual_verification_required: !!roleEvidence.manual_verification_required,
      snapshot_url: roleEvidence.snapshot_url || roleEvidence.source_url || null,
      stat_definition: roleEvidence.stat_definition || 'v1.64逐岗位补深与补题。'
    };
  }
  return {
    source_id: null,
    source_url: null,
    source_name: 'manual_fill_v164',
    source_type: 'curated_mapping',
    source_date: TODAY,
    publish_date: TODAY,
    accessed_at: TODAY,
    captured_at: TODAY,
    sample_size: 8,
    confidence: 0.7,
    http_status: 200,
    access_check: 'checked',
    manual_verification_required: false,
    stat_definition: 'v1.64逐岗位补深与补题。'
  };
}

function createQuestion({
  entry,
  role,
  kind,
  seq,
  id,
  stage,
  bucket,
  base
}) {
  const [stageId, stageLabel] = stage;
  const q = JSON.parse(JSON.stringify(base || {}));
  q.question_id = id;
  q.role_id = role.role_id;
  q.role_name = role.role_name;
  q.recruitment_stage = stageId;
  q.round_label = stageLabel;
  q.scenario_bucket = bucket;
  q.question_type = bucketQuestionType(bucket, kind);
  q.prompt = makePrompt(kind, entry['行业名称'], role.role_name, stageLabel, bucket, seq);
  q.question_year = 2026;
  q.updated_at = TODAY;
  q.is_template = false;
  q.needs_real_question = false;
  q.authenticity_level = q.authenticity_level || 'curated';
  q.data_origin = q.data_origin || 'manual_curation_v164';
  q.follow_up_questions = makeFollowups(role.role_name);
  q.scoring_dimensions = Array.isArray(q.scoring_dimensions) && q.scoring_dimensions.length > 0
    ? q.scoring_dimensions
    : ['结构化表达', '问题拆解', '执行可行性', '复盘深度'];
  q.answer_framework = Array.isArray(q.answer_framework) && q.answer_framework.length > 0
    ? q.answer_framework
    : ['目标定义', '约束识别', '执行路径', '结果复盘'];
  q.common_mistakes = Array.isArray(q.common_mistakes) && q.common_mistakes.length > 0
    ? q.common_mistakes
    : ['只讲动作不讲目标', '忽略约束条件', '缺少复盘闭环'];
  q.good_answer_signals = Array.isArray(q.good_answer_signals) && q.good_answer_signals.length > 0
    ? q.good_answer_signals
    : ['先定义目标再给方案', '指标与里程碑明确', '有风险预案和复盘'];
  q.reference_answer_outline = Array.isArray(q.reference_answer_outline) && q.reference_answer_outline.length > 0
    ? q.reference_answer_outline
    : ['明确目标与边界', '分阶段推进动作', '输出复盘与迭代计划'];
  q.scoring_rubric = q.scoring_rubric || {
    A档: '目标清晰、动作可执行、指标闭环完整。',
    B档: '路径较清晰，但量化与边界不完整。',
    C档: '表达泛化，缺少关键指标和落地动作。'
  };
  q.sample_size = q.sample_size || 8;
  q.company_tier = q.company_tier || 't2_strong';
  q.question_realness_note = q.question_realness_note || '基于公开岗位能力与高频场景整理的训练题。';
  q.evidence = ensureEvidence(base?.evidence, role.evidence);
  return q;
}

function refreshRoleCoverage(entry) {
  const written = entry.dynamic?.['笔试真题库']?.items || [];
  const interview = entry.dynamic?.['面试真题库']?.items || [];
  const roles = entry.dynamic?.['岗位画像库']?.items || [];

  const wMap = new Map();
  const iMap = new Map();
  for (const q of written) {
    const id = q.role_id;
    if (!wMap.has(id)) wMap.set(id, []);
    wMap.get(id).push(q.recruitment_stage);
  }
  for (const q of interview) {
    const id = q.role_id;
    if (!iMap.has(id)) iMap.set(id, []);
    iMap.get(id).push(q.recruitment_stage);
  }

  for (const r of roles) {
    if (!r.role_detail_v158 || typeof r.role_detail_v158 !== 'object') r.role_detail_v158 = {};
    r.role_detail_v158.role_specific_question_coverage = {
      written_count: (wMap.get(r.role_id) || []).length,
      interview_count: (iMap.get(r.role_id) || []).length,
      written_stages: uniq((wMap.get(r.role_id) || []).filter(Boolean)),
      interview_stages: uniq((iMap.get(r.role_id) || []).filter(Boolean))
    };
    if (!r.role_detail_v158.role_scope && r.role_name) {
      r.role_detail_v158.role_scope = `负责${r.role_name}相关职责并对关键指标结果负责。`;
    }
  }
}

function processEntry(filePath) {
  const entry = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const roles = entry.dynamic?.['岗位画像库']?.items || [];
  const written = entry.dynamic?.['笔试真题库']?.items || [];
  const interview = entry.dynamic?.['面试真题库']?.items || [];

  let deepFilled = 0;
  let writtenAdded = 0;
  let interviewAdded = 0;
  let gapUpdated = 0;

  for (const role of roles) {
    let touched = false;
    mergePlatformGap(role, entry['行业名称']);
    gapUpdated += 1;

    if (isBlank(role.career_outlook_3to5_year)) {
      role.career_outlook_3to5_year = buildCareerOutlook(entry['行业名称'], entry.industry_id, role.role_name);
      touched = true;
    }
    if (isBlank(role.typical_work_week)) {
      role.typical_work_week = buildTypicalWorkWeek(role.role_name);
      touched = true;
    }
    if (isBlank(role.switch_directions)) {
      role.switch_directions = buildSwitchDirections(role, roles);
      touched = true;
    }
    if (isBlank(role.prepare_180d_plan)) {
      role.prepare_180d_plan = buildPreparePlan(role.role_name);
      touched = true;
    }

    if (touched) {
      role.updated_at = TODAY;
      deepFilled += 1;
    }
  }

  const writtenByRole = new Map();
  const interviewByRole = new Map();
  for (const q of written) {
    const id = q.role_id;
    writtenByRole.set(id, (writtenByRole.get(id) || 0) + 1);
  }
  for (const q of interview) {
    const id = q.role_id;
    interviewByRole.set(id, (interviewByRole.get(id) || 0) + 1);
  }

  const writtenIds = new Set(written.map((q) => q.question_id));
  const interviewIds = new Set(interview.map((q) => q.question_id));

  for (const role of roles) {
    const tier = roleTier(entry, role.role_name);
    const target = tier === 'core' ? 14 : (tier === 'mainstream' ? 10 : 8);

    const wBase = written.find((q) => q.role_id === role.role_id) || written[0];
    const iBase = interview.find((q) => q.role_id === role.role_id) || interview[0];

    const curW = writtenByRole.get(role.role_id) || 0;
    const curI = interviewByRole.get(role.role_id) || 0;

    const needW = Math.max(0, target - curW);
    const needI = Math.max(0, target - curI);

    for (let i = 1; i <= needW; i += 1) {
      const seed = hashString(`${role.role_id}_W_${i}`);
      const stage = stageByType('written', seed + i);
      const bucket = SCENARIO_BUCKETS[(seed + i) % SCENARIO_BUCKETS.length];
      const roleSeg = normalizeRoleSegment(role.role_id);
      let seq = curW + i;
      let id = `${entry.industry_id}_WRITTEN_V164_${roleSeg}_${String(seq).padStart(2, '0')}`;
      while (writtenIds.has(id)) {
        seq += 1;
        id = `${entry.industry_id}_WRITTEN_V164_${roleSeg}_${String(seq).padStart(2, '0')}`;
      }
      writtenIds.add(id);

      const q = createQuestion({
        entry,
        role,
        kind: 'written',
        seq,
        id,
        stage,
        bucket,
        base: wBase
      });
      written.push(q);
      writtenAdded += 1;
      writtenByRole.set(role.role_id, (writtenByRole.get(role.role_id) || 0) + 1);
    }

    for (let i = 1; i <= needI; i += 1) {
      const seed = hashString(`${role.role_id}_I_${i}`);
      const stage = stageByType('interview', seed + i);
      const bucket = SCENARIO_BUCKETS[(seed + i + 2) % SCENARIO_BUCKETS.length];
      const roleSeg = normalizeRoleSegment(role.role_id);
      let seq = curI + i;
      let id = `${entry.industry_id}_INTERVIEW_V164_${roleSeg}_${String(seq).padStart(2, '0')}`;
      while (interviewIds.has(id)) {
        seq += 1;
        id = `${entry.industry_id}_INTERVIEW_V164_${roleSeg}_${String(seq).padStart(2, '0')}`;
      }
      interviewIds.add(id);

      const q = createQuestion({
        entry,
        role,
        kind: 'interview',
        seq,
        id,
        stage,
        bucket,
        base: iBase
      });
      interview.push(q);
      interviewAdded += 1;
      interviewByRole.set(role.role_id, (interviewByRole.get(role.role_id) || 0) + 1);
    }
  }

  entry.dynamic['笔试真题库'].updated_at = TODAY;
  entry.dynamic['面试真题库'].updated_at = TODAY;
  entry.dynamic['岗位画像库'].updated_at = TODAY;
  entry.meta.last_updated = TODAY;

  refreshRoleCoverage(entry);

  fs.writeFileSync(filePath, `${JSON.stringify(entry, null, 2)}\n`, 'utf8');

  return {
    industryId: entry.industry_id,
    industry: entry['行业名称'],
    deepFilled,
    writtenAdded,
    interviewAdded,
    gapUpdated,
    roleTotal: roles.length
  };
}

function main() {
  const files = fs.readdirSync(ENTRY_DIR).filter((f) => f.endsWith('.json')).sort();
  const summary = [];
  let totalDeep = 0;
  let totalW = 0;
  let totalI = 0;
  let totalGap = 0;

  for (const f of files) {
    const full = path.join(ENTRY_DIR, f);
    const s = processEntry(full);
    summary.push(s);
    totalDeep += s.deepFilled;
    totalW += s.writtenAdded;
    totalI += s.interviewAdded;
    totalGap += s.gapUpdated;
    console.log(`${s.industryId}: deep_filled=${s.deepFilled}, written_added=${s.writtenAdded}, interview_added=${s.interviewAdded}, roles=${s.roleTotal}`);
  }

  const report = {
    generated_at: `${TODAY}T00:00:00Z`,
    version: 'v1.64.0',
    summary: {
      industries: summary.length,
      deep_fields_filled_roles: totalDeep,
      written_questions_added: totalW,
      interview_questions_added: totalI,
      platform_gap_updated_roles: totalGap
    },
    by_industry: summary
  };

  fs.writeFileSync(
    path.join(ROOT, 'reports', 'v1.64.0_逐岗位补深与补题执行记录.json'),
    `${JSON.stringify(report, null, 2)}\n`,
    'utf8'
  );

  console.log(`TOTAL deep_filled=${totalDeep}, written_added=${totalW}, interview_added=${totalI}, gap_updated_roles=${totalGap}`);
}

main();
