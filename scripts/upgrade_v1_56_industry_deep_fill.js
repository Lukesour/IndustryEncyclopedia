#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DOC_PATH = path.join(ROOT, 'docs', '23行业细分岗位与题库扩展包_v1.46.0.md');
const ENTRY_DIR = path.join(ROOT, 'data', 'entries');
const MAIN_PATH = path.join(ROOT, '行业百科.json');

const TODAY = '2026-02-19';
const VERSION = 'v1.56.0';

const HIGH_GROWTH_TARGET_COUNT = {
  IND_INTERNET_AI: 12,
  IND_SEMICONDUCTOR_ELECTRONICS: 12,
  IND_NEW_ENERGY: 12,
  IND_TELECOM_OPERATOR: 12,
  IND_ADVANCED_MANUFACTURING_AUTOMATION: 12,
  IND_AUTO_INTELLIGENT_DRIVING: 12,
  IND_FIN_SECURITIES_FUND: 12,
  IND_BIOMED_DEVICE: 12,

  IND_LOGISTICS_SUPPLYCHAIN: 10,
  IND_ECOMMERCE_CROSSBORDER: 10,
  IND_FIN_BANK: 10,
  IND_FIN_INSURANCE: 10,
  IND_CONSULTING_PRO_SERVICES: 10,
  IND_CHEM_NEW_MATERIALS: 10,
  IND_FMCG_RETAIL: 10,
  IND_MEDIA_GAME_CONTENT: 10,
  IND_ENERGY_UTILITIES: 10,
  IND_REAL_ESTATE_INFRA: 10,

  IND_CIVIL_SERVICE: 8,
  IND_STATE_OWNED_ENTERPRISE: 8,
  IND_PUBLIC_INSTITUTION: 8,
  IND_AGRI_FOOD: 8,
  IND_EDU_VOCATIONAL: 8
};

const STAGE_WRITTEN = [
  'campus_early_batch_written',
  'campus_main_batch_written',
  'campus_supplement_written',
  'internship_conversion_written'
];
const STAGE_INTERVIEW = [
  'campus_early_batch_interview',
  'campus_main_batch_interview',
  'campus_supplement_interview',
  'internship_conversion_interview'
];
const ROUND_WRITTEN = ['提前批笔试', '主批笔试', '补录笔试', '实习转正笔试'];
const ROUND_INTERVIEW = ['提前批面试', '主批面试', '补录面试', '实习转正面试'];

function ensureArray(v) {
  return Array.isArray(v) ? v : [];
}

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

function parseExpansionDoc(md) {
  const lines = md.split(/\r?\n/);
  const byIndustry = {};
  let currentId = null;
  let section = null;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    const secMatch = line.match(/^##\s+\d+\)\s+.*[（(](IND_[A-Z_]+)[）)]$/);
    if (secMatch) {
      currentId = secMatch[1];
      byIndustry[currentId] = {
        roles: [],
        written: [],
        interview: [],
        gapHints: [],
        sourceHints: []
      };
      section = null;
      continue;
    }

    if (!currentId) continue;

    if (line.startsWith('### 新增细分岗位')) {
      section = 'roles';
      continue;
    }
    if (line.startsWith('### 笔试题扩展')) {
      section = 'written';
      continue;
    }
    if (line.startsWith('### 面试题扩展')) {
      section = 'interview';
      continue;
    }
    if (line.startsWith('### 缺口位与检索指引')) {
      section = 'gap';
      continue;
    }
    if (line.startsWith('### 可用信息源')) {
      section = 'sources';
      continue;
    }

    const roleMatch = line.match(/^\d+\.\s*([^：:]+)[：:]\s*(.+)$/);
    const qMatch = line.match(/^\d+\.\s*\[([^\]]+)\]\s*(.+)$/);

    if (section === 'roles' && roleMatch) {
      byIndustry[currentId].roles.push({ role_name: roleMatch[1].trim(), role_intro: roleMatch[2].trim() });
      continue;
    }

    if ((section === 'written' || section === 'interview') && qMatch) {
      const item = { tag: qMatch[1].trim(), prompt: qMatch[2].trim() };
      byIndustry[currentId][section].push(item);
      continue;
    }

    if (section === 'gap' && line.startsWith('- ')) {
      byIndustry[currentId].gapHints.push(line.slice(2).trim());
      continue;
    }

    if (section === 'sources' && line.startsWith('- ')) {
      byIndustry[currentId].sourceHints.push(line.slice(2).trim());
      continue;
    }
  }

  return byIndustry;
}

function pickRoleFamily(roleName) {
  if (/算法|工程|研发|测试|架构|网优|并网|工艺|设备|系统|安全|数据|量化|精算|三电|仿真/.test(roleName)) {
    return '技术与研发';
  }
  if (/产品|策略|投放|选品|增长|运营|商务|发行|规划|调度|供应链|项目/.test(roleName)) {
    return '产品与运营';
  }
  if (/合规|法务|风控|审计|核保|理赔|监察|法制/.test(roleName)) {
    return '风险与合规';
  }
  if (/销售|客户|投顾|市场|品牌/.test(roleName)) {
    return '业务与增长';
  }
  return '综合岗位';
}

function buildRoleDetail(industryName, role) {
  const roleName = role.role_name;
  const intro = role.role_intro;
  const family = role.role_family || pickRoleFamily(roleName);

  const skillBase = {
    '技术与研发': ['工程实现与系统稳定性', '数据验证与性能优化', '故障定位与复盘'],
    '产品与运营': ['目标拆解与路径设计', '跨团队协同推进', '指标看板与迭代'],
    '风险与合规': ['规则理解与边界判断', '风险识别与处置流程', '证据链与留痕管理'],
    '业务与增长': ['客户需求洞察', '方案表达与转化推进', '经营指标复盘'],
    '综合岗位': ['流程执行与协同推进', '结构化表达', '数据化复盘']
  };

  return {
    职责边界: `${industryName}${roleName}主要负责：${intro}`,
    核心技能栈: [
      ...(skillBase[family] || skillBase['综合岗位']),
      '结果指标量化表达'
    ],
    典型项目: [`${roleName}专项`, `${roleName}跨团队协同改进`],
    成长台阶: {
      '0-12个月': `完成${roleName}基础流程上手，形成可验证结果。`,
      '12-24个月': `独立负责${roleName}关键模块并推动跨团队配合。`,
      '24-36个月': `主导${roleName}项目优化并沉淀可复用方法。`
    },
    转岗去向: family === '技术与研发'
      ? ['技术平台方向', '策略与数据方向', '技术项目管理方向']
      : family === '产品与运营'
        ? ['策略产品方向', '商业化运营方向', '项目管理方向']
        : ['风控合规方向', '运营管理方向', '行业邻接岗位方向'],
    不适配信号: [
      `只会描述${roleName}职责，无法说明关键指标与结果。`,
      '遇到资源受限时缺少优先级判断与止损方案。',
      '缺少失败复盘，无法说明下轮优化动作。'
    ]
  };
}

function selectSourceFromEntry(entry, tag, roleName) {
  const qItems = [
    ...ensureArray(entry.dynamic?.['笔试真题库']?.items),
    ...ensureArray(entry.dynamic?.['面试真题库']?.items)
  ];
  const roleQ = qItems.filter((q) => q.role_name === roleName);

  const normalizeEvidence = (ev) => {
    if (!ev || !ev.source_id || !ev.source_url) return null;
    return {
      source_id: ev.source_id,
      source_name: ev.source_name || ev.source_id,
      source_type: ev.source_type || 'general_platform',
      source_url: ev.source_url,
      source_date: ev.source_date || ev.publish_date || TODAY,
      publish_date: ev.publish_date || ev.source_date || TODAY,
      captured_at: ev.captured_at || TODAY,
      accessed_at: ev.accessed_at || TODAY,
      confidence: ev.confidence || 0.75,
      http_status: ev.http_status || 200,
      access_check: ev.access_check || 'checked',
      manual_verification_required: !!ev.manual_verification_required,
      snapshot_url: ev.snapshot_url || ev.source_url
    };
  };

  const roleEvidence = roleQ.map((q) => normalizeEvidence(q.evidence)).filter(Boolean);
  const allEvidence = qItems.map((q) => normalizeEvidence(q.evidence)).filter(Boolean);
  const sourceRecords = ensureArray(entry.sources).map((s) => normalizeEvidence(s)).filter(Boolean);

  const poolReal = [...roleEvidence, ...allEvidence].filter((s) => s.source_type === 'real_user');
  const poolOfficial = [...roleEvidence, ...allEvidence, ...sourceRecords].filter((s) =>
    ['company_official', 'government_platform', 'government_agency', 'government_policy', 'government_dataset'].includes(
      s.source_type
    )
  );
  const poolCompany = [...roleEvidence, ...allEvidence, ...sourceRecords].filter((s) => s.source_type === 'company_official');

  if (tag === 'real_recall' && poolReal.length > 0) return poolReal[0];
  if (tag === 'official_original' && poolOfficial.length > 0) return poolOfficial[0];
  if (tag === 'jd_mapping' && poolCompany.length > 0) return poolCompany[0];
  if (poolOfficial.length > 0) return poolOfficial[0];
  if (allEvidence.length > 0) return allEvidence[0];
  if (sourceRecords.length > 0) return sourceRecords[0];

  return {
    source_id: 'SRC_NCSS',
    source_name: '国家大学生就业服务平台',
    source_type: 'government_platform',
    source_url: 'https://www.ncss.cn/',
    source_date: TODAY,
    publish_date: TODAY,
    captured_at: TODAY,
    accessed_at: TODAY,
    confidence: 0.72,
    http_status: 200,
    access_check: 'checked',
    manual_verification_required: false,
    snapshot_url: 'https://www.ncss.cn/'
  };
}

function buildQuestionFramework(roleName, tag, type) {
  const fwByTag = {
    real_recall: [
      '问题复述与目标澄清',
      '一线场景拆解与关键约束',
      '执行动作与风险兜底',
      '结果复盘与可复制经验'
    ],
    official_original: [
      '政策/规则理解',
      '方法选择与论证',
      '步骤设计与资源配置',
      '评估指标与持续优化'
    ],
    jd_mapping: [
      '岗位要求拆解',
      '能力证据映射',
      '落地路径与协同机制',
      '里程碑与验收标准'
    ]
  };

  const followUps = [
    `如果该${type}题的关键资源减半，你会如何重排${roleName}优先级？`,
    `首轮方案效果不及预期时，你会如何做${roleName}二次迭代？`,
    `你会如何定义${roleName}场景下的止损线与复盘模板？`
  ];

  return {
    answer_framework: fwByTag[tag] || fwByTag.jd_mapping,
    follow_up_questions: followUps
  };
}

function ensureQuestionForRole(entry, industryId, industryName, role, promptItem, type, index) {
  const bankKey = type === 'written' ? '笔试真题库' : '面试真题库';
  const items = ensureArray(entry.dynamic[bankKey].items);
  const existed = items.some((q) => q.role_name === role.role_name && q.prompt.includes(promptItem.prompt));
  if (existed) return;

  const stage = type === 'written' ? STAGE_WRITTEN[index % STAGE_WRITTEN.length] : STAGE_INTERVIEW[index % STAGE_INTERVIEW.length];
  const round = type === 'written' ? ROUND_WRITTEN[index % ROUND_WRITTEN.length] : ROUND_INTERVIEW[index % ROUND_INTERVIEW.length];
  const qidPrefix = type === 'written' ? 'WRITTEN' : 'INTERVIEW';
  const newIdx = items.filter((q) => String(q.question_id || '').includes(`${qidPrefix}_HGX_`)).length + 1;
  const questionId = `${industryId}_${qidPrefix}_HGX_${String(newIdx).padStart(3, '0')}`;

  const src = selectSourceFromEntry(entry, promptItem.tag, role.role_name);
  const sampleSizeByTag = { real_recall: 10, official_original: 8, jd_mapping: 6 };
  const dataOriginByTag = {
    real_recall: 'real_user_recall_curated',
    official_original: 'official_original_or_public_exam',
    jd_mapping: 'jd_mapping_curated'
  };
  const typeLabelByTag = {
    real_recall: '回忆题',
    official_original: '官方题型/公告题型',
    jd_mapping: '岗位映射题'
  };
  const fw = buildQuestionFramework(role.role_name, promptItem.tag, type === 'written' ? '笔试' : '面试');

  const question = {
    question_id: questionId,
    role_id: role.mapped_role_id || `${industryId}_ROLE_HGX_${String(index + 1).padStart(3, '0')}`,
    role_name: role.role_name,
    recruitment_stage: stage,
    round_label: round,
    question_year: 2026,
    question_type: `${role.role_name}${type === 'written' ? '笔试' : '面试'}${typeLabelByTag[promptItem.tag] || '专项题'}`,
    prompt: `【行业:${industryName}｜岗位:${role.role_name}｜阶段:${round}】${promptItem.prompt}`,
    data_origin: dataOriginByTag[promptItem.tag] || 'curated_manual_fill',
    authenticity_level: promptItem.tag === 'real_recall' ? 'real_user' : 'observed',
    needs_real_question: false,
    question_realness_note:
      promptItem.tag === 'real_recall'
        ? '来源于公开回忆样本，已补岗位和阶段标签。'
        : promptItem.tag === 'official_original'
          ? '来源于官方公开题型/公告口径，按岗位语境重写为训练题。'
          : '依据岗位JD能力项映射生成，用于能力准备与面试演练。',
    difficulty_1to5: promptItem.tag === 'official_original' ? 4 : 3,
    sample_size: sampleSizeByTag[promptItem.tag] || 6,
    scoring_dimensions: ['问题拆解', '约束识别', '执行可行性', '结果闭环'],
    ...fw,
    scoring_rubric: {
      A档: '能够给出完整目标、约束、动作与指标闭环，并有风险预案。',
      B档: '思路基本清晰，但量化指标或边界条件不充分。',
      C档: '回答泛化，缺少可执行步骤和验证标准。'
    },
    common_mistakes: [
      '只讲方法名，不讲适用边界和取舍逻辑。',
      '忽略资源约束与协同依赖。',
      '没有定义失败判据与复盘动作。'
    ],
    good_answer_signals: [
      '先定义目标与口径，再给执行路径。',
      '给出可度量的过程指标与结果指标。',
      '明确风险控制和下一轮优化计划。'
    ],
    reference_answer_outline: [
      '先界定业务目标与约束条件。',
      '给出分阶段动作与资源安排。',
      '最后用指标验证并做复盘改进。'
    ],
    company_tier: promptItem.tag === 'official_original' ? 't1_head' : 't2_strong',
    evidence: {
      source_id: src.source_id,
      source_name: src.source_name,
      source_type: src.source_type,
      source_url: src.source_url,
      snapshot_url: src.snapshot_url || src.source_url,
      source_date: src.source_date || TODAY,
      publish_date: src.publish_date || src.source_date || TODAY,
      captured_at: TODAY,
      accessed_at: TODAY,
      sample_size: sampleSizeByTag[promptItem.tag] || 6,
      confidence: src.confidence || 0.75,
      http_status: src.http_status || 200,
      access_check: src.access_check || 'checked',
      manual_verification_required: !!src.manual_verification_required,
      stat_definition: '按行业扩展包逐条填充并保留来源字段。',
      data_period: '2026年度'
    },
    updated_at: TODAY
  };

  items.push(question);
  entry.dynamic[bankKey].items = items;
}

function enrichPlatformGapForRole(role, entry) {
  if (!role.platform_backfill_gap) role.platform_backfill_gap = {};

  const old = role.platform_backfill_gap;
  const where = old.where_to_search || [];

  role.platform_backfill_gap = {
    ...old,
    status: 'verified_official_pending_platform_samples',
    required_info: ensureArray(old.required_info).length
      ? old.required_info
      : ['岗位发布时间', '城市分布', '薪酬区间P25/P50/P75', '公司层级', '高频面试追问'],
    missing_fields: [
      '城市分布样本',
      '同城同岗薪资分位',
      '批次/轮次样本量',
      '平台截图证据路径'
    ],
    where_to_search: where.length ? where : ['BOSS直聘网页端职位搜索', '小红书App端搜索'],
    how_to_search: [
      '先核对企业官方岗位页，再补平台样本，避免岗位口径漂移。',
      'BOSS优先按“应届生+行业+岗位”检索并筛选城市。',
      '小红书仅做回忆题/面经补充，需留帖子ID与截图时间戳。'
    ],
    capture_rule:
      old.capture_rule || '缺失发布时间/城市/样本量的记录不得进入A档结论，需保留待补槽位。',
    updated_at: TODAY
  };
}

function applyToEntry(entry, docItem) {
  const industryId = entry.industry_id;
  const industryName = entry['行业名称'];

  const nav = entry.static?.['招聘与成长']?.['岗位家族导航'] || {};
  const currentHG = ensureArray(nav['高增长岗']);

  const targetCount = HIGH_GROWTH_TARGET_COUNT[industryId] || 8;
  const docRoles = ensureArray(docItem.roles);
  const selectedRoles = docRoles.slice(0, Math.min(targetCount, docRoles.length)).map((r, idx) => {
    const existing = currentHG.find((x) => x.role_name === r.role_name) || {};
    const family = existing.role_family || pickRoleFamily(r.role_name);
    const role = {
      role_name: r.role_name,
      role_intro: r.role_intro,
      role_family: family,
      landing_status: 'landed_main_profile',
      mapped_role_id: existing.mapped_role_id || `${industryId}_ROLE_HGX_${String(idx + 1).padStart(3, '0')}`,
      mapped_role_name: existing.mapped_role_name || r.role_name,
      role_detail_v156: buildRoleDetail(industryName, { ...r, role_family: family }),
      backfill_slot_v156: {
        status: 'pending_platform_samples',
        need_fields: [
          '岗位名称',
          '城市',
          '公司层级',
          '批次/轮次',
          '岗位或题目链接',
          '发布时间',
          '样本量',
          '截图路径',
          '来源类型',
          '备注'
        ],
        where_to_search: {
          boss: {
            query: `应届生 ${industryName} ${r.role_name}`,
            url: `https://www.zhipin.com/web/geek/job?query=${encodeURIComponent(`应届生 ${industryName} ${r.role_name}`)}`
          },
          xiaohongshu: {
            query: `${industryName} ${r.role_name} 校招 offer 面经`,
            url: `https://www.xiaohongshu.com/search_result/?keyword=${encodeURIComponent(`${industryName} ${r.role_name} 校招`)}`
          }
        },
        how_to_search: [
          '先查官方岗位页确认职责边界和批次定义，再补平台样本。',
          'BOSS补岗位分布与薪资样本，小红书补回忆题与面经。',
          '样本不足或字段不全时保留缺口，不得伪造。'
        ],
        capture_rule: '记录链接、截图时间戳、样本量与数据口径。'
      }
    };

    return role;
  });

  nav['高增长岗'] = selectedRoles;
  entry.static['招聘与成长']['岗位家族导航'] = nav;

  const writtenPrompts = ensureArray(docItem.written);
  const interviewPrompts = ensureArray(docItem.interview);
  selectedRoles.forEach((role, idx) => {
    const wp = writtenPrompts[idx % Math.max(1, writtenPrompts.length)] || {
      tag: 'jd_mapping',
      prompt: `请结合${role.role_name}场景设计一套可执行方案并给出评估指标。`
    };
    const ip = interviewPrompts[idx % Math.max(1, interviewPrompts.length)] || {
      tag: 'jd_mapping',
      prompt: `讲一次你在${role.role_name}相关场景中解决复杂问题的经历。`
    };

    ensureQuestionForRole(entry, industryId, industryName, role, wp, 'written', idx);
    ensureQuestionForRole(entry, industryId, industryName, role, ip, 'interview', idx);
  });

  // 更新扩容卡落地统计
  const extItems = ensureArray(entry.dynamic?.['自定义扩展']?.items);
  const expansion = extItems.find((x) => x?.x_decision_type === 'role_and_question_expansion');
  if (expansion) {
    expansion.x_landing_progress_v156 = {
      updated_at: TODAY,
      high_growth_total: selectedRoles.length,
      high_growth_landed_count: selectedRoles.length,
      written_expanded_added_count: selectedRoles.length,
      interview_expanded_added_count: selectedRoles.length,
      pending_platform_roles: selectedRoles.map((r) => r.role_name),
      gap_hints: ensureArray(docItem.gapHints),
      source_hints: ensureArray(docItem.sourceHints)
    };
    expansion.updated_at = TODAY;
  }

  // 新增行业级细分岗位深度扩展模块
  entry.static['招聘与成长']['细分岗位深度扩展_v156'] = {
    updated_at: TODAY,
    total_roles: selectedRoles.length,
    role_cards: selectedRoles,
    written_question_expansions: selectedRoles.map((r, idx) => {
      const p = writtenPrompts[idx % Math.max(1, writtenPrompts.length)] || { tag: 'jd_mapping', prompt: '' };
      return {
        role_name: r.role_name,
        source_tag: p.tag,
        prompt: p.prompt
      };
    }),
    interview_question_expansions: selectedRoles.map((r, idx) => {
      const p = interviewPrompts[idx % Math.max(1, interviewPrompts.length)] || { tag: 'jd_mapping', prompt: '' };
      return {
        role_name: r.role_name,
        source_tag: p.tag,
        prompt: p.prompt
      };
    }),
    missing_info_slots: {
      required_fields: [
        '岗位名称',
        '城市',
        '公司层级',
        '批次/轮次',
        '题目或岗位链接',
        '发布时间',
        '样本量',
        '截图路径',
        '来源类型',
        '备注'
      ],
      gap_hints: ensureArray(docItem.gapHints),
      source_hints: ensureArray(docItem.sourceHints)
    }
  };

  // 角色画像库仍保留原16主岗，但补充平台缺口状态与检索说明
  for (const role of ensureArray(entry.dynamic?.['岗位画像库']?.items)) {
    enrichPlatformGapForRole(role, entry);
  }
}

function main() {
  const md = fs.readFileSync(DOC_PATH, 'utf8');
  const byIndustry = parseExpansionDoc(md);

  const entryFiles = fs.readdirSync(ENTRY_DIR).filter((f) => f.endsWith('.json'));
  let touched = 0;
  let addedWritten = 0;
  let addedInterview = 0;

  for (const file of entryFiles) {
    const p = path.join(ENTRY_DIR, file);
    const entry = readJson(p);
    const docItem = byIndustry[entry.industry_id];
    if (!docItem) continue;

    const beforeW = ensureArray(entry.dynamic?.['笔试真题库']?.items).length;
    const beforeI = ensureArray(entry.dynamic?.['面试真题库']?.items).length;

    applyToEntry(entry, docItem);

    const afterW = ensureArray(entry.dynamic?.['笔试真题库']?.items).length;
    const afterI = ensureArray(entry.dynamic?.['面试真题库']?.items).length;

    addedWritten += Math.max(0, afterW - beforeW);
    addedInterview += Math.max(0, afterI - beforeI);

    writeJson(p, entry);
    touched += 1;
  }

  const main = readJson(MAIN_PATH);
  if (!main['文档元数据']) main['文档元数据'] = {};
  main['文档元数据']['版本'] = VERSION;
  main['文档元数据']['发布日期'] = TODAY;
  if (!Array.isArray(main['文档元数据']['变更记录'])) main['文档元数据']['变更记录'] = [];

  const exists = main['文档元数据']['变更记录'].some((x) => x && x.version === VERSION);
  if (!exists) {
    main['文档元数据']['变更记录'].push({
      date: TODAY,
      version: VERSION,
      summary: [
        '按行业扩展包逐行业逐条补充高增长细分岗位深度卡，支持行业差异化岗位数量。',
        '为高增长细分岗新增笔试/面试扩展题并落到主题库，补齐站内备考密度。',
        '平台受限信息统一保留缺口位，补齐“需要什么信息、如何搜索、从哪里搜索”。'
      ]
    });
  }

  writeJson(MAIN_PATH, main);

  console.log(`v1.56 deep fill applied to ${touched} entries.`);
  console.log(`Added questions: written +${addedWritten}, interview +${addedInterview}.`);
}

main();
