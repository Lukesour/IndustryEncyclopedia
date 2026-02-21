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
    roleId: 'IND_AUTO_INTELLIGENT_DRIVING_ROLE_017',
    sourceRoleId: 'IND_AUTO_INTELLIGENT_DRIVING_ROLE_016',
    roleName: '感知融合工程师',
    rolePatch: {
      role_readiness_floor: '至少完成1个感知融合闭环项目：多传感器融合建模、异常场景修复和回归验证。',
      day_in_life: '感知融合工程师工作周：分析多传感器数据、优化融合策略、处理误检漏检、联动仿真和车端验证。',
      growth_path_1to3_year: '0-1年掌握融合链路与指标；1-3年独立负责模块优化；3-5年可主导融合策略体系。',
      transfer_path_hint: '可转感知算法工程师、定位算法工程师、数据闭环工程师；需补模型与系统工程，过渡6-10个月。',
      prep_90d_plan: ['1-30天：梳理融合架构与关键指标。', '31-60天：完成1个融合异常闭环案例。', '61-90天：完成10套融合题训练，强化取舍表达。'],
      career_outlook_3to5_year: '高阶智驾渗透推动融合能力升级，岗位需求稳定增长。',
      typical_work_week: '版本迭代和路测反馈高峰期协同频次高。',
      switch_directions: [
        { target_role: '感知算法工程师', switch_cost: '中', bridge_skills: ['模型优化', '特征工程'], transition_period: '6-9个月' },
        { target_role: '定位算法工程师', switch_cost: '中高', bridge_skills: ['融合定位', '地图约束'], transition_period: '7-10个月' },
        { target_role: '数据闭环工程师', switch_cost: '低中', bridge_skills: ['样本治理', '问题回流'], transition_period: '5-8个月' }
      ],
      prepare_180d_plan: ['91-120天：建立高风险场景融合监控规则。', '121-150天：主导1次融合失效复盘专项。', '151-180天：沉淀融合策略更新模板。'],
      role_scope_text: '负责智驾多传感器融合策略与优化，对识别稳定性和异常闭环效率负责。'
    },
    commonDeductionPoints: ['只讲融合框架，不讲指标收益。', '误检漏检根因分析不完整。', '跨团队验证闭环不到位。', '风险场景覆盖不足。'],
    starTemplate: {
      situation: '夜间复杂场景下融合误检上升，影响版本发布。',
      task: '在发布窗口前优化融合策略并完成验证。',
      action: ['拆解场景并定位融合失效点。', '调整策略并补充高风险样本。', '完成仿真和实车回归验证。'],
      result: ['误检率下降并通过发布门禁。', '形成可复用的融合修复流程。'],
      proof_materials: ['融合分析报告', '样本清单', '回归验证结果']
    },
    writtenTopics: [
      { type: '融合异常诊断', bucket: 'business_scenario', text: '夜间复杂场景误检上升时你如何诊断并修复？' },
      { type: '融合流程设计', bucket: 'system_process', text: '请设计“采集-融合-验证-迭代”流程。' },
      { type: '失效复盘', bucket: 'failure_review', text: '一次融合策略失效后你如何复盘？' },
      { type: '性能取舍', bucket: 'metric_tradeoff', text: '精度和时延冲突时你如何取舍？' },
      { type: '场景覆盖', bucket: 'business_scenario', text: '如何设计高风险场景覆盖策略？' },
      { type: '数据治理', bucket: 'system_process', text: '如何构建融合数据质量治理机制？' },
      { type: '误判修正', bucket: 'failure_review', text: '误判反复出现时你如何定位根因并修正？' },
      { type: '资源约束', bucket: 'metric_tradeoff', text: '算力受限时如何保持融合效果稳定？' },
      { type: '跨模态协同', bucket: 'cross_team_collaboration', text: '如何推动感知与定位团队协同优化融合？' },
      { type: '机制沉淀', bucket: 'system_process', text: '如何把一次成功优化沉淀成机制？' }
    ],
    interviewTopics: [
      { type: '风险沟通', bucket: 'business_scenario', text: '发布窗口紧张但融合风险未清时你如何沟通？' },
      { type: '跨团队推进', bucket: 'cross_team_collaboration', text: '感知与仿真团队目标冲突时你如何推进？' },
      { type: '复盘叙述', bucket: 'failure_review', text: '讲一次你处理融合失效的完整复盘。' },
      { type: '优先级决策', bucket: 'metric_tradeoff', text: '多个异常并发时你如何排优先级？' },
      { type: '场景应急', bucket: 'business_scenario', text: '突发极端天气场景表现下滑时你怎么应对？' },
      { type: '协同机制', bucket: 'cross_team_collaboration', text: '如何建立跨团队常态化问题闭环机制？' },
      { type: '误判复盘', bucket: 'failure_review', text: '一次错误判断导致返工，你如何纠偏？' },
      { type: '指标取舍', bucket: 'metric_tradeoff', text: '鲁棒性和开发周期冲突时你如何选择？' },
      { type: '方案答辩', bucket: 'business_scenario', text: '你如何为新的融合方案做内部答辩？' },
      { type: '沉淀分享', bucket: 'cross_team_collaboration', text: '如何向团队复盘并推广你的优化方法？' }
    ]
  },
  {
    file: 'data/entries/IND_BIOMED_DEVICE.json',
    industryLabel: '生物医药与器械',
    roleId: 'IND_BIOMED_DEVICE_ROLE_017',
    sourceRoleId: 'IND_BIOMED_DEVICE_ROLE_016',
    roleName: '注册事务工程师',
    rolePatch: {
      role_readiness_floor: '至少完成1个注册事务项目：路径规划、资料整合、补件应答和节点管理。',
      day_in_life: '注册事务工程师工作周：跟踪法规更新、组织申报资料、推进检验临床节点、处理补件并维护进度。',
      growth_path_1to3_year: '0-1年掌握法规与申报规范；1-3年独立负责注册项目；3-5年可主导多产品注册策略。',
      transfer_path_hint: '可转产品合规、质量体系、医学事务；需补临床与质量能力，过渡6-10个月。',
      prep_90d_plan: ['1-30天：梳理关键法规路径。', '31-60天：完成1个补件闭环案例。', '61-90天：完成10套注册事务题训练。'],
      career_outlook_3to5_year: '创新器械审批和监管迭代推动注册事务岗位持续需求。',
      typical_work_week: '申报节点前资料和沟通任务集中。',
      switch_directions: [
        { target_role: '产品合规经理', switch_cost: '中', bridge_skills: ['合规策略', '风险评估'], transition_period: '6-9个月' },
        { target_role: '质量体系经理', switch_cost: '中', bridge_skills: ['QMS', '审计应对'], transition_period: '6-9个月' },
        { target_role: '医学事务', switch_cost: '中高', bridge_skills: ['证据解读', '学术协同'], transition_period: '7-10个月' }
      ],
      prepare_180d_plan: ['91-120天：建立补件高频问题库。', '121-150天：主导1次注册提效专项。', '151-180天：沉淀注册资料一致性规范。'],
      role_scope_text: '负责医疗器械注册路径设计和执行，对申报时效与资料质量负责。'
    },
    commonDeductionPoints: ['路径选择依据不足。', '资料一致性校验缺失。', '补件优先级不清。', '跨部门协同节奏混乱。'],
    starTemplate: {
      situation: '关键产品申报进入补件高频期，时间窗口紧张。',
      task: '在时限内完成补件并控制注册延期风险。',
      action: ['分层梳理补件问题并明确责任。', '组织研发和临床团队快速补证。', '复核后按期提交答复。'],
      result: ['补件按期完成并稳定项目节奏。', '建立高效补件应答机制。'],
      proof_materials: ['补件清单', '答复文档', '进度看板']
    },
    writtenTopics: [
      { type: '路径规划', bucket: 'business_scenario', text: '新产品注册路径选择时你如何决策？' },
      { type: '流程设计', bucket: 'system_process', text: '请设计“路径-资料-提交-补件”流程。' },
      { type: '补件复盘', bucket: 'failure_review', text: '补件反复被退回时你如何复盘？' },
      { type: '时效平衡', bucket: 'metric_tradeoff', text: '时效和资料完整冲突时你如何取舍？' },
      { type: '法规响应', bucket: 'business_scenario', text: '法规变化时如何快速调整申报策略？' },
      { type: '资料治理', bucket: 'system_process', text: '如何建立注册资料一致性检查机制？' },
      { type: '失误纠偏', bucket: 'failure_review', text: '一次资料错漏导致延误后你如何纠偏？' },
      { type: '资源分配', bucket: 'metric_tradeoff', text: '多项目并行时如何分配资源？' },
      { type: '协同推进', bucket: 'cross_team_collaboration', text: '如何推动研发与注册节点同步？' },
      { type: '机制沉淀', bucket: 'system_process', text: '如何沉淀可复用的注册项目模板？' }
    ],
    interviewTopics: [
      { type: '监管沟通', bucket: 'business_scenario', text: '监管要求临时变化时你如何应对？' },
      { type: '跨部门协同', bucket: 'cross_team_collaboration', text: '研发和注册目标冲突时你如何推进？' },
      { type: '补件复盘', bucket: 'failure_review', text: '讲一次你处理高压补件的经历。' },
      { type: '优先级决策', bucket: 'metric_tradeoff', text: '多个补件任务并发时你如何排序？' },
      { type: '节点承压', bucket: 'business_scenario', text: '关键节点延期风险升高时你如何稳住节奏？' },
      { type: '协作机制', bucket: 'cross_team_collaboration', text: '如何建立常态化资料协同机制？' },
      { type: '失误修正', bucket: 'failure_review', text: '一次错误判断后的修正过程是什么？' },
      { type: '风险取舍', bucket: 'metric_tradeoff', text: '保进度和控风险冲突时你如何选择？' },
      { type: '答辩表达', bucket: 'business_scenario', text: '如何向管理层解释注册策略调整？' },
      { type: '经验输出', bucket: 'cross_team_collaboration', text: '如何把经验转成团队可执行规范？' }
    ]
  },
  {
    file: 'data/entries/IND_ECOMMERCE_CROSSBORDER.json',
    industryLabel: '电商与跨境电商',
    roleId: 'IND_ECOMMERCE_CROSSBORDER_ROLE_017',
    sourceRoleId: 'IND_ECOMMERCE_CROSSBORDER_ROLE_016',
    roleName: '跨境选品运营',
    rolePatch: {
      role_readiness_floor: '至少完成1个跨境选品项目：需求洞察、商品筛选、上架验证和动销复盘。',
      day_in_life: '跨境选品运营工作周：分析市场趋势和竞品、筛选候选SKU、跟踪上架表现、联动供应链优化选品结构。',
      growth_path_1to3_year: '0-1年掌握选品指标与平台规则；1-3年独立负责品类选品；3-5年可主导多市场选品策略。',
      transfer_path_hint: '可转品类运营、供应链策略、品牌运营；需补定价和库存模型，过渡6-10个月。',
      prep_90d_plan: ['1-30天：梳理选品评价模型。', '31-60天：完成1个爆款验证案例。', '61-90天：完成10套选品题训练。'],
      career_outlook_3to5_year: '跨境供给竞争加剧，数据化选品能力成为核心岗位需求。',
      typical_work_week: '上新与促销周期中需高频迭代商品策略。',
      switch_directions: [
        { target_role: '品类运营经理', switch_cost: '中', bridge_skills: ['品类策略', '利润管理'], transition_period: '6-9个月' },
        { target_role: '供应链策略岗', switch_cost: '中', bridge_skills: ['库存规划', '履约协同'], transition_period: '6-9个月' },
        { target_role: '品牌运营', switch_cost: '中高', bridge_skills: ['品牌定位', '内容策略'], transition_period: '7-10个月' }
      ],
      prepare_180d_plan: ['91-120天：建立选品风险预警机制。', '121-150天：主导1次大促选品复盘。', '151-180天：沉淀选品评分与淘汰规则。'],
      role_scope_text: '负责跨境选品策略和结构优化，对动销效率、毛利表现和库存健康负责。'
    },
    commonDeductionPoints: ['只看热度不看供给约束。', '选品模型缺少利润视角。', '上新验证闭环不足。', '淘汰机制不明确。'],
    starTemplate: {
      situation: '新品上新后动销不及预期且库存压力上升。',
      task: '快速调整选品结构并恢复动销效率。',
      action: ['拆解动销瓶颈并重排SKU优先级。', '联动投放和供应链优化上新节奏。', '建立周复盘机制迭代规则。'],
      result: ['动销率提升且滞销库存下降。', '形成可复用选品方法。'],
      proof_materials: ['选品评分表', '动销看板', '复盘记录']
    },
    writtenTopics: [
      { type: '选品诊断', bucket: 'business_scenario', text: '新品动销低迷时你如何诊断并调整？' },
      { type: '流程设计', bucket: 'system_process', text: '请设计“洞察-筛选-验证-复盘”选品流程。' },
      { type: '失效复盘', bucket: 'failure_review', text: '一次选品失误后你如何复盘？' },
      { type: '利润取舍', bucket: 'metric_tradeoff', text: '销量增长和毛利约束冲突时如何取舍？' },
      { type: '爆款识别', bucket: 'business_scenario', text: '如何在有限预算下识别潜力爆款？' },
      { type: '模型建设', bucket: 'system_process', text: '如何构建可执行的选品评分模型？' },
      { type: '库存纠偏', bucket: 'failure_review', text: '库存积压加重时你如何快速纠偏？' },
      { type: '资源分配', bucket: 'metric_tradeoff', text: '多品类并发时如何分配选品资源？' },
      { type: '协同机制', bucket: 'cross_team_collaboration', text: '如何推动选品与供应链协同提效？' },
      { type: '机制沉淀', bucket: 'system_process', text: '如何沉淀选品经验形成机制？' }
    ],
    interviewTopics: [
      { type: '上新应急', bucket: 'business_scenario', text: '上新表现异常时你如何应急处理？' },
      { type: '跨团队推进', bucket: 'cross_team_collaboration', text: '选品与投放目标冲突时你如何推进？' },
      { type: '复盘叙述', bucket: 'failure_review', text: '讲一次你修复选品失误的经历。' },
      { type: '优先级决策', bucket: 'metric_tradeoff', text: 'SKU过多时你如何排序？' },
      { type: '需求洞察', bucket: 'business_scenario', text: '你如何验证市场需求真假信号？' },
      { type: '协作机制', bucket: 'cross_team_collaboration', text: '如何建立选品和履约的联动机制？' },
      { type: '误判复盘', bucket: 'failure_review', text: '一次需求误判后你如何纠偏？' },
      { type: '指标取舍', bucket: 'metric_tradeoff', text: 'GMV与库存周转冲突时你如何选择？' },
      { type: '策略答辩', bucket: 'business_scenario', text: '如何向管理层解释选品调整策略？' },
      { type: '经验输出', bucket: 'cross_team_collaboration', text: '如何让团队复制你的选品方法？' }
    ]
  },
  {
    file: 'data/entries/IND_ENERGY_UTILITIES.json',
    industryLabel: '能源与公用事业',
    roleId: 'IND_ENERGY_UTILITIES_ROLE_017',
    sourceRoleId: 'IND_ENERGY_UTILITIES_ROLE_016',
    roleName: '调度优化工程师',
    rolePatch: {
      role_readiness_floor: '至少完成1个调度优化项目：负荷预测、策略编排、异常处理和效果评估。',
      day_in_life: '调度优化工程师工作周：监控运行数据、分析峰谷负荷、优化调度策略、处理异常波动并复盘执行结果。',
      growth_path_1to3_year: '0-1年掌握调度规则和指标；1-3年独立负责优化策略；3-5年可主导区域调度优化体系。',
      transfer_path_hint: '可转电力交易策略、能源数字化产品、运维优化经理；需补市场机制和产品化能力，过渡6-10个月。',
      prep_90d_plan: ['1-30天：梳理调度约束和核心指标。', '31-60天：完成1个异常波动优化案例。', '61-90天：完成10套调度优化题训练。'],
      career_outlook_3to5_year: '新型电力系统建设提升调度优化岗位需求，能力重心向智能化和实时决策。',
      typical_work_week: '高峰时段和极端天气期任务压力明显上升。',
      switch_directions: [
        { target_role: '电力交易策略岗', switch_cost: '中', bridge_skills: ['市场规则', '收益优化'], transition_period: '6-9个月' },
        { target_role: '能源数字化产品', switch_cost: '中高', bridge_skills: ['产品设计', '需求抽象'], transition_period: '7-10个月' },
        { target_role: '运维优化经理', switch_cost: '中', bridge_skills: ['运维体系', '项目统筹'], transition_period: '6-9个月' }
      ],
      prepare_180d_plan: ['91-120天：建立调度异常预警机制。', '121-150天：主导1次调度失效复盘专项。', '151-180天：沉淀调度优化模板和规则库。'],
      role_scope_text: '负责运行调度策略优化与执行评估，对系统稳定性、调度效率和异常响应时效负责。'
    },
    commonDeductionPoints: ['只做描述不做策略。', '约束条件识别不完整。', '异常响应缺少闭环。', '复盘不沉淀机制。'],
    starTemplate: {
      situation: '峰值时段系统负荷波动加剧，既有调度策略失效。',
      task: '在保障稳定的前提下快速优化调度策略。',
      action: ['拆解波动来源并重排调度优先级。', '调整策略并进行分阶段验证。', '建立异常预警并持续监控。'],
      result: ['运行稳定性提升且效率改善。', '形成高峰期调度优化机制。'],
      proof_materials: ['调度分析报告', '策略变更记录', '运行监控看板']
    },
    writtenTopics: [
      { type: '波动处置', bucket: 'business_scenario', text: '峰值波动加剧时你如何优化调度？' },
      { type: '流程设计', bucket: 'system_process', text: '请设计“预测-调度-监控-复盘”流程。' },
      { type: '策略失效复盘', bucket: 'failure_review', text: '一次调度策略失效后你如何复盘？' },
      { type: '稳定效率平衡', bucket: 'metric_tradeoff', text: '稳定性与效率冲突时你如何取舍？' },
      { type: '预警机制', bucket: 'business_scenario', text: '如何构建调度异常预警机制？' },
      { type: '规则治理', bucket: 'system_process', text: '如何沉淀可执行的调度规则库？' },
      { type: '误判纠偏', bucket: 'failure_review', text: '一次误判导致波动扩大后你如何纠偏？' },
      { type: '资源约束', bucket: 'metric_tradeoff', text: '资源受限时你如何排序调度任务？' },
      { type: '跨岗协同', bucket: 'cross_team_collaboration', text: '如何推动调度与运维协同提效？' },
      { type: '机制沉淀', bucket: 'system_process', text: '如何将成功经验转化为团队流程？' }
    ],
    interviewTopics: [
      { type: '突发应急', bucket: 'business_scenario', text: '突发负荷异常时你如何组织应急？' },
      { type: '协同推进', bucket: 'cross_team_collaboration', text: '调度与运维意见冲突时你如何推进？' },
      { type: '复盘叙述', bucket: 'failure_review', text: '讲一次你处理调度失效的完整复盘。' },
      { type: '优先级决策', bucket: 'metric_tradeoff', text: '多异常并发时你如何排序处置？' },
      { type: '方案答辩', bucket: 'business_scenario', text: '你如何为调度策略调整做答辩？' },
      { type: '协作机制', bucket: 'cross_team_collaboration', text: '如何建立常态化调度协同机制？' },
      { type: '误判复盘', bucket: 'failure_review', text: '一次错误判断后的修正路径是什么？' },
      { type: '约束取舍', bucket: 'metric_tradeoff', text: '多重约束冲突时你如何选择？' },
      { type: '风险沟通', bucket: 'business_scenario', text: '如何向管理层解释调度风险和方案？' },
      { type: '经验复制', bucket: 'cross_team_collaboration', text: '如何让团队复制你的优化方法？' }
    ]
  },
  {
    file: 'data/entries/IND_FIN_BANK.json',
    industryLabel: '金融-银行',
    roleId: 'IND_FIN_BANK_ROLE_017',
    sourceRoleId: 'IND_FIN_BANK_ROLE_016',
    roleName: '资产保全专员',
    rolePatch: {
      role_readiness_floor: '至少完成1个资产保全项目：风险分层、催收协同、处置方案和回款复盘。',
      day_in_life: '资产保全专员工作周：跟踪逾期资产、分层制定处置策略、协同法务和催收、评估回收效果并复盘。',
      growth_path_1to3_year: '0-1年掌握保全流程与合规边界；1-3年独立负责资产处置；3-5年可主导保全策略体系。',
      transfer_path_hint: '可转不良资产管理、风险处置经理、法务协同岗；需补法律实务和组合管理能力，过渡6-10个月。',
      prep_90d_plan: ['1-30天：梳理资产保全分层与处置路径。', '31-60天：完成1个回款修复案例。', '61-90天：完成10套资产保全题训练。'],
      career_outlook_3to5_year: '零售和小微资产管理精细化提升，资产保全岗位长期需求稳定。',
      typical_work_week: '回款节点和风险波动期任务密度高，协同要求强。',
      switch_directions: [
        { target_role: '不良资产管理', switch_cost: '中', bridge_skills: ['资产包管理', '处置策略'], transition_period: '6-9个月' },
        { target_role: '风险处置经理', switch_cost: '中', bridge_skills: ['组合监控', '流程治理'], transition_period: '6-9个月' },
        { target_role: '法务协同岗', switch_cost: '中高', bridge_skills: ['诉讼流程', '证据管理'], transition_period: '7-10个月' }
      ],
      prepare_180d_plan: ['91-120天：建立高风险资产预警机制。', '121-150天：主导1次回款专项复盘。', '151-180天：沉淀资产处置SOP和合规模板。'],
      role_scope_text: '负责逾期资产保全与处置推进，对回款效率、风险暴露和合规性负责。'
    },
    commonDeductionPoints: ['只谈催收动作，不谈资产分层策略。', '合规边界描述不清。', '回款目标与路径不一致。', '复盘无法形成机制化改进。'],
    starTemplate: {
      situation: '某客群逾期率抬升，回款效率持续下滑。',
      task: '在合规约束下提升回款并控制损失。',
      action: ['分层识别高风险资产并制定差异化策略。', '联动法务和催收推进重点案件。', '建立回款追踪和策略迭代机制。'],
      result: ['回款率回升且损失可控。', '形成分层保全策略模板。'],
      proof_materials: ['资产分层报表', '处置台账', '回款复盘报告']
    },
    writtenTopics: [
      { type: '回款修复', bucket: 'business_scenario', text: '逾期率上升时你如何修复回款表现？' },
      { type: '流程设计', bucket: 'system_process', text: '请设计“识别-分层-处置-复盘”流程。' },
      { type: '策略失效复盘', bucket: 'failure_review', text: '一次处置策略失效后你如何复盘？' },
      { type: '合规效率平衡', bucket: 'metric_tradeoff', text: '回款效率和合规约束冲突时你如何取舍？' },
      { type: '风险分层', bucket: 'business_scenario', text: '如何构建可执行的资产风险分层规则？' },
      { type: '机制建设', bucket: 'system_process', text: '如何建立资产保全预警机制？' },
      { type: '误判纠偏', bucket: 'failure_review', text: '一次分层误判后的纠偏路径是什么？' },
      { type: '资源排序', bucket: 'metric_tradeoff', text: '多批资产并发时如何配置处置资源？' },
      { type: '跨岗协同', bucket: 'cross_team_collaboration', text: '如何推动法务与催收高效协同？' },
      { type: '经验沉淀', bucket: 'system_process', text: '如何把成功案例转成标准流程？' }
    ],
    interviewTopics: [
      { type: '高压沟通', bucket: 'business_scenario', text: '高风险资产暴露时你如何向管理层汇报？' },
      { type: '协同推进', bucket: 'cross_team_collaboration', text: '法务和催收目标冲突时你如何推进？' },
      { type: '复盘叙述', bucket: 'failure_review', text: '讲一次你修复回款下滑的完整过程。' },
      { type: '优先级决策', bucket: 'metric_tradeoff', text: '多项保全任务并发时你如何排序？' },
      { type: '方案答辩', bucket: 'business_scenario', text: '你如何解释资产处置策略调整？' },
      { type: '机制协作', bucket: 'cross_team_collaboration', text: '如何建立跨团队资产处置机制？' },
      { type: '误判复盘', bucket: 'failure_review', text: '一次判断偏差后你如何修正？' },
      { type: '风险取舍', bucket: 'metric_tradeoff', text: '短期回款和长期损失控制冲突时如何取舍？' },
      { type: '突发应对', bucket: 'business_scenario', text: '突发舆情影响回款时你如何应对？' },
      { type: '经验输出', bucket: 'cross_team_collaboration', text: '如何让团队复用你的处置打法？' }
    ]
  },
  {
    file: 'data/entries/IND_FIN_SECURITIES_FUND.json',
    industryLabel: '金融-证券基金',
    roleId: 'IND_FIN_SECURITIES_FUND_ROLE_017',
    sourceRoleId: 'IND_FIN_SECURITIES_FUND_ROLE_016',
    roleName: '固收信用研究员',
    rolePatch: {
      role_readiness_floor: '至少完成1个固收信用研究项目：主体分析、风险预警、组合建议和复盘闭环。',
      day_in_life: '固收信用研究员工作周：跟踪发行主体财务和事件、评估信用等级变化、输出风险提示和组合建议。',
      growth_path_1to3_year: '0-1年掌握信用研究框架；1-3年独立覆盖行业主体；3-5年可主导信用策略与组合协同。',
      transfer_path_hint: '可转信用评级分析师、固收投资经理助理、风险管理岗；需补交易执行和组合管理，过渡6-10个月。',
      prep_90d_plan: ['1-30天：梳理信用分析框架和指标。', '31-60天：完成1个信用事件复盘案例。', '61-90天：完成10套信用研究题训练。'],
      career_outlook_3to5_year: '信用分化加剧背景下，固收信用研究岗位需求稳定增强。',
      typical_work_week: '市场波动与评级窗口期分析频次高。',
      switch_directions: [
        { target_role: '信用评级分析师', switch_cost: '中', bridge_skills: ['评级方法', '财务建模'], transition_period: '6-9个月' },
        { target_role: '固收投资经理助理', switch_cost: '中', bridge_skills: ['组合管理', '交易协同'], transition_period: '6-9个月' },
        { target_role: '风险管理岗', switch_cost: '中', bridge_skills: ['风险预算', '压力测试'], transition_period: '6-9个月' }
      ],
      prepare_180d_plan: ['91-120天：建立主体信用预警机制。', '121-150天：主导1次信用事件复盘专项。', '151-180天：沉淀信用研究报告模板。'],
      role_scope_text: '负责固收信用研究和风险提示，对研究结论准确性和风险预警时效负责。'
    },
    commonDeductionPoints: ['研究结论缺少证据支撑。', '风险提示不及时。', '只看收益不看违约风险。', '无法落到组合建议。'],
    starTemplate: {
      situation: '持仓主体突发信用负面事件，组合回撤压力增加。',
      task: '快速完成风险评估并提出处置建议。',
      action: ['更新主体财务和事件信息。', '评估风险暴露并分层建议。', '跟踪执行并复盘效果。'],
      result: ['风险暴露可控且回撤收敛。', '形成信用事件应对流程。'],
      proof_materials: ['信用分析报告', '暴露评估表', '处置建议纪要']
    },
    writtenTopics: [
      { type: '信用事件评估', bucket: 'business_scenario', text: '主体突发负面事件时你如何评估并建议？' },
      { type: '研究流程设计', bucket: 'system_process', text: '请设计“跟踪-评估-建议-复盘”流程。' },
      { type: '误判复盘', bucket: 'failure_review', text: '一次信用误判后你如何复盘？' },
      { type: '收益风险平衡', bucket: 'metric_tradeoff', text: '收益机会与信用风险冲突时你如何取舍？' },
      { type: '主体筛选', bucket: 'business_scenario', text: '如何筛选高风险主体并提前预警？' },
      { type: '机制建设', bucket: 'system_process', text: '如何建立信用预警机制和报告模板？' },
      { type: '策略失效', bucket: 'failure_review', text: '处置策略失效后你如何纠偏？' },
      { type: '资源配置', bucket: 'metric_tradeoff', text: '多行业覆盖时如何分配研究资源？' },
      { type: '投研协同', bucket: 'cross_team_collaboration', text: '如何推动研究结论落到投资动作？' },
      { type: '经验沉淀', bucket: 'system_process', text: '如何沉淀信用事件应对经验？' }
    ],
    interviewTopics: [
      { type: '突发应对', bucket: 'business_scenario', text: '盘中信用突发时你如何快速汇报？' },
      { type: '协同推进', bucket: 'cross_team_collaboration', text: '研究与交易意见冲突时你如何推进？' },
      { type: '复盘叙述', bucket: 'failure_review', text: '讲一次你处理信用风险预警的经历。' },
      { type: '优先级决策', bucket: 'metric_tradeoff', text: '多主体并发风险时你如何排序？' },
      { type: '答辩表达', bucket: 'business_scenario', text: '你如何向投资经理解释降仓建议？' },
      { type: '机制协作', bucket: 'cross_team_collaboration', text: '如何建立投研常态协同机制？' },
      { type: '误判修正', bucket: 'failure_review', text: '一次判断偏差后你如何纠偏？' },
      { type: '策略取舍', bucket: 'metric_tradeoff', text: '收益目标与风控底线冲突时你如何选择？' },
      { type: '压力沟通', bucket: 'business_scenario', text: '客户关注度上升时你如何解释组合信用风险？' },
      { type: '经验输出', bucket: 'cross_team_collaboration', text: '如何让团队复用你的研究方法？' }
    ]
  },
  {
    file: 'data/entries/IND_NEW_ENERGY.json',
    industryLabel: '新能源',
    roleId: 'IND_NEW_ENERGY_ROLE_017',
    sourceRoleId: 'IND_NEW_ENERGY_ROLE_016',
    roleName: '碳交易专员',
    rolePatch: {
      role_readiness_floor: '至少完成1个碳交易项目：配额测算、交易执行、履约保障和复盘优化。',
      day_in_life: '碳交易专员工作周：跟踪碳价与配额数据、制定交易计划、执行履约交易、评估成本并复盘策略。',
      growth_path_1to3_year: '0-1年掌握碳市场规则与履约流程；1-3年独立负责交易执行；3-5年可主导碳资产策略。',
      transfer_path_hint: '可转碳资产经理、能源交易策略、ESG策略岗；需补金融衍生品与组合管理，过渡6-10个月。',
      prep_90d_plan: ['1-30天：梳理碳市场交易与履约机制。', '31-60天：完成1个履约成本优化案例。', '61-90天：完成10套碳交易题训练。'],
      career_outlook_3to5_year: '碳市场扩容推动碳交易岗位需求增长，能力重心向策略化交易与风险管理。',
      typical_work_week: '履约窗口和价格波动期需高频决策。',
      switch_directions: [
        { target_role: '碳资产经理', switch_cost: '中', bridge_skills: ['资产组合', '履约策略'], transition_period: '6-9个月' },
        { target_role: '能源交易策略岗', switch_cost: '中', bridge_skills: ['市场联动', '交易模型'], transition_period: '6-9个月' },
        { target_role: 'ESG策略岗', switch_cost: '中高', bridge_skills: ['可持续披露', '策略分析'], transition_period: '7-10个月' }
      ],
      prepare_180d_plan: ['91-120天：建立碳价波动预警机制。', '121-150天：主导1次履约交易复盘。', '151-180天：沉淀碳交易执行手册。'],
      role_scope_text: '负责碳配额交易和履约支持，对履约成本、交易效率和风险控制负责。'
    },
    commonDeductionPoints: ['只讲政策不讲交易策略。', '履约计划缺少价格风险应对。', '交易执行缺少复盘闭环。', '缺乏成本与风险平衡意识。'],
    starTemplate: {
      situation: '履约期碳价上行导致成本压力快速增加。',
      task: '在合规前提下优化交易节奏控制履约成本。',
      action: ['评估配额缺口并拆分交易时段。', '设置止损与风险阈值。', '动态跟踪执行并复盘策略。'],
      result: ['按期履约且成本可控。', '形成可复用履约交易机制。'],
      proof_materials: ['履约测算表', '交易记录', '成本复盘报告']
    },
    writtenTopics: [
      { type: '履约成本控制', bucket: 'business_scenario', text: '碳价上行时你如何控制履约成本？' },
      { type: '流程设计', bucket: 'system_process', text: '请设计“测算-交易-履约-复盘”流程。' },
      { type: '策略失效复盘', bucket: 'failure_review', text: '一次交易策略失效后你如何复盘？' },
      { type: '收益风险平衡', bucket: 'metric_tradeoff', text: '交易收益与履约安全冲突时如何取舍？' },
      { type: '价格应对', bucket: 'business_scenario', text: '价格剧烈波动时你如何调整策略？' },
      { type: '机制建设', bucket: 'system_process', text: '如何构建碳交易风险预警机制？' },
      { type: '误判纠偏', bucket: 'failure_review', text: '一次判断偏差导致成本上升后如何纠偏？' },
      { type: '资源配置', bucket: 'metric_tradeoff', text: '多项目并行履约时如何配置资源？' },
      { type: '跨岗协同', bucket: 'cross_team_collaboration', text: '如何推动生产和交易团队协同？' },
      { type: '经验沉淀', bucket: 'system_process', text: '如何沉淀碳交易经验为标准流程？' }
    ],
    interviewTopics: [
      { type: '突发应对', bucket: 'business_scenario', text: '碳价突变时你如何快速决策？' },
      { type: '协同推进', bucket: 'cross_team_collaboration', text: '交易和财务意见冲突时你如何推进？' },
      { type: '复盘叙述', bucket: 'failure_review', text: '讲一次你处理履约压力的完整经历。' },
      { type: '优先级决策', bucket: 'metric_tradeoff', text: '多个履约任务并发时你如何排序？' },
      { type: '策略答辩', bucket: 'business_scenario', text: '你如何解释交易节奏调整策略？' },
      { type: '机制协作', bucket: 'cross_team_collaboration', text: '如何建立常态化碳交易协同机制？' },
      { type: '误判修正', bucket: 'failure_review', text: '一次错误判断后你如何修正？' },
      { type: '风险取舍', bucket: 'metric_tradeoff', text: '成本和风险约束冲突时如何选择？' },
      { type: '压力沟通', bucket: 'business_scenario', text: '管理层追求收益最大化时你如何守住底线？' },
      { type: '经验输出', bucket: 'cross_team_collaboration', text: '如何让团队复用你的交易方法？' }
    ]
  },
  {
    file: 'data/entries/IND_PUBLIC_INSTITUTION.json',
    industryLabel: '事业单位体系',
    roleId: 'IND_PUBLIC_INSTITUTION_ROLE_017',
    sourceRoleId: 'IND_PUBLIC_INSTITUTION_ROLE_016',
    roleName: '科研项目管理专员',
    rolePatch: {
      role_readiness_floor: '至少完成1个科研项目管理闭环：立项推进、节点管控、经费跟踪和验收复盘。',
      day_in_life: '科研项目管理专员工作周：整理立项材料、跟踪项目里程碑、协调跨部门资源、核对经费执行并准备验收。',
      growth_path_1to3_year: '0-1年掌握科研管理流程；1-3年独立负责项目推进；3-5年可主导项目组合管理与机制优化。',
      transfer_path_hint: '可转科研管理主管、成果转化专员、预算管理岗；需补政策研究和财务管理，过渡6-10个月。',
      prep_90d_plan: ['1-30天：梳理科研项目全流程与节点。', '31-60天：完成1个延期项目修复案例。', '61-90天：完成10套项目管理题训练。'],
      career_outlook_3to5_year: '科研管理规范化和绩效导向增强，项目管理岗位需求稳定提升。',
      typical_work_week: '申报季和验收季任务集中，跨部门协同频繁。',
      switch_directions: [
        { target_role: '科研管理主管', switch_cost: '中', bridge_skills: ['组合管理', '制度建设'], transition_period: '6-9个月' },
        { target_role: '成果转化专员', switch_cost: '中', bridge_skills: ['成果评估', '产学研协同'], transition_period: '6-9个月' },
        { target_role: '预算管理岗', switch_cost: '中', bridge_skills: ['经费管理', '审计合规'], transition_period: '6-9个月' }
      ],
      prepare_180d_plan: ['91-120天：建立项目延期预警机制。', '121-150天：主导1次验收失败复盘专项。', '151-180天：沉淀项目管理模板与检查清单。'],
      role_scope_text: '负责科研项目全周期管理，对项目进度、经费合规和验收质量负责。'
    },
    commonDeductionPoints: ['只做事务跟踪，不做风险管理。', '节点计划缺少优先级。', '经费与进度协同不足。', '验收准备缺少证据链。'],
    starTemplate: {
      situation: '重点科研项目进度滞后且验收材料准备不足。',
      task: '在验收窗口前恢复进度并完善材料。',
      action: ['重排里程碑并明确责任分工。', '联动课题组补齐关键证据材料。', '建立周度跟踪和风险升级机制。'],
      result: ['项目按期进入验收并通过审核。', '形成项目延期修复机制。'],
      proof_materials: ['里程碑计划', '验收材料清单', '复盘报告']
    },
    writtenTopics: [
      { type: '延期修复', bucket: 'business_scenario', text: '科研项目延期时你如何修复进度？' },
      { type: '流程设计', bucket: 'system_process', text: '请设计“立项-执行-验收-复盘”流程。' },
      { type: '验收失利复盘', bucket: 'failure_review', text: '一次验收失败后你如何复盘并改进？' },
      { type: '效率合规平衡', bucket: 'metric_tradeoff', text: '推进效率与经费合规冲突时如何取舍？' },
      { type: '风险识别', bucket: 'business_scenario', text: '如何识别高风险项目并提前干预？' },
      { type: '机制建设', bucket: 'system_process', text: '如何构建项目延期预警机制？' },
      { type: '误判纠偏', bucket: 'failure_review', text: '一次节点误判后的纠偏路径是什么？' },
      { type: '资源分配', bucket: 'metric_tradeoff', text: '多项目并发时如何分配管理资源？' },
      { type: '跨部门协同', bucket: 'cross_team_collaboration', text: '如何推动科研、财务、审计协同？' },
      { type: '经验沉淀', bucket: 'system_process', text: '如何沉淀项目管理经验为模板？' }
    ],
    interviewTopics: [
      { type: '高压应对', bucket: 'business_scenario', text: '验收前出现关键缺口时你如何应对？' },
      { type: '协同推进', bucket: 'cross_team_collaboration', text: '课题组和管理部门目标冲突时你如何推进？' },
      { type: '复盘叙述', bucket: 'failure_review', text: '讲一次你修复延期项目的完整过程。' },
      { type: '优先级决策', bucket: 'metric_tradeoff', text: '多项目并行时你如何排序？' },
      { type: '沟通答辩', bucket: 'business_scenario', text: '你如何向领导解释项目调整方案？' },
      { type: '机制协作', bucket: 'cross_team_collaboration', text: '如何建立跨部门常态化协同机制？' },
      { type: '失误修正', bucket: 'failure_review', text: '一次判断失误后你如何纠偏？' },
      { type: '取舍题', bucket: 'metric_tradeoff', text: '质量和进度冲突时你如何取舍？' },
      { type: '突发处置', bucket: 'business_scenario', text: '经费执行异常时你如何快速处理？' },
      { type: '经验分享', bucket: 'cross_team_collaboration', text: '如何让团队复制你的项目管理方法？' }
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
    data_origin: 'official_jd_competency_mapping_with_manual_role_enrichment_v161_batch11_add_role017',
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
  newRole.role_detail_v158.expansion_status = 'landed_deep_profile_v161_batch11';

  roles.push(newRole);

  const writtenBasePool = writtenItems.filter((q) => q.role_id === u.sourceRoleId);
  const interviewBasePool = interviewItems.filter((q) => q.role_id === u.sourceRoleId);
  if (writtenBasePool.length === 0 || interviewBasePool.length === 0) throw new Error(`Question base missing: ${u.sourceRoleId}`);

  const industryPrefix = u.roleId.split('_ROLE_')[0];

  for (let i = 0; i < 10; i += 1) {
    const def = u.writtenTopics[i];
    const [stage, round] = WRITTEN_STAGES[i];
    const qid = `${industryPrefix}_WRITTEN_V161_R017K_${String(i + 1).padStart(2, '0')}`;
    if (writtenItems.some((q) => q.question_id === qid)) throw new Error(`Duplicate question id: ${qid}`);
    const base = writtenBasePool[i % writtenBasePool.length];
    writtenItems.push(buildQuestion(base, def, u.roleId, u.roleName, qid, stage, round, u.industryLabel, def.type, def.bucket));
  }

  for (let i = 0; i < 10; i += 1) {
    const def = u.interviewTopics[i];
    const [stage, round] = INTERVIEW_STAGES[i];
    const qid = `${industryPrefix}_INTERVIEW_V161_R017K_${String(i + 1).padStart(2, '0')}`;
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
