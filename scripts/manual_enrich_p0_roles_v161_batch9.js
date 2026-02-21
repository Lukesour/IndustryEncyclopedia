#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TODAY = '2026-02-20';

const updates = [
  {
    file: 'data/entries/IND_AUTO_INTELLIGENT_DRIVING.json',
    roleId: 'IND_AUTO_INTELLIGENT_DRIVING_ROLE_015',
    roleName: '智驾数据闭环工程师',
    rolePatch: {
      role_readiness_floor: '至少完成1个数据闭环项目：问题回流、样本治理、策略迭代和效果验证。',
      day_in_life: '智驾数据闭环工程师工作周：收集线上异常、筛选高价值样本、推动标注与回灌、跟踪算法效果并复盘。',
      growth_path_1to3_year: '0-1年掌握闭环链路和数据质量标准；1-3年独立负责模块闭环；3-5年可主导跨模块数据策略。',
      transfer_path_hint: '可转自动驾驶数据产品经理、感知算法工程师、仿真评测工程师；需补建模与系统工程，过渡6-10个月。',
      prep_90d_plan: [
        '1-30天：梳理数据回流链路和关键质量指标。',
        '31-60天：完成1个线上问题到数据修复闭环案例。',
        '61-90天：完成10套数据闭环题训练，强化策略与指标表达。'
      ],
      career_outlook_3to5_year: '智驾迭代频率提升推动数据闭环岗位需求增长，能力重心向自动化闭环与效率工程。',
      typical_work_week: '问题回流高峰期任务密集，跨团队协同占比较高。',
      switch_directions: [
        { target_role: '自动驾驶数据产品经理', switch_cost: '中', bridge_skills: ['需求抽象', '流程设计'], transition_period: '6-9个月' },
        { target_role: '感知算法工程师', switch_cost: '中高', bridge_skills: ['模型理解', '特征分析'], transition_period: '7-10个月' },
        { target_role: '仿真评测工程师', switch_cost: '中', bridge_skills: ['场景构建', '评测指标'], transition_period: '6-9个月' }
      ],
      prepare_180d_plan: [
        '91-120天：建立高价值样本自动发现规则。',
        '121-150天：主导1次跨链路闭环效率专项复盘。',
        '151-180天：沉淀数据闭环SOP与质量看板模板。'
      ],
      role_scope_text: '负责智驾问题数据闭环与策略迭代，对数据有效性、回流时效和效果改进负责。'
    },
    commonDeductionPoints: [
      '只讲数据量，不讲数据价值和质量。',
      '闭环链路缺少关键控制点。',
      '无法量化闭环对模型效果的贡献。',
      '跨团队推进路径不清晰。'
    ],
    starTemplate: {
      situation: '线上某场景事故率上升，现有样本覆盖不足。',
      task: '在迭代周期内完成样本补强并验证效果回升。',
      action: [
        '筛选高风险样本并设计回流优先级。',
        '联动标注与算法团队完成数据补强。',
        '执行效果验证并沉淀可复用策略。'
      ],
      result: [
        '目标场景表现改善并稳定。',
        '闭环时效缩短并形成标准流程。'
      ],
      proof_materials: ['样本筛选清单', '回流追踪表', '效果验证报告']
    },
    writtenAdds: [
      { id: 'IND_AUTO_INTELLIGENT_DRIVING_WRITTEN_V161_R015I_01', stage: 'campus_early_batch_written', round: '提前批笔试', scenarioBucket: 'business_scenario', type: '问题回流策略题', prompt: '【行业:汽车与智能驾驶｜岗位:智驾数据闭环工程师｜阶段:提前批笔试】线上异常上升时你如何制定数据回流策略？' },
      { id: 'IND_AUTO_INTELLIGENT_DRIVING_WRITTEN_V161_R015I_02', stage: 'campus_main_batch_written', round: '主批笔试', scenarioBucket: 'system_process', type: '闭环流程设计', prompt: '【行业:汽车与智能驾驶｜岗位:智驾数据闭环工程师｜阶段:主批笔试】请设计“发现-回流-迭代-验证”闭环流程。' },
      { id: 'IND_AUTO_INTELLIGENT_DRIVING_WRITTEN_V161_R015I_03', stage: 'campus_supplement_written', round: '补录笔试', scenarioBucket: 'failure_review', type: '闭环失效复盘', prompt: '【行业:汽车与智能驾驶｜岗位:智驾数据闭环工程师｜阶段:补录笔试】一次闭环执行失效后你如何复盘并修正？' },
      { id: 'IND_AUTO_INTELLIGENT_DRIVING_WRITTEN_V161_R015I_04', stage: 'internship_conversion_written', round: '实习转正笔试', scenarioBucket: 'metric_tradeoff', type: '速度质量平衡', prompt: '【行业:汽车与智能驾驶｜岗位:智驾数据闭环工程师｜阶段:实习转正笔试】回流时效与数据质量冲突时你如何取舍？' }
    ],
    interviewAdds: [
      { id: 'IND_AUTO_INTELLIGENT_DRIVING_INTERVIEW_V161_R015I_01', stage: 'campus_early_batch_interview', round: '提前批面试', scenarioBucket: 'business_scenario', type: '异常升级沟通题', prompt: '【行业:汽车与智能驾驶｜岗位:智驾数据闭环工程师｜阶段:提前批面试】关键异常需优先回流时你如何争取资源？' },
      { id: 'IND_AUTO_INTELLIGENT_DRIVING_INTERVIEW_V161_R015I_02', stage: 'campus_main_batch_interview', round: '主批面试', scenarioBucket: 'cross_team_collaboration', type: '跨团队推进题', prompt: '【行业:汽车与智能驾驶｜岗位:智驾数据闭环工程师｜阶段:主批面试】标注与算法团队优先级冲突时你如何推进？' },
      { id: 'IND_AUTO_INTELLIGENT_DRIVING_INTERVIEW_V161_R015I_03', stage: 'campus_supplement_interview', round: '补录面试', scenarioBucket: 'failure_review', type: '误判复盘题', prompt: '【行业:汽车与智能驾驶｜岗位:智驾数据闭环工程师｜阶段:补录面试】讲一次你样本筛选误判后的纠偏过程。' },
      { id: 'IND_AUTO_INTELLIGENT_DRIVING_INTERVIEW_V161_R015I_04', stage: 'internship_conversion_interview', round: '实习转正面试', scenarioBucket: 'metric_tradeoff', type: '优先级决策题', prompt: '【行业:汽车与智能驾驶｜岗位:智驾数据闭环工程师｜阶段:实习转正面试】多链路问题并发时你如何排优先级？' }
    ]
  },
  {
    file: 'data/entries/IND_BIOMED_DEVICE.json',
    roleId: 'IND_BIOMED_DEVICE_ROLE_015',
    roleName: '临床数据管理岗',
    rolePatch: {
      role_readiness_floor: '至少完成1个临床数据管理闭环：数据核查、query清理、锁库支持与质量复盘。',
      day_in_life: '临床数据管理岗工作周：核对CRF数据、发起并跟进query、执行一致性检查、支持中期分析和锁库准备。',
      growth_path_1to3_year: '0-1年掌握临床数据流程和标准；1-3年独立负责试验数据质量；3-5年可主导多中心数据管理策略。',
      transfer_path_hint: '可转生物统计、临床运营、药物警戒；需补统计建模和项目管理能力，过渡6-10个月。',
      prep_90d_plan: [
        '1-30天：梳理关键变量与常见数据偏差类型。',
        '31-60天：完成1个query高压清理案例。',
        '61-90天：完成10套临床数据题训练，强化时效与质量平衡。'
      ],
      career_outlook_3to5_year: '临床试验数字化推进，数据管理岗位保持稳定需求，能力重心向自动质检与跨团队协同。',
      typical_work_week: '锁库前任务密度高，中心协调与数据核查并行。',
      switch_directions: [
        { target_role: '生物统计师', switch_cost: '中高', bridge_skills: ['统计分析', 'SAS/R'], transition_period: '7-10个月' },
        { target_role: '临床运营', switch_cost: '中', bridge_skills: ['中心管理', '流程推进'], transition_period: '6-9个月' },
        { target_role: '药物警戒', switch_cost: '中', bridge_skills: ['安全数据', '信号评估'], transition_period: '6-9个月' }
      ],
      prepare_180d_plan: [
        '91-120天：建立高风险字段质量监控规则。',
        '121-150天：主导1次锁库前专项复盘。',
        '151-180天：沉淀query分层管理与时效标准。'
      ],
      role_scope_text: '负责临床数据质量管理与锁库支持，对数据完整性、准确性和交付时效负责。'
    },
    commonDeductionPoints: [
      '只讲清理动作，不讲质量判定标准。',
      'query优先级划分不清。',
      '锁库准备缺少风险清单。',
      '跨中心沟通机制不完整。'
    ],
    starTemplate: {
      situation: '锁库前关键变量缺失率升高且query积压。',
      task: '在锁库节点前完成高风险字段清理并确保质量达标。',
      action: [
        '按变量重要性和中心表现分层清理query。',
        '联动CRA和中心快速补录与复核。',
        '输出锁库风险清单并闭环追踪。'
      ],
      result: [
        '按期锁库且关键指标质量达标。',
        '形成高压阶段的数据治理机制。'
      ],
      proof_materials: ['query看板', '锁库前核查表', '风险追踪记录']
    },
    writtenAdds: [
      { id: 'IND_BIOMED_DEVICE_WRITTEN_V161_R015I_01', stage: 'campus_early_batch_written', round: '提前批笔试', scenarioBucket: 'business_scenario', type: 'query积压处置题', prompt: '【行业:生物医药与器械｜岗位:临床数据管理岗｜阶段:提前批笔试】锁库前query积压时你如何快速清理？' },
      { id: 'IND_BIOMED_DEVICE_WRITTEN_V161_R015I_02', stage: 'campus_main_batch_written', round: '主批笔试', scenarioBucket: 'system_process', type: '数据管理流程设计', prompt: '【行业:生物医药与器械｜岗位:临床数据管理岗｜阶段:主批笔试】请设计“采集-核查-清理-锁库”流程。' },
      { id: 'IND_BIOMED_DEVICE_WRITTEN_V161_R015I_03', stage: 'campus_supplement_written', round: '补录笔试', scenarioBucket: 'failure_review', type: '锁库延期复盘', prompt: '【行业:生物医药与器械｜岗位:临床数据管理岗｜阶段:补录笔试】一次锁库延期后你如何复盘并优化？' },
      { id: 'IND_BIOMED_DEVICE_WRITTEN_V161_R015I_04', stage: 'internship_conversion_written', round: '实习转正笔试', scenarioBucket: 'metric_tradeoff', type: '速度质量平衡', prompt: '【行业:生物医药与器械｜岗位:临床数据管理岗｜阶段:实习转正笔试】节点紧迫时如何兼顾时效与质量？' }
    ],
    interviewAdds: [
      { id: 'IND_BIOMED_DEVICE_INTERVIEW_V161_R015I_01', stage: 'campus_early_batch_interview', round: '提前批面试', scenarioBucket: 'business_scenario', type: '中心沟通题', prompt: '【行业:生物医药与器械｜岗位:临床数据管理岗｜阶段:提前批面试】研究中心长期延迟回query时你如何推进？' },
      { id: 'IND_BIOMED_DEVICE_INTERVIEW_V161_R015I_02', stage: 'campus_main_batch_interview', round: '主批面试', scenarioBucket: 'cross_team_collaboration', type: '医统协同题', prompt: '【行业:生物医药与器械｜岗位:临床数据管理岗｜阶段:主批面试】统计和医学口径冲突时你如何协调？' },
      { id: 'IND_BIOMED_DEVICE_INTERVIEW_V161_R015I_03', stage: 'campus_supplement_interview', round: '补录面试', scenarioBucket: 'failure_review', type: '遗漏复盘题', prompt: '【行业:生物医药与器械｜岗位:临床数据管理岗｜阶段:补录面试】讲一次关键变量遗漏后的修正过程。' },
      { id: 'IND_BIOMED_DEVICE_INTERVIEW_V161_R015I_04', stage: 'internship_conversion_interview', round: '实习转正面试', scenarioBucket: 'metric_tradeoff', type: '任务排序决策', prompt: '【行业:生物医药与器械｜岗位:临床数据管理岗｜阶段:实习转正面试】多项目并发时你如何分配清理优先级？' }
    ]
  },
  {
    file: 'data/entries/IND_ECOMMERCE_CROSSBORDER.json',
    roleId: 'IND_ECOMMERCE_CROSSBORDER_ROLE_015',
    roleName: '跨境供应链运营岗',
    rolePatch: {
      role_readiness_floor: '至少完成1个跨境供应链运营项目：需求预测、库存策略、履约优化与异常复盘。',
      day_in_life: '跨境供应链运营岗工作周：跟踪库存周转、协调仓配与物流、处理断货与滞销、优化补货策略并复盘履约指标。',
      growth_path_1to3_year: '0-1年掌握跨境履约链路和指标；1-3年独立负责品类供应链优化；3-5年可主导多区域供应链策略。',
      transfer_path_hint: '可转供应链计划经理、跨境物流策略、运营分析；需补预测建模和成本管理，过渡6-10个月。',
      prep_90d_plan: [
        '1-30天：梳理供应链关键指标与风险点。',
        '31-60天：完成1个断货与滞销并发场景优化案例。',
        '61-90天：完成10套供应链运营题训练，强化成本与时效平衡。'
      ],
      career_outlook_3to5_year: '跨境履约复杂度上升，供应链运营岗位需求持续，能力重心向数据化预测与韧性管理。',
      typical_work_week: '促销和物流波动期任务密集，跨境协同时差影响明显。',
      switch_directions: [
        { target_role: '供应链计划经理', switch_cost: '中', bridge_skills: ['需求预测', '产销协同'], transition_period: '6-9个月' },
        { target_role: '跨境物流策略', switch_cost: '中', bridge_skills: ['线路规划', '时效管理'], transition_period: '6-9个月' },
        { target_role: '运营分析', switch_cost: '低中', bridge_skills: ['数据分析', '指标体系'], transition_period: '4-6个月' }
      ],
      prepare_180d_plan: [
        '91-120天：建立高风险SKU预警机制。',
        '121-150天：主导1次大促履约复盘专项。',
        '151-180天：沉淀补货策略与异常处理手册。'
      ],
      role_scope_text: '负责跨境供应链履约运营，对库存健康、履约时效和成本效率负责。'
    },
    commonDeductionPoints: [
      '只看库存数字，不看履约链路约束。',
      '补货策略缺少预测依据。',
      '异常处理没有优先级机制。',
      '复盘无法形成可执行改进。'
    ],
    starTemplate: {
      situation: '旺季期间断货与滞销同时出现，履约体验和成本双重承压。',
      task: '在大促窗口内稳定供给并降低库存风险。',
      action: [
        '分层识别高风险SKU并重排补货优先级。',
        '联动仓配与物流调整发运策略。',
        '建立日级监控并动态调整库存结构。'
      ],
      result: [
        '断货率下降且滞销库存受控。',
        '形成旺季供应链应对机制。'
      ],
      proof_materials: ['SKU风险清单', '补货计划', '履约复盘报告']
    },
    writtenAdds: [
      { id: 'IND_ECOMMERCE_CROSSBORDER_WRITTEN_V161_R015I_01', stage: 'campus_early_batch_written', round: '提前批笔试', scenarioBucket: 'business_scenario', type: '断货滞销治理题', prompt: '【行业:电商与跨境电商｜岗位:跨境供应链运营岗｜阶段:提前批笔试】断货和滞销并发时你如何治理？' },
      { id: 'IND_ECOMMERCE_CROSSBORDER_WRITTEN_V161_R015I_02', stage: 'campus_main_batch_written', round: '主批笔试', scenarioBucket: 'system_process', type: '履约流程设计', prompt: '【行业:电商与跨境电商｜岗位:跨境供应链运营岗｜阶段:主批笔试】请设计“预测-补货-履约-复盘”流程。' },
      { id: 'IND_ECOMMERCE_CROSSBORDER_WRITTEN_V161_R015I_03', stage: 'campus_supplement_written', round: '补录笔试', scenarioBucket: 'failure_review', type: '履约失效复盘', prompt: '【行业:电商与跨境电商｜岗位:跨境供应链运营岗｜阶段:补录笔试】一次履约失效后你如何复盘并修正？' },
      { id: 'IND_ECOMMERCE_CROSSBORDER_WRITTEN_V161_R015I_04', stage: 'internship_conversion_written', round: '实习转正笔试', scenarioBucket: 'metric_tradeoff', type: '成本时效平衡', prompt: '【行业:电商与跨境电商｜岗位:跨境供应链运营岗｜阶段:实习转正笔试】物流成本和履约时效冲突时你如何取舍？' }
    ],
    interviewAdds: [
      { id: 'IND_ECOMMERCE_CROSSBORDER_INTERVIEW_V161_R015I_01', stage: 'campus_early_batch_interview', round: '提前批面试', scenarioBucket: 'business_scenario', type: '突发异常应对题', prompt: '【行业:电商与跨境电商｜岗位:跨境供应链运营岗｜阶段:提前批面试】海外仓突发拥堵时你如何应急？' },
      { id: 'IND_ECOMMERCE_CROSSBORDER_INTERVIEW_V161_R015I_02', stage: 'campus_main_batch_interview', round: '主批面试', scenarioBucket: 'cross_team_collaboration', type: '仓配协同题', prompt: '【行业:电商与跨境电商｜岗位:跨境供应链运营岗｜阶段:主批面试】采购与物流优先级冲突时你如何推进？' },
      { id: 'IND_ECOMMERCE_CROSSBORDER_INTERVIEW_V161_R015I_03', stage: 'campus_supplement_interview', round: '补录面试', scenarioBucket: 'failure_review', type: '预测误差复盘', prompt: '【行业:电商与跨境电商｜岗位:跨境供应链运营岗｜阶段:补录面试】讲一次需求预测偏差后的纠偏过程。' },
      { id: 'IND_ECOMMERCE_CROSSBORDER_INTERVIEW_V161_R015I_04', stage: 'internship_conversion_interview', round: '实习转正面试', scenarioBucket: 'metric_tradeoff', type: '资源分配决策', prompt: '【行业:电商与跨境电商｜岗位:跨境供应链运营岗｜阶段:实习转正面试】多区域履约冲突时你如何分配资源？' }
    ]
  },
  {
    file: 'data/entries/IND_ENERGY_UTILITIES.json',
    roleId: 'IND_ENERGY_UTILITIES_ROLE_015',
    roleName: '电力交易分析岗',
    rolePatch: {
      role_readiness_floor: '至少完成1个电力交易分析项目：行情研判、策略建议、风险控制和复盘优化。',
      day_in_life: '电力交易分析岗工作周：监测市场价格与负荷变化、输出交易建议、跟踪执行偏差、复盘策略有效性。',
      growth_path_1to3_year: '0-1年掌握市场规则与数据口径；1-3年独立完成策略分析；3-5年可主导交易策略框架。',
      transfer_path_hint: '可转交易执行岗、能源投资分析、调度优化岗；需补实时决策与模型能力，过渡6-10个月。',
      prep_90d_plan: [
        '1-30天：梳理电力市场交易规则和核心指标。',
        '31-60天：完成1个策略偏差复盘案例。',
        '61-90天：完成10套交易分析题训练，强化收益风险平衡表达。'
      ],
      career_outlook_3to5_year: '电力市场化深化带动交易分析岗位需求增长，能力重心向策略精细化和风险预算管理。',
      typical_work_week: '价格波动期分析频率显著增加，盘中与盘后任务并行。',
      switch_directions: [
        { target_role: '交易执行岗', switch_cost: '中', bridge_skills: ['执行纪律', '盘面判断'], transition_period: '6-9个月' },
        { target_role: '能源投资分析', switch_cost: '中高', bridge_skills: ['投资建模', '项目评估'], transition_period: '7-10个月' },
        { target_role: '调度优化岗', switch_cost: '中高', bridge_skills: ['调度策略', '系统约束'], transition_period: '7-10个月' }
      ],
      prepare_180d_plan: [
        '91-120天：建立策略风险阈值与预警机制。',
        '121-150天：主导1次极端行情复盘专项。',
        '151-180天：沉淀交易分析报告模板与策略库。'
      ],
      role_scope_text: '负责电力市场交易分析与策略支持，对收益稳定性、风险暴露和策略复盘质量负责。'
    },
    commonDeductionPoints: [
      '只描述行情，不给可执行策略。',
      '策略假设缺少边界条件。',
      '风险控制指标不完整。',
      '复盘无法沉淀规则。'
    ],
    starTemplate: {
      situation: '市场波动加剧导致既有交易策略收益下滑。',
      task: '快速定位策略失效点并提出修正方案。',
      action: [
        '拆解收益来源与回撤贡献。',
        '调整策略参数并设置风险阈值。',
        '联动执行团队验证并迭代方案。'
      ],
      result: [
        '策略表现恢复且回撤受控。',
        '形成高波动期策略调整模板。'
      ],
      proof_materials: ['收益归因报告', '风险看板', '策略调整记录']
    },
    writtenAdds: [
      { id: 'IND_ENERGY_UTILITIES_WRITTEN_V161_R015I_01', stage: 'campus_early_batch_written', round: '提前批笔试', scenarioBucket: 'business_scenario', type: '策略失效修复题', prompt: '【行业:能源与公用事业｜岗位:电力交易分析岗｜阶段:提前批笔试】策略收益下滑时你如何快速修复？' },
      { id: 'IND_ENERGY_UTILITIES_WRITTEN_V161_R015I_02', stage: 'campus_main_batch_written', round: '主批笔试', scenarioBucket: 'system_process', type: '交易分析流程设计', prompt: '【行业:能源与公用事业｜岗位:电力交易分析岗｜阶段:主批笔试】请设计“研判-建议-执行-复盘”流程。' },
      { id: 'IND_ENERGY_UTILITIES_WRITTEN_V161_R015I_03', stage: 'campus_supplement_written', round: '补录笔试', scenarioBucket: 'failure_review', type: '回撤复盘题', prompt: '【行业:能源与公用事业｜岗位:电力交易分析岗｜阶段:补录笔试】一次回撤超预期后你如何复盘并修正？' },
      { id: 'IND_ENERGY_UTILITIES_WRITTEN_V161_R015I_04', stage: 'internship_conversion_written', round: '实习转正笔试', scenarioBucket: 'metric_tradeoff', type: '收益风险平衡', prompt: '【行业:能源与公用事业｜岗位:电力交易分析岗｜阶段:实习转正笔试】收益目标和风险约束冲突时你如何取舍？' }
    ],
    interviewAdds: [
      { id: 'IND_ENERGY_UTILITIES_INTERVIEW_V161_R015I_01', stage: 'campus_early_batch_interview', round: '提前批面试', scenarioBucket: 'business_scenario', type: '行情突变应对题', prompt: '【行业:能源与公用事业｜岗位:电力交易分析岗｜阶段:提前批面试】价格突变时你如何快速给出建议？' },
      { id: 'IND_ENERGY_UTILITIES_INTERVIEW_V161_R015I_02', stage: 'campus_main_batch_interview', round: '主批面试', scenarioBucket: 'cross_team_collaboration', type: '分歧协同题', prompt: '【行业:能源与公用事业｜岗位:电力交易分析岗｜阶段:主批面试】分析建议与执行意见冲突时你如何推进？' },
      { id: 'IND_ENERGY_UTILITIES_INTERVIEW_V161_R015I_03', stage: 'campus_supplement_interview', round: '补录面试', scenarioBucket: 'failure_review', type: '判断偏差复盘', prompt: '【行业:能源与公用事业｜岗位:电力交易分析岗｜阶段:补录面试】讲一次你判断偏差后的纠偏过程。' },
      { id: 'IND_ENERGY_UTILITIES_INTERVIEW_V161_R015I_04', stage: 'internship_conversion_interview', round: '实习转正面试', scenarioBucket: 'metric_tradeoff', type: '任务优先级决策', prompt: '【行业:能源与公用事业｜岗位:电力交易分析岗｜阶段:实习转正面试】多策略并行时你如何排优先级？' }
    ]
  },
  {
    file: 'data/entries/IND_FIN_BANK.json',
    roleId: 'IND_FIN_BANK_ROLE_015',
    roleName: '交易银行产品运营岗',
    rolePatch: {
      role_readiness_floor: '至少完成1个交易银行产品运营项目：流程优化、客户上线、异常处理和指标复盘。',
      day_in_life: '交易银行产品运营岗工作周：跟踪产品使用数据、推进客户上线、处理流程异常、优化操作路径并复盘运营指标。',
      growth_path_1to3_year: '0-1年掌握交易银行产品流程；1-3年独立负责产品运营优化；3-5年可主导产品运营体系建设。',
      transfer_path_hint: '可转交易银行产品经理、对公产品经理、运营风控岗；需补产品设计与风险管理，过渡6-10个月。',
      prep_90d_plan: [
        '1-30天：梳理交易银行核心产品和关键指标。',
        '31-60天：完成1个客户上线提效案例。',
        '61-90天：完成10套产品运营题训练，强化流程优化与合规表达。'
      ],
      career_outlook_3to5_year: '企业交易数字化深化，交易银行运营岗位需求稳健，能力重心向产品化运营和客户成功。',
      typical_work_week: '月末结算和客户上线窗口期任务集中，跨团队协同频繁。',
      switch_directions: [
        { target_role: '交易银行产品经理', switch_cost: '中', bridge_skills: ['产品设计', '需求管理'], transition_period: '6-9个月' },
        { target_role: '对公产品经理', switch_cost: '中高', bridge_skills: ['行业方案', '定价策略'], transition_period: '7-10个月' },
        { target_role: '运营风控岗', switch_cost: '中', bridge_skills: ['流程控制', '风险识别'], transition_period: '6-9个月' }
      ],
      prepare_180d_plan: [
        '91-120天：建立客户上线风险清单和预警机制。',
        '121-150天：主导1次交易流程优化专项复盘。',
        '151-180天：沉淀产品运营指标体系和SOP。'
      ],
      role_scope_text: '负责交易银行产品运营与优化，对客户上线效率、流程稳定性和运营质量负责。'
    },
    commonDeductionPoints: [
      '只讲流程执行，不讲指标目标。',
      '异常处置缺少根因分析。',
      '客户上线推进无里程碑管理。',
      '优化建议缺少可执行路径。'
    ],
    starTemplate: {
      situation: '重点客户上线周期过长，影响产品渗透和收入目标。',
      task: '在合规前提下缩短上线周期并提升稳定性。',
      action: [
        '拆解上线流程并识别瓶颈节点。',
        '联动技术和合规团队优化审批与配置。',
        '建立上线跟踪看板并闭环异常问题。'
      ],
      result: [
        '上线周期缩短且客户满意度提升。',
        '形成可复制的上线提效机制。'
      ],
      proof_materials: ['上线进度表', '异常工单', '运营复盘报告']
    },
    writtenAdds: [
      { id: 'IND_FIN_BANK_WRITTEN_V161_R015I_01', stage: 'campus_early_batch_written', round: '提前批笔试', scenarioBucket: 'business_scenario', type: '上线提效题', prompt: '【行业:金融-银行｜岗位:交易银行产品运营岗｜阶段:提前批笔试】客户上线周期过长时你如何提效？' },
      { id: 'IND_FIN_BANK_WRITTEN_V161_R015I_02', stage: 'campus_main_batch_written', round: '主批笔试', scenarioBucket: 'system_process', type: '运营流程设计', prompt: '【行业:金融-银行｜岗位:交易银行产品运营岗｜阶段:主批笔试】请设计“上线-运营-监控-优化”流程。' },
      { id: 'IND_FIN_BANK_WRITTEN_V161_R015I_03', stage: 'campus_supplement_written', round: '补录笔试', scenarioBucket: 'failure_review', type: '异常复盘题', prompt: '【行业:金融-银行｜岗位:交易银行产品运营岗｜阶段:补录笔试】一次运营异常反复发生后你如何复盘？' },
      { id: 'IND_FIN_BANK_WRITTEN_V161_R015I_04', stage: 'internship_conversion_written', round: '实习转正笔试', scenarioBucket: 'metric_tradeoff', type: '效率合规平衡', prompt: '【行业:金融-银行｜岗位:交易银行产品运营岗｜阶段:实习转正笔试】上线效率和合规审查冲突时你如何取舍？' }
    ],
    interviewAdds: [
      { id: 'IND_FIN_BANK_INTERVIEW_V161_R015I_01', stage: 'campus_early_batch_interview', round: '提前批面试', scenarioBucket: 'business_scenario', type: '客户异议处理题', prompt: '【行业:金融-银行｜岗位:交易银行产品运营岗｜阶段:提前批面试】客户抱怨上线复杂时你如何沟通？' },
      { id: 'IND_FIN_BANK_INTERVIEW_V161_R015I_02', stage: 'campus_main_batch_interview', round: '主批面试', scenarioBucket: 'cross_team_collaboration', type: '多团队协同题', prompt: '【行业:金融-银行｜岗位:交易银行产品运营岗｜阶段:主批面试】业务、技术、合规目标冲突时你如何推进？' },
      { id: 'IND_FIN_BANK_INTERVIEW_V161_R015I_03', stage: 'campus_supplement_interview', round: '补录面试', scenarioBucket: 'failure_review', type: '推进失效复盘', prompt: '【行业:金融-银行｜岗位:交易银行产品运营岗｜阶段:补录面试】讲一次你推进失败后修正策略的经历。' },
      { id: 'IND_FIN_BANK_INTERVIEW_V161_R015I_04', stage: 'internship_conversion_interview', round: '实习转正面试', scenarioBucket: 'metric_tradeoff', type: '优先级决策题', prompt: '【行业:金融-银行｜岗位:交易银行产品运营岗｜阶段:实习转正面试】多客户上线并发时你如何排优先级？' }
    ]
  },
  {
    file: 'data/entries/IND_FIN_SECURITIES_FUND.json',
    roleId: 'IND_FIN_SECURITIES_FUND_ROLE_015',
    roleName: '量化研究助理岗',
    rolePatch: {
      role_readiness_floor: '至少完成1个量化研究项目：因子验证、回测评估、风险约束和策略迭代。',
      day_in_life: '量化研究助理岗工作周：清洗市场数据、构建并验证因子、回测策略表现、分析风险暴露并支持迭代。',
      growth_path_1to3_year: '0-1年掌握数据处理和回测框架；1-3年独立开展因子研究；3-5年可参与策略组合构建。',
      transfer_path_hint: '可转量化研究员、量化交易员、风险模型岗；需补算法优化和交易执行，过渡6-10个月。',
      prep_90d_plan: [
        '1-30天：梳理因子研究与回测评估框架。',
        '31-60天：完成1个因子失效诊断案例。',
        '61-90天：完成10套量化研究题训练，强化模型与风险表达。'
      ],
      career_outlook_3to5_year: '资管量化化趋势持续，量化研究岗位需求稳定上升，能力重心向策略稳健性与工程化。',
      typical_work_week: '研究迭代与数据维护并行，行情波动期策略检验频率提升。',
      switch_directions: [
        { target_role: '量化研究员', switch_cost: '中', bridge_skills: ['因子建模', '策略评估'], transition_period: '6-9个月' },
        { target_role: '量化交易员', switch_cost: '中高', bridge_skills: ['交易执行', '盘中风控'], transition_period: '7-10个月' },
        { target_role: '风险模型岗', switch_cost: '中', bridge_skills: ['风险建模', '压力测试'], transition_period: '6-9个月' }
      ],
      prepare_180d_plan: [
        '91-120天：建立因子稳健性和漂移监控机制。',
        '121-150天：主导1次策略回撤复盘专项。',
        '151-180天：沉淀研究文档规范与实验管理模板。'
      ],
      role_scope_text: '负责量化策略研究支持与回测分析，对研究质量、策略稳健性和复盘效率负责。'
    },
    commonDeductionPoints: [
      '只展示回测收益，不讲风险与稳定性。',
      '因子验证缺少样本外检验。',
      '策略假设不清导致结论不可复现。',
      '复盘无法指导下一轮实验。'
    ],
    starTemplate: {
      situation: '核心策略在新市场阶段表现衰减，回撤明显扩大。',
      task: '定位失效原因并提出可执行的研究改进方案。',
      action: [
        '拆解策略收益来源并检验因子稳定性。',
        '引入风控约束并进行样本外验证。',
        '输出迭代方案并跟踪实盘表现。'
      ],
      result: [
        '策略稳健性改善并回撤收敛。',
        '建立了标准化因子失效诊断流程。'
      ],
      proof_materials: ['回测报告', '因子分析文档', '策略迭代记录']
    },
    writtenAdds: [
      { id: 'IND_FIN_SECURITIES_FUND_WRITTEN_V161_R015I_01', stage: 'campus_early_batch_written', round: '提前批笔试', scenarioBucket: 'business_scenario', type: '因子失效诊断题', prompt: '【行业:金融-证券基金｜岗位:量化研究助理岗｜阶段:提前批笔试】因子表现衰减时你如何诊断并修正？' },
      { id: 'IND_FIN_SECURITIES_FUND_WRITTEN_V161_R015I_02', stage: 'campus_main_batch_written', round: '主批笔试', scenarioBucket: 'system_process', type: '量化研究流程设计', prompt: '【行业:金融-证券基金｜岗位:量化研究助理岗｜阶段:主批笔试】请设计“构思-验证-回测-复盘”研究流程。' },
      { id: 'IND_FIN_SECURITIES_FUND_WRITTEN_V161_R015I_03', stage: 'campus_supplement_written', round: '补录笔试', scenarioBucket: 'failure_review', type: '回测偏差复盘', prompt: '【行业:金融-证券基金｜岗位:量化研究助理岗｜阶段:补录笔试】一次回测与实盘偏差过大后你如何复盘？' },
      { id: 'IND_FIN_SECURITIES_FUND_WRITTEN_V161_R015I_04', stage: 'internship_conversion_written', round: '实习转正笔试', scenarioBucket: 'metric_tradeoff', type: '收益稳健平衡', prompt: '【行业:金融-证券基金｜岗位:量化研究助理岗｜阶段:实习转正笔试】高收益策略与稳健性冲突时你如何取舍？' }
    ],
    interviewAdds: [
      { id: 'IND_FIN_SECURITIES_FUND_INTERVIEW_V161_R015I_01', stage: 'campus_early_batch_interview', round: '提前批面试', scenarioBucket: 'business_scenario', type: '策略异常应对题', prompt: '【行业:金融-证券基金｜岗位:量化研究助理岗｜阶段:提前批面试】策略突发失效时你如何快速排查？' },
      { id: 'IND_FIN_SECURITIES_FUND_INTERVIEW_V161_R015I_02', stage: 'campus_main_batch_interview', round: '主批面试', scenarioBucket: 'cross_team_collaboration', type: '研交协同题', prompt: '【行业:金融-证券基金｜岗位:量化研究助理岗｜阶段:主批面试】研究结论和交易执行意见冲突时你如何推进？' },
      { id: 'IND_FIN_SECURITIES_FUND_INTERVIEW_V161_R015I_03', stage: 'campus_supplement_interview', round: '补录面试', scenarioBucket: 'failure_review', type: '模型误判复盘', prompt: '【行业:金融-证券基金｜岗位:量化研究助理岗｜阶段:补录面试】讲一次模型误判后的修正过程。' },
      { id: 'IND_FIN_SECURITIES_FUND_INTERVIEW_V161_R015I_04', stage: 'internship_conversion_interview', round: '实习转正面试', scenarioBucket: 'metric_tradeoff', type: '实验优先级决策', prompt: '【行业:金融-证券基金｜岗位:量化研究助理岗｜阶段:实习转正面试】多个研究课题并行时你如何排优先级？' }
    ]
  },
  {
    file: 'data/entries/IND_NEW_ENERGY.json',
    roleId: 'IND_NEW_ENERGY_ROLE_015',
    roleName: '储能系统集成工程师',
    rolePatch: {
      role_readiness_floor: '至少完成1个储能系统集成项目：方案设计、设备联调、并网测试和运行优化。',
      day_in_life: '储能系统集成工程师工作周：校核系统参数、联调PCS/BMS/EMS、处理并网问题、监控运行指标并优化策略。',
      growth_path_1to3_year: '0-1年掌握储能系统架构与测试流程；1-3年独立负责项目集成；3-5年可主导复杂场站系统方案。',
      transfer_path_hint: '可转储能产品经理、电站运维经理、电力调度优化岗；需补市场机制和项目统筹，过渡6-10个月。',
      prep_90d_plan: [
        '1-30天：梳理储能系统关键组件与接口标准。',
        '31-60天：完成1个并网联调问题闭环案例。',
        '61-90天：完成10套系统集成题训练，强化技术与交付平衡。'
      ],
      career_outlook_3to5_year: '储能装机持续增长，系统集成岗位需求快速提升，能力重心向安全可靠与收益优化。',
      typical_work_week: '现场调试和系统联动任务高密度，交付窗口期压力大。',
      switch_directions: [
        { target_role: '储能产品经理', switch_cost: '中', bridge_skills: ['产品定义', '需求管理'], transition_period: '6-9个月' },
        { target_role: '电站运维经理', switch_cost: '中', bridge_skills: ['运维体系', '故障管理'], transition_period: '6-9个月' },
        { target_role: '电力调度优化岗', switch_cost: '中高', bridge_skills: ['调度策略', '市场联动'], transition_period: '7-10个月' }
      ],
      prepare_180d_plan: [
        '91-120天：建立高风险联调故障预警清单。',
        '121-150天：主导1次系统交付复盘专项。',
        '151-180天：沉淀储能系统验收与运维交接模板。'
      ],
      role_scope_text: '负责储能系统方案集成与交付，对系统稳定性、安全性和并网性能负责。'
    },
    commonDeductionPoints: [
      '只讲设备参数，不讲系统联动逻辑。',
      '联调问题定位缺少闭环机制。',
      '安全与收益平衡考虑不足。',
      '交付文档和验收标准不完整。'
    ],
    starTemplate: {
      situation: '项目并网前联调出现多系统接口异常，影响交付节点。',
      task: '在交付窗口前完成问题闭环并保障系统稳定并网。',
      action: [
        '按接口链路定位故障并划分责任域。',
        '协调供应商与现场团队分阶段修复验证。',
        '执行整站回归测试并完善验收清单。'
      ],
      result: [
        '项目按期并网并稳定运行。',
        '形成可复用的联调故障处理流程。'
      ],
      proof_materials: ['联调问题单', '回归测试报告', '并网验收记录']
    },
    writtenAdds: [
      { id: 'IND_NEW_ENERGY_WRITTEN_V161_R015I_01', stage: 'campus_early_batch_written', round: '提前批笔试', scenarioBucket: 'business_scenario', type: '联调异常处置题', prompt: '【行业:新能源｜岗位:储能系统集成工程师｜阶段:提前批笔试】并网前联调异常时你如何快速处置？' },
      { id: 'IND_NEW_ENERGY_WRITTEN_V161_R015I_02', stage: 'campus_main_batch_written', round: '主批笔试', scenarioBucket: 'system_process', type: '系统集成流程设计', prompt: '【行业:新能源｜岗位:储能系统集成工程师｜阶段:主批笔试】请设计“方案-联调-验证-交付”集成流程。' },
      { id: 'IND_NEW_ENERGY_WRITTEN_V161_R015I_03', stage: 'campus_supplement_written', round: '补录笔试', scenarioBucket: 'failure_review', type: '交付延误复盘', prompt: '【行业:新能源｜岗位:储能系统集成工程师｜阶段:补录笔试】一次交付延误后你如何复盘并改进？' },
      { id: 'IND_NEW_ENERGY_WRITTEN_V161_R015I_04', stage: 'internship_conversion_written', round: '实习转正笔试', scenarioBucket: 'metric_tradeoff', type: '安全收益平衡', prompt: '【行业:新能源｜岗位:储能系统集成工程师｜阶段:实习转正笔试】收益目标和安全约束冲突时你如何取舍？' }
    ],
    interviewAdds: [
      { id: 'IND_NEW_ENERGY_INTERVIEW_V161_R015I_01', stage: 'campus_early_batch_interview', round: '提前批面试', scenarioBucket: 'business_scenario', type: '现场应急题', prompt: '【行业:新能源｜岗位:储能系统集成工程师｜阶段:提前批面试】现场联调突发故障时你如何组织应急？' },
      { id: 'IND_NEW_ENERGY_INTERVIEW_V161_R015I_02', stage: 'campus_main_batch_interview', round: '主批面试', scenarioBucket: 'cross_team_collaboration', type: '供应商协同题', prompt: '【行业:新能源｜岗位:储能系统集成工程师｜阶段:主批面试】多供应商接口分歧时你如何推进？' },
      { id: 'IND_NEW_ENERGY_INTERVIEW_V161_R015I_03', stage: 'campus_supplement_interview', round: '补录面试', scenarioBucket: 'failure_review', type: '问题反复复盘', prompt: '【行业:新能源｜岗位:储能系统集成工程师｜阶段:补录面试】讲一次你处理问题反复出现的整改经历。' },
      { id: 'IND_NEW_ENERGY_INTERVIEW_V161_R015I_04', stage: 'internship_conversion_interview', round: '实习转正面试', scenarioBucket: 'metric_tradeoff', type: '排期优先级决策', prompt: '【行业:新能源｜岗位:储能系统集成工程师｜阶段:实习转正面试】多项目并行交付时你如何排优先级？' }
    ]
  },
  {
    file: 'data/entries/IND_PUBLIC_INSTITUTION.json',
    roleId: 'IND_PUBLIC_INSTITUTION_ROLE_015',
    roleName: '公立医院运营管理岗',
    rolePatch: {
      role_readiness_floor: '至少完成1个医院运营优化项目：流程诊断、指标改进、资源调配和效果复盘。',
      day_in_life: '公立医院运营管理岗工作周：跟踪门急诊与住院指标、分析流程瓶颈、协调科室资源、推进改进项目并复盘服务质量。',
      growth_path_1to3_year: '0-1年掌握医院运营指标体系；1-3年独立负责运营改进专项；3-5年可主导跨科室流程优化。',
      transfer_path_hint: '可转医疗质量管理、医务管理、健康信息管理；需补医疗政策和项目管理，过渡6-10个月。',
      prep_90d_plan: [
        '1-30天：梳理医院运营核心指标与流程。',
        '31-60天：完成1个就诊流程优化案例。',
        '61-90天：完成10套医院运营题训练，强化协同和量化表达。'
      ],
      career_outlook_3to5_year: '公立医院精细化运营持续推进，运营管理岗位需求稳定，能力重心向数据驱动与流程治理。',
      typical_work_week: '高峰就诊时段和评审周期任务密集，跨科室协调频繁。',
      switch_directions: [
        { target_role: '医疗质量管理', switch_cost: '中', bridge_skills: ['质控体系', '指标评估'], transition_period: '6-9个月' },
        { target_role: '医务管理', switch_cost: '中', bridge_skills: ['制度管理', '临床协同'], transition_period: '6-9个月' },
        { target_role: '健康信息管理', switch_cost: '中', bridge_skills: ['数据治理', '信息系统'], transition_period: '6-9个月' }
      ],
      prepare_180d_plan: [
        '91-120天：建立关键运营指标预警机制。',
        '121-150天：主导1次跨科室流程优化专项复盘。',
        '151-180天：沉淀医院运营项目管理模板。'
      ],
      role_scope_text: '负责公立医院运营分析与改进推进，对服务效率、资源利用和运营质量负责。'
    },
    commonDeductionPoints: [
      '只讲问题现象，不讲流程根因。',
      '改进措施缺少量化目标。',
      '跨科室推进缺少节奏设计。',
      '复盘无法形成机制化改进。'
    ],
    starTemplate: {
      situation: '门诊高峰期等候时长超标，患者满意度下降。',
      task: '在不增加编制前提下优化流程并改善就诊体验。',
      action: [
        '拆解就诊链路并定位瓶颈环节。',
        '协调相关科室调整排班与分诊策略。',
        '建立日周指标追踪并持续优化。'
      ],
      result: [
        '等候时长下降且满意度提升。',
        '形成可复制的高峰期运营管理机制。'
      ],
      proof_materials: ['运营指标报表', '流程优化方案', '满意度跟踪结果']
    },
    writtenAdds: [
      { id: 'IND_PUBLIC_INSTITUTION_WRITTEN_V161_R015I_01', stage: 'campus_early_batch_written', round: '提前批笔试', scenarioBucket: 'business_scenario', type: '等候时长优化题', prompt: '【行业:事业单位体系｜岗位:公立医院运营管理岗｜阶段:提前批笔试】门诊等候时长超标时你如何优化？' },
      { id: 'IND_PUBLIC_INSTITUTION_WRITTEN_V161_R015I_02', stage: 'campus_main_batch_written', round: '主批笔试', scenarioBucket: 'system_process', type: '运营改进流程设计', prompt: '【行业:事业单位体系｜岗位:公立医院运营管理岗｜阶段:主批笔试】请设计“诊断-协同-执行-复盘”改进流程。' },
      { id: 'IND_PUBLIC_INSTITUTION_WRITTEN_V161_R015I_03', stage: 'campus_supplement_written', round: '补录笔试', scenarioBucket: 'failure_review', type: '项目失效复盘', prompt: '【行业:事业单位体系｜岗位:公立医院运营管理岗｜阶段:补录笔试】一次运营项目未达标后你如何复盘？' },
      { id: 'IND_PUBLIC_INSTITUTION_WRITTEN_V161_R015I_04', stage: 'internship_conversion_written', round: '实习转正笔试', scenarioBucket: 'metric_tradeoff', type: '效率公平平衡', prompt: '【行业:事业单位体系｜岗位:公立医院运营管理岗｜阶段:实习转正笔试】效率提升与服务公平冲突时你如何取舍？' }
    ],
    interviewAdds: [
      { id: 'IND_PUBLIC_INSTITUTION_INTERVIEW_V161_R015I_01', stage: 'campus_early_batch_interview', round: '提前批面试', scenarioBucket: 'business_scenario', type: '突发高峰应对题', prompt: '【行业:事业单位体系｜岗位:公立医院运营管理岗｜阶段:提前批面试】突发就诊高峰时你如何组织应对？' },
      { id: 'IND_PUBLIC_INSTITUTION_INTERVIEW_V161_R015I_02', stage: 'campus_main_batch_interview', round: '主批面试', scenarioBucket: 'cross_team_collaboration', type: '跨科室协同题', prompt: '【行业:事业单位体系｜岗位:公立医院运营管理岗｜阶段:主批面试】科室间目标冲突时你如何推进改进？' },
      { id: 'IND_PUBLIC_INSTITUTION_INTERVIEW_V161_R015I_03', stage: 'campus_supplement_interview', round: '补录面试', scenarioBucket: 'failure_review', type: '沟通失效复盘', prompt: '【行业:事业单位体系｜岗位:公立医院运营管理岗｜阶段:补录面试】讲一次你跨科室沟通失效后的纠偏经历。' },
      { id: 'IND_PUBLIC_INSTITUTION_INTERVIEW_V161_R015I_04', stage: 'internship_conversion_interview', round: '实习转正面试', scenarioBucket: 'metric_tradeoff', type: '资源优先级决策', prompt: '【行业:事业单位体系｜岗位:公立医院运营管理岗｜阶段:实习转正面试】多项运营任务并发时你如何排序？' }
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
    data_origin: 'official_jd_competency_mapping_with_manual_role_enrichment_v161_batch9',
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
  role.role_detail_v158.expansion_status = 'landed_deep_profile_v161_batch9';

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
