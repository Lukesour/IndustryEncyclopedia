#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TODAY = '2026-02-20';

const updates = [
  {
    file: 'data/entries/IND_AUTO_INTELLIGENT_DRIVING.json',
    roleId: 'IND_AUTO_INTELLIGENT_DRIVING_ROLE_013',
    roleName: '智驾地图工程师',
    rolePatch: {
      role_readiness_floor: '至少完成1个高精地图闭环项目：采集处理、要素建模、版本发布和车端验证。',
      day_in_life: '智驾地图工程师工作周：处理路采数据、更新地图要素、验证变更影响、支持车端联调并跟踪线上问题。',
      growth_path_1to3_year: '0-1年掌握地图数据链路和规范；1-3年独立负责区域地图更新；3-5年可主导地图生产和发布体系。',
      transfer_path_hint: '可转定位算法工程师、数据闭环工程师、路径规划工程师；需补传感器融合和系统约束，过渡6-10个月。',
      prep_90d_plan: [
        '1-30天：梳理地图要素模型和更新流程。',
        '31-60天：完成1个地图变更影响评估案例。',
        '61-90天：完成10套地图工程题训练，强化精度和时效取舍表达。'
      ],
      career_outlook_3to5_year: '高阶智驾落地推动地图精度和更新频率要求提升，地图工程岗位需求稳定增长。',
      typical_work_week: '版本节奏与路采计划耦合明显，发布窗口期对质量门禁要求高。',
      switch_directions: [
        { target_role: '定位算法工程师', switch_cost: '中高', bridge_skills: ['SLAM', '融合定位'], transition_period: '7-10个月' },
        { target_role: '数据闭环工程师', switch_cost: '中', bridge_skills: ['数据治理', '自动化处理'], transition_period: '5-8个月' },
        { target_role: '路径规划工程师', switch_cost: '中高', bridge_skills: ['拓扑建模', '规划约束'], transition_period: '7-10个月' }
      ],
      prepare_180d_plan: [
        '91-120天：建立高风险路段地图变更回归机制。',
        '121-150天：主导1次地图发布异常专项复盘。',
        '151-180天：沉淀地图更新质量门禁和应急预案。'
      ],
      role_scope_text: '负责智驾地图数据生产与版本迭代，对地图精度、更新时效和发布稳定性负责。'
    },
    commonDeductionPoints: [
      '只讲采集流程，不讲地图质量指标。',
      '变更影响分析缺少量化依据。',
      '忽视车端验证闭环。',
      '版本发布风险评估不完整。'
    ],
    starTemplate: {
      situation: '重点城市道路改造后地图要素失准，影响车端导航与决策。',
      task: '在版本窗口前完成要素修复并保障车端稳定。',
      action: [
        '快速定位受影响路段并重建关键要素。',
        '执行车端回放验证和异常场景检查。',
        '完善发布前检查清单并组织复核。'
      ],
      result: [
        '地图精度恢复并按期发布。',
        '沉淀可复用的路改场景应对流程。'
      ],
      proof_materials: ['地图变更记录', '车端验证报告', '发布复核清单']
    },
    writtenAdds: [
      { id: 'IND_AUTO_INTELLIGENT_DRIVING_WRITTEN_V161_R013G_01', stage: 'campus_early_batch_written', round: '提前批笔试', scenarioBucket: 'business_scenario', type: '地图失准修复题', prompt: '【行业:汽车与智能驾驶｜岗位:智驾地图工程师｜阶段:提前批笔试】道路改造导致地图失准时你如何快速修复并验证？' },
      { id: 'IND_AUTO_INTELLIGENT_DRIVING_WRITTEN_V161_R013G_02', stage: 'campus_main_batch_written', round: '主批笔试', scenarioBucket: 'system_process', type: '地图更新流程设计', prompt: '【行业:汽车与智能驾驶｜岗位:智驾地图工程师｜阶段:主批笔试】请设计“采集-建模-发布-回归”地图更新流程。' },
      { id: 'IND_AUTO_INTELLIGENT_DRIVING_WRITTEN_V161_R013G_03', stage: 'campus_supplement_written', round: '补录笔试', scenarioBucket: 'failure_review', type: '发布异常复盘', prompt: '【行业:汽车与智能驾驶｜岗位:智驾地图工程师｜阶段:补录笔试】一次地图发布异常后你如何复盘并防复发？' },
      { id: 'IND_AUTO_INTELLIGENT_DRIVING_WRITTEN_V161_R013G_04', stage: 'internship_conversion_written', round: '实习转正笔试', scenarioBucket: 'metric_tradeoff', type: '精度时效取舍', prompt: '【行业:汽车与智能驾驶｜岗位:智驾地图工程师｜阶段:实习转正笔试】更新时效和地图精度冲突时你如何决策？' }
    ],
    interviewAdds: [
      { id: 'IND_AUTO_INTELLIGENT_DRIVING_INTERVIEW_V161_R013G_01', stage: 'campus_early_batch_interview', round: '提前批面试', scenarioBucket: 'business_scenario', type: '发布窗口沟通题', prompt: '【行业:汽车与智能驾驶｜岗位:智驾地图工程师｜阶段:提前批面试】上线窗口紧张但验证未完成时你如何沟通？' },
      { id: 'IND_AUTO_INTELLIGENT_DRIVING_INTERVIEW_V161_R013G_02', stage: 'campus_main_batch_interview', round: '主批面试', scenarioBucket: 'cross_team_collaboration', type: '图算协同题', prompt: '【行业:汽车与智能驾驶｜岗位:智驾地图工程师｜阶段:主批面试】地图团队和算法团队对问题归因冲突时你如何推进？' },
      { id: 'IND_AUTO_INTELLIGENT_DRIVING_INTERVIEW_V161_R013G_03', stage: 'campus_supplement_interview', round: '补录面试', scenarioBucket: 'failure_review', type: '车端异常复盘', prompt: '【行业:汽车与智能驾驶｜岗位:智驾地图工程师｜阶段:补录面试】讲一次地图变更引发车端异常后的处置经历。' },
      { id: 'IND_AUTO_INTELLIGENT_DRIVING_INTERVIEW_V161_R013G_04', stage: 'internship_conversion_interview', round: '实习转正面试', scenarioBucket: 'metric_tradeoff', type: '任务优先级决策', prompt: '【行业:汽车与智能驾驶｜岗位:智驾地图工程师｜阶段:实习转正面试】多区域并发更新时你如何排优先级？' }
    ]
  },
  {
    file: 'data/entries/IND_BIOMED_DEVICE.json',
    roleId: 'IND_BIOMED_DEVICE_ROLE_013',
    roleName: '药物临床监查专员',
    rolePatch: {
      role_readiness_floor: '至少完成1个临床监查闭环：中心访视、问题识别、CAPA跟踪与合规报告。',
      day_in_life: '药物临床监查专员工作周：执行中心访视、核对原始记录与CRF一致性、跟进偏差整改、输出监查报告并复核关键风险。',
      growth_path_1to3_year: '0-1年掌握GCP与监查流程；1-3年独立负责多中心监查；3-5年可主导风险监查策略和试验质量体系。',
      transfer_path_hint: '可转临床运营经理、数据管理、注册事务；需补项目统筹和法规策略，过渡6-10个月。',
      prep_90d_plan: [
        '1-30天：梳理GCP关键条款与常见偏差类型。',
        '31-60天：完成1个中心整改闭环案例。',
        '61-90天：完成10套临床监查题训练，强化风险沟通和证据链表达。'
      ],
      career_outlook_3to5_year: '临床试验监管精细化持续推进，CRA岗位需求稳定，能力重心向风险导向监查和效率工具化。',
      typical_work_week: '中心访视与远程跟踪并行，锁库前风险项清理强度显著升高。',
      switch_directions: [
        { target_role: '临床运营经理', switch_cost: '中', bridge_skills: ['项目管理', '中心管理'], transition_period: '6-9个月' },
        { target_role: '数据管理', switch_cost: '中', bridge_skills: ['数据一致性', 'query管理'], transition_period: '5-8个月' },
        { target_role: '注册事务', switch_cost: '中高', bridge_skills: ['法规申报', '资料整合'], transition_period: '7-10个月' }
      ],
      prepare_180d_plan: [
        '91-120天：建立偏差分级和中心风险画像机制。',
        '121-150天：主导1次高风险中心整改专项。',
        '151-180天：沉淀监查报告模板与证据清单。'
      ],
      role_scope_text: '负责临床试验中心监查与质量控制，对试验合规性、偏差整改时效和数据真实性负责。'
    },
    commonDeductionPoints: [
      '只讲访视流程，不讲风险识别逻辑。',
      '偏差整改跟踪不到位。',
      '监查报告缺少关键证据。',
      '跨团队沟通无法形成闭环。'
    ],
    starTemplate: {
      situation: '关键中心出现知情同意与原始记录一致性问题，影响试验质量。',
      task: '在监管窗口前完成风险核查和整改闭环。',
      action: [
        '开展重点源数据核查并确认影响范围。',
        '推动中心落实CAPA并设定复核节点。',
        '输出风险报告并同步项目团队调整策略。'
      ],
      result: [
        '关键风险项按期关闭并通过核查。',
        '建立中心分层监查机制。'
      ],
      proof_materials: ['监查报告', 'CAPA跟踪表', '中心沟通纪要']
    },
    writtenAdds: [
      { id: 'IND_BIOMED_DEVICE_WRITTEN_V161_R013G_01', stage: 'campus_early_batch_written', round: '提前批笔试', scenarioBucket: 'business_scenario', type: '中心风险处置题', prompt: '【行业:生物医药与器械｜岗位:药物临床监查专员｜阶段:提前批笔试】中心出现关键合规问题时你如何快速处置？' },
      { id: 'IND_BIOMED_DEVICE_WRITTEN_V161_R013G_02', stage: 'campus_main_batch_written', round: '主批笔试', scenarioBucket: 'system_process', type: '监查流程设计', prompt: '【行业:生物医药与器械｜岗位:药物临床监查专员｜阶段:主批笔试】请设计“访视-核查-整改-复核”监查流程。' },
      { id: 'IND_BIOMED_DEVICE_WRITTEN_V161_R013G_03', stage: 'campus_supplement_written', round: '补录笔试', scenarioBucket: 'failure_review', type: '整改失效复盘', prompt: '【行业:生物医药与器械｜岗位:药物临床监查专员｜阶段:补录笔试】一次整改失效后你如何复盘并修正？' },
      { id: 'IND_BIOMED_DEVICE_WRITTEN_V161_R013G_04', stage: 'internship_conversion_written', round: '实习转正笔试', scenarioBucket: 'metric_tradeoff', type: '时效质量平衡', prompt: '【行业:生物医药与器械｜岗位:药物临床监查专员｜阶段:实习转正笔试】访视密集期如何平衡覆盖范围和监查深度？' }
    ],
    interviewAdds: [
      { id: 'IND_BIOMED_DEVICE_INTERVIEW_V161_R013G_01', stage: 'campus_early_batch_interview', round: '提前批面试', scenarioBucket: 'business_scenario', type: '高风险中心沟通题', prompt: '【行业:生物医药与器械｜岗位:药物临床监查专员｜阶段:提前批面试】研究中心不配合整改时你如何推进？' },
      { id: 'IND_BIOMED_DEVICE_INTERVIEW_V161_R013G_02', stage: 'campus_main_batch_interview', round: '主批面试', scenarioBucket: 'cross_team_collaboration', type: '医统协同题', prompt: '【行业:生物医药与器械｜岗位:药物临床监查专员｜阶段:主批面试】医学和监查对偏差定性不一致时你如何协调？' },
      { id: 'IND_BIOMED_DEVICE_INTERVIEW_V161_R013G_03', stage: 'campus_supplement_interview', round: '补录面试', scenarioBucket: 'failure_review', type: '访视遗漏复盘', prompt: '【行业:生物医药与器械｜岗位:药物临床监查专员｜阶段:补录面试】讲一次你发现关键访视遗漏并纠正的经历。' },
      { id: 'IND_BIOMED_DEVICE_INTERVIEW_V161_R013G_04', stage: 'internship_conversion_interview', round: '实习转正面试', scenarioBucket: 'metric_tradeoff', type: '任务排序决策', prompt: '【行业:生物医药与器械｜岗位:药物临床监查专员｜阶段:实习转正面试】多中心并行风险管理时你如何排序？' }
    ]
  },
  {
    file: 'data/entries/IND_ECOMMERCE_CROSSBORDER.json',
    roleId: 'IND_ECOMMERCE_CROSSBORDER_ROLE_013',
    roleName: '独立站增长运营岗',
    rolePatch: {
      role_readiness_floor: '至少完成1个独立站增长项目：漏斗诊断、实验迭代、转化优化与复盘沉淀。',
      day_in_life: '独立站增长运营岗工作周：分析流量和转化漏斗、推进A/B实验、优化着陆页和支付流程、跟踪复购与留存指标。',
      growth_path_1to3_year: '0-1年掌握站点增长指标和工具；1-3年独立负责增长专项；3-5年可主导全链路增长策略。',
      transfer_path_hint: '可转增长产品经理、广告投放策略、用户运营；需补产品化方法和建模能力，过渡5-9个月。',
      prep_90d_plan: [
        '1-30天：梳理独立站转化漏斗与关键指标。',
        '31-60天：完成1个A/B实验和转化提升案例。',
        '61-90天：完成10套增长运营题训练，强化因果分析和策略优先级。'
      ],
      career_outlook_3to5_year: '跨境独立站竞争加剧，增长岗位需求稳定，核心能力转向精细化实验和全链路转化优化。',
      typical_work_week: '大促节点和流量波动期迭代频率高，需要快速验证策略有效性。',
      switch_directions: [
        { target_role: '增长产品经理', switch_cost: '中', bridge_skills: ['产品实验', '需求抽象'], transition_period: '6-9个月' },
        { target_role: '广告投放策略', switch_cost: '低中', bridge_skills: ['归因分析', '预算优化'], transition_period: '4-6个月' },
        { target_role: '用户运营', switch_cost: '低中', bridge_skills: ['分层运营', '生命周期管理'], transition_period: '4-6个月' }
      ],
      prepare_180d_plan: [
        '91-120天：建立核心漏斗指标预警机制。',
        '121-150天：主导1次大促增长复盘专项。',
        '151-180天：沉淀独立站实验框架和策略库。'
      ],
      role_scope_text: '负责独立站增长策略与转化优化，对流量效率、转化率和复购增长负责。'
    },
    commonDeductionPoints: [
      '只讲流量拉新，不讲后链路转化。',
      '实验设计缺少对照与统计口径。',
      '问题定位停留现象层。',
      '策略复盘无法指导下一轮迭代。'
    ],
    starTemplate: {
      situation: '独立站流量上升但下单转化持续下滑，广告成本承压。',
      task: '在两周内修复关键漏斗环节并提升转化效率。',
      action: [
        '拆解漏斗并定位高流失节点。',
        '设计并执行着陆页与支付流程A/B实验。',
        '联动广告与客服优化用户决策路径。'
      ],
      result: [
        '转化率和ROAS同步回升。',
        '形成可复用的增长实验打法。'
      ],
      proof_materials: ['漏斗看板', 'A/B实验报告', '增长复盘文档']
    },
    writtenAdds: [
      { id: 'IND_ECOMMERCE_CROSSBORDER_WRITTEN_V161_R013G_01', stage: 'campus_early_batch_written', round: '提前批笔试', scenarioBucket: 'business_scenario', type: '转化下滑修复题', prompt: '【行业:电商与跨境电商｜岗位:独立站增长运营岗｜阶段:提前批笔试】流量上涨但转化下滑时你如何修复？' },
      { id: 'IND_ECOMMERCE_CROSSBORDER_WRITTEN_V161_R013G_02', stage: 'campus_main_batch_written', round: '主批笔试', scenarioBucket: 'system_process', type: '增长流程设计', prompt: '【行业:电商与跨境电商｜岗位:独立站增长运营岗｜阶段:主批笔试】请设计“诊断-实验-放量-复盘”增长流程。' },
      { id: 'IND_ECOMMERCE_CROSSBORDER_WRITTEN_V161_R013G_03', stage: 'campus_supplement_written', round: '补录笔试', scenarioBucket: 'failure_review', type: '实验失效复盘', prompt: '【行业:电商与跨境电商｜岗位:独立站增长运营岗｜阶段:补录笔试】一次实验未达预期后你如何复盘并调整？' },
      { id: 'IND_ECOMMERCE_CROSSBORDER_WRITTEN_V161_R013G_04', stage: 'internship_conversion_written', round: '实习转正笔试', scenarioBucket: 'metric_tradeoff', type: '效率规模平衡', prompt: '【行业:电商与跨境电商｜岗位:独立站增长运营岗｜阶段:实习转正笔试】规模增长和利润率冲突时你如何取舍？' }
    ],
    interviewAdds: [
      { id: 'IND_ECOMMERCE_CROSSBORDER_INTERVIEW_V161_R013G_01', stage: 'campus_early_batch_interview', round: '提前批面试', scenarioBucket: 'business_scenario', type: '异常波动应对题', prompt: '【行业:电商与跨境电商｜岗位:独立站增长运营岗｜阶段:提前批面试】大促当天转化骤降时你如何应急？' },
      { id: 'IND_ECOMMERCE_CROSSBORDER_INTERVIEW_V161_R013G_02', stage: 'campus_main_batch_interview', round: '主批面试', scenarioBucket: 'cross_team_collaboration', type: '跨团队推进题', prompt: '【行业:电商与跨境电商｜岗位:独立站增长运营岗｜阶段:主批面试】产品、投放、设计目标冲突时你如何推进？' },
      { id: 'IND_ECOMMERCE_CROSSBORDER_INTERVIEW_V161_R013G_03', stage: 'campus_supplement_interview', round: '补录面试', scenarioBucket: 'failure_review', type: '归因偏差复盘', prompt: '【行业:电商与跨境电商｜岗位:独立站增长运营岗｜阶段:补录面试】讲一次你因归因偏差导致误判后的修正过程。' },
      { id: 'IND_ECOMMERCE_CROSSBORDER_INTERVIEW_V161_R013G_04', stage: 'internship_conversion_interview', round: '实习转正面试', scenarioBucket: 'metric_tradeoff', type: '资源分配决策', prompt: '【行业:电商与跨境电商｜岗位:独立站增长运营岗｜阶段:实习转正面试】预算有限时你如何分配增长资源？' }
    ]
  },
  {
    file: 'data/entries/IND_ENERGY_UTILITIES.json',
    roleId: 'IND_ENERGY_UTILITIES_ROLE_013',
    roleName: '配电自动化工程师',
    rolePatch: {
      role_readiness_floor: '至少完成1个配电自动化项目：方案设计、设备联调、故障定位和运行优化。',
      day_in_life: '配电自动化工程师工作周：核对配电网拓扑、配置自动化终端、处理告警与故障、优化控制策略并输出运行分析。',
      growth_path_1to3_year: '0-1年掌握配电自动化系统和设备；1-3年独立推进站点改造；3-5年可主导区域自动化升级。',
      transfer_path_hint: '可转调度自动化工程师、电网运维工程师、能源数字化工程师；需补系统架构与数据分析，过渡6-10个月。',
      prep_90d_plan: [
        '1-30天：梳理配电自动化架构和核心指标。',
        '31-60天：完成1个故障定位和恢复闭环案例。',
        '61-90天：完成10套配电自动化题训练，强化现场协同和风险控制。'
      ],
      career_outlook_3to5_year: '新型配电网建设提速，自动化岗位需求持续增长，能力重心向智能诊断和高可用运行。',
      typical_work_week: '改造窗口期与故障高发期任务密集，现场与后台协同强度高。',
      switch_directions: [
        { target_role: '调度自动化工程师', switch_cost: '中', bridge_skills: ['调度系统', '控制策略'], transition_period: '6-9个月' },
        { target_role: '电网运维工程师', switch_cost: '低中', bridge_skills: ['设备运维', '故障管理'], transition_period: '4-6个月' },
        { target_role: '能源数字化工程师', switch_cost: '中高', bridge_skills: ['数据平台', '算法应用'], transition_period: '7-10个月' }
      ],
      prepare_180d_plan: [
        '91-120天：建立典型故障场景快速响应机制。',
        '121-150天：主导1次配电自动化升级复盘专项。',
        '151-180天：沉淀设备联调和验收标准模板。'
      ],
      role_scope_text: '负责配电自动化系统建设与运行优化，对故障处理时效、系统稳定性和改造交付质量负责。'
    },
    commonDeductionPoints: [
      '只讲设备参数，不讲系统联动。',
      '故障处置流程缺少根因分析。',
      '改造方案未考虑运行风险。',
      '验收标准和质量判定不清。'
    ],
    starTemplate: {
      situation: '区域配电网频繁告警导致自动化控制失稳，影响供电可靠性。',
      task: '在不影响供电连续性的前提下完成排障和策略优化。',
      action: [
        '梳理告警链路并定位关键故障点。',
        '调整控制逻辑并开展分阶段联调。',
        '建立运行监控阈值和应急切换方案。'
      ],
      result: [
        '告警频次下降并提升供电稳定性。',
        '形成可复制的配电自动化优化流程。'
      ],
      proof_materials: ['告警分析报告', '联调记录', '运行稳定性报表']
    },
    writtenAdds: [
      { id: 'IND_ENERGY_UTILITIES_WRITTEN_V161_R013G_01', stage: 'campus_early_batch_written', round: '提前批笔试', scenarioBucket: 'business_scenario', type: '告警失稳处置题', prompt: '【行业:能源与公用事业｜岗位:配电自动化工程师｜阶段:提前批笔试】告警频发导致系统失稳时你如何处置？' },
      { id: 'IND_ENERGY_UTILITIES_WRITTEN_V161_R013G_02', stage: 'campus_main_batch_written', round: '主批笔试', scenarioBucket: 'system_process', type: '自动化流程设计', prompt: '【行业:能源与公用事业｜岗位:配电自动化工程师｜阶段:主批笔试】请设计“监测-定位-修复-优化”自动化流程。' },
      { id: 'IND_ENERGY_UTILITIES_WRITTEN_V161_R013G_03', stage: 'campus_supplement_written', round: '补录笔试', scenarioBucket: 'failure_review', type: '联调失败复盘', prompt: '【行业:能源与公用事业｜岗位:配电自动化工程师｜阶段:补录笔试】一次联调失败后你如何复盘并改进？' },
      { id: 'IND_ENERGY_UTILITIES_WRITTEN_V161_R013G_04', stage: 'internship_conversion_written', round: '实习转正笔试', scenarioBucket: 'metric_tradeoff', type: '稳定效率平衡', prompt: '【行业:能源与公用事业｜岗位:配电自动化工程师｜阶段:实习转正笔试】改造进度与运行稳定冲突时你如何取舍？' }
    ],
    interviewAdds: [
      { id: 'IND_ENERGY_UTILITIES_INTERVIEW_V161_R013G_01', stage: 'campus_early_batch_interview', round: '提前批面试', scenarioBucket: 'business_scenario', type: '现场应急沟通题', prompt: '【行业:能源与公用事业｜岗位:配电自动化工程师｜阶段:提前批面试】现场故障扩大时你如何组织应急？' },
      { id: 'IND_ENERGY_UTILITIES_INTERVIEW_V161_R013G_02', stage: 'campus_main_batch_interview', round: '主批面试', scenarioBucket: 'cross_team_collaboration', type: '运检协同题', prompt: '【行业:能源与公用事业｜岗位:配电自动化工程师｜阶段:主批面试】运维和调度对处置策略冲突时你如何推进？' },
      { id: 'IND_ENERGY_UTILITIES_INTERVIEW_V161_R013G_03', stage: 'campus_supplement_interview', round: '补录面试', scenarioBucket: 'failure_review', type: '误操作复盘题', prompt: '【行业:能源与公用事业｜岗位:配电自动化工程师｜阶段:补录面试】讲一次误操作导致告警升级后的整改经历。' },
      { id: 'IND_ENERGY_UTILITIES_INTERVIEW_V161_R013G_04', stage: 'internship_conversion_interview', round: '实习转正面试', scenarioBucket: 'metric_tradeoff', type: '排期优先级决策', prompt: '【行业:能源与公用事业｜岗位:配电自动化工程师｜阶段:实习转正面试】多站点改造并行时你如何排期？' }
    ]
  },
  {
    file: 'data/entries/IND_FIN_BANK.json',
    roleId: 'IND_FIN_BANK_ROLE_013',
    roleName: '授信审批岗',
    rolePatch: {
      role_readiness_floor: '至少完成1个授信审批案例：资料核验、风险评估、授信建议与贷后条件设置。',
      day_in_life: '授信审批岗工作周：审查财务与交易资料、评估行业风险、形成审批意见、沟通补件要求并跟踪条件落实。',
      growth_path_1to3_year: '0-1年掌握授信流程和规则；1-3年独立评审中小企业授信；3-5年可主导复杂项目风险判断。',
      transfer_path_hint: '可转风险管理经理、公司金融产品、不良资产处置；需补行业研究和组合视角，过渡6-10个月。',
      prep_90d_plan: [
        '1-30天：梳理授信审查关键指标和红线规则。',
        '31-60天：完成1个授信否决与重审案例复盘。',
        '61-90天：完成10套授信审批题训练，强化风险逻辑与结论表达。'
      ],
      career_outlook_3to5_year: '银行风险偏好精细化管理增强，授信审批岗位需求稳定，能力重点向行业穿透分析与前瞻预警。',
      typical_work_week: '审批高峰期补件沟通频繁，时效和审慎并行要求高。',
      switch_directions: [
        { target_role: '风险管理经理', switch_cost: '中', bridge_skills: ['组合风险', '预警体系'], transition_period: '6-9个月' },
        { target_role: '公司金融产品', switch_cost: '中高', bridge_skills: ['产品设计', '交易结构'], transition_period: '7-10个月' },
        { target_role: '不良资产处置', switch_cost: '中', bridge_skills: ['处置策略', '法务协同'], transition_period: '6-9个月' }
      ],
      prepare_180d_plan: [
        '91-120天：建立高风险行业授信审查清单。',
        '121-150天：主导1次审批标准一致性专项。',
        '151-180天：沉淀补件与复审流程模板。'
      ],
      role_scope_text: '负责授信项目风险审查与审批建议，对审批质量、时效和风险可控性负责。'
    },
    commonDeductionPoints: [
      '只复述财务数据，不形成风险判断。',
      '授信条件设置缺乏针对性。',
      '审批意见没有证据链支撑。',
      '忽视贷后触发条件和预警机制。'
    ],
    starTemplate: {
      situation: '重点客户授信申请规模大且行业波动加剧，审批风险上升。',
      task: '在时限内完成审慎评估并给出可执行授信方案。',
      action: [
        '拆解客户现金流与担保结构风险点。',
        '设计分层授信额度和附加约束条件。',
        '联动业务团队补强资料并复核关键假设。'
      ],
      result: [
        '审批意见通过并有效控制风险暴露。',
        '形成可复用的高波动行业审查框架。'
      ],
      proof_materials: ['审批意见书', '风险评估表', '补件复核记录']
    },
    writtenAdds: [
      { id: 'IND_FIN_BANK_WRITTEN_V161_R013G_01', stage: 'campus_early_batch_written', round: '提前批笔试', scenarioBucket: 'business_scenario', type: '高风险授信评估题', prompt: '【行业:金融-银行｜岗位:授信审批岗｜阶段:提前批笔试】行业波动加剧下你如何评估授信风险并给建议？' },
      { id: 'IND_FIN_BANK_WRITTEN_V161_R013G_02', stage: 'campus_main_batch_written', round: '主批笔试', scenarioBucket: 'system_process', type: '审批流程设计', prompt: '【行业:金融-银行｜岗位:授信审批岗｜阶段:主批笔试】请设计“受理-审查-决策-跟踪”审批流程。' },
      { id: 'IND_FIN_BANK_WRITTEN_V161_R013G_03', stage: 'campus_supplement_written', round: '补录笔试', scenarioBucket: 'failure_review', type: '误判复盘题', prompt: '【行业:金融-银行｜岗位:授信审批岗｜阶段:补录笔试】一次授信风险误判后你如何复盘并修正？' },
      { id: 'IND_FIN_BANK_WRITTEN_V161_R013G_04', stage: 'internship_conversion_written', round: '实习转正笔试', scenarioBucket: 'metric_tradeoff', type: '时效审慎平衡', prompt: '【行业:金融-银行｜岗位:授信审批岗｜阶段:实习转正笔试】审批时效压力下如何守住风险底线？' }
    ],
    interviewAdds: [
      { id: 'IND_FIN_BANK_INTERVIEW_V161_R013G_01', stage: 'campus_early_batch_interview', round: '提前批面试', scenarioBucket: 'business_scenario', type: '风险沟通题', prompt: '【行业:金融-银行｜岗位:授信审批岗｜阶段:提前批面试】业务方强推项目但风险偏高时你如何沟通？' },
      { id: 'IND_FIN_BANK_INTERVIEW_V161_R013G_02', stage: 'campus_main_batch_interview', round: '主批面试', scenarioBucket: 'cross_team_collaboration', type: '前中台协同题', prompt: '【行业:金融-银行｜岗位:授信审批岗｜阶段:主批面试】业务、风控、法务意见冲突时你如何推进决策？' },
      { id: 'IND_FIN_BANK_INTERVIEW_V161_R013G_03', stage: 'campus_supplement_interview', round: '补录面试', scenarioBucket: 'failure_review', type: '补件反复复盘', prompt: '【行业:金融-银行｜岗位:授信审批岗｜阶段:补录面试】讲一次补件反复导致延误后的优化经历。' },
      { id: 'IND_FIN_BANK_INTERVIEW_V161_R013G_04', stage: 'internship_conversion_interview', round: '实习转正面试', scenarioBucket: 'metric_tradeoff', type: '组合优先级决策', prompt: '【行业:金融-银行｜岗位:授信审批岗｜阶段:实习转正面试】多个项目并行时你如何确定审批优先级？' }
    ]
  },
  {
    file: 'data/entries/IND_FIN_SECURITIES_FUND.json',
    roleId: 'IND_FIN_SECURITIES_FUND_ROLE_013',
    roleName: '投资组合分析师',
    rolePatch: {
      role_readiness_floor: '至少完成1个组合分析项目：收益归因、风险暴露评估、再平衡建议和效果复盘。',
      day_in_life: '投资组合分析师工作周：监控组合表现、拆解收益来源、评估行业和风格暴露、输出调仓建议并跟踪执行结果。',
      growth_path_1to3_year: '0-1年掌握组合分析方法和工具；1-3年独立完成组合诊断；3-5年可参与资产配置与策略制定。',
      transfer_path_hint: '可转基金经理助理、量化研究员、风险管理岗；需补策略建模和交易执行理解，过渡6-10个月。',
      prep_90d_plan: [
        '1-30天：梳理组合收益归因和风险指标体系。',
        '31-60天：完成1个组合回撤诊断与优化案例。',
        '61-90天：完成10套组合分析题训练，强化建议可执行性表达。'
      ],
      career_outlook_3to5_year: '资产管理精细化运营加强，组合分析岗位需求稳定，能力重心向多策略融合和风险预算管理。',
      typical_work_week: '市场波动期分析频次高，盘中监控与盘后复盘并重。',
      switch_directions: [
        { target_role: '基金经理助理', switch_cost: '中', bridge_skills: ['投资决策', '交易执行'], transition_period: '6-9个月' },
        { target_role: '量化研究员', switch_cost: '中高', bridge_skills: ['因子建模', '编程回测'], transition_period: '7-10个月' },
        { target_role: '风险管理岗', switch_cost: '中', bridge_skills: ['压力测试', '风险预算'], transition_period: '6-9个月' }
      ],
      prepare_180d_plan: [
        '91-120天：建立组合风险预算和阈值预警机制。',
        '121-150天：主导1次大回撤复盘专项。',
        '151-180天：沉淀归因分析模板与调仓评估标准。'
      ],
      role_scope_text: '负责投资组合表现分析与优化建议，对收益稳定性、风险暴露和复盘质量负责。'
    },
    commonDeductionPoints: [
      '只汇报收益，不解释驱动来源。',
      '风险暴露识别不完整。',
      '调仓建议缺乏约束条件。',
      '复盘结论无法指导下一轮策略。'
    ],
    starTemplate: {
      situation: '组合在市场震荡期出现超预期回撤，客户关注度上升。',
      task: '快速定位回撤来源并提出可执行优化建议。',
      action: [
        '拆解风格和行业暴露贡献。',
        '模拟不同再平衡方案并评估约束。',
        '联动投研团队执行调仓并持续跟踪。'
      ],
      result: [
        '组合波动收敛并恢复风险预算范围。',
        '形成可复用的回撤应对分析框架。'
      ],
      proof_materials: ['归因分析报告', '风险暴露看板', '调仓执行记录']
    },
    writtenAdds: [
      { id: 'IND_FIN_SECURITIES_FUND_WRITTEN_V161_R013G_01', stage: 'campus_early_batch_written', round: '提前批笔试', scenarioBucket: 'business_scenario', type: '回撤诊断题', prompt: '【行业:金融-证券基金｜岗位:投资组合分析师｜阶段:提前批笔试】组合回撤扩大时你如何快速诊断并给建议？' },
      { id: 'IND_FIN_SECURITIES_FUND_WRITTEN_V161_R013G_02', stage: 'campus_main_batch_written', round: '主批笔试', scenarioBucket: 'system_process', type: '组合分析流程设计', prompt: '【行业:金融-证券基金｜岗位:投资组合分析师｜阶段:主批笔试】请设计“监控-归因-建议-复盘”分析流程。' },
      { id: 'IND_FIN_SECURITIES_FUND_WRITTEN_V161_R013G_03', stage: 'campus_supplement_written', round: '补录笔试', scenarioBucket: 'failure_review', type: '调仓失效复盘', prompt: '【行业:金融-证券基金｜岗位:投资组合分析师｜阶段:补录笔试】一次调仓未改善回撤后你如何复盘？' },
      { id: 'IND_FIN_SECURITIES_FUND_WRITTEN_V161_R013G_04', stage: 'internship_conversion_written', round: '实习转正笔试', scenarioBucket: 'metric_tradeoff', type: '收益风险平衡', prompt: '【行业:金融-证券基金｜岗位:投资组合分析师｜阶段:实习转正笔试】收益机会与风险预算冲突时你如何取舍？' }
    ],
    interviewAdds: [
      { id: 'IND_FIN_SECURITIES_FUND_INTERVIEW_V161_R013G_01', stage: 'campus_early_batch_interview', round: '提前批面试', scenarioBucket: 'business_scenario', type: '波动期沟通题', prompt: '【行业:金融-证券基金｜岗位:投资组合分析师｜阶段:提前批面试】市场大波动时你如何向投资经理解释组合表现？' },
      { id: 'IND_FIN_SECURITIES_FUND_INTERVIEW_V161_R013G_02', stage: 'campus_main_batch_interview', round: '主批面试', scenarioBucket: 'cross_team_collaboration', type: '投研协同题', prompt: '【行业:金融-证券基金｜岗位:投资组合分析师｜阶段:主批面试】研究观点和组合风险约束冲突时你如何推进？' },
      { id: 'IND_FIN_SECURITIES_FUND_INTERVIEW_V161_R013G_03', stage: 'campus_supplement_interview', round: '补录面试', scenarioBucket: 'failure_review', type: '归因偏差复盘', prompt: '【行业:金融-证券基金｜岗位:投资组合分析师｜阶段:补录面试】讲一次你归因判断偏差后的修正过程。' },
      { id: 'IND_FIN_SECURITIES_FUND_INTERVIEW_V161_R013G_04', stage: 'internship_conversion_interview', round: '实习转正面试', scenarioBucket: 'metric_tradeoff', type: '分析优先级决策', prompt: '【行业:金融-证券基金｜岗位:投资组合分析师｜阶段:实习转正面试】多个组合并行监控时你如何排优先级？' }
    ]
  },
  {
    file: 'data/entries/IND_NEW_ENERGY.json',
    roleId: 'IND_NEW_ENERGY_ROLE_013',
    roleName: '并网消纳工程师',
    rolePatch: {
      role_readiness_floor: '至少完成1个并网消纳项目：并网方案评估、消纳测算、问题协调和运行优化。',
      day_in_life: '并网消纳工程师工作周：核对并网条件、跟踪消纳指标、分析限电原因、协调电网与项目方并输出优化建议。',
      growth_path_1to3_year: '0-1年掌握并网规则与消纳指标；1-3年独立推进并网协调；3-5年可主导区域消纳优化方案。',
      transfer_path_hint: '可转电力交易分析、调度优化、项目开发；需补市场规则和收益模型，过渡6-10个月。',
      prep_90d_plan: [
        '1-30天：梳理并网流程与消纳评价指标。',
        '31-60天：完成1个限电场景分析与改进案例。',
        '61-90天：完成10套并网消纳题训练，强化协调与量化表达。'
      ],
      career_outlook_3to5_year: '新能源装机增长使并网消纳矛盾更突出，相关岗位需求持续提升。',
      typical_work_week: '并网节点和高峰出力期任务集中，跨主体协调频繁。',
      switch_directions: [
        { target_role: '电力交易分析', switch_cost: '中', bridge_skills: ['市场机制', '价格模型'], transition_period: '6-9个月' },
        { target_role: '调度优化', switch_cost: '中高', bridge_skills: ['调度策略', '系统约束'], transition_period: '7-10个月' },
        { target_role: '项目开发', switch_cost: '中', bridge_skills: ['前期评估', '并网报批'], transition_period: '5-8个月' }
      ],
      prepare_180d_plan: [
        '91-120天：建立并网风险清单和预警机制。',
        '121-150天：主导1次限电问题专项复盘。',
        '151-180天：沉淀并网消纳协同流程模板。'
      ],
      role_scope_text: '负责新能源项目并网与消纳优化，对并网进度、消纳效率和跨方协同结果负责。'
    },
    commonDeductionPoints: [
      '只讲并网流程，不讲消纳约束。',
      '限电原因分析停留现象层。',
      '协调动作缺乏时间表和责任分工。',
      '优化建议缺少量化目标。'
    ],
    starTemplate: {
      situation: '项目并网后消纳率低于预期，限电影响收益达成。',
      task: '在短周期内提出并落地消纳优化方案。',
      action: [
        '拆解限电时段和影响因素。',
        '联动电网与交易团队优化出力和交易策略。',
        '建立周度消纳跟踪和效果复盘机制。'
      ],
      result: [
        '消纳率提升并降低限电损失。',
        '形成可复制的并网后优化路径。'
      ],
      proof_materials: ['消纳分析报告', '协调纪要', '优化效果看板']
    },
    writtenAdds: [
      { id: 'IND_NEW_ENERGY_WRITTEN_V161_R013G_01', stage: 'campus_early_batch_written', round: '提前批笔试', scenarioBucket: 'business_scenario', type: '限电优化题', prompt: '【行业:新能源｜岗位:并网消纳工程师｜阶段:提前批笔试】并网后限电严重时你如何快速优化消纳？' },
      { id: 'IND_NEW_ENERGY_WRITTEN_V161_R013G_02', stage: 'campus_main_batch_written', round: '主批笔试', scenarioBucket: 'system_process', type: '并网消纳流程设计', prompt: '【行业:新能源｜岗位:并网消纳工程师｜阶段:主批笔试】请设计“并网评估-协调-优化-复盘”流程。' },
      { id: 'IND_NEW_ENERGY_WRITTEN_V161_R013G_03', stage: 'campus_supplement_written', round: '补录笔试', scenarioBucket: 'failure_review', type: '协同失效复盘', prompt: '【行业:新能源｜岗位:并网消纳工程师｜阶段:补录笔试】一次并网协调失效后你如何复盘并重构方案？' },
      { id: 'IND_NEW_ENERGY_WRITTEN_V161_R013G_04', stage: 'internship_conversion_written', round: '实习转正笔试', scenarioBucket: 'metric_tradeoff', type: '收益稳定平衡', prompt: '【行业:新能源｜岗位:并网消纳工程师｜阶段:实习转正笔试】收益目标和系统稳定约束冲突时你如何取舍？' }
    ],
    interviewAdds: [
      { id: 'IND_NEW_ENERGY_INTERVIEW_V161_R013G_01', stage: 'campus_early_batch_interview', round: '提前批面试', scenarioBucket: 'business_scenario', type: '多方协调沟通题', prompt: '【行业:新能源｜岗位:并网消纳工程师｜阶段:提前批面试】电网侧和项目侧意见分歧时你如何推进？' },
      { id: 'IND_NEW_ENERGY_INTERVIEW_V161_R013G_02', stage: 'campus_main_batch_interview', round: '主批面试', scenarioBucket: 'cross_team_collaboration', type: '并网交易协同题', prompt: '【行业:新能源｜岗位:并网消纳工程师｜阶段:主批面试】并网团队与交易团队策略冲突时你怎么协调？' },
      { id: 'IND_NEW_ENERGY_INTERVIEW_V161_R013G_03', stage: 'campus_supplement_interview', round: '补录面试', scenarioBucket: 'failure_review', type: '消纳下滑复盘题', prompt: '【行业:新能源｜岗位:并网消纳工程师｜阶段:补录面试】讲一次你处理消纳率持续下滑的复盘经历。' },
      { id: 'IND_NEW_ENERGY_INTERVIEW_V161_R013G_04', stage: 'internship_conversion_interview', round: '实习转正面试', scenarioBucket: 'metric_tradeoff', type: '资源优先级决策', prompt: '【行业:新能源｜岗位:并网消纳工程师｜阶段:实习转正面试】多个项目并网窗口重叠时你如何排序？' }
    ]
  },
  {
    file: 'data/entries/IND_PUBLIC_INSTITUTION.json',
    roleId: 'IND_PUBLIC_INSTITUTION_ROLE_013',
    roleName: '采购资产管理岗',
    rolePatch: {
      role_readiness_floor: '至少完成1个采购资产管理闭环：需求审核、采购执行、资产入库和盘点优化。',
      day_in_life: '采购资产管理岗工作周：汇总采购需求、核查预算合规、跟进招采流程、办理资产入账、组织盘点与报废处置。',
      growth_path_1to3_year: '0-1年掌握采购与资产管理制度；1-3年独立负责品类采购与资产台账；3-5年可主导制度优化和成本管控。',
      transfer_path_hint: '可转政府采购专员、财务资产管理、后勤保障管理；需补预算管理与招采法规，过渡5-9个月。',
      prep_90d_plan: [
        '1-30天：梳理采购与资产全流程制度要求。',
        '31-60天：完成1个采购到入账闭环案例。',
        '61-90天：完成10套采购资产题训练，强化合规与效率平衡表达。'
      ],
      career_outlook_3to5_year: '公共机构精细化管理提升，采购资产岗位需求稳定，能力重点向数字化台账和风险防控升级。',
      typical_work_week: '采购周期和盘点节点交替，跨部门对账和审计准备任务集中。',
      switch_directions: [
        { target_role: '政府采购专员', switch_cost: '中', bridge_skills: ['招采法规', '供应商管理'], transition_period: '5-8个月' },
        { target_role: '财务资产管理', switch_cost: '中', bridge_skills: ['会计处理', '预算控制'], transition_period: '5-8个月' },
        { target_role: '后勤保障管理', switch_cost: '低中', bridge_skills: ['资源统筹', '服务管理'], transition_period: '4-6个月' }
      ],
      prepare_180d_plan: [
        '91-120天：建立资产盘点差异预警机制。',
        '121-150天：主导1次采购流程合规专项复盘。',
        '151-180天：沉淀采购与资产台账标准模板。'
      ],
      role_scope_text: '负责采购执行与资产全生命周期管理，对流程合规、台账准确性和成本效率负责。'
    },
    commonDeductionPoints: [
      '只讲流程步骤，不讲合规风险点。',
      '采购需求审核缺少预算视角。',
      '资产台账更新不及时。',
      '盘点差异整改无闭环。'
    ],
    starTemplate: {
      situation: '年度盘点发现资产台账差异率偏高，审计风险增加。',
      task: '在审计前完成差异核查和流程整改。',
      action: [
        '按资产类别梳理差异来源并核对实物。',
        '完善采购入账和领用交接流程。',
        '建立月度抽盘机制并跟踪整改效果。'
      ],
      result: [
        '差异率下降并通过审计检查。',
        '形成可持续的资产管理闭环机制。'
      ],
      proof_materials: ['盘点差异表', '整改记录', '审计反馈报告']
    },
    writtenAdds: [
      { id: 'IND_PUBLIC_INSTITUTION_WRITTEN_V161_R013G_01', stage: 'campus_early_batch_written', round: '提前批笔试', scenarioBucket: 'business_scenario', type: '盘点差异处置题', prompt: '【行业:事业单位体系｜岗位:采购资产管理岗｜阶段:提前批笔试】盘点差异率偏高时你如何快速整改？' },
      { id: 'IND_PUBLIC_INSTITUTION_WRITTEN_V161_R013G_02', stage: 'campus_main_batch_written', round: '主批笔试', scenarioBucket: 'system_process', type: '采资流程设计', prompt: '【行业:事业单位体系｜岗位:采购资产管理岗｜阶段:主批笔试】请设计“需求-采购-入账-盘点”流程。' },
      { id: 'IND_PUBLIC_INSTITUTION_WRITTEN_V161_R013G_03', stage: 'campus_supplement_written', round: '补录笔试', scenarioBucket: 'failure_review', type: '合规问题复盘', prompt: '【行业:事业单位体系｜岗位:采购资产管理岗｜阶段:补录笔试】一次采购合规问题后你如何复盘并修正机制？' },
      { id: 'IND_PUBLIC_INSTITUTION_WRITTEN_V161_R013G_04', stage: 'internship_conversion_written', round: '实习转正笔试', scenarioBucket: 'metric_tradeoff', type: '效率合规平衡', prompt: '【行业:事业单位体系｜岗位:采购资产管理岗｜阶段:实习转正笔试】紧急采购场景下你如何平衡时效和合规？' }
    ],
    interviewAdds: [
      { id: 'IND_PUBLIC_INSTITUTION_INTERVIEW_V161_R013G_01', stage: 'campus_early_batch_interview', round: '提前批面试', scenarioBucket: 'business_scenario', type: '跨部门协调题', prompt: '【行业:事业单位体系｜岗位:采购资产管理岗｜阶段:提前批面试】部门临时追加采购需求时你如何协调？' },
      { id: 'IND_PUBLIC_INSTITUTION_INTERVIEW_V161_R013G_02', stage: 'campus_main_batch_interview', round: '主批面试', scenarioBucket: 'cross_team_collaboration', type: '财采协同题', prompt: '【行业:事业单位体系｜岗位:采购资产管理岗｜阶段:主批面试】财务和采购对预算口径冲突时你如何推进？' },
      { id: 'IND_PUBLIC_INSTITUTION_INTERVIEW_V161_R013G_03', stage: 'campus_supplement_interview', round: '补录面试', scenarioBucket: 'failure_review', type: '台账错漏复盘', prompt: '【行业:事业单位体系｜岗位:采购资产管理岗｜阶段:补录面试】讲一次资产台账错漏并完成整改的经历。' },
      { id: 'IND_PUBLIC_INSTITUTION_INTERVIEW_V161_R013G_04', stage: 'internship_conversion_interview', round: '实习转正面试', scenarioBucket: 'metric_tradeoff', type: '任务排序决策', prompt: '【行业:事业单位体系｜岗位:采购资产管理岗｜阶段:实习转正面试】采购、盘点、审计准备并行时你如何排优先级？' }
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
    data_origin: 'official_jd_competency_mapping_with_manual_role_enrichment_v161_batch7',
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
  role.role_detail_v158.expansion_status = 'landed_deep_profile_v161_batch7';

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
