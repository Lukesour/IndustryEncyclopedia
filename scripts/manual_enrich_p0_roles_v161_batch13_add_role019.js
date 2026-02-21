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
    roleId: 'IND_AUTO_INTELLIGENT_DRIVING_ROLE_019',
    sourceRoleId: 'IND_AUTO_INTELLIGENT_DRIVING_ROLE_018',
    roleName: '智驾系统验证工程师',
    rolePatch: {
      role_readiness_floor: '至少完成1个智驾系统验证闭环项目：测试计划制定、场景覆盖设计、缺陷分级处置和回归验收。',
      day_in_life: '智驾系统验证工程师工作周：拆解版本目标、编排仿真与路测验证、跟踪缺陷修复、推动跨团队回归验收。',
      growth_path_1to3_year: '0-1年掌握验证链路和关键指标；1-3年独立负责模块验证策略；3-5年可主导版本级验证体系。',
      transfer_path_hint: '可转仿真评测工程师、功能安全工程师、质量体系工程师；需补安全标准和系统工程能力，过渡6-10个月。',
      prep_90d_plan: ['1-30天：梳理智驾验证流程与场景分层。', '31-60天：完成1个缺陷闭环验证案例。', '61-90天：完成10套系统验证题训练。'],
      career_outlook_3to5_year: '高阶智驾量产推进，系统级验证人才需求持续增长。',
      typical_work_week: '版本冻结和发布窗口期验证任务密度高。',
      switch_directions: [
        { target_role: '仿真评测工程师', switch_cost: '中', bridge_skills: ['场景构建', '评测指标'], transition_period: '6-9个月' },
        { target_role: '功能安全工程师', switch_cost: '中高', bridge_skills: ['ISO26262', '失效分析'], transition_period: '7-10个月' },
        { target_role: '质量体系工程师', switch_cost: '中', bridge_skills: ['流程治理', '门禁管理'], transition_period: '6-9个月' }
      ],
      prepare_180d_plan: ['91-120天：建立关键场景验证覆盖看板。', '121-150天：主导1次版本缺陷复盘专项。', '151-180天：沉淀系统验证SOP与发布门禁清单。'],
      role_scope_text: '负责智驾系统验证策略与执行闭环，对场景覆盖率、缺陷关闭时效和版本验收质量负责。'
    },
    commonDeductionPoints: ['只讲测试动作，不讲覆盖目标。', '缺陷分级与优先级依据不足。', '回归验证与发布门禁断层。', '复盘未转化为流程改进。'],
    starTemplate: {
      situation: '新版本在夜间场景通过率下降，发布窗口临近。',
      task: '在发布前补齐关键场景验证并推动缺陷闭环。',
      action: ['重排验证优先级并补充高风险场景。', '联动研发快速定位并修复核心缺陷。', '完成回归验收并更新发布门禁。'],
      result: ['关键场景通过率恢复并按时发布。', '形成可复用的版本验证闭环机制。'],
      proof_materials: ['验证计划', '缺陷台账', '回归验收报告']
    },
    writtenTopics: [
      { type: '场景覆盖优化', bucket: 'business_scenario', text: '版本验证资源有限时你如何保证关键场景覆盖？' },
      { type: '验证流程设计', bucket: 'system_process', text: '请设计“计划-执行-缺陷闭环-验收”验证流程。' },
      { type: '缺陷复盘', bucket: 'failure_review', text: '一次重大缺陷漏检后你如何复盘和修复流程？' },
      { type: '进度质量取舍', bucket: 'metric_tradeoff', text: '发布节点与验证完整性冲突时如何取舍？' },
      { type: '指标体系建设', bucket: 'business_scenario', text: '如何建立系统验证的核心指标体系？' },
      { type: '门禁机制', bucket: 'system_process', text: '如何设计可执行的版本发布门禁机制？' },
      { type: '误判纠偏', bucket: 'failure_review', text: '一次错误判定导致回归失效后如何纠偏？' },
      { type: '资源排序', bucket: 'metric_tradeoff', text: '多模块并发异常时你如何分配验证资源？' },
      { type: '跨团队协同', bucket: 'cross_team_collaboration', text: '如何推动验证、研发、测试三方快速闭环？' },
      { type: '经验沉淀', bucket: 'system_process', text: '如何把一次版本验证经验沉淀为团队标准？' }
    ],
    interviewTopics: [
      { type: '发布应急', bucket: 'business_scenario', text: '发布前发现高风险问题时你如何应急处置？' },
      { type: '协同推进', bucket: 'cross_team_collaboration', text: '研发与测试结论冲突时你如何推进决策？' },
      { type: '复盘叙述', bucket: 'failure_review', text: '讲一次你修复验证漏检问题的完整过程。' },
      { type: '优先级决策', bucket: 'metric_tradeoff', text: '多条缺陷链路并发时你如何排优先级？' },
      { type: '风险沟通', bucket: 'business_scenario', text: '你如何向管理层说明延期验证的必要性？' },
      { type: '机制协作', bucket: 'cross_team_collaboration', text: '如何建立常态化跨团队验证机制？' },
      { type: '失误修正', bucket: 'failure_review', text: '一次误判放行后你如何修正流程？' },
      { type: '指标取舍', bucket: 'metric_tradeoff', text: '覆盖率和执行效率冲突时你如何选择？' },
      { type: '方案答辩', bucket: 'business_scenario', text: '如何答辩你的版本验证计划？' },
      { type: '经验复制', bucket: 'cross_team_collaboration', text: '如何让团队复用你的验证闭环方法？' }
    ]
  },
  {
    file: 'data/entries/IND_BIOMED_DEVICE.json',
    industryLabel: '生物医药与器械',
    roleId: 'IND_BIOMED_DEVICE_ROLE_019',
    sourceRoleId: 'IND_BIOMED_DEVICE_ROLE_018',
    roleName: '真实世界研究专员',
    rolePatch: {
      role_readiness_floor: '至少完成1个真实世界研究项目：研究问题定义、数据治理、统计分析和医学解读输出。',
      day_in_life: '真实世界研究专员工作周：梳理研究假设、清洗多源数据、联动统计与医学团队产出研究结论和证据材料。',
      growth_path_1to3_year: '0-1年掌握RWE研究流程和偏倚控制；1-3年独立负责研究项目执行；3-5年可主导跨产品证据策略。',
      transfer_path_hint: '可转医学事务、生物统计分析、市场准入证据岗；需补高级统计和政策解读能力，过渡6-10个月。',
      prep_90d_plan: ['1-30天：梳理RWE研究设计与偏倚控制方法。', '31-60天：完成1个真实世界数据治理案例。', '61-90天：完成10套RWE面试题训练。'],
      career_outlook_3to5_year: '支付方与监管方对真实世界证据需求提升，岗位需求持续增长。',
      typical_work_week: '项目中期常出现数据质量与时效并行压力。',
      switch_directions: [
        { target_role: '医学事务', switch_cost: '中', bridge_skills: ['证据传播', '学术沟通'], transition_period: '6-9个月' },
        { target_role: '生物统计分析师', switch_cost: '中高', bridge_skills: ['统计建模', '因果推断'], transition_period: '7-10个月' },
        { target_role: '市场准入证据岗', switch_cost: '中', bridge_skills: ['卫生经济', '政策口径'], transition_period: '6-9个月' }
      ],
      prepare_180d_plan: ['91-120天：建立关键研究变量标准字典。', '121-150天：主导1次偏倚复盘专项。', '151-180天：沉淀真实世界研究报告模板。'],
      role_scope_text: '负责真实世界研究执行与证据产出，对研究质量、偏倚控制和结论可解释性负责。'
    },
    commonDeductionPoints: ['研究问题定义模糊。', '数据偏倚识别不完整。', '统计结论无法支撑业务决策。', '证据表达缺乏医学语境。'],
    starTemplate: {
      situation: '重点产品上市后需快速补充真实世界有效性证据。',
      task: '在数据质量不均衡条件下产出可解释研究结论。',
      action: ['明确研究假设并分层定义终点。', '完成数据清洗与偏倚敏感性分析。', '联动医学和统计团队完成结果解读。'],
      result: ['形成可用于内部决策的证据报告。', '沉淀可复用的RWE研究流程。'],
      proof_materials: ['研究方案', '分析代码与日志', '研究报告']
    },
    writtenTopics: [
      { type: '研究设计', bucket: 'business_scenario', text: '你如何为某药品疗效评估设计真实世界研究？' },
      { type: '流程设计', bucket: 'system_process', text: '请设计“问题定义-数据治理-分析-解读”流程。' },
      { type: '偏倚复盘', bucket: 'failure_review', text: '一次研究结论被质疑偏倚后你如何复盘？' },
      { type: '时效质量平衡', bucket: 'metric_tradeoff', text: '项目时限紧张时如何兼顾数据质量和交付速度？' },
      { type: '变量治理', bucket: 'business_scenario', text: '如何建立真实世界研究变量口径一致性？' },
      { type: '分析机制', bucket: 'system_process', text: '如何构建可复用的RWE分析模板？' },
      { type: '误判纠偏', bucket: 'failure_review', text: '一次统计解释偏差后的纠偏路径是什么？' },
      { type: '资源配置', bucket: 'metric_tradeoff', text: '多研究并行时如何分配分析资源？' },
      { type: '跨岗协同', bucket: 'cross_team_collaboration', text: '如何推动统计、医学、市场三方协同？' },
      { type: '经验沉淀', bucket: 'system_process', text: '如何将项目经验沉淀为标准研究指引？' }
    ],
    interviewTopics: [
      { type: '突发应对', bucket: 'business_scenario', text: '关键数据字段缺失时你如何快速调整研究方案？' },
      { type: '协同推进', bucket: 'cross_team_collaboration', text: '医学和统计观点不一致时你如何推进结论？' },
      { type: '复盘叙述', bucket: 'failure_review', text: '讲一次你修复研究偏差的经历。' },
      { type: '优先级决策', bucket: 'metric_tradeoff', text: '多个研究需求并发时你如何排序？' },
      { type: '风险沟通', bucket: 'business_scenario', text: '你如何向管理层解释研究结论的不确定性？' },
      { type: '机制协作', bucket: 'cross_team_collaboration', text: '如何建立RWE跨团队协同机制？' },
      { type: '失误修正', bucket: 'failure_review', text: '一次错误结论输出后你如何修正？' },
      { type: '取舍题', bucket: 'metric_tradeoff', text: '样本量和纳入标准冲突时你如何取舍？' },
      { type: '方案答辩', bucket: 'business_scenario', text: '如何答辩你的真实世界研究设计？' },
      { type: '经验复制', bucket: 'cross_team_collaboration', text: '如何让团队复用你的RWE执行方法？' }
    ]
  },
  {
    file: 'data/entries/IND_ECOMMERCE_CROSSBORDER.json',
    industryLabel: '电商与跨境电商',
    roleId: 'IND_ECOMMERCE_CROSSBORDER_ROLE_019',
    sourceRoleId: 'IND_ECOMMERCE_CROSSBORDER_ROLE_018',
    roleName: '跨境客服质控专员',
    rolePatch: {
      role_readiness_floor: '至少完成1个跨境客服质控项目：质检规则制定、问题归因、培训纠偏和效果追踪。',
      day_in_life: '跨境客服质控专员工作周：抽检多语种会话、识别高频问题、输出质检报告、联动客服培训与流程优化。',
      growth_path_1to3_year: '0-1年掌握客服质量标准与抽检方法；1-3年独立负责质控专项；3-5年可主导服务质量治理体系。',
      transfer_path_hint: '可转客服培训、用户体验运营、履约服务运营；需补数据分析与项目管理能力，过渡6-10个月。',
      prep_90d_plan: ['1-30天：梳理跨境客服质检标准和指标。', '31-60天：完成1个投诉高发环节整改案例。', '61-90天：完成10套客服质控题训练。'],
      career_outlook_3to5_year: '跨境服务规模扩大推动质控岗位从执行向治理升级。',
      typical_work_week: '大促和物流波动期质检与纠偏节奏明显加快。',
      switch_directions: [
        { target_role: '客服培训专员', switch_cost: '中', bridge_skills: ['培训设计', '辅导反馈'], transition_period: '6-9个月' },
        { target_role: '用户体验运营', switch_cost: '中', bridge_skills: ['体验洞察', '流程优化'], transition_period: '6-9个月' },
        { target_role: '履约服务运营', switch_cost: '中高', bridge_skills: ['履约链路', '异常闭环'], transition_period: '7-10个月' }
      ],
      prepare_180d_plan: ['91-120天：建立多语种质检评分基线。', '121-150天：主导1次服务失效复盘专项。', '151-180天：沉淀客服质控SOP与纠偏手册。'],
      role_scope_text: '负责跨境客服质检与改进闭环，对服务准确率、响应质量和投诉率改善负责。'
    },
    commonDeductionPoints: ['质检规则与业务场景脱节。', '问题归因停留表象。', '培训整改缺少跟踪指标。', '复盘无法落地到流程。'],
    starTemplate: {
      situation: '多站点投诉率上升，客服满意度持续下滑。',
      task: '快速定位服务问题并推动质控整改。',
      action: ['重构抽检规则并分层识别高风险场景。', '联动培训团队制定纠偏动作。', '按周跟踪指标并复盘效果。'],
      result: ['投诉率下降且质检得分提升。', '建立可复制的客服质控闭环。'],
      proof_materials: ['抽检样本库', '整改计划', '指标追踪报表']
    },
    writtenTopics: [
      { type: '投诉治理', bucket: 'business_scenario', text: '跨境投诉高发时你如何制定质控整改方案？' },
      { type: '流程设计', bucket: 'system_process', text: '请设计“抽检-归因-整改-追踪”流程。' },
      { type: '失效复盘', bucket: 'failure_review', text: '一次整改无效后你如何复盘并重做？' },
      { type: '效率质量平衡', bucket: 'metric_tradeoff', text: '处理时效与服务质量冲突时如何取舍？' },
      { type: '规则建设', bucket: 'business_scenario', text: '如何设计多语种客服统一质检标准？' },
      { type: '机制建设', bucket: 'system_process', text: '如何建立客服质控的周度复盘机制？' },
      { type: '误判纠偏', bucket: 'failure_review', text: '一次错判导致处罚争议后如何纠偏？' },
      { type: '资源排序', bucket: 'metric_tradeoff', text: '多站点同时异常时如何分配质检资源？' },
      { type: '跨岗协同', bucket: 'cross_team_collaboration', text: '如何推动客服、物流、产品协同降投诉？' },
      { type: '经验沉淀', bucket: 'system_process', text: '如何沉淀高质量服务话术与检查清单？' }
    ],
    interviewTopics: [
      { type: '突发应对', bucket: 'business_scenario', text: '平台舆情突发时你如何组织质控应急？' },
      { type: '协同推进', bucket: 'cross_team_collaboration', text: '客服与物流互相归责时你如何推进？' },
      { type: '复盘叙述', bucket: 'failure_review', text: '讲一次你处理服务质量失效的经历。' },
      { type: '优先级决策', bucket: 'metric_tradeoff', text: '多类投诉同时爆发时你如何排序？' },
      { type: '风险沟通', bucket: 'business_scenario', text: '你如何向管理层解释投诉率变化？' },
      { type: '机制协作', bucket: 'cross_team_collaboration', text: '如何建立跨团队服务质量共治机制？' },
      { type: '失误修正', bucket: 'failure_review', text: '一次规则设计失误后你如何修正？' },
      { type: '取舍题', bucket: 'metric_tradeoff', text: '严控标准和客服效率冲突时如何取舍？' },
      { type: '方案答辩', bucket: 'business_scenario', text: '如何答辩你的客服质控方案？' },
      { type: '经验复制', bucket: 'cross_team_collaboration', text: '如何让团队复制你的整改打法？' }
    ]
  },
  {
    file: 'data/entries/IND_ENERGY_UTILITIES.json',
    industryLabel: '能源与公用事业',
    roleId: 'IND_ENERGY_UTILITIES_ROLE_019',
    sourceRoleId: 'IND_ENERGY_UTILITIES_ROLE_018',
    roleName: '综合能源解决方案工程师',
    rolePatch: {
      role_readiness_floor: '至少完成1个综合能源方案项目：负荷诊断、技术选型、收益测算和交付落地。',
      day_in_life: '综合能源解决方案工程师工作周：调研用户用能场景、设计光储充或能效方案、测算收益并协同工程交付。',
      growth_path_1to3_year: '0-1年掌握综合能源方案方法；1-3年独立负责项目方案；3-5年可主导行业化解决方案体系。',
      transfer_path_hint: '可转能源产品经理、项目交付经理、电力市场分析师；需补商业模型与项目管理能力，过渡6-10个月。',
      prep_90d_plan: ['1-30天：梳理典型用户侧用能场景与方案框架。', '31-60天：完成1个综合能源收益测算案例。', '61-90天：完成10套解决方案题训练。'],
      career_outlook_3to5_year: '源网荷储协同建设推进，综合能源解决方案岗位需求持续上行。',
      typical_work_week: '售前投标和交付切换阶段任务并发度高。',
      switch_directions: [
        { target_role: '能源产品经理', switch_cost: '中', bridge_skills: ['产品化设计', '客户洞察'], transition_period: '6-9个月' },
        { target_role: '项目交付经理', switch_cost: '中', bridge_skills: ['交付管理', '资源协调'], transition_period: '6-9个月' },
        { target_role: '电力市场分析师', switch_cost: '中高', bridge_skills: ['交易机制', '收益模型'], transition_period: '7-10个月' }
      ],
      prepare_180d_plan: ['91-120天：建立方案收益测算校验机制。', '121-150天：主导1次项目偏差复盘专项。', '151-180天：沉淀综合能源方案模板库。'],
      role_scope_text: '负责综合能源解决方案设计与落地，对方案可行性、经济性和交付协同质量负责。'
    },
    commonDeductionPoints: ['技术方案脱离用户负荷特征。', '收益测算假设不透明。', '交付约束考虑不充分。', '复盘没有沉淀可复用模板。'],
    starTemplate: {
      situation: '园区客户提出降本目标，但现有用能结构复杂。',
      task: '在预算约束内给出可落地综合能源方案。',
      action: ['拆解负荷曲线并识别高价值改造点。', '完成技术选型和收益敏感性测算。', '联动工程团队制定交付计划。'],
      result: ['方案通过评审并进入实施。', '形成可复用行业方案模板。'],
      proof_materials: ['负荷诊断报告', '收益测算表', '交付计划']
    },
    writtenTopics: [
      { type: '方案设计', bucket: 'business_scenario', text: '面对工商用户多目标诉求，你如何设计综合能源方案？' },
      { type: '流程设计', bucket: 'system_process', text: '请设计“调研-选型-测算-交付”方案流程。' },
      { type: '偏差复盘', bucket: 'failure_review', text: '一次项目收益偏差较大后你如何复盘？' },
      { type: '收益风险平衡', bucket: 'metric_tradeoff', text: '收益最大化与实施风险冲突时如何取舍？' },
      { type: '负荷诊断', bucket: 'business_scenario', text: '如何识别用户侧可改造的关键负荷环节？' },
      { type: '模板建设', bucket: 'system_process', text: '如何搭建行业化解决方案模板库？' },
      { type: '误判纠偏', bucket: 'failure_review', text: '一次技术选型失误后如何纠偏？' },
      { type: '资源配置', bucket: 'metric_tradeoff', text: '多项目并发时如何分配方案资源？' },
      { type: '跨岗协同', bucket: 'cross_team_collaboration', text: '如何推动售前、设计、交付协同推进？' },
      { type: '经验沉淀', bucket: 'system_process', text: '如何沉淀高成功率的解决方案方法？' }
    ],
    interviewTopics: [
      { type: '投标应对', bucket: 'business_scenario', text: '客户临时压缩预算时你如何调整方案？' },
      { type: '协同推进', bucket: 'cross_team_collaboration', text: '商务和技术目标冲突时你如何推进？' },
      { type: '复盘叙述', bucket: 'failure_review', text: '讲一次你修复方案落地偏差的经历。' },
      { type: '优先级决策', bucket: 'metric_tradeoff', text: '多客户并发需求时你如何排序响应？' },
      { type: '风险沟通', bucket: 'business_scenario', text: '你如何向客户解释方案风险边界？' },
      { type: '机制协作', bucket: 'cross_team_collaboration', text: '如何建立跨团队方案评审机制？' },
      { type: '失误修正', bucket: 'failure_review', text: '一次测算错误后你如何修正并止损？' },
      { type: '取舍题', bucket: 'metric_tradeoff', text: '短期回本和长期稳定冲突时如何取舍？' },
      { type: '方案答辩', bucket: 'business_scenario', text: '如何答辩你的综合能源技术路线？' },
      { type: '经验复制', bucket: 'cross_team_collaboration', text: '如何让团队复用你的方案设计框架？' }
    ]
  },
  {
    file: 'data/entries/IND_FIN_BANK.json',
    industryLabel: '金融-银行',
    roleId: 'IND_FIN_BANK_ROLE_019',
    sourceRoleId: 'IND_FIN_BANK_ROLE_018',
    roleName: '普惠金融客户经理',
    rolePatch: {
      role_readiness_floor: '至少完成1个普惠客户经营项目：客户分层、产品匹配、授信协同和贷后跟踪。',
      day_in_life: '普惠金融客户经理工作周：走访小微客户、评估经营与现金流、匹配授信方案、跟踪贷后表现并做风险预警。',
      growth_path_1to3_year: '0-1年掌握小微客户经营与尽调流程；1-3年独立负责客群经营；3-5年可主导区域普惠客户策略。',
      transfer_path_hint: '可转公司金融客户经理、普惠产品经理、风险管理岗；需补组合经营与数据化管理能力，过渡6-10个月。',
      prep_90d_plan: ['1-30天：梳理普惠客户画像和风控红线。', '31-60天：完成1个授信与贷后联动案例。', '61-90天：完成10套普惠客户题训练。'],
      career_outlook_3to5_year: '普惠金融政策持续推进，懂经营又懂风控的客户经理需求稳定。',
      typical_work_week: '月末冲量与风险审查并行时节奏紧张。',
      switch_directions: [
        { target_role: '公司金融客户经理', switch_cost: '中', bridge_skills: ['行业方案', '客户经营'], transition_period: '6-9个月' },
        { target_role: '普惠产品经理', switch_cost: '中', bridge_skills: ['产品设计', '流程优化'], transition_period: '6-9个月' },
        { target_role: '风险管理岗', switch_cost: '中高', bridge_skills: ['预警模型', '组合监控'], transition_period: '7-10个月' }
      ],
      prepare_180d_plan: ['91-120天：建立重点客群经营台账与预警机制。', '121-150天：主导1次贷后风险复盘专项。', '151-180天：沉淀普惠客户经营SOP。'],
      role_scope_text: '负责普惠客户拓展与经营，对客户质量、授信协同效率和贷后风险可控性负责。'
    },
    commonDeductionPoints: ['只重拓客不重风控。', '客户分层依据不清。', '贷后跟踪动作缺失。', '经营复盘无法指导下轮策略。'],
    starTemplate: {
      situation: '区域小微客户增长快但逾期率上升。',
      task: '在保持拓展节奏下控制资产质量。',
      action: ['重构客户分层并明确准入阈值。', '联动授信和风控优化方案审批。', '建立贷后跟踪与预警复盘机制。'],
      result: ['客群结构优化且逾期率回落。', '形成可复制的普惠经营闭环。'],
      proof_materials: ['客户分层台账', '授信方案', '贷后跟踪记录']
    },
    writtenTopics: [
      { type: '客群经营', bucket: 'business_scenario', text: '你如何制定小微客群的分层经营策略？' },
      { type: '流程设计', bucket: 'system_process', text: '请设计“获客-尽调-授信-贷后”闭环流程。' },
      { type: '风险复盘', bucket: 'failure_review', text: '一次贷后风险暴露后你如何复盘？' },
      { type: '增长风险平衡', bucket: 'metric_tradeoff', text: '拓客目标和资产质量冲突时如何取舍？' },
      { type: '准入策略', bucket: 'business_scenario', text: '如何定义普惠客户准入阈值与退出机制？' },
      { type: '机制建设', bucket: 'system_process', text: '如何建立客户经理与风控协同机制？' },
      { type: '误判纠偏', bucket: 'failure_review', text: '一次客户判断偏差后如何纠偏？' },
      { type: '资源配置', bucket: 'metric_tradeoff', text: '多条业务线并发时如何配置服务资源？' },
      { type: '跨岗协同', bucket: 'cross_team_collaboration', text: '如何推动客户经理、审批、贷后协同？' },
      { type: '经验沉淀', bucket: 'system_process', text: '如何沉淀高质量普惠客户经营方法？' }
    ],
    interviewTopics: [
      { type: '突发应对', bucket: 'business_scenario', text: '客户突发经营恶化时你如何应急处理？' },
      { type: '协同推进', bucket: 'cross_team_collaboration', text: '业务诉求与风控意见冲突时你如何推进？' },
      { type: '复盘叙述', bucket: 'failure_review', text: '讲一次你修复贷后风险的完整过程。' },
      { type: '优先级决策', bucket: 'metric_tradeoff', text: '多客户并发需求时你如何排序服务？' },
      { type: '风险沟通', bucket: 'business_scenario', text: '你如何向分行解释结构性收缩策略？' },
      { type: '机制协作', bucket: 'cross_team_collaboration', text: '如何建立常态化普惠协同机制？' },
      { type: '失误修正', bucket: 'failure_review', text: '一次准入误判后你如何修正？' },
      { type: '取舍题', bucket: 'metric_tradeoff', text: '短期放款规模和长期资产质量冲突时如何取舍？' },
      { type: '方案答辩', bucket: 'business_scenario', text: '如何答辩你的普惠客户经营方案？' },
      { type: '经验复制', bucket: 'cross_team_collaboration', text: '如何让团队复用你的客户经营打法？' }
    ]
  },
  {
    file: 'data/entries/IND_FIN_SECURITIES_FUND.json',
    industryLabel: '金融-证券基金',
    roleId: 'IND_FIN_SECURITIES_FUND_ROLE_019',
    sourceRoleId: 'IND_FIN_SECURITIES_FUND_ROLE_018',
    roleName: '机构销售助理',
    rolePatch: {
      role_readiness_floor: '至少完成1个机构客户服务项目：需求梳理、材料准备、路演支持和反馈复盘。',
      day_in_life: '机构销售助理工作周：整理客户需求、准备产品材料、支持路演沟通、跟踪客户反馈并协同投研响应。',
      growth_path_1to3_year: '0-1年掌握机构销售流程与合规边界；1-3年独立支持重点机构客户；3-5年可承担机构客户经理职责。',
      transfer_path_hint: '可转机构销售经理、产品经理、渠道运营岗；需补客户经营与产品策略能力，过渡6-10个月。',
      prep_90d_plan: ['1-30天：梳理机构客户服务流程与关键节点。', '31-60天：完成1个路演支持复盘案例。', '61-90天：完成10套机构销售题训练。'],
      career_outlook_3to5_year: '机构化配置比例提升，兼具服务与专业表达能力的销售支持人才需求上升。',
      typical_work_week: '路演季与产品发行窗口期任务并发明显。',
      switch_directions: [
        { target_role: '机构销售经理', switch_cost: '中', bridge_skills: ['客户经营', '方案沟通'], transition_period: '6-9个月' },
        { target_role: '产品经理', switch_cost: '中', bridge_skills: ['产品定位', '市场分析'], transition_period: '6-9个月' },
        { target_role: '渠道运营岗', switch_cost: '中', bridge_skills: ['渠道协同', '活动策划'], transition_period: '6-9个月' }
      ],
      prepare_180d_plan: ['91-120天：建立客户需求标签与响应库。', '121-150天：主导1次路演失效复盘专项。', '151-180天：沉淀机构客户服务模板。'],
      role_scope_text: '负责机构销售支持与客户服务协同，对客户响应效率、材料质量和路演支持效果负责。'
    },
    commonDeductionPoints: ['客户需求记录不完整。', '材料准备缺少针对性。', '跨团队响应不及时。', '复盘未形成服务改进。'],
    starTemplate: {
      situation: '重点机构客户反馈产品资料不匹配，路演转化低。',
      task: '快速优化客户沟通材料并提升转化效果。',
      action: ['分层梳理客户关注点并重构资料。', '联动投研补充核心问答。', '跟踪路演反馈并迭代支持模板。'],
      result: ['客户满意度和路演转化提升。', '形成可复用的机构服务模板。'],
      proof_materials: ['客户需求清单', '路演材料', '反馈复盘记录']
    },
    writtenTopics: [
      { type: '客户支持', bucket: 'business_scenario', text: '机构客户需求分化明显时你如何组织支持方案？' },
      { type: '流程设计', bucket: 'system_process', text: '请设计“需求收集-材料准备-路演支持-复盘”流程。' },
      { type: '失效复盘', bucket: 'failure_review', text: '一次路演转化不佳后你如何复盘？' },
      { type: '效率质量平衡', bucket: 'metric_tradeoff', text: '材料时效与准确性冲突时如何取舍？' },
      { type: '客户分层', bucket: 'business_scenario', text: '如何建立机构客户分层与响应策略？' },
      { type: '机制建设', bucket: 'system_process', text: '如何搭建机构销售支持资料库？' },
      { type: '误判纠偏', bucket: 'failure_review', text: '一次需求误判导致准备偏差后如何纠偏？' },
      { type: '资源配置', bucket: 'metric_tradeoff', text: '多个路演并发时如何分配支持资源？' },
      { type: '跨岗协同', bucket: 'cross_team_collaboration', text: '如何推动销售、投研、合规协同响应？' },
      { type: '经验沉淀', bucket: 'system_process', text: '如何沉淀高转化机构服务经验？' }
    ],
    interviewTopics: [
      { type: '突发应对', bucket: 'business_scenario', text: '客户临时追加路演需求时你如何应对？' },
      { type: '协同推进', bucket: 'cross_team_collaboration', text: '销售与投研口径冲突时你如何推进一致？' },
      { type: '复盘叙述', bucket: 'failure_review', text: '讲一次你修复客户支持失效的经历。' },
      { type: '优先级决策', bucket: 'metric_tradeoff', text: '多机构并发需求时你如何排序？' },
      { type: '风险沟通', bucket: 'business_scenario', text: '你如何向团队解释重点客户流失风险？' },
      { type: '机制协作', bucket: 'cross_team_collaboration', text: '如何建立常态化机构响应机制？' },
      { type: '失误修正', bucket: 'failure_review', text: '一次材料准备失误后你如何修正？' },
      { type: '取舍题', bucket: 'metric_tradeoff', text: '重点客户深度服务与广覆盖冲突时如何取舍？' },
      { type: '方案答辩', bucket: 'business_scenario', text: '如何答辩你的机构客户支持策略？' },
      { type: '经验复制', bucket: 'cross_team_collaboration', text: '如何让团队复用你的客户服务方法？' }
    ]
  },
  {
    file: 'data/entries/IND_NEW_ENERGY.json',
    industryLabel: '新能源',
    roleId: 'IND_NEW_ENERGY_ROLE_019',
    sourceRoleId: 'IND_NEW_ENERGY_ROLE_018',
    roleName: '储能调度策略工程师',
    rolePatch: {
      role_readiness_floor: '至少完成1个储能调度项目：策略建模、约束校验、执行监控和收益复盘。',
      day_in_life: '储能调度策略工程师工作周：分析电价与负荷曲线、制定充放电策略、监控执行偏差并优化调度参数。',
      growth_path_1to3_year: '0-1年掌握储能调度策略与约束；1-3年独立负责站点策略优化；3-5年可主导区域调度策略体系。',
      transfer_path_hint: '可转电力交易策略、储能运维优化、能源算法工程师；需补交易机制和建模能力，过渡6-10个月。',
      prep_90d_plan: ['1-30天：梳理储能调度目标函数与约束。', '31-60天：完成1个调度偏差纠偏案例。', '61-90天：完成10套储能调度题训练。'],
      career_outlook_3to5_year: '储能规模化并网带动调度策略岗位需求快速上升。',
      typical_work_week: '峰谷价差和并网约束变化时调度迭代频次高。',
      switch_directions: [
        { target_role: '电力交易策略岗', switch_cost: '中', bridge_skills: ['市场规则', '收益优化'], transition_period: '6-9个月' },
        { target_role: '储能运维优化', switch_cost: '中', bridge_skills: ['状态评估', '运维策略'], transition_period: '6-9个月' },
        { target_role: '能源算法工程师', switch_cost: '中高', bridge_skills: ['优化算法', '系统建模'], transition_period: '7-10个月' }
      ],
      prepare_180d_plan: ['91-120天：建立调度策略仿真评估机制。', '121-150天：主导1次策略失效复盘专项。', '151-180天：沉淀储能调度策略模板库。'],
      role_scope_text: '负责储能调度策略设计与优化，对收益稳定性、执行偏差和安全约束达成负责。'
    },
    commonDeductionPoints: ['策略设计忽略运行约束。', '收益测算缺少敏感性验证。', '执行偏差监控不到位。', '复盘未形成迭代闭环。'],
    starTemplate: {
      situation: '站点调度策略在极端电价波动下收益下滑且偏差扩大。',
      task: '快速优化调度策略并控制执行风险。',
      action: ['重构目标函数并校验关键约束。', '完成分时段仿真并更新参数。', '建立日级偏差监控与复盘机制。'],
      result: ['策略收益恢复且偏差收敛。', '形成可复用的调度优化流程。'],
      proof_materials: ['调度策略文档', '仿真结果', '偏差监控报表']
    },
    writtenTopics: [
      { type: '策略优化', bucket: 'business_scenario', text: '电价波动加剧时你如何优化储能调度策略？' },
      { type: '流程设计', bucket: 'system_process', text: '请设计“建模-仿真-执行-复盘”调度流程。' },
      { type: '失效复盘', bucket: 'failure_review', text: '一次调度策略失效后你如何复盘？' },
      { type: '收益安全平衡', bucket: 'metric_tradeoff', text: '收益目标与安全约束冲突时如何取舍？' },
      { type: '参数治理', bucket: 'business_scenario', text: '如何建立调度参数更新与校验机制？' },
      { type: '机制建设', bucket: 'system_process', text: '如何搭建储能调度评估看板？' },
      { type: '误判纠偏', bucket: 'failure_review', text: '一次预测误差放大后如何纠偏？' },
      { type: '资源排序', bucket: 'metric_tradeoff', text: '多站点策略并发优化时如何分配资源？' },
      { type: '跨岗协同', bucket: 'cross_team_collaboration', text: '如何推动调度、交易、运维协同执行？' },
      { type: '经验沉淀', bucket: 'system_process', text: '如何沉淀可复用的储能调度策略模板？' }
    ],
    interviewTopics: [
      { type: '突发应对', bucket: 'business_scenario', text: '并网约束临时收紧时你如何应急调整策略？' },
      { type: '协同推进', bucket: 'cross_team_collaboration', text: '交易与运维目标冲突时你如何推进一致？' },
      { type: '复盘叙述', bucket: 'failure_review', text: '讲一次你修复调度策略偏差的经历。' },
      { type: '优先级决策', bucket: 'metric_tradeoff', text: '多站点异常并发时你如何排序处置？' },
      { type: '风险沟通', bucket: 'business_scenario', text: '你如何向管理层解释策略收缩决策？' },
      { type: '机制协作', bucket: 'cross_team_collaboration', text: '如何建立常态化调度协同机制？' },
      { type: '失误修正', bucket: 'failure_review', text: '一次参数设置失误后你如何修正？' },
      { type: '取舍题', bucket: 'metric_tradeoff', text: '短期收益和设备寿命冲突时如何取舍？' },
      { type: '方案答辩', bucket: 'business_scenario', text: '如何答辩你的储能调度策略？' },
      { type: '经验复制', bucket: 'cross_team_collaboration', text: '如何让团队复用你的调度优化方法？' }
    ]
  },
  {
    file: 'data/entries/IND_PUBLIC_INSTITUTION.json',
    industryLabel: '事业单位体系',
    roleId: 'IND_PUBLIC_INSTITUTION_ROLE_019',
    sourceRoleId: 'IND_PUBLIC_INSTITUTION_ROLE_018',
    roleName: '公共卫生项目专员',
    rolePatch: {
      role_readiness_floor: '至少完成1个公共卫生项目：需求调研、方案执行、数据监测和项目复盘。',
      day_in_life: '公共卫生项目专员工作周：对接社区与医疗机构、推进项目执行、跟踪核心指标、处理现场问题并输出改进建议。',
      growth_path_1to3_year: '0-1年掌握公卫项目流程与指标；1-3年独立负责专题项目；3-5年可主导区域公卫项目管理。',
      transfer_path_hint: '可转卫生政策研究、医院运营管理、健康促进项目管理；需补数据分析与项目统筹能力，过渡6-10个月。',
      prep_90d_plan: ['1-30天：梳理公卫项目执行流程与指标。', '31-60天：完成1个社区项目复盘案例。', '61-90天：完成10套公共卫生题训练。'],
      career_outlook_3to5_year: '公共卫生体系能力建设持续投入，项目型岗位需求稳定增长。',
      typical_work_week: '项目节点与突发公共事件并行时协同压力较大。',
      switch_directions: [
        { target_role: '卫生政策研究岗', switch_cost: '中', bridge_skills: ['政策评估', '数据分析'], transition_period: '6-9个月' },
        { target_role: '医院运营管理', switch_cost: '中', bridge_skills: ['流程治理', '资源统筹'], transition_period: '6-9个月' },
        { target_role: '健康促进项目经理', switch_cost: '中', bridge_skills: ['项目设计', '公众沟通'], transition_period: '6-9个月' }
      ],
      prepare_180d_plan: ['91-120天：建立项目指标监测和预警机制。', '121-150天：主导1次项目执行偏差复盘专项。', '151-180天：沉淀公共卫生项目SOP与模板。'],
      role_scope_text: '负责公共卫生项目执行与协同管理，对项目进度、覆盖效果和数据质量负责。'
    },
    commonDeductionPoints: ['项目目标拆解不清。', '执行监测数据不完整。', '跨机构协同推进乏力。', '复盘无法形成改进闭环。'],
    starTemplate: {
      situation: '某社区健康筛查项目覆盖率低于目标且进度滞后。',
      task: '在限定周期内提升覆盖率并保证数据质量。',
      action: ['重排站点计划并强化现场协同。', '优化宣教与动员路径提升参与率。', '建立周度数据核验和复盘机制。'],
      result: ['项目覆盖率提升并按期收口。', '形成可复制的社区项目执行方法。'],
      proof_materials: ['项目计划', '执行记录', '指标复盘报告']
    },
    writtenTopics: [
      { type: '项目推进', bucket: 'business_scenario', text: '公卫项目进度滞后时你如何制定追赶方案？' },
      { type: '流程设计', bucket: 'system_process', text: '请设计“动员-执行-监测-复盘”项目流程。' },
      { type: '偏差复盘', bucket: 'failure_review', text: '一次项目覆盖率未达标后你如何复盘？' },
      { type: '效率公平平衡', bucket: 'metric_tradeoff', text: '效率目标与服务公平冲突时如何取舍？' },
      { type: '指标治理', bucket: 'business_scenario', text: '如何建立公共卫生项目关键指标体系？' },
      { type: '机制建设', bucket: 'system_process', text: '如何搭建跨机构项目协同机制？' },
      { type: '误判纠偏', bucket: 'failure_review', text: '一次资源投放误判后如何纠偏？' },
      { type: '资源配置', bucket: 'metric_tradeoff', text: '多社区并发项目时如何分配资源？' },
      { type: '跨岗协同', bucket: 'cross_team_collaboration', text: '如何推动疾控、社区和医院协同执行？' },
      { type: '经验沉淀', bucket: 'system_process', text: '如何沉淀可复用的公卫项目执行模板？' }
    ],
    interviewTopics: [
      { type: '突发应对', bucket: 'business_scenario', text: '突发公共事件打断原计划时你如何应对？' },
      { type: '协同推进', bucket: 'cross_team_collaboration', text: '多机构目标不一致时你如何推动协同？' },
      { type: '复盘叙述', bucket: 'failure_review', text: '讲一次你修复公卫项目失效的经历。' },
      { type: '优先级决策', bucket: 'metric_tradeoff', text: '多项目并发时你如何排序投入？' },
      { type: '风险沟通', bucket: 'business_scenario', text: '你如何向主管部门解释项目风险与调整？' },
      { type: '机制协作', bucket: 'cross_team_collaboration', text: '如何建立常态化公卫协同机制？' },
      { type: '失误修正', bucket: 'failure_review', text: '一次执行判断失误后你如何修正？' },
      { type: '取舍题', bucket: 'metric_tradeoff', text: '短期节点达成与长期能力建设冲突时如何取舍？' },
      { type: '方案答辩', bucket: 'business_scenario', text: '如何答辩你的公共卫生项目方案？' },
      { type: '经验复制', bucket: 'cross_team_collaboration', text: '如何让团队复用你的项目管理方法？' }
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
    data_origin: 'official_jd_competency_mapping_with_manual_role_enrichment_v161_batch13_add_role019',
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
  newRole.role_detail_v158.expansion_status = 'landed_deep_profile_v161_batch13';

  roles.push(newRole);

  const writtenBasePool = writtenItems.filter((q) => q.role_id === u.sourceRoleId);
  const interviewBasePool = interviewItems.filter((q) => q.role_id === u.sourceRoleId);
  if (writtenBasePool.length === 0 || interviewBasePool.length === 0) throw new Error(`Question base missing: ${u.sourceRoleId}`);

  const industryPrefix = u.roleId.split('_ROLE_')[0];

  for (let i = 0; i < 10; i += 1) {
    const def = u.writtenTopics[i];
    const [stage, round] = WRITTEN_STAGES[i];
    const qid = `${industryPrefix}_WRITTEN_V161_R019M_${String(i + 1).padStart(2, '0')}`;
    if (writtenItems.some((q) => q.question_id === qid)) throw new Error(`Duplicate question id: ${qid}`);
    const base = writtenBasePool[i % writtenBasePool.length];
    writtenItems.push(buildQuestion(base, def, u.roleId, u.roleName, qid, stage, round, u.industryLabel, def.type, def.bucket));
  }

  for (let i = 0; i < 10; i += 1) {
    const def = u.interviewTopics[i];
    const [stage, round] = INTERVIEW_STAGES[i];
    const qid = `${industryPrefix}_INTERVIEW_V161_R019M_${String(i + 1).padStart(2, '0')}`;
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
