#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TODAY = '2026-02-20';

const updates = [
  {
    file: 'data/entries/IND_AUTO_INTELLIGENT_DRIVING.json',
    roleId: 'IND_AUTO_INTELLIGENT_DRIVING_ROLE_010',
    roleName: '功能安全工程师',
    rolePatch: {
      role_readiness_floor: '至少能讲清1个ISO 26262落地案例：HARA、ASIL分配、安全机制设计和验证闭环。',
      day_in_life: '功能安全工程师工作周：需求评审做安全分析、更新安全概念与技术安全需求、跟踪验证缺陷、组织功能安全评审。',
      growth_path_1to3_year: '0-1年掌握功能安全标准和文档体系；1-3年独立负责模块级安全闭环；3-5年可主导整车级安全策略与审计应对。',
      transfer_path_hint: '可转系统工程师、车端安全架构师、网络安全工程师；需补系统架构与威胁建模，过渡6-10个月。',
      prep_90d_plan: [
        '1-30天：系统学习ISO 26262关键章节并输出HARA模板。',
        '31-60天：完成1个安全需求到验证闭环案例。',
        '61-90天：完成10套功能安全题训练，重点演练ASIL取舍与证据链表达。'
      ],
      career_outlook_3to5_year: '智驾功能复杂度上升，功能安全岗位长期紧缺，核心能力转向跨域协同和体系化验证。',
      typical_work_week: '需求变更和里程碑评审驱动明显，量产前验证与审计阶段强度较高。',
      switch_directions: [
        { target_role: '系统工程师', switch_cost: '中', bridge_skills: ['系统分解', '接口管理'], transition_period: '5-8个月' },
        { target_role: '车端安全架构师', switch_cost: '中高', bridge_skills: ['安全架构', '失效机理'], transition_period: '7-10个月' },
        { target_role: '网络安全工程师', switch_cost: '中', bridge_skills: ['TARA', '攻击面分析'], transition_period: '6-9个月' }
      ],
      prepare_180d_plan: [
        '91-120天：建立安全缺陷分级和周追踪机制。',
        '121-150天：主导1次跨域安全评审专项。',
        '151-180天：沉淀功能安全需求追踪与审计材料模板。'
      ],
      role_scope_text: '负责功能安全分析、需求分解与验证闭环，对安全风险可控性和审计通过率负责。'
    },
    commonDeductionPoints: [
      '只会背标准条款，无法落到系统设计。',
      'ASIL分级逻辑不清，缺少量化依据。',
      '安全需求与验证证据链断裂。',
      '跨团队协同薄弱，问题长期悬而未决。'
    ],
    starTemplate: {
      situation: '关键功能在验证阶段暴露高风险失效模式，影响量产节点。',
      task: '在节点前完成风险降级并补齐安全证据链。',
      action: [
        '重做HARA并校准ASIL等级。',
        '联合硬件和软件团队修正安全机制。',
        '执行回归验证并更新安全案例文档。'
      ],
      result: [
        '高风险项按期关闭并通过评审。',
        '形成可复用的安全分析和验证模板。'
      ],
      proof_materials: ['HARA文档', '安全需求追踪表', '验证报告']
    },
    writtenAdds: [
      { id: 'IND_AUTO_INTELLIGENT_DRIVING_WRITTEN_V161_R010D_01', stage: 'campus_early_batch_written', round: '提前批笔试', scenarioBucket: 'business_scenario', type: 'ASIL分级与风险处置', prompt: '【行业:汽车与智能驾驶｜岗位:功能安全工程师｜阶段:提前批笔试】关键功能失效风险升级，你如何重新分级并制定处置方案？' },
      { id: 'IND_AUTO_INTELLIGENT_DRIVING_WRITTEN_V161_R010D_02', stage: 'campus_main_batch_written', round: '主批笔试', scenarioBucket: 'system_process', type: '功能安全流程设计', prompt: '【行业:汽车与智能驾驶｜岗位:功能安全工程师｜阶段:主批笔试】请设计从HARA到验证关闭的功能安全流程。' },
      { id: 'IND_AUTO_INTELLIGENT_DRIVING_WRITTEN_V161_R010D_03', stage: 'campus_supplement_written', round: '补录笔试', scenarioBucket: 'failure_review', type: '安全缺陷复发复盘', prompt: '【行业:汽车与智能驾驶｜岗位:功能安全工程师｜阶段:补录笔试】同类安全缺陷复发时如何复盘机制失效？' },
      { id: 'IND_AUTO_INTELLIGENT_DRIVING_WRITTEN_V161_R010D_04', stage: 'internship_conversion_written', round: '实习转正笔试', scenarioBucket: 'metric_tradeoff', type: '安全与进度取舍', prompt: '【行业:汽车与智能驾驶｜岗位:功能安全工程师｜阶段:实习转正笔试】量产节点紧张时你如何守住安全底线？' }
    ],
    interviewAdds: [
      { id: 'IND_AUTO_INTELLIGENT_DRIVING_INTERVIEW_V161_R010D_01', stage: 'campus_early_batch_interview', round: '提前批面试', scenarioBucket: 'business_scenario', type: '安全风险升级沟通', prompt: '【行业:汽车与智能驾驶｜岗位:功能安全工程师｜阶段:提前批面试】你如何向管理层解释“延期优于带风险发布”？' },
      { id: 'IND_AUTO_INTELLIGENT_DRIVING_INTERVIEW_V161_R010D_02', stage: 'campus_main_batch_interview', round: '主批面试', scenarioBucket: 'cross_team_collaboration', type: '跨域安全协同', prompt: '【行业:汽车与智能驾驶｜岗位:功能安全工程师｜阶段:主批面试】软硬件团队对安全责任认定冲突时你如何推进？' },
      { id: 'IND_AUTO_INTELLIGENT_DRIVING_INTERVIEW_V161_R010D_03', stage: 'campus_supplement_interview', round: '补录面试', scenarioBucket: 'failure_review', type: '审计失败复盘', prompt: '【行业:汽车与智能驾驶｜岗位:功能安全工程师｜阶段:补录面试】讲一次你在审计中暴露问题后的整改过程。' },
      { id: 'IND_AUTO_INTELLIGENT_DRIVING_INTERVIEW_V161_R010D_04', stage: 'internship_conversion_interview', round: '实习转正面试', scenarioBucket: 'metric_tradeoff', type: '节点冲突决策', prompt: '【行业:汽车与智能驾驶｜岗位:功能安全工程师｜阶段:实习转正面试】质量、进度、安全三方冲突时你如何做优先级决策？' }
    ]
  },
  {
    file: 'data/entries/IND_BIOMED_DEVICE.json',
    roleId: 'IND_BIOMED_DEVICE_ROLE_010',
    roleName: '药物警戒专员',
    rolePatch: {
      role_readiness_floor: '至少完成1个PV项目：个例处理、信号检测、风险评估和报告闭环。',
      day_in_life: '药物警戒专员工作周：个例审核录入、信号筛查、风险会议准备、定期安全报告编制和时限跟踪。',
      growth_path_1to3_year: '0-1年掌握PV流程和法规时限；1-3年独立负责信号管理与报告；3-5年可主导风险管理计划和跨区域协同。',
      transfer_path_hint: '可转临床运营、注册事务、医学事务；需补临床试验与法规策略，过渡5-9个月。',
      prep_90d_plan: [
        '1-30天：梳理AE处理流程与法规时限要求。',
        '31-60天：完成1个信号检测到评估闭环案例。',
        '61-90天：完成10套药物警戒题训练，强化风险沟通与文档质量。'
      ],
      career_outlook_3to5_year: '药品安全监管持续强化，PV岗位需求稳定，能力重点转向信号分析与风险沟通效率。',
      typical_work_week: '时限驱动明显，安全事件高峰期任务密集。',
      switch_directions: [
        { target_role: '临床运营', switch_cost: '中', bridge_skills: ['试验流程', '数据管理'], transition_period: '5-8个月' },
        { target_role: '注册事务', switch_cost: '中', bridge_skills: ['法规写作', '申报逻辑'], transition_period: '5-8个月' },
        { target_role: '医学事务', switch_cost: '中', bridge_skills: ['证据沟通', '学术协同'], transition_period: '5-8个月' }
      ],
      prepare_180d_plan: [
        '91-120天：建立信号分级和升级流程模板。',
        '121-150天：主导1次PSUR资料准备专项。',
        '151-180天：沉淀个例质量审核清单与错误库。'
      ],
      role_scope_text: '负责药物安全信息收集评估与报告，对合规时效、数据准确性和风险识别质量负责。'
    },
    commonDeductionPoints: [
      '个例处理流程不完整，时限意识弱。',
      '信号判断缺乏证据支持。',
      '报告逻辑混乱，关键结论不清。',
      '跨部门风险沟通不到位。'
    ],
    starTemplate: {
      situation: '上市后出现疑似安全信号，监管关注度上升。',
      task: '在法规时限内完成评估并给出风险控制建议。',
      action: [
        '快速核查个例质量和完整性。',
        '执行信号检测并组织医学评估。',
        '形成报告并推动风险沟通措施落地。'
      ],
      result: [
        '按时完成评估与报告提交。',
        '风险沟通路径清晰并形成后续监测机制。'
      ],
      proof_materials: ['个例审核记录', '信号评估报告', '风险沟通纪要']
    },
    writtenAdds: [
      { id: 'IND_BIOMED_DEVICE_WRITTEN_V161_R010D_01', stage: 'campus_early_batch_written', round: '提前批笔试', scenarioBucket: 'business_scenario', type: '安全信号评估题', prompt: '【行业:生物医药与器械｜岗位:药物警戒专员｜阶段:提前批笔试】疑似安全信号出现后，你如何快速评估并给出处置建议？' },
      { id: 'IND_BIOMED_DEVICE_WRITTEN_V161_R010D_02', stage: 'campus_main_batch_written', round: '主批笔试', scenarioBucket: 'system_process', type: 'PV流程设计题', prompt: '【行业:生物医药与器械｜岗位:药物警戒专员｜阶段:主批笔试】请设计“个例处理-信号检测-报告提交”流程与控制点。' },
      { id: 'IND_BIOMED_DEVICE_WRITTEN_V161_R010D_03', stage: 'campus_supplement_written', round: '补录笔试', scenarioBucket: 'failure_review', type: '报告质量复盘', prompt: '【行业:生物医药与器械｜岗位:药物警戒专员｜阶段:补录笔试】一次报告被退回后你如何复盘并提升质量？' },
      { id: 'IND_BIOMED_DEVICE_WRITTEN_V161_R010D_04', stage: 'internship_conversion_written', round: '实习转正笔试', scenarioBucket: 'metric_tradeoff', type: '时效质量平衡', prompt: '【行业:生物医药与器械｜岗位:药物警戒专员｜阶段:实习转正笔试】在紧迫时限下如何兼顾提交速度和数据质量？' }
    ],
    interviewAdds: [
      { id: 'IND_BIOMED_DEVICE_INTERVIEW_V161_R010D_01', stage: 'campus_early_batch_interview', round: '提前批面试', scenarioBucket: 'business_scenario', type: '信号升级沟通题', prompt: '【行业:生物医药与器械｜岗位:药物警戒专员｜阶段:提前批面试】你如何向业务团队解释必须升级信号处理？' },
      { id: 'IND_BIOMED_DEVICE_INTERVIEW_V161_R010D_02', stage: 'campus_main_batch_interview', round: '主批面试', scenarioBucket: 'cross_team_collaboration', type: '医警协同题', prompt: '【行业:生物医药与器械｜岗位:药物警戒专员｜阶段:主批面试】医学与警戒团队对风险判断不一致时你如何协调？' },
      { id: 'IND_BIOMED_DEVICE_INTERVIEW_V161_R010D_03', stage: 'campus_supplement_interview', round: '补录面试', scenarioBucket: 'failure_review', type: '个例遗漏复盘题', prompt: '【行业:生物医药与器械｜岗位:药物警戒专员｜阶段:补录面试】讲一次你处理遗漏并修正流程的经历。' }
    ]
  },
  {
    file: 'data/entries/IND_ECOMMERCE_CROSSBORDER.json',
    roleId: 'IND_ECOMMERCE_CROSSBORDER_ROLE_010',
    roleName: '跨境广告投放策略',
    rolePatch: {
      role_readiness_floor: '至少完成1个跨境投放项目：渠道组合、预算分配、归因分析与ROI优化。',
      day_in_life: '跨境广告投放策略工作周：分渠道投放监控、素材与受众迭代、预算调度、归因复盘与风控校验。',
      growth_path_1to3_year: '0-1年掌握平台投放机制与核心指标；1-3年独立负责预算策略和增长闭环；3-5年可主导全球多市场投放策略。',
      transfer_path_hint: '可转增长运营、独立站运营、海外内容营销；需补用户增长模型和内容策略，过渡4-8个月。',
      prep_90d_plan: ['1-30天：梳理投放漏斗与核心指标（CPM/CVR/ROAS）。', '31-60天：完成1个预算重分配优化案例。', '61-90天：完成10套投放策略题训练，强化归因和风险控制。'],
      career_outlook_3to5_year: '跨境流量成本上升，投放岗位需求稳定，核心能力转向精细化归因和全链路效率优化。',
      typical_work_week: '日级别数据驱动，促销节点预算调整频繁。',
      switch_directions: [
        { target_role: '增长运营', switch_cost: '低中', bridge_skills: ['增长模型', '实验设计'], transition_period: '4-6个月' },
        { target_role: '独立站运营', switch_cost: '中', bridge_skills: ['站内转化', '漏斗优化'], transition_period: '5-8个月' },
        { target_role: '海外内容营销', switch_cost: '中', bridge_skills: ['内容策略', '创意迭代'], transition_period: '5-8个月' }
      ],
      prepare_180d_plan: ['91-120天：建立渠道级预算预警与止损机制。', '121-150天：主导1次多市场投放复盘专项。', '151-180天：沉淀投放策略库和素材测试框架。'],
      role_scope_text: '负责跨境广告投放策略与预算管理，对流量质量、转化效率和投放ROI负责。'
    },
    commonDeductionPoints: ['只看曝光点击，不看后链路转化。', '归因口径不统一导致策略偏差。', '预算调整缺乏实验验证。', '忽视合规与风控限制。'],
    starTemplate: {
      situation: '核心市场投放成本上升且ROAS下滑。',
      task: '在不降低规模目标的情况下恢复投放效率。',
      action: ['按渠道和受众重构预算分配。', '优化素材策略并做A/B验证。', '建立周级归因复盘与止损机制。'],
      result: ['ROAS回升并控制获客成本。', '形成可复用投放优化策略。'],
      proof_materials: ['投放看板', '实验报告', '预算调整记录']
    },
    writtenAdds: [
      { id: 'IND_ECOMMERCE_CROSSBORDER_WRITTEN_V161_R010D_01', stage: 'campus_early_batch_written', round: '提前批笔试', scenarioBucket: 'business_scenario', type: 'ROAS修复策略题', prompt: '【行业:电商与跨境电商｜岗位:跨境广告投放策略｜阶段:提前批笔试】核心市场ROAS持续下滑，你如何做预算与素材调整？' },
      { id: 'IND_ECOMMERCE_CROSSBORDER_WRITTEN_V161_R010D_02', stage: 'campus_main_batch_written', round: '主批笔试', scenarioBucket: 'system_process', type: '投放运营体系设计', prompt: '【行业:电商与跨境电商｜岗位:跨境广告投放策略｜阶段:主批笔试】请设计“投放-归因-复盘-迭代”策略体系。' },
      { id: 'IND_ECOMMERCE_CROSSBORDER_WRITTEN_V161_R010D_03', stage: 'campus_supplement_written', round: '补录笔试', scenarioBucket: 'failure_review', type: '投放失效复盘', prompt: '【行业:电商与跨境电商｜岗位:跨境广告投放策略｜阶段:补录笔试】一次大预算投放未达标，如何复盘并止损？' },
      { id: 'IND_ECOMMERCE_CROSSBORDER_WRITTEN_V161_R010D_04', stage: 'internship_conversion_written', round: '实习转正笔试', scenarioBucket: 'metric_tradeoff', type: '规模效率平衡', prompt: '【行业:电商与跨境电商｜岗位:跨境广告投放策略｜阶段:实习转正笔试】规模目标和效率指标冲突时你如何取舍？' }
    ],
    interviewAdds: [
      { id: 'IND_ECOMMERCE_CROSSBORDER_INTERVIEW_V161_R010D_01', stage: 'campus_early_batch_interview', round: '提前批面试', scenarioBucket: 'business_scenario', type: '预算紧急调整', prompt: '【行业:电商与跨境电商｜岗位:跨境广告投放策略｜阶段:提前批面试】预算被临时砍掉30%，你如何重排投放优先级？' },
      { id: 'IND_ECOMMERCE_CROSSBORDER_INTERVIEW_V161_R010D_02', stage: 'campus_main_batch_interview', round: '主批面试', scenarioBucket: 'cross_team_collaboration', type: '创意策略协同', prompt: '【行业:电商与跨境电商｜岗位:跨境广告投放策略｜阶段:主批面试】投放和内容团队观点冲突时你如何推进？' },
      { id: 'IND_ECOMMERCE_CROSSBORDER_INTERVIEW_V161_R010D_03', stage: 'campus_supplement_interview', round: '补录面试', scenarioBucket: 'failure_review', type: '归因误判复盘', prompt: '【行业:电商与跨境电商｜岗位:跨境广告投放策略｜阶段:补录面试】讲一次归因判断失误并修正的经历。' },
      { id: 'IND_ECOMMERCE_CROSSBORDER_INTERVIEW_V161_R010D_04', stage: 'internship_conversion_interview', round: '实习转正面试', scenarioBucket: 'metric_tradeoff', type: '指标冲突沟通', prompt: '【行业:电商与跨境电商｜岗位:跨境广告投放策略｜阶段:实习转正面试】上级要求冲量，你如何解释效率底线？' }
    ]
  },
  {
    file: 'data/entries/IND_ENERGY_UTILITIES.json',
    roleId: 'IND_ENERGY_UTILITIES_ROLE_010',
    roleName: '碳管理专员',
    rolePatch: {
      role_readiness_floor: '至少完成1个碳管理项目：碳盘查、减排方案、核证流程与数据审计。',
      day_in_life: '碳管理专员工作周：排放数据汇总核验、核算口径校准、减排项目跟踪、碳资产台账更新和政策解读。',
      growth_path_1to3_year: '0-1年掌握碳核算标准与数据采集；1-3年独立负责盘查与减排方案；3-5年可主导碳资产策略与合规管理。',
      transfer_path_hint: '可转碳资产管理岗、计量与能效岗、新能源项目开发；需补交易机制与项目财务，过渡5-9个月。',
      prep_90d_plan: ['1-30天：梳理碳核算边界和数据来源。', '31-60天：完成1个减排项目核算与复盘。', '61-90天：完成10套碳管理题训练，强化政策与业务协同。'],
      career_outlook_3to5_year: '双碳政策持续推进，碳管理岗位需求上升，能力重心向数据治理与资产运营升级。',
      typical_work_week: '政策和合规节点驱动明显，季度和年度披露窗口任务集中。',
      switch_directions: [
        { target_role: '碳资产管理岗', switch_cost: '低中', bridge_skills: ['碳交易规则', '资产运营'], transition_period: '4-6个月' },
        { target_role: '计量与能效岗', switch_cost: '中', bridge_skills: ['能效分析', '计量体系'], transition_period: '5-8个月' },
        { target_role: '新能源项目开发', switch_cost: '中高', bridge_skills: ['项目收益测算', '政策评估'], transition_period: '6-9个月' }
      ],
      prepare_180d_plan: ['91-120天：建立排放数据质量检查和抽样复核机制。', '121-150天：主导1次减排项目绩效复盘。', '151-180天：沉淀碳盘查标准作业手册。'],
      role_scope_text: '负责碳排放核算与减排项目管理，对数据准确性、合规披露和减排目标达成负责。'
    },
    commonDeductionPoints: ['核算边界定义不清。', '数据来源不可追溯。', '减排方案缺乏落地路径。', '对政策变化反应滞后。'],
    starTemplate: {
      situation: '年度碳盘查发现关键业务单元数据波动异常。',
      task: '在披露节点前完成核验并提出减排改进方案。',
      action: ['追溯数据链路并校准核算边界。', '组织业务部门核对并修正口径。', '提出分阶段减排与监控措施。'],
      result: ['披露数据准确通过复核。', '形成可执行减排计划并落地跟踪。'],
      proof_materials: ['碳盘查表', '核验记录', '减排项目计划']
    },
    writtenAdds: [
      { id: 'IND_ENERGY_UTILITIES_WRITTEN_V161_R010D_01', stage: 'campus_early_batch_written', round: '提前批笔试', scenarioBucket: 'business_scenario', type: '碳盘查异常处置题', prompt: '【行业:能源与公用事业｜岗位:碳管理专员｜阶段:提前批笔试】盘查数据异常时你如何快速核验并修正？' },
      { id: 'IND_ENERGY_UTILITIES_WRITTEN_V161_R010D_02', stage: 'campus_main_batch_written', round: '主批笔试', scenarioBucket: 'system_process', type: '碳管理体系设计', prompt: '【行业:能源与公用事业｜岗位:碳管理专员｜阶段:主批笔试】请设计“盘查-核验-减排-披露”管理体系。' },
      { id: 'IND_ENERGY_UTILITIES_WRITTEN_V161_R010D_03', stage: 'campus_supplement_written', round: '补录笔试', scenarioBucket: 'failure_review', type: '减排项目失效复盘', prompt: '【行业:能源与公用事业｜岗位:碳管理专员｜阶段:补录笔试】减排项目未达预期，如何复盘并调整？' },
      { id: 'IND_ENERGY_UTILITIES_WRITTEN_V161_R010D_04', stage: 'internship_conversion_written', round: '实习转正笔试', scenarioBucket: 'metric_tradeoff', type: '成本减排平衡题', prompt: '【行业:能源与公用事业｜岗位:碳管理专员｜阶段:实习转正笔试】成本约束下如何实现减排目标？' }
    ],
    interviewAdds: [
      { id: 'IND_ENERGY_UTILITIES_INTERVIEW_V161_R010D_01', stage: 'campus_early_batch_interview', round: '提前批面试', scenarioBucket: 'business_scenario', type: '核验争议沟通', prompt: '【行业:能源与公用事业｜岗位:碳管理专员｜阶段:提前批面试】业务部门质疑核算结果时你如何沟通？' },
      { id: 'IND_ENERGY_UTILITIES_INTERVIEW_V161_R010D_02', stage: 'campus_main_batch_interview', round: '主批面试', scenarioBucket: 'cross_team_collaboration', type: '跨部门减排推进', prompt: '【行业:能源与公用事业｜岗位:碳管理专员｜阶段:主批面试】多部门对减排优先级意见不一致时如何推进？' },
      { id: 'IND_ENERGY_UTILITIES_INTERVIEW_V161_R010D_03', stage: 'campus_supplement_interview', round: '补录面试', scenarioBucket: 'failure_review', type: '披露失误复盘', prompt: '【行业:能源与公用事业｜岗位:碳管理专员｜阶段:补录面试】讲一次披露准备失误后的整改过程。' },
      { id: 'IND_ENERGY_UTILITIES_INTERVIEW_V161_R010D_04', stage: 'internship_conversion_interview', round: '实习转正面试', scenarioBucket: 'metric_tradeoff', type: '目标冲突沟通题', prompt: '【行业:能源与公用事业｜岗位:碳管理专员｜阶段:实习转正面试】减排目标与经营目标冲突时你如何给建议？' }
    ]
  },
  {
    file: 'data/entries/IND_FIN_BANK.json',
    roleId: 'IND_FIN_BANK_ROLE_010',
    roleName: '反洗钱分析师',
    rolePatch: {
      role_readiness_floor: '至少完成1个反洗钱监测项目：规则优化、可疑交易识别、调查闭环和监管报送。',
      day_in_life: '反洗钱分析师工作周：规则命中复核、可疑交易排查、案例归档、模型调优和合规沟通。',
      growth_path_1to3_year: '0-1年掌握AML法规和案例流程；1-3年独立负责监测规则和调查；3-5年可主导策略体系和跨机构协同。',
      transfer_path_hint: '可转风险策略分析师、合规管理、反欺诈分析师；需补策略建模和跨系统数据分析，过渡5-9个月。',
      prep_90d_plan: ['1-30天：梳理可疑交易识别规则和调查流程。', '31-60天：完成1个规则优化案例并评估误报率。', '61-90天：完成10套AML题训练，强化证据链与报告表达。'],
      career_outlook_3to5_year: '监管持续收紧，反洗钱岗位需求稳定增长，能力核心是规则策略与调查效率并重。',
      typical_work_week: '事件驱动明显，监管检查窗口和批量核查期工作强度上升。',
      switch_directions: [
        { target_role: '风险策略分析师', switch_cost: '中', bridge_skills: ['规则策略', '模型评估'], transition_period: '5-8个月' },
        { target_role: '合规管理', switch_cost: '低中', bridge_skills: ['监管沟通', '制度建设'], transition_period: '4-6个月' },
        { target_role: '反欺诈分析师', switch_cost: '中', bridge_skills: ['行为分析', '特征工程'], transition_period: '5-8个月' }
      ],
      prepare_180d_plan: ['91-120天：建立可疑交易分级和升级处理模板。', '121-150天：主导1次规则误报率优化专项。', '151-180天：沉淀案例库与调查问询模板。'],
      role_scope_text: '负责反洗钱监测与调查分析，对可疑交易识别准确性、调查时效和合规报送质量负责。'
    },
    commonDeductionPoints: ['规则命中后只做机械处理。', '调查证据链不完整。', '误报与漏报平衡思路不清。', '报送逻辑和结论不一致。'],
    starTemplate: {
      situation: '监测系统出现批量异常交易命中，疑似洗钱风险上升。',
      task: '快速完成分层调查并确保报送质量与时效。',
      action: ['按风险等级筛选并优先处理高风险样本。', '补充交易链路证据并交叉核验。', '优化规则并复盘误报漏报情况。'],
      result: ['高风险交易及时处置并完成规范报送。', '规则质量提升，误报率下降。'],
      proof_materials: ['调查记录', '规则调整单', '报送文档']
    },
    writtenAdds: [
      { id: 'IND_FIN_BANK_WRITTEN_V161_R010D_01', stage: 'campus_early_batch_written', round: '提前批笔试', scenarioBucket: 'business_scenario', type: '可疑交易处置题', prompt: '【行业:金融-银行｜岗位:反洗钱分析师｜阶段:提前批笔试】批量可疑交易命中后，你如何分层排查与处置？' },
      { id: 'IND_FIN_BANK_WRITTEN_V161_R010D_02', stage: 'campus_main_batch_written', round: '主批笔试', scenarioBucket: 'system_process', type: 'AML流程设计题', prompt: '【行业:金融-银行｜岗位:反洗钱分析师｜阶段:主批笔试】请设计“监测-调查-报送-复盘”流程和控制点。' },
      { id: 'IND_FIN_BANK_WRITTEN_V161_R010D_03', stage: 'campus_supplement_written', round: '补录笔试', scenarioBucket: 'failure_review', type: '漏报复盘题', prompt: '【行业:金融-银行｜岗位:反洗钱分析师｜阶段:补录笔试】发生漏报后你如何复盘规则与流程失效点？' },
      { id: 'IND_FIN_BANK_WRITTEN_V161_R010D_04', stage: 'internship_conversion_written', round: '实习转正笔试', scenarioBucket: 'metric_tradeoff', type: '误报漏报平衡题', prompt: '【行业:金融-银行｜岗位:反洗钱分析师｜阶段:实习转正笔试】在误报率和漏报风险之间如何设置阈值？' }
    ],
    interviewAdds: [
      { id: 'IND_FIN_BANK_INTERVIEW_V161_R010D_01', stage: 'campus_early_batch_interview', round: '提前批面试', scenarioBucket: 'business_scenario', type: '高风险案件沟通', prompt: '【行业:金融-银行｜岗位:反洗钱分析师｜阶段:提前批面试】你如何向业务条线说明必须采取限制措施？' },
      { id: 'IND_FIN_BANK_INTERVIEW_V161_R010D_02', stage: 'campus_main_batch_interview', round: '主批面试', scenarioBucket: 'cross_team_collaboration', type: '跨团队调查协同', prompt: '【行业:金融-银行｜岗位:反洗钱分析师｜阶段:主批面试】前台不配合调查时你如何推进？' },
      { id: 'IND_FIN_BANK_INTERVIEW_V161_R010D_03', stage: 'campus_supplement_interview', round: '补录面试', scenarioBucket: 'failure_review', type: '判断失误复盘', prompt: '【行业:金融-银行｜岗位:反洗钱分析师｜阶段:补录面试】讲一次你误判风险等级后的修正过程。' },
      { id: 'IND_FIN_BANK_INTERVIEW_V161_R010D_04', stage: 'internship_conversion_interview', round: '实习转正面试', scenarioBucket: 'metric_tradeoff', type: '策略权衡题', prompt: '【行业:金融-银行｜岗位:反洗钱分析师｜阶段:实习转正面试】管理层要求提高效率时如何守住监管底线？' }
    ]
  },
  {
    file: 'data/entries/IND_FIN_SECURITIES_FUND.json',
    roleId: 'IND_FIN_SECURITIES_FUND_ROLE_010',
    roleName: '合规监察专员',
    rolePatch: {
      role_readiness_floor: '至少完成1个合规监察项目：检查计划、问题识别、整改跟踪和复核关闭。',
      day_in_life: '合规监察专员工作周：制度核查、样本抽检、问题分级、整改追踪、复核报告输出。',
      growth_path_1to3_year: '0-1年掌握监管规则和检查方法；1-3年独立负责专项监察；3-5年可主导合规体系建设与培训。',
      transfer_path_hint: '可转风险管理岗、基金运营专员、投后管理岗；需补风险量化与业务理解，过渡5-8个月。',
      prep_90d_plan: ['1-30天：梳理重点监管条线与检查清单。', '31-60天：完成1个整改跟踪闭环案例。', '61-90天：完成10套合规监察题训练，强化证据链和结论表达。'],
      career_outlook_3to5_year: '资管监管细化背景下，合规监察岗位需求稳定，能力重点是“检查效率+整改落地”。',
      typical_work_week: '检查和整改双线推进，监管窗口期任务集中。',
      switch_directions: [
        { target_role: '风险管理岗', switch_cost: '中', bridge_skills: ['风险指标', '预警机制'], transition_period: '5-8个月' },
        { target_role: '基金运营专员', switch_cost: '低中', bridge_skills: ['流程控制', '运营复核'], transition_period: '4-6个月' },
        { target_role: '投后管理岗', switch_cost: '中', bridge_skills: ['项目评估', '持续监控'], transition_period: '5-8个月' }
      ],
      prepare_180d_plan: ['91-120天：建立问题分级与整改时限看板。', '121-150天：主导1次重点条线合规专项。', '151-180天：沉淀监察抽样方法与复核模板。'],
      role_scope_text: '负责合规检查与整改闭环管理，对问题识别准确性、整改时效和复核质量负责。'
    },
    commonDeductionPoints: ['只列问题不提整改路径。', '整改跟踪无证据留痕。', '检查样本选择缺乏逻辑。', '风险评级与事实不匹配。'],
    starTemplate: {
      situation: '专项检查发现多项高风险问题，整改进度滞后。',
      task: '推动关键问题按期整改并完成复核关闭。',
      action: ['按风险分级制定整改路线和责任人。', '建立周跟踪机制并及时升级卡点。', '执行复核并更新制度控制点。'],
      result: ['高风险项按期关闭并完成复核。', '形成可复用整改闭环机制。'],
      proof_materials: ['检查记录', '整改跟踪表', '复核报告']
    },
    writtenAdds: [
      { id: 'IND_FIN_SECURITIES_FUND_WRITTEN_V161_R010D_01', stage: 'campus_early_batch_written', round: '提前批笔试', scenarioBucket: 'business_scenario', type: '整改推进题', prompt: '【行业:金融-证券基金｜岗位:合规监察专员｜阶段:提前批笔试】发现高风险问题后，如何推进整改并防复发？' },
      { id: 'IND_FIN_SECURITIES_FUND_WRITTEN_V161_R010D_02', stage: 'campus_main_batch_written', round: '主批笔试', scenarioBucket: 'system_process', type: '监察流程设计题', prompt: '【行业:金融-证券基金｜岗位:合规监察专员｜阶段:主批笔试】请设计“检查-分级-整改-复核”监察流程。' },
      { id: 'IND_FIN_SECURITIES_FUND_WRITTEN_V161_R010D_03', stage: 'campus_supplement_written', round: '补录笔试', scenarioBucket: 'failure_review', type: '整改失效复盘', prompt: '【行业:金融-证券基金｜岗位:合规监察专员｜阶段:补录笔试】整改完成后问题复发，你如何复盘机制缺陷？' },
      { id: 'IND_FIN_SECURITIES_FUND_WRITTEN_V161_R010D_04', stage: 'internship_conversion_written', round: '实习转正笔试', scenarioBucket: 'metric_tradeoff', type: '效率严谨平衡', prompt: '【行业:金融-证券基金｜岗位:合规监察专员｜阶段:实习转正笔试】检查效率和审查严谨性冲突时你如何取舍？' }
    ],
    interviewAdds: [
      { id: 'IND_FIN_SECURITIES_FUND_INTERVIEW_V161_R010D_01', stage: 'campus_early_batch_interview', round: '提前批面试', scenarioBucket: 'business_scenario', type: '问题升级沟通', prompt: '【行业:金融-证券基金｜岗位:合规监察专员｜阶段:提前批面试】业务部门不认可问题等级时你如何沟通？' },
      { id: 'IND_FIN_SECURITIES_FUND_INTERVIEW_V161_R010D_02', stage: 'campus_main_batch_interview', round: '主批面试', scenarioBucket: 'cross_team_collaboration', type: '整改协同推进', prompt: '【行业:金融-证券基金｜岗位:合规监察专员｜阶段:主批面试】多团队整改进度不一致时你如何推进？' },
      { id: 'IND_FIN_SECURITIES_FUND_INTERVIEW_V161_R010D_03', stage: 'campus_supplement_interview', round: '补录面试', scenarioBucket: 'failure_review', type: '检查误判复盘', prompt: '【行业:金融-证券基金｜岗位:合规监察专员｜阶段:补录面试】讲一次你检查结论被推翻的经历。' },
      { id: 'IND_FIN_SECURITIES_FUND_INTERVIEW_V161_R010D_04', stage: 'internship_conversion_interview', round: '实习转正面试', scenarioBucket: 'metric_tradeoff', type: '优先级取舍题', prompt: '【行业:金融-证券基金｜岗位:合规监察专员｜阶段:实习转正面试】监管临检和内部专项冲突时你如何排序？' }
    ]
  },
  {
    file: 'data/entries/IND_NEW_ENERGY.json',
    roleId: 'IND_NEW_ENERGY_ROLE_010',
    roleName: '能源交易分析师',
    rolePatch: {
      role_readiness_floor: '至少完成1个能源交易分析项目：价格预测、策略建议、风险暴露评估和复盘。',
      day_in_life: '能源交易分析师工作周：行情监测、负荷预测、策略回测、风险敞口评估、交易复盘。',
      growth_path_1to3_year: '0-1年掌握市场规则和数据口径；1-3年独立负责策略分析与建议；3-5年可主导组合策略与风险框架。',
      transfer_path_hint: '可转电力现货交易工程师、电力交易策略分析师、储能运营工程师；需补实时交易执行与调度协同，过渡5-9个月。',
      prep_90d_plan: ['1-30天：梳理电力交易规则、价格驱动因素和风险指标。', '31-60天：完成1个策略回测与实盘偏差复盘。', '61-90天：完成10套交易分析题训练，强化策略解释与止损机制。'],
      career_outlook_3to5_year: '新能源占比提升推动市场化交易深化，交易分析岗位需求快速上升。',
      typical_work_week: '行情波动驱动明显，交易窗口和月结算阶段强度高。',
      switch_directions: [
        { target_role: '电力现货交易工程师', switch_cost: '中', bridge_skills: ['实时交易', '执行纪律'], transition_period: '5-8个月' },
        { target_role: '电力交易策略分析师', switch_cost: '低中', bridge_skills: ['策略建模', '风险归因'], transition_period: '4-6个月' },
        { target_role: '储能运营工程师', switch_cost: '中', bridge_skills: ['调度优化', '收益评估'], transition_period: '5-8个月' }
      ],
      prepare_180d_plan: ['91-120天：建立策略表现与风险暴露双维看板。', '121-150天：主导1次策略失效复盘专项。', '151-180天：沉淀交易分析报告模板和风控阈值库。'],
      role_scope_text: '负责能源市场交易分析与策略建议，对收益稳定性、风险暴露和复盘质量负责。'
    },
    commonDeductionPoints: ['只做行情描述，不给策略建议。', '策略回测缺少边界条件。', '忽略风险暴露和止损机制。', '复盘没有形成可执行改进。'],
    starTemplate: {
      situation: '市场价格大幅波动导致既有策略收益下滑。',
      task: '快速评估策略失效原因并给出调整建议。',
      action: ['拆解价格驱动并复测策略敏感性。', '调整参数并设置风险阈值。', '与交易执行团队对齐落地节奏。'],
      result: ['策略收益波动收敛并控制回撤。', '形成新的风险监控规则。'],
      proof_materials: ['策略回测报告', '风险看板', '执行复盘记录']
    },
    writtenAdds: [
      { id: 'IND_NEW_ENERGY_WRITTEN_V161_R010D_01', stage: 'campus_early_batch_written', round: '提前批笔试', scenarioBucket: 'business_scenario', type: '策略失效处置题', prompt: '【行业:新能源｜岗位:能源交易分析师｜阶段:提前批笔试】策略收益持续下滑时你如何快速调整？' },
      { id: 'IND_NEW_ENERGY_WRITTEN_V161_R010D_02', stage: 'campus_main_batch_written', round: '主批笔试', scenarioBucket: 'system_process', type: '交易分析体系设计', prompt: '【行业:新能源｜岗位:能源交易分析师｜阶段:主批笔试】请设计“预测-策略-执行-复盘”分析体系。' },
      { id: 'IND_NEW_ENERGY_WRITTEN_V161_R010D_03', stage: 'campus_supplement_written', round: '补录笔试', scenarioBucket: 'failure_review', type: '回测偏差复盘', prompt: '【行业:新能源｜岗位:能源交易分析师｜阶段:补录笔试】实盘与回测偏差过大时你如何复盘？' },
      { id: 'IND_NEW_ENERGY_WRITTEN_V161_R010D_04', stage: 'internship_conversion_written', round: '实习转正笔试', scenarioBucket: 'metric_tradeoff', type: '收益回撤平衡', prompt: '【行业:新能源｜岗位:能源交易分析师｜阶段:实习转正笔试】收益目标与最大回撤约束冲突时如何决策？' }
    ],
    interviewAdds: [
      { id: 'IND_NEW_ENERGY_INTERVIEW_V161_R010D_01', stage: 'campus_early_batch_interview', round: '提前批面试', scenarioBucket: 'business_scenario', type: '行情突变应对', prompt: '【行业:新能源｜岗位:能源交易分析师｜阶段:提前批面试】价格突变时你如何调整策略并解释依据？' },
      { id: 'IND_NEW_ENERGY_INTERVIEW_V161_R010D_02', stage: 'campus_main_batch_interview', round: '主批面试', scenarioBucket: 'cross_team_collaboration', type: '策略执行协同', prompt: '【行业:新能源｜岗位:能源交易分析师｜阶段:主批面试】分析建议与交易执行冲突时你如何推进？' },
      { id: 'IND_NEW_ENERGY_INTERVIEW_V161_R010D_03', stage: 'campus_supplement_interview', round: '补录面试', scenarioBucket: 'failure_review', type: '判断失误复盘', prompt: '【行业:新能源｜岗位:能源交易分析师｜阶段:补录面试】讲一次你策略判断失误后的修正过程。' },
      { id: 'IND_NEW_ENERGY_INTERVIEW_V161_R010D_04', stage: 'internship_conversion_interview', round: '实习转正面试', scenarioBucket: 'metric_tradeoff', type: '风险收益沟通', prompt: '【行业:新能源｜岗位:能源交易分析师｜阶段:实习转正面试】管理层追求收益最大化时你如何坚持风险底线？' }
    ]
  },
  {
    file: 'data/entries/IND_PUBLIC_INSTITUTION.json',
    roleId: 'IND_PUBLIC_INSTITUTION_ROLE_010',
    roleName: '公共服务数字化岗',
    rolePatch: {
      role_readiness_floor: '至少完成1个公共服务数字化项目：流程梳理、系统上线、数据治理和服务改进。',
      day_in_life: '公共服务数字化岗工作周：需求调研、流程建模、系统联调、数据质量核查、服务指标复盘。',
      growth_path_1to3_year: '0-1年掌握业务流程与系统运维；1-3年独立负责数字化项目模块；3-5年可主导跨部门流程重塑和数据治理体系。',
      transfer_path_hint: '可转信息化岗、项目管理岗、高校教务管理专员；需补项目治理和数据分析，过渡4-8个月。',
      prep_90d_plan: ['1-30天：梳理目标服务流程和关键痛点。', '31-60天：完成1个流程数字化改造案例并量化效果。', '61-90天：完成10套数字化岗题训练，强化需求拆解与上线复盘。'],
      career_outlook_3to5_year: '公共服务数字化持续深化，岗位需求稳定增长，能力重点从系统执行转向流程和数据驱动治理。',
      typical_work_week: '项目节点和服务高峰并行，跨部门协调占比高。',
      switch_directions: [
        { target_role: '信息化岗', switch_cost: '低中', bridge_skills: ['系统运维', '需求管理'], transition_period: '4-6个月' },
        { target_role: '项目管理岗', switch_cost: '中', bridge_skills: ['计划管理', '风险控制'], transition_period: '5-8个月' },
        { target_role: '高校教务管理专员', switch_cost: '中', bridge_skills: ['流程治理', '服务运营'], transition_period: '5-8个月' }
      ],
      prepare_180d_plan: ['91-120天：建立服务流程数字化看板和异常预警。', '121-150天：主导1次跨部门流程优化专项。', '151-180天：沉淀需求评审和上线验收模板。'],
      role_scope_text: '负责公共服务流程数字化改造与运营优化，对流程时效、数据质量和服务体验负责。'
    },
    commonDeductionPoints: ['只关注系统功能，不关注业务流程。', '需求优先级和收益评估缺失。', '上线后缺少效果跟踪。', '跨部门协同路径不清。'],
    starTemplate: {
      situation: '群众服务流程多次往返，办理时效和满意度偏低。',
      task: '推动流程数字化改造并提升服务效率。',
      action: ['梳理流程瓶颈并设计线上化方案。', '协调多部门完成规则和系统联动。', '上线后监测指标并持续迭代。'],
      result: ['办理时长下降，满意度提升。', '形成可复制的数字化改造方法。'],
      proof_materials: ['流程图', '上线验收记录', '服务指标报表']
    },
    writtenAdds: [
      { id: 'IND_PUBLIC_INSTITUTION_WRITTEN_V161_R010D_01', stage: 'campus_early_batch_written', round: '提前批笔试', scenarioBucket: 'business_scenario', type: '流程数字化改造题', prompt: '【行业:事业单位体系｜岗位:公共服务数字化岗｜阶段:提前批笔试】线下流程效率低下，你如何设计数字化改造方案？' },
      { id: 'IND_PUBLIC_INSTITUTION_WRITTEN_V161_R010D_02', stage: 'campus_main_batch_written', round: '主批笔试', scenarioBucket: 'system_process', type: '项目实施流程题', prompt: '【行业:事业单位体系｜岗位:公共服务数字化岗｜阶段:主批笔试】请设计“需求-开发-上线-评估”项目流程。' },
      { id: 'IND_PUBLIC_INSTITUTION_WRITTEN_V161_R010D_03', stage: 'campus_supplement_written', round: '补录笔试', scenarioBucket: 'failure_review', type: '上线效果不佳复盘', prompt: '【行业:事业单位体系｜岗位:公共服务数字化岗｜阶段:补录笔试】系统上线后使用率低，你如何复盘并优化？' },
      { id: 'IND_PUBLIC_INSTITUTION_WRITTEN_V161_R010D_04', stage: 'internship_conversion_written', round: '实习转正笔试', scenarioBucket: 'metric_tradeoff', type: '效率公平平衡', prompt: '【行业:事业单位体系｜岗位:公共服务数字化岗｜阶段:实习转正笔试】效率提升和流程公平性冲突时你如何处理？' }
    ],
    interviewAdds: [
      { id: 'IND_PUBLIC_INSTITUTION_INTERVIEW_V161_R010D_01', stage: 'campus_early_batch_interview', round: '提前批面试', scenarioBucket: 'business_scenario', type: '需求冲突处理', prompt: '【行业:事业单位体系｜岗位:公共服务数字化岗｜阶段:提前批面试】多个窗口部门需求冲突时你如何定优先级？' },
      { id: 'IND_PUBLIC_INSTITUTION_INTERVIEW_V161_R010D_02', stage: 'campus_main_batch_interview', round: '主批面试', scenarioBucket: 'cross_team_collaboration', type: '跨部门推进题', prompt: '【行业:事业单位体系｜岗位:公共服务数字化岗｜阶段:主批面试】部门间流程口径不一致时你如何推进统一？' },
      { id: 'IND_PUBLIC_INSTITUTION_INTERVIEW_V161_R010D_03', stage: 'campus_supplement_interview', round: '补录面试', scenarioBucket: 'failure_review', type: '项目失效复盘', prompt: '【行业:事业单位体系｜岗位:公共服务数字化岗｜阶段:补录面试】讲一次数字化项目未达预期后的改进过程。' },
      { id: 'IND_PUBLIC_INSTITUTION_INTERVIEW_V161_R010D_04', stage: 'internship_conversion_interview', round: '实习转正面试', scenarioBucket: 'metric_tradeoff', type: '目标冲突沟通题', prompt: '【行业:事业单位体系｜岗位:公共服务数字化岗｜阶段:实习转正面试】上级要求快速上线，你如何守住质量与可用性？' }
    ]
  }
];

const defaultAnswerFramework = ['目标与约束澄清', '执行路径拆解', '指标与风险控制', '复盘与机制沉淀'];
const defaultScoringDimensions = ['结构化思维', '可执行性', '风险意识', '复盘能力'];
const defaultCommonMistakes = ['描述泛化', '缺少量化指标', '无风险预案'];
const defaultGoodSignals = ['结论先行', '路径清晰', '指标闭环'];
const defaultReference = ['先明确目标与边界', '再拆解动作', '最后给出结果与复盘'];

function buildQuestion(base, def, roleId, roleName) {
  return {
    ...base,
    question_id: def.id,
    prompt: def.prompt,
    question_type: def.type,
    recruitment_stage: def.stage,
    round_label: def.round,
    role_id: roleId,
    role_name: roleName,
    question_year: 2026,
    updated_at: TODAY,
    difficulty_1to5: 4,
    scenario_bucket: def.scenarioBucket,
    answer_framework: defaultAnswerFramework,
    scoring_dimensions: defaultScoringDimensions,
    common_mistakes: defaultCommonMistakes,
    good_answer_signals: defaultGoodSignals,
    reference_answer_outline: defaultReference,
    follow_up_questions: [
      '资源受限时你先保哪一步？',
      '首轮结果不佳如何纠偏？',
      '如何沉淀成可复用机制？'
    ],
    follow_up_chain: ['边界澄清', '关键取舍', '复盘迁移'],
    scoring_rubric: {
      A档: '路径完整、指标清晰、风险闭环。',
      B档: '方案可执行但缺少量化或风险细节。',
      C档: '泛化表达，缺少行动与结果。'
    },
    question_realness_note: '基于岗位能力口径与2026场景化补充（非官方原卷）。',
    data_origin: 'official_jd_competency_mapping_with_manual_role_enrichment_v161_batch4',
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

  const role = roles.find((r) => r.role_id === u.roleId);
  if (!role) throw new Error(`Role not found: ${u.roleId}`);

  Object.assign(role, u.rolePatch);
  role.common_deduction_points = u.commonDeductionPoints;
  role.star_evidence_template = u.starTemplate;
  role.updated_at = TODAY;
  role.role_detail_v158 = role.role_detail_v158 || {};
  role.role_detail_v158.role_scope = u.rolePatch.role_scope_text;
  role.role_detail_v158.expansion_status = 'landed_deep_profile_v161_batch4';

  const writtenBase = writtenItems.find((q) => q.role_id === u.roleId);
  const interviewBase = interviewItems.find((q) => q.role_id === u.roleId);
  if (!writtenBase || !interviewBase) throw new Error(`Question base missing: ${u.roleId}`);

  for (const def of u.writtenAdds) {
    if (writtenItems.some((q) => q.question_id === def.id)) throw new Error(`Duplicate question id: ${def.id}`);
    writtenItems.push(buildQuestion(writtenBase, def, u.roleId, u.roleName));
  }
  for (const def of u.interviewAdds) {
    if (interviewItems.some((q) => q.question_id === def.id)) throw new Error(`Duplicate question id: ${def.id}`);
    interviewItems.push(buildQuestion(interviewBase, def, u.roleId, u.roleName));
  }

  const writtenForRole = writtenItems.filter((q) => q.role_id === u.roleId);
  const interviewForRole = interviewItems.filter((q) => q.role_id === u.roleId);
  role.role_detail_v158.role_specific_question_coverage = {
    written_count: writtenForRole.length,
    interview_count: interviewForRole.length,
    written_stages: [...new Set(writtenForRole.map((q) => q.recruitment_stage).filter(Boolean))],
    interview_stages: [...new Set(interviewForRole.map((q) => q.recruitment_stage).filter(Boolean))]
  };

  fs.writeFileSync(fullPath, JSON.stringify(entry, null, 2) + '\n', 'utf8');
  console.log(`Updated ${u.file} / ${u.roleId}`);
}
