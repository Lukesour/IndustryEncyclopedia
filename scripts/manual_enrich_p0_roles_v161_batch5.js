#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TODAY = '2026-02-20';

const updates = [
  {
    file: 'data/entries/IND_AUTO_INTELLIGENT_DRIVING.json',
    roleId: 'IND_AUTO_INTELLIGENT_DRIVING_ROLE_011',
    roleName: '智驾感知算法工程师',
    rolePatch: {
      role_readiness_floor: '至少完成1个感知算法闭环项目：数据清洗、模型训练、误检漏检分析和上线回归。',
      day_in_life: '智驾感知算法工程师工作周：数据集抽样质检、模型迭代训练、误检案例复盘、部署联调、线上效果追踪。',
      growth_path_1to3_year: '0-1年熟悉感知链路和指标；1-3年独立负责模块迭代与线上优化；3-5年可主导感知方案和跨域协同。',
      transfer_path_hint: '可转多模态算法工程师、智驾数据闭环工程师、规划算法工程师；需补跨模态建模与系统工程，过渡6-10个月。',
      prep_90d_plan: [
        '1-30天：梳理感知任务指标和失效场景分类。',
        '31-60天：完成1个误检漏检闭环优化案例。',
        '61-90天：完成10套感知算法题训练，强化指标解释与工程取舍。'
      ],
      career_outlook_3to5_year: '高阶智驾落地提速，感知算法岗位持续紧缺，能力重点从单模型优化转向系统级鲁棒性。',
      typical_work_week: '数据和版本迭代节奏快，路测反馈高峰期任务密度显著上升。',
      switch_directions: [
        { target_role: '多模态算法工程师', switch_cost: '中', bridge_skills: ['多模态融合', '表征学习'], transition_period: '6-9个月' },
        { target_role: '智驾数据闭环工程师', switch_cost: '低中', bridge_skills: ['数据挖掘', '闭环策略'], transition_period: '4-7个月' },
        { target_role: '规划算法工程师', switch_cost: '中高', bridge_skills: ['轨迹预测', '决策规划'], transition_period: '7-10个月' }
      ],
      prepare_180d_plan: [
        '91-120天：建立失效样本分层回归机制。',
        '121-150天：主导1次跨传感器融合优化专项。',
        '151-180天：沉淀感知版本发布门禁与复盘模板。'
      ],
      role_scope_text: '负责智驾感知模型研发与迭代优化，对识别准确率、鲁棒性和线上问题闭环效率负责。'
    },
    commonDeductionPoints: [
      '只讲模型结构，不讲业务指标与落地约束。',
      '误检漏检分析缺少根因链路。',
      '数据治理策略不清，无法解释泛化改进。',
      '缺少与标注、仿真、规划团队协同机制。'
    ],
    starTemplate: {
      situation: '夜间逆光场景下行人漏检率上升，影响发布质量门禁。',
      task: '在版本窗口前将关键场景漏检率降至门禁阈值以内。',
      action: [
        '对失败样本做分桶分析，锁定逆光和遮挡组合场景。',
        '联合数据团队补充难例并调整训练策略。',
        '执行回归测试并验证线上鲁棒性提升。'
      ],
      result: [
        '关键场景漏检率下降并通过发布门禁。',
        '形成可复用的感知失效分析与修复流程。'
      ],
      proof_materials: ['样本分桶报告', '训练实验记录', '回归测试结果']
    },
    writtenAdds: [
      { id: 'IND_AUTO_INTELLIGENT_DRIVING_WRITTEN_V161_R011E_01', stage: 'campus_early_batch_written', round: '提前批笔试', scenarioBucket: 'business_scenario', type: '感知失效修复题', prompt: '【行业:汽车与智能驾驶｜岗位:智驾感知算法工程师｜阶段:提前批笔试】夜间逆光场景漏检上升，你如何快速定位并修复？' },
      { id: 'IND_AUTO_INTELLIGENT_DRIVING_WRITTEN_V161_R011E_02', stage: 'campus_main_batch_written', round: '主批笔试', scenarioBucket: 'system_process', type: '感知迭代流程设计', prompt: '【行业:汽车与智能驾驶｜岗位:智驾感知算法工程师｜阶段:主批笔试】请设计“数据-训练-验证-上线”算法迭代流程。' },
      { id: 'IND_AUTO_INTELLIGENT_DRIVING_WRITTEN_V161_R011E_03', stage: 'campus_supplement_written', round: '补录笔试', scenarioBucket: 'failure_review', type: '模型回退复盘', prompt: '【行业:汽车与智能驾驶｜岗位:智驾感知算法工程师｜阶段:补录笔试】新模型上线后指标回退，你如何复盘并止损？' },
      { id: 'IND_AUTO_INTELLIGENT_DRIVING_WRITTEN_V161_R011E_04', stage: 'internship_conversion_written', round: '实习转正笔试', scenarioBucket: 'metric_tradeoff', type: '精度时延取舍', prompt: '【行业:汽车与智能驾驶｜岗位:智驾感知算法工程师｜阶段:实习转正笔试】精度提升与推理时延冲突时你如何做取舍？' }
    ],
    interviewAdds: [
      { id: 'IND_AUTO_INTELLIGENT_DRIVING_INTERVIEW_V161_R011E_01', stage: 'campus_early_batch_interview', round: '提前批面试', scenarioBucket: 'business_scenario', type: '异常场景沟通题', prompt: '【行业:汽车与智能驾驶｜岗位:智驾感知算法工程师｜阶段:提前批面试】管理层要求按期发布但关键场景未达标，你如何汇报？' },
      { id: 'IND_AUTO_INTELLIGENT_DRIVING_INTERVIEW_V161_R011E_02', stage: 'campus_main_batch_interview', round: '主批面试', scenarioBucket: 'cross_team_collaboration', type: '跨团队闭环推进', prompt: '【行业:汽车与智能驾驶｜岗位:智驾感知算法工程师｜阶段:主批面试】标注和算法团队对问题归因不一致时你如何推进？' },
      { id: 'IND_AUTO_INTELLIGENT_DRIVING_INTERVIEW_V161_R011E_03', stage: 'campus_supplement_interview', round: '补录面试', scenarioBucket: 'failure_review', type: '误检复盘题', prompt: '【行业:汽车与智能驾驶｜岗位:智驾感知算法工程师｜阶段:补录面试】讲一次你处理大规模误检问题的复盘过程。' },
      { id: 'IND_AUTO_INTELLIGENT_DRIVING_INTERVIEW_V161_R011E_04', stage: 'internship_conversion_interview', round: '实习转正面试', scenarioBucket: 'metric_tradeoff', type: '资源约束决策', prompt: '【行业:汽车与智能驾驶｜岗位:智驾感知算法工程师｜阶段:实习转正面试】算力资源受限时你如何确定优化优先级？' }
    ]
  },
  {
    file: 'data/entries/IND_BIOMED_DEVICE.json',
    roleId: 'IND_BIOMED_DEVICE_ROLE_011',
    roleName: '临床数据管理专员',
    rolePatch: {
      role_readiness_floor: '至少完成1个临床数据项目：CRF核查、数据清理、医学编码和数据库锁库支持。',
      day_in_life: '临床数据管理专员工作周：核对入组数据、发起query、跟进中心回复、编码复核、支持中期分析与锁库。',
      growth_path_1to3_year: '0-1年掌握EDC流程与质量规则；1-3年独立负责试验数据清理；3-5年可主导多中心数据管理策略。',
      transfer_path_hint: '可转生物统计、临床运营、注册事务；需补统计编程和法规申报框架，过渡5-9个月。',
      prep_90d_plan: [
        '1-30天：梳理CRF字段逻辑与常见错误类型。',
        '31-60天：完成1个query闭环与锁库前核查案例。',
        '61-90天：完成10套临床数据管理题训练，强化质量与时效平衡。'
      ],
      career_outlook_3to5_year: '临床试验数字化深化，数据管理岗位需求稳定，核心能力转向数据质量治理与跨团队协同。',
      typical_work_week: '数据录入波峰和锁库节点任务集中，时限管理要求高。',
      switch_directions: [
        { target_role: '生物统计师', switch_cost: '中高', bridge_skills: ['统计方法', 'SAS/R'], transition_period: '7-10个月' },
        { target_role: '临床运营', switch_cost: '中', bridge_skills: ['中心管理', '试验推进'], transition_period: '5-8个月' },
        { target_role: '注册事务', switch_cost: '中', bridge_skills: ['法规写作', '申报结构'], transition_period: '5-8个月' }
      ],
      prepare_180d_plan: [
        '91-120天：建立高风险字段质量监控清单。',
        '121-150天：主导1次锁库前数据核查专项。',
        '151-180天：沉淀query分类与处理时效标准。'
      ],
      role_scope_text: '负责临床试验数据质量管理与清理闭环，对数据完整性、准确性和锁库时效负责。'
    },
    commonDeductionPoints: [
      'query处理只讲流程，不讲优先级和风险判断。',
      '缺少数据一致性规则设计能力。',
      '锁库前核查逻辑不完整。',
      '与医学、统计团队协同路径不清。'
    ],
    starTemplate: {
      situation: '多中心试验临近锁库，关键变量缺失率偏高且query积压。',
      task: '在锁库节点前完成高风险query清理并保障数据质量。',
      action: [
        '按关键变量和中心表现分级query优先级。',
        '与CRA和中心快速对齐补录策略。',
        '执行复核并输出锁库风险清单。'
      ],
      result: [
        '高风险query按期清零并按时锁库。',
        '形成中心分层管理和清理提效机制。'
      ],
      proof_materials: ['query看板', '锁库前核查清单', '中心沟通纪要']
    },
    writtenAdds: [
      { id: 'IND_BIOMED_DEVICE_WRITTEN_V161_R011E_01', stage: 'campus_early_batch_written', round: '提前批笔试', scenarioBucket: 'business_scenario', type: 'query积压处置题', prompt: '【行业:生物医药与器械｜岗位:临床数据管理专员｜阶段:提前批笔试】锁库前query积压严重，你如何制定清理方案？' },
      { id: 'IND_BIOMED_DEVICE_WRITTEN_V161_R011E_02', stage: 'campus_main_batch_written', round: '主批笔试', scenarioBucket: 'system_process', type: '数据管理体系设计', prompt: '【行业:生物医药与器械｜岗位:临床数据管理专员｜阶段:主批笔试】请设计“入组-清理-复核-锁库”数据管理流程。' },
      { id: 'IND_BIOMED_DEVICE_WRITTEN_V161_R011E_03', stage: 'campus_supplement_written', round: '补录笔试', scenarioBucket: 'failure_review', type: '锁库延期复盘', prompt: '【行业:生物医药与器械｜岗位:临床数据管理专员｜阶段:补录笔试】一次锁库延期后你如何复盘并优化机制？' },
      { id: 'IND_BIOMED_DEVICE_WRITTEN_V161_R011E_04', stage: 'internship_conversion_written', round: '实习转正笔试', scenarioBucket: 'metric_tradeoff', type: '时效质量平衡', prompt: '【行业:生物医药与器械｜岗位:临床数据管理专员｜阶段:实习转正笔试】项目节点紧迫时如何兼顾数据质量与交付时效？' }
    ],
    interviewAdds: [
      { id: 'IND_BIOMED_DEVICE_INTERVIEW_V161_R011E_01', stage: 'campus_early_batch_interview', round: '提前批面试', scenarioBucket: 'business_scenario', type: '中心沟通推进题', prompt: '【行业:生物医药与器械｜岗位:临床数据管理专员｜阶段:提前批面试】研究中心长期延迟回query时你如何推进？' },
      { id: 'IND_BIOMED_DEVICE_INTERVIEW_V161_R011E_02', stage: 'campus_main_batch_interview', round: '主批面试', scenarioBucket: 'cross_team_collaboration', type: '医统协同题', prompt: '【行业:生物医药与器械｜岗位:临床数据管理专员｜阶段:主批面试】统计与医学对数据口径冲突时你如何协调？' },
      { id: 'IND_BIOMED_DEVICE_INTERVIEW_V161_R011E_03', stage: 'campus_supplement_interview', round: '补录面试', scenarioBucket: 'failure_review', type: '核查遗漏复盘', prompt: '【行业:生物医药与器械｜岗位:临床数据管理专员｜阶段:补录面试】讲一次你发现关键变量遗漏并修正的经历。' },
      { id: 'IND_BIOMED_DEVICE_INTERVIEW_V161_R011E_04', stage: 'internship_conversion_interview', round: '实习转正面试', scenarioBucket: 'metric_tradeoff', type: '优先级决策题', prompt: '【行业:生物医药与器械｜岗位:临床数据管理专员｜阶段:实习转正面试】资源不足时你如何划分清理优先级？' }
    ]
  },
  {
    file: 'data/entries/IND_ECOMMERCE_CROSSBORDER.json',
    roleId: 'IND_ECOMMERCE_CROSSBORDER_ROLE_011',
    roleName: '跨境客服策略运营',
    rolePatch: {
      role_readiness_floor: '至少完成1个客服策略项目：工单分层、响应SLA优化、差评治理与服务体验改进。',
      day_in_life: '跨境客服策略运营工作周：监控工单漏斗、分析高频问题、优化机器人与人工协同、复盘退款争议和服务指标。',
      growth_path_1to3_year: '0-1年掌握客服指标和流程；1-3年独立负责策略迭代和质量提升；3-5年可主导多市场服务体系建设。',
      transfer_path_hint: '可转用户运营、客户成功、跨境售后管理；需补用户分层与流程设计能力，过渡4-8个月。',
      prep_90d_plan: [
        '1-30天：梳理客服链路和关键体验指标。',
        '31-60天：完成1个投诉率下降专项案例。',
        '61-90天：完成10套客服策略题训练，强化场景拆解与机制设计。'
      ],
      career_outlook_3to5_year: '跨境平台服务标准提高，客服策略岗位需求稳定，能力重心向智能分流与体验运营升级。',
      typical_work_week: '促销节点和物流异常期间工单激增，策略响应需日级别迭代。',
      switch_directions: [
        { target_role: '用户运营', switch_cost: '低中', bridge_skills: ['用户分层', '活动策略'], transition_period: '4-6个月' },
        { target_role: '客户成功', switch_cost: '中', bridge_skills: ['生命周期管理', '续费留存'], transition_period: '5-8个月' },
        { target_role: '跨境售后管理', switch_cost: '中', bridge_skills: ['争议处理', '流程治理'], transition_period: '5-8个月' }
      ],
      prepare_180d_plan: [
        '91-120天：建立工单分层响应与升级规则。',
        '121-150天：主导1次多市场客服体验复盘专项。',
        '151-180天：沉淀客服策略实验框架和知识库标准。'
      ],
      role_scope_text: '负责跨境客服策略设计与运营优化，对响应时效、问题解决率和用户满意度负责。'
    },
    commonDeductionPoints: [
      '只讲客服话术，不讲策略机制与指标闭环。',
      '没有区分问题优先级和升级路径。',
      '缺少对退款争议和履约问题的根因分析。',
      '跨部门协同动作不明确。'
    ],
    starTemplate: {
      situation: '旺季物流延迟导致投诉率上升，客服满意度连续下滑。',
      task: '在两周内稳定投诉率并恢复SLA达成。',
      action: [
        '按问题类型分层工单并优化自动分流规则。',
        '联合物流与仓配团队建立异常预警和快速补偿机制。',
        '同步更新客服知识库并强化高风险话术。'
      ],
      result: [
        '投诉率下降且SLA恢复到目标区间。',
        '形成旺季客服应急策略手册。'
      ],
      proof_materials: ['工单看板', '异常升级记录', '服务复盘报告']
    },
    writtenAdds: [
      { id: 'IND_ECOMMERCE_CROSSBORDER_WRITTEN_V161_R011E_01', stage: 'campus_early_batch_written', round: '提前批笔试', scenarioBucket: 'business_scenario', type: '投诉高峰处置题', prompt: '【行业:电商与跨境电商｜岗位:跨境客服策略运营｜阶段:提前批笔试】投诉量突增时你如何快速稳定服务指标？' },
      { id: 'IND_ECOMMERCE_CROSSBORDER_WRITTEN_V161_R011E_02', stage: 'campus_main_batch_written', round: '主批笔试', scenarioBucket: 'system_process', type: '客服策略体系设计', prompt: '【行业:电商与跨境电商｜岗位:跨境客服策略运营｜阶段:主批笔试】请设计“识别-分流-处理-复盘”客服策略体系。' },
      { id: 'IND_ECOMMERCE_CROSSBORDER_WRITTEN_V161_R011E_03', stage: 'campus_supplement_written', round: '补录笔试', scenarioBucket: 'failure_review', type: 'SLA失守复盘', prompt: '【行业:电商与跨境电商｜岗位:跨境客服策略运营｜阶段:补录笔试】服务SLA连续失守后你如何复盘机制问题？' },
      { id: 'IND_ECOMMERCE_CROSSBORDER_WRITTEN_V161_R011E_04', stage: 'internship_conversion_written', round: '实习转正笔试', scenarioBucket: 'metric_tradeoff', type: '成本体验平衡', prompt: '【行业:电商与跨境电商｜岗位:跨境客服策略运营｜阶段:实习转正笔试】降本目标和满意度目标冲突时你如何决策？' }
    ],
    interviewAdds: [
      { id: 'IND_ECOMMERCE_CROSSBORDER_INTERVIEW_V161_R011E_01', stage: 'campus_early_batch_interview', round: '提前批面试', scenarioBucket: 'business_scenario', type: '紧急响应题', prompt: '【行业:电商与跨境电商｜岗位:跨境客服策略运营｜阶段:提前批面试】黑五当天客服系统拥堵时你如何应急？' },
      { id: 'IND_ECOMMERCE_CROSSBORDER_INTERVIEW_V161_R011E_02', stage: 'campus_main_batch_interview', round: '主批面试', scenarioBucket: 'cross_team_collaboration', type: '跨部门协同题', prompt: '【行业:电商与跨境电商｜岗位:跨境客服策略运营｜阶段:主批面试】物流和客服对责任归因冲突时你怎么推进？' },
      { id: 'IND_ECOMMERCE_CROSSBORDER_INTERVIEW_V161_R011E_03', stage: 'campus_supplement_interview', round: '补录面试', scenarioBucket: 'failure_review', type: '争议处理复盘', prompt: '【行业:电商与跨境电商｜岗位:跨境客服策略运营｜阶段:补录面试】讲一次你处理集中差评并扭转口碑的经历。' },
      { id: 'IND_ECOMMERCE_CROSSBORDER_INTERVIEW_V161_R011E_04', stage: 'internship_conversion_interview', round: '实习转正面试', scenarioBucket: 'metric_tradeoff', type: '优先级沟通题', prompt: '【行业:电商与跨境电商｜岗位:跨境客服策略运营｜阶段:实习转正面试】预算受限时你如何解释服务策略优先级？' }
    ]
  },
  {
    file: 'data/entries/IND_ENERGY_UTILITIES.json',
    roleId: 'IND_ENERGY_UTILITIES_ROLE_011',
    roleName: '新能源项目开发',
    rolePatch: {
      role_readiness_floor: '至少完成1个新能源项目开发闭环：资源评估、方案测算、报批推进和并网协调。',
      day_in_life: '新能源项目开发工作周：踏勘资源条件、测算项目收益、推进前期手续、协调并网和施工节点。',
      growth_path_1to3_year: '0-1年掌握项目流程和政策要求；1-3年独立推动单体项目落地；3-5年可负责区域项目组合开发。',
      transfer_path_hint: '可转新能源投资分析、工程管理、电力交易；需补财务模型和并网规则，过渡6-10个月。',
      prep_90d_plan: [
        '1-30天：梳理新能源项目开发全流程和关键节点。',
        '31-60天：完成1个项目收益测算和风险评估案例。',
        '61-90天：完成10套项目开发题训练，强化政策与商务协同表达。'
      ],
      career_outlook_3to5_year: '新能源装机持续增长，项目开发岗位需求强，能力重点转向复杂区域协调和收益稳定性。',
      typical_work_week: '前期审批和并网窗口期任务密集，跨部门沟通占比高。',
      switch_directions: [
        { target_role: '新能源投资分析', switch_cost: '中', bridge_skills: ['财务建模', '投资评审'], transition_period: '6-9个月' },
        { target_role: '工程管理', switch_cost: '中', bridge_skills: ['施工管理', '进度控制'], transition_period: '5-8个月' },
        { target_role: '电力交易', switch_cost: '中高', bridge_skills: ['交易规则', '收益优化'], transition_period: '7-10个月' }
      ],
      prepare_180d_plan: [
        '91-120天：建立项目节点风险分级与预警机制。',
        '121-150天：主导1次并网推进专项复盘。',
        '151-180天：沉淀项目开发标准流程与资料模板。'
      ],
      role_scope_text: '负责新能源项目前期开发与落地推进，对项目进度、合规手续和收益可行性负责。'
    },
    commonDeductionPoints: [
      '只讲项目机会，不讲收益与风险边界。',
      '审批和并网路径不清晰。',
      '缺少关键节点计划与应急预案。',
      '商务与工程协同逻辑不完整。'
    ],
    starTemplate: {
      situation: '目标项目因审批滞后和并网排队，存在延期风险。',
      task: '确保核心里程碑按期推进并控制收益损失。',
      action: [
        '重排节点计划并识别审批瓶颈。',
        '与政府、并网方和施工方建立周度推进机制。',
        '同步更新收益测算并制定备选路径。'
      ],
      result: [
        '关键节点如期完成并网，延期风险可控。',
        '形成可复用的项目推进看板和协调机制。'
      ],
      proof_materials: ['项目里程碑计划', '并网沟通纪要', '收益测算表']
    },
    writtenAdds: [
      { id: 'IND_ENERGY_UTILITIES_WRITTEN_V161_R011E_01', stage: 'campus_early_batch_written', round: '提前批笔试', scenarioBucket: 'business_scenario', type: '项目延期应对题', prompt: '【行业:能源与公用事业｜岗位:新能源项目开发｜阶段:提前批笔试】项目审批滞后时你如何保住关键节点？' },
      { id: 'IND_ENERGY_UTILITIES_WRITTEN_V161_R011E_02', stage: 'campus_main_batch_written', round: '主批笔试', scenarioBucket: 'system_process', type: '开发流程设计题', prompt: '【行业:能源与公用事业｜岗位:新能源项目开发｜阶段:主批笔试】请设计“评估-报批-建设-并网”开发流程。' },
      { id: 'IND_ENERGY_UTILITIES_WRITTEN_V161_R011E_03', stage: 'campus_supplement_written', round: '补录笔试', scenarioBucket: 'failure_review', type: '并网失败复盘', prompt: '【行业:能源与公用事业｜岗位:新能源项目开发｜阶段:补录笔试】一次并网延期后你如何复盘并修正策略？' },
      { id: 'IND_ENERGY_UTILITIES_WRITTEN_V161_R011E_04', stage: 'internship_conversion_written', round: '实习转正笔试', scenarioBucket: 'metric_tradeoff', type: '进度收益平衡', prompt: '【行业:能源与公用事业｜岗位:新能源项目开发｜阶段:实习转正笔试】赶工进度与项目收益冲突时你如何取舍？' }
    ],
    interviewAdds: [
      { id: 'IND_ENERGY_UTILITIES_INTERVIEW_V161_R011E_01', stage: 'campus_early_batch_interview', round: '提前批面试', scenarioBucket: 'business_scenario', type: '外部协调沟通', prompt: '【行业:能源与公用事业｜岗位:新能源项目开发｜阶段:提前批面试】地方审批方临时调整要求时你如何应对？' },
      { id: 'IND_ENERGY_UTILITIES_INTERVIEW_V161_R011E_02', stage: 'campus_main_batch_interview', round: '主批面试', scenarioBucket: 'cross_team_collaboration', type: '跨团队推进题', prompt: '【行业:能源与公用事业｜岗位:新能源项目开发｜阶段:主批面试】工程与商务对节点安排冲突时你如何协调？' },
      { id: 'IND_ENERGY_UTILITIES_INTERVIEW_V161_R011E_03', stage: 'campus_supplement_interview', round: '补录面试', scenarioBucket: 'failure_review', type: '手续缺失复盘', prompt: '【行业:能源与公用事业｜岗位:新能源项目开发｜阶段:补录面试】讲一次你因手续缺失导致延期后的整改经历。' },
      { id: 'IND_ENERGY_UTILITIES_INTERVIEW_V161_R011E_04', stage: 'internship_conversion_interview', round: '实习转正面试', scenarioBucket: 'metric_tradeoff', type: '风险优先级决策', prompt: '【行业:能源与公用事业｜岗位:新能源项目开发｜阶段:实习转正面试】多个项目并行时你如何分配精力与资源？' }
    ]
  },
  {
    file: 'data/entries/IND_FIN_BANK.json',
    roleId: 'IND_FIN_BANK_ROLE_011',
    roleName: '对公客户经理',
    rolePatch: {
      role_readiness_floor: '至少完成1个对公客户开发与维护案例：需求诊断、授信协同、产品组合和风险跟踪。',
      day_in_life: '对公客户经理工作周：拜访企业客户、梳理资金需求、联动授信审批、跟进产品落地、监测贷后风险。',
      growth_path_1to3_year: '0-1年掌握对公产品与流程；1-3年独立经营客户组合；3-5年可主导重点行业客户开发。',
      transfer_path_hint: '可转公司金融产品经理、授信审查、投行承做支持；需补财务分析和行业研究，过渡6-10个月。',
      prep_90d_plan: [
        '1-30天：梳理对公客户画像与产品匹配逻辑。',
        '31-60天：完成1个客户综合授信方案案例。',
        '61-90天：完成10套对公客户经理题训练，强化方案落地与风险表达。'
      ],
      career_outlook_3to5_year: '银行对公业务结构升级持续推进，对公客户经理需求稳定，能力重点转向行业化经营与综合金融方案。',
      typical_work_week: '客户拜访与内部审批并行，季末和授信评审窗口任务高峰明显。',
      switch_directions: [
        { target_role: '公司金融产品经理', switch_cost: '中', bridge_skills: ['产品设计', '行业方案'], transition_period: '6-9个月' },
        { target_role: '授信审查', switch_cost: '中高', bridge_skills: ['财务尽调', '风险评估'], transition_period: '7-10个月' },
        { target_role: '投行承做支持', switch_cost: '中高', bridge_skills: ['项目融资', '交易结构'], transition_period: '7-10个月' }
      ],
      prepare_180d_plan: [
        '91-120天：建立客户分层经营与预警机制。',
        '121-150天：主导1次重点客户综合服务方案复盘。',
        '151-180天：沉淀对公客户开发和贷后跟踪模板。'
      ],
      role_scope_text: '负责企业客户开发与综合金融服务，对客户经营增长、产品落地和风险可控性负责。'
    },
    commonDeductionPoints: [
      '只讲营销动作，不讲客户经营逻辑。',
      '授信方案缺少财务与风险依据。',
      '产品组合与客户需求匹配不清。',
      '贷后风险跟踪机制缺失。'
    ],
    starTemplate: {
      situation: '重点企业客户资金紧张且授信审批周期长，存在流失风险。',
      task: '在风险可控前提下快速落地综合金融方案，稳定客户关系。',
      action: [
        '联合风控评估客户现金流和还款能力。',
        '重构产品组合并优化审批路径。',
        '建立贷后监测和周度沟通机制。'
      ],
      result: [
        '方案按期落地并提升客户黏性。',
        '风险指标可控且形成可复制客户经营打法。'
      ],
      proof_materials: ['客户方案书', '授信审批记录', '贷后跟踪报表']
    },
    writtenAdds: [
      { id: 'IND_FIN_BANK_WRITTEN_V161_R011E_01', stage: 'campus_early_batch_written', round: '提前批笔试', scenarioBucket: 'business_scenario', type: '客户流失挽回题', prompt: '【行业:金融-银行｜岗位:对公客户经理｜阶段:提前批笔试】重点客户有流失风险时你如何设计挽回方案？' },
      { id: 'IND_FIN_BANK_WRITTEN_V161_R011E_02', stage: 'campus_main_batch_written', round: '主批笔试', scenarioBucket: 'system_process', type: '对公经营流程设计', prompt: '【行业:金融-银行｜岗位:对公客户经理｜阶段:主批笔试】请设计“获客-授信-落地-贷后”经营流程。' },
      { id: 'IND_FIN_BANK_WRITTEN_V161_R011E_03', stage: 'campus_supplement_written', round: '补录笔试', scenarioBucket: 'failure_review', type: '授信失败复盘', prompt: '【行业:金融-银行｜岗位:对公客户经理｜阶段:补录笔试】一次授信审批失败后你如何复盘并重做方案？' },
      { id: 'IND_FIN_BANK_WRITTEN_V161_R011E_04', stage: 'internship_conversion_written', round: '实习转正笔试', scenarioBucket: 'metric_tradeoff', type: '增长风险平衡', prompt: '【行业:金融-银行｜岗位:对公客户经理｜阶段:实习转正笔试】业务增长目标与风险控制冲突时你如何取舍？' }
    ],
    interviewAdds: [
      { id: 'IND_FIN_BANK_INTERVIEW_V161_R011E_01', stage: 'campus_early_batch_interview', round: '提前批面试', scenarioBucket: 'business_scenario', type: '客户经营沟通题', prompt: '【行业:金融-银行｜岗位:对公客户经理｜阶段:提前批面试】客户认为审批太慢准备转行时你怎么沟通？' },
      { id: 'IND_FIN_BANK_INTERVIEW_V161_R011E_02', stage: 'campus_main_batch_interview', round: '主批面试', scenarioBucket: 'cross_team_collaboration', type: '前中后台协同', prompt: '【行业:金融-银行｜岗位:对公客户经理｜阶段:主批面试】业务、风控、法务意见冲突时你如何推进项目？' },
      { id: 'IND_FIN_BANK_INTERVIEW_V161_R011E_03', stage: 'campus_supplement_interview', round: '补录面试', scenarioBucket: 'failure_review', type: '贷后预警复盘', prompt: '【行业:金融-银行｜岗位:对公客户经理｜阶段:补录面试】讲一次你识别并处置贷后风险预警的经历。' },
      { id: 'IND_FIN_BANK_INTERVIEW_V161_R011E_04', stage: 'internship_conversion_interview', round: '实习转正面试', scenarioBucket: 'metric_tradeoff', type: '组合管理取舍', prompt: '【行业:金融-银行｜岗位:对公客户经理｜阶段:实习转正面试】有限资源下你如何给客户组合分配服务优先级？' }
    ]
  },
  {
    file: 'data/entries/IND_FIN_SECURITIES_FUND.json',
    roleId: 'IND_FIN_SECURITIES_FUND_ROLE_011',
    roleName: '固收研究助理',
    rolePatch: {
      role_readiness_floor: '至少完成1个固收研究项目：信用分析、收益归因、久期策略和风险提示。',
      day_in_life: '固收研究助理工作周：跟踪债券发行与评级变动、更新信用数据库、撰写晨报、支持组合归因和策略复盘。',
      growth_path_1to3_year: '0-1年掌握固收市场和估值框架；1-3年独立输出行业与信用研究；3-5年可参与策略制定与组合建议。',
      transfer_path_hint: '可转固收交易员、信用评级分析师、宏观研究员；需补交易执行与宏观框架，过渡6-10个月。',
      prep_90d_plan: [
        '1-30天：梳理利率债与信用债分析框架。',
        '31-60天：完成1个信用事件跟踪和归因案例。',
        '61-90天：完成10套固收研究题训练，强化观点证据链与风险提示。'
      ],
      career_outlook_3to5_year: '债券市场波动常态化，固收研究岗位需求稳定，能力重点转向信用深挖和组合视角研究。',
      typical_work_week: '市场波动与政策窗口影响明显，晨会和盘后复盘节奏固定。',
      switch_directions: [
        { target_role: '固收交易员', switch_cost: '中高', bridge_skills: ['交易执行', '盘面判断'], transition_period: '7-10个月' },
        { target_role: '信用评级分析师', switch_cost: '中', bridge_skills: ['主体信用', '财务建模'], transition_period: '6-9个月' },
        { target_role: '宏观研究员', switch_cost: '中高', bridge_skills: ['宏观框架', '政策研究'], transition_period: '7-10个月' }
      ],
      prepare_180d_plan: [
        '91-120天：建立信用风险预警和跟踪机制。',
        '121-150天：主导1次组合归因专项复盘。',
        '151-180天：沉淀固收研究模板与观点校验流程。'
      ],
      role_scope_text: '负责固收市场研究与策略支持，对研究结论准确性、风险提示及时性和组合支持效果负责。'
    },
    commonDeductionPoints: [
      '研究结论缺少数据支撑。',
      '只讲收益不讲风险暴露。',
      '信用事件跟踪不连续。',
      '观点无法落到组合建议。'
    ],
    starTemplate: {
      situation: '组合持仓主体出现信用负面事件，市场波动放大。',
      task: '在短时间内评估影响并提出可执行调整建议。',
      action: [
        '快速更新主体财务与信用事件信息。',
        '评估持仓暴露与收益回撤风险。',
        '形成分层处置建议并跟踪执行效果。'
      ],
      result: [
        '组合回撤控制在阈值内。',
        '形成信用事件应对标准化流程。'
      ],
      proof_materials: ['信用跟踪报告', '组合归因分析', '策略建议纪要']
    },
    writtenAdds: [
      { id: 'IND_FIN_SECURITIES_FUND_WRITTEN_V161_R011E_01', stage: 'campus_early_batch_written', round: '提前批笔试', scenarioBucket: 'business_scenario', type: '信用事件应对题', prompt: '【行业:金融-证券基金｜岗位:固收研究助理｜阶段:提前批笔试】持仓主体突发负面事件时你如何评估并给建议？' },
      { id: 'IND_FIN_SECURITIES_FUND_WRITTEN_V161_R011E_02', stage: 'campus_main_batch_written', round: '主批笔试', scenarioBucket: 'system_process', type: '固收研究流程设计', prompt: '【行业:金融-证券基金｜岗位:固收研究助理｜阶段:主批笔试】请设计“跟踪-分析-建议-复盘”研究流程。' },
      { id: 'IND_FIN_SECURITIES_FUND_WRITTEN_V161_R011E_03', stage: 'campus_supplement_written', round: '补录笔试', scenarioBucket: 'failure_review', type: '研究误判复盘', prompt: '【行业:金融-证券基金｜岗位:固收研究助理｜阶段:补录笔试】一次信用判断误差后你如何复盘并修正框架？' },
      { id: 'IND_FIN_SECURITIES_FUND_WRITTEN_V161_R011E_04', stage: 'internship_conversion_written', round: '实习转正笔试', scenarioBucket: 'metric_tradeoff', type: '收益风险取舍', prompt: '【行业:金融-证券基金｜岗位:固收研究助理｜阶段:实习转正笔试】收益机会与信用风险冲突时你如何做决策？' }
    ],
    interviewAdds: [
      { id: 'IND_FIN_SECURITIES_FUND_INTERVIEW_V161_R011E_01', stage: 'campus_early_batch_interview', round: '提前批面试', scenarioBucket: 'business_scenario', type: '快速研判沟通题', prompt: '【行业:金融-证券基金｜岗位:固收研究助理｜阶段:提前批面试】盘中突发信用消息时你如何向投资经理汇报？' },
      { id: 'IND_FIN_SECURITIES_FUND_INTERVIEW_V161_R011E_02', stage: 'campus_main_batch_interview', round: '主批面试', scenarioBucket: 'cross_team_collaboration', type: '投研协同题', prompt: '【行业:金融-证券基金｜岗位:固收研究助理｜阶段:主批面试】研究观点与交易执行意见冲突时你如何推进？' },
      { id: 'IND_FIN_SECURITIES_FUND_INTERVIEW_V161_R011E_03', stage: 'campus_supplement_interview', round: '补录面试', scenarioBucket: 'failure_review', type: '归因偏差复盘', prompt: '【行业:金融-证券基金｜岗位:固收研究助理｜阶段:补录面试】讲一次你在组合归因中发现偏差并修正的经历。' },
      { id: 'IND_FIN_SECURITIES_FUND_INTERVIEW_V161_R011E_04', stage: 'internship_conversion_interview', round: '实习转正面试', scenarioBucket: 'metric_tradeoff', type: '研究优先级取舍', prompt: '【行业:金融-证券基金｜岗位:固收研究助理｜阶段:实习转正面试】多个跟踪标的并行时你如何安排研究优先级？' }
    ]
  },
  {
    file: 'data/entries/IND_NEW_ENERGY.json',
    roleId: 'IND_NEW_ENERGY_ROLE_011',
    roleName: '光伏系统工程师',
    rolePatch: {
      role_readiness_floor: '至少完成1个光伏系统项目：方案设计、设备选型、发电量测算和并网调试。',
      day_in_life: '光伏系统工程师工作周：现场勘测、方案出图、设备参数校核、施工联调、发电性能监测与优化。',
      growth_path_1to3_year: '0-1年掌握系统设计与规范；1-3年独立负责项目方案与调试；3-5年可主导复杂场景系统优化。',
      transfer_path_hint: '可转储能系统工程师、电站运维经理、新能源项目技术经理；需补储能控制和项目管理，过渡5-9个月。',
      prep_90d_plan: [
        '1-30天：梳理光伏系统设计参数和约束。',
        '31-60天：完成1个发电量偏差诊断与优化案例。',
        '61-90天：完成10套光伏系统题训练，强化设计计算与落地协同。'
      ],
      career_outlook_3to5_year: '分布式与集中式光伏持续扩张，系统工程岗位需求稳定增长，能力重心向全生命周期效率优化。',
      typical_work_week: '设计与现场并行推进，施工并网阶段任务峰值明显。',
      switch_directions: [
        { target_role: '储能系统工程师', switch_cost: '中', bridge_skills: ['PCS/BMS', '调度策略'], transition_period: '5-8个月' },
        { target_role: '电站运维经理', switch_cost: '中', bridge_skills: ['运维体系', '故障管理'], transition_period: '5-8个月' },
        { target_role: '新能源项目技术经理', switch_cost: '中高', bridge_skills: ['项目统筹', '技术评审'], transition_period: '6-9个月' }
      ],
      prepare_180d_plan: [
        '91-120天：建立关键设备故障和性能偏差监控机制。',
        '121-150天：主导1次并网调试问题复盘专项。',
        '151-180天：沉淀光伏系统设计与验收标准模板。'
      ],
      role_scope_text: '负责光伏系统方案设计与实施优化，对发电效率、系统稳定性和并网交付质量负责。'
    },
    commonDeductionPoints: [
      '方案描述不含关键设计参数。',
      '发电量测算缺少边界条件。',
      '并网调试流程和风险预案不清。',
      '忽视施工与运维协同。'
    ],
    starTemplate: {
      situation: '项目并网后发电量低于测算值，业主要求快速给出优化方案。',
      task: '在两周内定位偏差原因并恢复发电效率。',
      action: [
        '排查组件、逆变器和接线配置参数。',
        '对比气象与遮挡数据，校准测算模型。',
        '实施参数优化并复测输出表现。'
      ],
      result: [
        '发电效率恢复至目标区间。',
        '形成可复用的发电偏差诊断流程。'
      ],
      proof_materials: ['系统参数表', '调试记录', '发电量对比报告']
    },
    writtenAdds: [
      { id: 'IND_NEW_ENERGY_WRITTEN_V161_R011E_01', stage: 'campus_early_batch_written', round: '提前批笔试', scenarioBucket: 'business_scenario', type: '发电偏差诊断题', prompt: '【行业:新能源｜岗位:光伏系统工程师｜阶段:提前批笔试】并网后发电量低于预期，你如何定位并优化？' },
      { id: 'IND_NEW_ENERGY_WRITTEN_V161_R011E_02', stage: 'campus_main_batch_written', round: '主批笔试', scenarioBucket: 'system_process', type: '系统设计流程题', prompt: '【行业:新能源｜岗位:光伏系统工程师｜阶段:主批笔试】请设计“勘测-设计-施工-并网”系统流程。' },
      { id: 'IND_NEW_ENERGY_WRITTEN_V161_R011E_03', stage: 'campus_supplement_written', round: '补录笔试', scenarioBucket: 'failure_review', type: '调试失败复盘', prompt: '【行业:新能源｜岗位:光伏系统工程师｜阶段:补录笔试】一次并网调试失败后你如何复盘并改进？' },
      { id: 'IND_NEW_ENERGY_WRITTEN_V161_R011E_04', stage: 'internship_conversion_written', round: '实习转正笔试', scenarioBucket: 'metric_tradeoff', type: '成本效率平衡', prompt: '【行业:新能源｜岗位:光伏系统工程师｜阶段:实习转正笔试】预算受限时如何兼顾系统成本与发电效率？' }
    ],
    interviewAdds: [
      { id: 'IND_NEW_ENERGY_INTERVIEW_V161_R011E_01', stage: 'campus_early_batch_interview', round: '提前批面试', scenarioBucket: 'business_scenario', type: '现场异常应对题', prompt: '【行业:新能源｜岗位:光伏系统工程师｜阶段:提前批面试】现场条件与前期勘测差异较大时你如何调整方案？' },
      { id: 'IND_NEW_ENERGY_INTERVIEW_V161_R011E_02', stage: 'campus_main_batch_interview', round: '主批面试', scenarioBucket: 'cross_team_collaboration', type: '施工协同推进', prompt: '【行业:新能源｜岗位:光伏系统工程师｜阶段:主批面试】施工团队和设计团队意见冲突时你如何推进？' },
      { id: 'IND_NEW_ENERGY_INTERVIEW_V161_R011E_03', stage: 'campus_supplement_interview', round: '补录面试', scenarioBucket: 'failure_review', type: '验收问题复盘', prompt: '【行业:新能源｜岗位:光伏系统工程师｜阶段:补录面试】讲一次你处理验收不通过并完成整改的经历。' },
      { id: 'IND_NEW_ENERGY_INTERVIEW_V161_R011E_04', stage: 'internship_conversion_interview', round: '实习转正面试', scenarioBucket: 'metric_tradeoff', type: '交付优先级决策', prompt: '【行业:新能源｜岗位:光伏系统工程师｜阶段:实习转正面试】并行项目交付冲突时你如何排优先级？' }
    ]
  },
  {
    file: 'data/entries/IND_PUBLIC_INSTITUTION.json',
    roleId: 'IND_PUBLIC_INSTITUTION_ROLE_011',
    roleName: '人事管理岗',
    rolePatch: {
      role_readiness_floor: '至少完成1个人事管理项目：编制配置、招聘录用、绩效考核与人员发展闭环。',
      day_in_life: '人事管理岗工作周：人员需求沟通、招聘流程推进、档案与合同管理、绩效数据汇总、制度宣导与答疑。',
      growth_path_1to3_year: '0-1年掌握人事流程和政策规范；1-3年独立负责招聘与绩效模块；3-5年可主导组织优化与人才发展项目。',
      transfer_path_hint: '可转组织发展、薪酬绩效、党建人事专员；需补组织诊断和数据分析能力，过渡4-8个月。',
      prep_90d_plan: [
        '1-30天：梳理人事制度和关键流程节点。',
        '31-60天：完成1个招聘到入职闭环案例。',
        '61-90天：完成10套人事管理题训练，强化制度执行与沟通能力。'
      ],
      career_outlook_3to5_year: '事业单位管理规范化持续深化，人事管理岗位需求稳定，能力重心向数据化管理和组织协同提升。',
      typical_work_week: '招聘季和考核季任务高峰明显，制度执行和答疑并行推进。',
      switch_directions: [
        { target_role: '组织发展', switch_cost: '中', bridge_skills: ['组织诊断', '岗位体系'], transition_period: '5-8个月' },
        { target_role: '薪酬绩效', switch_cost: '中', bridge_skills: ['绩效指标', '薪酬核算'], transition_period: '5-8个月' },
        { target_role: '党建人事专员', switch_cost: '低中', bridge_skills: ['政策解读', '制度执行'], transition_period: '4-6个月' }
      ],
      prepare_180d_plan: [
        '91-120天：建立招聘与流动数据看板。',
        '121-150天：主导1次绩效流程优化专项。',
        '151-180天：沉淀人事问答库与制度执行手册。'
      ],
      role_scope_text: '负责人事管理流程执行与优化，对招聘交付、制度合规和人员管理质量负责。'
    },
    commonDeductionPoints: [
      '只讲事务性工作，缺少组织视角。',
      '制度执行不含风险点和合规意识。',
      '招聘与绩效数据分析能力不足。',
      '跨部门沟通方案不具体。'
    ],
    starTemplate: {
      situation: '关键岗位招聘长期未达成，影响部门运转效率。',
      task: '在限定周期内补齐编制并优化后续招聘机制。',
      action: [
        '与用人部门重构岗位画像和筛选标准。',
        '优化招聘渠道和面试流程节奏。',
        '建立入职后跟踪和留存分析机制。'
      ],
      result: [
        '关键岗位按期补齐并稳定在岗。',
        '形成可复用的招聘提效机制。'
      ],
      proof_materials: ['招聘进度表', '岗位画像文档', '留存分析报告']
    },
    writtenAdds: [
      { id: 'IND_PUBLIC_INSTITUTION_WRITTEN_V161_R011E_01', stage: 'campus_early_batch_written', round: '提前批笔试', scenarioBucket: 'business_scenario', type: '招聘难岗攻坚题', prompt: '【行业:事业单位体系｜岗位:人事管理岗｜阶段:提前批笔试】关键岗位长期招不到人时你如何破局？' },
      { id: 'IND_PUBLIC_INSTITUTION_WRITTEN_V161_R011E_02', stage: 'campus_main_batch_written', round: '主批笔试', scenarioBucket: 'system_process', type: '人事流程设计题', prompt: '【行业:事业单位体系｜岗位:人事管理岗｜阶段:主批笔试】请设计“招聘-入职-考核-发展”人事流程。' },
      { id: 'IND_PUBLIC_INSTITUTION_WRITTEN_V161_R011E_03', stage: 'campus_supplement_written', round: '补录笔试', scenarioBucket: 'failure_review', type: '绩效争议复盘', prompt: '【行业:事业单位体系｜岗位:人事管理岗｜阶段:补录笔试】一次绩效争议事件后你如何复盘流程问题？' },
      { id: 'IND_PUBLIC_INSTITUTION_WRITTEN_V161_R011E_04', stage: 'internship_conversion_written', round: '实习转正笔试', scenarioBucket: 'metric_tradeoff', type: '效率公平平衡', prompt: '【行业:事业单位体系｜岗位:人事管理岗｜阶段:实习转正笔试】效率提升与程序公平冲突时你如何处理？' }
    ],
    interviewAdds: [
      { id: 'IND_PUBLIC_INSTITUTION_INTERVIEW_V161_R011E_01', stage: 'campus_early_batch_interview', round: '提前批面试', scenarioBucket: 'business_scenario', type: '制度宣导沟通题', prompt: '【行业:事业单位体系｜岗位:人事管理岗｜阶段:提前批面试】新制度落地阻力大时你如何推进？' },
      { id: 'IND_PUBLIC_INSTITUTION_INTERVIEW_V161_R011E_02', stage: 'campus_main_batch_interview', round: '主批面试', scenarioBucket: 'cross_team_collaboration', type: '部门协同题', prompt: '【行业:事业单位体系｜岗位:人事管理岗｜阶段:主批面试】用人部门与人事制度要求冲突时你如何协调？' },
      { id: 'IND_PUBLIC_INSTITUTION_INTERVIEW_V161_R011E_03', stage: 'campus_supplement_interview', round: '补录面试', scenarioBucket: 'failure_review', type: '招聘失效复盘', prompt: '【行业:事业单位体系｜岗位:人事管理岗｜阶段:补录面试】讲一次招聘方案失效后你如何优化流程。' },
      { id: 'IND_PUBLIC_INSTITUTION_INTERVIEW_V161_R011E_04', stage: 'internship_conversion_interview', round: '实习转正面试', scenarioBucket: 'metric_tradeoff', type: '资源分配决策', prompt: '【行业:事业单位体系｜岗位:人事管理岗｜阶段:实习转正面试】招聘、培训、绩效任务并行时你如何排优先级？' }
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
    data_origin: 'official_jd_competency_mapping_with_manual_role_enrichment_v161_batch5',
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
  role.role_detail_v158.expansion_status = 'landed_deep_profile_v161_batch5';

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
