#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TODAY = '2026-02-20';

const updates = [
  {
    file: 'data/entries/IND_AUTO_INTELLIGENT_DRIVING.json',
    roleId: 'IND_AUTO_INTELLIGENT_DRIVING_ROLE_008',
    roleName: '项目质量工程师',
    rolePatch: {
      role_readiness_floor: '至少能完整讲清1个量产项目质量爬坡案例：关键缺陷、跨部门闭环、量化改善。',
      day_in_life: '项目质量工程师工作周：需求评审识别质量风险、组织PPAP/APQP节点评审、跟踪量产缺陷闭环、输出周质量例会结论。',
      growth_path_1to3_year: '0-1年夯实质量工具和问题分析；1-3年独立负责车型项目质量；3-5年主导跨平台质量体系优化。',
      transfer_path_hint: '可转供应商质量工程师、质量体系工程师、工艺质量经理；需补体系审核、供应商管理与过程能力分析，过渡周期4-9个月。',
      prep_90d_plan: [
        '1-30天：梳理APQP/PPAP/8D工具和项目节点质量清单。',
        '31-60天：完成1个量产缺陷闭环案例并量化前后差异。',
        '61-90天：完成10套项目质量场景题训练，强化跨部门推动与风险沟通。'
      ],
      career_outlook_3to5_year: '整车开发节奏加快，项目质量岗位需求持续增长，核心能力从质检执行升级到前置质量策划和跨团队治理。',
      typical_work_week: '节点驱动型工作，试制和SOP前后会议密集，需高频协调研发、制造、采购与售后。',
      switch_directions: [
        { target_role: '供应商质量工程师', switch_cost: '中', bridge_skills: ['来料质量', '供应商审核'], transition_period: '4-7个月' },
        { target_role: '质量体系工程师', switch_cost: '低中', bridge_skills: ['IATF16949', '体系审核'], transition_period: '4-6个月' },
        { target_role: '工艺质量经理', switch_cost: '中高', bridge_skills: ['制程能力', '工艺改进'], transition_period: '6-9个月' }
      ],
      prepare_180d_plan: [
        '91-120天：搭建项目关键质量风险看板并定义升级机制。',
        '121-150天：主导1个跨部门质量专项并复盘组织机制。',
        '151-180天：沉淀项目质量节点模板和异常处理SOP。'
      ],
      role_scope_text: '负责车型项目全流程质量风险管理和缺陷闭环，对项目质量目标和交付稳定性负责。'
    },
    commonDeductionPoints: [
      '只讲检测结果，不讲预防性质量策划。',
      '缺陷复盘没有根因链和责任闭环。',
      '跨部门冲突处理方式单一，推进失败。',
      '缺少量化指标与阶段目标。'
    ],
    starTemplate: {
      situation: 'SOP前试制阶段出现重复性质量缺陷，影响项目节点。',
      task: '在不拖延SOP的情况下完成缺陷收敛和风险降级。',
      action: [
        '按缺陷严重度分层并明确优先级。',
        '组织研发/工艺/供应链联合复盘与纠正。',
        '建立周级跟踪机制并验证改进效果。'
      ],
      result: [
        '关键缺陷按节点收敛，项目风险可控。',
        '形成可复用的项目质量风险清单和闭环机制。'
      ],
      proof_materials: ['8D报告', '项目质量例会纪要', '缺陷趋势图']
    },
    writtenAdds: [
      { id: 'IND_AUTO_INTELLIGENT_DRIVING_WRITTEN_V161_R008B_01', stage: 'campus_early_batch_written', round: '提前批笔试', scenarioBucket: 'business_scenario', type: 'SOP前质量风险处置', prompt: '【行业:汽车与智能驾驶｜岗位:项目质量工程师｜阶段:提前批笔试】试制阶段关键缺陷反复出现，请给出不延误SOP的质量收敛方案。' },
      { id: 'IND_AUTO_INTELLIGENT_DRIVING_WRITTEN_V161_R008B_02', stage: 'campus_main_batch_written', round: '主批笔试', scenarioBucket: 'system_process', type: '项目质量节点设计', prompt: '【行业:汽车与智能驾驶｜岗位:项目质量工程师｜阶段:主批笔试】请设计从DV到PV再到SOP的质量门禁与放行标准。' },
      { id: 'IND_AUTO_INTELLIGENT_DRIVING_WRITTEN_V161_R008B_03', stage: 'campus_supplement_written', round: '补录笔试', scenarioBucket: 'failure_review', type: '缺陷复发复盘', prompt: '【行业:汽车与智能驾驶｜岗位:项目质量工程师｜阶段:补录笔试】某类缺陷在整改后复发，你如何定位组织层面的根因？' },
      { id: 'IND_AUTO_INTELLIGENT_DRIVING_WRITTEN_V161_R008B_04', stage: 'internship_conversion_written', round: '实习转正笔试', scenarioBucket: 'metric_tradeoff', type: '质量与交付取舍', prompt: '【行业:汽车与智能驾驶｜岗位:项目质量工程师｜阶段:实习转正笔试】当交付节点与质量底线冲突时，如何设定决策阈值？' }
    ],
    interviewAdds: [
      { id: 'IND_AUTO_INTELLIGENT_DRIVING_INTERVIEW_V161_R008B_01', stage: 'campus_early_batch_interview', round: '提前批面试', scenarioBucket: 'business_scenario', type: '质量事故应急', prompt: '【行业:汽车与智能驾驶｜岗位:项目质量工程师｜阶段:提前批面试】你如何在24小时内组织一次质量事故应急处置？' },
      { id: 'IND_AUTO_INTELLIGENT_DRIVING_INTERVIEW_V161_R008B_02', stage: 'campus_main_batch_interview', round: '主批面试', scenarioBucket: 'cross_team_collaboration', type: '跨部门冲突管理', prompt: '【行业:汽车与智能驾驶｜岗位:项目质量工程师｜阶段:主批面试】研发与制造对缺陷责任意见不一致，你如何推动统一行动？' },
      { id: 'IND_AUTO_INTELLIGENT_DRIVING_INTERVIEW_V161_R008B_03', stage: 'campus_supplement_interview', round: '补录面试', scenarioBucket: 'failure_review', type: '整改失效复盘', prompt: '【行业:汽车与智能驾驶｜岗位:项目质量工程师｜阶段:补录面试】讲一次你推动整改失败的案例，后续如何重建机制？' },
      { id: 'IND_AUTO_INTELLIGENT_DRIVING_INTERVIEW_V161_R008B_04', stage: 'internship_conversion_interview', round: '实习转正面试', scenarioBucket: 'metric_tradeoff', type: '质量目标沟通', prompt: '【行业:汽车与智能驾驶｜岗位:项目质量工程师｜阶段:实习转正面试】管理层要求压缩周期，你如何保证质量目标不失守？' }
    ]
  },
  {
    file: 'data/entries/IND_BIOMED_DEVICE.json',
    roleId: 'IND_BIOMED_DEVICE_ROLE_008',
    roleName: '医学市场专员',
    rolePatch: {
      role_readiness_floor: '至少可展示1个医学证据转化为市场策略的案例，能说明学术合规和推广边界。',
      day_in_life: '医学市场专员工作周：文献证据更新、KOL沟通、学术内容审校、市场活动复盘与合规自查。',
      growth_path_1to3_year: '0-1年夯实文献检索与内容转化；1-3年独立负责产品学术策略和活动；3-5年可主导治疗领域市场医学协同。',
      transfer_path_hint: '可转MSL、产品经理、市场准入；需补临床沟通、产品商业化和准入规则，过渡周期4-9个月。',
      prep_90d_plan: [
        '1-30天：建立目标产品证据库与竞品证据地图。',
        '31-60天：完成1次学术活动方案并输出效果评估。',
        '61-90天：完成10套医学市场场景题训练，聚焦证据表达与合规边界。'
      ],
      career_outlook_3to5_year: '药械竞争加剧和合规监管并行，医学市场岗位对证据能力与合规表达要求持续提高。',
      typical_work_week: '会议与内容产出并重，重点节点在产品发布、学术会议和招采窗口。',
      switch_directions: [
        { target_role: 'MSL', switch_cost: '中', bridge_skills: ['KOL互动', '医学沟通'], transition_period: '5-8个月' },
        { target_role: '产品经理', switch_cost: '中', bridge_skills: ['商业策略', '市场分析'], transition_period: '5-8个月' },
        { target_role: '市场准入', switch_cost: '中高', bridge_skills: ['医保招采', '经济学证据'], transition_period: '6-9个月' }
      ],
      prepare_180d_plan: [
        '91-120天：建立治疗领域证据更新节奏和版本管理机制。',
        '121-150天：主导一次跨部门学术策略共创工作坊。',
        '151-180天：沉淀医学市场内容审校标准与风险清单。'
      ],
      role_scope_text: '负责医学证据到市场内容转化与学术策略执行，对内容质量、合规性和活动效果负责。'
    },
    commonDeductionPoints: ['只会转述文献，不会结合临床场景解读。', '忽略宣传合规边界和禁用表达。', '学术活动没有目标和效果评价。', '竞品证据分析不完整，策略失焦。'],
    starTemplate: {
      situation: '产品进入关键推广期，但目标医生对证据价值认知不足。',
      task: '在合规前提下提升证据理解和学术影响力。',
      action: ['重构证据叙事框架并分层输出内容。', '联合医学和销售设计学术活动闭环。', '建立活动后反馈采集和内容迭代机制。'],
      result: ['目标医生认知度和活动转化指标提升。', '形成可复用的证据传播模板。'],
      proof_materials: ['文献解读稿', '学术活动复盘', '反馈数据']
    },
    writtenAdds: [
      { id: 'IND_BIOMED_DEVICE_WRITTEN_V161_R008B_01', stage: 'campus_early_batch_written', round: '提前批笔试', scenarioBucket: 'business_scenario', type: '证据传播策略', prompt: '【行业:生物医药与器械｜岗位:医学市场专员｜阶段:提前批笔试】医生对新适应症证据质疑较多，你如何设计证据传播策略？' },
      { id: 'IND_BIOMED_DEVICE_WRITTEN_V161_R008B_02', stage: 'campus_main_batch_written', round: '主批笔试', scenarioBucket: 'system_process', type: '学术活动流程设计', prompt: '【行业:生物医药与器械｜岗位:医学市场专员｜阶段:主批笔试】请设计学术活动从选题到复盘的流程和指标体系。' },
      { id: 'IND_BIOMED_DEVICE_WRITTEN_V161_R008B_03', stage: 'campus_supplement_written', round: '补录笔试', scenarioBucket: 'failure_review', type: '内容争议复盘', prompt: '【行业:生物医药与器械｜岗位:医学市场专员｜阶段:补录笔试】一次医学内容发布后被质疑不严谨，如何复盘并修正？' },
      { id: 'IND_BIOMED_DEVICE_WRITTEN_V161_R008B_04', stage: 'internship_conversion_written', round: '实习转正笔试', scenarioBucket: 'metric_tradeoff', type: '合规与传播效率平衡', prompt: '【行业:生物医药与器械｜岗位:医学市场专员｜阶段:实习转正笔试】当传播速度和合规审校冲突时，你如何平衡？' }
    ],
    interviewAdds: [
      { id: 'IND_BIOMED_DEVICE_INTERVIEW_V161_R008B_01', stage: 'campus_early_batch_interview', round: '提前批面试', scenarioBucket: 'business_scenario', type: '证据争议应对', prompt: '【行业:生物医药与器械｜岗位:医学市场专员｜阶段:提前批面试】遇到医生公开质疑研究设计，你如何回应？' },
      { id: 'IND_BIOMED_DEVICE_INTERVIEW_V161_R008B_02', stage: 'campus_main_batch_interview', round: '主批面试', scenarioBucket: 'cross_team_collaboration', type: '医市销协同', prompt: '【行业:生物医药与器械｜岗位:医学市场专员｜阶段:主批面试】医学团队与销售团队对内容重点分歧时你如何协调？' },
      { id: 'IND_BIOMED_DEVICE_INTERVIEW_V161_R008B_03', stage: 'campus_supplement_interview', round: '补录面试', scenarioBucket: 'failure_review', type: '学术活动失效复盘', prompt: '【行业:生物医药与器械｜岗位:医学市场专员｜阶段:补录面试】讲一次学术活动效果不佳的复盘，你做了哪些调整？' },
      { id: 'IND_BIOMED_DEVICE_INTERVIEW_V161_R008B_04', stage: 'internship_conversion_interview', round: '实习转正面试', scenarioBucket: 'metric_tradeoff', type: '目标冲突决策', prompt: '【行业:生物医药与器械｜岗位:医学市场专员｜阶段:实习转正面试】管理层要求活动数量翻倍，你如何保障质量和合规？' }
    ]
  },
  {
    file: 'data/entries/IND_ECOMMERCE_CROSSBORDER.json',
    roleId: 'IND_ECOMMERCE_CROSSBORDER_ROLE_008',
    roleName: '平台招商运营',
    rolePatch: {
      role_readiness_floor: '至少可说明1个平台招商项目：商家分层、引入策略、GMV目标与履约质量协同。',
      day_in_life: '平台招商运营工作周：商家画像筛选、邀约沟通、入驻审核推进、活动资源匹配、履约与售后监控。',
      growth_path_1to3_year: '0-1年掌握平台招商流程与商家分层；1-3年独立负责类目招商和结构优化；3-5年可主导平台招商策略和生态治理。',
      transfer_path_hint: '可转类目运营、商家运营、平台策略运营；需补活动运营、政策设计和数据分析，过渡周期4-8个月。',
      prep_90d_plan: ['1-30天：梳理类目供给结构与商家分层标准。', '31-60天：完成1个招商项目并复盘转化漏斗。', '61-90天：完成10套平台招商题训练，强化商家质量与增长平衡。'],
      career_outlook_3to5_year: '平台竞争进入精细化供给阶段，平台招商岗位持续向“结构治理+高质量增长”升级。',
      typical_work_week: '以周为节奏推进商家引入与激活，促销季和平台招商季节性波动明显。',
      switch_directions: [
        { target_role: '类目运营', switch_cost: '低中', bridge_skills: ['品类策略', '活动资源'], transition_period: '4-6个月' },
        { target_role: '商家运营', switch_cost: '低中', bridge_skills: ['商家分层', '成长体系'], transition_period: '3-6个月' },
        { target_role: '平台策略运营', switch_cost: '中', bridge_skills: ['政策设计', '机制评估'], transition_period: '5-8个月' }
      ],
      prepare_180d_plan: ['91-120天：建立招商漏斗周报和异常预警规则。', '121-150天：主导1次类目结构优化专项。', '151-180天：沉淀平台招商SOP和商家质量评估模型。'],
      role_scope_text: '负责平台招商策略执行、商家引入与结构优化，对商家质量、履约表现和类目增长负责。'
    },
    commonDeductionPoints: ['只追入驻数量，不看商家质量。', '招商节奏和类目供给策略脱节。', '缺乏激活与留存机制，招商后无转化。', '未量化招商成本与产出。'],
    starTemplate: {
      situation: '平台重点类目供给不足，活动期间转化受限。',
      task: '在限定周期内引入高质量商家并提升供给结构。',
      action: ['按类目缺口定义招商优先级。', '分层设计商家引入和激活路径。', '联动履约和客服指标做质量筛选。'],
      result: ['类目供给结构优化并提升交易效率。', '形成可复制的招商和激活机制。'],
      proof_materials: ['招商漏斗数据', '商家分层模型', '活动复盘报告']
    },
    writtenAdds: [
      { id: 'IND_ECOMMERCE_CROSSBORDER_WRITTEN_V161_R008B_01', stage: 'campus_early_batch_written', round: '提前批笔试', scenarioBucket: 'business_scenario', type: '类目供给补齐策略', prompt: '【行业:电商与跨境电商｜岗位:平台招商运营｜阶段:提前批笔试】重点类目供给不足，你如何制定招商优先级和引入节奏？' },
      { id: 'IND_ECOMMERCE_CROSSBORDER_WRITTEN_V161_R008B_02', stage: 'campus_main_batch_written', round: '主批笔试', scenarioBucket: 'system_process', type: '招商漏斗体系设计', prompt: '【行业:电商与跨境电商｜岗位:平台招商运营｜阶段:主批笔试】请设计“触达-入驻-激活-稳定出单”的招商漏斗与指标。' },
      { id: 'IND_ECOMMERCE_CROSSBORDER_WRITTEN_V161_R008B_03', stage: 'campus_supplement_written', round: '补录笔试', scenarioBucket: 'failure_review', type: '招商失效复盘', prompt: '【行业:电商与跨境电商｜岗位:平台招商运营｜阶段:补录笔试】新增商家出单率低，请给出复盘框架和整改动作。' },
      { id: 'IND_ECOMMERCE_CROSSBORDER_WRITTEN_V161_R008B_04', stage: 'internship_conversion_written', round: '实习转正笔试', scenarioBucket: 'metric_tradeoff', type: '规模与质量平衡', prompt: '【行业:电商与跨境电商｜岗位:平台招商运营｜阶段:实习转正笔试】若招商规模和履约质量冲突，你如何设置取舍和阈值？' }
    ],
    interviewAdds: [
      { id: 'IND_ECOMMERCE_CROSSBORDER_INTERVIEW_V161_R008B_01', stage: 'campus_early_batch_interview', round: '提前批面试', scenarioBucket: 'business_scenario', type: '招商策略表达', prompt: '【行业:电商与跨境电商｜岗位:平台招商运营｜阶段:提前批面试】你如何说服头部商家入驻并快速起量？' },
      { id: 'IND_ECOMMERCE_CROSSBORDER_INTERVIEW_V161_R008B_02', stage: 'campus_main_batch_interview', round: '主批面试', scenarioBucket: 'cross_team_collaboration', type: '跨团队资源协调', prompt: '【行业:电商与跨境电商｜岗位:平台招商运营｜阶段:主批面试】类目、营销、风控资源冲突时你如何排优先级？' },
      { id: 'IND_ECOMMERCE_CROSSBORDER_INTERVIEW_V161_R008B_03', stage: 'campus_supplement_interview', round: '补录面试', scenarioBucket: 'failure_review', type: '商家流失复盘', prompt: '【行业:电商与跨境电商｜岗位:平台招商运营｜阶段:补录面试】讲一次商家流失案例，你如何做根因分析和补救？' },
      { id: 'IND_ECOMMERCE_CROSSBORDER_INTERVIEW_V161_R008B_04', stage: 'internship_conversion_interview', round: '实习转正面试', scenarioBucket: 'metric_tradeoff', type: '增长质量决策', prompt: '【行业:电商与跨境电商｜岗位:平台招商运营｜阶段:实习转正面试】管理层要求冲GMV，你如何避免“低质商家”带来的后续风险？' }
    ]
  },
  {
    file: 'data/entries/IND_ENERGY_UTILITIES.json',
    roleId: 'IND_ENERGY_UTILITIES_ROLE_008',
    roleName: '电力交易运营',
    rolePatch: {
      role_readiness_floor: '至少能讲清1个电力交易运营项目：中长期合约、现货偏差控制、结算复盘。',
      day_in_life: '电力交易运营工作周：负荷预测校验、交易计划调整、偏差跟踪、结算核对、策略复盘。',
      growth_path_1to3_year: '0-1年熟悉交易规则和结算口径；1-3年独立负责交易计划和偏差控制；3-5年可主导策略优化和跨区域协同。',
      transfer_path_hint: '可转电力交易分析师、储能运营工程师、新能源市场策略岗；需补交易建模和调度协同能力，过渡周期5-9个月。',
      prep_90d_plan: ['1-30天：梳理中长期与现货交易规则和结算科目。', '31-60天：完成1个偏差控制案例并形成复盘模板。', '61-90天：完成10套交易运营题训练，强化规则理解与风险控制。'],
      career_outlook_3to5_year: '电力市场化交易深化，交易运营岗位需求上升，能力重心转向“预测+策略+风控”。',
      typical_work_week: '受负荷波动和市场价格影响大，月结算和季末复盘任务集中。',
      switch_directions: [
        { target_role: '电力交易分析师', switch_cost: '中', bridge_skills: ['价格建模', '策略评估'], transition_period: '5-8个月' },
        { target_role: '储能运营工程师', switch_cost: '中', bridge_skills: ['调度策略', '收益优化'], transition_period: '5-8个月' },
        { target_role: '新能源市场策略岗', switch_cost: '中高', bridge_skills: ['市场政策', '组合策略'], transition_period: '6-9个月' }
      ],
      prepare_180d_plan: ['91-120天：建立交易偏差预警阈值与日报机制。', '121-150天：主导1个现货交易策略复盘并优化流程。', '151-180天：沉淀交易结算核对与异常处理SOP。'],
      role_scope_text: '负责交易计划执行、偏差控制和结算运营，对交易收益稳定性和风险敞口负责。'
    },
    commonDeductionPoints: ['只会执行指令，不会解释交易逻辑。', '偏差成因分析浅，缺少改进闭环。', '忽略规则变动带来的结算风险。', '无法给出可执行的止损机制。'],
    starTemplate: {
      situation: '现货价格波动加剧导致交易偏差扩大。',
      task: '在规则约束下控制偏差并稳定收益。',
      action: ['重算预测口径并识别偏差来源。', '调整交易节奏与对冲策略。', '建立日内监控和异常升级机制。'],
      result: ['偏差成本下降，交易执行稳定性提升。', '形成可复制的偏差治理流程。'],
      proof_materials: ['交易日报', '偏差分析表', '结算核对记录']
    },
    writtenAdds: [
      { id: 'IND_ENERGY_UTILITIES_WRITTEN_V161_R008B_01', stage: 'campus_early_batch_written', round: '提前批笔试', scenarioBucket: 'business_scenario', type: '偏差控制策略', prompt: '【行业:能源与公用事业｜岗位:电力交易运营｜阶段:提前批笔试】现货波动加剧导致偏差成本上升，如何制定控制策略？' },
      { id: 'IND_ENERGY_UTILITIES_WRITTEN_V161_R008B_02', stage: 'campus_main_batch_written', round: '主批笔试', scenarioBucket: 'system_process', type: '交易运营流程设计', prompt: '【行业:能源与公用事业｜岗位:电力交易运营｜阶段:主批笔试】请设计“预测-交易-监控-结算”全流程运营机制。' },
      { id: 'IND_ENERGY_UTILITIES_WRITTEN_V161_R008B_03', stage: 'campus_supplement_written', round: '补录笔试', scenarioBucket: 'failure_review', type: '结算异常复盘', prompt: '【行业:能源与公用事业｜岗位:电力交易运营｜阶段:补录笔试】一次结算异常导致收益偏差，你如何复盘并防复发？' },
      { id: 'IND_ENERGY_UTILITIES_WRITTEN_V161_R008B_04', stage: 'internship_conversion_written', round: '实习转正笔试', scenarioBucket: 'metric_tradeoff', type: '收益与风险平衡', prompt: '【行业:能源与公用事业｜岗位:电力交易运营｜阶段:实习转正笔试】收益目标提高但风险敞口放大时，你如何设定止损线？' }
    ],
    interviewAdds: [
      { id: 'IND_ENERGY_UTILITIES_INTERVIEW_V161_R008B_01', stage: 'campus_early_batch_interview', round: '提前批面试', scenarioBucket: 'business_scenario', type: '交易异常应对', prompt: '【行业:能源与公用事业｜岗位:电力交易运营｜阶段:提前批面试】你如何应对突发价格跳涨并快速调整计划？' },
      { id: 'IND_ENERGY_UTILITIES_INTERVIEW_V161_R008B_02', stage: 'campus_main_batch_interview', round: '主批面试', scenarioBucket: 'cross_team_collaboration', type: '交易调度协同', prompt: '【行业:能源与公用事业｜岗位:电力交易运营｜阶段:主批面试】交易策略与调度计划冲突时你如何推进协同？' },
      { id: 'IND_ENERGY_UTILITIES_INTERVIEW_V161_R008B_03', stage: 'campus_supplement_interview', round: '补录面试', scenarioBucket: 'failure_review', type: '策略失效复盘', prompt: '【行业:能源与公用事业｜岗位:电力交易运营｜阶段:补录面试】讲一次你交易策略失效的案例，后续如何修正？' },
      { id: 'IND_ENERGY_UTILITIES_INTERVIEW_V161_R008B_04', stage: 'internship_conversion_interview', round: '实习转正面试', scenarioBucket: 'metric_tradeoff', type: '收益风险沟通', prompt: '【行业:能源与公用事业｜岗位:电力交易运营｜阶段:实习转正面试】管理层要求提高收益，你如何解释风险边界并争取支持？' }
    ]
  },
  {
    file: 'data/entries/IND_FIN_BANK.json',
    roleId: 'IND_FIN_BANK_ROLE_008',
    roleName: '产品运营',
    rolePatch: {
      role_readiness_floor: '至少可展示1个银行产品运营案例：用户分层、流程优化、风险控制与指标提升。',
      day_in_life: '产品运营工作周：看板监控、问题定位、活动与流程优化、合规校验、周复盘。',
      growth_path_1to3_year: '0-1年掌握产品流程和数据口径；1-3年独立负责核心运营指标；3-5年可主导跨部门运营策略。',
      transfer_path_hint: '可转产品经理、增长运营、风险策略分析师；需补需求设计、实验方法和策略建模，过渡周期4-8个月。',
      prep_90d_plan: ['1-30天：梳理产品漏斗与关键转化指标。', '31-60天：完成1个转化率优化项目并复盘。', '61-90天：完成10套产品运营题训练，强化增长与合规平衡。'],
      career_outlook_3to5_year: '银行零售数字化深入，产品运营岗位需求稳定，重点能力从活动执行转向策略运营与数据治理。',
      typical_work_week: '数据复盘与跨团队推进占比高，月末季末指标压力显著。',
      switch_directions: [
        { target_role: '产品经理', switch_cost: '中', bridge_skills: ['需求设计', '路线图管理'], transition_period: '5-8个月' },
        { target_role: '增长运营', switch_cost: '低中', bridge_skills: ['实验设计', '用户分层'], transition_period: '4-6个月' },
        { target_role: '风险策略分析师', switch_cost: '中', bridge_skills: ['规则策略', '风控指标'], transition_period: '5-8个月' }
      ],
      prepare_180d_plan: ['91-120天：建立运营异常告警机制和周报模板。', '121-150天：主导1个端到端运营优化专项。', '151-180天：沉淀产品运营SOP和指标口径手册。'],
      role_scope_text: '负责银行产品运营策略执行与指标优化，对转化、留存和流程效率负责。'
    },
    commonDeductionPoints: ['活动导向强但缺少长期机制。', '指标口径不一致导致结论失真。', '忽略风控合规约束。', '复盘只讲结果不讲方法。'],
    starTemplate: {
      situation: '产品活跃增长放缓且转化漏斗出现明显流失。',
      task: '在风控合规前提下提升转化与留存。',
      action: ['拆解漏斗并定位关键流失环节。', '联动产品和风险团队优化流程。', '建立A/B验证和周级复盘机制。'],
      result: ['核心转化指标提升并保持稳定。', '形成可复用的运营优化方法。'],
      proof_materials: ['运营看板', '实验报告', '流程优化记录']
    },
    writtenAdds: [
      { id: 'IND_FIN_BANK_WRITTEN_V161_R008B_01', stage: 'campus_early_batch_written', round: '提前批笔试', scenarioBucket: 'business_scenario', type: '转化漏斗优化', prompt: '【行业:金融-银行｜岗位:产品运营｜阶段:提前批笔试】产品漏斗中某环节流失严重，你如何定位并优化？' },
      { id: 'IND_FIN_BANK_WRITTEN_V161_R008B_02', stage: 'campus_main_batch_written', round: '主批笔试', scenarioBucket: 'system_process', type: '运营体系设计', prompt: '【行业:金融-银行｜岗位:产品运营｜阶段:主批笔试】请设计“触达-转化-留存-复购”运营体系与指标口径。' },
      { id: 'IND_FIN_BANK_WRITTEN_V161_R008B_03', stage: 'campus_supplement_written', round: '补录笔试', scenarioBucket: 'failure_review', type: '活动失效复盘', prompt: '【行业:金融-银行｜岗位:产品运营｜阶段:补录笔试】某运营活动投入高但转化低，如何复盘并迭代？' },
      { id: 'IND_FIN_BANK_WRITTEN_V161_R008B_04', stage: 'internship_conversion_written', round: '实习转正笔试', scenarioBucket: 'metric_tradeoff', type: '增长与风险平衡', prompt: '【行业:金融-银行｜岗位:产品运营｜阶段:实习转正笔试】增长目标和风险阈值冲突时你如何决策？' }
    ],
    interviewAdds: [
      { id: 'IND_FIN_BANK_INTERVIEW_V161_R008B_01', stage: 'campus_early_batch_interview', round: '提前批面试', scenarioBucket: 'business_scenario', type: '运营异常处置', prompt: '【行业:金融-银行｜岗位:产品运营｜阶段:提前批面试】你发现核心指标突降时，第一周怎么排查和止损？' },
      { id: 'IND_FIN_BANK_INTERVIEW_V161_R008B_02', stage: 'campus_main_batch_interview', round: '主批面试', scenarioBucket: 'cross_team_collaboration', type: '跨部门推进', prompt: '【行业:金融-银行｜岗位:产品运营｜阶段:主批面试】产品、技术、风控目标冲突时你如何推动落地？' },
      { id: 'IND_FIN_BANK_INTERVIEW_V161_R008B_03', stage: 'campus_supplement_interview', round: '补录面试', scenarioBucket: 'failure_review', type: '方案失效复盘', prompt: '【行业:金融-银行｜岗位:产品运营｜阶段:补录面试】讲一次你提出的运营方案未达标的经历，后续如何修正？' },
      { id: 'IND_FIN_BANK_INTERVIEW_V161_R008B_04', stage: 'internship_conversion_interview', round: '实习转正面试', scenarioBucket: 'metric_tradeoff', type: '目标冲突沟通', prompt: '【行业:金融-银行｜岗位:产品运营｜阶段:实习转正面试】上级要求短期冲指标，你如何守住中长期健康度？' }
    ]
  },
  {
    file: 'data/entries/IND_FIN_SECURITIES_FUND.json',
    roleId: 'IND_FIN_SECURITIES_FUND_ROLE_008',
    roleName: '投资者服务',
    rolePatch: {
      role_readiness_floor: '至少可讲清1个投资者服务改进项目：咨询分层、投诉处理、适当性管理和满意度提升。',
      day_in_life: '投资者服务工作周：咨询与投诉分流、重点客户沟通、产品信息披露协同、服务质量复盘。',
      growth_path_1to3_year: '0-1年熟悉产品和服务规范；1-3年独立负责重点客群服务策略；3-5年可主导投资者服务体系和体验优化。',
      transfer_path_hint: '可转投顾支持、机构销售支持、合规监察；需补产品理解、适当性规则与沟通策略，过渡周期4-8个月。',
      prep_90d_plan: ['1-30天：梳理投资者问题分类和应答口径。', '31-60天：完成1个投诉闭环改进项目并量化效果。', '61-90天：完成10套投资者服务场景题训练，强化风险提示与沟通技巧。'],
      career_outlook_3to5_year: '监管强调投资者保护，投资者服务岗位长期稳定并向精细化客群运营演进。',
      typical_work_week: '受市场波动影响明显，波动期咨询量和投诉量同步上升。',
      switch_directions: [
        { target_role: '投顾支持', switch_cost: '中', bridge_skills: ['资产配置', '策略解释'], transition_period: '5-8个月' },
        { target_role: '机构销售支持', switch_cost: '中', bridge_skills: ['机构沟通', '服务方案'], transition_period: '5-8个月' },
        { target_role: '合规监察', switch_cost: '低中', bridge_skills: ['适当性规则', '披露规范'], transition_period: '4-6个月' }
      ],
      prepare_180d_plan: ['91-120天：建立投诉预警与分级响应机制。', '121-150天：主导1次高波动期服务保障专项。', '151-180天：沉淀投资者沟通FAQ与风险提示模板。'],
      role_scope_text: '负责投资者咨询与投诉服务、信息披露沟通和适当性管理支持，对服务体验和风险沟通质量负责。'
    },
    commonDeductionPoints: ['回答只停留在流程，不解释产品风险。', '投诉处理没有闭环和复发预防。', '忽略适当性与信息披露边界。', '缺少服务质量量化指标。'],
    starTemplate: {
      situation: '市场回撤期投资者咨询和投诉快速上升。',
      task: '稳定服务体验并降低投诉升级率。',
      action: ['按风险等级和客群分层响应。', '统一口径并强化风险提示。', '建立升级工单和复盘机制。'],
      result: ['投诉升级率下降，服务满意度提升。', '形成高波动期服务应急模板。'],
      proof_materials: ['工单报表', '投诉闭环记录', '满意度数据']
    },
    writtenAdds: [
      { id: 'IND_FIN_SECURITIES_FUND_WRITTEN_V161_R008B_01', stage: 'campus_early_batch_written', round: '提前批笔试', scenarioBucket: 'business_scenario', type: '高波动期服务策略', prompt: '【行业:金融-证券基金｜岗位:投资者服务｜阶段:提前批笔试】市场大幅波动时，如何设计投资者分层服务策略？' },
      { id: 'IND_FIN_SECURITIES_FUND_WRITTEN_V161_R008B_02', stage: 'campus_main_batch_written', round: '主批笔试', scenarioBucket: 'system_process', type: '投诉闭环流程设计', prompt: '【行业:金融-证券基金｜岗位:投资者服务｜阶段:主批笔试】请设计投诉从受理到复盘的闭环流程和指标。' },
      { id: 'IND_FIN_SECURITIES_FUND_WRITTEN_V161_R008B_03', stage: 'campus_supplement_written', round: '补录笔试', scenarioBucket: 'failure_review', type: '误沟通事件复盘', prompt: '【行业:金融-证券基金｜岗位:投资者服务｜阶段:补录笔试】一次风险提示不足引发投诉升级，如何复盘和修正？' },
      { id: 'IND_FIN_SECURITIES_FUND_WRITTEN_V161_R008B_04', stage: 'internship_conversion_written', round: '实习转正笔试', scenarioBucket: 'metric_tradeoff', type: '效率与体验平衡', prompt: '【行业:金融-证券基金｜岗位:投资者服务｜阶段:实习转正笔试】咨询量激增下，如何平衡响应效率和沟通质量？' }
    ],
    interviewAdds: [
      { id: 'IND_FIN_SECURITIES_FUND_INTERVIEW_V161_R008B_01', stage: 'campus_early_batch_interview', round: '提前批面试', scenarioBucket: 'business_scenario', type: '投诉升级应对', prompt: '【行业:金融-证券基金｜岗位:投资者服务｜阶段:提前批面试】客户情绪激动并要求赔偿时你如何处理？' },
      { id: 'IND_FIN_SECURITIES_FUND_INTERVIEW_V161_R008B_02', stage: 'campus_main_batch_interview', round: '主批面试', scenarioBucket: 'cross_team_collaboration', type: '投顾合规协同', prompt: '【行业:金融-证券基金｜岗位:投资者服务｜阶段:主批面试】投顾话术与合规要求冲突时你如何协调？' },
      { id: 'IND_FIN_SECURITIES_FUND_INTERVIEW_V161_R008B_03', stage: 'campus_supplement_interview', round: '补录面试', scenarioBucket: 'failure_review', type: '服务失误复盘', prompt: '【行业:金融-证券基金｜岗位:投资者服务｜阶段:补录面试】讲一次服务失误导致负反馈的经历，你如何补救？' },
      { id: 'IND_FIN_SECURITIES_FUND_INTERVIEW_V161_R008B_04', stage: 'internship_conversion_interview', round: '实习转正面试', scenarioBucket: 'metric_tradeoff', type: '指标冲突决策', prompt: '【行业:金融-证券基金｜岗位:投资者服务｜阶段:实习转正面试】响应时效和一次解决率冲突时你怎么取舍？' }
    ]
  },
  {
    file: 'data/entries/IND_NEW_ENERGY.json',
    roleId: 'IND_NEW_ENERGY_ROLE_008',
    roleName: '生产计划工程师',
    rolePatch: {
      role_readiness_floor: '至少可展示1个产能与排产优化案例：需求预测、瓶颈识别、交付与库存平衡。',
      day_in_life: '生产计划工程师工作周：需求滚动预测、产能校核、排产调整、物料齐套检查、交付复盘。',
      growth_path_1to3_year: '0-1年掌握MPS/MRP与排产逻辑；1-3年独立负责产线排产和异常协调；3-5年可主导产销协同和计划体系优化。',
      transfer_path_hint: '可转供应链计划、运营管理、制造项目管理；需补库存策略与跨工厂协同，过渡周期4-8个月。',
      prep_90d_plan: ['1-30天：梳理需求-产能-物料三表联动关系。', '31-60天：完成1个排产异常闭环案例并量化交付改善。', '61-90天：完成10套生产计划场景题训练，强化约束条件下的取舍能力。'],
      career_outlook_3to5_year: '新能源扩产持续，计划岗位需求稳定，能力重心向数据化排产和韧性供应链升级。',
      typical_work_week: '日常以周滚动计划推进，月末和新品导入期协调压力显著上升。',
      switch_directions: [
        { target_role: '供应链计划', switch_cost: '低中', bridge_skills: ['库存策略', 'S&OP'], transition_period: '4-6个月' },
        { target_role: '运营管理', switch_cost: '中', bridge_skills: ['运营指标', '流程优化'], transition_period: '5-8个月' },
        { target_role: '制造项目管理', switch_cost: '中', bridge_skills: ['项目节奏', '资源协调'], transition_period: '5-8个月' }
      ],
      prepare_180d_plan: ['91-120天：建立排产异常预警看板和升级规则。', '121-150天：主导1次产销协同优化专项。', '151-180天：沉淀标准排产策略和异常应对手册。'],
      role_scope_text: '负责生产计划编制与滚动调整，对产能利用、交付达成和库存健康度负责。'
    },
    commonDeductionPoints: ['只会排单，不会管理约束与优先级。', '忽略物料齐套导致计划失真。', '缺少异常升级与跨部门协调机制。', '没有量化计划执行效果。'],
    starTemplate: {
      situation: '订单波动和物料短缺导致交付风险上升。',
      task: '在产能受限条件下保障重点订单交付并控制库存。',
      action: ['重排优先级并识别瓶颈工序。', '联动采购和制造制定替代方案。', '按日追踪执行偏差并快速纠偏。'],
      result: ['交付达成率提升且库存风险可控。', '形成可复制的排产应急机制。'],
      proof_materials: ['排产计划', '齐套清单', '交付达成报表']
    },
    writtenAdds: [
      { id: 'IND_NEW_ENERGY_WRITTEN_V161_R008B_01', stage: 'campus_early_batch_written', round: '提前批笔试', scenarioBucket: 'business_scenario', type: '需求波动排产题', prompt: '【行业:新能源｜岗位:生产计划工程师｜阶段:提前批笔试】订单突然增长30%，你如何调整排产并保障重点交付？' },
      { id: 'IND_NEW_ENERGY_WRITTEN_V161_R008B_02', stage: 'campus_main_batch_written', round: '主批笔试', scenarioBucket: 'system_process', type: '计划体系设计', prompt: '【行业:新能源｜岗位:生产计划工程师｜阶段:主批笔试】请设计MPS到车间执行的滚动计划机制与指标。' },
      { id: 'IND_NEW_ENERGY_WRITTEN_V161_R008B_03', stage: 'campus_supplement_written', round: '补录笔试', scenarioBucket: 'failure_review', type: '交付失约复盘', prompt: '【行业:新能源｜岗位:生产计划工程师｜阶段:补录笔试】一次交付失约发生后，如何复盘计划失效链路？' },
      { id: 'IND_NEW_ENERGY_WRITTEN_V161_R008B_04', stage: 'internship_conversion_written', round: '实习转正笔试', scenarioBucket: 'metric_tradeoff', type: '交付库存平衡', prompt: '【行业:新能源｜岗位:生产计划工程师｜阶段:实习转正笔试】当交付率和库存周转冲突时，你如何设定取舍？' }
    ],
    interviewAdds: [
      { id: 'IND_NEW_ENERGY_INTERVIEW_V161_R008B_01', stage: 'campus_early_batch_interview', round: '提前批面试', scenarioBucket: 'business_scenario', type: '排产应急面试题', prompt: '【行业:新能源｜岗位:生产计划工程师｜阶段:提前批面试】关键物料缺货时你如何在48小时内重排计划？' },
      { id: 'IND_NEW_ENERGY_INTERVIEW_V161_R008B_02', stage: 'campus_main_batch_interview', round: '主批面试', scenarioBucket: 'cross_team_collaboration', type: '跨部门排产协同', prompt: '【行业:新能源｜岗位:生产计划工程师｜阶段:主批面试】制造和销售对优先级意见冲突时你怎么推进？' },
      { id: 'IND_NEW_ENERGY_INTERVIEW_V161_R008B_03', stage: 'campus_supplement_interview', round: '补录面试', scenarioBucket: 'failure_review', type: '计划偏差复盘', prompt: '【行业:新能源｜岗位:生产计划工程师｜阶段:补录面试】讲一次计划偏差失控的经历，你如何纠偏并防复发？' },
      { id: 'IND_NEW_ENERGY_INTERVIEW_V161_R008B_04', stage: 'internship_conversion_interview', round: '实习转正面试', scenarioBucket: 'metric_tradeoff', type: '目标冲突沟通', prompt: '【行业:新能源｜岗位:生产计划工程师｜阶段:实习转正面试】管理层要求压库存，你如何保证交付指标？' }
    ]
  },
  {
    file: 'data/entries/IND_PUBLIC_INSTITUTION.json',
    roleId: 'IND_PUBLIC_INSTITUTION_ROLE_006',
    roleName: '运营保障岗',
    rolePatch: {
      role_readiness_floor: '至少能讲清1个公共服务保障项目：资源调度、应急响应、服务质量改进。',
      day_in_life: '运营保障岗工作周：服务资源盘点、保障计划编排、突发问题响应、协同部门跟进和周复盘。',
      growth_path_1to3_year: '0-1年掌握保障流程和制度；1-3年独立负责保障项目与应急预案；3-5年可统筹多部门服务保障体系。',
      transfer_path_hint: '可转综合管理岗、项目管理岗、公共服务数字化岗；需补项目方法和数据治理能力，过渡周期4-8个月。',
      prep_90d_plan: ['1-30天：梳理服务保障流程和关键SLA指标。', '31-60天：完成1个突发保障案例复盘并优化流程。', '61-90天：完成10套运营保障题训练，强化应急响应和跨部门协调。'],
      career_outlook_3to5_year: '公共服务精细化治理持续推进，运营保障岗位长期稳定并向数据化协同升级。',
      typical_work_week: '常态化运营+突发应急并行，节假日和大型活动保障期任务集中。',
      switch_directions: [
        { target_role: '综合管理岗', switch_cost: '低中', bridge_skills: ['流程管理', '制度执行'], transition_period: '4-6个月' },
        { target_role: '项目管理岗', switch_cost: '中', bridge_skills: ['计划管理', '风险控制'], transition_period: '5-8个月' },
        { target_role: '公共服务数字化岗', switch_cost: '中', bridge_skills: ['数据看板', '系统协同'], transition_period: '5-8个月' }
      ],
      prepare_180d_plan: ['91-120天：建立保障异常分级和应急处置清单。', '121-150天：主导一次大型活动保障复盘专项。', '151-180天：沉淀运营保障SOP和培训手册。'],
      role_scope_text: '负责公共服务运营保障和应急响应，对服务连续性、时效性和协同效率负责。'
    },
    commonDeductionPoints: ['只讲执行流程，不讲风险预案。', '突发事件响应缺少分级机制。', '跨部门协作推进路径不清晰。', '没有量化保障效果。'],
    starTemplate: {
      situation: '业务高峰期服务压力骤增，现场秩序与时效面临风险。',
      task: '在资源受限下保障服务连续性并降低投诉。',
      action: ['按紧急度分级调度人力和物资。', '建立现场信息回传与快速决策链路。', '事后复盘并更新应急预案。'],
      result: ['高峰期服务稳定，投诉率可控。', '形成可复用保障流程和预案模板。'],
      proof_materials: ['保障排班表', '应急处置记录', '服务指标周报']
    },
    writtenAdds: [
      { id: 'IND_PUBLIC_INSTITUTION_WRITTEN_V161_R006B_01', stage: 'campus_early_batch_written', round: '提前批笔试', scenarioBucket: 'business_scenario', type: '高峰保障方案', prompt: '【行业:事业单位体系｜岗位:运营保障岗｜阶段:提前批笔试】服务高峰来临，你如何制定资源保障方案并控制风险？' },
      { id: 'IND_PUBLIC_INSTITUTION_WRITTEN_V161_R006B_02', stage: 'campus_main_batch_written', round: '主批笔试', scenarioBucket: 'system_process', type: '保障流程体系设计', prompt: '【行业:事业单位体系｜岗位:运营保障岗｜阶段:主批笔试】请设计“计划-执行-应急-复盘”运营保障流程。' },
      { id: 'IND_PUBLIC_INSTITUTION_WRITTEN_V161_R006B_03', stage: 'campus_supplement_written', round: '补录笔试', scenarioBucket: 'failure_review', type: '应急失效复盘', prompt: '【行业:事业单位体系｜岗位:运营保障岗｜阶段:补录笔试】一次应急响应未达预期，如何复盘并优化机制？' },
      { id: 'IND_PUBLIC_INSTITUTION_WRITTEN_V161_R006B_04', stage: 'internship_conversion_written', round: '实习转正笔试', scenarioBucket: 'metric_tradeoff', type: '时效与资源平衡', prompt: '【行业:事业单位体系｜岗位:运营保障岗｜阶段:实习转正笔试】在预算受限下如何平衡服务时效和保障质量？' }
    ],
    interviewAdds: [
      { id: 'IND_PUBLIC_INSTITUTION_INTERVIEW_V161_R006B_01', stage: 'campus_early_batch_interview', round: '提前批面试', scenarioBucket: 'business_scenario', type: '现场突发应对', prompt: '【行业:事业单位体系｜岗位:运营保障岗｜阶段:提前批面试】窗口突发拥堵和投诉时你如何现场处置？' },
      { id: 'IND_PUBLIC_INSTITUTION_INTERVIEW_V161_R006B_02', stage: 'campus_main_batch_interview', round: '主批面试', scenarioBucket: 'cross_team_collaboration', type: '多部门协同推进', prompt: '【行业:事业单位体系｜岗位:运营保障岗｜阶段:主批面试】多个部门协调不顺时你如何推动保障方案落地？' },
      { id: 'IND_PUBLIC_INSTITUTION_INTERVIEW_V161_R006B_03', stage: 'campus_supplement_interview', round: '补录面试', scenarioBucket: 'failure_review', type: '保障失效复盘', prompt: '【行业:事业单位体系｜岗位:运营保障岗｜阶段:补录面试】讲一次保障失效经历，你如何修正流程？' },
      { id: 'IND_PUBLIC_INSTITUTION_INTERVIEW_V161_R006B_04', stage: 'internship_conversion_interview', round: '实习转正面试', scenarioBucket: 'metric_tradeoff', type: '目标冲突沟通', prompt: '【行业:事业单位体系｜岗位:运营保障岗｜阶段:实习转正面试】如果时效目标和人力负荷冲突，你如何给管理层建议？' }
    ]
  }
];

const defaultAnswerFramework = ['目标与边界澄清', '关键动作拆解', '指标与风险控制', '复盘与机制沉淀'];
const defaultScoringDimensions = ['结构化思维', '可执行性', '指标意识', '复盘能力'];
const defaultCommonMistakes = ['空泛描述', '缺少指标', '无风险预案'];
const defaultGoodSignals = ['结论先行', '路径清晰', '指标闭环'];
const defaultReference = ['先定义约束与目标', '再拆解执行路径', '最后输出量化结果与复盘机制'];

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
      '如果资源减半，你优先保障什么？',
      '首轮方案失败后你如何纠偏？',
      '如何把这次经验沉淀成机制？'
    ],
    follow_up_chain: ['澄清边界', '追问取舍', '验证复盘'],
    scoring_rubric: {
      A档: '目标明确、方案可执行、指标闭环完整。',
      B档: '方案基本可执行，但指标或风险控制不足。',
      C档: '描述泛化，缺少动作与量化结果。'
    },
    question_realness_note: '基于岗位能力口径与2026场景化补充（非官方原卷）。',
    data_origin: 'official_jd_competency_mapping_with_manual_role_enrichment_v161',
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
  role.role_detail_v158.expansion_status = 'landed_deep_profile_v161_batch2';

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
