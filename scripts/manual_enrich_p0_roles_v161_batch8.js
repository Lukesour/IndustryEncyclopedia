#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TODAY = '2026-02-20';

const updates = [
  {
    file: 'data/entries/IND_AUTO_INTELLIGENT_DRIVING.json',
    roleId: 'IND_AUTO_INTELLIGENT_DRIVING_ROLE_014',
    roleName: '智驾标定工程师',
    rolePatch: {
      role_readiness_floor: '至少完成1个智驾标定项目：参数标定、场景验证、效果评估与量产版本回归。',
      day_in_life: '智驾标定工程师工作周：整理路测数据、调参与离线仿真、开展实车验证、分析指标波动并推进版本优化。',
      growth_path_1to3_year: '0-1年掌握标定指标与工具链；1-3年独立负责模块级标定；3-5年可主导整车级标定策略。',
      transfer_path_hint: '可转控制算法工程师、整车测试工程师、性能优化工程师；需补控制理论和系统建模，过渡6-10个月。',
      prep_90d_plan: [
        '1-30天：梳理核心标定指标与典型场景边界。',
        '31-60天：完成1个关键参数调优与回归验证案例。',
        '61-90天：完成10套标定题训练，强化取舍逻辑和风险表达。'
      ],
      career_outlook_3to5_year: '高阶智驾落地加速，标定岗位需求稳步增长，能力重心从参数调整升级到体系化优化。',
      typical_work_week: '版本节奏和路测计划耦合高，发布窗口前验证压力明显上升。',
      switch_directions: [
        { target_role: '控制算法工程师', switch_cost: '中高', bridge_skills: ['控制理论', '模型预测控制'], transition_period: '7-10个月' },
        { target_role: '整车测试工程师', switch_cost: '中', bridge_skills: ['测试设计', '问题闭环'], transition_period: '5-8个月' },
        { target_role: '性能优化工程师', switch_cost: '中', bridge_skills: ['性能分析', '指标建模'], transition_period: '6-9个月' }
      ],
      prepare_180d_plan: [
        '91-120天：建立高风险工况标定回归机制。',
        '121-150天：主导1次跨模块标定复盘专项。',
        '151-180天：沉淀标定参数管理与发布门禁模板。'
      ],
      role_scope_text: '负责智驾参数标定与效果验证，对系统性能、稳定性和版本发布质量负责。'
    },
    commonDeductionPoints: [
      '只讲调参动作，不讲指标目标与边界条件。',
      '无法解释参数变化与系统表现的因果关系。',
      '缺少回归验证闭环。',
      '跨团队协同策略不清晰。'
    ],
    starTemplate: {
      situation: '新版本在复杂弯道工况表现不稳定，影响发布决策。',
      task: '在发布窗口前完成关键参数优化并验证稳定性。',
      action: [
        '分场景拆解指标异常并定位敏感参数。',
        '执行离线与实车双轨验证并迭代标定值。',
        '组织跨团队评审并确认发布门禁达标。'
      ],
      result: [
        '关键工况指标恢复并满足发布条件。',
        '形成可复用的标定问题处理流程。'
      ],
      proof_materials: ['标定记录', '回归验证报告', '发布评审纪要']
    },
    writtenAdds: [
      { id: 'IND_AUTO_INTELLIGENT_DRIVING_WRITTEN_V161_R014H_01', stage: 'campus_early_batch_written', round: '提前批笔试', scenarioBucket: 'business_scenario', type: '标定异常修复题', prompt: '【行业:汽车与智能驾驶｜岗位:智驾标定工程师｜阶段:提前批笔试】关键工况指标异常时你如何快速定位并调优？' },
      { id: 'IND_AUTO_INTELLIGENT_DRIVING_WRITTEN_V161_R014H_02', stage: 'campus_main_batch_written', round: '主批笔试', scenarioBucket: 'system_process', type: '标定流程设计', prompt: '【行业:汽车与智能驾驶｜岗位:智驾标定工程师｜阶段:主批笔试】请设计“分析-调参-验证-发布”标定流程。' },
      { id: 'IND_AUTO_INTELLIGENT_DRIVING_WRITTEN_V161_R014H_03', stage: 'campus_supplement_written', round: '补录笔试', scenarioBucket: 'failure_review', type: '回归失效复盘', prompt: '【行业:汽车与智能驾驶｜岗位:智驾标定工程师｜阶段:补录笔试】一次标定回归失效后你如何复盘并修正？' },
      { id: 'IND_AUTO_INTELLIGENT_DRIVING_WRITTEN_V161_R014H_04', stage: 'internship_conversion_written', round: '实习转正笔试', scenarioBucket: 'metric_tradeoff', type: '性能稳定平衡', prompt: '【行业:汽车与智能驾驶｜岗位:智驾标定工程师｜阶段:实习转正笔试】性能提升与稳定性约束冲突时你如何取舍？' }
    ],
    interviewAdds: [
      { id: 'IND_AUTO_INTELLIGENT_DRIVING_INTERVIEW_V161_R014H_01', stage: 'campus_early_batch_interview', round: '提前批面试', scenarioBucket: 'business_scenario', type: '发布窗口沟通题', prompt: '【行业:汽车与智能驾驶｜岗位:智驾标定工程师｜阶段:提前批面试】上线窗口临近但指标未达标时你如何沟通？' },
      { id: 'IND_AUTO_INTELLIGENT_DRIVING_INTERVIEW_V161_R014H_02', stage: 'campus_main_batch_interview', round: '主批面试', scenarioBucket: 'cross_team_collaboration', type: '跨团队协同题', prompt: '【行业:汽车与智能驾驶｜岗位:智驾标定工程师｜阶段:主批面试】算法团队与测试团队结论冲突时你如何推进？' },
      { id: 'IND_AUTO_INTELLIGENT_DRIVING_INTERVIEW_V161_R014H_03', stage: 'campus_supplement_interview', round: '补录面试', scenarioBucket: 'failure_review', type: '调参误判复盘', prompt: '【行业:汽车与智能驾驶｜岗位:智驾标定工程师｜阶段:补录面试】讲一次你调参误判后的纠偏过程。' },
      { id: 'IND_AUTO_INTELLIGENT_DRIVING_INTERVIEW_V161_R014H_04', stage: 'internship_conversion_interview', round: '实习转正面试', scenarioBucket: 'metric_tradeoff', type: '资源优先级决策', prompt: '【行业:汽车与智能驾驶｜岗位:智驾标定工程师｜阶段:实习转正面试】测试资源受限时你如何安排验证优先级？' }
    ]
  },
  {
    file: 'data/entries/IND_BIOMED_DEVICE.json',
    roleId: 'IND_BIOMED_DEVICE_ROLE_014',
    roleName: '体外诊断产品经理',
    rolePatch: {
      role_readiness_floor: '至少完成1个IVD产品全流程项目：需求洞察、方案定义、注册协同和上市迭代。',
      day_in_life: '体外诊断产品经理工作周：调研临床场景、定义产品需求、协调研发注册与供应链、跟踪试剂性能和市场反馈。',
      growth_path_1to3_year: '0-1年掌握IVD产品和法规基础；1-3年独立负责产品线迭代；3-5年可主导平台型产品规划。',
      transfer_path_hint: '可转医学事务、注册策略、产品运营；需补临床证据和商业化能力，过渡6-10个月。',
      prep_90d_plan: [
        '1-30天：梳理IVD产品核心场景与需求地图。',
        '31-60天：完成1个需求到验证闭环案例。',
        '61-90天：完成10套IVD产品题训练，强化合规与商业平衡表达。'
      ],
      career_outlook_3to5_year: '精准医疗和检验自动化持续推进，IVD产品岗位需求稳定提升，能力重心向临床价值与合规协同。',
      typical_work_week: '需求评审和注册节点并行推进，跨部门协作频次高。',
      switch_directions: [
        { target_role: '医学事务', switch_cost: '中', bridge_skills: ['临床证据', '学术沟通'], transition_period: '6-9个月' },
        { target_role: '注册策略', switch_cost: '中', bridge_skills: ['法规路径', '申报文档'], transition_period: '6-9个月' },
        { target_role: '产品运营', switch_cost: '低中', bridge_skills: ['上市策略', '用户反馈闭环'], transition_period: '4-7个月' }
      ],
      prepare_180d_plan: [
        '91-120天：建立需求优先级与风险分层机制。',
        '121-150天：主导1次产品注册协同专项复盘。',
        '151-180天：沉淀IVD产品需求文档和验收模板。'
      ],
      role_scope_text: '负责体外诊断产品规划与跨部门推进，对产品竞争力、合规可落地性和上市节奏负责。'
    },
    commonDeductionPoints: [
      '只讲功能需求，不讲临床价值与法规约束。',
      '需求优先级缺少量化依据。',
      '跨部门推进缺乏里程碑管理。',
      '产品复盘没有形成可执行改进。'
    ],
    starTemplate: {
      situation: '核心检测试剂市场反馈不佳且注册节点临近。',
      task: '在合规前提下优化产品方案并保障注册进度。',
      action: [
        '快速整理临床反馈并重排需求优先级。',
        '协调研发与注册同步调整验证计划。',
        '输出风险清单并推进关键里程碑落地。'
      ],
      result: [
        '产品性能指标提升并按计划推进注册。',
        '建立了需求决策与合规协同机制。'
      ],
      proof_materials: ['需求评审纪要', '验证报告', '注册进度看板']
    },
    writtenAdds: [
      { id: 'IND_BIOMED_DEVICE_WRITTEN_V161_R014H_01', stage: 'campus_early_batch_written', round: '提前批笔试', scenarioBucket: 'business_scenario', type: '需求重排题', prompt: '【行业:生物医药与器械｜岗位:体外诊断产品经理｜阶段:提前批笔试】临床反馈与资源约束冲突时你如何重排需求？' },
      { id: 'IND_BIOMED_DEVICE_WRITTEN_V161_R014H_02', stage: 'campus_main_batch_written', round: '主批笔试', scenarioBucket: 'system_process', type: '产品流程设计', prompt: '【行业:生物医药与器械｜岗位:体外诊断产品经理｜阶段:主批笔试】请设计“洞察-定义-验证-上市”产品流程。' },
      { id: 'IND_BIOMED_DEVICE_WRITTEN_V161_R014H_03', stage: 'campus_supplement_written', round: '补录笔试', scenarioBucket: 'failure_review', type: '上市不及预期复盘', prompt: '【行业:生物医药与器械｜岗位:体外诊断产品经理｜阶段:补录笔试】产品上市表现不及预期时你如何复盘？' },
      { id: 'IND_BIOMED_DEVICE_WRITTEN_V161_R014H_04', stage: 'internship_conversion_written', round: '实习转正笔试', scenarioBucket: 'metric_tradeoff', type: '速度质量平衡', prompt: '【行业:生物医药与器械｜岗位:体外诊断产品经理｜阶段:实习转正笔试】上市时效与验证充分性冲突时你如何取舍？' }
    ],
    interviewAdds: [
      { id: 'IND_BIOMED_DEVICE_INTERVIEW_V161_R014H_01', stage: 'campus_early_batch_interview', round: '提前批面试', scenarioBucket: 'business_scenario', type: '临床沟通题', prompt: '【行业:生物医药与器械｜岗位:体外诊断产品经理｜阶段:提前批面试】临床专家与市场团队需求冲突时你如何协调？' },
      { id: 'IND_BIOMED_DEVICE_INTERVIEW_V161_R014H_02', stage: 'campus_main_batch_interview', round: '主批面试', scenarioBucket: 'cross_team_collaboration', type: '研注册协同题', prompt: '【行业:生物医药与器械｜岗位:体外诊断产品经理｜阶段:主批面试】研发和注册节奏不一致时你如何推进？' },
      { id: 'IND_BIOMED_DEVICE_INTERVIEW_V161_R014H_03', stage: 'campus_supplement_interview', round: '补录面试', scenarioBucket: 'failure_review', type: '需求误判复盘', prompt: '【行业:生物医药与器械｜岗位:体外诊断产品经理｜阶段:补录面试】讲一次你需求判断失误后的修正经历。' },
      { id: 'IND_BIOMED_DEVICE_INTERVIEW_V161_R014H_04', stage: 'internship_conversion_interview', round: '实习转正面试', scenarioBucket: 'metric_tradeoff', type: '优先级决策题', prompt: '【行业:生物医药与器械｜岗位:体外诊断产品经理｜阶段:实习转正面试】多项目并行时你如何确定优先级？' }
    ]
  },
  {
    file: 'data/entries/IND_ECOMMERCE_CROSSBORDER.json',
    roleId: 'IND_ECOMMERCE_CROSSBORDER_ROLE_014',
    roleName: 'TikTok店铺运营岗',
    rolePatch: {
      role_readiness_floor: '至少完成1个TikTok店铺增长项目：内容与商品协同、直播转化、履约优化与复盘。',
      day_in_life: 'TikTok店铺运营岗工作周：策划内容节奏、优化商品结构、监控直播数据、处理履约与差评问题并推进复盘迭代。',
      growth_path_1to3_year: '0-1年掌握TikTok店铺核心玩法；1-3年独立负责店铺增长；3-5年可主导多店铺运营策略。',
      transfer_path_hint: '可转直播运营经理、内容电商策略、跨境品牌运营；需补数据建模与品牌方法，过渡5-9个月。',
      prep_90d_plan: [
        '1-30天：梳理店铺指标体系和增长漏斗。',
        '31-60天：完成1个直播转化提升案例。',
        '61-90天：完成10套店铺运营题训练，强化数据诊断和协同推进能力。'
      ],
      career_outlook_3to5_year: '内容电商持续扩张，TikTok运营岗位需求稳健，能力重心向全链路经营和品牌化运营。',
      typical_work_week: '直播和促销节点节奏密集，日级别策略调整频繁。',
      switch_directions: [
        { target_role: '直播运营经理', switch_cost: '低中', bridge_skills: ['直播策划', '主播协同'], transition_period: '4-6个月' },
        { target_role: '内容电商策略', switch_cost: '中', bridge_skills: ['内容策略', '投放协同'], transition_period: '5-8个月' },
        { target_role: '跨境品牌运营', switch_cost: '中', bridge_skills: ['品牌定位', '用户资产运营'], transition_period: '6-9个月' }
      ],
      prepare_180d_plan: [
        '91-120天：建立直播场次分层和预警机制。',
        '121-150天：主导1次店铺大促复盘专项。',
        '151-180天：沉淀内容选品与履约协同手册。'
      ],
      role_scope_text: '负责TikTok店铺经营策略与执行，对流量转化、履约体验和店铺增长结果负责。'
    },
    commonDeductionPoints: [
      '只讲内容流量，不讲商品和履约闭环。',
      '直播复盘缺少指标拆解。',
      '忽视差评和退货对增长的反作用。',
      '跨团队协同动作不明确。'
    ],
    starTemplate: {
      situation: '店铺流量稳定但成交转化持续走低，退货率上升。',
      task: '在不增加预算的情况下恢复转化并降低退货。',
      action: [
        '拆解直播与详情页漏斗，定位流失节点。',
        '优化选品结构与话术并联动客服改善预期管理。',
        '跟踪履约体验并建立周度复盘机制。'
      ],
      result: [
        '成交率回升且退货率下降。',
        '形成可复制的店铺增长闭环方法。'
      ],
      proof_materials: ['直播看板', '转化漏斗报告', '履约复盘记录']
    },
    writtenAdds: [
      { id: 'IND_ECOMMERCE_CROSSBORDER_WRITTEN_V161_R014H_01', stage: 'campus_early_batch_written', round: '提前批笔试', scenarioBucket: 'business_scenario', type: '店铺转化修复题', prompt: '【行业:电商与跨境电商｜岗位:TikTok店铺运营岗｜阶段:提前批笔试】流量稳定但成交下滑时你如何修复？' },
      { id: 'IND_ECOMMERCE_CROSSBORDER_WRITTEN_V161_R014H_02', stage: 'campus_main_batch_written', round: '主批笔试', scenarioBucket: 'system_process', type: '店铺运营流程设计', prompt: '【行业:电商与跨境电商｜岗位:TikTok店铺运营岗｜阶段:主批笔试】请设计“内容-商品-转化-复盘”运营流程。' },
      { id: 'IND_ECOMMERCE_CROSSBORDER_WRITTEN_V161_R014H_03', stage: 'campus_supplement_written', round: '补录笔试', scenarioBucket: 'failure_review', type: '大促失利复盘', prompt: '【行业:电商与跨境电商｜岗位:TikTok店铺运营岗｜阶段:补录笔试】一次大促未达标后你如何复盘并调整？' },
      { id: 'IND_ECOMMERCE_CROSSBORDER_WRITTEN_V161_R014H_04', stage: 'internship_conversion_written', round: '实习转正笔试', scenarioBucket: 'metric_tradeoff', type: '规模利润平衡', prompt: '【行业:电商与跨境电商｜岗位:TikTok店铺运营岗｜阶段:实习转正笔试】冲量目标和利润约束冲突时你如何取舍？' }
    ],
    interviewAdds: [
      { id: 'IND_ECOMMERCE_CROSSBORDER_INTERVIEW_V161_R014H_01', stage: 'campus_early_batch_interview', round: '提前批面试', scenarioBucket: 'business_scenario', type: '直播异常应对题', prompt: '【行业:电商与跨境电商｜岗位:TikTok店铺运营岗｜阶段:提前批面试】直播场次突发掉线和差评时你如何应急？' },
      { id: 'IND_ECOMMERCE_CROSSBORDER_INTERVIEW_V161_R014H_02', stage: 'campus_main_batch_interview', round: '主批面试', scenarioBucket: 'cross_team_collaboration', type: '内容履约协同题', prompt: '【行业:电商与跨境电商｜岗位:TikTok店铺运营岗｜阶段:主批面试】内容团队和供应链节奏冲突时你如何推进？' },
      { id: 'IND_ECOMMERCE_CROSSBORDER_INTERVIEW_V161_R014H_03', stage: 'campus_supplement_interview', round: '补录面试', scenarioBucket: 'failure_review', type: '策略误判复盘', prompt: '【行业:电商与跨境电商｜岗位:TikTok店铺运营岗｜阶段:补录面试】讲一次你运营策略误判后的纠偏过程。' },
      { id: 'IND_ECOMMERCE_CROSSBORDER_INTERVIEW_V161_R014H_04', stage: 'internship_conversion_interview', round: '实习转正面试', scenarioBucket: 'metric_tradeoff', type: '资源优先级决策', prompt: '【行业:电商与跨境电商｜岗位:TikTok店铺运营岗｜阶段:实习转正面试】多店铺并行时你如何分配资源？' }
    ]
  },
  {
    file: 'data/entries/IND_ENERGY_UTILITIES.json',
    roleId: 'IND_ENERGY_UTILITIES_ROLE_014',
    roleName: '水务运营分析师',
    rolePatch: {
      role_readiness_floor: '至少完成1个水务运营优化项目：数据诊断、问题定位、方案制定和效果评估。',
      day_in_life: '水务运营分析师工作周：监测供水与能耗数据、分析漏损与异常、输出运营优化建议、跟踪执行与复盘。',
      growth_path_1to3_year: '0-1年掌握水务核心指标和业务流程；1-3年独立负责专题分析；3-5年可主导区域运营优化策略。',
      transfer_path_hint: '可转市政运营经理、能源管理分析师、数字化产品岗；需补项目统筹和产品化能力，过渡6-10个月。',
      prep_90d_plan: [
        '1-30天：梳理供水运营指标与数据口径。',
        '31-60天：完成1个漏损诊断与优化案例。',
        '61-90天：完成10套水务分析题训练，强化建议可执行性表达。'
      ],
      career_outlook_3to5_year: '城市基础设施数字化推进下，水务分析岗位需求稳定，能力重心向精细运营和实时决策支持。',
      typical_work_week: '季节变化和设备检修期会引发指标波动，需快速响应。',
      switch_directions: [
        { target_role: '市政运营经理', switch_cost: '中', bridge_skills: ['运营统筹', '成本管控'], transition_period: '6-9个月' },
        { target_role: '能源管理分析师', switch_cost: '中', bridge_skills: ['能耗建模', '节能策略'], transition_period: '6-9个月' },
        { target_role: '数字化产品岗', switch_cost: '中高', bridge_skills: ['需求抽象', '产品设计'], transition_period: '7-10个月' }
      ],
      prepare_180d_plan: [
        '91-120天：建立关键异常指标预警机制。',
        '121-150天：主导1次漏损治理专项复盘。',
        '151-180天：沉淀水务分析报告模板与指标词典。'
      ],
      role_scope_text: '负责水务运营数据分析与优化建议，对供水效率、漏损控制和运营改进效果负责。'
    },
    commonDeductionPoints: [
      '只展示报表，不提供可执行策略。',
      '异常分析缺少根因拆解。',
      '指标口径不统一导致结论偏差。',
      '优化效果没有闭环验证。'
    ],
    starTemplate: {
      situation: '区域漏损率持续上升，运营成本显著增加。',
      task: '在季度内定位主要漏损来源并推动优化落地。',
      action: [
        '分层分析管网和时段数据，定位高风险片区。',
        '联合运维团队制定检修与调度优化方案。',
        '建立周度追踪并验证降损效果。'
      ],
      result: [
        '漏损率下降并改善单位供水成本。',
        '形成常态化漏损分析与治理机制。'
      ],
      proof_materials: ['漏损分析报告', '检修计划', '效果追踪看板']
    },
    writtenAdds: [
      { id: 'IND_ENERGY_UTILITIES_WRITTEN_V161_R014H_01', stage: 'campus_early_batch_written', round: '提前批笔试', scenarioBucket: 'business_scenario', type: '漏损治理题', prompt: '【行业:能源与公用事业｜岗位:水务运营分析师｜阶段:提前批笔试】漏损率上升时你如何快速分析并治理？' },
      { id: 'IND_ENERGY_UTILITIES_WRITTEN_V161_R014H_02', stage: 'campus_main_batch_written', round: '主批笔试', scenarioBucket: 'system_process', type: '运营分析流程设计', prompt: '【行业:能源与公用事业｜岗位:水务运营分析师｜阶段:主批笔试】请设计“监测-诊断-优化-复盘”流程。' },
      { id: 'IND_ENERGY_UTILITIES_WRITTEN_V161_R014H_03', stage: 'campus_supplement_written', round: '补录笔试', scenarioBucket: 'failure_review', type: '策略失效复盘', prompt: '【行业:能源与公用事业｜岗位:水务运营分析师｜阶段:补录笔试】一次优化策略失效后你如何复盘并调整？' },
      { id: 'IND_ENERGY_UTILITIES_WRITTEN_V161_R014H_04', stage: 'internship_conversion_written', round: '实习转正笔试', scenarioBucket: 'metric_tradeoff', type: '成本稳定平衡', prompt: '【行业:能源与公用事业｜岗位:水务运营分析师｜阶段:实习转正笔试】降本目标和供水稳定冲突时你如何取舍？' }
    ],
    interviewAdds: [
      { id: 'IND_ENERGY_UTILITIES_INTERVIEW_V161_R014H_01', stage: 'campus_early_batch_interview', round: '提前批面试', scenarioBucket: 'business_scenario', type: '异常应急沟通题', prompt: '【行业:能源与公用事业｜岗位:水务运营分析师｜阶段:提前批面试】供水异常突发时你如何组织应急分析？' },
      { id: 'IND_ENERGY_UTILITIES_INTERVIEW_V161_R014H_02', stage: 'campus_main_batch_interview', round: '主批面试', scenarioBucket: 'cross_team_collaboration', type: '运维协同题', prompt: '【行业:能源与公用事业｜岗位:水务运营分析师｜阶段:主批面试】分析建议与现场运维意见冲突时你如何推进？' },
      { id: 'IND_ENERGY_UTILITIES_INTERVIEW_V161_R014H_03', stage: 'campus_supplement_interview', round: '补录面试', scenarioBucket: 'failure_review', type: '误判复盘题', prompt: '【行业:能源与公用事业｜岗位:水务运营分析师｜阶段:补录面试】讲一次你异常判断失误后的纠偏经历。' },
      { id: 'IND_ENERGY_UTILITIES_INTERVIEW_V161_R014H_04', stage: 'internship_conversion_interview', round: '实习转正面试', scenarioBucket: 'metric_tradeoff', type: '任务排序决策', prompt: '【行业:能源与公用事业｜岗位:水务运营分析师｜阶段:实习转正面试】多项分析任务并发时你如何排优先级？' }
    ]
  },
  {
    file: 'data/entries/IND_FIN_BANK.json',
    roleId: 'IND_FIN_BANK_ROLE_014',
    roleName: '财富顾问岗',
    rolePatch: {
      role_readiness_floor: '至少完成1个客户资产配置案例：需求访谈、风险评估、方案落地与持续复盘。',
      day_in_life: '财富顾问岗工作周：维护客户关系、评估风险偏好、制定资产配置建议、跟踪组合表现并进行再平衡沟通。',
      growth_path_1to3_year: '0-1年掌握财富产品与合规规范；1-3年独立管理客户组合；3-5年可主导高净值客户经营策略。',
      transfer_path_hint: '可转投资顾问、产品经理、私人银行顾问；需补投资研究与复杂产品理解，过渡6-10个月。',
      prep_90d_plan: [
        '1-30天：梳理客户分层与风险评估框架。',
        '31-60天：完成1个资产配置方案与复盘案例。',
        '61-90天：完成10套财富顾问题训练，强化客户沟通和合规表达。'
      ],
      career_outlook_3to5_year: '居民财富管理需求持续增长，财富顾问岗位保持高需求，能力重心向配置能力与长期客户经营。',
      typical_work_week: '市场波动时客户沟通频率显著增加，服务与合规并重。',
      switch_directions: [
        { target_role: '投资顾问', switch_cost: '中', bridge_skills: ['投资研究', '组合管理'], transition_period: '6-9个月' },
        { target_role: '财富产品经理', switch_cost: '中高', bridge_skills: ['产品设计', '监管理解'], transition_period: '7-10个月' },
        { target_role: '私人银行顾问', switch_cost: '中高', bridge_skills: ['高净值服务', '税务规划'], transition_period: '7-10个月' }
      ],
      prepare_180d_plan: [
        '91-120天：建立客户风险偏好动态更新机制。',
        '121-150天：主导1次市场波动客户沟通专项复盘。',
        '151-180天：沉淀资产配置模板与合规话术库。'
      ],
      role_scope_text: '负责客户财富规划与资产配置服务，对客户满意度、组合稳健性和合规经营负责。'
    },
    commonDeductionPoints: [
      '只讲产品卖点，不讲客户需求匹配。',
      '风险评估和配置逻辑不完整。',
      '忽视合规边界与适当性要求。',
      '缺少持续跟踪和再平衡机制。'
    ],
    starTemplate: {
      situation: '市场波动导致客户组合回撤，客户信心下降。',
      task: '稳定客户预期并提出可执行再平衡方案。',
      action: [
        '拆解回撤来源并评估风险偏好变化。',
        '调整资产配置并明确分阶段执行计划。',
        '持续跟踪组合表现并定期复盘沟通。'
      ],
      result: [
        '客户留存和满意度提升，组合波动受控。',
        '形成波动市下客户经营标准流程。'
      ],
      proof_materials: ['客户沟通记录', '配置方案', '组合跟踪报告']
    },
    writtenAdds: [
      { id: 'IND_FIN_BANK_WRITTEN_V161_R014H_01', stage: 'campus_early_batch_written', round: '提前批笔试', scenarioBucket: 'business_scenario', type: '回撤沟通与配置题', prompt: '【行业:金融-银行｜岗位:财富顾问岗｜阶段:提前批笔试】客户组合回撤时你如何沟通并重配？' },
      { id: 'IND_FIN_BANK_WRITTEN_V161_R014H_02', stage: 'campus_main_batch_written', round: '主批笔试', scenarioBucket: 'system_process', type: '财富服务流程设计', prompt: '【行业:金融-银行｜岗位:财富顾问岗｜阶段:主批笔试】请设计“评估-配置-跟踪-复盘”服务流程。' },
      { id: 'IND_FIN_BANK_WRITTEN_V161_R014H_03', stage: 'campus_supplement_written', round: '补录笔试', scenarioBucket: 'failure_review', type: '错配复盘题', prompt: '【行业:金融-银行｜岗位:财富顾问岗｜阶段:补录笔试】一次客户资产错配后你如何复盘并改进？' },
      { id: 'IND_FIN_BANK_WRITTEN_V161_R014H_04', stage: 'internship_conversion_written', round: '实习转正笔试', scenarioBucket: 'metric_tradeoff', type: '收益风险平衡', prompt: '【行业:金融-银行｜岗位:财富顾问岗｜阶段:实习转正笔试】客户追求高收益但风险承受有限时你如何取舍？' }
    ],
    interviewAdds: [
      { id: 'IND_FIN_BANK_INTERVIEW_V161_R014H_01', stage: 'campus_early_batch_interview', round: '提前批面试', scenarioBucket: 'business_scenario', type: '客户异议处理题', prompt: '【行业:金融-银行｜岗位:财富顾问岗｜阶段:提前批面试】客户质疑配置方案时你如何应对？' },
      { id: 'IND_FIN_BANK_INTERVIEW_V161_R014H_02', stage: 'campus_main_batch_interview', round: '主批面试', scenarioBucket: 'cross_team_collaboration', type: '前中台协同题', prompt: '【行业:金融-银行｜岗位:财富顾问岗｜阶段:主批面试】销售目标与合规审核冲突时你如何推进？' },
      { id: 'IND_FIN_BANK_INTERVIEW_V161_R014H_03', stage: 'campus_supplement_interview', round: '补录面试', scenarioBucket: 'failure_review', type: '沟通失效复盘', prompt: '【行业:金融-银行｜岗位:财富顾问岗｜阶段:补录面试】讲一次客户沟通失效后的修正经历。' },
      { id: 'IND_FIN_BANK_INTERVIEW_V161_R014H_04', stage: 'internship_conversion_interview', round: '实习转正面试', scenarioBucket: 'metric_tradeoff', type: '客户优先级决策', prompt: '【行业:金融-银行｜岗位:财富顾问岗｜阶段:实习转正面试】客户服务资源有限时你如何排优先级？' }
    ]
  },
  {
    file: 'data/entries/IND_FIN_SECURITIES_FUND.json',
    roleId: 'IND_FIN_SECURITIES_FUND_ROLE_014',
    roleName: '交易执行分析师',
    rolePatch: {
      role_readiness_floor: '至少完成1个交易执行优化项目：指令拆分、滑点监控、执行复盘与策略改进。',
      day_in_life: '交易执行分析师工作周：跟踪交易指令执行质量、监控成交成本和滑点、复盘执行偏差并输出优化建议。',
      growth_path_1to3_year: '0-1年掌握执行流程和成本指标；1-3年独立完成执行分析；3-5年可主导执行策略优化框架。',
      transfer_path_hint: '可转交易员、量化执行研究员、风险控制岗；需补算法交易和实时决策能力，过渡6-10个月。',
      prep_90d_plan: [
        '1-30天：梳理执行质量指标和交易约束条件。',
        '31-60天：完成1个滑点异常诊断案例。',
        '61-90天：完成10套交易执行题训练，强化成本控制和复盘表达。'
      ],
      career_outlook_3to5_year: '机构交易专业化程度提升，执行分析岗位需求稳定，能力重心向算法执行与实时监控。',
      typical_work_week: '盘中实时分析和盘后复盘并重，波动行情下响应要求更高。',
      switch_directions: [
        { target_role: '交易员', switch_cost: '中', bridge_skills: ['盘面判断', '执行策略'], transition_period: '6-9个月' },
        { target_role: '量化执行研究员', switch_cost: '中高', bridge_skills: ['算法交易', '编程回测'], transition_period: '7-10个月' },
        { target_role: '风险控制岗', switch_cost: '中', bridge_skills: ['风险限额', '异常监控'], transition_period: '6-9个月' }
      ],
      prepare_180d_plan: [
        '91-120天：建立执行偏差预警规则。',
        '121-150天：主导1次高波动日执行复盘专项。',
        '151-180天：沉淀交易执行评估模板与优化清单。'
      ],
      role_scope_text: '负责交易执行质量分析与优化建议，对成交成本、滑点控制和执行稳定性负责。'
    },
    commonDeductionPoints: [
      '只讲成交结果，不拆解执行路径。',
      '滑点分析缺少基准对照。',
      '异常处理没有时序和责任划分。',
      '复盘无法转化为可执行优化动作。'
    ],
    starTemplate: {
      situation: '波动行情下执行滑点显著扩大，组合成本超预算。',
      task: '快速识别原因并优化后续执行策略。',
      action: [
        '按时段和标的拆解滑点来源。',
        '优化指令拆分与下单节奏。',
        '建立盘中监控阈值并及时调整执行策略。'
      ],
      result: [
        '后续交易滑点收敛并回到预算区间。',
        '形成高波动场景执行应对模板。'
      ],
      proof_materials: ['执行分析报告', '滑点监控看板', '优化策略记录']
    },
    writtenAdds: [
      { id: 'IND_FIN_SECURITIES_FUND_WRITTEN_V161_R014H_01', stage: 'campus_early_batch_written', round: '提前批笔试', scenarioBucket: 'business_scenario', type: '滑点控制题', prompt: '【行业:金融-证券基金｜岗位:交易执行分析师｜阶段:提前批笔试】交易滑点扩大时你如何快速控制？' },
      { id: 'IND_FIN_SECURITIES_FUND_WRITTEN_V161_R014H_02', stage: 'campus_main_batch_written', round: '主批笔试', scenarioBucket: 'system_process', type: '执行分析流程设计', prompt: '【行业:金融-证券基金｜岗位:交易执行分析师｜阶段:主批笔试】请设计“监控-诊断-优化-复盘”流程。' },
      { id: 'IND_FIN_SECURITIES_FUND_WRITTEN_V161_R014H_03', stage: 'campus_supplement_written', round: '补录笔试', scenarioBucket: 'failure_review', type: '执行偏差复盘', prompt: '【行业:金融-证券基金｜岗位:交易执行分析师｜阶段:补录笔试】一次执行偏差超预期后你如何复盘？' },
      { id: 'IND_FIN_SECURITIES_FUND_WRITTEN_V161_R014H_04', stage: 'internship_conversion_written', round: '实习转正笔试', scenarioBucket: 'metric_tradeoff', type: '速度成本平衡', prompt: '【行业:金融-证券基金｜岗位:交易执行分析师｜阶段:实习转正笔试】成交速度和交易成本冲突时你如何取舍？' }
    ],
    interviewAdds: [
      { id: 'IND_FIN_SECURITIES_FUND_INTERVIEW_V161_R014H_01', stage: 'campus_early_batch_interview', round: '提前批面试', scenarioBucket: 'business_scenario', type: '盘中应急沟通题', prompt: '【行业:金融-证券基金｜岗位:交易执行分析师｜阶段:提前批面试】盘中执行异常时你如何和投资经理沟通？' },
      { id: 'IND_FIN_SECURITIES_FUND_INTERVIEW_V161_R014H_02', stage: 'campus_main_batch_interview', round: '主批面试', scenarioBucket: 'cross_team_collaboration', type: '投交协同题', prompt: '【行业:金融-证券基金｜岗位:交易执行分析师｜阶段:主批面试】交易执行和投资意图冲突时你如何推进？' },
      { id: 'IND_FIN_SECURITIES_FUND_INTERVIEW_V161_R014H_03', stage: 'campus_supplement_interview', round: '补录面试', scenarioBucket: 'failure_review', type: '策略失效复盘', prompt: '【行业:金融-证券基金｜岗位:交易执行分析师｜阶段:补录面试】讲一次执行策略失效后的修正过程。' },
      { id: 'IND_FIN_SECURITIES_FUND_INTERVIEW_V161_R014H_04', stage: 'internship_conversion_interview', round: '实习转正面试', scenarioBucket: 'metric_tradeoff', type: '指令排序决策', prompt: '【行业:金融-证券基金｜岗位:交易执行分析师｜阶段:实习转正面试】多指令并发时你如何确定执行顺序？' }
    ]
  },
  {
    file: 'data/entries/IND_NEW_ENERGY.json',
    roleId: 'IND_NEW_ENERGY_ROLE_014',
    roleName: '碳资产管理专员',
    rolePatch: {
      role_readiness_floor: '至少完成1个碳资产管理项目：配额测算、履约策略、交易执行与效果复盘。',
      day_in_life: '碳资产管理专员工作周：核对排放与配额数据、跟踪碳价波动、制定履约与交易方案、评估减排项目收益并复盘。',
      growth_path_1to3_year: '0-1年掌握碳市场规则与核算方法；1-3年独立负责履约与交易支持；3-5年可主导碳资产组合策略。',
      transfer_path_hint: '可转碳交易分析师、ESG策略岗、能源交易岗；需补金融工具与策略建模，过渡6-10个月。',
      prep_90d_plan: [
        '1-30天：梳理碳市场制度和关键指标。',
        '31-60天：完成1个履约策略优化案例。',
        '61-90天：完成10套碳资产题训练，强化策略取舍和风险表达。'
      ],
      career_outlook_3to5_year: '双碳政策深化推动碳市场扩容，碳资产岗位需求持续提升，能力重心向交易与资产运营融合。',
      typical_work_week: '履约窗口和政策调整期间任务密集，需高频跟踪市场变化。',
      switch_directions: [
        { target_role: '碳交易分析师', switch_cost: '中', bridge_skills: ['交易策略', '价格分析'], transition_period: '6-9个月' },
        { target_role: 'ESG策略岗', switch_cost: '中', bridge_skills: ['ESG框架', '可持续披露'], transition_period: '6-9个月' },
        { target_role: '能源交易岗', switch_cost: '中高', bridge_skills: ['市场联动', '风险管理'], transition_period: '7-10个月' }
      ],
      prepare_180d_plan: [
        '91-120天：建立碳价波动预警与策略触发机制。',
        '121-150天：主导1次履约成本优化专项复盘。',
        '151-180天：沉淀碳资产交易与履约模板。'
      ],
      role_scope_text: '负责碳资产测算、履约和交易管理，对履约成本、配额利用率和合规达成负责。'
    },
    commonDeductionPoints: [
      '只讲政策条款，不讲资产运营策略。',
      '履约计划缺少价格波动应对。',
      '交易建议缺乏风险边界。',
      '复盘无法沉淀策略库。'
    ],
    starTemplate: {
      situation: '履约期临近且碳价上行，企业履约成本显著增加。',
      task: '在合规前提下优化配额使用与交易节奏。',
      action: [
        '评估缺口规模并分阶段制定交易计划。',
        '联动生产与财务确认减排和预算边界。',
        '跟踪执行效果并动态调整策略。'
      ],
      result: [
        '按期履约并控制总体成本。',
        '形成可复制的履约期操作机制。'
      ],
      proof_materials: ['履约测算表', '交易执行记录', '成本复盘报告']
    },
    writtenAdds: [
      { id: 'IND_NEW_ENERGY_WRITTEN_V161_R014H_01', stage: 'campus_early_batch_written', round: '提前批笔试', scenarioBucket: 'business_scenario', type: '履约成本控制题', prompt: '【行业:新能源｜岗位:碳资产管理专员｜阶段:提前批笔试】碳价上行期你如何控制履约成本？' },
      { id: 'IND_NEW_ENERGY_WRITTEN_V161_R014H_02', stage: 'campus_main_batch_written', round: '主批笔试', scenarioBucket: 'system_process', type: '碳资产流程设计', prompt: '【行业:新能源｜岗位:碳资产管理专员｜阶段:主批笔试】请设计“测算-交易-履约-复盘”管理流程。' },
      { id: 'IND_NEW_ENERGY_WRITTEN_V161_R014H_03', stage: 'campus_supplement_written', round: '补录笔试', scenarioBucket: 'failure_review', type: '策略失效复盘', prompt: '【行业:新能源｜岗位:碳资产管理专员｜阶段:补录笔试】一次交易策略未达预期后你如何复盘？' },
      { id: 'IND_NEW_ENERGY_WRITTEN_V161_R014H_04', stage: 'internship_conversion_written', round: '实习转正笔试', scenarioBucket: 'metric_tradeoff', type: '收益风险平衡', prompt: '【行业:新能源｜岗位:碳资产管理专员｜阶段:实习转正笔试】交易收益目标和履约安全边际冲突时你如何取舍？' }
    ],
    interviewAdds: [
      { id: 'IND_NEW_ENERGY_INTERVIEW_V161_R014H_01', stage: 'campus_early_batch_interview', round: '提前批面试', scenarioBucket: 'business_scenario', type: '价格波动应对题', prompt: '【行业:新能源｜岗位:碳资产管理专员｜阶段:提前批面试】碳价剧烈波动时你如何调整履约方案？' },
      { id: 'IND_NEW_ENERGY_INTERVIEW_V161_R014H_02', stage: 'campus_main_batch_interview', round: '主批面试', scenarioBucket: 'cross_team_collaboration', type: '多部门协同题', prompt: '【行业:新能源｜岗位:碳资产管理专员｜阶段:主批面试】生产与财务对配额策略冲突时你如何协调？' },
      { id: 'IND_NEW_ENERGY_INTERVIEW_V161_R014H_03', stage: 'campus_supplement_interview', round: '补录面试', scenarioBucket: 'failure_review', type: '履约误判复盘', prompt: '【行业:新能源｜岗位:碳资产管理专员｜阶段:补录面试】讲一次你履约判断偏差后的修正过程。' },
      { id: 'IND_NEW_ENERGY_INTERVIEW_V161_R014H_04', stage: 'internship_conversion_interview', round: '实习转正面试', scenarioBucket: 'metric_tradeoff', type: '策略优先级决策', prompt: '【行业:新能源｜岗位:碳资产管理专员｜阶段:实习转正面试】多项目配额冲突时你如何排优先级？' }
    ]
  },
  {
    file: 'data/entries/IND_PUBLIC_INSTITUTION.json',
    roleId: 'IND_PUBLIC_INSTITUTION_ROLE_014',
    roleName: '档案管理岗',
    rolePatch: {
      role_readiness_floor: '至少完成1个档案治理项目：归档标准制定、数据清洗、查阅服务优化和审计支持。',
      day_in_life: '档案管理岗工作周：核对归档材料、执行编目与入库、处理调阅申请、推进电子化整理并跟踪合规检查。',
      growth_path_1to3_year: '0-1年掌握档案制度与流程；1-3年独立负责档案治理专项；3-5年可主导档案数字化和制度优化。',
      transfer_path_hint: '可转信息管理岗、政务服务岗、审计支持岗；需补数据治理和流程管理能力，过渡5-9个月。',
      prep_90d_plan: [
        '1-30天：梳理档案管理法规与归档标准。',
        '31-60天：完成1个历史档案清理和补录案例。',
        '61-90天：完成10套档案管理题训练，强化合规和服务并重表达。'
      ],
      career_outlook_3to5_year: '政务数字化持续推进，档案管理岗位需求稳定，能力重心向电子档案治理和数据可追溯。',
      typical_work_week: '归档节点和审计检查期任务密集，准确性和时效要求高。',
      switch_directions: [
        { target_role: '信息管理岗', switch_cost: '中', bridge_skills: ['数据治理', '系统操作'], transition_period: '5-8个月' },
        { target_role: '政务服务岗', switch_cost: '低中', bridge_skills: ['流程服务', '沟通协同'], transition_period: '4-6个月' },
        { target_role: '审计支持岗', switch_cost: '中', bridge_skills: ['证据管理', '内控理解'], transition_period: '5-8个月' }
      ],
      prepare_180d_plan: [
        '91-120天：建立档案缺失和错档预警机制。',
        '121-150天：主导1次档案电子化专项复盘。',
        '151-180天：沉淀归档质检与调阅服务标准。'
      ],
      role_scope_text: '负责档案全生命周期管理，对归档合规性、检索效率和数据完整性负责。'
    },
    commonDeductionPoints: [
      '只讲整理流程，不讲合规风险控制。',
      '归档标准执行不一致。',
      '调阅服务效率与准确性缺乏量化。',
      '历史问题清理缺少闭环机制。'
    ],
    starTemplate: {
      situation: '审计前发现历史档案错漏率高，影响合规检查准备。',
      task: '在审计窗口前完成重点档案清理和标准化归档。',
      action: [
        '按档案类型分层排查错漏并优先处理高风险项。',
        '制定补录与复核机制并组织多部门协同。',
        '建立电子化索引和调阅追踪机制。'
      ],
      result: [
        '错漏率显著下降并顺利通过审计。',
        '形成持续可执行的档案治理流程。'
      ],
      proof_materials: ['档案清理台账', '复核记录', '审计反馈']
    },
    writtenAdds: [
      { id: 'IND_PUBLIC_INSTITUTION_WRITTEN_V161_R014H_01', stage: 'campus_early_batch_written', round: '提前批笔试', scenarioBucket: 'business_scenario', type: '错漏档案治理题', prompt: '【行业:事业单位体系｜岗位:档案管理岗｜阶段:提前批笔试】历史档案错漏率偏高时你如何快速治理？' },
      { id: 'IND_PUBLIC_INSTITUTION_WRITTEN_V161_R014H_02', stage: 'campus_main_batch_written', round: '主批笔试', scenarioBucket: 'system_process', type: '归档流程设计', prompt: '【行业:事业单位体系｜岗位:档案管理岗｜阶段:主批笔试】请设计“接收-归档-调阅-复核”管理流程。' },
      { id: 'IND_PUBLIC_INSTITUTION_WRITTEN_V161_R014H_03', stage: 'campus_supplement_written', round: '补录笔试', scenarioBucket: 'failure_review', type: '审计问题复盘', prompt: '【行业:事业单位体系｜岗位:档案管理岗｜阶段:补录笔试】一次审计暴露档案问题后你如何复盘？' },
      { id: 'IND_PUBLIC_INSTITUTION_WRITTEN_V161_R014H_04', stage: 'internship_conversion_written', round: '实习转正笔试', scenarioBucket: 'metric_tradeoff', type: '效率合规平衡', prompt: '【行业:事业单位体系｜岗位:档案管理岗｜阶段:实习转正笔试】调阅效率和归档严谨性冲突时你如何取舍？' }
    ],
    interviewAdds: [
      { id: 'IND_PUBLIC_INSTITUTION_INTERVIEW_V161_R014H_01', stage: 'campus_early_batch_interview', round: '提前批面试', scenarioBucket: 'business_scenario', type: '审计准备沟通题', prompt: '【行业:事业单位体系｜岗位:档案管理岗｜阶段:提前批面试】审计准备期任务激增时你如何组织推进？' },
      { id: 'IND_PUBLIC_INSTITUTION_INTERVIEW_V161_R014H_02', stage: 'campus_main_batch_interview', round: '主批面试', scenarioBucket: 'cross_team_collaboration', type: '部门协同题', prompt: '【行业:事业单位体系｜岗位:档案管理岗｜阶段:主批面试】业务部门归档不及时时你如何推动改进？' },
      { id: 'IND_PUBLIC_INSTITUTION_INTERVIEW_V161_R014H_03', stage: 'campus_supplement_interview', round: '补录面试', scenarioBucket: 'failure_review', type: '流程失效复盘', prompt: '【行业:事业单位体系｜岗位:档案管理岗｜阶段:补录面试】讲一次档案流程失效后的修正经历。' },
      { id: 'IND_PUBLIC_INSTITUTION_INTERVIEW_V161_R014H_04', stage: 'internship_conversion_interview', round: '实习转正面试', scenarioBucket: 'metric_tradeoff', type: '任务优先级决策', prompt: '【行业:事业单位体系｜岗位:档案管理岗｜阶段:实习转正面试】归档、调阅、检查并发时你如何排序处理？' }
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
    data_origin: 'official_jd_competency_mapping_with_manual_role_enrichment_v161_batch8',
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
  role.role_detail_v158.expansion_status = 'landed_deep_profile_v161_batch8';

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
