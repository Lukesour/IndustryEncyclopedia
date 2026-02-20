#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TODAY = '2026-02-20';

const updates = [
  {
    file: 'data/entries/IND_AUTO_INTELLIGENT_DRIVING.json',
    roleId: 'IND_AUTO_INTELLIGENT_DRIVING_ROLE_012',
    roleName: '车载软件测试工程师',
    rolePatch: {
      role_readiness_floor: '至少完成1个车载软件测试闭环：需求分析、测试设计、缺陷跟踪与回归验证。',
      day_in_life: '车载软件测试工程师工作周：解析需求与接口、编写测试用例、执行功能和稳定性测试、跟踪缺陷关闭并输出质量报告。',
      growth_path_1to3_year: '0-1年掌握车载测试流程和工具；1-3年独立负责模块测试与质量门禁；3-5年可主导整车级测试策略。',
      transfer_path_hint: '可转自动化测试开发、质量工程师、系统验证工程师；需补自动化框架与系统工程，过渡5-9个月。',
      prep_90d_plan: [
        '1-30天：梳理车载软件测试类型和关键质量指标。',
        '31-60天：完成1个关键缺陷定位与回归闭环案例。',
        '61-90天：完成10套车载测试题训练，强化边界场景和缺陷复盘表达。'
      ],
      career_outlook_3to5_year: '智能座舱和域控制复杂度提升，车载测试岗位需求持续增长，能力重点转向自动化和全链路质量治理。',
      typical_work_week: '版本迭代节奏快，提测高峰和发布窗口期测试压力显著增加。',
      switch_directions: [
        { target_role: '自动化测试开发', switch_cost: '中', bridge_skills: ['自动化框架', '脚本开发'], transition_period: '5-8个月' },
        { target_role: '质量工程师', switch_cost: '低中', bridge_skills: ['质量体系', '过程改进'], transition_period: '4-6个月' },
        { target_role: '系统验证工程师', switch_cost: '中', bridge_skills: ['系统建模', '验证策略'], transition_period: '6-9个月' }
      ],
      prepare_180d_plan: [
        '91-120天：建立高风险用例分层回归机制。',
        '121-150天：主导1次版本质量专项复盘。',
        '151-180天：沉淀测试准入和发布门禁标准。'
      ],
      role_scope_text: '负责车载软件测试方案设计与执行，对缺陷发现效率、回归质量和发布风险控制负责。'
    },
    commonDeductionPoints: [
      '只讲执行过程，不讲测试设计思路。',
      '缺陷描述和复现路径不完整。',
      '回归策略缺少优先级和风险控制。',
      '无法说明质量指标与发布决策关系。'
    ],
    starTemplate: {
      situation: '版本发布前核心功能出现高优先级缺陷，存在上线风险。',
      task: '在限定窗口内完成缺陷定位、修复验证和发布风险评估。',
      action: [
        '快速复现并定位触发条件，明确影响范围。',
        '联动开发修复并补充边界测试用例。',
        '执行回归验证并输出风险决策建议。'
      ],
      result: [
        '关键缺陷按期关闭并通过发布评审。',
        '形成可复用的高风险缺陷处置流程。'
      ],
      proof_materials: ['缺陷单', '回归测试报告', '发布评审记录']
    },
    writtenAdds: [
      { id: 'IND_AUTO_INTELLIGENT_DRIVING_WRITTEN_V161_R012F_01', stage: 'campus_early_batch_written', round: '提前批笔试', scenarioBucket: 'business_scenario', type: '高优缺陷处置题', prompt: '【行业:汽车与智能驾驶｜岗位:车载软件测试工程师｜阶段:提前批笔试】发布前发现高优缺陷，你如何快速处置并评估风险？' },
      { id: 'IND_AUTO_INTELLIGENT_DRIVING_WRITTEN_V161_R012F_02', stage: 'campus_main_batch_written', round: '主批笔试', scenarioBucket: 'system_process', type: '测试流程设计题', prompt: '【行业:汽车与智能驾驶｜岗位:车载软件测试工程师｜阶段:主批笔试】请设计“需求-测试-缺陷-回归”测试流程。' },
      { id: 'IND_AUTO_INTELLIGENT_DRIVING_WRITTEN_V161_R012F_03', stage: 'campus_supplement_written', round: '补录笔试', scenarioBucket: 'failure_review', type: '漏测复盘题', prompt: '【行业:汽车与智能驾驶｜岗位:车载软件测试工程师｜阶段:补录笔试】一次线上漏测事故后你如何复盘并防复发？' },
      { id: 'IND_AUTO_INTELLIGENT_DRIVING_WRITTEN_V161_R012F_04', stage: 'internship_conversion_written', round: '实习转正笔试', scenarioBucket: 'metric_tradeoff', type: '效率质量平衡', prompt: '【行业:汽车与智能驾驶｜岗位:车载软件测试工程师｜阶段:实习转正笔试】提测频率提升时如何保证测试质量？' }
    ],
    interviewAdds: [
      { id: 'IND_AUTO_INTELLIGENT_DRIVING_INTERVIEW_V161_R012F_01', stage: 'campus_early_batch_interview', round: '提前批面试', scenarioBucket: 'business_scenario', type: '发布窗口沟通题', prompt: '【行业:汽车与智能驾驶｜岗位:车载软件测试工程师｜阶段:提前批面试】管理层要求按期发布但风险未消除时你怎么沟通？' },
      { id: 'IND_AUTO_INTELLIGENT_DRIVING_INTERVIEW_V161_R012F_02', stage: 'campus_main_batch_interview', round: '主批面试', scenarioBucket: 'cross_team_collaboration', type: '测试开发协同题', prompt: '【行业:汽车与智能驾驶｜岗位:车载软件测试工程师｜阶段:主批面试】开发不认可缺陷优先级时你如何推进？' },
      { id: 'IND_AUTO_INTELLIGENT_DRIVING_INTERVIEW_V161_R012F_03', stage: 'campus_supplement_interview', round: '补录面试', scenarioBucket: 'failure_review', type: '回归失效复盘', prompt: '【行业:汽车与智能驾驶｜岗位:车载软件测试工程师｜阶段:补录面试】讲一次回归策略失效后的整改经历。' },
      { id: 'IND_AUTO_INTELLIGENT_DRIVING_INTERVIEW_V161_R012F_04', stage: 'internship_conversion_interview', round: '实习转正面试', scenarioBucket: 'metric_tradeoff', type: '资源优先级取舍', prompt: '【行业:汽车与智能驾驶｜岗位:车载软件测试工程师｜阶段:实习转正面试】测试资源有限时你如何安排用例优先级？' }
    ]
  },
  {
    file: 'data/entries/IND_BIOMED_DEVICE.json',
    roleId: 'IND_BIOMED_DEVICE_ROLE_012',
    roleName: '医疗器械质量体系工程师',
    rolePatch: {
      role_readiness_floor: '至少完成1个质量体系改进项目：流程审查、偏差整改、CAPA闭环和内审支持。',
      day_in_life: '医疗器械质量体系工程师工作周：维护体系文件、跟踪偏差和变更、组织内审、推进CAPA整改、对接监管抽检。',
      growth_path_1to3_year: '0-1年掌握QMS规范与文件体系；1-3年独立负责内审和整改项目；3-5年可主导体系优化与审计准备。',
      transfer_path_hint: '可转注册事务、生产质量管理、合规审计；需补法规申报和生产过程理解，过渡5-9个月。',
      prep_90d_plan: [
        '1-30天：梳理ISO 13485和企业QMS关键条线。',
        '31-60天：完成1个偏差处理到CAPA闭环案例。',
        '61-90天：完成10套质量体系题训练，强化审计应答和证据链表达。'
      ],
      career_outlook_3to5_year: '器械监管持续强化，质量体系岗位需求稳定，能力重点向体系数字化与跨部门整改推进。',
      typical_work_week: '内审和外审窗口期任务集中，文档和现场核查并行推进。',
      switch_directions: [
        { target_role: '注册事务', switch_cost: '中', bridge_skills: ['法规写作', '申报流程'], transition_period: '5-8个月' },
        { target_role: '生产质量管理', switch_cost: '中', bridge_skills: ['过程控制', '现场管理'], transition_period: '5-8个月' },
        { target_role: '合规审计', switch_cost: '中高', bridge_skills: ['审计方法', '风险分级'], transition_period: '6-9个月' }
      ],
      prepare_180d_plan: [
        '91-120天：建立偏差分级与整改时效看板。',
        '121-150天：主导1次跨部门CAPA专项。',
        '151-180天：沉淀审计准备清单与证据模板。'
      ],
      role_scope_text: '负责医疗器械质量体系维护与持续改进，对体系合规性、整改闭环效率和审计通过率负责。'
    },
    commonDeductionPoints: [
      '只会引用条款，无法落地到流程。',
      '偏差原因分析停留表面。',
      'CAPA措施缺少效果验证。',
      '审计证据链不完整。'
    ],
    starTemplate: {
      situation: '外审前内审发现多项关键偏差，存在审计不通过风险。',
      task: '在外审前完成关键偏差整改并形成可验证证据链。',
      action: [
        '按风险级别重排整改优先级和责任人。',
        '推动跨部门执行CAPA并设置里程碑检查。',
        '复核整改有效性并完善审计证据包。'
      ],
      result: [
        '关键偏差按期关闭并通过外审。',
        '形成标准化偏差整改机制。'
      ],
      proof_materials: ['内审报告', 'CAPA记录', '外审整改证据']
    },
    writtenAdds: [
      { id: 'IND_BIOMED_DEVICE_WRITTEN_V161_R012F_01', stage: 'campus_early_batch_written', round: '提前批笔试', scenarioBucket: 'business_scenario', type: '偏差整改推进题', prompt: '【行业:生物医药与器械｜岗位:医疗器械质量体系工程师｜阶段:提前批笔试】内审发现关键偏差后你如何推进整改闭环？' },
      { id: 'IND_BIOMED_DEVICE_WRITTEN_V161_R012F_02', stage: 'campus_main_batch_written', round: '主批笔试', scenarioBucket: 'system_process', type: '质量体系流程设计', prompt: '【行业:生物医药与器械｜岗位:医疗器械质量体系工程师｜阶段:主批笔试】请设计“发现-分析-整改-验证”质量体系流程。' },
      { id: 'IND_BIOMED_DEVICE_WRITTEN_V161_R012F_03', stage: 'campus_supplement_written', round: '补录笔试', scenarioBucket: 'failure_review', type: '审计失分复盘', prompt: '【行业:生物医药与器械｜岗位:医疗器械质量体系工程师｜阶段:补录笔试】一次审计失分后你如何复盘并修正机制？' },
      { id: 'IND_BIOMED_DEVICE_WRITTEN_V161_R012F_04', stage: 'internship_conversion_written', round: '实习转正笔试', scenarioBucket: 'metric_tradeoff', type: '时效合规平衡', prompt: '【行业:生物医药与器械｜岗位:医疗器械质量体系工程师｜阶段:实习转正笔试】整改时限紧张时如何兼顾合规和效率？' }
    ],
    interviewAdds: [
      { id: 'IND_BIOMED_DEVICE_INTERVIEW_V161_R012F_01', stage: 'campus_early_batch_interview', round: '提前批面试', scenarioBucket: 'business_scenario', type: '整改阻力沟通题', prompt: '【行业:生物医药与器械｜岗位:医疗器械质量体系工程师｜阶段:提前批面试】业务部门抵触整改时你如何推进？' },
      { id: 'IND_BIOMED_DEVICE_INTERVIEW_V161_R012F_02', stage: 'campus_main_batch_interview', round: '主批面试', scenarioBucket: 'cross_team_collaboration', type: '跨部门审计协同', prompt: '【行业:生物医药与器械｜岗位:医疗器械质量体系工程师｜阶段:主批面试】研发与生产对偏差归因不一致时你怎么协调？' },
      { id: 'IND_BIOMED_DEVICE_INTERVIEW_V161_R012F_03', stage: 'campus_supplement_interview', round: '补录面试', scenarioBucket: 'failure_review', type: 'CAPA失效复盘', prompt: '【行业:生物医药与器械｜岗位:医疗器械质量体系工程师｜阶段:补录面试】讲一次CAPA措施无效后的改进过程。' },
      { id: 'IND_BIOMED_DEVICE_INTERVIEW_V161_R012F_04', stage: 'internship_conversion_interview', round: '实习转正面试', scenarioBucket: 'metric_tradeoff', type: '风险优先级决策', prompt: '【行业:生物医药与器械｜岗位:医疗器械质量体系工程师｜阶段:实习转正面试】多条整改任务并行时你如何排优先级？' }
    ]
  },
  {
    file: 'data/entries/IND_ECOMMERCE_CROSSBORDER.json',
    roleId: 'IND_ECOMMERCE_CROSSBORDER_ROLE_012',
    roleName: '海外市场运营',
    rolePatch: {
      role_readiness_floor: '至少完成1个海外市场运营项目：市场调研、本地化策略、活动执行和效果复盘。',
      day_in_life: '海外市场运营工作周：跟踪区域市场数据、优化本地化内容、推进渠道合作、监控转化漏斗、复盘投放和活动结果。',
      growth_path_1to3_year: '0-1年掌握市场运营基础和渠道规则；1-3年独立负责区域增长；3-5年可主导多市场运营策略。',
      transfer_path_hint: '可转海外增长运营、品牌营销、跨境产品运营；需补增长实验和品牌策略，过渡5-9个月。',
      prep_90d_plan: [
        '1-30天：梳理目标市场用户画像与竞品格局。',
        '31-60天：完成1个本地化活动从策划到复盘案例。',
        '61-90天：完成10套海外运营题训练，强化数据洞察和本地化表达。'
      ],
      career_outlook_3to5_year: '跨境业务区域扩张持续，海外运营岗位需求增长，能力重心向本地化精细运营与跨团队协同。',
      typical_work_week: '活动周期和区域时差共同驱动节奏，节点期跨时区协同压力较高。',
      switch_directions: [
        { target_role: '海外增长运营', switch_cost: '低中', bridge_skills: ['增长实验', '漏斗优化'], transition_period: '4-6个月' },
        { target_role: '品牌营销', switch_cost: '中', bridge_skills: ['品牌定位', '整合传播'], transition_period: '5-8个月' },
        { target_role: '跨境产品运营', switch_cost: '中', bridge_skills: ['产品分析', '用户反馈闭环'], transition_period: '5-8个月' }
      ],
      prepare_180d_plan: [
        '91-120天：建立区域市场指标分层看板。',
        '121-150天：主导1次重点市场增长专项复盘。',
        '151-180天：沉淀本地化内容与渠道协同手册。'
      ],
      role_scope_text: '负责海外市场增长与本地化运营，对区域转化、用户活跃和市场拓展效率负责。'
    },
    commonDeductionPoints: [
      '只讲活动执行，不讲区域策略。',
      '本地化方案缺少用户洞察支撑。',
      '指标复盘不完整，缺少因果分析。',
      '跨时区协同和资源调度逻辑不清。'
    ],
    starTemplate: {
      situation: '重点海外市场活动转化连续下滑，渠道成本上升。',
      task: '在保持投放规模的前提下恢复转化效率。',
      action: [
        '复盘漏斗并定位本地化内容和渠道问题。',
        '重构活动节奏与区域内容策略。',
        '联动投放和客服团队闭环高流失环节。'
      ],
      result: [
        '转化率回升并改善成本效率。',
        '建立区域化运营迭代机制。'
      ],
      proof_materials: ['区域运营看板', '活动复盘报告', '渠道对账数据']
    },
    writtenAdds: [
      { id: 'IND_ECOMMERCE_CROSSBORDER_WRITTEN_V161_R012F_01', stage: 'campus_early_batch_written', round: '提前批笔试', scenarioBucket: 'business_scenario', type: '区域转化修复题', prompt: '【行业:电商与跨境电商｜岗位:海外市场运营｜阶段:提前批笔试】重点市场转化下滑时你如何快速修复？' },
      { id: 'IND_ECOMMERCE_CROSSBORDER_WRITTEN_V161_R012F_02', stage: 'campus_main_batch_written', round: '主批笔试', scenarioBucket: 'system_process', type: '海外运营流程设计', prompt: '【行业:电商与跨境电商｜岗位:海外市场运营｜阶段:主批笔试】请设计“调研-执行-监控-复盘”运营流程。' },
      { id: 'IND_ECOMMERCE_CROSSBORDER_WRITTEN_V161_R012F_03', stage: 'campus_supplement_written', round: '补录笔试', scenarioBucket: 'failure_review', type: '活动失效复盘', prompt: '【行业:电商与跨境电商｜岗位:海外市场运营｜阶段:补录笔试】一次海外活动失效后你如何复盘并迭代？' },
      { id: 'IND_ECOMMERCE_CROSSBORDER_WRITTEN_V161_R012F_04', stage: 'internship_conversion_written', round: '实习转正笔试', scenarioBucket: 'metric_tradeoff', type: '规模效率平衡', prompt: '【行业:电商与跨境电商｜岗位:海外市场运营｜阶段:实习转正笔试】扩量目标与ROI约束冲突时你如何决策？' }
    ],
    interviewAdds: [
      { id: 'IND_ECOMMERCE_CROSSBORDER_INTERVIEW_V161_R012F_01', stage: 'campus_early_batch_interview', round: '提前批面试', scenarioBucket: 'business_scenario', type: '时差协同应对题', prompt: '【行业:电商与跨境电商｜岗位:海外市场运营｜阶段:提前批面试】跨时区突发舆情时你如何组织应对？' },
      { id: 'IND_ECOMMERCE_CROSSBORDER_INTERVIEW_V161_R012F_02', stage: 'campus_main_batch_interview', round: '主批面试', scenarioBucket: 'cross_team_collaboration', type: '多团队协同推进', prompt: '【行业:电商与跨境电商｜岗位:海外市场运营｜阶段:主批面试】产品、投放、客服目标不一致时你怎么推进？' },
      { id: 'IND_ECOMMERCE_CROSSBORDER_INTERVIEW_V161_R012F_03', stage: 'campus_supplement_interview', round: '补录面试', scenarioBucket: 'failure_review', type: '本地化误判复盘', prompt: '【行业:电商与跨境电商｜岗位:海外市场运营｜阶段:补录面试】讲一次你本地化策略失误后的修正过程。' },
      { id: 'IND_ECOMMERCE_CROSSBORDER_INTERVIEW_V161_R012F_04', stage: 'internship_conversion_interview', round: '实习转正面试', scenarioBucket: 'metric_tradeoff', type: '资源分配取舍', prompt: '【行业:电商与跨境电商｜岗位:海外市场运营｜阶段:实习转正面试】多个区域同时冲量时你如何分配预算？' }
    ]
  },
  {
    file: 'data/entries/IND_ENERGY_UTILITIES.json',
    roleId: 'IND_ENERGY_UTILITIES_ROLE_012',
    roleName: '电网数据分析师',
    rolePatch: {
      role_readiness_floor: '至少完成1个电网数据分析项目：数据治理、负荷预测、异常识别和运营建议闭环。',
      day_in_life: '电网数据分析师工作周：清洗业务数据、构建分析模型、监测异常波动、输出运营报告、支持调度优化。',
      growth_path_1to3_year: '0-1年掌握电网数据口径和分析工具；1-3年独立负责专题分析；3-5年可主导预测模型和数据治理策略。',
      transfer_path_hint: '可转电力交易分析、调度优化工程师、能源数字化产品经理；需补调度业务和模型工程化，过渡6-10个月。',
      prep_90d_plan: [
        '1-30天：梳理电网核心指标与数据来源。',
        '31-60天：完成1个负荷异常诊断和改进案例。',
        '61-90天：完成10套电网数据题训练，强化业务解释和策略建议能力。'
      ],
      career_outlook_3to5_year: '新型电力系统建设推动数据化运营深化，电网分析岗位需求增长，能力重心向预测和决策支持。',
      typical_work_week: '月度结算和极端天气期间分析任务集中，响应时效要求高。',
      switch_directions: [
        { target_role: '电力交易分析', switch_cost: '中', bridge_skills: ['市场规则', '价格分析'], transition_period: '6-9个月' },
        { target_role: '调度优化工程师', switch_cost: '中高', bridge_skills: ['调度策略', '优化算法'], transition_period: '7-10个月' },
        { target_role: '能源数字化产品经理', switch_cost: '中', bridge_skills: ['产品化思维', '需求管理'], transition_period: '6-9个月' }
      ],
      prepare_180d_plan: [
        '91-120天：建立异常告警分级与响应机制。',
        '121-150天：主导1次预测偏差专项复盘。',
        '151-180天：沉淀电网数据分析模板与指标词典。'
      ],
      role_scope_text: '负责电网运营数据分析与预测支持，对数据质量、异常识别准确率和运营建议有效性负责。'
    },
    commonDeductionPoints: [
      '只汇报现象，不给可执行建议。',
      '模型结果缺少业务解释。',
      '数据口径不一致导致结论失真。',
      '异常处置没有闭环跟踪。'
    ],
    starTemplate: {
      situation: '高峰期负荷预测偏差扩大，影响调度决策与运行稳定。',
      task: '在短周期内降低预测偏差并给出调度优化建议。',
      action: [
        '复盘历史误差并识别关键影响变量。',
        '调整模型特征并引入异常天气因子。',
        '联动调度团队验证策略效果并持续监控。'
      ],
      result: [
        '预测偏差下降并提升调度决策稳定性。',
        '形成可复用的预测优化机制。'
      ],
      proof_materials: ['预测误差报告', '模型迭代记录', '调度反馈纪要']
    },
    writtenAdds: [
      { id: 'IND_ENERGY_UTILITIES_WRITTEN_V161_R012F_01', stage: 'campus_early_batch_written', round: '提前批笔试', scenarioBucket: 'business_scenario', type: '预测偏差修复题', prompt: '【行业:能源与公用事业｜岗位:电网数据分析师｜阶段:提前批笔试】高峰期负荷预测偏差扩大时你如何修复？' },
      { id: 'IND_ENERGY_UTILITIES_WRITTEN_V161_R012F_02', stage: 'campus_main_batch_written', round: '主批笔试', scenarioBucket: 'system_process', type: '分析流程设计题', prompt: '【行业:能源与公用事业｜岗位:电网数据分析师｜阶段:主批笔试】请设计“采集-分析-预警-优化”数据流程。' },
      { id: 'IND_ENERGY_UTILITIES_WRITTEN_V161_R012F_03', stage: 'campus_supplement_written', round: '补录笔试', scenarioBucket: 'failure_review', type: '误判复盘题', prompt: '【行业:能源与公用事业｜岗位:电网数据分析师｜阶段:补录笔试】一次异常误判后你如何复盘并修正模型？' },
      { id: 'IND_ENERGY_UTILITIES_WRITTEN_V161_R012F_04', stage: 'internship_conversion_written', round: '实习转正笔试', scenarioBucket: 'metric_tradeoff', type: '精度时效平衡', prompt: '【行业:能源与公用事业｜岗位:电网数据分析师｜阶段:实习转正笔试】实时性和预测精度冲突时你如何取舍？' }
    ],
    interviewAdds: [
      { id: 'IND_ENERGY_UTILITIES_INTERVIEW_V161_R012F_01', stage: 'campus_early_batch_interview', round: '提前批面试', scenarioBucket: 'business_scenario', type: '异常告警响应题', prompt: '【行业:能源与公用事业｜岗位:电网数据分析师｜阶段:提前批面试】突发负荷异常时你如何快速响应？' },
      { id: 'IND_ENERGY_UTILITIES_INTERVIEW_V161_R012F_02', stage: 'campus_main_batch_interview', round: '主批面试', scenarioBucket: 'cross_team_collaboration', type: '分析调度协同题', prompt: '【行业:能源与公用事业｜岗位:电网数据分析师｜阶段:主批面试】分析结论与调度经验冲突时你如何推进？' },
      { id: 'IND_ENERGY_UTILITIES_INTERVIEW_V161_R012F_03', stage: 'campus_supplement_interview', round: '补录面试', scenarioBucket: 'failure_review', type: '报表失真复盘', prompt: '【行业:能源与公用事业｜岗位:电网数据分析师｜阶段:补录面试】讲一次数据口径错误导致误判后的整改经历。' },
      { id: 'IND_ENERGY_UTILITIES_INTERVIEW_V161_R012F_04', stage: 'internship_conversion_interview', round: '实习转正面试', scenarioBucket: 'metric_tradeoff', type: '优先级决策题', prompt: '【行业:能源与公用事业｜岗位:电网数据分析师｜阶段:实习转正面试】多条分析任务并行时你如何分配精力？' }
    ]
  },
  {
    file: 'data/entries/IND_FIN_BANK.json',
    roleId: 'IND_FIN_BANK_ROLE_012',
    roleName: '银行数据治理专员',
    rolePatch: {
      role_readiness_floor: '至少完成1个银行数据治理项目：标准制定、质量监控、问题整改与报送支持。',
      day_in_life: '银行数据治理专员工作周：维护数据标准、核对报送口径、跟踪质量问题、推动整改闭环、支持监管检查。',
      growth_path_1to3_year: '0-1年掌握银行数据标准与监管要求；1-3年独立负责数据治理专项；3-5年可主导全域数据质量体系。',
      transfer_path_hint: '可转数据管理经理、监管报送专员、数据产品经理；需补架构设计和监管规则深度，过渡6-10个月。',
      prep_90d_plan: [
        '1-30天：梳理核心数据域标准和报送口径。',
        '31-60天：完成1个数据质量问题整改闭环案例。',
        '61-90天：完成10套数据治理题训练，强化标准落地与跨部门推进。'
      ],
      career_outlook_3to5_year: '金融监管数字化持续强化，银行数据治理岗位需求稳定增长，能力重心向全链路治理和自动化监控。',
      typical_work_week: '月报季报节点任务集中，治理和报送问题需快速联动处理。',
      switch_directions: [
        { target_role: '数据管理经理', switch_cost: '中', bridge_skills: ['治理体系', '项目统筹'], transition_period: '6-9个月' },
        { target_role: '监管报送专员', switch_cost: '低中', bridge_skills: ['报送规则', '口径管理'], transition_period: '4-6个月' },
        { target_role: '数据产品经理', switch_cost: '中高', bridge_skills: ['产品设计', '需求治理'], transition_period: '7-10个月' }
      ],
      prepare_180d_plan: [
        '91-120天：建立关键报送字段质量监控机制。',
        '121-150天：主导1次跨部门数据治理专项。',
        '151-180天：沉淀数据问题分级和整改标准。'
      ],
      role_scope_text: '负责银行数据标准与质量治理，对报送一致性、数据准确性和整改时效负责。'
    },
    commonDeductionPoints: [
      '只谈制度，不谈执行路径。',
      '数据口径冲突处理无优先级。',
      '问题整改缺少验收标准。',
      '无法量化治理效果。'
    ],
    starTemplate: {
      situation: '监管报送前发现关键字段数据质量异常，存在合规风险。',
      task: '在报送窗口前完成问题定位、整改和复核。',
      action: [
        '快速定位异常源系统和字段映射问题。',
        '联动业务和技术团队修正口径并补数。',
        '执行复核并建立同类问题预警机制。'
      ],
      result: [
        '按期完成报送且通过抽查。',
        '关键字段质量稳定性显著提升。'
      ],
      proof_materials: ['数据质量看板', '整改工单', '报送复核记录']
    },
    writtenAdds: [
      { id: 'IND_FIN_BANK_WRITTEN_V161_R012F_01', stage: 'campus_early_batch_written', round: '提前批笔试', scenarioBucket: 'business_scenario', type: '报送异常处置题', prompt: '【行业:金融-银行｜岗位:银行数据治理专员｜阶段:提前批笔试】报送前发现关键字段异常时你如何处置？' },
      { id: 'IND_FIN_BANK_WRITTEN_V161_R012F_02', stage: 'campus_main_batch_written', round: '主批笔试', scenarioBucket: 'system_process', type: '治理流程设计', prompt: '【行业:金融-银行｜岗位:银行数据治理专员｜阶段:主批笔试】请设计“标准-监控-整改-复核”治理流程。' },
      { id: 'IND_FIN_BANK_WRITTEN_V161_R012F_03', stage: 'campus_supplement_written', round: '补录笔试', scenarioBucket: 'failure_review', type: '口径冲突复盘', prompt: '【行业:金融-银行｜岗位:银行数据治理专员｜阶段:补录笔试】一次口径冲突导致返工后你如何复盘？' },
      { id: 'IND_FIN_BANK_WRITTEN_V161_R012F_04', stage: 'internship_conversion_written', round: '实习转正笔试', scenarioBucket: 'metric_tradeoff', type: '时效准确平衡', prompt: '【行业:金融-银行｜岗位:银行数据治理专员｜阶段:实习转正笔试】报送时效和数据准确冲突时你如何取舍？' }
    ],
    interviewAdds: [
      { id: 'IND_FIN_BANK_INTERVIEW_V161_R012F_01', stage: 'campus_early_batch_interview', round: '提前批面试', scenarioBucket: 'business_scenario', type: '监管压力沟通题', prompt: '【行业:金融-银行｜岗位:银行数据治理专员｜阶段:提前批面试】监管检查临近但数据问题未清零时你如何汇报？' },
      { id: 'IND_FIN_BANK_INTERVIEW_V161_R012F_02', stage: 'campus_main_batch_interview', round: '主批面试', scenarioBucket: 'cross_team_collaboration', type: '业务技术协同题', prompt: '【行业:金融-银行｜岗位:银行数据治理专员｜阶段:主批面试】业务与技术对责任归属冲突时你如何推进？' },
      { id: 'IND_FIN_BANK_INTERVIEW_V161_R012F_03', stage: 'campus_supplement_interview', round: '补录面试', scenarioBucket: 'failure_review', type: '整改反复复盘', prompt: '【行业:金融-银行｜岗位:银行数据治理专员｜阶段:补录面试】讲一次数据问题反复出现后的治理改进。' },
      { id: 'IND_FIN_BANK_INTERVIEW_V161_R012F_04', stage: 'internship_conversion_interview', round: '实习转正面试', scenarioBucket: 'metric_tradeoff', type: '治理优先级决策', prompt: '【行业:金融-银行｜岗位:银行数据治理专员｜阶段:实习转正面试】多个高风险问题并发时你如何排期？' }
    ]
  },
  {
    file: 'data/entries/IND_FIN_SECURITIES_FUND.json',
    roleId: 'IND_FIN_SECURITIES_FUND_ROLE_012',
    roleName: '机构销售支持',
    rolePatch: {
      role_readiness_floor: '至少完成1个机构销售支持项目：客户需求整理、路演准备、材料输出与反馈闭环。',
      day_in_life: '机构销售支持工作周：整理客户需求、准备产品路演材料、跟踪交易机会、汇总客户反馈、协同投研与运营。',
      growth_path_1to3_year: '0-1年掌握机构客户服务流程；1-3年独立负责重点客户支持；3-5年可主导机构服务策略和协同机制。',
      transfer_path_hint: '可转机构销售、产品经理、投顾支持；需补客户经营和产品深度理解，过渡5-9个月。',
      prep_90d_plan: [
        '1-30天：梳理机构客户类型与服务需求结构。',
        '31-60天：完成1个路演支持与反馈转化案例。',
        '61-90天：完成10套机构销售支持题训练，强化需求拆解和协同推进。'
      ],
      career_outlook_3to5_year: '机构化投资趋势加强，销售支持岗位需求稳定，能力重点转向客户洞察和跨团队协同效率。',
      typical_work_week: '路演和发行窗口期节奏紧，材料与沟通反馈需要高频迭代。',
      switch_directions: [
        { target_role: '机构销售', switch_cost: '中', bridge_skills: ['客户拓展', '商务沟通'], transition_period: '5-8个月' },
        { target_role: '产品经理', switch_cost: '中', bridge_skills: ['产品设计', '竞争分析'], transition_period: '6-9个月' },
        { target_role: '投顾支持', switch_cost: '低中', bridge_skills: ['策略表达', '客户服务'], transition_period: '4-6个月' }
      ],
      prepare_180d_plan: [
        '91-120天：建立客户反馈分类与优先级机制。',
        '121-150天：主导1次路演转化率提升专项。',
        '151-180天：沉淀机构销售支持材料库与流程标准。'
      ],
      role_scope_text: '负责机构客户销售支持和路演协同，对材料交付质量、反馈响应时效和客户转化支持效果负责。'
    },
    commonDeductionPoints: [
      '只做材料搬运，缺少客户需求洞察。',
      '反馈整理无优先级和行动建议。',
      '路演支持不关注转化结果。',
      '跨团队协同推进动作不清。'
    ],
    starTemplate: {
      situation: '重点机构客户路演后反馈分散，转化率低于预期。',
      task: '快速梳理反馈并推动产品与销售动作优化。',
      action: [
        '将客户反馈按需求主题分层归类。',
        '联动投研完善核心材料和问答清单。',
        '跟踪销售动作执行并复盘转化链路。'
      ],
      result: [
        '重点客户转化率提升并缩短决策周期。',
        '形成可复用的路演反馈闭环机制。'
      ],
      proof_materials: ['客户反馈表', '路演材料版本记录', '转化跟踪报表']
    },
    writtenAdds: [
      { id: 'IND_FIN_SECURITIES_FUND_WRITTEN_V161_R012F_01', stage: 'campus_early_batch_written', round: '提前批笔试', scenarioBucket: 'business_scenario', type: '路演转化优化题', prompt: '【行业:金融-证券基金｜岗位:机构销售支持｜阶段:提前批笔试】路演后转化低迷时你如何优化支持策略？' },
      { id: 'IND_FIN_SECURITIES_FUND_WRITTEN_V161_R012F_02', stage: 'campus_main_batch_written', round: '主批笔试', scenarioBucket: 'system_process', type: '销售支持流程设计', prompt: '【行业:金融-证券基金｜岗位:机构销售支持｜阶段:主批笔试】请设计“需求-材料-路演-跟进”支持流程。' },
      { id: 'IND_FIN_SECURITIES_FUND_WRITTEN_V161_R012F_03', stage: 'campus_supplement_written', round: '补录笔试', scenarioBucket: 'failure_review', type: '客户流失复盘', prompt: '【行业:金融-证券基金｜岗位:机构销售支持｜阶段:补录笔试】一次重点客户流失后你如何复盘支持问题？' },
      { id: 'IND_FIN_SECURITIES_FUND_WRITTEN_V161_R012F_04', stage: 'internship_conversion_written', round: '实习转正笔试', scenarioBucket: 'metric_tradeoff', type: '效率深度平衡', prompt: '【行业:金融-证券基金｜岗位:机构销售支持｜阶段:实习转正笔试】客户覆盖广但资源有限时你如何平衡支持深度？' }
    ],
    interviewAdds: [
      { id: 'IND_FIN_SECURITIES_FUND_INTERVIEW_V161_R012F_01', stage: 'campus_early_batch_interview', round: '提前批面试', scenarioBucket: 'business_scenario', type: '高压需求响应题', prompt: '【行业:金融-证券基金｜岗位:机构销售支持｜阶段:提前批面试】多个机构客户同时提出紧急需求时你如何应对？' },
      { id: 'IND_FIN_SECURITIES_FUND_INTERVIEW_V161_R012F_02', stage: 'campus_main_batch_interview', round: '主批面试', scenarioBucket: 'cross_team_collaboration', type: '投研销售协同题', prompt: '【行业:金融-证券基金｜岗位:机构销售支持｜阶段:主批面试】投研观点与销售话术冲突时你如何协调？' },
      { id: 'IND_FIN_SECURITIES_FUND_INTERVIEW_V161_R012F_03', stage: 'campus_supplement_interview', round: '补录面试', scenarioBucket: 'failure_review', type: '反馈误判复盘', prompt: '【行业:金融-证券基金｜岗位:机构销售支持｜阶段:补录面试】讲一次你误判客户需求后的修正过程。' },
      { id: 'IND_FIN_SECURITIES_FUND_INTERVIEW_V161_R012F_04', stage: 'internship_conversion_interview', round: '实习转正面试', scenarioBucket: 'metric_tradeoff', type: '服务优先级决策', prompt: '【行业:金融-证券基金｜岗位:机构销售支持｜阶段:实习转正面试】核心客户和潜力客户冲突时你如何排优先级？' }
    ]
  },
  {
    file: 'data/entries/IND_NEW_ENERGY.json',
    roleId: 'IND_NEW_ENERGY_ROLE_012',
    roleName: '电池测试工程师',
    rolePatch: {
      role_readiness_floor: '至少完成1个电池测试项目：测试计划制定、性能验证、失效分析和改进闭环。',
      day_in_life: '电池测试工程师工作周：制定测试方案、执行循环与安全测试、分析异常数据、输出验证结论、推动改进回归。',
      growth_path_1to3_year: '0-1年掌握测试标准与设备；1-3年独立负责模块验证；3-5年可主导测试策略与可靠性改进。',
      transfer_path_hint: '可转电池研发工程师、可靠性工程师、储能测试工程师；需补材料机理和系统工程，过渡6-10个月。',
      prep_90d_plan: [
        '1-30天：梳理电池测试标准与关键指标。',
        '31-60天：完成1个失效样本定位与改进案例。',
        '61-90天：完成10套电池测试题训练，强化异常分析和验证逻辑表达。'
      ],
      career_outlook_3to5_year: '动力与储能电池迭代加速，测试岗位需求持续增长，能力重点向可靠性和安全验证深化。',
      typical_work_week: '实验排期和设备资源约束明显，节点期高强度并行测试常态化。',
      switch_directions: [
        { target_role: '电池研发工程师', switch_cost: '中高', bridge_skills: ['电化学机理', '材料特性'], transition_period: '7-10个月' },
        { target_role: '可靠性工程师', switch_cost: '中', bridge_skills: ['可靠性建模', '寿命评估'], transition_period: '6-9个月' },
        { target_role: '储能测试工程师', switch_cost: '低中', bridge_skills: ['系统级测试', '安全规范'], transition_period: '4-7个月' }
      ],
      prepare_180d_plan: [
        '91-120天：建立高风险失效模式数据库。',
        '121-150天：主导1次测试异常专项复盘。',
        '151-180天：沉淀电池测试计划和验收模板。'
      ],
      role_scope_text: '负责电池性能与安全测试验证，对测试结论准确性、失效定位效率和改进闭环质量负责。'
    },
    commonDeductionPoints: [
      '只汇报数据，不解释机理与影响。',
      '测试边界条件设定不完整。',
      '失效分析缺少验证闭环。',
      '改进措施无回归证据。'
    ],
    starTemplate: {
      situation: '新电芯样品循环寿命低于目标，项目节点受影响。',
      task: '快速定位失效原因并验证改进方案有效性。',
      action: [
        '分析测试曲线并分层定位异常批次。',
        '联合研发调整工艺参数并重测关键指标。',
        '执行回归验证并固化测试判定标准。'
      ],
      result: [
        '寿命指标回到目标区间并通过评审。',
        '形成可复用的失效分析与验证流程。'
      ],
      proof_materials: ['测试曲线报告', '失效分析记录', '回归验证结果']
    },
    writtenAdds: [
      { id: 'IND_NEW_ENERGY_WRITTEN_V161_R012F_01', stage: 'campus_early_batch_written', round: '提前批笔试', scenarioBucket: 'business_scenario', type: '寿命异常定位题', prompt: '【行业:新能源｜岗位:电池测试工程师｜阶段:提前批笔试】样品寿命低于目标时你如何定位并改进？' },
      { id: 'IND_NEW_ENERGY_WRITTEN_V161_R012F_02', stage: 'campus_main_batch_written', round: '主批笔试', scenarioBucket: 'system_process', type: '测试流程设计题', prompt: '【行业:新能源｜岗位:电池测试工程师｜阶段:主批笔试】请设计“计划-执行-分析-回归”测试流程。' },
      { id: 'IND_NEW_ENERGY_WRITTEN_V161_R012F_03', stage: 'campus_supplement_written', round: '补录笔试', scenarioBucket: 'failure_review', type: '失效复盘题', prompt: '【行业:新能源｜岗位:电池测试工程师｜阶段:补录笔试】一次测试结论被推翻后你如何复盘？' },
      { id: 'IND_NEW_ENERGY_WRITTEN_V161_R012F_04', stage: 'internship_conversion_written', round: '实习转正笔试', scenarioBucket: 'metric_tradeoff', type: '精度效率平衡', prompt: '【行业:新能源｜岗位:电池测试工程师｜阶段:实习转正笔试】实验排期紧张时如何兼顾测试完整性和进度？' }
    ],
    interviewAdds: [
      { id: 'IND_NEW_ENERGY_INTERVIEW_V161_R012F_01', stage: 'campus_early_batch_interview', round: '提前批面试', scenarioBucket: 'business_scenario', type: '异常样本应对题', prompt: '【行业:新能源｜岗位:电池测试工程师｜阶段:提前批面试】测试中连续出现异常样本时你如何应对？' },
      { id: 'IND_NEW_ENERGY_INTERVIEW_V161_R012F_02', stage: 'campus_main_batch_interview', round: '主批面试', scenarioBucket: 'cross_team_collaboration', type: '研测协同题', prompt: '【行业:新能源｜岗位:电池测试工程师｜阶段:主批面试】研发和测试对失效原因判断不一致时你如何推进？' },
      { id: 'IND_NEW_ENERGY_INTERVIEW_V161_R012F_03', stage: 'campus_supplement_interview', round: '补录面试', scenarioBucket: 'failure_review', type: '误判复盘题', prompt: '【行业:新能源｜岗位:电池测试工程师｜阶段:补录面试】讲一次你误判测试结果后的纠偏过程。' },
      { id: 'IND_NEW_ENERGY_INTERVIEW_V161_R012F_04', stage: 'internship_conversion_interview', round: '实习转正面试', scenarioBucket: 'metric_tradeoff', type: '资源调度决策', prompt: '【行业:新能源｜岗位:电池测试工程师｜阶段:实习转正面试】设备资源不足时你如何安排测试优先级？' }
    ]
  },
  {
    file: 'data/entries/IND_PUBLIC_INSTITUTION.json',
    roleId: 'IND_PUBLIC_INSTITUTION_ROLE_012',
    roleName: '信息系统运维岗',
    rolePatch: {
      role_readiness_floor: '至少完成1个信息系统运维闭环：故障响应、问题定位、服务恢复与复盘优化。',
      day_in_life: '信息系统运维岗工作周：监控系统健康、处理故障告警、执行变更发布、排查性能瓶颈、输出运维报告与改进计划。',
      growth_path_1to3_year: '0-1年掌握运维流程和工具；1-3年独立负责系统稳定性；3-5年可主导可用性体系和自动化运维建设。',
      transfer_path_hint: '可转系统管理员、运维开发工程师、信息化项目管理岗；需补自动化和项目管理能力，过渡5-9个月。',
      prep_90d_plan: [
        '1-30天：梳理系统架构和核心监控指标。',
        '31-60天：完成1个重大故障应急处置与复盘案例。',
        '61-90天：完成10套运维题训练，强化故障定位和应急沟通能力。'
      ],
      career_outlook_3to5_year: '公共服务数字化深化带动运维需求增长，岗位能力重点转向自动化与高可用架构治理。',
      typical_work_week: '值班与常规运维并行，系统变更窗口和突发故障时任务强度高。',
      switch_directions: [
        { target_role: '系统管理员', switch_cost: '低中', bridge_skills: ['系统配置', '权限管理'], transition_period: '4-6个月' },
        { target_role: '运维开发工程师', switch_cost: '中', bridge_skills: ['脚本开发', '自动化平台'], transition_period: '6-9个月' },
        { target_role: '信息化项目管理岗', switch_cost: '中', bridge_skills: ['项目治理', '需求协同'], transition_period: '5-8个月' }
      ],
      prepare_180d_plan: [
        '91-120天：建立故障分级响应和升级机制。',
        '121-150天：主导1次系统稳定性提升专项。',
        '151-180天：沉淀运维操作手册与应急预案模板。'
      ],
      role_scope_text: '负责信息系统运行保障与故障处理，对系统可用性、故障恢复时效和运维规范执行负责。'
    },
    commonDeductionPoints: [
      '只描述告警处理，不讲根因分析。',
      '应急流程不完整，缺少升级路径。',
      '变更风险评估不足。',
      '复盘结论无法转化为机制。'
    ],
    starTemplate: {
      situation: '核心业务系统在高峰时段出现服务中断，影响群众办理。',
      task: '快速恢复服务并防止同类故障再次发生。',
      action: [
        '启动应急预案并分工定位故障根因。',
        '执行临时恢复和永久修复方案。',
        '组织复盘并更新监控与变更策略。'
      ],
      result: [
        '服务在SLA内恢复且后续稳定运行。',
        '形成标准化应急与复盘机制。'
      ],
      proof_materials: ['故障处理记录', 'SLA报表', '复盘改进清单']
    },
    writtenAdds: [
      { id: 'IND_PUBLIC_INSTITUTION_WRITTEN_V161_R012F_01', stage: 'campus_early_batch_written', round: '提前批笔试', scenarioBucket: 'business_scenario', type: '故障应急处置题', prompt: '【行业:事业单位体系｜岗位:信息系统运维岗｜阶段:提前批笔试】核心系统突发中断时你如何组织应急？' },
      { id: 'IND_PUBLIC_INSTITUTION_WRITTEN_V161_R012F_02', stage: 'campus_main_batch_written', round: '主批笔试', scenarioBucket: 'system_process', type: '运维流程设计题', prompt: '【行业:事业单位体系｜岗位:信息系统运维岗｜阶段:主批笔试】请设计“监控-响应-修复-复盘”运维流程。' },
      { id: 'IND_PUBLIC_INSTITUTION_WRITTEN_V161_R012F_03', stage: 'campus_supplement_written', round: '补录笔试', scenarioBucket: 'failure_review', type: '重复故障复盘', prompt: '【行业:事业单位体系｜岗位:信息系统运维岗｜阶段:补录笔试】同类故障反复出现时你如何复盘并治理？' },
      { id: 'IND_PUBLIC_INSTITUTION_WRITTEN_V161_R012F_04', stage: 'internship_conversion_written', round: '实习转正笔试', scenarioBucket: 'metric_tradeoff', type: '稳定效率平衡', prompt: '【行业:事业单位体系｜岗位:信息系统运维岗｜阶段:实习转正笔试】变更效率和系统稳定冲突时你如何取舍？' }
    ],
    interviewAdds: [
      { id: 'IND_PUBLIC_INSTITUTION_INTERVIEW_V161_R012F_01', stage: 'campus_early_batch_interview', round: '提前批面试', scenarioBucket: 'business_scenario', type: '高峰故障沟通题', prompt: '【行业:事业单位体系｜岗位:信息系统运维岗｜阶段:提前批面试】高峰期系统故障时你如何向业务方同步？' },
      { id: 'IND_PUBLIC_INSTITUTION_INTERVIEW_V161_R012F_02', stage: 'campus_main_batch_interview', round: '主批面试', scenarioBucket: 'cross_team_collaboration', type: '运维开发协同题', prompt: '【行业:事业单位体系｜岗位:信息系统运维岗｜阶段:主批面试】开发和运维对变更风险判断不一致时你如何推进？' },
      { id: 'IND_PUBLIC_INSTITUTION_INTERVIEW_V161_R012F_03', stage: 'campus_supplement_interview', round: '补录面试', scenarioBucket: 'failure_review', type: '应急失误复盘', prompt: '【行业:事业单位体系｜岗位:信息系统运维岗｜阶段:补录面试】讲一次应急处置不当后的改进经历。' },
      { id: 'IND_PUBLIC_INSTITUTION_INTERVIEW_V161_R012F_04', stage: 'internship_conversion_interview', round: '实习转正面试', scenarioBucket: 'metric_tradeoff', type: '任务优先级决策', prompt: '【行业:事业单位体系｜岗位:信息系统运维岗｜阶段:实习转正面试】值班期间多故障并发时你如何排序处理？' }
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
    data_origin: 'official_jd_competency_mapping_with_manual_role_enrichment_v161_batch6',
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
  role.role_detail_v158.expansion_status = 'landed_deep_profile_v161_batch6';

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
