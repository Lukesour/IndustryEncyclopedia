#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TODAY = '2026-02-21';

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
    roleId: 'IND_AUTO_INTELLIGENT_DRIVING_ROLE_020',
    sourceRoleId: 'IND_AUTO_INTELLIGENT_DRIVING_ROLE_019',
    roleName: '车路协同测试工程师',
    rolePatch: {
      role_readiness_floor: '至少完成1个车路协同测试项目：路侧设备联调、车端联测、异常链路定位与复盘闭环。',
      day_in_life: '车路协同测试工程师工作周：规划联测场景、执行车端与路侧联合验证、跟踪通信异常、推动跨团队修复回归。',
      growth_path_1to3_year: '0-1年掌握V2X链路测试方法；1-3年独立负责区域联测；3-5年可主导车路协同验证体系建设。',
      transfer_path_hint: '可转V2X算法工程师、系统集成测试工程师、智能网联项目工程师；需补通信协议与系统工程能力，过渡6-10个月。',
      prep_90d_plan: ['1-30天：梳理V2X测试链路与关键指标。', '31-60天：完成1个通信异常闭环案例。', '61-90天：完成10套车路协同题训练。'],
      career_outlook_3to5_year: '车路协同示范区扩容推动测试与验证岗位需求稳步增长。',
      typical_work_week: '联调窗口和道路测试排期重叠时任务密度高。',
      switch_directions: [
        { target_role: 'V2X算法工程师', switch_cost: '中高', bridge_skills: ['协议栈理解', '算法验证'], transition_period: '7-10个月' },
        { target_role: '系统集成测试工程师', switch_cost: '中', bridge_skills: ['集成测试', '缺陷管理'], transition_period: '6-9个月' },
        { target_role: '智能网联项目工程师', switch_cost: '中', bridge_skills: ['项目协同', '交付管理'], transition_period: '6-9个月' }
      ],
      prepare_180d_plan: ['91-120天：建立典型联测场景覆盖看板。', '121-150天：主导1次车路链路故障复盘专项。', '151-180天：沉淀联测执行SOP与异常清单。'],
      role_scope_text: '负责车路协同联测与验证闭环，对通信稳定性、场景覆盖率与缺陷关闭效率负责。'
    },
    commonDeductionPoints: ['只讲车端不讲路侧协同。', '通信故障定位缺少证据链。', '联测覆盖范围与发布门禁不一致。', '复盘无法迁移到后续项目。'],
    starTemplate: {
      situation: '示范区上线前，车路协同链路在高并发场景下频繁丢包。',
      task: '在上线窗口前完成链路稳定性修复并通过联测验收。',
      action: ['分段排查路侧与车端链路并定位瓶颈。', '优化测试脚本并补充压力场景回归。', '推动跨团队修复并固化验证门禁。'],
      result: ['丢包率下降并通过上线验收。', '形成可复用的车路联测排障流程。'],
      proof_materials: ['联测报告', '链路日志', '回归验证记录']
    },
    writtenTopics: [
      { type: '联测方案设计', bucket: 'business_scenario', text: '你如何设计车路协同场景化联测方案？' },
      { type: '流程机制', bucket: 'system_process', text: '请设计“准备-联调-回归-验收”测试流程。' },
      { type: '故障复盘', bucket: 'failure_review', text: '一次联测故障反复出现时你如何复盘？' },
      { type: '进度质量取舍', bucket: 'metric_tradeoff', text: '上线节点紧张时如何平衡覆盖深度与时效？' },
      { type: '链路定位', bucket: 'business_scenario', text: '如何定位车端与路侧通信异常边界？' },
      { type: '门禁建设', bucket: 'system_process', text: '如何搭建车路协同发布门禁机制？' },
      { type: '误判纠偏', bucket: 'failure_review', text: '一次误判导致回归失败后如何纠偏？' },
      { type: '资源调度', bucket: 'metric_tradeoff', text: '多区域联测并发时如何分配测试资源？' },
      { type: '跨团队协同', bucket: 'cross_team_collaboration', text: '如何推动车企、路侧和平台三方协同？' },
      { type: '经验沉淀', bucket: 'system_process', text: '如何把联测经验沉淀为标准用例库？' }
    ],
    interviewTopics: [
      { type: '上线应急', bucket: 'business_scenario', text: '上线前发现链路不稳定时你如何应急？' },
      { type: '协同推进', bucket: 'cross_team_collaboration', text: '车端与路侧团队结论冲突时你怎么推进？' },
      { type: '复盘叙述', bucket: 'failure_review', text: '讲一次你修复联测重大故障的过程。' },
      { type: '优先级决策', bucket: 'metric_tradeoff', text: '多类故障并发时你如何排优先级？' },
      { type: '风险沟通', bucket: 'business_scenario', text: '你如何向项目负责人说明延期测试必要性？' },
      { type: '机制协作', bucket: 'cross_team_collaboration', text: '如何建立常态化车路联测协同机制？' },
      { type: '失误修正', bucket: 'failure_review', text: '一次错误放行后你如何修正流程？' },
      { type: '指标取舍', bucket: 'metric_tradeoff', text: '稳定性与覆盖率目标冲突时如何取舍？' },
      { type: '方案答辩', bucket: 'business_scenario', text: '如何答辩你的联测计划和资源需求？' },
      { type: '经验复制', bucket: 'cross_team_collaboration', text: '如何让团队复制你的联测排障方法？' }
    ]
  },
  {
    file: 'data/entries/IND_BIOMED_DEVICE.json',
    industryLabel: '生物医药与器械',
    roleId: 'IND_BIOMED_DEVICE_ROLE_020',
    sourceRoleId: 'IND_BIOMED_DEVICE_ROLE_019',
    roleName: '临床试验启动专员',
    rolePatch: {
      role_readiness_floor: '至少完成1个临床试验启动项目：中心筛选、伦理与合同推进、研究者会议支持和首例入组准备。',
      day_in_life: '临床试验启动专员工作周：协调中心遴选、跟进伦理与合同进度、核查启动资料、推动首例入组节点达成。',
      growth_path_1to3_year: '0-1年掌握试验启动全流程；1-3年独立负责多中心启动；3-5年可主导项目启动策略与质量管理。',
      transfer_path_hint: '可转CRA、临床运营经理、项目管理岗；需补风险管理与跨区域协调能力，过渡6-10个月。',
      prep_90d_plan: ['1-30天：梳理临床启动关键节点和模板。', '31-60天：完成1个启动延期复盘案例。', '61-90天：完成10套临床启动题训练。'],
      career_outlook_3to5_year: '创新药与器械临床项目增多，启动岗位对交付和合规能力要求持续上升。',
      typical_work_week: '多中心并行启动阶段沟通密集且时效要求高。',
      switch_directions: [
        { target_role: 'CRA', switch_cost: '中', bridge_skills: ['监查执行', '中心管理'], transition_period: '6-9个月' },
        { target_role: '临床运营经理', switch_cost: '中高', bridge_skills: ['项目统筹', '风险管理'], transition_period: '7-10个月' },
        { target_role: '临床项目管理', switch_cost: '中', bridge_skills: ['里程碑管理', '预算协同'], transition_period: '6-9个月' }
      ],
      prepare_180d_plan: ['91-120天：建立中心启动进度预警机制。', '121-150天：主导1次启动延迟复盘专项。', '151-180天：沉淀中心启动SOP与核查清单。'],
      role_scope_text: '负责临床试验启动执行与跨方协同，对启动时效、资料完整性与合规节点达成负责。'
    },
    commonDeductionPoints: ['中心筛选标准不清。', '伦理与合同推进路径模糊。', '启动资料核查不完整。', '延期复盘缺乏可执行动作。'],
    starTemplate: {
      situation: '关键中心启动进度滞后，影响整体入组计划。',
      task: '在合规前提下加速中心启动并保障资料完整。',
      action: ['拆解阻塞节点并重排中心启动优先级。', '联动法务伦理团队并行推进关键流程。', '执行启动核查并落地首例入组准备。'],
      result: ['中心按期启动并保障入组节奏。', '形成可复用的启动加速机制。'],
      proof_materials: ['中心启动计划', '伦理合同进度表', '启动核查记录']
    },
    writtenTopics: [
      { type: '中心启动策略', bucket: 'business_scenario', text: '多中心并行时你如何制定启动优先级策略？' },
      { type: '流程机制', bucket: 'system_process', text: '请设计“筛选-推进-核查-入组”启动流程。' },
      { type: '延期复盘', bucket: 'failure_review', text: '一次中心启动延期后你如何复盘？' },
      { type: '时效合规平衡', bucket: 'metric_tradeoff', text: '节点压力与合规完整性冲突时如何取舍？' },
      { type: '风险识别', bucket: 'business_scenario', text: '如何识别并前置处理中心启动风险？' },
      { type: '模板建设', bucket: 'system_process', text: '如何建立临床启动核查模板库？' },
      { type: '误判纠偏', bucket: 'failure_review', text: '一次中心评估误判后如何纠偏？' },
      { type: '资源调度', bucket: 'metric_tradeoff', text: '多个中心节点重叠时如何分配支持资源？' },
      { type: '跨团队协同', bucket: 'cross_team_collaboration', text: '如何推动医学、法务、中心三方协同？' },
      { type: '经验沉淀', bucket: 'system_process', text: '如何沉淀可复制的临床启动方法？' }
    ],
    interviewTopics: [
      { type: '节点应急', bucket: 'business_scenario', text: '关键中心突然延迟时你如何应急？' },
      { type: '协同推进', bucket: 'cross_team_collaboration', text: '伦理与合同推进意见冲突时你怎么协调？' },
      { type: '复盘叙述', bucket: 'failure_review', text: '讲一次你扭转启动延期的经历。' },
      { type: '优先级决策', bucket: 'metric_tradeoff', text: '多项阻塞并发时你如何排序推进？' },
      { type: '风险沟通', bucket: 'business_scenario', text: '你如何向项目组解释启动风险和方案？' },
      { type: '机制协作', bucket: 'cross_team_collaboration', text: '如何建立临床启动跨方协同机制？' },
      { type: '失误修正', bucket: 'failure_review', text: '一次资料遗漏导致延期后如何修正？' },
      { type: '取舍题', bucket: 'metric_tradeoff', text: '速度与完整性冲突时你如何取舍？' },
      { type: '方案答辩', bucket: 'business_scenario', text: '如何答辩你的中心启动计划？' },
      { type: '经验复制', bucket: 'cross_team_collaboration', text: '如何让团队复用你的启动推进打法？' }
    ]
  },
  {
    file: 'data/entries/IND_ECOMMERCE_CROSSBORDER.json',
    industryLabel: '电商与跨境电商',
    roleId: 'IND_ECOMMERCE_CROSSBORDER_ROLE_020',
    sourceRoleId: 'IND_ECOMMERCE_CROSSBORDER_ROLE_019',
    roleName: '跨境站点运营策略专员',
    rolePatch: {
      role_readiness_floor: '至少完成1个跨境站点策略项目：流量结构分析、商品与活动策略制定、执行监测与复盘迭代。',
      day_in_life: '跨境站点运营策略专员工作周：分析站点流量和转化、制定活动与选品策略、推进执行、监控核心指标并复盘。',
      growth_path_1to3_year: '0-1年掌握站点运营指标体系；1-3年独立负责区域站点策略；3-5年可主导多站点增长策略。',
      transfer_path_hint: '可转站点增长负责人、品类运营经理、用户运营策略岗；需补商业分析与实验设计能力，过渡6-10个月。',
      prep_90d_plan: ['1-30天：梳理站点运营指标和增长漏斗。', '31-60天：完成1个活动失效复盘案例。', '61-90天：完成10套站点策略题训练。'],
      career_outlook_3to5_year: '区域化站点精细化运营趋势增强，策略型岗位需求持续增长。',
      typical_work_week: '大促前后策略迭代和跨团队协同频次高。',
      switch_directions: [
        { target_role: '站点增长负责人', switch_cost: '中', bridge_skills: ['增长框架', '预算管理'], transition_period: '6-9个月' },
        { target_role: '品类运营经理', switch_cost: '中', bridge_skills: ['商品策略', '供应协同'], transition_period: '6-9个月' },
        { target_role: '用户运营策略岗', switch_cost: '中高', bridge_skills: ['用户分层', '生命周期运营'], transition_period: '7-10个月' }
      ],
      prepare_180d_plan: ['91-120天：建立站点策略实验评估机制。', '121-150天：主导1次活动ROI复盘专项。', '151-180天：沉淀跨境站点运营策略模板库。'],
      role_scope_text: '负责跨境站点运营策略制定与迭代，对流量质量、转化效率和活动ROI负责。'
    },
    commonDeductionPoints: ['策略与站点阶段不匹配。', '活动评估只看GMV不看利润。', '跨部门执行协同不足。', '复盘无法形成可执行策略。'],
    starTemplate: {
      situation: '站点流量增长但转化下滑，活动投放ROI持续走低。',
      task: '在预算约束内提升站点转化与ROI。',
      action: ['拆解流量结构并识别低效链路。', '重构活动与商品策略并分阶段实验。', '联动投放和供应链同步优化执行。'],
      result: ['转化率回升且活动ROI改善。', '形成可复用的站点策略迭代机制。'],
      proof_materials: ['策略方案', '实验看板', 'ROI复盘报告']
    },
    writtenTopics: [
      { type: '策略设计', bucket: 'business_scenario', text: '你如何为新市场站点制定首季运营策略？' },
      { type: '流程机制', bucket: 'system_process', text: '请设计“分析-策略-执行-复盘”运营流程。' },
      { type: '活动复盘', bucket: 'failure_review', text: '一次大促活动转化不达标时你如何复盘？' },
      { type: '规模利润平衡', bucket: 'metric_tradeoff', text: '冲规模与保利润冲突时如何取舍？' },
      { type: '漏斗诊断', bucket: 'business_scenario', text: '如何定位跨境站点转化漏斗的关键问题？' },
      { type: '机制建设', bucket: 'system_process', text: '如何建立站点策略A/B实验机制？' },
      { type: '误判纠偏', bucket: 'failure_review', text: '一次策略方向误判后如何纠偏？' },
      { type: '资源配置', bucket: 'metric_tradeoff', text: '多市场并行时如何分配预算与资源？' },
      { type: '跨团队协同', bucket: 'cross_team_collaboration', text: '如何推动投放、商品、客服协同执行？' },
      { type: '经验沉淀', bucket: 'system_process', text: '如何沉淀高复用站点运营方法论？' }
    ],
    interviewTopics: [
      { type: '波动应对', bucket: 'business_scenario', text: '流量突然下滑时你如何快速应对？' },
      { type: '协同推进', bucket: 'cross_team_collaboration', text: '投放和商品目标冲突时你如何推进？' },
      { type: '复盘叙述', bucket: 'failure_review', text: '讲一次你扭转站点下滑的经历。' },
      { type: '优先级决策', bucket: 'metric_tradeoff', text: '多策略并发时你如何排优先级？' },
      { type: '风险沟通', bucket: 'business_scenario', text: '你如何向管理层解释策略调整必要性？' },
      { type: '机制协作', bucket: 'cross_team_collaboration', text: '如何建立跨部门站点例会机制？' },
      { type: '失误修正', bucket: 'failure_review', text: '一次策略执行偏差后你如何修正？' },
      { type: '取舍题', bucket: 'metric_tradeoff', text: '短期增长和长期品牌冲突时如何取舍？' },
      { type: '方案答辩', bucket: 'business_scenario', text: '如何答辩你的站点增长路线图？' },
      { type: '经验复制', bucket: 'cross_team_collaboration', text: '如何让其他区域复用你的策略？' }
    ]
  },
  {
    file: 'data/entries/IND_ENERGY_UTILITIES.json',
    industryLabel: '能源与公用事业',
    roleId: 'IND_ENERGY_UTILITIES_ROLE_020',
    sourceRoleId: 'IND_ENERGY_UTILITIES_ROLE_019',
    roleName: '配网需求预测分析师',
    rolePatch: {
      role_readiness_floor: '至少完成1个配网需求预测项目：负荷数据治理、预测模型构建、误差监控和调度协同优化。',
      day_in_life: '配网需求预测分析师工作周：处理负荷与气象数据、迭代预测模型、分析误差来源、联动调度优化计划。',
      growth_path_1to3_year: '0-1年掌握配网负荷预测方法；1-3年独立负责区域预测；3-5年可主导预测体系和决策支持平台。',
      transfer_path_hint: '可转调度优化工程师、能源数据科学家、电力市场分析师；需补优化算法和市场规则能力，过渡6-10个月。',
      prep_90d_plan: ['1-30天：梳理配网预测口径与数据源。', '31-60天：完成1个预测偏差复盘案例。', '61-90天：完成10套需求预测题训练。'],
      career_outlook_3to5_year: '新型电力系统建设加速，需求预测岗位向模型化和实时化升级。',
      typical_work_week: '极端天气和节假日负荷波动阶段预测修正频繁。',
      switch_directions: [
        { target_role: '调度优化工程师', switch_cost: '中', bridge_skills: ['调度约束', '优化求解'], transition_period: '6-9个月' },
        { target_role: '能源数据科学家', switch_cost: '中高', bridge_skills: ['建模工程化', '特征工程'], transition_period: '7-10个月' },
        { target_role: '电力市场分析师', switch_cost: '中', bridge_skills: ['市场机制', '价格建模'], transition_period: '6-9个月' }
      ],
      prepare_180d_plan: ['91-120天：建立预测误差分层归因机制。', '121-150天：主导1次高偏差事件复盘专项。', '151-180天：沉淀负荷预测模型治理手册。'],
      role_scope_text: '负责配网负荷需求预测与模型迭代，对预测精度、稳定性和调度支撑价值负责。'
    },
    commonDeductionPoints: ['数据口径不统一。', '模型效果只看总体不看分时段。', '误差归因不深入。', '预测结果未转化为调度行动。'],
    starTemplate: {
      situation: '高温季节负荷预测误差扩大，影响调度计划准确性。',
      task: '快速收敛预测误差并恢复调度可用性。',
      action: ['重构特征并分场景校验模型表现。', '建立误差分层归因与阈值预警。', '联动调度更新用能计划并追踪效果。'],
      result: ['预测误差下降且计划执行更稳定。', '形成季节性预测优化机制。'],
      proof_materials: ['模型评估报告', '误差归因表', '调度协同记录']
    },
    writtenTopics: [
      { type: '预测策略', bucket: 'business_scenario', text: '高波动季节下你如何制定负荷预测策略？' },
      { type: '流程机制', bucket: 'system_process', text: '请设计“数据-建模-监控-迭代”预测流程。' },
      { type: '偏差复盘', bucket: 'failure_review', text: '一次预测偏差失控后你如何复盘？' },
      { type: '精度时效平衡', bucket: 'metric_tradeoff', text: '预测精度与交付时效冲突时如何取舍？' },
      { type: '特征治理', bucket: 'business_scenario', text: '如何建设配网需求预测特征体系？' },
      { type: '机制建设', bucket: 'system_process', text: '如何建立分层误差预警机制？' },
      { type: '误判纠偏', bucket: 'failure_review', text: '一次场景划分错误后如何纠偏？' },
      { type: '资源配置', bucket: 'metric_tradeoff', text: '多区域并行预测时如何分配分析资源？' },
      { type: '跨团队协同', bucket: 'cross_team_collaboration', text: '如何推动预测与调度团队协同？' },
      { type: '经验沉淀', bucket: 'system_process', text: '如何沉淀可复用的负荷预测方法？' }
    ],
    interviewTopics: [
      { type: '异常应对', bucket: 'business_scenario', text: '极端天气导致模型失效时你如何应对？' },
      { type: '协同推进', bucket: 'cross_team_collaboration', text: '预测与调度意见不一致时你如何推进？' },
      { type: '复盘叙述', bucket: 'failure_review', text: '讲一次你收敛预测误差的完整过程。' },
      { type: '优先级决策', bucket: 'metric_tradeoff', text: '多区域异常并发时你如何排优先级？' },
      { type: '风险沟通', bucket: 'business_scenario', text: '你如何向管理层解释预测不确定性？' },
      { type: '机制协作', bucket: 'cross_team_collaboration', text: '如何建立预测-调度联动机制？' },
      { type: '失误修正', bucket: 'failure_review', text: '一次模型选择错误后你如何修正？' },
      { type: '取舍题', bucket: 'metric_tradeoff', text: '局部精度与全局稳定冲突时如何取舍？' },
      { type: '方案答辩', bucket: 'business_scenario', text: '如何答辩你的需求预测方案？' },
      { type: '经验复制', bucket: 'cross_team_collaboration', text: '如何让团队复制你的模型治理方法？' }
    ]
  },
  {
    file: 'data/entries/IND_FIN_BANK.json',
    industryLabel: '金融-银行',
    roleId: 'IND_FIN_BANK_ROLE_020',
    sourceRoleId: 'IND_FIN_BANK_ROLE_019',
    roleName: '交易银行客户经理',
    rolePatch: {
      role_readiness_floor: '至少完成1个交易银行客户项目：客户现金管理需求诊断、产品组合设计、落地上线与经营复盘。',
      day_in_life: '交易银行客户经理工作周：拜访企业财资团队、识别结算和融资痛点、推动产品上线、跟踪活跃度和留存。',
      growth_path_1to3_year: '0-1年掌握交易银行产品与场景；1-3年独立经营重点客户；3-5年可主导行业交易银行方案。',
      transfer_path_hint: '可转公司金融产品经理、现金管理专家、对公风险管理岗；需补产品架构与数据经营能力，过渡6-10个月。',
      prep_90d_plan: ['1-30天：梳理交易银行核心产品和客户场景。', '31-60天：完成1个上线受阻复盘案例。', '61-90天：完成10套交易银行题训练。'],
      career_outlook_3to5_year: '企业财资数字化加速，交易银行复合型客户经理需求稳步增长。',
      typical_work_week: '月末结算高峰与项目上线并行时协同压力大。',
      switch_directions: [
        { target_role: '公司金融产品经理', switch_cost: '中', bridge_skills: ['产品设计', '流程优化'], transition_period: '6-9个月' },
        { target_role: '现金管理专家', switch_cost: '中', bridge_skills: ['资金归集', '结算方案'], transition_period: '6-9个月' },
        { target_role: '对公风险管理岗', switch_cost: '中高', bridge_skills: ['风险识别', '组合管理'], transition_period: '7-10个月' }
      ],
      prepare_180d_plan: ['91-120天：建立客户上线进度与活跃度监测机制。', '121-150天：主导1次客户流失复盘专项。', '151-180天：沉淀交易银行客户经营SOP。'],
      role_scope_text: '负责交易银行客户拓展与经营，对产品渗透率、上线效率和客户留存质量负责。'
    },
    commonDeductionPoints: ['只推产品不做场景诊断。', '上线推进缺少里程碑管理。', '客户活跃监测不到位。', '复盘不能指导后续经营。'],
    starTemplate: {
      situation: '重点行业客户上线率低，已签约项目迟迟未激活。',
      task: '在季度内提升上线与活跃率并降低流失。',
      action: ['分层诊断客户阻塞点并重排推进路径。', '联动产品与运营团队优化上线流程。', '建立周度活跃跟踪与客户回访机制。'],
      result: ['上线率和活跃率显著提升。', '形成可复用的交易银行客户经营机制。'],
      proof_materials: ['客户推进台账', '上线里程碑表', '活跃度分析报表']
    },
    writtenTopics: [
      { type: '场景经营', bucket: 'business_scenario', text: '你如何为制造业客户设计交易银行解决方案？' },
      { type: '流程机制', bucket: 'system_process', text: '请设计“诊断-方案-上线-经营”客户流程。' },
      { type: '流失复盘', bucket: 'failure_review', text: '一次客户流失后你如何复盘？' },
      { type: '规模质量平衡', bucket: 'metric_tradeoff', text: '冲客户数与保活跃度冲突时如何取舍？' },
      { type: '需求分析', bucket: 'business_scenario', text: '如何识别企业财资管理的核心痛点？' },
      { type: '机制建设', bucket: 'system_process', text: '如何建立交易银行客户经营看板？' },
      { type: '误判纠偏', bucket: 'failure_review', text: '一次产品匹配错误后如何纠偏？' },
      { type: '资源配置', bucket: 'metric_tradeoff', text: '多个重点客户并发时如何分配精力？' },
      { type: '跨团队协同', bucket: 'cross_team_collaboration', text: '如何推动产品、运营、技术协同上线？' },
      { type: '经验沉淀', bucket: 'system_process', text: '如何沉淀可复制的客户经营打法？' }
    ],
    interviewTopics: [
      { type: '节点应对', bucket: 'business_scenario', text: '客户临时延期上线时你如何应对？' },
      { type: '协同推进', bucket: 'cross_team_collaboration', text: '产品与客户需求不匹配时你如何推动调整？' },
      { type: '复盘叙述', bucket: 'failure_review', text: '讲一次你挽回重点客户的经历。' },
      { type: '优先级决策', bucket: 'metric_tradeoff', text: '多客户需求并发时你如何排序？' },
      { type: '风险沟通', bucket: 'business_scenario', text: '你如何向管理层说明客户经营风险？' },
      { type: '机制协作', bucket: 'cross_team_collaboration', text: '如何建立跨团队客户经营例会机制？' },
      { type: '失误修正', bucket: 'failure_review', text: '一次推进策略失误后你如何修正？' },
      { type: '取舍题', bucket: 'metric_tradeoff', text: '短期签约与长期活跃冲突时如何取舍？' },
      { type: '方案答辩', bucket: 'business_scenario', text: '如何答辩你的客户拓展计划？' },
      { type: '经验复制', bucket: 'cross_team_collaboration', text: '如何让团队复制你的客户经营方法？' }
    ]
  },
  {
    file: 'data/entries/IND_FIN_SECURITIES_FUND.json',
    industryLabel: '金融-证券基金',
    roleId: 'IND_FIN_SECURITIES_FUND_ROLE_020',
    sourceRoleId: 'IND_FIN_SECURITIES_FUND_ROLE_019',
    roleName: '券商投顾运营专员',
    rolePatch: {
      role_readiness_floor: '至少完成1个投顾运营项目：客户分层运营、内容与服务流程优化、数据追踪与效果复盘。',
      day_in_life: '券商投顾运营专员工作周：分析客户行为、制定投顾服务触达计划、协同投顾执行、监测留存与转化并复盘。',
      growth_path_1to3_year: '0-1年掌握投顾运营关键指标；1-3年独立负责客群运营；3-5年可主导投顾服务运营体系建设。',
      transfer_path_hint: '可转投顾产品经理、财富顾问、用户增长运营；需补产品化能力与合规理解，过渡6-10个月。',
      prep_90d_plan: ['1-30天：梳理投顾运营漏斗与触点。', '31-60天：完成1个留存下滑复盘案例。', '61-90天：完成10套投顾运营题训练。'],
      career_outlook_3to5_year: '财富管理转型持续，投顾服务运营岗位需求从执行向策略升级。',
      typical_work_week: '市场波动时期客户沟通和策略调整频次提升。',
      switch_directions: [
        { target_role: '投顾产品经理', switch_cost: '中', bridge_skills: ['产品设计', '需求管理'], transition_period: '6-9个月' },
        { target_role: '财富顾问', switch_cost: '中', bridge_skills: ['客户沟通', '资产配置'], transition_period: '6-9个月' },
        { target_role: '用户增长运营', switch_cost: '中高', bridge_skills: ['增长实验', '用户分层'], transition_period: '7-10个月' }
      ],
      prepare_180d_plan: ['91-120天：建立投顾客户留存预警机制。', '121-150天：主导1次服务转化复盘专项。', '151-180天：沉淀投顾运营SOP和触达模板。'],
      role_scope_text: '负责投顾业务运营与客户服务协同，对客户活跃度、留存率和服务转化效率负责。'
    },
    commonDeductionPoints: ['客户分层过粗导致触达无效。', '服务动作缺少量化目标。', '合规边界描述不清。', '复盘未形成策略迭代。'],
    starTemplate: {
      situation: '投顾客户活跃度下降，服务转化率连续两个周期下滑。',
      task: '在合规前提下提升客户活跃和转化。',
      action: ['重构客户分层和触达节奏。', '联动投顾优化服务内容与节点评估。', '建立转化漏斗看板并周度复盘。'],
      result: ['活跃度回升且转化效率提升。', '形成可复制的投顾运营机制。'],
      proof_materials: ['客户分层策略', '触达计划', '转化分析报告']
    },
    writtenTopics: [
      { type: '客群运营', bucket: 'business_scenario', text: '你如何制定投顾客户分层运营方案？' },
      { type: '流程机制', bucket: 'system_process', text: '请设计“分层-触达-服务-复盘”运营流程。' },
      { type: '留存复盘', bucket: 'failure_review', text: '一次客户留存下降后你如何复盘？' },
      { type: '转化体验平衡', bucket: 'metric_tradeoff', text: '提升转化与维持体验冲突时如何取舍？' },
      { type: '内容策略', bucket: 'business_scenario', text: '如何搭建投顾服务内容策略矩阵？' },
      { type: '机制建设', bucket: 'system_process', text: '如何建立投顾运营监控看板？' },
      { type: '误判纠偏', bucket: 'failure_review', text: '一次分层策略误判后如何纠偏？' },
      { type: '资源配置', bucket: 'metric_tradeoff', text: '多客群并行时如何分配运营资源？' },
      { type: '跨团队协同', bucket: 'cross_team_collaboration', text: '如何推动投顾、产品、合规协同？' },
      { type: '经验沉淀', bucket: 'system_process', text: '如何沉淀高转化投顾运营方法？' }
    ],
    interviewTopics: [
      { type: '波动应对', bucket: 'business_scenario', text: '市场剧烈波动时你如何组织投顾运营？' },
      { type: '协同推进', bucket: 'cross_team_collaboration', text: '投顾与合规对触达内容有分歧时怎么推进？' },
      { type: '复盘叙述', bucket: 'failure_review', text: '讲一次你修复投顾运营失效的经历。' },
      { type: '优先级决策', bucket: 'metric_tradeoff', text: '多个客群需求并发时你如何排序？' },
      { type: '风险沟通', bucket: 'business_scenario', text: '你如何向管理层解释转化波动原因？' },
      { type: '机制协作', bucket: 'cross_team_collaboration', text: '如何建立投顾运营周度协同机制？' },
      { type: '失误修正', bucket: 'failure_review', text: '一次触达策略失误后你如何修正？' },
      { type: '取舍题', bucket: 'metric_tradeoff', text: '短期转化和长期信任冲突时如何取舍？' },
      { type: '方案答辩', bucket: 'business_scenario', text: '如何答辩你的投顾运营提升方案？' },
      { type: '经验复制', bucket: 'cross_team_collaboration', text: '如何让团队复用你的运营方法？' }
    ]
  },
  {
    file: 'data/entries/IND_NEW_ENERGY.json',
    industryLabel: '新能源',
    roleId: 'IND_NEW_ENERGY_ROLE_020',
    sourceRoleId: 'IND_NEW_ENERGY_ROLE_019',
    roleName: '光储协同优化工程师',
    rolePatch: {
      role_readiness_floor: '至少完成1个光储协同优化项目：发电预测、储能策略联动、约束校验与收益复盘。',
      day_in_life: '光储协同优化工程师工作周：分析光伏出力与负荷、设计光储联动策略、监控偏差、推动策略回归优化。',
      growth_path_1to3_year: '0-1年掌握光储协同建模；1-3年独立负责站点协同优化；3-5年可主导区域级光储策略体系。',
      transfer_path_hint: '可转新能源交易策略、储能系统工程师、能源算法工程师；需补市场交易与优化算法能力，过渡6-10个月。',
      prep_90d_plan: ['1-30天：梳理光储协同控制目标与约束。', '31-60天：完成1个协同失效复盘案例。', '61-90天：完成10套光储协同题训练。'],
      career_outlook_3to5_year: '高比例新能源并网推动光储协同岗位需求快速增长。',
      typical_work_week: '天气突变与电价波动期间策略调优频次显著增加。',
      switch_directions: [
        { target_role: '新能源交易策略岗', switch_cost: '中', bridge_skills: ['交易机制', '收益建模'], transition_period: '6-9个月' },
        { target_role: '储能系统工程师', switch_cost: '中', bridge_skills: ['系统约束', '设备特性'], transition_period: '6-9个月' },
        { target_role: '能源算法工程师', switch_cost: '中高', bridge_skills: ['优化算法', '模型工程化'], transition_period: '7-10个月' }
      ],
      prepare_180d_plan: ['91-120天：建立光储协同策略评估与告警机制。', '121-150天：主导1次收益偏差复盘专项。', '151-180天：沉淀光储协同优化模板与参数库。'],
      role_scope_text: '负责光储协同策略设计与迭代，对协同效率、收益稳定性和执行偏差控制负责。'
    },
    commonDeductionPoints: ['只优化单侧不考虑协同。', '约束边界和设备限制考虑不足。', '策略收益评估缺乏对照。', '复盘未沉淀参数治理机制。'],
    starTemplate: {
      situation: '连续阴雨导致光伏出力偏差增大，储能策略收益显著下滑。',
      task: '在波动场景下恢复光储协同收益并控制偏差。',
      action: ['重估出力预测并调整充放电策略。', '建立多场景仿真与实时纠偏机制。', '联动运维与交易团队优化执行。'],
      result: ['协同收益恢复且偏差收敛。', '形成可复用的波动期协同策略。'],
      proof_materials: ['策略参数文档', '仿真评估结果', '收益复盘报告']
    },
    writtenTopics: [
      { type: '协同策略', bucket: 'business_scenario', text: '你如何设计光伏与储能协同优化策略？' },
      { type: '流程机制', bucket: 'system_process', text: '请设计“预测-调度-执行-复盘”光储流程。' },
      { type: '偏差复盘', bucket: 'failure_review', text: '一次光储协同失效后你如何复盘？' },
      { type: '收益稳定平衡', bucket: 'metric_tradeoff', text: '收益最大化与稳定性冲突时如何取舍？' },
      { type: '约束建模', bucket: 'business_scenario', text: '如何把设备约束纳入光储策略模型？' },
      { type: '机制建设', bucket: 'system_process', text: '如何建立光储协同策略监控机制？' },
      { type: '误判纠偏', bucket: 'failure_review', text: '一次出力预测误判后如何纠偏？' },
      { type: '资源配置', bucket: 'metric_tradeoff', text: '多站点并发优化时如何分配算力与人力？' },
      { type: '跨团队协同', bucket: 'cross_team_collaboration', text: '如何推动运维、交易、调度协同执行？' },
      { type: '经验沉淀', bucket: 'system_process', text: '如何沉淀光储协同优化方法库？' }
    ],
    interviewTopics: [
      { type: '异常应对', bucket: 'business_scenario', text: '极端天气导致策略失效时你如何应对？' },
      { type: '协同推进', bucket: 'cross_team_collaboration', text: '交易目标与设备约束冲突时你如何推进？' },
      { type: '复盘叙述', bucket: 'failure_review', text: '讲一次你修复光储协同偏差的经历。' },
      { type: '优先级决策', bucket: 'metric_tradeoff', text: '多站点告警并发时你如何排序处置？' },
      { type: '风险沟通', bucket: 'business_scenario', text: '你如何向管理层解释协同策略收缩？' },
      { type: '机制协作', bucket: 'cross_team_collaboration', text: '如何建立光储协同例会与复盘机制？' },
      { type: '失误修正', bucket: 'failure_review', text: '一次参数设置失误后你如何修正？' },
      { type: '取舍题', bucket: 'metric_tradeoff', text: '短期收益与设备健康冲突时如何取舍？' },
      { type: '方案答辩', bucket: 'business_scenario', text: '如何答辩你的光储协同优化方案？' },
      { type: '经验复制', bucket: 'cross_team_collaboration', text: '如何让团队复用你的协同策略？' }
    ]
  },
  {
    file: 'data/entries/IND_PUBLIC_INSTITUTION.json',
    industryLabel: '事业单位体系',
    roleId: 'IND_PUBLIC_INSTITUTION_ROLE_020',
    sourceRoleId: 'IND_PUBLIC_INSTITUTION_ROLE_019',
    roleName: '医共体运营管理专员',
    rolePatch: {
      role_readiness_floor: '至少完成1个医共体运营项目：协同机制设计、资源统筹、指标跟踪与改进闭环。',
      day_in_life: '医共体运营管理专员工作周：统筹成员单位协同事项、跟踪双向转诊和服务质量、推进问题整改并输出运营复盘。',
      growth_path_1to3_year: '0-1年掌握医共体运营流程和关键指标；1-3年独立负责协同项目；3-5年可主导区域医共体运营优化。',
      transfer_path_hint: '可转医院运营经理、医务管理岗、卫生政策执行岗；需补数据治理与政策协同能力，过渡6-10个月。',
      prep_90d_plan: ['1-30天：梳理医共体协同机制与指标。', '31-60天：完成1个转诊链路复盘案例。', '61-90天：完成10套医共体运营题训练。'],
      career_outlook_3to5_year: '分级诊疗与医联体建设持续推进，医共体运营岗位需求保持稳定。',
      typical_work_week: '考核周期和专项检查期跨机构协同任务高密度。',
      switch_directions: [
        { target_role: '医院运营经理', switch_cost: '中', bridge_skills: ['流程优化', '绩效管理'], transition_period: '6-9个月' },
        { target_role: '医务管理岗', switch_cost: '中', bridge_skills: ['制度治理', '质量管理'], transition_period: '6-9个月' },
        { target_role: '卫生政策执行岗', switch_cost: '中高', bridge_skills: ['政策解读', '项目评估'], transition_period: '7-10个月' }
      ],
      prepare_180d_plan: ['91-120天：建立医共体协同运营指标预警机制。', '121-150天：主导1次跨机构协同复盘专项。', '151-180天：沉淀医共体运营SOP与协同模板。'],
      role_scope_text: '负责医共体协同运营与改进闭环，对转诊效率、服务质量和协同机制落地负责。'
    },
    commonDeductionPoints: ['协同机制停留在会议层面。', '指标设计缺少可执行口径。', '跨机构问题闭环不完整。', '复盘未形成制度化改进。'],
    starTemplate: {
      situation: '医共体内双向转诊效率低，患者等待时间持续偏高。',
      task: '在资源不扩张前提下优化转诊流程和协同效率。',
      action: ['梳理转诊链路并识别关键瓶颈。', '推动成员单位统一协同节点与反馈机制。', '建立周度指标跟踪和整改复盘机制。'],
      result: ['转诊效率提升且患者等待时间下降。', '形成可复制的医共体协同运营机制。'],
      proof_materials: ['流程改进方案', '协同会议纪要', '指标复盘报告']
    },
    writtenTopics: [
      { type: '协同治理', bucket: 'business_scenario', text: '你如何设计医共体协同运营治理方案？' },
      { type: '流程机制', bucket: 'system_process', text: '请设计“统筹-执行-监测-复盘”医共体运营流程。' },
      { type: '失效复盘', bucket: 'failure_review', text: '一次转诊链路失效后你如何复盘？' },
      { type: '效率公平平衡', bucket: 'metric_tradeoff', text: '效率提升与基层公平覆盖冲突时如何取舍？' },
      { type: '指标体系', bucket: 'business_scenario', text: '如何建立医共体运营核心指标体系？' },
      { type: '机制建设', bucket: 'system_process', text: '如何搭建跨机构问题闭环机制？' },
      { type: '误判纠偏', bucket: 'failure_review', text: '一次资源配置误判后如何纠偏？' },
      { type: '资源配置', bucket: 'metric_tradeoff', text: '多单位诉求并发时如何分配运营资源？' },
      { type: '跨团队协同', bucket: 'cross_team_collaboration', text: '如何推动医院、基层和主管部门协同？' },
      { type: '经验沉淀', bucket: 'system_process', text: '如何沉淀可复制的医共体运营方法？' }
    ],
    interviewTopics: [
      { type: '突发应对', bucket: 'business_scenario', text: '成员单位临时退出协作时你如何应对？' },
      { type: '协同推进', bucket: 'cross_team_collaboration', text: '多机构目标不一致时你如何推进协同？' },
      { type: '复盘叙述', bucket: 'failure_review', text: '讲一次你修复医共体协同失效的经历。' },
      { type: '优先级决策', bucket: 'metric_tradeoff', text: '多项整改任务并发时你如何排序？' },
      { type: '风险沟通', bucket: 'business_scenario', text: '你如何向主管部门解释协同风险？' },
      { type: '机制协作', bucket: 'cross_team_collaboration', text: '如何建立医共体常态化协同机制？' },
      { type: '失误修正', bucket: 'failure_review', text: '一次推进策略失误后你如何修正？' },
      { type: '取舍题', bucket: 'metric_tradeoff', text: '短期考核达标与长期能力建设冲突时如何取舍？' },
      { type: '方案答辩', bucket: 'business_scenario', text: '如何答辩你的医共体运营改进方案？' },
      { type: '经验复制', bucket: 'cross_team_collaboration', text: '如何让成员单位复用你的运营机制？' }
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
    data_origin: 'official_jd_competency_mapping_with_manual_role_enrichment_v161_batch14_add_role020',
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
  newRole.role_detail_v158.expansion_status = 'landed_deep_profile_v161_batch14';

  roles.push(newRole);

  const writtenBasePool = writtenItems.filter((q) => q.role_id === u.sourceRoleId);
  const interviewBasePool = interviewItems.filter((q) => q.role_id === u.sourceRoleId);
  if (writtenBasePool.length === 0 || interviewBasePool.length === 0) throw new Error(`Question base missing: ${u.sourceRoleId}`);

  const industryPrefix = u.roleId.split('_ROLE_')[0];

  for (let i = 0; i < 10; i += 1) {
    const def = u.writtenTopics[i];
    const [stage, round] = WRITTEN_STAGES[i];
    const qid = `${industryPrefix}_WRITTEN_V161_R020N_${String(i + 1).padStart(2, '0')}`;
    if (writtenItems.some((q) => q.question_id === qid)) throw new Error(`Duplicate question id: ${qid}`);
    const base = writtenBasePool[i % writtenBasePool.length];
    writtenItems.push(buildQuestion(base, def, u.roleId, u.roleName, qid, stage, round, u.industryLabel, def.type, def.bucket));
  }

  for (let i = 0; i < 10; i += 1) {
    const def = u.interviewTopics[i];
    const [stage, round] = INTERVIEW_STAGES[i];
    const qid = `${industryPrefix}_INTERVIEW_V161_R020N_${String(i + 1).padStart(2, '0')}`;
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
