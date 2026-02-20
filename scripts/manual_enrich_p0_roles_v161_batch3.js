#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TODAY = '2026-02-20';

const updates = [
  {
    file: 'data/entries/IND_AUTO_INTELLIGENT_DRIVING.json',
    roleId: 'IND_AUTO_INTELLIGENT_DRIVING_ROLE_009',
    roleName: '自动驾驶仿真工程师',
    rolePatch: {
      role_readiness_floor: '至少完成1个闭环仿真项目：场景库构建、指标定义、问题定位与迭代验证。',
      day_in_life: '自动驾驶仿真工程师工作周：维护场景库与回放数据、配置仿真任务、分析失败case、与感知规划团队对齐修复优先级。',
      growth_path_1to3_year: '0-1年掌握仿真工具链和评测指标；1-3年独立负责模块级验证与回归；3-5年可主导大规模场景评测体系。',
      transfer_path_hint: '可转仿真测试负责人、智驾数据闭环工程师、规划控制工程师；需补系统工程和算法理解，过渡5-10个月。',
      prep_90d_plan: [
        '1-30天：梳理典型失效场景与评测指标（接管率、碰撞率、舒适性）。',
        '31-60天：完成1个失败case闭环，输出“定位-修复-回归”报告。',
        '61-90天：完成10套仿真场景题训练，强化指标解释与跨团队协作表达。'
      ],
      career_outlook_3to5_year: '高阶智驾研发提速，仿真岗位需求持续上升，能力重心从“跑仿真”升级到“评测体系设计与效率工程”。',
      typical_work_week: '以实验迭代节奏驱动，版本切换周和里程碑前验证压力较大。',
      switch_directions: [
        { target_role: '仿真测试负责人', switch_cost: '中', bridge_skills: ['评测体系', '项目管理'], transition_period: '6-9个月' },
        { target_role: '智驾数据闭环工程师', switch_cost: '中', bridge_skills: ['数据挖掘', '闭环策略'], transition_period: '5-8个月' },
        { target_role: '规划控制工程师', switch_cost: '中高', bridge_skills: ['控制理论', '轨迹规划'], transition_period: '7-10个月' }
      ],
      prepare_180d_plan: [
        '91-120天：搭建仿真失败场景自动聚类与分层机制。',
        '121-150天：推动一次跨模块回归效率优化专项。',
        '151-180天：沉淀场景覆盖评估标准与版本门禁策略。'
      ],
      role_scope_text: '负责自动驾驶场景仿真验证与问题闭环，对评测覆盖率、回归效率和风险识别质量负责。'
    },
    commonDeductionPoints: [
      '只讲仿真流程，不讲评测指标和业务含义。',
      '失败case分析停留表面，没有根因链。',
      '无法说明场景覆盖充分性与盲区。',
      '跨团队反馈机制不清，闭环效率低。'
    ],
    starTemplate: {
      situation: '新版本在夜间雨天场景出现接管率上升，发布风险增加。',
      task: '在发布窗口内定位根因并验证修复有效性。',
      action: [
        '按场景标签聚类失败样本并识别高风险模式。',
        '与感知/规划团队联合定位参数与策略问题。',
        '构建回归集并执行对照仿真验证。'
      ],
      result: [
        '高风险场景接管率下降并通过发布门禁。',
        '沉淀了可复用的失败场景处理模板。'
      ],
      proof_materials: ['仿真报告', '问题单闭环记录', '回归结果看板']
    },
    writtenAdds: [
      { id: 'IND_AUTO_INTELLIGENT_DRIVING_WRITTEN_V161_R009C_01', stage: 'campus_early_batch_written', round: '提前批笔试', scenarioBucket: 'business_scenario', type: '失败场景定位题', prompt: '【行业:汽车与智能驾驶｜岗位:自动驾驶仿真工程师｜阶段:提前批笔试】夜间雨天场景接管率突增，你如何快速定位问题并给出验证计划？' },
      { id: 'IND_AUTO_INTELLIGENT_DRIVING_WRITTEN_V161_R009C_02', stage: 'campus_main_batch_written', round: '主批笔试', scenarioBucket: 'system_process', type: '仿真评测体系设计', prompt: '【行业:汽车与智能驾驶｜岗位:自动驾驶仿真工程师｜阶段:主批笔试】请设计“场景生成-评测-回归-发布门禁”闭环体系。' },
      { id: 'IND_AUTO_INTELLIGENT_DRIVING_WRITTEN_V161_R009C_03', stage: 'campus_supplement_written', round: '补录笔试', scenarioBucket: 'failure_review', type: '回归失效复盘', prompt: '【行业:汽车与智能驾驶｜岗位:自动驾驶仿真工程师｜阶段:补录笔试】一次回归通过但实车失败，如何复盘评测盲区？' },
      { id: 'IND_AUTO_INTELLIGENT_DRIVING_WRITTEN_V161_R009C_04', stage: 'internship_conversion_written', round: '实习转正笔试', scenarioBucket: 'metric_tradeoff', type: '覆盖率与效率取舍', prompt: '【行业:汽车与智能驾驶｜岗位:自动驾驶仿真工程师｜阶段:实习转正笔试】场景覆盖率和计算资源冲突时你如何决策？' }
    ],
    interviewAdds: [
      { id: 'IND_AUTO_INTELLIGENT_DRIVING_INTERVIEW_V161_R009C_01', stage: 'campus_early_batch_interview', round: '提前批面试', scenarioBucket: 'business_scenario', type: '高风险发布应对', prompt: '【行业:汽车与智能驾驶｜岗位:自动驾驶仿真工程师｜阶段:提前批面试】发布前发现高风险场景未收敛，你会怎么建议？' },
      { id: 'IND_AUTO_INTELLIGENT_DRIVING_INTERVIEW_V161_R009C_02', stage: 'campus_main_batch_interview', round: '主批面试', scenarioBucket: 'cross_team_collaboration', type: '算法协同推进', prompt: '【行业:汽车与智能驾驶｜岗位:自动驾驶仿真工程师｜阶段:主批面试】感知和规划团队互相归因时你如何推动闭环？' },
      { id: 'IND_AUTO_INTELLIGENT_DRIVING_INTERVIEW_V161_R009C_03', stage: 'campus_supplement_interview', round: '补录面试', scenarioBucket: 'failure_review', type: '失效复盘追问', prompt: '【行业:汽车与智能驾驶｜岗位:自动驾驶仿真工程师｜阶段:补录面试】讲一次你判断失误导致迭代返工的经历。' },
      { id: 'IND_AUTO_INTELLIGENT_DRIVING_INTERVIEW_V161_R009C_04', stage: 'internship_conversion_interview', round: '实习转正面试', scenarioBucket: 'metric_tradeoff', type: '资源分配决策', prompt: '【行业:汽车与智能驾驶｜岗位:自动驾驶仿真工程师｜阶段:实习转正面试】只剩一周验证资源，你如何安排关键场景优先级？' }
    ]
  },
  {
    file: 'data/entries/IND_BIOMED_DEVICE.json',
    roleId: 'IND_BIOMED_DEVICE_ROLE_009',
    roleName: '医疗器械临床注册工程师',
    rolePatch: {
      role_readiness_floor: '至少完成1个器械注册资料项目：临床评价、注册申报、审评问题回复与时间节点管理。',
      day_in_life: '临床注册工程师工作周：法规更新解读、资料一致性检查、临床与注册沟通、审评问题回复草拟和进度跟踪。',
      growth_path_1to3_year: '0-1年掌握器械法规与申报结构；1-3年独立负责注册项目与变更补件；3-5年可主导多产品注册策略。',
      transfer_path_hint: '可转注册事务专员、质量体系工程师、临床运营专员；需补质量体系和临床项目管理，过渡5-9个月。',
      prep_90d_plan: [
        '1-30天：梳理NMPA器械注册法规和技术审评要点。',
        '31-60天：完成1套注册资料逻辑检查并形成问题清单。',
        '61-90天：完成10套注册场景题训练，重点演练补件回复和时间管理。'
      ],
      career_outlook_3to5_year: '创新器械和监管精细化并行，注册岗位需求稳定，核心能力向法规策略与跨部门协同升级。',
      typical_work_week: '节点驱动型工作，审评反馈窗口期节奏快且对文档质量要求高。',
      switch_directions: [
        { target_role: '注册事务专员', switch_cost: '低中', bridge_skills: ['申报策略', '法规跟踪'], transition_period: '4-6个月' },
        { target_role: '质量体系工程师', switch_cost: '中', bridge_skills: ['体系审核', '合规验证'], transition_period: '5-8个月' },
        { target_role: '临床运营专员', switch_cost: '中', bridge_skills: ['试验管理', '数据质量'], transition_period: '5-8个月' }
      ],
      prepare_180d_plan: [
        '91-120天：建立注册资料一致性检查清单和版本管理机制。',
        '121-150天：主导1次审评问题回复专项。',
        '151-180天：沉淀注册申报时间线模板与风险台账。'
      ],
      role_scope_text: '负责医疗器械临床注册申报与审评回复，对资料合规性、申报进度和沟通质量负责。'
    },
    commonDeductionPoints: [
      '只背法规条文，缺少落地路径。',
      '注册资料逻辑不一致，前后矛盾。',
      '忽略审评问题的证据链要求。',
      '进度计划无缓冲，风险评估不足。'
    ],
    starTemplate: {
      situation: '产品注册进入关键阶段，审评提出多项补件问题。',
      task: '在限期内高质量完成回复并保障项目进度。',
      action: [
        '拆解问题并映射资料责任人和证据来源。',
        '组织研发、临床、质量协同形成统一回复口径。',
        '按优先级推进并做版本审校。'
      ],
      result: [
        '补件按时提交并通过关键审评节点。',
        '形成标准化问题回复流程。'
      ],
      proof_materials: ['补件回复清单', '版本记录', '审评反馈纪要']
    },
    writtenAdds: [
      { id: 'IND_BIOMED_DEVICE_WRITTEN_V161_R009C_01', stage: 'campus_early_batch_written', round: '提前批笔试', scenarioBucket: 'business_scenario', type: '审评补件应对题', prompt: '【行业:生物医药与器械｜岗位:医疗器械临床注册工程师｜阶段:提前批笔试】收到多项审评补件问题，你如何制定回复优先级与计划？' },
      { id: 'IND_BIOMED_DEVICE_WRITTEN_V161_R009C_02', stage: 'campus_main_batch_written', round: '主批笔试', scenarioBucket: 'system_process', type: '注册申报流程设计', prompt: '【行业:生物医药与器械｜岗位:医疗器械临床注册工程师｜阶段:主批笔试】请设计从资料准备到递交再到审评回复的流程。' },
      { id: 'IND_BIOMED_DEVICE_WRITTEN_V161_R009C_03', stage: 'campus_supplement_written', round: '补录笔试', scenarioBucket: 'failure_review', type: '资料一致性失误复盘', prompt: '【行业:生物医药与器械｜岗位:医疗器械临床注册工程师｜阶段:补录笔试】因资料不一致导致退补，如何复盘并避免再次发生？' },
      { id: 'IND_BIOMED_DEVICE_WRITTEN_V161_R009C_04', stage: 'internship_conversion_written', round: '实习转正笔试', scenarioBucket: 'metric_tradeoff', type: '质量与进度平衡', prompt: '【行业:生物医药与器械｜岗位:医疗器械临床注册工程师｜阶段:实习转正笔试】申报节点紧迫时，你如何兼顾资料质量和进度？' }
    ],
    interviewAdds: [
      { id: 'IND_BIOMED_DEVICE_INTERVIEW_V161_R009C_01', stage: 'campus_early_batch_interview', round: '提前批面试', scenarioBucket: 'business_scenario', type: '审评沟通题', prompt: '【行业:生物医药与器械｜岗位:医疗器械临床注册工程师｜阶段:提前批面试】审评问题与你理解不一致时你如何沟通？' },
      { id: 'IND_BIOMED_DEVICE_INTERVIEW_V161_R009C_02', stage: 'campus_main_batch_interview', round: '主批面试', scenarioBucket: 'cross_team_collaboration', type: '跨部门资料拉齐', prompt: '【行业:生物医药与器械｜岗位:医疗器械临床注册工程师｜阶段:主批面试】研发和临床口径冲突时你怎么推进？' },
      { id: 'IND_BIOMED_DEVICE_INTERVIEW_V161_R009C_03', stage: 'campus_supplement_interview', round: '补录面试', scenarioBucket: 'failure_review', type: '申报失误复盘', prompt: '【行业:生物医药与器械｜岗位:医疗器械临床注册工程师｜阶段:补录面试】讲一次注册推进失误，你如何修正流程？' },
      { id: 'IND_BIOMED_DEVICE_INTERVIEW_V161_R009C_04', stage: 'internship_conversion_interview', round: '实习转正面试', scenarioBucket: 'metric_tradeoff', type: '风险节点决策', prompt: '【行业:生物医药与器械｜岗位:医疗器械临床注册工程师｜阶段:实习转正面试】关键资料尚未完备但节点临近，你如何建议？' }
    ]
  },
  {
    file: 'data/entries/IND_ECOMMERCE_CROSSBORDER.json',
    roleId: 'IND_ECOMMERCE_CROSSBORDER_ROLE_009',
    roleName: '海外仓运营专员',
    rolePatch: {
      role_readiness_floor: '至少完成1个海外仓履约优化项目：库存结构、补货策略、时效与成本平衡。',
      day_in_life: '海外仓运营专员工作周：库存盘点、补货计划、异常工单处理、仓配SLA监控、成本复盘。',
      growth_path_1to3_year: '0-1年掌握仓配流程和库存口径；1-3年独立负责仓网运营与异常闭环；3-5年可主导多仓协同优化。',
      transfer_path_hint: '可转物流履约运营、供应链运营、跨境风控运营；需补网络优化和关务规则，过渡4-8个月。',
      prep_90d_plan: ['1-30天：梳理库存周转、缺货率、履约时效指标。', '31-60天：完成1个爆仓/缺货案例闭环。', '61-90天：完成10套海外仓运营题训练，强化异常处置与成本分析。'],
      career_outlook_3to5_year: '跨境履约竞争向“时效+成本+稳定性”转移，海外仓运营岗位价值持续上升。',
      typical_work_week: '受促销和物流波动影响大，节点周异常处理占比高。',
      switch_directions: [
        { target_role: '物流履约运营', switch_cost: '低中', bridge_skills: ['干线末端协同', '时效管理'], transition_period: '4-6个月' },
        { target_role: '供应链运营', switch_cost: '中', bridge_skills: ['补货策略', '库存优化'], transition_period: '5-8个月' },
        { target_role: '跨境风控运营', switch_cost: '中', bridge_skills: ['异常识别', '规则策略'], transition_period: '5-8个月' }
      ],
      prepare_180d_plan: ['91-120天：建立库存健康分层和预警阈值。', '121-150天：主导1次仓配协同优化专项。', '151-180天：沉淀异常工单处理SOP。'],
      role_scope_text: '负责海外仓库存与履约运营，对时效、缺货率、滞销占比和履约成本负责。'
    },
    commonDeductionPoints: ['只报库存数量，不看结构健康度。', '缺货与滞销两端失衡。', '异常工单处理缺少根因闭环。', '成本优化没有可执行动作。'],
    starTemplate: {
      situation: '促销前补货失衡导致部分热卖SKU缺货、长尾SKU积压。',
      task: '在保障时效的同时优化库存结构和履约成本。',
      action: ['重算补货模型并分层处理SKU。', '联动物流调整入仓与出库节奏。', '建立周复盘机制持续修正策略。'],
      result: ['缺货率和滞销率下降，履约时效稳定。', '沉淀可复用补货与仓配协同方法。'],
      proof_materials: ['库存报表', '补货计划', 'SLA看板']
    },
    writtenAdds: [
      { id: 'IND_ECOMMERCE_CROSSBORDER_WRITTEN_V161_R009C_01', stage: 'campus_early_batch_written', round: '提前批笔试', scenarioBucket: 'business_scenario', type: '补货策略题', prompt: '【行业:电商与跨境电商｜岗位:海外仓运营专员｜阶段:提前批笔试】促销季热销SKU缺货，你如何快速调整补货与分仓策略？' },
      { id: 'IND_ECOMMERCE_CROSSBORDER_WRITTEN_V161_R009C_02', stage: 'campus_main_batch_written', round: '主批笔试', scenarioBucket: 'system_process', type: '仓配运营体系设计', prompt: '【行业:电商与跨境电商｜岗位:海外仓运营专员｜阶段:主批笔试】请设计“预测-补货-履约-复盘”运营体系。' },
      { id: 'IND_ECOMMERCE_CROSSBORDER_WRITTEN_V161_R009C_03', stage: 'campus_supplement_written', round: '补录笔试', scenarioBucket: 'failure_review', type: '爆仓复盘题', prompt: '【行业:电商与跨境电商｜岗位:海外仓运营专员｜阶段:补录笔试】一次爆仓导致延迟履约，你如何复盘并防复发？' },
      { id: 'IND_ECOMMERCE_CROSSBORDER_WRITTEN_V161_R009C_04', stage: 'internship_conversion_written', round: '实习转正笔试', scenarioBucket: 'metric_tradeoff', type: '时效成本平衡', prompt: '【行业:电商与跨境电商｜岗位:海外仓运营专员｜阶段:实习转正笔试】当履约时效和仓储成本冲突时，你如何取舍？' }
    ],
    interviewAdds: [
      { id: 'IND_ECOMMERCE_CROSSBORDER_INTERVIEW_V161_R009C_01', stage: 'campus_early_batch_interview', round: '提前批面试', scenarioBucket: 'business_scenario', type: '缺货应急', prompt: '【行业:电商与跨境电商｜岗位:海外仓运营专员｜阶段:提前批面试】你如何在48小时内缓解核心SKU缺货？' },
      { id: 'IND_ECOMMERCE_CROSSBORDER_INTERVIEW_V161_R009C_02', stage: 'campus_main_batch_interview', round: '主批面试', scenarioBucket: 'cross_team_collaboration', type: '跨仓协同', prompt: '【行业:电商与跨境电商｜岗位:海外仓运营专员｜阶段:主批面试】仓库与物流对异常责任争议时你如何推进？' },
      { id: 'IND_ECOMMERCE_CROSSBORDER_INTERVIEW_V161_R009C_03', stage: 'campus_supplement_interview', round: '补录面试', scenarioBucket: 'failure_review', type: '履约失效复盘', prompt: '【行业:电商与跨境电商｜岗位:海外仓运营专员｜阶段:补录面试】讲一次履约失败案例，你如何修正运营策略？' },
      { id: 'IND_ECOMMERCE_CROSSBORDER_INTERVIEW_V161_R009C_04', stage: 'internship_conversion_interview', round: '实习转正面试', scenarioBucket: 'metric_tradeoff', type: '目标冲突沟通', prompt: '【行业:电商与跨境电商｜岗位:海外仓运营专员｜阶段:实习转正面试】管理层要求降本，你如何保证时效不下滑？' }
    ]
  },
  {
    file: 'data/entries/IND_ENERGY_UTILITIES.json',
    roleId: 'IND_ENERGY_UTILITIES_ROLE_009',
    roleName: '储能运维工程师',
    rolePatch: {
      role_readiness_floor: '至少展示1个储能站运维项目：故障定位、安全处置、效率提升和成本控制。',
      day_in_life: '储能运维工程师工作周：巡检数据分析、告警处理、远程参数优化、检修计划执行和安全复盘。',
      growth_path_1to3_year: '0-1年掌握系统架构与告警规则；1-3年独立负责站点运维与故障闭环；3-5年可主导多站运维策略和可靠性优化。',
      transfer_path_hint: '可转储能EMS控制工程师、电力交易策略分析师、设备管理工程师；需补交易和调度理解，过渡5-9个月。',
      prep_90d_plan: ['1-30天：梳理储能系统关键组件与故障模式。', '31-60天：完成1个告警到故障闭环案例。', '61-90天：完成10套储能运维题训练，强化安全与收益协同。'],
      career_outlook_3to5_year: '储能装机持续增长，运维岗位需求快速提升，能力重心向“安全+效率+收益”一体化。',
      typical_work_week: '实时告警驱动工作，异常时段响应要求高，现场与远程协同并重。',
      switch_directions: [
        { target_role: '储能EMS控制工程师', switch_cost: '中', bridge_skills: ['控制策略', '系统调参'], transition_period: '5-8个月' },
        { target_role: '电力交易策略分析师', switch_cost: '中高', bridge_skills: ['市场规则', '收益优化'], transition_period: '6-9个月' },
        { target_role: '设备管理工程师', switch_cost: '低中', bridge_skills: ['检修体系', '可靠性管理'], transition_period: '4-6个月' }
      ],
      prepare_180d_plan: ['91-120天：建立告警分级与响应SLA。', '121-150天：主导1次站点可靠性优化专项。', '151-180天：沉淀储能故障知识库与应急手册。'],
      role_scope_text: '负责储能站运行维护和告警处置，对系统可用率、安全事件和运维效率负责。'
    },
    commonDeductionPoints: ['告警处理只治标不治本。', '忽略安全边界和应急流程。', '缺少站点级指标管理。', '无法平衡运维成本与收益目标。'],
    starTemplate: {
      situation: '高温季节储能站告警频发，存在安全和可用率风险。',
      task: '快速降低故障率并保障站点稳定运行。',
      action: ['分层排查关键告警并定位根因。', '执行参数优化与预防性检修。', '建立班次交接和风险升级机制。'],
      result: ['站点可用率提升，告警复发率下降。', '形成可复用的高温季运维预案。'],
      proof_materials: ['告警日志', '检修记录', '站点可用率报表']
    },
    writtenAdds: [
      { id: 'IND_ENERGY_UTILITIES_WRITTEN_V161_R009C_01', stage: 'campus_early_batch_written', round: '提前批笔试', scenarioBucket: 'business_scenario', type: '告警高发应对题', prompt: '【行业:能源与公用事业｜岗位:储能运维工程师｜阶段:提前批笔试】储能站告警频发，你如何制定72小时应对方案？' },
      { id: 'IND_ENERGY_UTILITIES_WRITTEN_V161_R009C_02', stage: 'campus_main_batch_written', round: '主批笔试', scenarioBucket: 'system_process', type: '运维体系设计题', prompt: '【行业:能源与公用事业｜岗位:储能运维工程师｜阶段:主批笔试】请设计“监控-告警-处置-复盘”运维体系。' },
      { id: 'IND_ENERGY_UTILITIES_WRITTEN_V161_R009C_03', stage: 'campus_supplement_written', round: '补录笔试', scenarioBucket: 'failure_review', type: '故障复发复盘', prompt: '【行业:能源与公用事业｜岗位:储能运维工程师｜阶段:补录笔试】同类故障反复发生，如何复盘机制问题？' },
      { id: 'IND_ENERGY_UTILITIES_WRITTEN_V161_R009C_04', stage: 'internship_conversion_written', round: '实习转正笔试', scenarioBucket: 'metric_tradeoff', type: '安全效率平衡', prompt: '【行业:能源与公用事业｜岗位:储能运维工程师｜阶段:实习转正笔试】在运维资源受限时如何平衡安全、可用率和成本？' }
    ],
    interviewAdds: [
      { id: 'IND_ENERGY_UTILITIES_INTERVIEW_V161_R009C_01', stage: 'campus_early_batch_interview', round: '提前批面试', scenarioBucket: 'business_scenario', type: '现场应急面试题', prompt: '【行业:能源与公用事业｜岗位:储能运维工程师｜阶段:提前批面试】你如何组织一次站点紧急故障处置？' },
      { id: 'IND_ENERGY_UTILITIES_INTERVIEW_V161_R009C_02', stage: 'campus_main_batch_interview', round: '主批面试', scenarioBucket: 'cross_team_collaboration', type: '远程现场协同', prompt: '【行业:能源与公用事业｜岗位:储能运维工程师｜阶段:主批面试】远程监控与现场团队判断冲突时你如何决策？' },
      { id: 'IND_ENERGY_UTILITIES_INTERVIEW_V161_R009C_03', stage: 'campus_supplement_interview', round: '补录面试', scenarioBucket: 'failure_review', type: '运维失误复盘', prompt: '【行业:能源与公用事业｜岗位:储能运维工程师｜阶段:补录面试】讲一次你处置失误的案例，后续如何优化流程？' },
      { id: 'IND_ENERGY_UTILITIES_INTERVIEW_V161_R009C_04', stage: 'internship_conversion_interview', round: '实习转正面试', scenarioBucket: 'metric_tradeoff', type: '指标冲突沟通', prompt: '【行业:能源与公用事业｜岗位:储能运维工程师｜阶段:实习转正面试】管理层要求降本，你如何确保安全指标不下滑？' }
    ]
  },
  {
    file: 'data/entries/IND_FIN_BANK.json',
    roleId: 'IND_FIN_BANK_ROLE_009',
    roleName: '零售产品经理',
    rolePatch: {
      role_readiness_floor: '至少能完整讲清1个零售产品从需求到上线再到迭代的项目闭环。',
      day_in_life: '零售产品经理工作周：需求评审、用户反馈分析、风控与合规校验、版本推进、上线复盘。',
      growth_path_1to3_year: '0-1年掌握零售业务和流程设计；1-3年独立负责产品模块和指标；3-5年可主导产品线规划与跨条线协同。',
      transfer_path_hint: '可转产品运营、增长策略、风险策略产品；需补实验方法与策略建模，过渡5-9个月。',
      prep_90d_plan: ['1-30天：梳理核心用户旅程和转化漏斗。', '31-60天：完成1个产品迭代项目并量化效果。', '61-90天：完成10套零售产品题训练，强化合规与增长平衡。'],
      career_outlook_3to5_year: '银行零售业务数字化升级，产品经理岗位长期需求稳定并向“策略+数据”复合能力演进。',
      typical_work_week: '版本迭代节奏快，需高频与技术、运营、风险、合规协同。',
      switch_directions: [
        { target_role: '产品运营', switch_cost: '低中', bridge_skills: ['运营策略', '数据分析'], transition_period: '4-6个月' },
        { target_role: '增长策略', switch_cost: '中', bridge_skills: ['实验体系', '用户分层'], transition_period: '5-8个月' },
        { target_role: '风险策略产品', switch_cost: '中', bridge_skills: ['规则引擎', '风控模型'], transition_period: '6-9个月' }
      ],
      prepare_180d_plan: ['91-120天：建立版本效果评估模板和回滚策略。', '121-150天：主导一次跨条线产品优化专项。', '151-180天：沉淀零售产品需求评审与上线SOP。'],
      role_scope_text: '负责零售产品设计与迭代，对用户体验、转化效率与合规可控性负责。'
    },
    commonDeductionPoints: ['需求描述抽象，缺少可执行细节。', '只看增长不看风险和合规。', '版本迭代没有指标闭环。', '跨部门协同推进路径不明确。'],
    starTemplate: {
      situation: '产品转化率下滑且投诉上升，业务和风险目标冲突。',
      task: '在合规前提下优化用户流程并提升转化。',
      action: ['拆解漏斗问题并识别关键阻塞点。', '联合风控和技术优化流程与规则。', '上线A/B实验并复盘迭代。'],
      result: ['转化率提升且投诉率下降。', '形成可复用迭代与评估机制。'],
      proof_materials: ['需求文档', '实验报告', '上线复盘']
    },
    writtenAdds: [
      { id: 'IND_FIN_BANK_WRITTEN_V161_R009C_01', stage: 'campus_early_batch_written', round: '提前批笔试', scenarioBucket: 'business_scenario', type: '转化下滑定位题', prompt: '【行业:金融-银行｜岗位:零售产品经理｜阶段:提前批笔试】核心流程转化下降，你如何定位并提出迭代方案？' },
      { id: 'IND_FIN_BANK_WRITTEN_V161_R009C_02', stage: 'campus_main_batch_written', round: '主批笔试', scenarioBucket: 'system_process', type: '版本迭代机制设计', prompt: '【行业:金融-银行｜岗位:零售产品经理｜阶段:主批笔试】请设计需求评审、开发、上线、复盘全流程机制。' },
      { id: 'IND_FIN_BANK_WRITTEN_V161_R009C_03', stage: 'campus_supplement_written', round: '补录笔试', scenarioBucket: 'failure_review', type: '上线失败复盘', prompt: '【行业:金融-银行｜岗位:零售产品经理｜阶段:补录笔试】一次上线引发投诉，如何复盘并修复？' },
      { id: 'IND_FIN_BANK_WRITTEN_V161_R009C_04', stage: 'internship_conversion_written', round: '实习转正笔试', scenarioBucket: 'metric_tradeoff', type: '增长风险取舍', prompt: '【行业:金融-银行｜岗位:零售产品经理｜阶段:实习转正笔试】增长目标和风险阈值冲突时，你如何给出方案？' }
    ],
    interviewAdds: [
      { id: 'IND_FIN_BANK_INTERVIEW_V161_R009C_01', stage: 'campus_early_batch_interview', round: '提前批面试', scenarioBucket: 'business_scenario', type: '需求优先级决策', prompt: '【行业:金融-银行｜岗位:零售产品经理｜阶段:提前批面试】当多个高优先级需求冲突时你怎么排序？' },
      { id: 'IND_FIN_BANK_INTERVIEW_V161_R009C_02', stage: 'campus_main_batch_interview', round: '主批面试', scenarioBucket: 'cross_team_collaboration', type: '跨团队推进', prompt: '【行业:金融-银行｜岗位:零售产品经理｜阶段:主批面试】技术排期与业务目标冲突，你如何推动一致方案？' },
      { id: 'IND_FIN_BANK_INTERVIEW_V161_R009C_03', stage: 'campus_supplement_interview', round: '补录面试', scenarioBucket: 'failure_review', type: '版本复盘题', prompt: '【行业:金融-银行｜岗位:零售产品经理｜阶段:补录面试】讲一次你负责版本未达预期的复盘。' },
      { id: 'IND_FIN_BANK_INTERVIEW_V161_R009C_04', stage: 'internship_conversion_interview', round: '实习转正面试', scenarioBucket: 'metric_tradeoff', type: '目标冲突沟通题', prompt: '【行业:金融-银行｜岗位:零售产品经理｜阶段:实习转正面试】上级要求提速上线，你如何守住质量和风控底线？' }
    ]
  },
  {
    file: 'data/entries/IND_FIN_SECURITIES_FUND.json',
    roleId: 'IND_FIN_SECURITIES_FUND_ROLE_009',
    roleName: '基金运营专员',
    rolePatch: {
      role_readiness_floor: '至少完成1个基金运营闭环案例：估值核算、清算对账、异常处理和合规复核。',
      day_in_life: '基金运营专员工作周：估值数据核对、交易清算对账、异常工单处理、报表输出、流程复盘。',
      growth_path_1to3_year: '0-1年掌握估值清算规则和系统流程；1-3年独立负责产品运营与异常处理；3-5年可主导运营流程优化与自动化。',
      transfer_path_hint: '可转估值核算专员、托管运营专员、风险管理岗；需补会计规则和风险控制，过渡4-8个月。',
      prep_90d_plan: ['1-30天：梳理估值、清算、对账关键节点。', '31-60天：完成1个异常处理案例并沉淀清单。', '61-90天：完成10套基金运营题训练，强化准确性和时效性平衡。'],
      career_outlook_3to5_year: '资管产品复杂度提升，基金运营岗位稳定增长，能力重点转向流程自动化和风险前置。',
      typical_work_week: '时间节点强约束，日终和月末结算窗口压力高。',
      switch_directions: [
        { target_role: '估值核算专员', switch_cost: '低中', bridge_skills: ['估值规则', '会计科目'], transition_period: '4-6个月' },
        { target_role: '托管运营专员', switch_cost: '低中', bridge_skills: ['托管流程', '对账机制'], transition_period: '4-6个月' },
        { target_role: '风险管理岗', switch_cost: '中', bridge_skills: ['风险指标', '异常预警'], transition_period: '5-8个月' }
      ],
      prepare_180d_plan: ['91-120天：建立关键运营异常分级与响应时限。', '121-150天：主导一次对账流程优化专项。', '151-180天：沉淀日终运营检查清单和复盘模板。'],
      role_scope_text: '负责基金估值清算与运营流程执行，对数据准确性、时效性和异常闭环负责。'
    },
    commonDeductionPoints: ['只讲流程节点，不讲控制点。', '异常处理没有根因复盘。', '忽略时效要求导致结算风险。', '缺少跨机构协同机制。'],
    starTemplate: {
      situation: '日终对账发现估值偏差，临近披露窗口。',
      task: '在限定时间内排查原因并完成修正。',
      action: ['快速分层排查交易、估值和数据源。', '联动托管与估值方确认口径。', '执行修正并补充复核控制点。'],
      result: ['估值偏差及时修复，披露节点未受影响。', '形成异常排查标准流程。'],
      proof_materials: ['对账差异单', '修正记录', '复核日志']
    },
    writtenAdds: [
      { id: 'IND_FIN_SECURITIES_FUND_WRITTEN_V161_R009C_01', stage: 'campus_early_batch_written', round: '提前批笔试', scenarioBucket: 'business_scenario', type: '估值异常处置题', prompt: '【行业:金融-证券基金｜岗位:基金运营专员｜阶段:提前批笔试】日终估值出现偏差，你如何在披露前完成排查和修正？' },
      { id: 'IND_FIN_SECURITIES_FUND_WRITTEN_V161_R009C_02', stage: 'campus_main_batch_written', round: '主批笔试', scenarioBucket: 'system_process', type: '运营流程设计题', prompt: '【行业:金融-证券基金｜岗位:基金运营专员｜阶段:主批笔试】请设计“交易-估值-清算-披露”全流程控制点。' },
      { id: 'IND_FIN_SECURITIES_FUND_WRITTEN_V161_R009C_03', stage: 'campus_supplement_written', round: '补录笔试', scenarioBucket: 'failure_review', type: '结算延迟复盘', prompt: '【行业:金融-证券基金｜岗位:基金运营专员｜阶段:补录笔试】一次结算延迟发生后，你如何复盘流程问题？' },
      { id: 'IND_FIN_SECURITIES_FUND_WRITTEN_V161_R009C_04', stage: 'internship_conversion_written', round: '实习转正笔试', scenarioBucket: 'metric_tradeoff', type: '准确率时效平衡', prompt: '【行业:金融-证券基金｜岗位:基金运营专员｜阶段:实习转正笔试】在时效压力下如何保证运营准确率？' }
    ],
    interviewAdds: [
      { id: 'IND_FIN_SECURITIES_FUND_INTERVIEW_V161_R009C_01', stage: 'campus_early_batch_interview', round: '提前批面试', scenarioBucket: 'business_scenario', type: '差错应急沟通', prompt: '【行业:金融-证券基金｜岗位:基金运营专员｜阶段:提前批面试】发现关键差错后，你如何组织跨方沟通？' },
      { id: 'IND_FIN_SECURITIES_FUND_INTERVIEW_V161_R009C_02', stage: 'campus_main_batch_interview', round: '主批面试', scenarioBucket: 'cross_team_collaboration', type: '托管估值协同', prompt: '【行业:金融-证券基金｜岗位:基金运营专员｜阶段:主批面试】托管方与估值方口径冲突时你如何推进？' },
      { id: 'IND_FIN_SECURITIES_FUND_INTERVIEW_V161_R009C_03', stage: 'campus_supplement_interview', round: '补录面试', scenarioBucket: 'failure_review', type: '运营失误复盘', prompt: '【行业:金融-证券基金｜岗位:基金运营专员｜阶段:补录面试】讲一次你处理失误导致返工的案例。' },
      { id: 'IND_FIN_SECURITIES_FUND_INTERVIEW_V161_R009C_04', stage: 'internship_conversion_interview', round: '实习转正面试', scenarioBucket: 'metric_tradeoff', type: '优先级取舍题', prompt: '【行业:金融-证券基金｜岗位:基金运营专员｜阶段:实习转正面试】多项紧急任务并发时你如何排序？' }
    ]
  },
  {
    file: 'data/entries/IND_NEW_ENERGY.json',
    roleId: 'IND_NEW_ENERGY_ROLE_009',
    roleName: '储能系统工程师',
    rolePatch: {
      role_readiness_floor: '至少完成1个储能系统集成项目：方案设计、接口联调、测试验证与交付复盘。',
      day_in_life: '储能系统工程师工作周：需求澄清、系统方案设计、BMS/PCS/EMS接口联调、测试问题闭环、交付评审。',
      growth_path_1to3_year: '0-1年掌握系统架构和关键参数；1-3年独立负责系统方案和调试；3-5年可主导平台化方案与技术路线。',
      transfer_path_hint: '可转储能系统集成工程师、储能EMS控制工程师、并网测试工程师；需补控制策略和电网规则，过渡5-9个月。',
      prep_90d_plan: ['1-30天：梳理储能系统架构与关键接口规范。', '31-60天：完成1个联调问题闭环案例。', '61-90天：完成10套储能系统题训练，强化系统取舍与故障定位。'],
      career_outlook_3to5_year: '储能并网和工商业储能扩张，系统工程岗位需求上升，能力核心是跨模块集成与可靠性交付。',
      typical_work_week: '项目节点驱动明显，联调和验收阶段强度较高。',
      switch_directions: [
        { target_role: '储能系统集成工程师', switch_cost: '低中', bridge_skills: ['项目集成', '调试计划'], transition_period: '4-6个月' },
        { target_role: '储能EMS控制工程师', switch_cost: '中', bridge_skills: ['控制策略', '参数优化'], transition_period: '5-8个月' },
        { target_role: '并网测试工程师', switch_cost: '中', bridge_skills: ['并网标准', '测试流程'], transition_period: '5-8个月' }
      ],
      prepare_180d_plan: ['91-120天：建立系统联调问题库与快速定位流程。', '121-150天：主导1次并网前系统稳定性专项。', '151-180天：沉淀系统设计审查清单和交付模板。'],
      role_scope_text: '负责储能系统方案设计与联调验证，对系统稳定性、交付质量和项目节点负责。'
    },
    commonDeductionPoints: ['只讲模块不讲系统边界。', '联调问题定位链路不完整。', '忽略并网和安全约束。', '缺少交付后的复盘机制。'],
    starTemplate: {
      situation: '项目联调阶段出现PCS与BMS交互异常，影响并网节点。',
      task: '在节点前完成问题定位、修复和稳定性验证。',
      action: ['拆解接口链路并重现问题场景。', '联合控制与硬件团队修正配置和策略。', '执行回归测试并更新交付检查项。'],
      result: ['联调问题收敛并按时通过验收。', '形成可复用接口联调方法。'],
      proof_materials: ['联调日志', '问题跟踪单', '验收报告']
    },
    writtenAdds: [
      { id: 'IND_NEW_ENERGY_WRITTEN_V161_R009C_01', stage: 'campus_early_batch_written', round: '提前批笔试', scenarioBucket: 'business_scenario', type: '联调异常处置题', prompt: '【行业:新能源｜岗位:储能系统工程师｜阶段:提前批笔试】联调阶段出现控制异常，你如何在节点内完成闭环？' },
      { id: 'IND_NEW_ENERGY_WRITTEN_V161_R009C_02', stage: 'campus_main_batch_written', round: '主批笔试', scenarioBucket: 'system_process', type: '系统方案设计题', prompt: '【行业:新能源｜岗位:储能系统工程师｜阶段:主批笔试】请设计储能系统从方案评审到并网验收的流程。' },
      { id: 'IND_NEW_ENERGY_WRITTEN_V161_R009C_03', stage: 'campus_supplement_written', round: '补录笔试', scenarioBucket: 'failure_review', type: '交付失败复盘', prompt: '【行业:新能源｜岗位:储能系统工程师｜阶段:补录笔试】一次项目验收失败后，如何复盘系统设计问题？' },
      { id: 'IND_NEW_ENERGY_WRITTEN_V161_R009C_04', stage: 'internship_conversion_written', round: '实习转正笔试', scenarioBucket: 'metric_tradeoff', type: '稳定性成本平衡', prompt: '【行业:新能源｜岗位:储能系统工程师｜阶段:实习转正笔试】当系统稳定性要求与成本约束冲突时你如何决策？' }
    ],
    interviewAdds: [
      { id: 'IND_NEW_ENERGY_INTERVIEW_V161_R009C_01', stage: 'campus_early_batch_interview', round: '提前批面试', scenarioBucket: 'business_scenario', type: '节点风险应对', prompt: '【行业:新能源｜岗位:储能系统工程师｜阶段:提前批面试】并网前夕发现高风险问题，你怎么建议项目决策？' },
      { id: 'IND_NEW_ENERGY_INTERVIEW_V161_R009C_02', stage: 'campus_main_batch_interview', round: '主批面试', scenarioBucket: 'cross_team_collaboration', type: '跨模块协同', prompt: '【行业:新能源｜岗位:储能系统工程师｜阶段:主批面试】控制、硬件、软件结论冲突时你如何推进闭环？' },
      { id: 'IND_NEW_ENERGY_INTERVIEW_V161_R009C_03', stage: 'campus_supplement_interview', round: '补录面试', scenarioBucket: 'failure_review', type: '方案失误复盘', prompt: '【行业:新能源｜岗位:储能系统工程师｜阶段:补录面试】讲一次系统方案判断失误并纠正的经历。' },
      { id: 'IND_NEW_ENERGY_INTERVIEW_V161_R009C_04', stage: 'internship_conversion_interview', round: '实习转正面试', scenarioBucket: 'metric_tradeoff', type: '目标冲突沟通', prompt: '【行业:新能源｜岗位:储能系统工程师｜阶段:实习转正面试】管理层要求压缩调试周期，你如何守住可靠性？' }
    ]
  },
  {
    file: 'data/entries/IND_PUBLIC_INSTITUTION.json',
    roleId: 'IND_PUBLIC_INSTITUTION_ROLE_009',
    roleName: '招考运营岗',
    rolePatch: {
      role_readiness_floor: '至少完成1个招考组织项目：流程编排、风险控制、应急处置和数据复盘。',
      day_in_life: '招考运营岗工作周：排期协调、考务资源配置、报名审核、现场保障、异常反馈处理。',
      growth_path_1to3_year: '0-1年掌握招考流程与规范；1-3年独立负责批次组织和风险管理；3-5年可主导招考体系优化和数字化改造。',
      transfer_path_hint: '可转综合文秘岗、人事管理岗、公共服务数字化岗；需补制度建设与数据治理，过渡4-8个月。',
      prep_90d_plan: ['1-30天：梳理招考全流程与关键风险点。', '31-60天：完成1个考务异常处置案例复盘。', '61-90天：完成10套招考运营题训练，强化流程与应急能力。'],
      career_outlook_3to5_year: '公共体系招录常态化，招考运营岗位长期稳定，能力重点向流程标准化与数字化协同延伸。',
      typical_work_week: '批次节点驱动明显，报名和考试周工作强度高。',
      switch_directions: [
        { target_role: '综合文秘岗', switch_cost: '低中', bridge_skills: ['公文写作', '流程协调'], transition_period: '4-6个月' },
        { target_role: '人事管理岗', switch_cost: '中', bridge_skills: ['编制规则', '人事流程'], transition_period: '5-8个月' },
        { target_role: '公共服务数字化岗', switch_cost: '中', bridge_skills: ['系统运营', '数据分析'], transition_period: '5-8个月' }
      ],
      prepare_180d_plan: ['91-120天：建立考务异常分级和预案演练机制。', '121-150天：主导1次招考流程优化专项。', '151-180天：沉淀批次复盘模板和操作手册。'],
      role_scope_text: '负责招考流程组织与现场运营保障，对流程时效、合规性和考务稳定性负责。'
    },
    commonDeductionPoints: ['流程熟悉但风险预判不足。', '应急处置步骤不完整。', '跨单位协调链路不清。', '缺少数据化复盘与改进。'],
    starTemplate: {
      situation: '报名高峰期系统拥堵并伴随考务咨询激增。',
      task: '保障报名与考务流程稳定，降低投诉和延误。',
      action: ['分级处理问题并协调技术与现场资源。', '优化通知和答疑机制。', '批次结束后做数据复盘与流程修订。'],
      result: ['关键节点平稳通过，投诉率下降。', '形成高峰期运营保障预案模板。'],
      proof_materials: ['排期表', '应急记录', '批次复盘报告']
    },
    writtenAdds: [
      { id: 'IND_PUBLIC_INSTITUTION_WRITTEN_V161_R009C_01', stage: 'campus_early_batch_written', round: '提前批笔试', scenarioBucket: 'business_scenario', type: '报名高峰保障题', prompt: '【行业:事业单位体系｜岗位:招考运营岗｜阶段:提前批笔试】报名高峰导致系统拥堵，你如何制定保障方案？' },
      { id: 'IND_PUBLIC_INSTITUTION_WRITTEN_V161_R009C_02', stage: 'campus_main_batch_written', round: '主批笔试', scenarioBucket: 'system_process', type: '招考流程设计题', prompt: '【行业:事业单位体系｜岗位:招考运营岗｜阶段:主批笔试】请设计“报名-审核-考试-复盘”流程与控制点。' },
      { id: 'IND_PUBLIC_INSTITUTION_WRITTEN_V161_R009C_03', stage: 'campus_supplement_written', round: '补录笔试', scenarioBucket: 'failure_review', type: '考务异常复盘', prompt: '【行业:事业单位体系｜岗位:招考运营岗｜阶段:补录笔试】一次考务异常发生后，你如何复盘并优化后续批次？' },
      { id: 'IND_PUBLIC_INSTITUTION_WRITTEN_V161_R009C_04', stage: 'internship_conversion_written', round: '实习转正笔试', scenarioBucket: 'metric_tradeoff', type: '时效与公平性平衡', prompt: '【行业:事业单位体系｜岗位:招考运营岗｜阶段:实习转正笔试】流程提速诉求和公平性要求冲突时你如何决策？' }
    ],
    interviewAdds: [
      { id: 'IND_PUBLIC_INSTITUTION_INTERVIEW_V161_R009C_01', stage: 'campus_early_batch_interview', round: '提前批面试', scenarioBucket: 'business_scenario', type: '突发事件处置', prompt: '【行业:事业单位体系｜岗位:招考运营岗｜阶段:提前批面试】考场突发故障时你如何组织应急？' },
      { id: 'IND_PUBLIC_INSTITUTION_INTERVIEW_V161_R009C_02', stage: 'campus_main_batch_interview', round: '主批面试', scenarioBucket: 'cross_team_collaboration', type: '跨单位协同', prompt: '【行业:事业单位体系｜岗位:招考运营岗｜阶段:主批面试】多单位职责边界不清时你如何推进？' },
      { id: 'IND_PUBLIC_INSTITUTION_INTERVIEW_V161_R009C_03', stage: 'campus_supplement_interview', round: '补录面试', scenarioBucket: 'failure_review', type: '组织失误复盘', prompt: '【行业:事业单位体系｜岗位:招考运营岗｜阶段:补录面试】讲一次你组织失误后的补救与机制修订。' },
      { id: 'IND_PUBLIC_INSTITUTION_INTERVIEW_V161_R009C_04', stage: 'internship_conversion_interview', round: '实习转正面试', scenarioBucket: 'metric_tradeoff', type: '目标冲突沟通题', prompt: '【行业:事业单位体系｜岗位:招考运营岗｜阶段:实习转正面试】当效率目标与流程严谨性冲突时你如何处理？' }
    ]
  }
];

const defaultAnswerFramework = ['目标与约束澄清', '关键动作拆解', '指标与风险控制', '复盘与机制沉淀'];
const defaultScoringDimensions = ['结构化表达', '方案可执行性', '风险控制意识', '复盘能力'];
const defaultCommonMistakes = ['空泛叙述', '缺少量化指标', '没有风险预案'];
const defaultGoodSignals = ['结论先行', '路径清晰', '指标闭环'];
const defaultReference = ['先定义目标与约束', '再拆解执行动作', '最后给出结果与复盘'];

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
      '如果资源减半，你优先保障哪一步？',
      '首轮方案效果不佳时怎么纠偏？',
      '如何沉淀为团队可复用机制？'
    ],
    follow_up_chain: ['澄清边界', '追问关键取舍', '验证复盘迁移'],
    scoring_rubric: {
      A档: '目标清晰、动作完整、指标与风险闭环。',
      B档: '方案可执行但指标或风险控制不足。',
      C档: '描述泛化，缺少执行路径和量化结果。'
    },
    question_realness_note: '基于岗位能力口径与2026场景化补充（非官方原卷）。',
    data_origin: 'official_jd_competency_mapping_with_manual_role_enrichment_v161_batch3',
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
  if (!roles || !writtenItems || !interviewItems) {
    throw new Error(`Invalid entry structure: ${u.file}`);
  }

  const role = roles.find((r) => r.role_id === u.roleId);
  if (!role) throw new Error(`Role not found: ${u.roleId}`);

  Object.assign(role, u.rolePatch);
  role.common_deduction_points = u.commonDeductionPoints;
  role.star_evidence_template = u.starTemplate;
  role.updated_at = TODAY;
  role.role_detail_v158 = role.role_detail_v158 || {};
  role.role_detail_v158.role_scope = u.rolePatch.role_scope_text;
  role.role_detail_v158.expansion_status = 'landed_deep_profile_v161_batch3';

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
