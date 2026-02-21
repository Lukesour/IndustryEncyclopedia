#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TODAY = '2026-02-20';

const updates = [
  {
    file: 'data/entries/IND_AUTO_INTELLIGENT_DRIVING.json',
    roleId: 'IND_AUTO_INTELLIGENT_DRIVING_ROLE_016',
    roleName: '车端功能安全工程师',
    rolePatch: {
      role_readiness_floor: '至少完成1个车端功能安全闭环项目：风险分析、需求分解、验证追踪和审计应对。',
      day_in_life: '车端功能安全工程师工作周：评审系统需求、更新HARA和ASIL分级、跟踪安全验证缺陷、组织跨团队评审。',
      growth_path_1to3_year: '0-1年掌握ISO 26262和车端系统架构；1-3年独立负责模块安全闭环；3-5年可主导整车级功能安全策略。',
      transfer_path_hint: '可转系统安全架构师、车端网络安全工程师、整车验证工程师；需补威胁建模与系统工程，过渡6-10个月。',
      prep_90d_plan: [
        '1-30天：梳理车端功能安全流程与关键文档。',
        '31-60天：完成1个ASIL分级到验证闭环案例。',
        '61-90天：完成10套功能安全题训练，强化风险取舍和证据链表达。'
      ],
      career_outlook_3to5_year: '车端软硬件复杂度上升，功能安全岗位需求持续增长，能力重心向跨域协同和审计可追溯。',
      typical_work_week: '版本评审和量产前验证阶段任务密集，风险沟通频率高。',
      switch_directions: [
        { target_role: '系统安全架构师', switch_cost: '中高', bridge_skills: ['系统分解', '安全架构'], transition_period: '7-10个月' },
        { target_role: '车端网络安全工程师', switch_cost: '中', bridge_skills: ['TARA', '攻防建模'], transition_period: '6-9个月' },
        { target_role: '整车验证工程师', switch_cost: '中', bridge_skills: ['验证策略', '问题闭环'], transition_period: '5-8个月' }
      ],
      prepare_180d_plan: [
        '91-120天：建立安全缺陷分级和升级流程。',
        '121-150天：主导1次跨域安全评审专项复盘。',
        '151-180天：沉淀审计证据模板与追踪规范。'
      ],
      role_scope_text: '负责车端功能安全分析和验证闭环，对风险可控性、审计通过率和问题收敛效率负责。'
    },
    commonDeductionPoints: [
      '只背标准条款，不能落到系统设计。',
      'ASIL分级依据不完整。',
      '安全需求与验证证据链断裂。',
      '跨团队推动整改缺乏节奏。'
    ],
    starTemplate: {
      situation: '关键功能在量产前暴露高风险失效模式，影响发布节点。',
      task: '在发布窗口前完成风险降级并补齐安全证据。',
      action: [
        '重做HARA并校准ASIL分级。',
        '推动软硬件团队落实安全机制修正。',
        '执行回归验证并完善安全案例文档。'
      ],
      result: [
        '高风险项按期关闭并通过审计评审。',
        '形成可复用的安全闭环模板。'
      ],
      proof_materials: ['HARA文档', '安全需求追踪表', '验证报告']
    },
    writtenAdds: [
      { id: 'IND_AUTO_INTELLIGENT_DRIVING_WRITTEN_V161_R016J_01', stage: 'campus_early_batch_written', round: '提前批笔试', scenarioBucket: 'business_scenario', type: '风险降级处置题', prompt: '【行业:汽车与智能驾驶｜岗位:车端功能安全工程师｜阶段:提前批笔试】量产前暴露高风险失效模式时你如何快速降级风险？' },
      { id: 'IND_AUTO_INTELLIGENT_DRIVING_WRITTEN_V161_R016J_02', stage: 'campus_main_batch_written', round: '主批笔试', scenarioBucket: 'system_process', type: '安全闭环流程设计', prompt: '【行业:汽车与智能驾驶｜岗位:车端功能安全工程师｜阶段:主批笔试】请设计“HARA-需求-验证-审计”闭环流程。' },
      { id: 'IND_AUTO_INTELLIGENT_DRIVING_WRITTEN_V161_R016J_03', stage: 'campus_supplement_written', round: '补录笔试', scenarioBucket: 'failure_review', type: '审计失分复盘', prompt: '【行业:汽车与智能驾驶｜岗位:车端功能安全工程师｜阶段:补录笔试】一次审计失分后你如何复盘并修正机制？' },
      { id: 'IND_AUTO_INTELLIGENT_DRIVING_WRITTEN_V161_R016J_04', stage: 'internship_conversion_written', round: '实习转正笔试', scenarioBucket: 'metric_tradeoff', type: '安全进度平衡', prompt: '【行业:汽车与智能驾驶｜岗位:车端功能安全工程师｜阶段:实习转正笔试】进度压力下你如何守住安全底线？' }
    ],
    interviewAdds: [
      { id: 'IND_AUTO_INTELLIGENT_DRIVING_INTERVIEW_V161_R016J_01', stage: 'campus_early_batch_interview', round: '提前批面试', scenarioBucket: 'business_scenario', type: '延期决策沟通', prompt: '【行业:汽车与智能驾驶｜岗位:车端功能安全工程师｜阶段:提前批面试】为何“延期发布优于带风险上线”？你如何说服管理层？' },
      { id: 'IND_AUTO_INTELLIGENT_DRIVING_INTERVIEW_V161_R016J_02', stage: 'campus_main_batch_interview', round: '主批面试', scenarioBucket: 'cross_team_collaboration', type: '责任分歧推进', prompt: '【行业:汽车与智能驾驶｜岗位:车端功能安全工程师｜阶段:主批面试】软硬件团队对安全责任分歧时你如何推进？' },
      { id: 'IND_AUTO_INTELLIGENT_DRIVING_INTERVIEW_V161_R016J_03', stage: 'campus_supplement_interview', round: '补录面试', scenarioBucket: 'failure_review', type: '整改复盘题', prompt: '【行业:汽车与智能驾驶｜岗位:车端功能安全工程师｜阶段:补录面试】讲一次安全整改反复后你如何闭环。' },
      { id: 'IND_AUTO_INTELLIGENT_DRIVING_INTERVIEW_V161_R016J_04', stage: 'internship_conversion_interview', round: '实习转正面试', scenarioBucket: 'metric_tradeoff', type: '优先级取舍题', prompt: '【行业:汽车与智能驾驶｜岗位:车端功能安全工程师｜阶段:实习转正面试】安全、质量、进度冲突时你如何排序？' }
    ]
  },
  {
    file: 'data/entries/IND_BIOMED_DEVICE.json',
    roleId: 'IND_BIOMED_DEVICE_ROLE_016',
    roleName: '医疗器械注册专员',
    rolePatch: {
      role_readiness_floor: '至少完成1个器械注册项目：注册路径规划、资料准备、补审应对和获证跟踪。',
      day_in_life: '医疗器械注册专员工作周：梳理法规要求、组织注册资料、跟进检验与临床节点、处理补件并维护注册进度。',
      growth_path_1to3_year: '0-1年掌握器械法规和申报流程；1-3年独立负责注册项目；3-5年可主导多产品注册策略。',
      transfer_path_hint: '可转质量体系经理、产品合规经理、医学事务；需补临床与质量体系能力，过渡6-10个月。',
      prep_90d_plan: [
        '1-30天：梳理NMPA器械注册关键法规和资料框架。',
        '31-60天：完成1个补件应对案例复盘。',
        '61-90天：完成10套注册题训练，强化路径判断和风险沟通。'
      ],
      career_outlook_3to5_year: '医疗器械创新与监管并行，注册岗位需求稳定，能力重心向策略化申报和跨部门协同。',
      typical_work_week: '申报节点和补件窗口期任务密集，文档与沟通并行。',
      switch_directions: [
        { target_role: '质量体系经理', switch_cost: '中', bridge_skills: ['QMS', '审计应对'], transition_period: '6-9个月' },
        { target_role: '产品合规经理', switch_cost: '中', bridge_skills: ['合规策略', '风险评估'], transition_period: '6-9个月' },
        { target_role: '医学事务', switch_cost: '中高', bridge_skills: ['证据解读', '学术沟通'], transition_period: '7-10个月' }
      ],
      prepare_180d_plan: [
        '91-120天：建立注册资料一致性检查机制。',
        '121-150天：主导1次补件提效专项复盘。',
        '151-180天：沉淀产品注册路径与风险清单模板。'
      ],
      role_scope_text: '负责医疗器械注册策略与执行，对申报进度、资料质量和补件响应时效负责。'
    },
    commonDeductionPoints: [
      '只讲流程顺序，不讲路径选择依据。',
      '注册资料逻辑不连贯。',
      '补件风险评估不足。',
      '跨部门协同机制不明确。'
    ],
    starTemplate: {
      situation: '重点产品申报后收到高频补件，注册周期面临延长风险。',
      task: '在监管时限内完成补件并稳定项目节奏。',
      action: [
        '拆解补件问题并分层确定优先级。',
        '组织研发与临床团队快速补强证据。',
        '复核资料一致性并提交答复。'
      ],
      result: [
        '补件按期完成并保持申报节点可控。',
        '形成可复用的补件应对模板。'
      ],
      proof_materials: ['补件清单', '答复资料', '进度跟踪表']
    },
    writtenAdds: [
      { id: 'IND_BIOMED_DEVICE_WRITTEN_V161_R016J_01', stage: 'campus_early_batch_written', round: '提前批笔试', scenarioBucket: 'business_scenario', type: '补件应对策略题', prompt: '【行业:生物医药与器械｜岗位:医疗器械注册专员｜阶段:提前批笔试】高频补件场景下你如何保证申报时效？' },
      { id: 'IND_BIOMED_DEVICE_WRITTEN_V161_R016J_02', stage: 'campus_main_batch_written', round: '主批笔试', scenarioBucket: 'system_process', type: '注册流程设计题', prompt: '【行业:生物医药与器械｜岗位:医疗器械注册专员｜阶段:主批笔试】请设计“路径-资料-提交-补件”注册流程。' },
      { id: 'IND_BIOMED_DEVICE_WRITTEN_V161_R016J_03', stage: 'campus_supplement_written', round: '补录笔试', scenarioBucket: 'failure_review', type: '申报延期复盘', prompt: '【行业:生物医药与器械｜岗位:医疗器械注册专员｜阶段:补录笔试】一次申报延期后你如何复盘并避免复发？' },
      { id: 'IND_BIOMED_DEVICE_WRITTEN_V161_R016J_04', stage: 'internship_conversion_written', round: '实习转正笔试', scenarioBucket: 'metric_tradeoff', type: '速度完整平衡', prompt: '【行业:生物医药与器械｜岗位:医疗器械注册专员｜阶段:实习转正笔试】注册时效与资料完整性冲突时你如何取舍？' }
    ],
    interviewAdds: [
      { id: 'IND_BIOMED_DEVICE_INTERVIEW_V161_R016J_01', stage: 'campus_early_batch_interview', round: '提前批面试', scenarioBucket: 'business_scenario', type: '监管沟通题', prompt: '【行业:生物医药与器械｜岗位:医疗器械注册专员｜阶段:提前批面试】监管要求变化时你如何快速响应并沟通？' },
      { id: 'IND_BIOMED_DEVICE_INTERVIEW_V161_R016J_02', stage: 'campus_main_batch_interview', round: '主批面试', scenarioBucket: 'cross_team_collaboration', type: '研注协同题', prompt: '【行业:生物医药与器械｜岗位:医疗器械注册专员｜阶段:主批面试】研发与注册节点冲突时你如何推进？' },
      { id: 'IND_BIOMED_DEVICE_INTERVIEW_V161_R016J_03', stage: 'campus_supplement_interview', round: '补录面试', scenarioBucket: 'failure_review', type: '资料错漏复盘', prompt: '【行业:生物医药与器械｜岗位:医疗器械注册专员｜阶段:补录面试】讲一次你处理资料错漏并补救的经历。' },
      { id: 'IND_BIOMED_DEVICE_INTERVIEW_V161_R016J_04', stage: 'internship_conversion_interview', round: '实习转正面试', scenarioBucket: 'metric_tradeoff', type: '优先级决策题', prompt: '【行业:生物医药与器械｜岗位:医疗器械注册专员｜阶段:实习转正面试】多产品并发申报时你如何排优先级？' }
    ]
  },
  {
    file: 'data/entries/IND_ECOMMERCE_CROSSBORDER.json',
    roleId: 'IND_ECOMMERCE_CROSSBORDER_ROLE_016',
    roleName: '独立站投放优化岗',
    rolePatch: {
      role_readiness_floor: '至少完成1个独立站投放优化项目：渠道拆解、素材迭代、归因分析和ROI回升。',
      day_in_life: '独立站投放优化岗工作周：监控投放数据、调整预算和受众、推进素材实验、复盘归因链路并优化转化。',
      growth_path_1to3_year: '0-1年掌握投放平台规则与漏斗指标；1-3年独立负责投放策略；3-5年可主导多市场增长体系。',
      transfer_path_hint: '可转增长策略经理、内容营销策略、站点产品运营；需补实验设计与产品思维，过渡6-10个月。',
      prep_90d_plan: [
        '1-30天：梳理核心投放指标与归因口径。',
        '31-60天：完成1个ROI修复案例复盘。',
        '61-90天：完成10套投放优化题训练，强化预算与效率平衡。'
      ],
      career_outlook_3to5_year: '独立站竞争加剧驱动投放精细化，岗位需求稳定，能力重心向全链路归因与策略自动化。',
      typical_work_week: '促销和流量波动期节奏快，日级别策略调整频繁。',
      switch_directions: [
        { target_role: '增长策略经理', switch_cost: '中', bridge_skills: ['增长模型', '策略统筹'], transition_period: '6-9个月' },
        { target_role: '内容营销策略', switch_cost: '中', bridge_skills: ['创意策略', '内容实验'], transition_period: '6-9个月' },
        { target_role: '站点产品运营', switch_cost: '低中', bridge_skills: ['转化优化', '用户路径'], transition_period: '5-8个月' }
      ],
      prepare_180d_plan: [
        '91-120天：建立渠道异常波动预警机制。',
        '121-150天：主导1次大促投放复盘专项。',
        '151-180天：沉淀素材实验与预算分配策略库。'
      ],
      role_scope_text: '负责独立站投放策略与优化，对流量质量、转化效率和投放ROI负责。'
    },
    commonDeductionPoints: [
      '只看点击成本，不看后链路转化。',
      '归因口径混乱导致决策偏差。',
      '素材实验缺少对照设计。',
      '预算调整缺少止损机制。'
    ],
    starTemplate: {
      situation: '核心渠道成本上升且ROAS持续下滑。',
      task: '在预算不增加的情况下恢复投放效率。',
      action: [
        '拆解渠道和受众表现定位低效段。',
        '重构素材与预算分配策略。',
        '建立周级归因复盘和止损规则。'
      ],
      result: [
        'ROAS回升并稳定获客成本。',
        '形成可复用的投放优化机制。'
      ],
      proof_materials: ['投放看板', '实验报告', '预算调整记录']
    },
    writtenAdds: [
      { id: 'IND_ECOMMERCE_CROSSBORDER_WRITTEN_V161_R016J_01', stage: 'campus_early_batch_written', round: '提前批笔试', scenarioBucket: 'business_scenario', type: 'ROAS修复题', prompt: '【行业:电商与跨境电商｜岗位:独立站投放优化岗｜阶段:提前批笔试】ROAS持续下滑时你如何快速修复？' },
      { id: 'IND_ECOMMERCE_CROSSBORDER_WRITTEN_V161_R016J_02', stage: 'campus_main_batch_written', round: '主批笔试', scenarioBucket: 'system_process', type: '投放优化流程设计', prompt: '【行业:电商与跨境电商｜岗位:独立站投放优化岗｜阶段:主批笔试】请设计“投放-归因-迭代-复盘”流程。' },
      { id: 'IND_ECOMMERCE_CROSSBORDER_WRITTEN_V161_R016J_03', stage: 'campus_supplement_written', round: '补录笔试', scenarioBucket: 'failure_review', type: '止损失效复盘', prompt: '【行业:电商与跨境电商｜岗位:独立站投放优化岗｜阶段:补录笔试】一次止损失效后你如何复盘并改进？' },
      { id: 'IND_ECOMMERCE_CROSSBORDER_WRITTEN_V161_R016J_04', stage: 'internship_conversion_written', round: '实习转正笔试', scenarioBucket: 'metric_tradeoff', type: '规模效率平衡', prompt: '【行业:电商与跨境电商｜岗位:独立站投放优化岗｜阶段:实习转正笔试】冲量目标和效率约束冲突时你如何取舍？' }
    ],
    interviewAdds: [
      { id: 'IND_ECOMMERCE_CROSSBORDER_INTERVIEW_V161_R016J_01', stage: 'campus_early_batch_interview', round: '提前批面试', scenarioBucket: 'business_scenario', type: '预算突变应对题', prompt: '【行业:电商与跨境电商｜岗位:独立站投放优化岗｜阶段:提前批面试】预算突减时你如何重排投放策略？' },
      { id: 'IND_ECOMMERCE_CROSSBORDER_INTERVIEW_V161_R016J_02', stage: 'campus_main_batch_interview', round: '主批面试', scenarioBucket: 'cross_team_collaboration', type: '创意协同题', prompt: '【行业:电商与跨境电商｜岗位:独立站投放优化岗｜阶段:主批面试】投放和创意团队意见冲突时你如何推进？' },
      { id: 'IND_ECOMMERCE_CROSSBORDER_INTERVIEW_V161_R016J_03', stage: 'campus_supplement_interview', round: '补录面试', scenarioBucket: 'failure_review', type: '归因误判复盘', prompt: '【行业:电商与跨境电商｜岗位:独立站投放优化岗｜阶段:补录面试】讲一次归因误判后的修正过程。' },
      { id: 'IND_ECOMMERCE_CROSSBORDER_INTERVIEW_V161_R016J_04', stage: 'internship_conversion_interview', round: '实习转正面试', scenarioBucket: 'metric_tradeoff', type: '资源分配决策', prompt: '【行业:电商与跨境电商｜岗位:独立站投放优化岗｜阶段:实习转正面试】多渠道并行时你如何分配资源？' }
    ]
  },
  {
    file: 'data/entries/IND_ENERGY_UTILITIES.json',
    roleId: 'IND_ENERGY_UTILITIES_ROLE_016',
    roleName: '公用事业客服运营岗',
    rolePatch: {
      role_readiness_floor: '至少完成1个公用事业客服优化项目：工单分层、响应提效、投诉治理和满意度提升。',
      day_in_life: '公用事业客服运营岗工作周：监控工单流转、分析投诉热点、优化知识库与分流策略、协同业务部门闭环问题。',
      growth_path_1to3_year: '0-1年掌握客服流程与服务指标；1-3年独立负责服务优化专项；3-5年可主导客服运营体系建设。',
      transfer_path_hint: '可转客户体验经理、公共服务运营岗、流程优化岗；需补数据分析与项目管理能力，过渡6-10个月。',
      prep_90d_plan: [
        '1-30天：梳理公用事业客服链路和关键指标。',
        '31-60天：完成1个投诉高发问题治理案例。',
        '61-90天：完成10套客服运营题训练，强化协同与复盘能力。'
      ],
      career_outlook_3to5_year: '公共服务体验升级推动客服运营岗位需求稳定，能力重心向智能分流和体验治理。',
      typical_work_week: '突发事件和账单周期期间工单量大，需高频协同。',
      switch_directions: [
        { target_role: '客户体验经理', switch_cost: '中', bridge_skills: ['体验设计', 'NPS管理'], transition_period: '6-9个月' },
        { target_role: '公共服务运营岗', switch_cost: '中', bridge_skills: ['流程治理', '服务协同'], transition_period: '6-9个月' },
        { target_role: '流程优化岗', switch_cost: '低中', bridge_skills: ['流程诊断', '效率改进'], transition_period: '5-8个月' }
      ],
      prepare_180d_plan: [
        '91-120天：建立投诉热点预警和升级机制。',
        '121-150天：主导1次客服流程提效专项复盘。',
        '151-180天：沉淀客服知识库和工单分层标准。'
      ],
      role_scope_text: '负责公用事业客服运营与服务优化，对响应时效、问题解决率和用户满意度负责。'
    },
    commonDeductionPoints: [
      '只讲话术，不讲流程和指标。',
      '工单优先级划分不清。',
      '投诉治理缺少根因分析。',
      '跨部门问题闭环不到位。'
    ],
    starTemplate: {
      situation: '账单周期投诉激增，客服响应和满意度双下滑。',
      task: '在高峰期稳定服务指标并降低重复投诉。',
      action: [
        '分层识别高频问题并优化分流规则。',
        '联动业务部门快速修复关键问题。',
        '更新知识库和回访机制跟踪效果。'
      ],
      result: [
        '投诉率下降且服务SLA恢复。',
        '形成账单周期应急服务机制。'
      ],
      proof_materials: ['工单看板', '投诉分析报告', '回访结果']
    },
    writtenAdds: [
      { id: 'IND_ENERGY_UTILITIES_WRITTEN_V161_R016J_01', stage: 'campus_early_batch_written', round: '提前批笔试', scenarioBucket: 'business_scenario', type: '投诉高峰治理题', prompt: '【行业:能源与公用事业｜岗位:公用事业客服运营岗｜阶段:提前批笔试】投诉高峰期你如何稳定服务指标？' },
      { id: 'IND_ENERGY_UTILITIES_WRITTEN_V161_R016J_02', stage: 'campus_main_batch_written', round: '主批笔试', scenarioBucket: 'system_process', type: '客服运营流程设计', prompt: '【行业:能源与公用事业｜岗位:公用事业客服运营岗｜阶段:主批笔试】请设计“受理-分流-处理-复盘”流程。' },
      { id: 'IND_ENERGY_UTILITIES_WRITTEN_V161_R016J_03', stage: 'campus_supplement_written', round: '补录笔试', scenarioBucket: 'failure_review', type: '服务失守复盘', prompt: '【行业:能源与公用事业｜岗位:公用事业客服运营岗｜阶段:补录笔试】一次服务指标失守后你如何复盘并修正？' },
      { id: 'IND_ENERGY_UTILITIES_WRITTEN_V161_R016J_04', stage: 'internship_conversion_written', round: '实习转正笔试', scenarioBucket: 'metric_tradeoff', type: '效率体验平衡', prompt: '【行业:能源与公用事业｜岗位:公用事业客服运营岗｜阶段:实习转正笔试】处理效率和体验质量冲突时你如何取舍？' }
    ],
    interviewAdds: [
      { id: 'IND_ENERGY_UTILITIES_INTERVIEW_V161_R016J_01', stage: 'campus_early_batch_interview', round: '提前批面试', scenarioBucket: 'business_scenario', type: '突发舆情应对题', prompt: '【行业:能源与公用事业｜岗位:公用事业客服运营岗｜阶段:提前批面试】突发舆情导致工单激增时你如何应急？' },
      { id: 'IND_ENERGY_UTILITIES_INTERVIEW_V161_R016J_02', stage: 'campus_main_batch_interview', round: '主批面试', scenarioBucket: 'cross_team_collaboration', type: '跨部门协同题', prompt: '【行业:能源与公用事业｜岗位:公用事业客服运营岗｜阶段:主批面试】客服和业务部门责任边界冲突时你如何推进？' },
      { id: 'IND_ENERGY_UTILITIES_INTERVIEW_V161_R016J_03', stage: 'campus_supplement_interview', round: '补录面试', scenarioBucket: 'failure_review', type: '误判复盘题', prompt: '【行业:能源与公用事业｜岗位:公用事业客服运营岗｜阶段:补录面试】讲一次你处理策略误判后的纠偏过程。' },
      { id: 'IND_ENERGY_UTILITIES_INTERVIEW_V161_R016J_04', stage: 'internship_conversion_interview', round: '实习转正面试', scenarioBucket: 'metric_tradeoff', type: '任务优先级决策', prompt: '【行业:能源与公用事业｜岗位:公用事业客服运营岗｜阶段:实习转正面试】多类工单并发时你如何排序？' }
    ]
  },
  {
    file: 'data/entries/IND_FIN_BANK.json',
    roleId: 'IND_FIN_BANK_ROLE_016',
    roleName: '零售风控策略岗',
    rolePatch: {
      role_readiness_floor: '至少完成1个零售风控策略项目：风险识别、规则优化、效果评估和策略迭代。',
      day_in_life: '零售风控策略岗工作周：监控风险指标、分析欺诈与违约样本、优化准入和授信规则、评估策略效果并复盘。',
      growth_path_1to3_year: '0-1年掌握零售风控基础模型和规则；1-3年独立负责策略迭代；3-5年可主导分层风控体系建设。',
      transfer_path_hint: '可转信用风险模型岗、反欺诈策略岗、数据产品经理；需补建模与产品化能力，过渡6-10个月。',
      prep_90d_plan: [
        '1-30天：梳理零售风控核心指标与规则框架。',
        '31-60天：完成1个策略误判修复案例。',
        '61-90天：完成10套风控题训练，强化收益风险平衡表达。'
      ],
      career_outlook_3to5_year: '零售金融精细化风控持续加强，策略岗位需求稳定，能力重心向实时决策与多维风控。',
      typical_work_week: '活动节点和风险波动期需要高频迭代策略。',
      switch_directions: [
        { target_role: '信用风险模型岗', switch_cost: '中', bridge_skills: ['模型开发', '特征工程'], transition_period: '6-9个月' },
        { target_role: '反欺诈策略岗', switch_cost: '中', bridge_skills: ['欺诈识别', '规则联防'], transition_period: '6-9个月' },
        { target_role: '数据产品经理', switch_cost: '中高', bridge_skills: ['产品设计', '策略平台化'], transition_period: '7-10个月' }
      ],
      prepare_180d_plan: [
        '91-120天：建立策略异常预警与回滚机制。',
        '121-150天：主导1次坏账抬头复盘专项。',
        '151-180天：沉淀风控策略实验与上线规范。'
      ],
      role_scope_text: '负责零售业务风控策略设计与迭代，对风险成本、通过率和策略稳定性负责。'
    },
    commonDeductionPoints: [
      '只看拦截率，不看业务收益影响。',
      '策略调整缺少回测验证。',
      '规则联动逻辑不完整。',
      '缺少上线后监控与回滚方案。'
    ],
    starTemplate: {
      situation: '某业务线坏账率上升且通过率下滑，策略效果失衡。',
      task: '在控制坏账前提下恢复业务通过率。',
      action: [
        '拆解风险分层并定位高损失客群。',
        '优化准入规则并做分组实验验证。',
        '上线监控并设置阈值触发回滚。'
      ],
      result: [
        '坏账率受控且通过率回升。',
        '形成可复用的策略优化机制。'
      ],
      proof_materials: ['策略看板', '实验报告', '上线监控记录']
    },
    writtenAdds: [
      { id: 'IND_FIN_BANK_WRITTEN_V161_R016J_01', stage: 'campus_early_batch_written', round: '提前批笔试', scenarioBucket: 'business_scenario', type: '策略失衡修复题', prompt: '【行业:金融-银行｜岗位:零售风控策略岗｜阶段:提前批笔试】坏账上升且通过率下滑时你如何修复策略？' },
      { id: 'IND_FIN_BANK_WRITTEN_V161_R016J_02', stage: 'campus_main_batch_written', round: '主批笔试', scenarioBucket: 'system_process', type: '风控流程设计', prompt: '【行业:金融-银行｜岗位:零售风控策略岗｜阶段:主批笔试】请设计“识别-实验-上线-监控”流程。' },
      { id: 'IND_FIN_BANK_WRITTEN_V161_R016J_03', stage: 'campus_supplement_written', round: '补录笔试', scenarioBucket: 'failure_review', type: '回滚复盘题', prompt: '【行业:金融-银行｜岗位:零售风控策略岗｜阶段:补录笔试】一次策略回滚后你如何复盘并优化？' },
      { id: 'IND_FIN_BANK_WRITTEN_V161_R016J_04', stage: 'internship_conversion_written', round: '实习转正笔试', scenarioBucket: 'metric_tradeoff', type: '收益风险平衡', prompt: '【行业:金融-银行｜岗位:零售风控策略岗｜阶段:实习转正笔试】业务增长和风险控制冲突时你如何取舍？' }
    ],
    interviewAdds: [
      { id: 'IND_FIN_BANK_INTERVIEW_V161_R016J_01', stage: 'campus_early_batch_interview', round: '提前批面试', scenarioBucket: 'business_scenario', type: '业务方沟通题', prompt: '【行业:金融-银行｜岗位:零售风控策略岗｜阶段:提前批面试】业务方不认可策略收紧时你如何沟通？' },
      { id: 'IND_FIN_BANK_INTERVIEW_V161_R016J_02', stage: 'campus_main_batch_interview', round: '主批面试', scenarioBucket: 'cross_team_collaboration', type: '策略分歧协同题', prompt: '【行业:金融-银行｜岗位:零售风控策略岗｜阶段:主批面试】模型和规则团队意见冲突时你如何推进？' },
      { id: 'IND_FIN_BANK_INTERVIEW_V161_R016J_03', stage: 'campus_supplement_interview', round: '补录面试', scenarioBucket: 'failure_review', type: '误杀复盘题', prompt: '【行业:金融-银行｜岗位:零售风控策略岗｜阶段:补录面试】讲一次策略误杀提升后的修正过程。' },
      { id: 'IND_FIN_BANK_INTERVIEW_V161_R016J_04', stage: 'internship_conversion_interview', round: '实习转正面试', scenarioBucket: 'metric_tradeoff', type: '策略排序决策', prompt: '【行业:金融-银行｜岗位:零售风控策略岗｜阶段:实习转正面试】多条策略迭代并发时你如何排优先级？' }
    ]
  },
  {
    file: 'data/entries/IND_FIN_SECURITIES_FUND.json',
    roleId: 'IND_FIN_SECURITIES_FUND_ROLE_016',
    roleName: '基金销售支持岗',
    rolePatch: {
      role_readiness_floor: '至少完成1个基金销售支持项目：需求洞察、材料优化、路演协同和转化复盘。',
      day_in_life: '基金销售支持岗工作周：整理机构需求、更新产品材料、支持路演答疑、跟踪销售线索并复盘转化。',
      growth_path_1to3_year: '0-1年掌握基金产品与销售流程；1-3年独立支持重点客户；3-5年可主导销售支持体系建设。',
      transfer_path_hint: '可转基金销售、投顾支持、产品经理；需补客户经营和产品策略能力，过渡6-10个月。',
      prep_90d_plan: [
        '1-30天：梳理客户需求分层与材料体系。',
        '31-60天：完成1个路演转化优化案例。',
        '61-90天：完成10套销售支持题训练，强化协同推进和复盘能力。'
      ],
      career_outlook_3to5_year: '机构化资产配置持续推进，销售支持岗位需求稳定，能力重心向客户洞察和投研协同。',
      typical_work_week: '发行窗口期节奏紧，材料更新和客户沟通高频。',
      switch_directions: [
        { target_role: '基金销售', switch_cost: '中', bridge_skills: ['客户拓展', '商务沟通'], transition_period: '6-9个月' },
        { target_role: '投顾支持', switch_cost: '低中', bridge_skills: ['策略表达', '客户服务'], transition_period: '5-8个月' },
        { target_role: '产品经理', switch_cost: '中高', bridge_skills: ['产品定位', '竞品分析'], transition_period: '7-10个月' }
      ],
      prepare_180d_plan: [
        '91-120天：建立客户反馈优先级机制。',
        '121-150天：主导1次发行期支持复盘专项。',
        '151-180天：沉淀材料迭代与线索跟进模板。'
      ],
      role_scope_text: '负责基金销售支持与客户需求转化，对材料质量、协同效率和转化支持效果负责。'
    },
    commonDeductionPoints: [
      '只做材料搬运，不做需求洞察。',
      '线索跟进缺少分层策略。',
      '路演复盘不含转化分析。',
      '投研协同动作不清晰。'
    ],
    starTemplate: {
      situation: '重点产品发行期客户反馈分散，销售转化率低于预期。',
      task: '快速重构支持策略并提升关键客户转化。',
      action: [
        '分层梳理反馈并重排支持优先级。',
        '联动投研完善核心材料与答疑手册。',
        '跟踪执行并复盘转化路径。'
      ],
      result: [
        '关键客户转化提升并缩短决策周期。',
        '形成标准化销售支持闭环。'
      ],
      proof_materials: ['客户反馈表', '材料版本记录', '转化跟踪报表']
    },
    writtenAdds: [
      { id: 'IND_FIN_SECURITIES_FUND_WRITTEN_V161_R016J_01', stage: 'campus_early_batch_written', round: '提前批笔试', scenarioBucket: 'business_scenario', type: '转化提效题', prompt: '【行业:金融-证券基金｜岗位:基金销售支持岗｜阶段:提前批笔试】发行期转化偏低时你如何提效？' },
      { id: 'IND_FIN_SECURITIES_FUND_WRITTEN_V161_R016J_02', stage: 'campus_main_batch_written', round: '主批笔试', scenarioBucket: 'system_process', type: '支持流程设计', prompt: '【行业:金融-证券基金｜岗位:基金销售支持岗｜阶段:主批笔试】请设计“需求-材料-路演-跟进”流程。' },
      { id: 'IND_FIN_SECURITIES_FUND_WRITTEN_V161_R016J_03', stage: 'campus_supplement_written', round: '补录笔试', scenarioBucket: 'failure_review', type: '线索流失复盘', prompt: '【行业:金融-证券基金｜岗位:基金销售支持岗｜阶段:补录笔试】一次线索流失后你如何复盘并优化？' },
      { id: 'IND_FIN_SECURITIES_FUND_WRITTEN_V161_R016J_04', stage: 'internship_conversion_written', round: '实习转正笔试', scenarioBucket: 'metric_tradeoff', type: '覆盖深度平衡', prompt: '【行业:金融-证券基金｜岗位:基金销售支持岗｜阶段:实习转正笔试】客户覆盖广但资源有限时你如何取舍？' }
    ],
    interviewAdds: [
      { id: 'IND_FIN_SECURITIES_FUND_INTERVIEW_V161_R016J_01', stage: 'campus_early_batch_interview', round: '提前批面试', scenarioBucket: 'business_scenario', type: '紧急需求应对题', prompt: '【行业:金融-证券基金｜岗位:基金销售支持岗｜阶段:提前批面试】多客户同时提出紧急需求时你如何应对？' },
      { id: 'IND_FIN_SECURITIES_FUND_INTERVIEW_V161_R016J_02', stage: 'campus_main_batch_interview', round: '主批面试', scenarioBucket: 'cross_team_collaboration', type: '研销协同题', prompt: '【行业:金融-证券基金｜岗位:基金销售支持岗｜阶段:主批面试】投研与销售话术冲突时你如何协调？' },
      { id: 'IND_FIN_SECURITIES_FUND_INTERVIEW_V161_R016J_03', stage: 'campus_supplement_interview', round: '补录面试', scenarioBucket: 'failure_review', type: '需求误判复盘', prompt: '【行业:金融-证券基金｜岗位:基金销售支持岗｜阶段:补录面试】讲一次你误判客户需求后的修正经历。' },
      { id: 'IND_FIN_SECURITIES_FUND_INTERVIEW_V161_R016J_04', stage: 'internship_conversion_interview', round: '实习转正面试', scenarioBucket: 'metric_tradeoff', type: '优先级决策题', prompt: '【行业:金融-证券基金｜岗位:基金销售支持岗｜阶段:实习转正面试】核心客户和潜力客户冲突时你如何排优先级？' }
    ]
  },
  {
    file: 'data/entries/IND_NEW_ENERGY.json',
    roleId: 'IND_NEW_ENERGY_ROLE_016',
    roleName: '新能源市场策略岗',
    rolePatch: {
      role_readiness_floor: '至少完成1个新能源市场策略项目：市场研判、竞争分析、策略制定和效果验证。',
      day_in_life: '新能源市场策略岗工作周：跟踪政策与市场数据、分析竞品动态、制定区域进入或产品策略、复盘执行结果。',
      growth_path_1to3_year: '0-1年掌握新能源市场结构与政策逻辑；1-3年独立完成策略分析；3-5年可主导区域市场策略。',
      transfer_path_hint: '可转投资分析、业务拓展经理、战略规划岗；需补财务模型与项目管理，过渡6-10个月。',
      prep_90d_plan: [
        '1-30天：梳理新能源细分市场与关键指标。',
        '31-60天：完成1个区域策略验证案例。',
        '61-90天：完成10套市场策略题训练，强化取舍与落地表达。'
      ],
      career_outlook_3to5_year: '新能源产业链持续扩张，市场策略岗位需求稳步提升，能力重心向数据驱动和跨区域竞争判断。',
      typical_work_week: '政策调整和招投标窗口期节奏快，信息更新频繁。',
      switch_directions: [
        { target_role: '投资分析', switch_cost: '中', bridge_skills: ['财务建模', '估值分析'], transition_period: '6-9个月' },
        { target_role: '业务拓展经理', switch_cost: '中', bridge_skills: ['商务谈判', '渠道管理'], transition_period: '6-9个月' },
        { target_role: '战略规划岗', switch_cost: '中高', bridge_skills: ['战略框架', '行业研究'], transition_period: '7-10个月' }
      ],
      prepare_180d_plan: [
        '91-120天：建立政策和竞品变动监测机制。',
        '121-150天：主导1次区域策略复盘专项。',
        '151-180天：沉淀市场策略报告模板与决策清单。'
      ],
      role_scope_text: '负责新能源市场策略研究与方案制定，对策略可行性、执行效果和竞争优势构建负责。'
    },
    commonDeductionPoints: [
      '只做趋势描述，不给策略建议。',
      '策略假设缺少数据支撑。',
      '忽视政策和执行约束。',
      '复盘不含结果对照与修正。'
    ],
    starTemplate: {
      situation: '目标市场竞争加剧且政策预期变化，既有策略转化下降。',
      task: '快速调整市场策略并恢复增长节奏。',
      action: [
        '重估市场容量、竞争格局和政策边界。',
        '重排策略优先级并设定阶段目标。',
        '跟踪执行数据并迭代策略。'
      ],
      result: [
        '关键市场转化恢复并提升策略命中率。',
        '形成动态策略调整机制。'
      ],
      proof_materials: ['市场分析报告', '策略方案', '执行追踪看板']
    },
    writtenAdds: [
      { id: 'IND_NEW_ENERGY_WRITTEN_V161_R016J_01', stage: 'campus_early_batch_written', round: '提前批笔试', scenarioBucket: 'business_scenario', type: '策略重构题', prompt: '【行业:新能源｜岗位:新能源市场策略岗｜阶段:提前批笔试】竞争和政策变化下你如何重构策略？' },
      { id: 'IND_NEW_ENERGY_WRITTEN_V161_R016J_02', stage: 'campus_main_batch_written', round: '主批笔试', scenarioBucket: 'system_process', type: '策略流程设计', prompt: '【行业:新能源｜岗位:新能源市场策略岗｜阶段:主批笔试】请设计“研判-制定-执行-复盘”策略流程。' },
      { id: 'IND_NEW_ENERGY_WRITTEN_V161_R016J_03', stage: 'campus_supplement_written', round: '补录笔试', scenarioBucket: 'failure_review', type: '策略失效复盘', prompt: '【行业:新能源｜岗位:新能源市场策略岗｜阶段:补录笔试】一次策略失效后你如何复盘并迭代？' },
      { id: 'IND_NEW_ENERGY_WRITTEN_V161_R016J_04', stage: 'internship_conversion_written', round: '实习转正笔试', scenarioBucket: 'metric_tradeoff', type: '规模利润平衡', prompt: '【行业:新能源｜岗位:新能源市场策略岗｜阶段:实习转正笔试】扩张速度与利润质量冲突时你如何取舍？' }
    ],
    interviewAdds: [
      { id: 'IND_NEW_ENERGY_INTERVIEW_V161_R016J_01', stage: 'campus_early_batch_interview', round: '提前批面试', scenarioBucket: 'business_scenario', type: '政策突变应对题', prompt: '【行业:新能源｜岗位:新能源市场策略岗｜阶段:提前批面试】政策突变时你如何快速调整市场策略？' },
      { id: 'IND_NEW_ENERGY_INTERVIEW_V161_R016J_02', stage: 'campus_main_batch_interview', round: '主批面试', scenarioBucket: 'cross_team_collaboration', type: '跨团队推进题', prompt: '【行业:新能源｜岗位:新能源市场策略岗｜阶段:主批面试】市场、销售、产品目标冲突时你如何推进？' },
      { id: 'IND_NEW_ENERGY_INTERVIEW_V161_R016J_03', stage: 'campus_supplement_interview', round: '补录面试', scenarioBucket: 'failure_review', type: '判断偏差复盘', prompt: '【行业:新能源｜岗位:新能源市场策略岗｜阶段:补录面试】讲一次你市场判断偏差后的修正过程。' },
      { id: 'IND_NEW_ENERGY_INTERVIEW_V161_R016J_04', stage: 'internship_conversion_interview', round: '实习转正面试', scenarioBucket: 'metric_tradeoff', type: '资源配置决策', prompt: '【行业:新能源｜岗位:新能源市场策略岗｜阶段:实习转正面试】多区域拓展并行时你如何分配资源？' }
    ]
  },
  {
    file: 'data/entries/IND_PUBLIC_INSTITUTION.json',
    roleId: 'IND_PUBLIC_INSTITUTION_ROLE_016',
    roleName: '事业编人力配置岗',
    rolePatch: {
      role_readiness_floor: '至少完成1个人力配置项目：编制分析、岗位匹配、调配执行和效果评估。',
      day_in_life: '事业编人力配置岗工作周：分析岗位缺口、制定配置方案、协调招聘与调动、跟踪在岗表现并优化配置策略。',
      growth_path_1to3_year: '0-1年掌握编制和岗位管理规则；1-3年独立负责配置方案；3-5年可主导组织结构优化项目。',
      transfer_path_hint: '可转组织发展岗、绩效管理岗、人才发展岗；需补组织诊断与数据分析能力，过渡6-10个月。',
      prep_90d_plan: [
        '1-30天：梳理编制管理制度与岗位画像框架。',
        '31-60天：完成1个人力调配闭环案例。',
        '61-90天：完成10套人力配置题训练，强化公平与效率平衡表达。'
      ],
      career_outlook_3to5_year: '事业单位组织优化持续推进，人力配置岗位需求稳定，能力重心向数据化配置和组织协同。',
      typical_work_week: '招聘季和考核季任务密度高，跨部门协调频繁。',
      switch_directions: [
        { target_role: '组织发展岗', switch_cost: '中', bridge_skills: ['组织诊断', '岗位体系'], transition_period: '6-9个月' },
        { target_role: '绩效管理岗', switch_cost: '中', bridge_skills: ['绩效设计', '指标分析'], transition_period: '6-9个月' },
        { target_role: '人才发展岗', switch_cost: '中', bridge_skills: ['培养体系', '人才盘点'], transition_period: '6-9个月' }
      ],
      prepare_180d_plan: [
        '91-120天：建立岗位缺口预警与滚动评估机制。',
        '121-150天：主导1次配置效率专项复盘。',
        '151-180天：沉淀岗位配置评估模板和流程手册。'
      ],
      role_scope_text: '负责事业编岗位人力配置与优化，对编制利用效率、岗位匹配度和配置公平性负责。'
    },
    commonDeductionPoints: [
      '只看人数，不看岗位能力匹配。',
      '配置方案缺少数据依据。',
      '调配推进缺少沟通机制。',
      '效果评估不成体系。'
    ],
    starTemplate: {
      situation: '重点岗位长期缺编，影响单位业务连续性。',
      task: '在编制约束内优化配置并恢复关键岗位运转。',
      action: [
        '识别关键岗位优先级和能力缺口。',
        '联动招聘和内部调配制定组合方案。',
        '跟踪到岗效果并持续优化配置规则。'
      ],
      result: [
        '关键岗位缺口缩小并提升岗位匹配率。',
        '形成可复用的人力配置机制。'
      ],
      proof_materials: ['配置方案', '岗位匹配评估表', '执行跟踪记录']
    },
    writtenAdds: [
      { id: 'IND_PUBLIC_INSTITUTION_WRITTEN_V161_R016J_01', stage: 'campus_early_batch_written', round: '提前批笔试', scenarioBucket: 'business_scenario', type: '缺编治理题', prompt: '【行业:事业单位体系｜岗位:事业编人力配置岗｜阶段:提前批笔试】关键岗位长期缺编时你如何优化配置？' },
      { id: 'IND_PUBLIC_INSTITUTION_WRITTEN_V161_R016J_02', stage: 'campus_main_batch_written', round: '主批笔试', scenarioBucket: 'system_process', type: '配置流程设计', prompt: '【行业:事业单位体系｜岗位:事业编人力配置岗｜阶段:主批笔试】请设计“诊断-配置-执行-评估”流程。' },
      { id: 'IND_PUBLIC_INSTITUTION_WRITTEN_V161_R016J_03', stage: 'campus_supplement_written', round: '补录笔试', scenarioBucket: 'failure_review', type: '调配失效复盘', prompt: '【行业:事业单位体系｜岗位:事业编人力配置岗｜阶段:补录笔试】一次调配未达预期后你如何复盘？' },
      { id: 'IND_PUBLIC_INSTITUTION_WRITTEN_V161_R016J_04', stage: 'internship_conversion_written', round: '实习转正笔试', scenarioBucket: 'metric_tradeoff', type: '效率公平平衡', prompt: '【行业:事业单位体系｜岗位:事业编人力配置岗｜阶段:实习转正笔试】效率提升与配置公平冲突时你如何取舍？' }
    ],
    interviewAdds: [
      { id: 'IND_PUBLIC_INSTITUTION_INTERVIEW_V161_R016J_01', stage: 'campus_early_batch_interview', round: '提前批面试', scenarioBucket: 'business_scenario', type: '编制压力沟通题', prompt: '【行业:事业单位体系｜岗位:事业编人力配置岗｜阶段:提前批面试】编制受限下你如何向部门解释配置方案？' },
      { id: 'IND_PUBLIC_INSTITUTION_INTERVIEW_V161_R016J_02', stage: 'campus_main_batch_interview', round: '主批面试', scenarioBucket: 'cross_team_collaboration', type: '部门协同题', prompt: '【行业:事业单位体系｜岗位:事业编人力配置岗｜阶段:主批面试】部门间争抢编制名额时你如何协调？' },
      { id: 'IND_PUBLIC_INSTITUTION_INTERVIEW_V161_R016J_03', stage: 'campus_supplement_interview', round: '补录面试', scenarioBucket: 'failure_review', type: '方案误判复盘', prompt: '【行业:事业单位体系｜岗位:事业编人力配置岗｜阶段:补录面试】讲一次你配置方案误判后的修正过程。' },
      { id: 'IND_PUBLIC_INSTITUTION_INTERVIEW_V161_R016J_04', stage: 'internship_conversion_interview', round: '实习转正面试', scenarioBucket: 'metric_tradeoff', type: '配置优先级决策', prompt: '【行业:事业单位体系｜岗位:事业编人力配置岗｜阶段:实习转正面试】多岗位缺口并发时你如何排优先级？' }
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
    data_origin: 'official_jd_competency_mapping_with_manual_role_enrichment_v161_batch10',
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
  role.role_detail_v158.expansion_status = 'landed_deep_profile_v161_batch10';

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
