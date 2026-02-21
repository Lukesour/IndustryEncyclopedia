#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TODAY = '2026-02-21';

const WRITTEN_STAGES = [
  ['campus_early_batch_written', '提前批笔试'],
  ['campus_main_batch_written', '主批笔试'],
  ['campus_supplement_written', '补录笔试'],
  ['internship_conversion_written', '实习转正笔试'],
  ['campus_early_batch_written', '提前批笔试'],
  ['campus_main_batch_written', '主批笔试'],
  ['campus_supplement_written', '补录笔试'],
  ['internship_conversion_written', '实习转正笔试'],
  ['campus_main_batch_written', '主批笔试'],
  ['campus_supplement_written', '补录笔试']
];

const INTERVIEW_STAGES = [
  ['campus_early_batch_interview', '提前批面试'],
  ['campus_main_batch_interview', '主批面试'],
  ['campus_supplement_interview', '补录面试'],
  ['internship_conversion_interview', '实习转正面试'],
  ['campus_early_batch_interview', '提前批面试'],
  ['campus_main_batch_interview', '主批面试'],
  ['campus_supplement_interview', '补录面试'],
  ['internship_conversion_interview', '实习转正面试'],
  ['campus_main_batch_interview', '主批面试'],
  ['campus_supplement_interview', '补录面试']
];

const updates = [
  {
    file: 'data/entries/IND_AUTO_INTELLIGENT_DRIVING.json',
    industryLabel: '汽车与智能驾驶',
    roleId: 'IND_AUTO_INTELLIGENT_DRIVING_ROLE_021',
    sourceRoleId: 'IND_AUTO_INTELLIGENT_DRIVING_ROLE_020',
    roleName: '智驾安全验证工程师',
    rolePatch: {
      role_readiness_floor: '至少完成1个智驾安全验证闭环：安全场景识别、验证计划制定、风险闭环与发布门禁联动。',
      day_in_life: '智驾安全验证工程师工作周：拆解高风险场景、执行安全验证、推进缺陷整改、组织回归评审并沉淀规范。',
      growth_path_1to3_year: '0-1年掌握安全验证标准；1-3年独立负责模块安全验证；3-5年可主导版本级安全门禁体系。',
      transfer_path_hint: '可转功能安全工程师、系统测试负责人、质量体系工程师；需补ISO26262与系统工程，过渡6-10个月。',
      prep_90d_plan: ['1-30天：梳理智驾安全指标与验证边界。', '31-60天：完成1个安全风险闭环案例。', '61-90天：完成10套安全验证题训练。'],
      career_outlook_3to5_year: '车企和供应链对安全验证要求提升，岗位需求持续增长。',
      typical_work_week: '发布窗口期安全评审、回归验证和跨团队沟通并行。',
      switch_directions: [
        { target_role: '功能安全工程师', switch_cost: '中高', bridge_skills: ['ISO26262', '失效模式分析'], transition_period: '7-10个月' },
        { target_role: '系统测试负责人', switch_cost: '中', bridge_skills: ['测试策略', '资源调度'], transition_period: '6-9个月' },
        { target_role: '质量体系工程师', switch_cost: '中', bridge_skills: ['流程治理', '门禁管理'], transition_period: '6-9个月' }
      ],
      prepare_180d_plan: ['91-120天：建立高风险场景验证看板。', '121-150天：主导1次安全失效复盘专项。', '151-180天：沉淀安全验证SOP与发布门禁清单。'],
      role_scope_text: '负责智驾安全验证策略与执行闭环，对关键风险覆盖率、缺陷关闭时效与安全门禁达成负责。'
    },
    commonDeductionPoints: ['只描述测试动作，不体现安全目标。', '风险分级和门禁标准不清。', '缺陷闭环缺少证据链。', '复盘未沉淀到流程机制。'],
    starTemplate: {
      situation: '新版本在夜间复杂路况触发高风险告警，临近发布节点。',
      task: '在发布前完成风险验证和缺陷闭环，确保门禁达标。',
      action: ['拆解风险场景并补齐验证覆盖。', '联动研发与测试完成高优缺陷修复。', '组织回归评审并更新门禁标准。'],
      result: ['高风险场景通过率恢复并按期发布。', '形成可复用的安全验证闭环机制。'],
      proof_materials: ['验证计划', '缺陷台账', '安全评审记录']
    },
    writtenTopics: [
      { type: '安全场景设计', bucket: 'business_scenario', text: '你如何设计智驾高风险场景安全验证方案？' },
      { type: '验证流程', bucket: 'system_process', text: '请设计“风险识别-验证-闭环-门禁”流程。' },
      { type: '失效复盘', bucket: 'failure_review', text: '一次安全验证失效后你如何复盘并修复？' },
      { type: '进度安全取舍', bucket: 'metric_tradeoff', text: '发布进度和安全门禁冲突时如何取舍？' },
      { type: '风险分级', bucket: 'business_scenario', text: '如何建立智驾安全风险分级策略？' },
      { type: '机制建设', bucket: 'system_process', text: '如何搭建版本安全验证看板？' },
      { type: '误判纠偏', bucket: 'failure_review', text: '一次风险误判导致漏测后如何纠偏？' },
      { type: '资源排序', bucket: 'metric_tradeoff', text: '多类风险并发时如何分配验证资源？' },
      { type: '跨团队协同', bucket: 'cross_team_collaboration', text: '如何推动算法、测试、质量三方协同？' },
      { type: '经验沉淀', bucket: 'system_process', text: '如何将安全验证经验沉淀为标准机制？' }
    ],
    interviewTopics: [
      { type: '应急处置', bucket: 'business_scenario', text: '发布前发现安全红线问题时你如何应急？' },
      { type: '协同推进', bucket: 'cross_team_collaboration', text: '研发与测试结论冲突时你如何推进闭环？' },
      { type: '复盘叙述', bucket: 'failure_review', text: '讲一次你修复安全验证失效的经历。' },
      { type: '优先级决策', bucket: 'metric_tradeoff', text: '多个安全问题并发时你如何排优先级？' },
      { type: '风险沟通', bucket: 'business_scenario', text: '你如何向管理层说明安全延期的必要性？' },
      { type: '机制协作', bucket: 'cross_team_collaboration', text: '如何建立常态化安全评审机制？' },
      { type: '失误修正', bucket: 'failure_review', text: '一次错误放行后你如何修正流程？' },
      { type: '指标取舍', bucket: 'metric_tradeoff', text: '覆盖率与执行效率冲突时如何取舍？' },
      { type: '方案答辩', bucket: 'business_scenario', text: '如何答辩你的安全验证计划？' },
      { type: '经验复制', bucket: 'cross_team_collaboration', text: '如何让团队复用你的安全闭环方法？' }
    ]
  },
  {
    file: 'data/entries/IND_BIOMED_DEVICE.json',
    industryLabel: '生物医药与器械',
    roleId: 'IND_BIOMED_DEVICE_ROLE_021',
    sourceRoleId: 'IND_BIOMED_DEVICE_ROLE_020',
    roleName: '医学证据运营专员',
    rolePatch: {
      role_readiness_floor: '至少完成1个医学证据运营项目：证据收集、分层管理、内容产出与效果复盘。',
      day_in_life: '医学证据运营专员工作周：整理证据需求、维护证据库、支持学术沟通、跟踪证据使用效果并迭代。',
      growth_path_1to3_year: '0-1年掌握证据分级与合规表达；1-3年独立负责产品线证据运营；3-5年可主导证据策略体系。',
      transfer_path_hint: '可转医学事务、市场准入、生物统计支持岗；需补卫生经济与政策解读能力，过渡6-10个月。',
      prep_90d_plan: ['1-30天：梳理医学证据类型与优先级。', '31-60天：完成1个证据更新复盘案例。', '61-90天：完成10套医学证据题训练。'],
      career_outlook_3to5_year: '证据驱动型决策增强，医学证据运营岗位需求持续提升。',
      typical_work_week: '新品上市与学术活动周期内证据支持需求密集。',
      switch_directions: [
        { target_role: '医学事务', switch_cost: '中', bridge_skills: ['学术沟通', '证据解读'], transition_period: '6-9个月' },
        { target_role: '市场准入岗', switch_cost: '中高', bridge_skills: ['卫生经济', '支付方沟通'], transition_period: '7-10个月' },
        { target_role: '生物统计支持岗', switch_cost: '中', bridge_skills: ['统计理解', '研究设计'], transition_period: '6-9个月' }
      ],
      prepare_180d_plan: ['91-120天：建立证据更新与淘汰机制。', '121-150天：主导1次证据失效复盘专项。', '151-180天：沉淀证据运营模板与指南。'],
      role_scope_text: '负责医学证据运营与分发闭环，对证据可用性、更新时效和业务支持效果负责。'
    },
    commonDeductionPoints: ['证据分层标准不清。', '引用依据缺少溯源。', '更新机制不及时。', '复盘无法支撑下轮运营。'],
    starTemplate: {
      situation: '核心产品学术沟通中证据引用不一致，影响对外表达质量。',
      task: '建立统一证据口径并提升证据响应效率。',
      action: ['梳理证据源并建立分级标签体系。', '联动医学团队统一答复模板。', '搭建更新机制并跟踪使用效果。'],
      result: ['证据一致性提升且响应时效改善。', '形成可复用的证据运营流程。'],
      proof_materials: ['证据库清单', '答复模板', '使用效果报表']
    },
    writtenTopics: [
      { type: '证据体系', bucket: 'business_scenario', text: '你如何搭建产品线医学证据运营体系？' },
      { type: '流程机制', bucket: 'system_process', text: '请设计“收集-分级-分发-更新”流程。' },
      { type: '失效复盘', bucket: 'failure_review', text: '一次证据失效导致沟通偏差后如何复盘？' },
      { type: '时效准确平衡', bucket: 'metric_tradeoff', text: '证据更新时效与准确性冲突时如何取舍？' },
      { type: '标签治理', bucket: 'business_scenario', text: '如何建立可检索的证据标签体系？' },
      { type: '机制建设', bucket: 'system_process', text: '如何建设证据版本管理与审校机制？' },
      { type: '误判纠偏', bucket: 'failure_review', text: '一次证据分级误判后如何纠偏？' },
      { type: '资源分配', bucket: 'metric_tradeoff', text: '多产品并发支持时如何分配证据运营资源？' },
      { type: '跨团队协同', bucket: 'cross_team_collaboration', text: '如何推动医学、市场、注册协同运营证据？' },
      { type: '经验沉淀', bucket: 'system_process', text: '如何沉淀高价值证据运营方法？' }
    ],
    interviewTopics: [
      { type: '突发应对', bucket: 'business_scenario', text: '突发问询需要快速证据支持时你如何应对？' },
      { type: '协同推进', bucket: 'cross_team_collaboration', text: '医学与市场证据口径不一致时你如何推进？' },
      { type: '复盘叙述', bucket: 'failure_review', text: '讲一次你修复证据运营失效的经历。' },
      { type: '优先级决策', bucket: 'metric_tradeoff', text: '多条证据需求并发时你如何排序？' },
      { type: '风险沟通', bucket: 'business_scenario', text: '你如何向上级解释证据不确定性风险？' },
      { type: '机制协作', bucket: 'cross_team_collaboration', text: '如何建立证据运营跨团队协作机制？' },
      { type: '失误修正', bucket: 'failure_review', text: '一次证据引用错误后你如何修正？' },
      { type: '取舍题', bucket: 'metric_tradeoff', text: '覆盖广度与证据深度冲突时如何取舍？' },
      { type: '方案答辩', bucket: 'business_scenario', text: '如何答辩你的证据运营改进方案？' },
      { type: '经验复制', bucket: 'cross_team_collaboration', text: '如何让团队复用你的证据运营机制？' }
    ]
  },
  {
    file: 'data/entries/IND_ECOMMERCE_CROSSBORDER.json',
    industryLabel: '电商与跨境电商',
    roleId: 'IND_ECOMMERCE_CROSSBORDER_ROLE_021',
    sourceRoleId: 'IND_ECOMMERCE_CROSSBORDER_ROLE_020',
    roleName: '跨境售后体验运营',
    rolePatch: {
      role_readiness_floor: '至少完成1个跨境售后优化项目：问题分类、流程整改、客服协同与满意度复盘。',
      day_in_life: '跨境售后体验运营工作周：跟踪退换货与投诉数据、识别服务痛点、推动流程优化、监控满意度和复购影响。',
      growth_path_1to3_year: '0-1年掌握售后指标和流程；1-3年独立负责售后优化专项；3-5年可主导跨区域体验治理。',
      transfer_path_hint: '可转用户体验运营、履约服务经理、客服质量负责人；需补流程治理与数据分析能力，过渡6-10个月。',
      prep_90d_plan: ['1-30天：梳理跨境售后链路和关键指标。', '31-60天：完成1个投诉高发环节复盘案例。', '61-90天：完成10套售后运营题训练。'],
      career_outlook_3to5_year: '跨境消费服务标准提升，售后体验运营岗位需求稳步增长。',
      typical_work_week: '活动高峰和物流波动期售后协同任务明显增加。',
      switch_directions: [
        { target_role: '用户体验运营', switch_cost: '中', bridge_skills: ['体验洞察', '旅程设计'], transition_period: '6-9个月' },
        { target_role: '履约服务经理', switch_cost: '中', bridge_skills: ['履约协同', '异常治理'], transition_period: '6-9个月' },
        { target_role: '客服质量负责人', switch_cost: '中高', bridge_skills: ['质控体系', '团队管理'], transition_period: '7-10个月' }
      ],
      prepare_180d_plan: ['91-120天：建立售后体验预警看板。', '121-150天：主导1次售后失效复盘专项。', '151-180天：沉淀售后体验优化SOP与案例库。'],
      role_scope_text: '负责跨境售后体验优化与闭环，对问题解决时效、满意度改善和投诉率下降负责。'
    },
    commonDeductionPoints: ['问题分类粗糙导致整改无效。', '流程优化未关联客户体验指标。', '跨团队责任边界不清。', '复盘不能落地到机制。'],
    starTemplate: {
      situation: '跨境退货投诉集中爆发，影响评分和复购。',
      task: '在两周内压降投诉并提升售后处理体验。',
      action: ['拆解投诉链路并重排处理优先级。', '联动仓配与客服优化退换流程。', '上线周度复盘和满意度跟踪机制。'],
      result: ['投诉率下降且满意度恢复。', '形成可复制的售后体验治理机制。'],
      proof_materials: ['投诉分析报告', '整改方案', '满意度追踪报表']
    },
    writtenTopics: [
      { type: '体验治理', bucket: 'business_scenario', text: '你如何设计跨境售后体验治理方案？' },
      { type: '流程机制', bucket: 'system_process', text: '请设计“识别-整改-验证-复盘”售后流程。' },
      { type: '失效复盘', bucket: 'failure_review', text: '一次售后整改无效后你如何复盘？' },
      { type: '时效体验平衡', bucket: 'metric_tradeoff', text: '处理时效与服务体验冲突时如何取舍？' },
      { type: '问题诊断', bucket: 'business_scenario', text: '如何定位跨境售后高发问题根因？' },
      { type: '机制建设', bucket: 'system_process', text: '如何建立售后体验预警机制？' },
      { type: '误判纠偏', bucket: 'failure_review', text: '一次投诉归因误判后如何纠偏？' },
      { type: '资源配置', bucket: 'metric_tradeoff', text: '多区域售后异常并发时如何分配资源？' },
      { type: '跨团队协同', bucket: 'cross_team_collaboration', text: '如何推动客服、物流、仓储协同整改？' },
      { type: '经验沉淀', bucket: 'system_process', text: '如何沉淀高复用售后体验优化方法？' }
    ],
    interviewTopics: [
      { type: '应急处置', bucket: 'business_scenario', text: '平台舆情突发时你如何组织售后应急？' },
      { type: '协同推进', bucket: 'cross_team_collaboration', text: '客服和物流责任冲突时你如何推进？' },
      { type: '复盘叙述', bucket: 'failure_review', text: '讲一次你修复售后体验失效的经历。' },
      { type: '优先级决策', bucket: 'metric_tradeoff', text: '多类售后问题并发时你如何排序？' },
      { type: '风险沟通', bucket: 'business_scenario', text: '你如何向管理层说明售后风险趋势？' },
      { type: '机制协作', bucket: 'cross_team_collaboration', text: '如何建立跨部门售后共治机制？' },
      { type: '失误修正', bucket: 'failure_review', text: '一次整改方向错误后你如何修正？' },
      { type: '取舍题', bucket: 'metric_tradeoff', text: '成本控制与售后体验冲突时如何取舍？' },
      { type: '方案答辩', bucket: 'business_scenario', text: '如何答辩你的售后优化方案？' },
      { type: '经验复制', bucket: 'cross_team_collaboration', text: '如何让其他站点复用你的售后机制？' }
    ]
  },
  {
    file: 'data/entries/IND_ENERGY_UTILITIES.json',
    industryLabel: '能源与公用事业',
    roleId: 'IND_ENERGY_UTILITIES_ROLE_021',
    sourceRoleId: 'IND_ENERGY_UTILITIES_ROLE_020',
    roleName: '电力负荷优化工程师',
    rolePatch: {
      role_readiness_floor: '至少完成1个负荷优化项目：负荷诊断、优化策略制定、执行监控和节能收益复盘。',
      day_in_life: '电力负荷优化工程师工作周：分析负荷曲线、制定削峰填谷方案、跟踪执行偏差、协同调度和用户侧优化。',
      growth_path_1to3_year: '0-1年掌握负荷优化方法；1-3年独立负责区域优化项目；3-5年可主导负荷优化体系建设。',
      transfer_path_hint: '可转需求响应分析师、调度优化工程师、能源产品经理；需补产品化与市场机制能力，过渡6-10个月。',
      prep_90d_plan: ['1-30天：梳理负荷优化指标与约束。', '31-60天：完成1个削峰效果复盘案例。', '61-90天：完成10套负荷优化题训练。'],
      career_outlook_3to5_year: '电网侧精细化运营深化，负荷优化工程岗位需求持续增长。',
      typical_work_week: '高峰负荷期优化策略调整与监测频次明显增加。',
      switch_directions: [
        { target_role: '需求响应分析师', switch_cost: '中', bridge_skills: ['响应机制', '策略评估'], transition_period: '6-9个月' },
        { target_role: '调度优化工程师', switch_cost: '中', bridge_skills: ['调度约束', '优化求解'], transition_period: '6-9个月' },
        { target_role: '能源产品经理', switch_cost: '中高', bridge_skills: ['产品设计', '客户方案'], transition_period: '7-10个月' }
      ],
      prepare_180d_plan: ['91-120天：建立负荷优化策略评估机制。', '121-150天：主导1次偏差复盘专项。', '151-180天：沉淀负荷优化SOP和参数模板。'],
      role_scope_text: '负责电力负荷优化策略设计与执行闭环，对削峰填谷效果、执行稳定性和收益达成负责。'
    },
    commonDeductionPoints: ['策略仅关注单一指标。', '执行偏差监测不到位。', '用户侧协同动作不明确。', '复盘无法迁移到新场景。'],
    starTemplate: {
      situation: '区域高峰期负荷持续超预期，原有优化策略失效。',
      task: '快速优化负荷策略并稳定运行指标。',
      action: ['拆解负荷来源并分层制定优化动作。', '联动调度与用户侧执行新策略。', '建立周度偏差跟踪与复盘机制。'],
      result: ['峰值负荷回落并提升运行稳定性。', '形成可复用的负荷优化闭环。'],
      proof_materials: ['负荷分析报告', '执行台账', '策略复盘记录']
    },
    writtenTopics: [
      { type: '策略设计', bucket: 'business_scenario', text: '你如何制定区域负荷优化策略？' },
      { type: '流程机制', bucket: 'system_process', text: '请设计“诊断-执行-监测-复盘”流程。' },
      { type: '失效复盘', bucket: 'failure_review', text: '一次负荷优化失效后你如何复盘？' },
      { type: '收益稳定平衡', bucket: 'metric_tradeoff', text: '优化收益与运行稳定冲突时如何取舍？' },
      { type: '负荷拆解', bucket: 'business_scenario', text: '如何拆解负荷波动并识别关键因素？' },
      { type: '机制建设', bucket: 'system_process', text: '如何建立负荷优化监控看板？' },
      { type: '误判纠偏', bucket: 'failure_review', text: '一次策略方向误判后如何纠偏？' },
      { type: '资源配置', bucket: 'metric_tradeoff', text: '多区域并发优化时如何分配资源？' },
      { type: '跨团队协同', bucket: 'cross_team_collaboration', text: '如何推动调度与用户侧协同执行？' },
      { type: '经验沉淀', bucket: 'system_process', text: '如何沉淀高效负荷优化方法？' }
    ],
    interviewTopics: [
      { type: '突发应对', bucket: 'business_scenario', text: '高峰负荷突发上升时你如何应急？' },
      { type: '协同推进', bucket: 'cross_team_collaboration', text: '调度与用户目标冲突时你如何推进？' },
      { type: '复盘叙述', bucket: 'failure_review', text: '讲一次你修复负荷策略失效的经历。' },
      { type: '优先级决策', bucket: 'metric_tradeoff', text: '多类优化任务并发时你如何排序？' },
      { type: '风险沟通', bucket: 'business_scenario', text: '你如何向管理层解释优化风险边界？' },
      { type: '机制协作', bucket: 'cross_team_collaboration', text: '如何建立负荷优化联动机制？' },
      { type: '失误修正', bucket: 'failure_review', text: '一次执行偏差扩大后你如何修正？' },
      { type: '取舍题', bucket: 'metric_tradeoff', text: '短期收益与长期稳定冲突时如何取舍？' },
      { type: '方案答辩', bucket: 'business_scenario', text: '如何答辩你的负荷优化计划？' },
      { type: '经验复制', bucket: 'cross_team_collaboration', text: '如何让团队复用你的优化方法？' }
    ]
  },
  {
    file: 'data/entries/IND_FIN_BANK.json',
    industryLabel: '金融-银行',
    roleId: 'IND_FIN_BANK_ROLE_021',
    sourceRoleId: 'IND_FIN_BANK_ROLE_020',
    roleName: '供应链金融客户经理',
    rolePatch: {
      role_readiness_floor: '至少完成1个供应链金融项目：核心企业场景梳理、上下游客户拓展、授信协同与贷后跟踪。',
      day_in_life: '供应链金融客户经理工作周：走访核心企业及上下游、设计融资方案、推动授信审批、跟踪资产质量并复盘。',
      growth_path_1to3_year: '0-1年掌握供应链金融产品与流程；1-3年独立经营行业链条客户；3-5年可主导区域供应链金融方案。',
      transfer_path_hint: '可转对公产品经理、交易银行客户经理、风险管理岗；需补产业研究与组合经营能力，过渡6-10个月。',
      prep_90d_plan: ['1-30天：梳理供应链金融典型场景与风险点。', '31-60天：完成1个链条客户复盘案例。', '61-90天：完成10套供应链金融题训练。'],
      career_outlook_3to5_year: '产业链数字化和普惠导向推动供应链金融岗位需求持续增加。',
      typical_work_week: '核心企业项目推进期上下游协同任务密集。',
      switch_directions: [
        { target_role: '对公产品经理', switch_cost: '中', bridge_skills: ['产品设计', '流程优化'], transition_period: '6-9个月' },
        { target_role: '交易银行客户经理', switch_cost: '中', bridge_skills: ['现金管理', '结算方案'], transition_period: '6-9个月' },
        { target_role: '风险管理岗', switch_cost: '中高', bridge_skills: ['组合监控', '预警体系'], transition_period: '7-10个月' }
      ],
      prepare_180d_plan: ['91-120天：建立链条客户经营预警看板。', '121-150天：主导1次风险暴露复盘专项。', '151-180天：沉淀供应链客户经营SOP。'],
      role_scope_text: '负责供应链金融客户拓展与经营，对链条客户渗透率、放款质量和贷后风险可控性负责。'
    },
    commonDeductionPoints: ['只看核心企业忽略上下游质量。', '场景方案缺少可执行路径。', '贷后跟踪与预警机制薄弱。', '复盘无法指导下轮拓展。'],
    starTemplate: {
      situation: '核心企业合作扩张后，上下游客户逾期风险上升。',
      task: '在扩大覆盖的同时控制资产质量。',
      action: ['重构客户分层和准入规则。', '联动审批与风控优化授信条件。', '建立贷后监测与预警复盘机制。'],
      result: ['放款规模增长且逾期率受控。', '形成可复制的链条经营机制。'],
      proof_materials: ['客户分层台账', '授信方案', '贷后复盘记录']
    },
    writtenTopics: [
      { type: '场景设计', bucket: 'business_scenario', text: '你如何为制造业链条设计供应链金融方案？' },
      { type: '流程机制', bucket: 'system_process', text: '请设计“拓展-授信-放款-贷后”流程。' },
      { type: '风险复盘', bucket: 'failure_review', text: '一次链条客户风险暴露后你如何复盘？' },
      { type: '增长风险平衡', bucket: 'metric_tradeoff', text: '拓展规模和资产质量冲突时如何取舍？' },
      { type: '客户分层', bucket: 'business_scenario', text: '如何构建供应链客户分层经营模型？' },
      { type: '机制建设', bucket: 'system_process', text: '如何建立贷后预警与处置机制？' },
      { type: '误判纠偏', bucket: 'failure_review', text: '一次准入误判后如何纠偏？' },
      { type: '资源配置', bucket: 'metric_tradeoff', text: '多链条并行时如何分配客户经营资源？' },
      { type: '跨团队协同', bucket: 'cross_team_collaboration', text: '如何推动业务、审批、风控协同？' },
      { type: '经验沉淀', bucket: 'system_process', text: '如何沉淀高质量供应链经营方法？' }
    ],
    interviewTopics: [
      { type: '突发应对', bucket: 'business_scenario', text: '核心企业经营波动时你如何应急调整？' },
      { type: '协同推进', bucket: 'cross_team_collaboration', text: '业务增长诉求与风控底线冲突时你怎么推进？' },
      { type: '复盘叙述', bucket: 'failure_review', text: '讲一次你修复链条风险的经历。' },
      { type: '优先级决策', bucket: 'metric_tradeoff', text: '多条供应链需求并发时你如何排序？' },
      { type: '风险沟通', bucket: 'business_scenario', text: '你如何向管理层解释结构性收缩策略？' },
      { type: '机制协作', bucket: 'cross_team_collaboration', text: '如何建立供应链金融协同机制？' },
      { type: '失误修正', bucket: 'failure_review', text: '一次授信策略失误后你如何修正？' },
      { type: '取舍题', bucket: 'metric_tradeoff', text: '短期放款与长期质量冲突时如何取舍？' },
      { type: '方案答辩', bucket: 'business_scenario', text: '如何答辩你的链条经营方案？' },
      { type: '经验复制', bucket: 'cross_team_collaboration', text: '如何让团队复用你的客户经营打法？' }
    ]
  },
  {
    file: 'data/entries/IND_FIN_SECURITIES_FUND.json',
    industryLabel: '金融-证券基金',
    roleId: 'IND_FIN_SECURITIES_FUND_ROLE_021',
    sourceRoleId: 'IND_FIN_SECURITIES_FUND_ROLE_020',
    roleName: '量化风控助理',
    rolePatch: {
      role_readiness_floor: '至少完成1个量化风控项目：风险因子监控、阈值预警、异常处置和策略复盘。',
      day_in_life: '量化风控助理工作周：监控组合风险暴露、校验模型阈值、输出预警报告、协同投研交易完成处置。',
      growth_path_1to3_year: '0-1年掌握量化风控指标；1-3年独立负责风控监测与复盘；3-5年可主导策略级风控框架建设。',
      transfer_path_hint: '可转量化研究员、风险管理经理、交易策略支持；需补建模与交易执行能力，过渡6-10个月。',
      prep_90d_plan: ['1-30天：梳理量化风控指标和阈值口径。', '31-60天：完成1个回撤事件复盘案例。', '61-90天：完成10套量化风控题训练。'],
      career_outlook_3to5_year: '多策略投资普及推动量化风控岗位需求上升。',
      typical_work_week: '市场高波动阶段监控与协同处置节奏显著加快。',
      switch_directions: [
        { target_role: '量化研究员', switch_cost: '中高', bridge_skills: ['因子建模', '回测体系'], transition_period: '7-10个月' },
        { target_role: '风险管理经理', switch_cost: '中', bridge_skills: ['风险治理', '制度建设'], transition_period: '6-9个月' },
        { target_role: '交易策略支持', switch_cost: '中', bridge_skills: ['执行监控', '盘面分析'], transition_period: '6-9个月' }
      ],
      prepare_180d_plan: ['91-120天：建立风险预警分级机制。', '121-150天：主导1次重大回撤复盘专项。', '151-180天：沉淀量化风控监控模板。'],
      role_scope_text: '负责量化风控监测与异常闭环，对风险暴露控制、预警时效和回撤管理质量负责。'
    },
    commonDeductionPoints: ['只报指标不做归因。', '阈值逻辑缺乏依据。', '异常处置路径不清。', '复盘未形成策略优化建议。'],
    starTemplate: {
      situation: '组合在短期波动中回撤快速扩大，触发多项风险阈值。',
      task: '快速定位风险来源并推动处置，控制回撤扩大。',
      action: ['拆解风险因子并识别异常策略。', '联动投研和交易执行调整暴露。', '复盘阈值设置并优化预警机制。'],
      result: ['回撤收敛且风险暴露回归可控。', '形成可复用的量化风控流程。'],
      proof_materials: ['风险监控报表', '预警记录', '复盘报告']
    },
    writtenTopics: [
      { type: '风险监测', bucket: 'business_scenario', text: '你如何设计量化组合的风险监测框架？' },
      { type: '流程机制', bucket: 'system_process', text: '请设计“监控-预警-处置-复盘”流程。' },
      { type: '回撤复盘', bucket: 'failure_review', text: '一次回撤扩大后你如何复盘？' },
      { type: '收益风险平衡', bucket: 'metric_tradeoff', text: '收益修复与风险收缩冲突时如何取舍？' },
      { type: '阈值设计', bucket: 'business_scenario', text: '如何设定可执行的量化风控阈值？' },
      { type: '机制建设', bucket: 'system_process', text: '如何建设分级预警和响应机制？' },
      { type: '误判纠偏', bucket: 'failure_review', text: '一次风险误报导致误操作后如何纠偏？' },
      { type: '资源配置', bucket: 'metric_tradeoff', text: '多策略告警并发时如何分配排查资源？' },
      { type: '跨团队协同', bucket: 'cross_team_collaboration', text: '如何推动投研与交易协同处置风险？' },
      { type: '经验沉淀', bucket: 'system_process', text: '如何沉淀量化风控复盘方法？' }
    ],
    interviewTopics: [
      { type: '应急处置', bucket: 'business_scenario', text: '市场剧烈波动时你如何组织风控应急？' },
      { type: '协同推进', bucket: 'cross_team_collaboration', text: '投研和风控意见冲突时你如何推进？' },
      { type: '复盘叙述', bucket: 'failure_review', text: '讲一次你控制回撤扩大的经历。' },
      { type: '优先级决策', bucket: 'metric_tradeoff', text: '多策略异常并发时你如何排序处理？' },
      { type: '风险沟通', bucket: 'business_scenario', text: '你如何向投资经理解释风险约束调整？' },
      { type: '机制协作', bucket: 'cross_team_collaboration', text: '如何建立投研交易风控联动机制？' },
      { type: '失误修正', bucket: 'failure_review', text: '一次阈值设置失误后你如何修正？' },
      { type: '取舍题', bucket: 'metric_tradeoff', text: '短期收益与风险预算冲突时如何取舍？' },
      { type: '方案答辩', bucket: 'business_scenario', text: '如何答辩你的风控阈值方案？' },
      { type: '经验复制', bucket: 'cross_team_collaboration', text: '如何让团队复用你的风险处置方法？' }
    ]
  },
  {
    file: 'data/entries/IND_NEW_ENERGY.json',
    industryLabel: '新能源',
    roleId: 'IND_NEW_ENERGY_ROLE_021',
    sourceRoleId: 'IND_NEW_ENERGY_ROLE_020',
    roleName: '并网策略优化工程师',
    rolePatch: {
      role_readiness_floor: '至少完成1个新能源并网优化项目：并网约束分析、策略调整、执行监测和收益复盘。',
      day_in_life: '并网策略优化工程师工作周：分析并网窗口和功率约束、优化并网策略、跟踪执行偏差、协同调度交易复盘。',
      growth_path_1to3_year: '0-1年掌握并网约束与策略优化；1-3年独立负责站点并网策略；3-5年可主导区域并网优化体系。',
      transfer_path_hint: '可转并网消纳工程师、交易策略工程师、储能调度工程师；需补市场规则与算法能力，过渡6-10个月。',
      prep_90d_plan: ['1-30天：梳理并网策略目标与边界。', '31-60天：完成1个并网偏差复盘案例。', '61-90天：完成10套并网优化题训练。'],
      career_outlook_3to5_year: '新能源并网消纳压力持续，策略优化岗位需求稳步上升。',
      typical_work_week: '并网窗口变化和限电波动期策略调整频繁。',
      switch_directions: [
        { target_role: '并网消纳工程师', switch_cost: '中', bridge_skills: ['调度规则', '并网分析'], transition_period: '6-9个月' },
        { target_role: '交易策略工程师', switch_cost: '中高', bridge_skills: ['市场交易', '收益建模'], transition_period: '7-10个月' },
        { target_role: '储能调度工程师', switch_cost: '中', bridge_skills: ['充放电策略', '约束建模'], transition_period: '6-9个月' }
      ],
      prepare_180d_plan: ['91-120天：建立并网偏差监测与告警机制。', '121-150天：主导1次限电场景复盘专项。', '151-180天：沉淀并网策略优化模板库。'],
      role_scope_text: '负责新能源并网策略设计与优化，对并网稳定性、消纳效率和收益质量负责。'
    },
    commonDeductionPoints: ['策略未覆盖关键约束场景。', '偏差归因浅层。', '执行与交易协同不充分。', '复盘没有形成参数治理机制。'],
    starTemplate: {
      situation: '区域限电加剧导致并网策略收益下滑且偏差扩大。',
      task: '在约束收紧条件下恢复并网效率并控制偏差。',
      action: ['拆解并网约束并重构策略参数。', '联动调度与交易优化执行节奏。', '建立偏差监测并周度复盘迭代。'],
      result: ['并网效率提升且偏差收敛。', '形成可复制的并网优化机制。'],
      proof_materials: ['策略参数文档', '偏差分析报告', '执行复盘记录']
    },
    writtenTopics: [
      { type: '策略优化', bucket: 'business_scenario', text: '你如何设计新能源并网策略优化方案？' },
      { type: '流程机制', bucket: 'system_process', text: '请设计“约束分析-调优-执行-复盘”流程。' },
      { type: '失效复盘', bucket: 'failure_review', text: '一次并网策略失效后你如何复盘？' },
      { type: '收益稳定平衡', bucket: 'metric_tradeoff', text: '收益目标与并网稳定冲突时如何取舍？' },
      { type: '约束诊断', bucket: 'business_scenario', text: '如何识别并网策略的关键约束因素？' },
      { type: '机制建设', bucket: 'system_process', text: '如何建立并网策略监控看板？' },
      { type: '误判纠偏', bucket: 'failure_review', text: '一次参数误判后如何纠偏？' },
      { type: '资源配置', bucket: 'metric_tradeoff', text: '多站点并发优化时如何分配资源？' },
      { type: '跨团队协同', bucket: 'cross_team_collaboration', text: '如何推动调度、交易、运维协同？' },
      { type: '经验沉淀', bucket: 'system_process', text: '如何沉淀并网优化方法库？' }
    ],
    interviewTopics: [
      { type: '应急处置', bucket: 'business_scenario', text: '并网窗口突变时你如何快速应急？' },
      { type: '协同推进', bucket: 'cross_team_collaboration', text: '调度与交易目标冲突时你如何推进？' },
      { type: '复盘叙述', bucket: 'failure_review', text: '讲一次你修复并网策略偏差的经历。' },
      { type: '优先级决策', bucket: 'metric_tradeoff', text: '多站点异常并发时你如何排序？' },
      { type: '风险沟通', bucket: 'business_scenario', text: '你如何向管理层解释策略收缩决策？' },
      { type: '机制协作', bucket: 'cross_team_collaboration', text: '如何建立并网策略例会机制？' },
      { type: '失误修正', bucket: 'failure_review', text: '一次执行失误后你如何修正？' },
      { type: '取舍题', bucket: 'metric_tradeoff', text: '短期收益与长期稳定冲突时如何取舍？' },
      { type: '方案答辩', bucket: 'business_scenario', text: '如何答辩你的并网优化方案？' },
      { type: '经验复制', bucket: 'cross_team_collaboration', text: '如何让团队复用你的并网策略方法？' }
    ]
  },
  {
    file: 'data/entries/IND_PUBLIC_INSTITUTION.json',
    industryLabel: '事业单位体系',
    roleId: 'IND_PUBLIC_INSTITUTION_ROLE_021',
    sourceRoleId: 'IND_PUBLIC_INSTITUTION_ROLE_020',
    roleName: '公立医院绩效管理专员',
    rolePatch: {
      role_readiness_floor: '至少完成1个医院绩效管理项目：指标体系梳理、数据核验、考核反馈与改进闭环。',
      day_in_life: '公立医院绩效管理专员工作周：维护绩效指标口径、汇总科室数据、组织绩效沟通、推动改进措施并复盘。',
      growth_path_1to3_year: '0-1年掌握医院绩效考核规则；1-3年独立负责绩效项目；3-5年可主导绩效体系优化和机制建设。',
      transfer_path_hint: '可转医院运营管理、人力绩效管理、医务管理岗；需补流程治理与数据分析能力，过渡6-10个月。',
      prep_90d_plan: ['1-30天：梳理医院绩效指标与考核口径。', '31-60天：完成1个绩效偏差复盘案例。', '61-90天：完成10套绩效管理题训练。'],
      career_outlook_3to5_year: '公立医院精细化管理推进，绩效管理岗位专业化需求持续提升。',
      typical_work_week: '月度考核与专项督导叠加时跨科室协同频繁。',
      switch_directions: [
        { target_role: '医院运营管理', switch_cost: '中', bridge_skills: ['流程优化', '资源统筹'], transition_period: '6-9个月' },
        { target_role: '人力绩效管理', switch_cost: '中', bridge_skills: ['激励设计', '绩效沟通'], transition_period: '6-9个月' },
        { target_role: '医务管理岗', switch_cost: '中高', bridge_skills: ['制度治理', '质量管理'], transition_period: '7-10个月' }
      ],
      prepare_180d_plan: ['91-120天：建立绩效指标异常预警机制。', '121-150天：主导1次绩效偏差复盘专项。', '151-180天：沉淀绩效管理SOP和沟通模板。'],
      role_scope_text: '负责公立医院绩效管理与改进闭环，对指标准确性、反馈效率和改进行动落地负责。'
    },
    commonDeductionPoints: ['指标口径定义模糊。', '数据核验流程不完整。', '绩效反馈流于形式。', '复盘未形成改进机制。'],
    starTemplate: {
      situation: '多个科室绩效指标偏差持续，影响年度考核达成。',
      task: '在考核周期内修正指标偏差并提升执行一致性。',
      action: ['统一指标口径并核验历史数据。', '组织科室反馈会明确整改动作。', '建立周度跟踪与复盘机制。'],
      result: ['关键指标偏差收敛并提升考核一致性。', '形成可复用的绩效改进机制。'],
      proof_materials: ['指标口径手册', '反馈会议纪要', '整改跟踪表']
    },
    writtenTopics: [
      { type: '绩效体系', bucket: 'business_scenario', text: '你如何设计公立医院绩效管理体系？' },
      { type: '流程机制', bucket: 'system_process', text: '请设计“设定-核验-反馈-改进”流程。' },
      { type: '偏差复盘', bucket: 'failure_review', text: '一次绩效考核偏差扩大后你如何复盘？' },
      { type: '效率公平平衡', bucket: 'metric_tradeoff', text: '效率导向与公平导向冲突时如何取舍？' },
      { type: '指标治理', bucket: 'business_scenario', text: '如何建立可执行的绩效指标口径体系？' },
      { type: '机制建设', bucket: 'system_process', text: '如何搭建绩效异常预警机制？' },
      { type: '误判纠偏', bucket: 'failure_review', text: '一次数据核验误判后如何纠偏？' },
      { type: '资源配置', bucket: 'metric_tradeoff', text: '多科室整改并发时如何分配支持资源？' },
      { type: '跨团队协同', bucket: 'cross_team_collaboration', text: '如何推动医务、人事、科室协同改进？' },
      { type: '经验沉淀', bucket: 'system_process', text: '如何沉淀医院绩效管理方法？' }
    ],
    interviewTopics: [
      { type: '突发应对', bucket: 'business_scenario', text: '考核前发现关键指标异常时你如何应急？' },
      { type: '协同推进', bucket: 'cross_team_collaboration', text: '科室对指标定义有异议时你如何推进共识？' },
      { type: '复盘叙述', bucket: 'failure_review', text: '讲一次你修复绩效管理失效的经历。' },
      { type: '优先级决策', bucket: 'metric_tradeoff', text: '多项整改任务并发时你如何排序？' },
      { type: '风险沟通', bucket: 'business_scenario', text: '你如何向院方解释绩效风险趋势？' },
      { type: '机制协作', bucket: 'cross_team_collaboration', text: '如何建立绩效管理常态协同机制？' },
      { type: '失误修正', bucket: 'failure_review', text: '一次考核方案失误后你如何修正？' },
      { type: '取舍题', bucket: 'metric_tradeoff', text: '短期达标与长期能力建设冲突时如何取舍？' },
      { type: '方案答辩', bucket: 'business_scenario', text: '如何答辩你的绩效改进方案？' },
      { type: '经验复制', bucket: 'cross_team_collaboration', text: '如何让科室复用你的绩效改进方法？' }
    ]
  }
];

const defaultAnswerFramework = ['目标与约束澄清', '执行路径拆解', '指标与风险控制', '复盘与机制沉淀'];
const defaultScoringDimensions = ['结构化思维', '可执行性', '风险意识', '复盘能力'];
const defaultCommonMistakes = ['描述泛化', '缺少量化指标', '无风险预案'];
const defaultGoodSignals = ['结论先行', '路径清晰', '指标闭环'];
const defaultReference = ['先明确目标与边界', '再拆解动作', '最后给出结果与复盘'];

function deepReplace(value, from, to) {
  if (typeof value === 'string') return value.split(from).join(to);
  if (Array.isArray(value)) return value.map((v) => deepReplace(v, from, to));
  if (value && typeof value === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(value)) out[k] = deepReplace(v, from, to);
    return out;
  }
  return value;
}

function buildQuestion(base, def, roleId, roleName, qid, stage, round, industryLabel, typeTag, bucket) {
  return {
    ...base,
    question_id: qid,
    prompt: `【行业:${industryLabel}｜岗位:${roleName}｜阶段:${round}】${def.text}`,
    question_type: typeTag,
    recruitment_stage: stage,
    round_label: round,
    role_id: roleId,
    role_name: roleName,
    question_year: 2026,
    updated_at: TODAY,
    difficulty_1to5: 4,
    scenario_bucket: bucket,
    answer_framework: defaultAnswerFramework,
    scoring_dimensions: defaultScoringDimensions,
    common_mistakes: defaultCommonMistakes,
    good_answer_signals: defaultGoodSignals,
    reference_answer_outline: defaultReference,
    follow_up_questions: ['资源受限时你先保哪一步？', '首轮结果不佳如何纠偏？', '如何沉淀成可复用机制？'],
    follow_up_chain: ['边界澄清', '关键取舍', '复盘迁移'],
    scoring_rubric: {
      A档: '路径完整、指标清晰、风险闭环。',
      B档: '方案可执行但缺少量化或风险细节。',
      C档: '泛化表达，缺少行动与结果。'
    },
    question_realness_note: '基于岗位能力口径与2026场景化补充（非官方原卷）。',
    data_origin: 'official_jd_competency_mapping_with_manual_role_enrichment_v161_batch15_add_role021',
    sample_size: Math.max(Number(base.sample_size || 6), 8),
    evidence: {
      ...(base.evidence || {}),
      accessed_at: TODAY,
      captured_at: TODAY,
      data_period: '2026年度'
    }
  };
}

for (const u of updates) {
  const fullPath = path.join(ROOT, u.file);
  const entry = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
  const roles = entry.dynamic?.['岗位画像库']?.items;
  const writtenItems = entry.dynamic?.['笔试真题库']?.items;
  const interviewItems = entry.dynamic?.['面试真题库']?.items;
  if (!roles || !writtenItems || !interviewItems) throw new Error(`Invalid entry structure: ${u.file}`);

  if (roles.some((r) => r.role_id === u.roleId)) throw new Error(`Role already exists: ${u.roleId}`);

  const sourceRole = roles.find((r) => r.role_id === u.sourceRoleId);
  if (!sourceRole) throw new Error(`Source role not found: ${u.sourceRoleId}`);

  let newRole = JSON.parse(JSON.stringify(sourceRole));
  newRole = deepReplace(newRole, sourceRole.role_name || '', u.roleName);
  newRole = deepReplace(newRole, u.sourceRoleId, u.roleId);

  newRole.role_id = u.roleId;
  newRole.role_name = u.roleName;
  Object.assign(newRole, u.rolePatch);
  newRole.common_deduction_points = u.commonDeductionPoints;
  newRole.star_evidence_template = u.starTemplate;
  newRole.updated_at = TODAY;
  newRole.role_detail_v158 = newRole.role_detail_v158 || {};
  newRole.role_detail_v158.role_scope = u.rolePatch.role_scope_text;
  newRole.role_detail_v158.expansion_status = 'landed_deep_profile_v161_batch15';

  roles.push(newRole);

  const writtenBasePool = writtenItems.filter((q) => q.role_id === u.sourceRoleId);
  const interviewBasePool = interviewItems.filter((q) => q.role_id === u.sourceRoleId);
  if (writtenBasePool.length === 0 || interviewBasePool.length === 0) throw new Error(`Question base missing: ${u.sourceRoleId}`);

  const industryPrefix = u.roleId.split('_ROLE_')[0];

  for (let i = 0; i < 10; i += 1) {
    const def = u.writtenTopics[i];
    const [stage, round] = WRITTEN_STAGES[i];
    const qid = `${industryPrefix}_WRITTEN_V161_R021O_${String(i + 1).padStart(2, '0')}`;
    if (writtenItems.some((q) => q.question_id === qid)) throw new Error(`Duplicate question id: ${qid}`);
    const base = writtenBasePool[i % writtenBasePool.length];
    writtenItems.push(buildQuestion(base, def, u.roleId, u.roleName, qid, stage, round, u.industryLabel, def.type, def.bucket));
  }

  for (let i = 0; i < 10; i += 1) {
    const def = u.interviewTopics[i];
    const [stage, round] = INTERVIEW_STAGES[i];
    const qid = `${industryPrefix}_INTERVIEW_V161_R021O_${String(i + 1).padStart(2, '0')}`;
    if (interviewItems.some((q) => q.question_id === qid)) throw new Error(`Duplicate question id: ${qid}`);
    const base = interviewBasePool[i % interviewBasePool.length];
    interviewItems.push(buildQuestion(base, def, u.roleId, u.roleName, qid, stage, round, u.industryLabel, def.type, def.bucket));
  }

  const writtenForRole = writtenItems.filter((q) => q.role_id === u.roleId);
  const interviewForRole = interviewItems.filter((q) => q.role_id === u.roleId);
  newRole.role_detail_v158.role_specific_question_coverage = {
    written_count: writtenForRole.length,
    interview_count: interviewForRole.length,
    written_stages: [...new Set(writtenForRole.map((q) => q.recruitment_stage).filter(Boolean))],
    interview_stages: [...new Set(interviewForRole.map((q) => q.recruitment_stage).filter(Boolean))]
  };

  fs.writeFileSync(fullPath, JSON.stringify(entry, null, 2) + '\n', 'utf8');
  console.log(`Added ${u.roleId} into ${u.file}`);
}
