#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TODAY = '2026-02-20';

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
    roleId: 'IND_AUTO_INTELLIGENT_DRIVING_ROLE_018',
    sourceRoleId: 'IND_AUTO_INTELLIGENT_DRIVING_ROLE_017',
    roleName: '规控算法工程师',
    rolePatch: {
      role_readiness_floor: '至少完成1个规控算法闭环项目：场景建模、策略优化、仿真验证和车端回归。',
      day_in_life: '规控算法工程师工作周：分析路测轨迹、优化规控策略、验证安全与舒适性指标、联动仿真与车端调试。',
      growth_path_1to3_year: '0-1年掌握规控链路与指标；1-3年独立负责模块优化；3-5年可主导规控策略体系。',
      transfer_path_hint: '可转决策规划工程师、控制算法工程师、仿真评测工程师；需补控制理论与系统工程，过渡6-10个月。',
      prep_90d_plan: ['1-30天：梳理规控指标与约束条件。', '31-60天：完成1个规控异常修复案例。', '61-90天：完成10套规控算法题训练。'],
      career_outlook_3to5_year: '高阶智驾渗透推动规控能力升级，岗位需求稳定提升。',
      typical_work_week: '版本迭代和车端验证阶段任务密度高。',
      switch_directions: [
        { target_role: '决策规划工程师', switch_cost: '中', bridge_skills: ['规划策略', '场景建模'], transition_period: '6-9个月' },
        { target_role: '控制算法工程师', switch_cost: '中高', bridge_skills: ['控制理论', '动态建模'], transition_period: '7-10个月' },
        { target_role: '仿真评测工程师', switch_cost: '中', bridge_skills: ['评测指标', '场景回放'], transition_period: '6-9个月' }
      ],
      prepare_180d_plan: ['91-120天：建立高风险场景规控预警规则。', '121-150天：主导1次规控策略复盘专项。', '151-180天：沉淀规控算法验证模板。'],
      role_scope_text: '负责自动驾驶规控策略研发与优化，对行驶稳定性、安全性和策略迭代效率负责。'
    },
    commonDeductionPoints: ['只讲算法框架不讲场景约束。', '指标优化缺少安全边界。', '仿真与车端验证断层。', '复盘未形成可复用策略。'],
    starTemplate: {
      situation: '复杂路口场景下规控策略导致舒适性和安全指标波动。',
      task: '在发布窗口内优化规控策略并满足双指标门槛。',
      action: ['拆解场景并定位策略失效点。', '调整参数并做分层仿真验证。', '完成车端回归并沉淀经验。'],
      result: ['关键指标恢复并通过发布门禁。', '形成场景化规控优化模板。'],
      proof_materials: ['策略迭代记录', '仿真报告', '车端回归结果']
    },
    writtenTopics: [
      { type: '规控异常诊断', bucket: 'business_scenario', text: '复杂路口指标波动时你如何诊断并修复规控策略？' },
      { type: '规控流程设计', bucket: 'system_process', text: '请设计“场景建模-策略优化-验证-发布”流程。' },
      { type: '策略失效复盘', bucket: 'failure_review', text: '一次规控策略失效后你如何复盘？' },
      { type: '安全舒适平衡', bucket: 'metric_tradeoff', text: '安全指标和舒适性冲突时你如何取舍？' },
      { type: '边界场景覆盖', bucket: 'business_scenario', text: '如何构建规控边界场景覆盖策略？' },
      { type: '回归机制建设', bucket: 'system_process', text: '如何建立规控版本回归机制？' },
      { type: '误判纠偏', bucket: 'failure_review', text: '一次误判导致策略退化后如何纠偏？' },
      { type: '资源约束取舍', bucket: 'metric_tradeoff', text: '算力受限时如何平衡规控效果和实时性？' },
      { type: '跨团队协同', bucket: 'cross_team_collaboration', text: '如何推动规控与感知团队协同优化？' },
      { type: '经验沉淀', bucket: 'system_process', text: '如何把一次优化经验沉淀成团队机制？' }
    ],
    interviewTopics: [
      { type: '风险沟通', bucket: 'business_scenario', text: '发布窗口前规控风险未清时你如何沟通？' },
      { type: '协同推进', bucket: 'cross_team_collaboration', text: '规控和测试结论冲突时你如何推进？' },
      { type: '复盘叙述', bucket: 'failure_review', text: '讲一次你修复规控失效的完整过程。' },
      { type: '优先级决策', bucket: 'metric_tradeoff', text: '多场景异常并发时你如何排优先级？' },
      { type: '应急处置', bucket: 'business_scenario', text: '突发路测异常时你如何快速处置？' },
      { type: '机制协作', bucket: 'cross_team_collaboration', text: '如何建立规控与仿真常态协同机制？' },
      { type: '误判复盘', bucket: 'failure_review', text: '一次错误策略判断后的修正路径是什么？' },
      { type: '指标取舍', bucket: 'metric_tradeoff', text: '通过率和安全冗余冲突时你如何选择？' },
      { type: '方案答辩', bucket: 'business_scenario', text: '你如何向管理层解释规控策略调整？' },
      { type: '经验复制', bucket: 'cross_team_collaboration', text: '如何让团队复制你的规控优化方法？' }
    ]
  },
  {
    file: 'data/entries/IND_BIOMED_DEVICE.json',
    industryLabel: '生物医药与器械',
    roleId: 'IND_BIOMED_DEVICE_ROLE_018',
    sourceRoleId: 'IND_BIOMED_DEVICE_ROLE_017',
    roleName: '医学信息专员',
    rolePatch: {
      role_readiness_floor: '至少完成1个医学信息管理项目：证据整理、问答响应、风险提示和知识库迭代。',
      day_in_life: '医学信息专员工作周：整理文献和产品信息、响应内部医学问询、更新FAQ库、跟踪高频问题并输出改进建议。',
      growth_path_1to3_year: '0-1年掌握医学信息检索与合规表达；1-3年独立负责产品线信息支持；3-5年可主导医学信息体系建设。',
      transfer_path_hint: '可转医学事务、药物警戒、临床运营；需补项目管理和证据策略能力，过渡6-10个月。',
      prep_90d_plan: ['1-30天：梳理医学信息响应标准与流程。', '31-60天：完成1个高频问询优化案例。', '61-90天：完成10套医学信息题训练。'],
      career_outlook_3to5_year: '医学信息需求随产品复杂度提升而增长，岗位价值持续上升。',
      typical_work_week: '问询高峰期响应时效要求高，需兼顾准确与合规。',
      switch_directions: [
        { target_role: '医学事务', switch_cost: '中', bridge_skills: ['学术沟通', '证据解读'], transition_period: '6-9个月' },
        { target_role: '药物警戒', switch_cost: '中', bridge_skills: ['安全信息', '风险评估'], transition_period: '6-9个月' },
        { target_role: '临床运营', switch_cost: '中高', bridge_skills: ['项目推进', '中心协同'], transition_period: '7-10个月' }
      ],
      prepare_180d_plan: ['91-120天：建立高频问询预警机制。', '121-150天：主导1次问询效率复盘专项。', '151-180天：沉淀医学信息知识库模板。'],
      role_scope_text: '负责医学信息支持与问询响应，对信息准确性、响应时效和合规表达负责。'
    },
    commonDeductionPoints: ['回答缺少证据来源。', '合规边界描述不清。', '问询分类和优先级混乱。', '知识库迭代不及时。'],
    starTemplate: {
      situation: '上市后高频问询激增，响应时效和准确性下降。',
      task: '在合规前提下提升响应效率并稳定准确率。',
      action: ['分层梳理问询并建立标准回答模板。', '联动医学团队补充证据链。', '更新知识库并跟踪改进效果。'],
      result: ['响应时效提升且错误率下降。', '形成可复用问询管理机制。'],
      proof_materials: ['问询台账', '标准答复模板', '知识库更新记录']
    },
    writtenTopics: [
      { type: '问询提效', bucket: 'business_scenario', text: '高频问询激增时你如何保证响应质量和时效？' },
      { type: '流程设计', bucket: 'system_process', text: '请设计“收集-分类-答复-复盘”流程。' },
      { type: '答复失误复盘', bucket: 'failure_review', text: '一次答复失误后你如何复盘和修正？' },
      { type: '时效准确平衡', bucket: 'metric_tradeoff', text: '时效压力和准确性冲突时如何取舍？' },
      { type: '证据管理', bucket: 'business_scenario', text: '如何建立医学证据快速检索机制？' },
      { type: '知识库建设', bucket: 'system_process', text: '如何搭建可维护的医学信息知识库？' },
      { type: '误判纠偏', bucket: 'failure_review', text: '一次问题分类误判后的纠偏路径是什么？' },
      { type: '资源配置', bucket: 'metric_tradeoff', text: '资源有限时如何处理问询优先级？' },
      { type: '跨岗协同', bucket: 'cross_team_collaboration', text: '如何推动医学、注册和市场协同？' },
      { type: '经验沉淀', bucket: 'system_process', text: '如何沉淀高价值问询为机制？' }
    ],
    interviewTopics: [
      { type: '突发应对', bucket: 'business_scenario', text: '突发安全信息问询时你如何应对？' },
      { type: '协同推进', bucket: 'cross_team_collaboration', text: '医学与市场口径冲突时你如何协调？' },
      { type: '复盘叙述', bucket: 'failure_review', text: '讲一次你修复问询失误的经历。' },
      { type: '优先级决策', bucket: 'metric_tradeoff', text: '多条高优问询并发时你如何排序？' },
      { type: '风险沟通', bucket: 'business_scenario', text: '你如何向管理层说明信息风险？' },
      { type: '机制协作', bucket: 'cross_team_collaboration', text: '如何建立跨团队问询协同机制？' },
      { type: '失误修正', bucket: 'failure_review', text: '一次错误判断后你如何纠偏？' },
      { type: '取舍题', bucket: 'metric_tradeoff', text: '完整性和响应速度冲突时你如何选择？' },
      { type: '答辩表达', bucket: 'business_scenario', text: '如何解释你的问询分层策略？' },
      { type: '经验分享', bucket: 'cross_team_collaboration', text: '如何让团队复用你的应答模板？' }
    ]
  },
  {
    file: 'data/entries/IND_ECOMMERCE_CROSSBORDER.json',
    industryLabel: '电商与跨境电商',
    roleId: 'IND_ECOMMERCE_CROSSBORDER_ROLE_018',
    sourceRoleId: 'IND_ECOMMERCE_CROSSBORDER_ROLE_017',
    roleName: '跨境物流运营',
    rolePatch: {
      role_readiness_floor: '至少完成1个跨境物流优化项目：线路评估、时效控制、异常闭环和成本优化。',
      day_in_life: '跨境物流运营工作周：监控物流时效、协调仓配与承运商、处理异常包裹、优化线路和费用结构。',
      growth_path_1to3_year: '0-1年掌握跨境物流链路与指标；1-3年独立负责线路优化；3-5年可主导多区域物流策略。',
      transfer_path_hint: '可转供应链策略、履约运营经理、国际采购协同；需补预测和成本建模能力，过渡6-10个月。',
      prep_90d_plan: ['1-30天：梳理物流关键节点和时效指标。', '31-60天：完成1个异常高发线路优化案例。', '61-90天：完成10套物流运营题训练。'],
      career_outlook_3to5_year: '跨境履约复杂度持续提升，物流运营岗位需求稳定增长。',
      typical_work_week: '大促和节假日跨境波动期需高频调度。',
      switch_directions: [
        { target_role: '供应链策略岗', switch_cost: '中', bridge_skills: ['库存联动', '成本模型'], transition_period: '6-9个月' },
        { target_role: '履约运营经理', switch_cost: '中', bridge_skills: ['履约体系', '服务管理'], transition_period: '6-9个月' },
        { target_role: '国际采购协同', switch_cost: '中高', bridge_skills: ['采购协作', '计划管理'], transition_period: '7-10个月' }
      ],
      prepare_180d_plan: ['91-120天：建立高风险线路预警机制。', '121-150天：主导1次履约异常复盘专项。', '151-180天：沉淀线路优化与异常应急手册。'],
      role_scope_text: '负责跨境物流履约与优化，对时效稳定性、异常处理效率和物流成本负责。'
    },
    commonDeductionPoints: ['只看时效不看成本结构。', '异常处理缺少分层策略。', '承运商管理机制薄弱。', '复盘未形成可执行动作。'],
    starTemplate: {
      situation: '核心线路时效波动并引发投诉上升。',
      task: '在高峰期稳定履约并控制物流成本。',
      action: ['定位波动环节并重排线路优先级。', '联动仓配与承运商调整发运策略。', '建立日级监控与复盘机制。'],
      result: ['时效恢复且投诉率下降。', '形成高峰期物流应对模板。'],
      proof_materials: ['线路监控报表', '异常处置记录', '成本复盘']
    },
    writtenTopics: [
      { type: '时效修复', bucket: 'business_scenario', text: '核心线路时效下滑时你如何快速修复？' },
      { type: '流程设计', bucket: 'system_process', text: '请设计“监控-分流-处置-复盘”物流流程。' },
      { type: '异常复盘', bucket: 'failure_review', text: '一次异常大面积爆发后你如何复盘？' },
      { type: '成本时效平衡', bucket: 'metric_tradeoff', text: '降本和时效冲突时你如何取舍？' },
      { type: '承运商治理', bucket: 'business_scenario', text: '如何优化承运商绩效与合作策略？' },
      { type: '机制建设', bucket: 'system_process', text: '如何建立跨境异常预警机制？' },
      { type: '误判纠偏', bucket: 'failure_review', text: '线路判断失误后的纠偏路径是什么？' },
      { type: '资源排序', bucket: 'metric_tradeoff', text: '多区域线路同时异常时如何分配资源？' },
      { type: '跨岗协同', bucket: 'cross_team_collaboration', text: '如何推动物流与客服协同降投诉？' },
      { type: '经验沉淀', bucket: 'system_process', text: '如何沉淀可复用线路优化方法？' }
    ],
    interviewTopics: [
      { type: '突发应急', bucket: 'business_scenario', text: '清关突发延迟时你如何应急？' },
      { type: '协同推进', bucket: 'cross_team_collaboration', text: '仓配与物流责任分歧时你如何推进？' },
      { type: '复盘叙述', bucket: 'failure_review', text: '讲一次你处理履约失效的完整复盘。' },
      { type: '优先级决策', bucket: 'metric_tradeoff', text: '多异常并发时你如何排序？' },
      { type: '风险沟通', bucket: 'business_scenario', text: '你如何向管理层解释线路风险？' },
      { type: '机制协作', bucket: 'cross_team_collaboration', text: '如何建立跨团队物流协同机制？' },
      { type: '误判修正', bucket: 'failure_review', text: '一次判断偏差后你如何修正？' },
      { type: '取舍题', bucket: 'metric_tradeoff', text: '履约体验与成本压力冲突时如何取舍？' },
      { type: '方案答辩', bucket: 'business_scenario', text: '如何答辩你的线路优化方案？' },
      { type: '经验复制', bucket: 'cross_team_collaboration', text: '如何让团队复制你的履约优化打法？' }
    ]
  },
  {
    file: 'data/entries/IND_ENERGY_UTILITIES.json',
    industryLabel: '能源与公用事业',
    roleId: 'IND_ENERGY_UTILITIES_ROLE_018',
    sourceRoleId: 'IND_ENERGY_UTILITIES_ROLE_017',
    roleName: '需求侧响应分析师',
    rolePatch: {
      role_readiness_floor: '至少完成1个需求侧响应项目：负荷评估、策略设计、执行监测和复盘优化。',
      day_in_life: '需求侧响应分析师工作周：分析负荷波动、设计响应策略、监测执行效果、协同调度和用户侧推进。',
      growth_path_1to3_year: '0-1年掌握响应机制与指标；1-3年独立负责策略分析；3-5年可主导区域需求响应体系。',
      transfer_path_hint: '可转调度优化、电力市场分析、能源产品策略；需补市场建模与产品思维，过渡6-10个月。',
      prep_90d_plan: ['1-30天：梳理需求响应流程与关键指标。', '31-60天：完成1个高峰削峰案例。', '61-90天：完成10套需求响应题训练。'],
      career_outlook_3to5_year: '新型电力系统建设使需求侧响应岗位需求持续提升。',
      typical_work_week: '高峰负荷和极端天气期需实时监测和快速决策。',
      switch_directions: [
        { target_role: '调度优化工程师', switch_cost: '中', bridge_skills: ['调度策略', '运行约束'], transition_period: '6-9个月' },
        { target_role: '电力市场分析', switch_cost: '中', bridge_skills: ['交易机制', '价格分析'], transition_period: '6-9个月' },
        { target_role: '能源产品策略', switch_cost: '中高', bridge_skills: ['产品设计', '需求建模'], transition_period: '7-10个月' }
      ],
      prepare_180d_plan: ['91-120天：建立响应策略效果评估机制。', '121-150天：主导1次削峰专项复盘。', '151-180天：沉淀需求响应策略模板。'],
      role_scope_text: '负责需求侧响应分析与策略优化，对削峰填谷效果、执行稳定性和用户协同效率负责。'
    },
    commonDeductionPoints: ['策略只看结果不看约束。', '执行监测维度不完整。', '用户侧协同推进不足。', '复盘无法支撑迭代。'],
    starTemplate: {
      situation: '夏季高峰负荷压力增大，现有响应策略效果不足。',
      task: '快速优化需求响应策略并稳定高峰运行。',
      action: ['拆解负荷曲线并识别可调节资源。', '优化响应策略并阶段验证。', '建立周度监测和复盘机制。'],
      result: ['削峰效果提升且系统运行更稳定。', '形成可复用响应优化机制。'],
      proof_materials: ['负荷分析报告', '响应执行记录', '效果评估表']
    },
    writtenTopics: [
      { type: '削峰策略优化', bucket: 'business_scenario', text: '高峰负荷压力增大时你如何优化响应策略？' },
      { type: '流程设计', bucket: 'system_process', text: '请设计“评估-执行-监测-复盘”流程。' },
      { type: '策略失效复盘', bucket: 'failure_review', text: '一次响应策略失效后你如何复盘？' },
      { type: '稳定效率平衡', bucket: 'metric_tradeoff', text: '运行稳定和响应效率冲突时你如何取舍？' },
      { type: '资源识别', bucket: 'business_scenario', text: '如何识别可调节负荷资源并量化收益？' },
      { type: '机制建设', bucket: 'system_process', text: '如何建立需求响应效果评估机制？' },
      { type: '误判纠偏', bucket: 'failure_review', text: '一次预测误差导致执行偏差后如何纠偏？' },
      { type: '资源排序', bucket: 'metric_tradeoff', text: '多策略并发时如何分配执行资源？' },
      { type: '跨岗协同', bucket: 'cross_team_collaboration', text: '如何推动调度和用户侧协同执行？' },
      { type: '经验沉淀', bucket: 'system_process', text: '如何把成功策略沉淀为标准流程？' }
    ],
    interviewTopics: [
      { type: '高峰应急', bucket: 'business_scenario', text: '高峰期响应效果不足时你如何应急？' },
      { type: '协同推进', bucket: 'cross_team_collaboration', text: '调度与用户侧目标冲突时你如何推进？' },
      { type: '复盘叙述', bucket: 'failure_review', text: '讲一次你修复响应失效的过程。' },
      { type: '优先级决策', bucket: 'metric_tradeoff', text: '多区域并发压力时你如何排序处置？' },
      { type: '风险沟通', bucket: 'business_scenario', text: '如何向管理层解释响应策略调整？' },
      { type: '机制协作', bucket: 'cross_team_collaboration', text: '如何建立长期协同机制？' },
      { type: '误判修正', bucket: 'failure_review', text: '一次策略误判后的修正路径是什么？' },
      { type: '取舍题', bucket: 'metric_tradeoff', text: '局部最优和全局稳定冲突时如何取舍？' },
      { type: '方案答辩', bucket: 'business_scenario', text: '如何答辩你的削峰策略方案？' },
      { type: '经验复制', bucket: 'cross_team_collaboration', text: '如何让团队复制你的响应优化方法？' }
    ]
  },
  {
    file: 'data/entries/IND_FIN_BANK.json',
    industryLabel: '金融-银行',
    roleId: 'IND_FIN_BANK_ROLE_018',
    sourceRoleId: 'IND_FIN_BANK_ROLE_017',
    roleName: '对公授信分析师',
    rolePatch: {
      role_readiness_floor: '至少完成1个对公授信分析项目：财务穿透、行业评估、额度建议和风险复盘。',
      day_in_life: '对公授信分析师工作周：解读企业财务和现金流、评估行业风险、形成授信建议、跟踪贷后表现并复盘。',
      growth_path_1to3_year: '0-1年掌握对公授信分析框架；1-3年独立评审重点客户；3-5年可主导行业化授信策略。',
      transfer_path_hint: '可转授信审批经理、风险管理岗、公司金融产品岗；需补组合管理与产品思维，过渡6-10个月。',
      prep_90d_plan: ['1-30天：梳理授信分析关键指标和红线。', '31-60天：完成1个行业授信复盘案例。', '61-90天：完成10套授信分析题训练。'],
      career_outlook_3to5_year: '产业分化和风险定价需求提升，对公授信分析岗位持续高需求。',
      typical_work_week: '审批高峰和行业波动期分析任务高密度。',
      switch_directions: [
        { target_role: '授信审批经理', switch_cost: '中', bridge_skills: ['审批决策', '流程管理'], transition_period: '6-9个月' },
        { target_role: '风险管理岗', switch_cost: '中', bridge_skills: ['组合监控', '预警体系'], transition_period: '6-9个月' },
        { target_role: '公司金融产品岗', switch_cost: '中高', bridge_skills: ['产品设计', '行业方案'], transition_period: '7-10个月' }
      ],
      prepare_180d_plan: ['91-120天：建立行业授信风险清单。', '121-150天：主导1次授信偏差复盘专项。', '151-180天：沉淀授信分析模板和校验规则。'],
      role_scope_text: '负责对公授信风险分析与建议，对授信质量、风险识别和贷后可控性负责。'
    },
    commonDeductionPoints: ['财务分析停留表面。', '行业风险判断证据不足。', '额度建议缺乏约束条件。', '贷后跟踪机制不清。'],
    starTemplate: {
      situation: '重点行业客户授信申请增长但风险波动加剧。',
      task: '在保障业务支持前提下提升授信质量。',
      action: ['拆解现金流与担保结构风险。', '分层给出额度和约束建议。', '跟踪贷后表现并迭代分析规则。'],
      result: ['授信通过率和风险控制同步优化。', '形成行业化授信分析模板。'],
      proof_materials: ['授信分析报告', '风险评估表', '贷后跟踪记录']
    },
    writtenTopics: [
      { type: '授信评估', bucket: 'business_scenario', text: '行业波动期你如何评估对公授信申请？' },
      { type: '流程设计', bucket: 'system_process', text: '请设计“分析-建议-决策-跟踪”流程。' },
      { type: '误判复盘', bucket: 'failure_review', text: '一次授信误判后你如何复盘？' },
      { type: '业务风险平衡', bucket: 'metric_tradeoff', text: '业务支持和风险控制冲突时如何取舍？' },
      { type: '行业穿透', bucket: 'business_scenario', text: '如何做行业穿透分析并形成结论？' },
      { type: '规则建设', bucket: 'system_process', text: '如何建立授信分析校验规则？' },
      { type: '纠偏机制', bucket: 'failure_review', text: '一次额度建议偏差后如何纠偏？' },
      { type: '资源排序', bucket: 'metric_tradeoff', text: '多项目并发时如何分配分析资源？' },
      { type: '跨岗协同', bucket: 'cross_team_collaboration', text: '如何推动业务与风控协同？' },
      { type: '经验沉淀', bucket: 'system_process', text: '如何沉淀行业授信分析经验？' }
    ],
    interviewTopics: [
      { type: '风险沟通', bucket: 'business_scenario', text: '业务方强推项目时你如何坚持风险底线？' },
      { type: '协同推进', bucket: 'cross_team_collaboration', text: '风控与审批意见冲突时你如何推进？' },
      { type: '复盘叙述', bucket: 'failure_review', text: '讲一次你修复授信偏差的过程。' },
      { type: '优先级决策', bucket: 'metric_tradeoff', text: '多行业项目并发时你如何排序？' },
      { type: '答辩表达', bucket: 'business_scenario', text: '你如何解释额度收紧策略？' },
      { type: '机制协作', bucket: 'cross_team_collaboration', text: '如何建立常态化授信协同机制？' },
      { type: '误判修正', bucket: 'failure_review', text: '一次错误判断后你如何修正？' },
      { type: '取舍题', bucket: 'metric_tradeoff', text: '短期增长和长期风险冲突时如何取舍？' },
      { type: '突发应对', bucket: 'business_scenario', text: '行业突发风险时你如何快速重评？' },
      { type: '经验复制', bucket: 'cross_team_collaboration', text: '如何让团队复用你的分析框架？' }
    ]
  },
  {
    file: 'data/entries/IND_FIN_SECURITIES_FUND.json',
    industryLabel: '金融-证券基金',
    roleId: 'IND_FIN_SECURITIES_FUND_ROLE_018',
    sourceRoleId: 'IND_FIN_SECURITIES_FUND_ROLE_017',
    roleName: '衍生品策略研究员',
    rolePatch: {
      role_readiness_floor: '至少完成1个衍生品策略项目：结构设计、风险评估、执行跟踪和复盘优化。',
      day_in_life: '衍生品策略研究员工作周：分析波动和期限结构、设计策略组合、评估对冲效果、跟踪执行偏差并复盘。',
      growth_path_1to3_year: '0-1年掌握衍生品定价与风险指标；1-3年独立完成策略研究；3-5年可主导多策略组合框架。',
      transfer_path_hint: '可转量化策略研究、交易执行、风险管理；需补实时交易与工程化能力，过渡6-10个月。',
      prep_90d_plan: ['1-30天：梳理衍生品策略和风险框架。', '31-60天：完成1个策略回撤复盘案例。', '61-90天：完成10套衍生品策略题训练。'],
      career_outlook_3to5_year: '机构风险管理需求上升，衍生品策略岗位需求稳定增长。',
      typical_work_week: '波动加剧阶段研究频次高，盘中盘后协同紧密。',
      switch_directions: [
        { target_role: '量化策略研究', switch_cost: '中', bridge_skills: ['因子建模', '回测框架'], transition_period: '6-9个月' },
        { target_role: '交易执行', switch_cost: '中', bridge_skills: ['执行策略', '盘面管理'], transition_period: '6-9个月' },
        { target_role: '风险管理', switch_cost: '中', bridge_skills: ['VaR', '压力测试'], transition_period: '6-9个月' }
      ],
      prepare_180d_plan: ['91-120天：建立策略风险预算机制。', '121-150天：主导1次策略回撤复盘专项。', '151-180天：沉淀衍生品策略研究模板。'],
      role_scope_text: '负责衍生品策略研究与优化，对策略稳健性、风险控制和执行协同质量负责。'
    },
    commonDeductionPoints: ['只看收益不看风险暴露。', '策略假设缺少验证。', '执行偏差分析不足。', '复盘不形成策略迭代。'],
    starTemplate: {
      situation: '市场波动结构变化导致既有衍生品策略失效。',
      task: '快速调整策略并控制组合回撤。',
      action: ['拆解收益与风险来源。', '调整策略参数并做样本外验证。', '跟踪执行并持续迭代。'],
      result: ['回撤收敛且策略表现恢复。', '形成策略调整标准流程。'],
      proof_materials: ['策略报告', '风险监控表', '执行复盘记录']
    },
    writtenTopics: [
      { type: '策略调整', bucket: 'business_scenario', text: '波动结构变化下你如何调整衍生品策略？' },
      { type: '流程设计', bucket: 'system_process', text: '请设计“建模-验证-执行-复盘”流程。' },
      { type: '回撤复盘', bucket: 'failure_review', text: '一次策略回撤扩大后你如何复盘？' },
      { type: '收益风险平衡', bucket: 'metric_tradeoff', text: '收益目标和风险预算冲突时如何取舍？' },
      { type: '结构研判', bucket: 'business_scenario', text: '如何评估期限结构变化对策略影响？' },
      { type: '机制建设', bucket: 'system_process', text: '如何建立策略风险预算机制？' },
      { type: '误判纠偏', bucket: 'failure_review', text: '一次方向误判后的纠偏路径是什么？' },
      { type: '资源配置', bucket: 'metric_tradeoff', text: '多策略并行时如何配置研究资源？' },
      { type: '跨岗协同', bucket: 'cross_team_collaboration', text: '如何推动研究与交易协同执行？' },
      { type: '经验沉淀', bucket: 'system_process', text: '如何沉淀衍生品研究经验为规范？' }
    ],
    interviewTopics: [
      { type: '突发应对', bucket: 'business_scenario', text: '突发行情导致策略失效时你如何应对？' },
      { type: '协同推进', bucket: 'cross_team_collaboration', text: '研究和交易执行意见冲突时你如何推进？' },
      { type: '复盘叙述', bucket: 'failure_review', text: '讲一次你修复策略回撤的过程。' },
      { type: '优先级决策', bucket: 'metric_tradeoff', text: '多策略异常并发时你如何排序处理？' },
      { type: '风险沟通', bucket: 'business_scenario', text: '如何向投资经理解释策略风险？' },
      { type: '机制协作', bucket: 'cross_team_collaboration', text: '如何建立投研交易协同机制？' },
      { type: '失误修正', bucket: 'failure_review', text: '一次失误判断后你如何修正？' },
      { type: '取舍题', bucket: 'metric_tradeoff', text: '收益修复和风险控制冲突时如何取舍？' },
      { type: '答辩表达', bucket: 'business_scenario', text: '你如何答辩策略参数调整方案？' },
      { type: '经验复制', bucket: 'cross_team_collaboration', text: '如何让团队复用你的策略框架？' }
    ]
  },
  {
    file: 'data/entries/IND_NEW_ENERGY.json',
    industryLabel: '新能源',
    roleId: 'IND_NEW_ENERGY_ROLE_018',
    sourceRoleId: 'IND_NEW_ENERGY_ROLE_017',
    roleName: '新能源交易风控专员',
    rolePatch: {
      role_readiness_floor: '至少完成1个新能源交易风控项目：风险识别、阈值设置、预警处置和复盘优化。',
      day_in_life: '新能源交易风控专员工作周：监控持仓和价格风险、设置预警阈值、联动交易调整仓位、复盘风险事件。',
      growth_path_1to3_year: '0-1年掌握交易风控框架和指标；1-3年独立负责风控策略；3-5年可主导交易风控体系建设。',
      transfer_path_hint: '可转能源交易策略、风险管理经理、量化风控岗；需补模型能力与系统化治理，过渡6-10个月。',
      prep_90d_plan: ['1-30天：梳理新能源交易风险框架。', '31-60天：完成1个风险预警处置案例。', '61-90天：完成10套交易风控题训练。'],
      career_outlook_3to5_year: '市场化交易深化下，新能源交易风控岗位需求快速增长。',
      typical_work_week: '价格波动期风控响应频次显著增加。',
      switch_directions: [
        { target_role: '能源交易策略岗', switch_cost: '中', bridge_skills: ['策略建模', '收益归因'], transition_period: '6-9个月' },
        { target_role: '风险管理经理', switch_cost: '中', bridge_skills: ['体系治理', '团队管理'], transition_period: '6-9个月' },
        { target_role: '量化风控岗', switch_cost: '中高', bridge_skills: ['模型开发', '监控系统'], transition_period: '7-10个月' }
      ],
      prepare_180d_plan: ['91-120天：建立交易风险阈值库。', '121-150天：主导1次极端行情风控复盘。', '151-180天：沉淀交易风控SOP与报告模板。'],
      role_scope_text: '负责新能源交易风险监控与策略优化，对风险暴露、预警时效和损失控制负责。'
    },
    commonDeductionPoints: ['只看价格不看持仓结构。', '预警阈值设置缺乏依据。', '处置动作不及时。', '复盘不沉淀机制。'],
    starTemplate: {
      situation: '极端行情导致持仓风险快速放大，潜在损失超预警线。',
      task: '在控制损失前提下保障交易连续性。',
      action: ['实时评估暴露并触发预警流程。', '联动交易团队调整仓位和策略。', '复盘事件并优化阈值机制。'],
      result: ['损失控制在阈值内。', '形成可复制的极端行情风控流程。'],
      proof_materials: ['风险看板', '预警记录', '事件复盘报告']
    },
    writtenTopics: [
      { type: '风险处置', bucket: 'business_scenario', text: '极端行情下你如何快速控制交易风险？' },
      { type: '流程设计', bucket: 'system_process', text: '请设计“监测-预警-处置-复盘”风控流程。' },
      { type: '事件复盘', bucket: 'failure_review', text: '一次风控处置失效后你如何复盘？' },
      { type: '收益风险平衡', bucket: 'metric_tradeoff', text: '收益追求和风控底线冲突时如何取舍？' },
      { type: '阈值设定', bucket: 'business_scenario', text: '如何设定可执行的风险阈值？' },
      { type: '机制建设', bucket: 'system_process', text: '如何建立交易风险预警机制？' },
      { type: '误判纠偏', bucket: 'failure_review', text: '一次误判导致损失扩大后如何纠偏？' },
      { type: '资源排序', bucket: 'metric_tradeoff', text: '多风险事件并发时如何分配风控资源？' },
      { type: '跨岗协同', bucket: 'cross_team_collaboration', text: '如何推动风控与交易协同执行？' },
      { type: '经验沉淀', bucket: 'system_process', text: '如何沉淀风控事件经验形成规范？' }
    ],
    interviewTopics: [
      { type: '突发应对', bucket: 'business_scenario', text: '价格闪崩时你如何应急处置？' },
      { type: '协同推进', bucket: 'cross_team_collaboration', text: '交易团队不愿减仓时你如何推进？' },
      { type: '复盘叙述', bucket: 'failure_review', text: '讲一次你处理重大风险事件的过程。' },
      { type: '优先级决策', bucket: 'metric_tradeoff', text: '多项风险并发时你如何排序？' },
      { type: '风险沟通', bucket: 'business_scenario', text: '如何向管理层解释风险敞口变化？' },
      { type: '机制协作', bucket: 'cross_team_collaboration', text: '如何建立常态化风控协同机制？' },
      { type: '失误修正', bucket: 'failure_review', text: '一次判断失误后你如何修正？' },
      { type: '取舍题', bucket: 'metric_tradeoff', text: '止损和盈利机会冲突时如何取舍？' },
      { type: '答辩表达', bucket: 'business_scenario', text: '你如何答辩风控阈值调整方案？' },
      { type: '经验复制', bucket: 'cross_team_collaboration', text: '如何让团队复制你的风控方法？' }
    ]
  },
  {
    file: 'data/entries/IND_PUBLIC_INSTITUTION.json',
    industryLabel: '事业单位体系',
    roleId: 'IND_PUBLIC_INSTITUTION_ROLE_018',
    sourceRoleId: 'IND_PUBLIC_INSTITUTION_ROLE_017',
    roleName: '医院行政管理专员',
    rolePatch: {
      role_readiness_floor: '至少完成1个医院行政管理项目：流程优化、跨科室协同、制度执行和复盘提升。',
      day_in_life: '医院行政管理专员工作周：统筹行政事务、协调科室需求、跟踪制度执行、处理突发事项并复盘改进。',
      growth_path_1to3_year: '0-1年掌握医院行政流程；1-3年独立负责行政专项；3-5年可主导跨部门流程优化。',
      transfer_path_hint: '可转医务管理、后勤保障管理、运营管理岗；需补项目管理和数据分析能力，过渡6-10个月。',
      prep_90d_plan: ['1-30天：梳理医院行政关键流程与制度。', '31-60天：完成1个跨科室协同优化案例。', '61-90天：完成10套行政管理题训练。'],
      career_outlook_3to5_year: '医院精细化管理持续推进，行政管理岗位需求稳定且趋向专业化。',
      typical_work_week: '高峰门诊和评审周期内协同任务集中。',
      switch_directions: [
        { target_role: '医务管理岗', switch_cost: '中', bridge_skills: ['制度治理', '临床协同'], transition_period: '6-9个月' },
        { target_role: '后勤保障管理', switch_cost: '中', bridge_skills: ['资源统筹', '服务管理'], transition_period: '6-9个月' },
        { target_role: '运营管理岗', switch_cost: '中', bridge_skills: ['指标分析', '流程优化'], transition_period: '6-9个月' }
      ],
      prepare_180d_plan: ['91-120天：建立行政任务优先级机制。', '121-150天：主导1次跨科室协同复盘专项。', '151-180天：沉淀行政管理SOP与检查清单。'],
      role_scope_text: '负责医院行政事务统筹与流程优化，对执行效率、协同质量和制度落地效果负责。'
    },
    commonDeductionPoints: ['只做事务执行不做流程优化。', '跨科室协同缺少机制。', '制度执行无量化跟踪。', '复盘不形成改进闭环。'],
    starTemplate: {
      situation: '门诊高峰期行政协同不畅导致服务效率下降。',
      task: '在不增加编制前提下提升行政协同效率。',
      action: ['梳理关键流程并识别瓶颈。', '协调科室优化排班与支持机制。', '建立指标跟踪与周复盘机制。'],
      result: ['行政响应效率提升且投诉下降。', '形成高峰期协同管理机制。'],
      proof_materials: ['流程图', '协同计划', '改进效果报告']
    },
    writtenTopics: [
      { type: '协同提效', bucket: 'business_scenario', text: '门诊高峰协同不畅时你如何提效？' },
      { type: '流程设计', bucket: 'system_process', text: '请设计“统筹-执行-跟踪-复盘”行政流程。' },
      { type: '失效复盘', bucket: 'failure_review', text: '一次行政协同失效后你如何复盘？' },
      { type: '效率公平平衡', bucket: 'metric_tradeoff', text: '效率提升与服务公平冲突时如何取舍？' },
      { type: '任务诊断', bucket: 'business_scenario', text: '如何识别高频行政瓶颈并排序？' },
      { type: '机制建设', bucket: 'system_process', text: '如何建立跨科室协同机制？' },
      { type: '误判纠偏', bucket: 'failure_review', text: '一次任务优先级误判后如何纠偏？' },
      { type: '资源配置', bucket: 'metric_tradeoff', text: '资源有限时如何分配行政支持？' },
      { type: '跨岗协同', bucket: 'cross_team_collaboration', text: '如何推动行政与医务协同改进？' },
      { type: '经验沉淀', bucket: 'system_process', text: '如何沉淀行政管理经验形成SOP？' }
    ],
    interviewTopics: [
      { type: '突发应对', bucket: 'business_scenario', text: '突发事件导致服务中断时你如何应对？' },
      { type: '协同推进', bucket: 'cross_team_collaboration', text: '科室间任务冲突时你如何推进？' },
      { type: '复盘叙述', bucket: 'failure_review', text: '讲一次你修复行政流程失效的经历。' },
      { type: '优先级决策', bucket: 'metric_tradeoff', text: '多项行政任务并发时你如何排序？' },
      { type: '风险沟通', bucket: 'business_scenario', text: '如何向管理层解释行政风险和方案？' },
      { type: '机制协作', bucket: 'cross_team_collaboration', text: '如何建立常态化协同机制？' },
      { type: '失误修正', bucket: 'failure_review', text: '一次判断失误后你如何修正？' },
      { type: '取舍题', bucket: 'metric_tradeoff', text: '短期应急和长期机制冲突时如何取舍？' },
      { type: '方案答辩', bucket: 'business_scenario', text: '你如何答辩行政流程优化方案？' },
      { type: '经验复制', bucket: 'cross_team_collaboration', text: '如何让团队复用你的管理方法？' }
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
    data_origin: 'official_jd_competency_mapping_with_manual_role_enrichment_v161_batch12_add_role018',
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
  newRole.role_detail_v158.expansion_status = 'landed_deep_profile_v161_batch12';

  roles.push(newRole);

  const writtenBasePool = writtenItems.filter((q) => q.role_id === u.sourceRoleId);
  const interviewBasePool = interviewItems.filter((q) => q.role_id === u.sourceRoleId);
  if (writtenBasePool.length === 0 || interviewBasePool.length === 0) throw new Error(`Question base missing: ${u.sourceRoleId}`);

  const industryPrefix = u.roleId.split('_ROLE_')[0];

  for (let i = 0; i < 10; i += 1) {
    const def = u.writtenTopics[i];
    const [stage, round] = WRITTEN_STAGES[i];
    const qid = `${industryPrefix}_WRITTEN_V161_R018L_${String(i + 1).padStart(2, '0')}`;
    if (writtenItems.some((q) => q.question_id === qid)) throw new Error(`Duplicate question id: ${qid}`);
    const base = writtenBasePool[i % writtenBasePool.length];
    writtenItems.push(buildQuestion(base, def, u.roleId, u.roleName, qid, stage, round, u.industryLabel, def.type, def.bucket));
  }

  for (let i = 0; i < 10; i += 1) {
    const def = u.interviewTopics[i];
    const [stage, round] = INTERVIEW_STAGES[i];
    const qid = `${industryPrefix}_INTERVIEW_V161_R018L_${String(i + 1).padStart(2, '0')}`;
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
