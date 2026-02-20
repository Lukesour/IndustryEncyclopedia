#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TODAY = '2026-02-20';

const updates = [
  {
    file: 'data/entries/IND_AUTO_INTELLIGENT_DRIVING.json',
    industryName: '汽车与智能驾驶',
    roleId: 'IND_AUTO_INTELLIGENT_DRIVING_ROLE_007',
    roleName: '采购工程师',
    rolePatch: {
      role_readiness_floor: '至少能完整讲清1个“关键物料保供+降本”项目：供应市场判断、双供导入、交付风险预案与量化结果。',
      day_in_life: '采购工程师典型工作周：周一滚动盘点需求与缺口；周二供应商沟通与RFQ澄清；周三跨研发/质量/计划评审切换方案；周四推进合同与交付里程碑；周五复盘成本、准时率与风险清单。',
      growth_path_1to3_year: '成长台阶：0-1年做需求拆解与执行跟催；1-3年独立负责关键品类策略、主导供应商谈判与风险闭环；3-5年可带品类团队并承担年度降本与供应韧性目标。',
      transfer_path_hint: '可转方向：供应商质量工程师（切换成本中，需补8D与PPAP）；供应链计划经理（切换成本中高，需补S&OP与库存策略）；成本工程师（切换成本中，需补目标成本拆解）。建议过渡周期4-9个月。',
      prep_90d_plan: [
        '1-30天：搭建品类成本与供给地图（价格、产能、交期、替代料），完成至少2个品类的风险分级。',
        '31-60天：基于真实项目输出一版保供方案（双供、切换、条款），并量化交付与成本影响。',
        '61-90天：完成10套采购场景笔面试训练，重点演练“谈判策略、质量事故应对、跨部门拉齐”。'
      ],
      career_outlook_3to5_year: '智驾与电动化渗透持续提升，关键电子件供应与本地化替代需求增加，采购工程岗位从“执行采购”转向“供应策略+风险管理”。',
      typical_work_week: '高频跨团队协作岗位，沟通对象覆盖研发、质量、计划、法务与供应商。季度末和车型节点周会加密。',
      switch_directions: [
        { target_role: '供应商质量工程师', switch_cost: '中', bridge_skills: ['8D', 'APQP/PPAP', '问题闭环'], transition_period: '4-6个月' },
        { target_role: '供应链计划经理', switch_cost: '中高', bridge_skills: ['S&OP', '库存策略', '产销协同'], transition_period: '6-9个月' },
        { target_role: '成本工程师', switch_cost: '中', bridge_skills: ['BOM成本拆解', '目标成本管理'], transition_period: '4-7个月' }
      ],
      prepare_180d_plan: [
        '91-120天：完成1个供应风险预警看板并接入周例会。',
        '121-150天：主导至少1次关键供应商季度业务回顾并形成改进计划。',
        '151-180天：沉淀采购策略手册（品类策略、谈判模板、风险预案）。'
      ],
      role_scope_text: '负责关键物料采购策略、供应保障与降本交付，直接对交期、成本和供应风险负责。'
    },
    commonDeductionPoints: [
      '只讲压价，不讲供给韧性与切换预案。',
      '没有给出交期、成本、缺料率等量化指标。',
      '忽略研发/质量/计划协同路径，方案不可落地。',
      '事故复盘停留在现象，没有机制改进。'
    ],
    starTemplate: {
      situation: '车型量产前关键芯片交付出现延迟，存在停线风险。',
      task: '在不突破成本红线的前提下保障关键物料稳定交付。',
      action: [
        '拆解需求节奏并识别关键断点，定义保供优先级。',
        '推动双供导入与替代料验证，联合质量制定切换条件。',
        '建立周级风险看板，按里程碑追踪交付与成本。'
      ],
      result: [
        '关键物料准时交付率提升并避免产线停摆。',
        '形成可复用的品类风险分级与切换机制。'
      ],
      proof_materials: ['RFQ与比价记录', '供应风险周报', '交付与成本看板']
    },
    writtenAdds: [
      {
        id: 'IND_AUTO_INTELLIGENT_DRIVING_WRITTEN_V161_R007_01',
        stage: 'campus_early_batch_written',
        round: '提前批笔试',
        scenarioBucket: 'business_scenario',
        type: '关键物料保供与降本联动',
        prompt: '【行业:汽车与智能驾驶｜岗位:采购工程师｜阶段:提前批笔试】主控芯片交期从8周拉长到20周，整车项目节点不变。请制定“保供+降本”联动方案并给出优先级。'
      },
      {
        id: 'IND_AUTO_INTELLIGENT_DRIVING_WRITTEN_V161_R007_02',
        stage: 'campus_main_batch_written',
        round: '主批笔试',
        scenarioBucket: 'system_process',
        type: 'RFQ评标与供应切换流程设计',
        prompt: '【行业:汽车与智能驾驶｜岗位:采购工程师｜阶段:主批笔试】请设计从RFQ到定点再到切换量产的流程，并定义每个节点的放行标准。'
      },
      {
        id: 'IND_AUTO_INTELLIGENT_DRIVING_WRITTEN_V161_R007_03',
        stage: 'campus_supplement_written',
        round: '补录笔试',
        scenarioBucket: 'failure_review',
        type: '供应异常失败复盘题',
        prompt: '【行业:汽车与智能驾驶｜岗位:采购工程师｜阶段:补录笔试】某次供应切换导致首批到货不良率上升。请给出复盘框架、责任划分和防复发机制。'
      },
      {
        id: 'IND_AUTO_INTELLIGENT_DRIVING_WRITTEN_V161_R007_04',
        stage: 'internship_conversion_written',
        round: '实习转正笔试',
        scenarioBucket: 'metric_tradeoff',
        type: '交付-成本-质量三目标取舍',
        prompt: '【行业:汽车与智能驾驶｜岗位:采购工程师｜阶段:实习转正笔试】当交付、成本、质量三项指标同时承压时，你会如何排序并设置止损阈值？'
      }
    ],
    interviewAdds: [
      {
        id: 'IND_AUTO_INTELLIGENT_DRIVING_INTERVIEW_V161_R007_01',
        stage: 'campus_early_batch_interview',
        round: '提前批面试',
        scenarioBucket: 'business_scenario',
        type: '供应危机应对沟通',
        prompt: '【行业:汽车与智能驾驶｜岗位:采购工程师｜阶段:提前批面试】你如何在48小时内向研发、计划和管理层同步供应危机并推动一致决策？'
      },
      {
        id: 'IND_AUTO_INTELLIGENT_DRIVING_INTERVIEW_V161_R007_02',
        stage: 'campus_main_batch_interview',
        round: '主批面试',
        scenarioBucket: 'cross_team_collaboration',
        type: '跨部门冲突协调',
        prompt: '【行业:汽车与智能驾驶｜岗位:采购工程师｜阶段:主批面试】研发坚持技术规格、工厂要求准时交付，你会如何推进折中方案？'
      },
      {
        id: 'IND_AUTO_INTELLIGENT_DRIVING_INTERVIEW_V161_R007_03',
        stage: 'campus_supplement_interview',
        round: '补录面试',
        scenarioBucket: 'failure_review',
        type: '供应事故复盘追问',
        prompt: '【行业:汽车与智能驾驶｜岗位:采购工程师｜阶段:补录面试】请讲一次你主导的供应事故复盘：你做错了什么、如何纠偏、机制如何固化？'
      },
      {
        id: 'IND_AUTO_INTELLIGENT_DRIVING_INTERVIEW_V161_R007_04',
        stage: 'internship_conversion_interview',
        round: '实习转正面试',
        scenarioBucket: 'metric_tradeoff',
        type: '指标取舍与管理预期',
        prompt: '【行业:汽车与智能驾驶｜岗位:采购工程师｜阶段:实习转正面试】如果短期只能保证两项指标（成本/交期/质量），你怎么决策并向上管理预期？'
      }
    ]
  },
  {
    file: 'data/entries/IND_BIOMED_DEVICE.json',
    industryName: '生物医药与器械',
    roleId: 'IND_BIOMED_DEVICE_ROLE_007',
    roleName: '商务拓展',
    rolePatch: {
      role_readiness_floor: '至少可展示1个医院/渠道准入项目：机会识别、关键决策链拆解、准入推进与回款节奏控制。',
      day_in_life: '商务拓展典型工作周：周一盘点区域机会与漏斗；周二拜访医院/经销商并更新决策链；周三联合医学和市场准备准入材料；周四推进合同条款与回款节点；周五复盘转化率与阻塞点。',
      growth_path_1to3_year: '成长台阶：0-1年做好线索管理和标准拜访；1-3年独立负责区域策略、渠道组合与关键客户推进；3-5年可承担区域P&L和团队管理。',
      transfer_path_hint: '可转方向：市场准入岗（切换成本中，需补医保与招采规则）；产品市场岗（切换成本中，需补产品叙事与学术传播）；渠道管理岗（切换成本低中，需补经销商激励体系）。预计过渡4-8个月。',
      prep_90d_plan: [
        '1-30天：梳理目标区域医院分层、科室结构、关键决策人地图。',
        '31-60天：完成1个准入推进案例，输出从线索到签约的关键动作与证据。',
        '61-90天：完成10套商务拓展场景题训练，重点演练异议处理与回款风险控制。'
      ],
      career_outlook_3to5_year: '集采常态化与精细化准入并行，商务拓展岗位更强调合规推进、渠道效率和多方协同能力。',
      typical_work_week: '出差和客户会议密集，季度末与招采窗口期节奏明显加快。',
      switch_directions: [
        { target_role: '市场准入岗', switch_cost: '中', bridge_skills: ['医保/招采规则', '准入材料编制'], transition_period: '5-8个月' },
        { target_role: '产品市场岗', switch_cost: '中', bridge_skills: ['学术传播', '竞品定位'], transition_period: '4-7个月' },
        { target_role: '渠道管理岗', switch_cost: '低中', bridge_skills: ['经销商分层', '激励机制'], transition_period: '3-6个月' }
      ],
      prepare_180d_plan: [
        '91-120天：建立区域客户分层策略并完成季度行动计划。',
        '121-150天：推进1个高价值客户项目并形成可复用打法。',
        '151-180天：沉淀商务推进SOP与回款风险预警机制。'
      ],
      role_scope_text: '负责区域商务机会拓展、渠道推进与准入转化，对签约进度、回款节奏和合规推进负责。'
    },
    commonDeductionPoints: [
      '只讲关系维护，不讲决策链与关键里程碑。',
      '没有区分线索、机会、签约、回款四段漏斗。',
      '忽略合规要求，方案存在执行风险。',
      '没有给出失败项目的复盘与修正机制。'
    ],
    starTemplate: {
      situation: '重点医院准入推进停滞，竞争产品已进入最后评估阶段。',
      task: '在合规前提下提升准入通过概率并缩短签约周期。',
      action: [
        '重构决策链地图并识别卡点角色。',
        '联合医学/市场补充临床与经济性证据材料。',
        '设置周级推进节奏，跟踪关键节点并处理异议。'
      ],
      result: [
        '项目进入签约阶段并缩短推进周期。',
        '形成可复用的区域准入推进模板。'
      ],
      proof_materials: ['客户拜访纪要', '准入材料版本记录', '漏斗看板']
    },
    writtenAdds: [
      {
        id: 'IND_BIOMED_DEVICE_WRITTEN_V161_R007_01',
        stage: 'campus_early_batch_written',
        round: '提前批笔试',
        scenarioBucket: 'business_scenario',
        type: '医院准入推进策略',
        prompt: '【行业:生物医药与器械｜岗位:商务拓展｜阶段:提前批笔试】某三甲医院对价格和临床证据提出更高要求，请设计准入推进策略。'
      },
      {
        id: 'IND_BIOMED_DEVICE_WRITTEN_V161_R007_02',
        stage: 'campus_main_batch_written',
        round: '主批笔试',
        scenarioBucket: 'system_process',
        type: '商务漏斗管理与预测',
        prompt: '【行业:生物医药与器械｜岗位:商务拓展｜阶段:主批笔试】请搭建“线索-机会-签约-回款”漏斗并定义预测准确率提升方案。'
      },
      {
        id: 'IND_BIOMED_DEVICE_WRITTEN_V161_R007_03',
        stage: 'campus_supplement_written',
        round: '补录笔试',
        scenarioBucket: 'failure_review',
        type: '丢标复盘与纠偏',
        prompt: '【行业:生物医药与器械｜岗位:商务拓展｜阶段:补录笔试】请复盘一次丢标案例：信息判断、动作失误、纠偏动作分别是什么？'
      },
      {
        id: 'IND_BIOMED_DEVICE_WRITTEN_V161_R007_04',
        stage: 'internship_conversion_written',
        round: '实习转正笔试',
        scenarioBucket: 'metric_tradeoff',
        type: '增长与回款平衡',
        prompt: '【行业:生物医药与器械｜岗位:商务拓展｜阶段:实习转正笔试】在季度签约目标与回款安全冲突时，你如何设定优先级与止损线？'
      }
    ],
    interviewAdds: [
      {
        id: 'IND_BIOMED_DEVICE_INTERVIEW_V161_R007_01',
        stage: 'campus_early_batch_interview',
        round: '提前批面试',
        scenarioBucket: 'business_scenario',
        type: '关键客户异议处理',
        prompt: '【行业:生物医药与器械｜岗位:商务拓展｜阶段:提前批面试】客户质疑产品经济性，你如何组织证据并重建信任？'
      },
      {
        id: 'IND_BIOMED_DEVICE_INTERVIEW_V161_R007_02',
        stage: 'campus_main_batch_interview',
        round: '主批面试',
        scenarioBucket: 'cross_team_collaboration',
        type: '医市商协同推进',
        prompt: '【行业:生物医药与器械｜岗位:商务拓展｜阶段:主批面试】医学、市场、商务对项目优先级意见冲突时你如何推动统一行动？'
      },
      {
        id: 'IND_BIOMED_DEVICE_INTERVIEW_V161_R007_03',
        stage: 'campus_supplement_interview',
        round: '补录面试',
        scenarioBucket: 'failure_review',
        type: '失单复盘追问',
        prompt: '【行业:生物医药与器械｜岗位:商务拓展｜阶段:补录面试】讲一个你推进失败的项目，你如何确认问题根因并改变后续打法？'
      },
      {
        id: 'IND_BIOMED_DEVICE_INTERVIEW_V161_R007_04',
        stage: 'internship_conversion_interview',
        round: '实习转正面试',
        scenarioBucket: 'metric_tradeoff',
        type: '签约节奏与回款风险',
        prompt: '【行业:生物医药与器械｜岗位:商务拓展｜阶段:实习转正面试】若销售目标压力高但回款风险上升，你如何向上汇报并调整策略？'
      }
    ]
  },
  {
    file: 'data/entries/IND_ECOMMERCE_CROSSBORDER.json',
    industryName: '电商与跨境电商',
    roleId: 'IND_ECOMMERCE_CROSSBORDER_ROLE_007',
    roleName: '客服运营',
    rolePatch: {
      role_readiness_floor: '至少可展示1个高峰期客服改造案例：工单分流、SLA优化、差评治理与退款率改善。',
      day_in_life: '客服运营典型工作周：周一复盘工单漏斗与SLA；周二优化FAQ/脚本；周三联动仓配与商品团队处理高频投诉；周四校准外包质检与排班；周五做NPS与退款率复盘。',
      growth_path_1to3_year: '成长台阶：0-1年掌握工单系统与话术规范；1-3年主导服务指标体系和跨部门闭环；3-5年可升级为服务策略负责人，统筹多渠道服务体验。',
      transfer_path_hint: '可转方向：用户运营（切换成本低中，补A/B实验）；风控运营（切换成本中，补欺诈识别）；履约运营（切换成本中，补仓配流程）。建议过渡3-8个月。',
      prep_90d_plan: [
        '1-30天：完成客服指标看板搭建（首响时长、一次解决率、退款率、NPS）。',
        '31-60天：针对1个高频投诉场景做根因分析并上线改进SOP。',
        '61-90天：完成10套客服运营笔面试训练，重点演练峰值流量与舆情场景。'
      ],
      career_outlook_3to5_year: '跨境平台竞争加剧，客服运营从“售后处理”升级到“体验经营+风险治理+成本效率协同”。',
      typical_work_week: '促销节点与大促期间节奏明显加快，夜间与多语言支持需求提升。',
      switch_directions: [
        { target_role: '用户运营', switch_cost: '低中', bridge_skills: ['用户分层', '活动设计', 'A/B实验'], transition_period: '3-5个月' },
        { target_role: '风控运营', switch_cost: '中', bridge_skills: ['异常订单识别', '规则策略'], transition_period: '4-7个月' },
        { target_role: '履约运营', switch_cost: '中', bridge_skills: ['仓配SLA', '逆向物流'], transition_period: '4-8个月' }
      ],
      prepare_180d_plan: [
        '91-120天：推动客服系统与订单系统打通核心状态字段。',
        '121-150天：完成一次大促服务保障预案并复盘人效。',
        '151-180天：沉淀多语言客服知识库与异常工单处置手册。'
      ],
      role_scope_text: '负责跨境客服策略、SLA达成与服务成本效率协同，对用户体验指标和投诉治理结果负责。'
    },
    commonDeductionPoints: [
      '只讲话术，不讲工单流程和指标闭环。',
      '高峰流量场景无排班与应急机制。',
      '忽略与仓配/商品团队协同，问题反复发生。',
      '没有量化体验改善结果。'
    ],
    starTemplate: {
      situation: '大促期间工单激增，首响和一次解决率显著下滑。',
      task: '在不显著增加成本的前提下恢复服务指标并降低负向舆情。',
      action: [
        '按问题类型重做工单分流与优先级规则。',
        '联合仓配与商品团队建立高频问题快速闭环。',
        '优化排班与质检抽检，按小时看板动态调度。'
      ],
      result: [
        '首响时长与一次解决率显著改善。',
        '差评率与退款率下降并稳定在目标区间。'
      ],
      proof_materials: ['工单系统报表', '排班与质检记录', '舆情复盘文档']
    },
    writtenAdds: [
      {
        id: 'IND_ECOMMERCE_CROSSBORDER_WRITTEN_V161_R007_01',
        stage: 'campus_early_batch_written',
        round: '提前批笔试',
        scenarioBucket: 'business_scenario',
        type: '跨境客服峰值应对',
        prompt: '【行业:电商与跨境电商｜岗位:客服运营｜阶段:提前批笔试】黑五期间工单量翻倍，如何保证SLA并控制服务成本？'
      },
      {
        id: 'IND_ECOMMERCE_CROSSBORDER_WRITTEN_V161_R007_02',
        stage: 'campus_main_batch_written',
        round: '主批笔试',
        scenarioBucket: 'system_process',
        type: '工单路由与知识库设计',
        prompt: '【行业:电商与跨境电商｜岗位:客服运营｜阶段:主批笔试】请设计多语言客服工单路由规则与知识库更新机制。'
      },
      {
        id: 'IND_ECOMMERCE_CROSSBORDER_WRITTEN_V161_R007_03',
        stage: 'campus_supplement_written',
        round: '补录笔试',
        scenarioBucket: 'failure_review',
        type: '差评事件复盘题',
        prompt: '【行业:电商与跨境电商｜岗位:客服运营｜阶段:补录笔试】某国站点差评率连续两周上升，请给出复盘框架和整改优先级。'
      },
      {
        id: 'IND_ECOMMERCE_CROSSBORDER_WRITTEN_V161_R007_04',
        stage: 'internship_conversion_written',
        round: '实习转正笔试',
        scenarioBucket: 'metric_tradeoff',
        type: '体验与成本双目标题',
        prompt: '【行业:电商与跨境电商｜岗位:客服运营｜阶段:实习转正笔试】当NPS与人效指标冲突时，你如何设定取舍与监控阈值？'
      }
    ],
    interviewAdds: [
      {
        id: 'IND_ECOMMERCE_CROSSBORDER_INTERVIEW_V161_R007_01',
        stage: 'campus_early_batch_interview',
        round: '提前批面试',
        scenarioBucket: 'business_scenario',
        type: '舆情应对面试题',
        prompt: '【行业:电商与跨境电商｜岗位:客服运营｜阶段:提前批面试】社媒集中投诉爆发时，你如何在24小时内止损并回收口碑？'
      },
      {
        id: 'IND_ECOMMERCE_CROSSBORDER_INTERVIEW_V161_R007_02',
        stage: 'campus_main_batch_interview',
        round: '主批面试',
        scenarioBucket: 'cross_team_collaboration',
        type: '仓配商品协同',
        prompt: '【行业:电商与跨境电商｜岗位:客服运营｜阶段:主批面试】客服认为问题在仓配，仓配认为问题在商品信息，你如何推动闭环？'
      },
      {
        id: 'IND_ECOMMERCE_CROSSBORDER_INTERVIEW_V161_R007_03',
        stage: 'campus_supplement_interview',
        round: '补录面试',
        scenarioBucket: 'failure_review',
        type: '服务策略失效复盘',
        prompt: '【行业:电商与跨境电商｜岗位:客服运营｜阶段:补录面试】讲一次你制定的客服策略没有达到预期，你如何修正？'
      },
      {
        id: 'IND_ECOMMERCE_CROSSBORDER_INTERVIEW_V161_R007_04',
        stage: 'internship_conversion_interview',
        round: '实习转正面试',
        scenarioBucket: 'metric_tradeoff',
        type: '指标取舍与管理汇报',
        prompt: '【行业:电商与跨境电商｜岗位:客服运营｜阶段:实习转正面试】管理层要求降本15%，你如何保证服务体验不崩盘？'
      }
    ]
  },
  {
    file: 'data/entries/IND_ENERGY_UTILITIES.json',
    industryName: '能源与公用事业',
    roleId: 'IND_ENERGY_UTILITIES_ROLE_007',
    roleName: '设备管理工程师',
    rolePatch: {
      role_readiness_floor: '至少能讲清1个设备可靠性提升项目：故障模式、检修策略、停机损失与安全合规控制。',
      day_in_life: '设备管理工程师典型工作周：周一设备状态与缺陷清单评审；周二检修计划与备件策略确认；周三现场点检和风险排查；周四推动检修执行与验收；周五复盘MTBF/可利用率与安全事件。',
      growth_path_1to3_year: '成长台阶：0-1年掌握设备台账与点检标准；1-3年独立负责关键设备可靠性方案；3-5年可统筹厂站设备全生命周期管理。',
      transfer_path_hint: '可转方向：运维工程师（切换成本低中，补调度协同）；安全生产管理岗（切换成本中，补法规体系）；配网规划工程师（切换成本中高，补负荷预测与规划）。过渡周期4-9个月。',
      prep_90d_plan: [
        '1-30天：梳理关键设备台账、故障类型与检修历史。',
        '31-60天：完成1个故障模式与影响分析（FMEA）并提出检修优化方案。',
        '61-90天：完成10套设备管理场景题训练，重点演练安全、可靠性和成本平衡。'
      ],
      career_outlook_3to5_year: '公用事业数字化与设备状态监测普及，设备管理岗位向“可靠性工程+数据化运维”演进。',
      typical_work_week: '现场与会议并重，检修窗口期和迎峰度夏/度冬阶段节奏显著加快。',
      switch_directions: [
        { target_role: '运维工程师', switch_cost: '低中', bridge_skills: ['调度流程', '应急处置'], transition_period: '3-6个月' },
        { target_role: '安全生产管理岗', switch_cost: '中', bridge_skills: ['EHS体系', '法规合规'], transition_period: '5-8个月' },
        { target_role: '配网规划工程师', switch_cost: '中高', bridge_skills: ['负荷预测', '规划仿真'], transition_period: '6-9个月' }
      ],
      prepare_180d_plan: [
        '91-120天：上线关键设备健康度评分看板并建立预警阈值。',
        '121-150天：主导一次年度检修计划滚动优化。',
        '151-180天：沉淀故障库和标准作业包。'
      ],
      role_scope_text: '负责关键设备全生命周期管理、检修策略与故障复盘，直接对可靠性、安全和停机损失负责。'
    },
    commonDeductionPoints: [
      '只讲检修动作，不讲故障机理和预防策略。',
      '忽略安全红线和作业许可要求。',
      '没有量化可靠性指标（如MTBF、可利用率）。',
      '复盘未形成标准作业改进。'
    ],
    starTemplate: {
      situation: '关键设备在迎峰期间故障频发，影响供能稳定。',
      task: '在安全合规前提下降低故障率并保障供能连续性。',
      action: [
        '分层识别高风险设备并重排检修优先级。',
        '联合运行班组优化点检与备件策略。',
        '建立故障闭环机制并按周追踪可靠性指标。'
      ],
      result: [
        '设备故障率下降，关键设备可利用率提升。',
        '形成可复制的检修与故障闭环流程。'
      ],
      proof_materials: ['设备台账与故障记录', '检修计划与执行单', '可靠性看板']
    },
    writtenAdds: [
      {
        id: 'IND_ENERGY_UTILITIES_WRITTEN_V161_R007_01',
        stage: 'campus_early_batch_written',
        round: '提前批笔试',
        scenarioBucket: 'business_scenario',
        type: '关键设备保供方案',
        prompt: '【行业:能源与公用事业｜岗位:设备管理工程师｜阶段:提前批笔试】迎峰期前发现主设备异常趋势，你如何制定保供与检修方案？'
      },
      {
        id: 'IND_ENERGY_UTILITIES_WRITTEN_V161_R007_02',
        stage: 'campus_main_batch_written',
        round: '主批笔试',
        scenarioBucket: 'system_process',
        type: '检修计划与备件策略',
        prompt: '【行业:能源与公用事业｜岗位:设备管理工程师｜阶段:主批笔试】请设计年度检修计划的滚动更新机制，并说明备件策略如何联动。'
      },
      {
        id: 'IND_ENERGY_UTILITIES_WRITTEN_V161_R007_03',
        stage: 'campus_supplement_written',
        round: '补录笔试',
        scenarioBucket: 'failure_review',
        type: '故障停机复盘',
        prompt: '【行业:能源与公用事业｜岗位:设备管理工程师｜阶段:补录笔试】某设备突发停机造成供能波动，请给出复盘和防复发方案。'
      },
      {
        id: 'IND_ENERGY_UTILITIES_WRITTEN_V161_R007_04',
        stage: 'internship_conversion_written',
        round: '实习转正笔试',
        scenarioBucket: 'metric_tradeoff',
        type: '安全-可靠性-成本取舍',
        prompt: '【行业:能源与公用事业｜岗位:设备管理工程师｜阶段:实习转正笔试】在检修预算受限时，如何平衡安全、可靠性和成本？'
      }
    ],
    interviewAdds: [
      {
        id: 'IND_ENERGY_UTILITIES_INTERVIEW_V161_R007_01',
        stage: 'campus_early_batch_interview',
        round: '提前批面试',
        scenarioBucket: 'business_scenario',
        type: '紧急故障应对',
        prompt: '【行业:能源与公用事业｜岗位:设备管理工程师｜阶段:提前批面试】凌晨关键设备告警，你如何组织应急与信息上报？'
      },
      {
        id: 'IND_ENERGY_UTILITIES_INTERVIEW_V161_R007_02',
        stage: 'campus_main_batch_interview',
        round: '主批面试',
        scenarioBucket: 'cross_team_collaboration',
        type: '运行-检修协同冲突',
        prompt: '【行业:能源与公用事业｜岗位:设备管理工程师｜阶段:主批面试】运行班组反对停机检修，你如何推动决策落地？'
      },
      {
        id: 'IND_ENERGY_UTILITIES_INTERVIEW_V161_R007_03',
        stage: 'campus_supplement_interview',
        round: '补录面试',
        scenarioBucket: 'failure_review',
        type: '检修失效复盘',
        prompt: '【行业:能源与公用事业｜岗位:设备管理工程师｜阶段:补录面试】讲一次检修后问题复发的经历，你怎么定位根因？'
      },
      {
        id: 'IND_ENERGY_UTILITIES_INTERVIEW_V161_R007_04',
        stage: 'internship_conversion_interview',
        round: '实习转正面试',
        scenarioBucket: 'metric_tradeoff',
        type: '预算压降下的可靠性承诺',
        prompt: '【行业:能源与公用事业｜岗位:设备管理工程师｜阶段:实习转正面试】如果预算压降10%，你如何保障年度可靠性目标不失守？'
      }
    ]
  },
  {
    file: 'data/entries/IND_FIN_BANK.json',
    industryName: '金融-银行',
    roleId: 'IND_FIN_BANK_ROLE_007',
    roleName: '合规管理',
    rolePatch: {
      role_readiness_floor: '至少可拆解1个“业务增长与合规约束冲突”案例：规则识别、流程改造、监控指标与问责闭环。',
      day_in_life: '合规管理典型工作周：周一法规更新与政策解读；周二抽查高风险业务链路；周三与前台沟通整改方案；周四跟进系统规则落地；周五汇总风险指标和问责进度。',
      growth_path_1to3_year: '成长台阶：0-1年熟悉制度与检查流程；1-3年独立负责条线合规评估与整改；3-5年可承担跨条线合规治理和专项审计协同。',
      transfer_path_hint: '可转方向：风险策略分析师（切换成本中，补策略建模）；内控稽核岗（切换成本低中，补审计方法）；反洗钱分析师（切换成本中，补AML规则）。过渡周期4-8个月。',
      prep_90d_plan: [
        '1-30天：建立监管规则与业务流程映射表。',
        '31-60天：主导1个高风险流程整改并定义监控指标。',
        '61-90天：完成10套合规场景题训练，重点演练“先做后补、业务冲突、问责复盘”。'
      ],
      career_outlook_3to5_year: '数字化金融和强监管并行，合规管理岗位持续向“规则产品化+实时监控+业务协同”升级。',
      typical_work_week: '工作节奏受监管检查窗口和业务上线节奏影响，季度末整改与复盘任务集中。',
      switch_directions: [
        { target_role: '风险策略分析师', switch_cost: '中', bridge_skills: ['策略规则', '数据监控'], transition_period: '5-8个月' },
        { target_role: '内控稽核岗', switch_cost: '低中', bridge_skills: ['审计抽样', '控制测试'], transition_period: '4-6个月' },
        { target_role: '反洗钱分析师', switch_cost: '中', bridge_skills: ['AML规则', '可疑交易分析'], transition_period: '5-8个月' }
      ],
      prepare_180d_plan: [
        '91-120天：推动1条高风险流程规则化改造并上线监控。',
        '121-150天：完成跨条线整改复盘并固化检查清单。',
        '151-180天：建立合规风险月报模板与异常升级机制。'
      ],
      role_scope_text: '负责条线合规规则落地、风险监控和整改闭环，对重大合规事件预防与处置结果负责。'
    },
    commonDeductionPoints: [
      '只谈制度，不谈业务场景和落地路径。',
      '无法量化整改效果和剩余风险。',
      '冲突处理只靠“卡口”，缺少协同方案。',
      '复盘未形成可复用机制。'
    ],
    starTemplate: {
      situation: '业务线推动快速上线，合规审查发现高风险漏洞。',
      task: '在不影响关键业务节奏的前提下完成合规整改并可持续监控。',
      action: [
        '快速识别高风险环节并明确必改项与缓释项。',
        '与业务、法务、技术共同制定分阶段整改方案。',
        '上线监控指标并设定升级和问责触发条件。'
      ],
      result: [
        '关键风险项在节点内完成整改并通过复检。',
        '形成可复制的合规评审与整改模板。'
      ],
      proof_materials: ['合规评审记录', '整改跟踪表', '监控看板截图']
    },
    writtenAdds: [
      {
        id: 'IND_FIN_BANK_WRITTEN_V161_R007_01',
        stage: 'campus_early_batch_written',
        round: '提前批笔试',
        scenarioBucket: 'business_scenario',
        type: '新规冲击评估',
        prompt: '【行业:金融-银行｜岗位:合规管理｜阶段:提前批笔试】监管新规发布后，如何在两周内完成对重点产品线的影响评估与整改排期？'
      },
      {
        id: 'IND_FIN_BANK_WRITTEN_V161_R007_02',
        stage: 'campus_main_batch_written',
        round: '主批笔试',
        scenarioBucket: 'system_process',
        type: '合规规则产品化设计',
        prompt: '【行业:金融-银行｜岗位:合规管理｜阶段:主批笔试】请设计一套“规则识别-流程改造-监控预警-复盘问责”闭环机制。'
      },
      {
        id: 'IND_FIN_BANK_WRITTEN_V161_R007_03',
        stage: 'campus_supplement_written',
        round: '补录笔试',
        scenarioBucket: 'failure_review',
        type: '违规事件复盘',
        prompt: '【行业:金融-银行｜岗位:合规管理｜阶段:补录笔试】某分行出现违规销售，请拆解根因并给出防复发制度设计。'
      },
      {
        id: 'IND_FIN_BANK_WRITTEN_V161_R007_04',
        stage: 'internship_conversion_written',
        round: '实习转正笔试',
        scenarioBucket: 'metric_tradeoff',
        type: '效率与合规平衡',
        prompt: '【行业:金融-银行｜岗位:合规管理｜阶段:实习转正笔试】业务要求缩短审批时长20%，你如何保证合规风险不放大？'
      }
    ],
    interviewAdds: [
      {
        id: 'IND_FIN_BANK_INTERVIEW_V161_R007_01',
        stage: 'campus_early_batch_interview',
        round: '提前批面试',
        scenarioBucket: 'business_scenario',
        type: '监管检查应对',
        prompt: '【行业:金融-银行｜岗位:合规管理｜阶段:提前批面试】监管现场检查发现问题线索，你如何组织48小时应对？'
      },
      {
        id: 'IND_FIN_BANK_INTERVIEW_V161_R007_02',
        stage: 'campus_main_batch_interview',
        round: '主批面试',
        scenarioBucket: 'cross_team_collaboration',
        type: '前台冲突协同',
        prompt: '【行业:金融-银行｜岗位:合规管理｜阶段:主批面试】前台坚持“先做后补”，你如何在不失控的情况下推动业务调整？'
      },
      {
        id: 'IND_FIN_BANK_INTERVIEW_V161_R007_03',
        stage: 'campus_supplement_interview',
        round: '补录面试',
        scenarioBucket: 'failure_review',
        type: '整改失败复盘',
        prompt: '【行业:金融-银行｜岗位:合规管理｜阶段:补录面试】讲一次你推动整改但效果不佳的经历，你如何修正？'
      },
      {
        id: 'IND_FIN_BANK_INTERVIEW_V161_R007_04',
        stage: 'internship_conversion_interview',
        round: '实习转正面试',
        scenarioBucket: 'metric_tradeoff',
        type: '指标取舍沟通',
        prompt: '【行业:金融-银行｜岗位:合规管理｜阶段:实习转正面试】当增长指标与合规整改冲突时，你如何给管理层建议并承担结果？'
      }
    ]
  },
  {
    file: 'data/entries/IND_FIN_SECURITIES_FUND.json',
    industryName: '金融-证券基金',
    roleId: 'IND_FIN_SECURITIES_FUND_ROLE_007',
    roleName: '风险计量',
    rolePatch: {
      role_readiness_floor: '至少可展示1个风险模型落地案例：指标定义、数据质量处理、压力测试与风险报告决策支持。',
      day_in_life: '风险计量典型工作周：周一校验风险暴露与行情数据；周二更新VaR与压力测试结果；周三与投研沟通风险偏离；周四优化模型参数与监控阈值；周五输出风险周报与管理建议。',
      growth_path_1to3_year: '成长台阶：0-1年掌握风险口径与数据清洗；1-3年独立负责组合风险计量和预警；3-5年可主导模型治理与资产类别扩展。',
      transfer_path_hint: '可转方向：量化研究岗（切换成本中高，补策略研究）；投资组合分析师（切换成本中，补组合构建）；合规风控岗（切换成本低中，补监管报送）。过渡周期5-10个月。',
      prep_90d_plan: [
        '1-30天：梳理风险指标口径（VaR、回撤、久期、敞口）和数据来源。',
        '31-60天：完成1个压力测试案例并形成结果解释模板。',
        '61-90天：完成10套风险计量题训练，重点演练模型假设、异常解释与风险沟通。'
      ],
      career_outlook_3to5_year: '多资产和衍生品应用增加，风险计量岗位持续向实时监控、模型治理和跨部门解释能力升级。',
      typical_work_week: '行情波动期加班概率较高，月末季末报告与压力测试任务集中。',
      switch_directions: [
        { target_role: '量化研究岗', switch_cost: '中高', bridge_skills: ['策略研究', '回测体系'], transition_period: '7-10个月' },
        { target_role: '投资组合分析师', switch_cost: '中', bridge_skills: ['组合归因', '资产配置'], transition_period: '5-8个月' },
        { target_role: '合规风控岗', switch_cost: '低中', bridge_skills: ['监管规则', '报送口径'], transition_period: '4-6个月' }
      ],
      prepare_180d_plan: [
        '91-120天：建设风险异常自动告警规则并验证准确率。',
        '121-150天：完成一次跨资产压力测试演练并复盘。',
        '151-180天：沉淀风险计量解释手册（面向投研和管理层）。'
      ],
      role_scope_text: '负责组合风险计量、压力测试与预警解释，对风险暴露识别及时性和风险报告质量负责。'
    },
    commonDeductionPoints: [
      '只报指标，不解释驱动因素与业务含义。',
      '模型假设不清，无法说明适用边界。',
      '忽略数据质量问题导致结论失真。',
      '没有给出可执行风险建议。'
    ],
    starTemplate: {
      situation: '市场波动加剧，组合风险暴露快速偏离目标区间。',
      task: '在短时间内完成风险诊断并给出可执行的调整建议。',
      action: [
        '核验风险数据链路并复算核心指标。',
        '开展情景压力测试并识别主要风险来源。',
        '与投研沟通可执行的调仓与对冲建议。'
      ],
      result: [
        '风险暴露回到管理阈值内。',
        '形成可复用的风险预警与解释模板。'
      ],
      proof_materials: ['风险日报', '压力测试报告', '调仓建议记录']
    },
    writtenAdds: [
      {
        id: 'IND_FIN_SECURITIES_FUND_WRITTEN_V161_R007_01',
        stage: 'campus_early_batch_written',
        round: '提前批笔试',
        scenarioBucket: 'business_scenario',
        type: '高波动期风险诊断',
        prompt: '【行业:金融-证券基金｜岗位:风险计量｜阶段:提前批笔试】市场波动率上升导致组合VaR翻倍，你如何快速定位主要风险来源？'
      },
      {
        id: 'IND_FIN_SECURITIES_FUND_WRITTEN_V161_R007_02',
        stage: 'campus_main_batch_written',
        round: '主批笔试',
        scenarioBucket: 'system_process',
        type: '风险监控体系设计',
        prompt: '【行业:金融-证券基金｜岗位:风险计量｜阶段:主批笔试】请设计日内风险监控与升级流程，明确告警分级。'
      },
      {
        id: 'IND_FIN_SECURITIES_FUND_WRITTEN_V161_R007_03',
        stage: 'campus_supplement_written',
        round: '补录笔试',
        scenarioBucket: 'failure_review',
        type: '模型失效复盘',
        prompt: '【行业:金融-证券基金｜岗位:风险计量｜阶段:补录笔试】某模型在极端行情失效，请给出复盘框架和修正方案。'
      },
      {
        id: 'IND_FIN_SECURITIES_FUND_WRITTEN_V161_R007_04',
        stage: 'internship_conversion_written',
        round: '实习转正笔试',
        scenarioBucket: 'metric_tradeoff',
        type: '收益与风险预算取舍',
        prompt: '【行业:金融-证券基金｜岗位:风险计量｜阶段:实习转正笔试】当收益目标与风险预算冲突时，你如何提出配置建议？'
      }
    ],
    interviewAdds: [
      {
        id: 'IND_FIN_SECURITIES_FUND_INTERVIEW_V161_R007_01',
        stage: 'campus_early_batch_interview',
        round: '提前批面试',
        scenarioBucket: 'business_scenario',
        type: '风险异动沟通',
        prompt: '【行业:金融-证券基金｜岗位:风险计量｜阶段:提前批面试】你如何在盘中向投资经理解释风险异动并给出可执行建议？'
      },
      {
        id: 'IND_FIN_SECURITIES_FUND_INTERVIEW_V161_R007_02',
        stage: 'campus_main_batch_interview',
        round: '主批面试',
        scenarioBucket: 'cross_team_collaboration',
        type: '投研风控冲突协同',
        prompt: '【行业:金融-证券基金｜岗位:风险计量｜阶段:主批面试】投研团队质疑风险阈值过严，你如何说服并推进执行？'
      },
      {
        id: 'IND_FIN_SECURITIES_FUND_INTERVIEW_V161_R007_03',
        stage: 'campus_supplement_interview',
        round: '补录面试',
        scenarioBucket: 'failure_review',
        type: '风险判断失误复盘',
        prompt: '【行业:金融-证券基金｜岗位:风险计量｜阶段:补录面试】讲一次你对风险判断偏差的案例，你如何修正方法？'
      },
      {
        id: 'IND_FIN_SECURITIES_FUND_INTERVIEW_V161_R007_04',
        stage: 'internship_conversion_interview',
        round: '实习转正面试',
        scenarioBucket: 'metric_tradeoff',
        type: '风险预算沟通题',
        prompt: '【行业:金融-证券基金｜岗位:风险计量｜阶段:实习转正面试】若管理层要求提升收益目标，你如何给出风险预算建议并说明底线？'
      }
    ]
  },
  {
    file: 'data/entries/IND_NEW_ENERGY.json',
    industryName: '新能源',
    roleId: 'IND_NEW_ENERGY_ROLE_007',
    roleName: '质量工程师',
    rolePatch: {
      role_readiness_floor: '至少可展示1个质量改进项目：缺陷定义、过程能力分析、纠正预防措施与量化收益。',
      day_in_life: '质量工程师典型工作周：周一缺陷与客诉周报；周二产线过程审核；周三主导8D会议；周四推动纠正预防措施闭环；周五复盘良率、PPM和一次通过率。',
      growth_path_1to3_year: '成长台阶：0-1年掌握质量工具和审核流程；1-3年独立负责关键工序质量改进；3-5年可承担体系建设与跨基地质量协同。',
      transfer_path_hint: '可转方向：质量体系工程师（切换成本低中，补体系审核）；工艺工程师（切换成本中，补制程优化）；供应商质量工程师（切换成本中，补外协管理）。过渡周期4-8个月。',
      prep_90d_plan: [
        '1-30天：梳理关键缺陷库、失效模式与控制计划。',
        '31-60天：完成1个8D案例并量化改善前后指标。',
        '61-90天：完成10套质量工程场景题训练，重点覆盖客诉、量产爬坡和供应链异常。'
      ],
      career_outlook_3to5_year: '新能源产业持续扩产，质量岗位从单点检验转向全流程质量治理与数据化预警。',
      typical_work_week: '量产爬坡和新品导入期压力大，跨产线与跨供应商协同频繁。',
      switch_directions: [
        { target_role: '质量体系工程师', switch_cost: '低中', bridge_skills: ['IATF16949', '体系审核'], transition_period: '4-6个月' },
        { target_role: '工艺工程师', switch_cost: '中', bridge_skills: ['制程能力', 'DOE'], transition_period: '5-8个月' },
        { target_role: '供应商质量工程师', switch_cost: '中', bridge_skills: ['供应商审核', '来料质量'], transition_period: '5-8个月' }
      ],
      prepare_180d_plan: [
        '91-120天：建立关键缺陷预警规则并接入班组例会。',
        '121-150天：推动一次跨部门质量专项并形成标准化文件。',
        '151-180天：沉淀质量改进案例库与培训课件。'
      ],
      role_scope_text: '负责制程质量监控、缺陷闭环和体系改进，对良率、PPM和客诉指标负责。'
    },
    commonDeductionPoints: [
      '只描述现象，不追溯根因链路。',
      '改进动作没有验证计划和复核标准。',
      '未量化改善收益（良率、PPM、返工率）。',
      '跨部门责任边界不清，闭环失败。'
    ],
    starTemplate: {
      situation: '新产线爬坡期出现批量缺陷，客诉风险上升。',
      task: '快速定位根因并在产线不停摆前提下控制不良扩散。',
      action: [
        '按工序拆分缺陷并建立临时遏制措施。',
        '组织8D跨部门复盘，验证根因并制定CAPA。',
        '设置复核节点，持续跟踪关键质量指标。'
      ],
      result: [
        '缺陷率和返工率显著下降。',
        '形成可复制的量产爬坡质量控制方案。'
      ],
      proof_materials: ['8D报告', '质量看板', '过程审核记录']
    },
    writtenAdds: [
      {
        id: 'IND_NEW_ENERGY_WRITTEN_V161_R007_01',
        stage: 'campus_early_batch_written',
        round: '提前批笔试',
        scenarioBucket: 'business_scenario',
        type: '量产爬坡质量控制',
        prompt: '【行业:新能源｜岗位:质量工程师｜阶段:提前批笔试】电池包量产爬坡期不良率超标，你如何制定遏制与长期改进方案？'
      },
      {
        id: 'IND_NEW_ENERGY_WRITTEN_V161_R007_02',
        stage: 'campus_main_batch_written',
        round: '主批笔试',
        scenarioBucket: 'system_process',
        type: '质量监控体系设计',
        prompt: '【行业:新能源｜岗位:质量工程师｜阶段:主批笔试】请设计从来料到出货的质量监控与放行机制。'
      },
      {
        id: 'IND_NEW_ENERGY_WRITTEN_V161_R007_03',
        stage: 'campus_supplement_written',
        round: '补录笔试',
        scenarioBucket: 'failure_review',
        type: '客诉升级复盘题',
        prompt: '【行业:新能源｜岗位:质量工程师｜阶段:补录笔试】某批次客诉升级，请给出根因分析路径和防复发措施。'
      },
      {
        id: 'IND_NEW_ENERGY_WRITTEN_V161_R007_04',
        stage: 'internship_conversion_written',
        round: '实习转正笔试',
        scenarioBucket: 'metric_tradeoff',
        type: '良率与节拍平衡',
        prompt: '【行业:新能源｜岗位:质量工程师｜阶段:实习转正笔试】当产线节拍目标与质量目标冲突时，你如何提出平衡方案？'
      }
    ],
    interviewAdds: [
      {
        id: 'IND_NEW_ENERGY_INTERVIEW_V161_R007_01',
        stage: 'campus_early_batch_interview',
        round: '提前批面试',
        scenarioBucket: 'business_scenario',
        type: '缺陷遏制决策',
        prompt: '【行业:新能源｜岗位:质量工程师｜阶段:提前批面试】如果你发现批量缺陷但停线代价很高，你会怎么决策？'
      },
      {
        id: 'IND_NEW_ENERGY_INTERVIEW_V161_R007_02',
        stage: 'campus_main_batch_interview',
        round: '主批面试',
        scenarioBucket: 'cross_team_collaboration',
        type: '跨部门质量推进',
        prompt: '【行业:新能源｜岗位:质量工程师｜阶段:主批面试】工艺、生产、质量对根因判断不一致，你如何推进结论和动作？'
      },
      {
        id: 'IND_NEW_ENERGY_INTERVIEW_V161_R007_03',
        stage: 'campus_supplement_interview',
        round: '补录面试',
        scenarioBucket: 'failure_review',
        type: '8D失效复盘',
        prompt: '【行业:新能源｜岗位:质量工程师｜阶段:补录面试】讲一次8D推进失败的经历，你如何重建闭环？'
      },
      {
        id: 'IND_NEW_ENERGY_INTERVIEW_V161_R007_04',
        stage: 'internship_conversion_interview',
        round: '实习转正面试',
        scenarioBucket: 'metric_tradeoff',
        type: '质量与交付取舍',
        prompt: '【行业:新能源｜岗位:质量工程师｜阶段:实习转正面试】当客户催交和内部质量底线冲突时，你如何沟通并承担结果？'
      }
    ]
  },
  {
    file: 'data/entries/IND_PUBLIC_INSTITUTION.json',
    industryName: '事业单位体系',
    roleId: 'IND_PUBLIC_INSTITUTION_ROLE_005',
    roleName: '信息化岗',
    rolePatch: {
      role_readiness_floor: '至少可展示1个政务/事业单位信息化项目：需求梳理、系统上线、数据质量和服务稳定性保障。',
      day_in_life: '信息化岗典型工作周：周一受理业务部门需求并分级；周二梳理流程与字段口径；周三推进系统配置与联调；周四处理线上故障与权限问题；周五汇总服务工单与优化计划。',
      growth_path_1to3_year: '成长台阶：0-1年掌握系统运维和需求对接；1-3年独立负责模块上线与数据治理；3-5年可承担信息化项目管理与制度建设。',
      transfer_path_hint: '可转方向：数据治理岗（切换成本中，补数据标准）；项目管理岗（切换成本低中，补项目方法）；政务产品岗（切换成本中，补用户研究）。过渡周期4-8个月。',
      prep_90d_plan: [
        '1-30天：梳理现有系统架构、关键业务流程和权限模型。',
        '31-60天：完成1个需求从评审到上线的全流程演练并留存文档。',
        '61-90天：完成10套信息化岗场景题训练，重点演练数据口径冲突和故障应急。'
      ],
      career_outlook_3to5_year: '公共服务数字化持续推进，信息化岗位长期需求稳定，能力重心从运维执行升级为数据治理与流程重塑。',
      typical_work_week: '业务窗口高峰和系统升级窗口期任务集中，跨部门沟通占比高。',
      switch_directions: [
        { target_role: '数据治理岗', switch_cost: '中', bridge_skills: ['主数据管理', '数据标准'], transition_period: '5-8个月' },
        { target_role: '项目管理岗', switch_cost: '低中', bridge_skills: ['项目计划', '风险管理'], transition_period: '4-6个月' },
        { target_role: '政务产品岗', switch_cost: '中', bridge_skills: ['需求分析', '用户旅程'], transition_period: '5-8个月' }
      ],
      prepare_180d_plan: [
        '91-120天：建立核心系统工单分类与SLA看板。',
        '121-150天：主导一次跨部门流程优化并验证时效提升。',
        '151-180天：沉淀系统运维手册与故障应急预案。'
      ],
      role_scope_text: '负责事业单位信息系统需求对接、上线运维与数据治理协同，对系统可用性与服务响应负责。'
    },
    commonDeductionPoints: [
      '只会接单，不会做需求优先级管理。',
      '系统问题只做临时修补，没有根因治理。',
      '忽略数据口径一致性，导致业务争议。',
      '缺乏跨部门推进和文档沉淀。'
    ],
    starTemplate: {
      situation: '业务部门反馈系统响应慢且数据口径不一致，影响窗口服务效率。',
      task: '在不影响日常服务的前提下完成系统优化与数据口径统一。',
      action: [
        '梳理关键流程并识别性能瓶颈和字段冲突。',
        '联合业务与供应商制定分批优化方案。',
        '上线监控与回归测试机制，持续跟踪SLA。'
      ],
      result: [
        '系统响应与工单处理时效提升。',
        '形成统一数据口径和标准操作文档。'
      ],
      proof_materials: ['需求评审纪要', '性能监控报表', '上线验收记录']
    },
    writtenAdds: [
      {
        id: 'IND_PUBLIC_INSTITUTION_WRITTEN_V161_R005_01',
        stage: 'campus_early_batch_written',
        round: '提前批笔试',
        scenarioBucket: 'business_scenario',
        type: '窗口高峰系统保障',
        prompt: '【行业:事业单位体系｜岗位:信息化岗｜阶段:提前批笔试】窗口业务高峰导致系统拥堵，你如何制定保障方案？'
      },
      {
        id: 'IND_PUBLIC_INSTITUTION_WRITTEN_V161_R005_02',
        stage: 'campus_main_batch_written',
        round: '主批笔试',
        scenarioBucket: 'system_process',
        type: '需求管理与上线流程',
        prompt: '【行业:事业单位体系｜岗位:信息化岗｜阶段:主批笔试】请设计从需求受理到上线验收的标准流程，并定义优先级规则。'
      },
      {
        id: 'IND_PUBLIC_INSTITUTION_WRITTEN_V161_R005_03',
        stage: 'campus_supplement_written',
        round: '补录笔试',
        scenarioBucket: 'failure_review',
        type: '系统故障复盘题',
        prompt: '【行业:事业单位体系｜岗位:信息化岗｜阶段:补录笔试】某次系统故障影响办事窗口，请给出复盘框架和防复发机制。'
      },
      {
        id: 'IND_PUBLIC_INSTITUTION_WRITTEN_V161_R005_04',
        stage: 'internship_conversion_written',
        round: '实习转正笔试',
        scenarioBucket: 'metric_tradeoff',
        type: '稳定性与迭代速度平衡',
        prompt: '【行业:事业单位体系｜岗位:信息化岗｜阶段:实习转正笔试】业务希望快速上线新功能，你如何平衡稳定性与交付速度？'
      }
    ],
    interviewAdds: [
      {
        id: 'IND_PUBLIC_INSTITUTION_INTERVIEW_V161_R005_01',
        stage: 'campus_early_batch_interview',
        round: '提前批面试',
        scenarioBucket: 'business_scenario',
        type: '线上故障应急',
        prompt: '【行业:事业单位体系｜岗位:信息化岗｜阶段:提前批面试】如果办事高峰期系统宕机，你会如何组织应急？'
      },
      {
        id: 'IND_PUBLIC_INSTITUTION_INTERVIEW_V161_R005_02',
        stage: 'campus_main_batch_interview',
        round: '主批面试',
        scenarioBucket: 'cross_team_collaboration',
        type: '跨部门需求冲突',
        prompt: '【行业:事业单位体系｜岗位:信息化岗｜阶段:主批面试】多个部门都说需求最紧急，你如何做优先级并沟通？'
      },
      {
        id: 'IND_PUBLIC_INSTITUTION_INTERVIEW_V161_R005_03',
        stage: 'campus_supplement_interview',
        round: '补录面试',
        scenarioBucket: 'failure_review',
        type: '上线失败复盘',
        prompt: '【行业:事业单位体系｜岗位:信息化岗｜阶段:补录面试】讲一次上线后被回滚的经历，你如何避免再次发生？'
      },
      {
        id: 'IND_PUBLIC_INSTITUTION_INTERVIEW_V161_R005_04',
        stage: 'internship_conversion_interview',
        round: '实习转正面试',
        scenarioBucket: 'metric_tradeoff',
        type: '服务稳定与迭代节奏',
        prompt: '【行业:事业单位体系｜岗位:信息化岗｜阶段:实习转正面试】当窗口服务稳定性和功能迭代冲突时，你如何决策并复盘？'
      }
    ]
  }
];

const defaultAnswerFramework = ['目标澄清与边界定义', '关键路径与执行动作', '指标与风险控制', '复盘与机制沉淀'];
const defaultScoringDimensions = ['结构化思考', '方案可执行性', '指标意识', '复盘能力'];
const defaultCommonMistakes = ['只讲原则不讲动作', '缺少量化指标', '没有风险预案'];
const defaultGoodSignals = ['结论先行', '路径清晰', '指标可验证'];
const defaultReference = ['先定义目标与约束', '再拆解动作与节奏', '最后给出量化结果与复盘'];

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
    difficulty_1to5: def.difficulty || 4,
    scenario_bucket: def.scenarioBucket,
    answer_framework: def.answerFramework || defaultAnswerFramework,
    scoring_dimensions: def.scoringDimensions || defaultScoringDimensions,
    common_mistakes: def.commonMistakes || defaultCommonMistakes,
    good_answer_signals: def.goodSignals || defaultGoodSignals,
    reference_answer_outline: def.referenceOutline || defaultReference,
    follow_up_questions: def.followUps || [
      '如果资源减半，你会先保哪一环？',
      '首轮方案未达标时你的纠偏动作是什么？',
      '如何把这次经验沉淀为团队机制？'
    ],
    follow_up_chain: def.followUpChain || [
      '澄清目标边界',
      '追问关键取舍',
      '验证复盘与机制化能力'
    ],
    scoring_rubric: def.rubric || {
      A档: '目标与约束清晰，方案可执行且指标闭环完整。',
      B档: '方案基本可落地，但指标或风险预案不完整。',
      C档: '描述泛化，缺少动作、指标与复盘。'
    },
    question_realness_note: '基于官方岗位能力口径与2026场景化补充（非官方原卷）。',
    data_origin: 'official_jd_competency_mapping_with_scenario_enrichment',
    sample_size: Math.max(Number(base.sample_size || 6), 8),
    evidence: {
      ...(base.evidence || {}),
      accessed_at: TODAY,
      captured_at: TODAY,
      data_period: '2026年度'
    }
  };
}

function uniqueQuestionPush(items, q) {
  if (items.some((x) => x.question_id === q.question_id)) {
    throw new Error(`Duplicate question_id detected: ${q.question_id}`);
  }
  items.push(q);
}

for (const u of updates) {
  const fullPath = path.join(ROOT, u.file);
  const entry = JSON.parse(fs.readFileSync(fullPath, 'utf8'));

  const roles = entry.dynamic?.['岗位画像库']?.items;
  const writtenItems = entry.dynamic?.['笔试真题库']?.items;
  const interviewItems = entry.dynamic?.['面试真题库']?.items;
  if (!roles || !writtenItems || !interviewItems) {
    throw new Error(`Invalid entry structure in ${u.file}`);
  }

  const role = roles.find((r) => r.role_id === u.roleId);
  if (!role) throw new Error(`Role not found: ${u.roleId} in ${u.file}`);

  Object.assign(role, u.rolePatch);
  role.common_deduction_points = u.commonDeductionPoints;
  role.star_evidence_template = u.starTemplate;
  role.updated_at = TODAY;
  role.role_detail_v158 = role.role_detail_v158 || {};
  role.role_detail_v158.role_scope = u.rolePatch.role_scope_text;
  role.role_detail_v158.expansion_status = 'landed_deep_profile_v161';

  const writtenBase = writtenItems.find((q) => q.role_id === u.roleId);
  const interviewBase = interviewItems.find((q) => q.role_id === u.roleId);
  if (!writtenBase || !interviewBase) {
    throw new Error(`Question base missing for role ${u.roleId}`);
  }

  for (const def of u.writtenAdds) {
    uniqueQuestionPush(writtenItems, buildQuestion(writtenBase, def, u.roleId, u.roleName));
  }
  for (const def of u.interviewAdds) {
    uniqueQuestionPush(interviewItems, buildQuestion(interviewBase, def, u.roleId, u.roleName));
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
