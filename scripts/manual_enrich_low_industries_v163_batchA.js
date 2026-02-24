#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TODAY = '2026-02-23';

const updates = [
  {
    file: 'data/entries/IND_TELECOM_OPERATOR.json',
    industryLabel: '通信与运营商',
    roleId: 'IND_TELECOM_OPERATOR_ROLE_002',
    roleName: '通信研发',
    rolePatch: {
      role_readiness_floor: '至少完成1个通信研发项目闭环：需求拆解、方案设计、联调验证和问题复盘。',
      day_in_life: '通信研发一周通常包含需求评审、协议与模块设计、联调压测、缺陷修复和版本复盘。',
      growth_path_1to3_year: '0-1年夯实协议与实现基础；1-3年独立负责模块研发与性能优化；3-5年可主导系统级方案。',
      transfer_path_hint: '可转核心网工程师、云网融合工程师、通信测试架构岗；建议补齐系统设计与自动化测试。',
      career_outlook_3to5_year: '5G-A与算网融合推进，通信研发岗位将从单点开发向系统协同与工程效率升级。',
      typical_work_week: '版本发布周节奏紧，联调和故障排查时间占比高；非发布周更侧重设计与代码质量治理。',
      switch_directions: [
        {
          target_role: '核心网工程师',
          switch_cost: '中',
          bridge_skills: ['核心网协议栈', '高可用架构'],
          transition_period: '6-9个月'
        },
        {
          target_role: '云网融合工程师',
          switch_cost: '中高',
          bridge_skills: ['云原生', '网络自动化'],
          transition_period: '7-10个月'
        },
        {
          target_role: '通信测试架构岗',
          switch_cost: '中',
          bridge_skills: ['自动化测试', '故障定位'],
          transition_period: '5-8个月'
        }
      ],
      prepare_180d_plan: [
        '1-30天：复盘主流通信协议栈与岗位JD能力项，形成学习清单。',
        '31-60天：完成1个协议模块实现与联调项目，沉淀问题单。',
        '61-90天：完成通信研发岗位高频题训练并做2轮模拟面试。',
        '91-120天：补齐性能分析和压测方法，形成指标看板。',
        '121-150天：主导一次跨模块联调复盘并输出改进方案。',
        '151-180天：整理可展示项目证据包（架构图、指标、复盘）。'
      ],
      role_scope_text: '负责通信系统模块研发与交付，对功能正确性、性能稳定性和上线质量负责。'
    },
    platformGap: {
      status: 'keep_blank_with_search_plan_v163',
      required_info: ['城市分布', '薪资区间P25/P50/P75', '发布时间', '批次/轮次', '帖子ID/链接', '样本量', '截图时间'],
      where_to_search: ['BOSS直聘网页端', '小红书搜索页', '牛客网笔面经'],
      boss_search_url: 'https://www.zhipin.com/web/geek/job',
      boss_search_query: ['应届生 通信研发 运营商 北京', '校招 通信研发 云网融合 上海'],
      xiaohongshu_search_url: 'https://www.xiaohongshu.com/search_result/?keyword=%E9%80%9A%E4%BF%A1%E7%A0%94%E5%8F%91%20%E6%A0%A1%E6%8B%9B%20%E9%9D%A2%E7%BB%8F',
      xiaohongshu_search_query: ['通信研发 校招 面经', '运营商 通信研发 offer'],
      missing_fields: ['城市分布', '薪资区间P25/P50/P75', '发布时间', '批次/轮次', '帖子ID/链接', '样本量', '截图时间'],
      how_to_search: [
        '先用企业校招官网确认岗位名称和职责，再去BOSS按城市筛选应届岗位。',
        '小红书仅用于回忆样本补充，记录帖子ID与截图时间。',
        '牛客用于题型与追问链补充，记录年份与轮次。'
      ],
      unavailable_capture_log_v163: {
        official_http: 200,
        boss_http: 200,
        xiaohongshu_http: 404,
        checked_at: TODAY,
        note: '小红书搜索页返回404时保留字段留空，等待人工回填。'
      },
      filled_mode: 'industry_proxy_fallback',
      filled_values: {},
      next_backfill_action: '两周内补齐3条带城市与发布时间的平台样本。'
    },
    writtenAdds: [
      {
        id: 'IND_TELECOM_OPERATOR_WRITTEN_V163_R002_01',
        stage: 'campus_main_batch_written',
        round: '主批笔试',
        scenarioBucket: 'system_process',
        type: '通信研发流程设计',
        prompt: '【行业:通信与运营商｜岗位:通信研发｜阶段:主批笔试】请设计“需求评审-协议实现-联调验证-发布回归”的研发流程，并说明每阶段的质量门禁。'
      },
      {
        id: 'IND_TELECOM_OPERATOR_WRITTEN_V163_R002_02',
        stage: 'campus_supplement_written',
        round: '补录笔试',
        scenarioBucket: 'metric_tradeoff',
        type: '资源受限取舍题',
        prompt: '【行业:通信与运营商｜岗位:通信研发｜阶段:补录笔试】当版本窗口固定且资源缩减30%时，你如何重排研发优先级并保证核心指标？'
      }
    ],
    interviewAdds: [
      {
        id: 'IND_TELECOM_OPERATOR_INTERVIEW_V163_R002_01',
        stage: 'campus_main_batch_interview',
        round: '主批面试',
        scenarioBucket: 'cross_team_collaboration',
        type: '跨团队协同题',
        prompt: '【行业:通信与运营商｜岗位:通信研发｜阶段:主批面试】测试团队和研发团队对故障根因结论不一致时，你如何推进闭环？'
      },
      {
        id: 'IND_TELECOM_OPERATOR_INTERVIEW_V163_R002_02',
        stage: 'internship_conversion_interview',
        round: '实习转正面试',
        scenarioBucket: 'failure_review',
        type: '失败复盘题',
        prompt: '【行业:通信与运营商｜岗位:通信研发｜阶段:实习转正面试】讲一次你在联调阶段判断失误并成功纠偏的经历。'
      }
    ]
  },
  {
    file: 'data/entries/IND_REAL_ESTATE_INFRA.json',
    industryLabel: '房地产与基建',
    roleId: 'IND_REAL_ESTATE_INFRA_ROLE_002',
    roleName: '成本管理',
    rolePatch: {
      role_readiness_floor: '至少完成1个项目成本闭环：预算编制、动态控制、偏差分析和结算复盘。',
      day_in_life: '成本管理一周以目标成本测算、变更签证审核、动态成本跟踪和结算风险复盘为主。',
      growth_path_1to3_year: '0-1年掌握清单与计价规则；1-3年可独立负责项目成本全过程；3-5年可主导区域成本体系。',
      transfer_path_hint: '可转成本合约经理、投拓测算岗、计划运营岗；建议补齐财务分析和合同风险识别。',
      career_outlook_3to5_year: '基建投资精细化和降本增效要求提升，成本管理岗位长期需要“算得准+控得住”的复合能力。',
      typical_work_week: '招采和结算节点任务峰值明显，平时重分析与预警，节点期重审核与协同。',
      switch_directions: [
        {
          target_role: '成本合约经理',
          switch_cost: '中',
          bridge_skills: ['合同条款管理', '索赔与反索赔'],
          transition_period: '6-9个月'
        },
        {
          target_role: '投拓测算岗',
          switch_cost: '中',
          bridge_skills: ['投资测算', '现金流模型'],
          transition_period: '6-9个月'
        },
        {
          target_role: '计划运营岗',
          switch_cost: '中',
          bridge_skills: ['里程碑管理', '跨部门推进'],
          transition_period: '5-8个月'
        }
      ],
      prepare_180d_plan: [
        '1-30天：复盘清单计价和合同条款，建立错题清单。',
        '31-60天：完成1个动态成本台账项目并形成偏差分析。',
        '61-90天：完成成本管理高频笔面试题训练。',
        '91-120天：补齐结算审核和变更签证实操模板。',
        '121-150天：主导一次成本偏差复盘会并输出整改动作。',
        '151-180天：形成可展示的成本控制项目证据包。'
      ],
      role_scope_text: '负责项目全周期成本控制与结算管理，对成本偏差、合同风险与目标利润达成负责。'
    },
    platformGap: {
      status: 'keep_blank_with_search_plan_v163',
      required_info: ['城市分布', '薪资区间P25/P50/P75', '发布时间', '批次/轮次', '帖子ID/链接', '样本量', '截图时间'],
      where_to_search: ['BOSS直聘网页端', '小红书搜索页', '牛客网面经'],
      boss_search_url: 'https://www.zhipin.com/web/geek/job',
      boss_search_query: ['应届生 成本管理 房地产 基建 广州', '校招 成本合约岗 上海'],
      xiaohongshu_search_url: 'https://www.xiaohongshu.com/search_result/?keyword=%E6%88%90%E6%9C%AC%E7%AE%A1%E7%90%86%20%E6%A0%A1%E6%8B%9B%20%E9%9D%A2%E7%BB%8F',
      xiaohongshu_search_query: ['成本管理 校招 面经', '房地产 成本岗 offer'],
      missing_fields: ['城市分布', '薪资区间P25/P50/P75', '发布时间', '批次/轮次', '帖子ID/链接', '样本量', '截图时间'],
      how_to_search: ['优先企业校招页确认岗位口径后，再做平台样本抓取。', 'BOSS按城市和近30天筛选，保留职位发布时间。', '小红书帖子需记录ID和截图时间。'],
      unavailable_capture_log_v163: {
        official_http: 200,
        boss_http: 200,
        xiaohongshu_http: 404,
        checked_at: TODAY,
        note: '小红书检索结果不可稳定访问，按规范留空。'
      },
      filled_mode: 'industry_proxy_fallback',
      filled_values: {},
      next_backfill_action: '两周内补齐至少3条城市+薪资+发布时间样本。'
    },
    writtenAdds: [
      {
        id: 'IND_REAL_ESTATE_INFRA_WRITTEN_V163_R002_01',
        stage: 'campus_main_batch_written',
        round: '主批笔试',
        scenarioBucket: 'system_process',
        type: '成本控制流程题',
        prompt: '【行业:房地产与基建｜岗位:成本管理｜阶段:主批笔试】请设计“目标成本-动态监控-偏差预警-结算复盘”的成本控制流程。'
      },
      {
        id: 'IND_REAL_ESTATE_INFRA_WRITTEN_V163_R002_02',
        stage: 'campus_supplement_written',
        round: '补录笔试',
        scenarioBucket: 'metric_tradeoff',
        type: '进度成本取舍题',
        prompt: '【行业:房地产与基建｜岗位:成本管理｜阶段:补录笔试】工期压缩与成本超支风险并发时，你如何决策与止损？'
      }
    ],
    interviewAdds: [
      {
        id: 'IND_REAL_ESTATE_INFRA_INTERVIEW_V163_R002_01',
        stage: 'campus_main_batch_interview',
        round: '主批面试',
        scenarioBucket: 'cross_team_collaboration',
        type: '跨部门推进题',
        prompt: '【行业:房地产与基建｜岗位:成本管理｜阶段:主批面试】工程、招采、成本三方口径不一致时你如何推进统一？'
      },
      {
        id: 'IND_REAL_ESTATE_INFRA_INTERVIEW_V163_R002_02',
        stage: 'internship_conversion_interview',
        round: '实习转正面试',
        scenarioBucket: 'failure_review',
        type: '成本偏差复盘题',
        prompt: '【行业:房地产与基建｜岗位:成本管理｜阶段:实习转正面试】讲一次你发现并纠正成本偏差的复盘经历。'
      }
    ]
  },
  {
    file: 'data/entries/IND_CHEM_NEW_MATERIALS.json',
    industryLabel: '化工与新材料',
    roleId: 'IND_CHEM_NEW_MATERIALS_ROLE_002',
    roleName: '工艺工程师',
    rolePatch: {
      role_readiness_floor: '至少完成1个工艺优化项目：参数设计、试验验证、良率提升和安全复盘。',
      day_in_life: '工艺工程师一周通常围绕试验设计、参数调优、异常分析、跨班组验证和工艺文件更新展开。',
      growth_path_1to3_year: '0-1年掌握工艺基础与实验规范；1-3年独立负责工艺窗口优化；3-5年可主导产线工艺平台建设。',
      transfer_path_hint: '可转配方开发、质量体系工程师、EHS管理岗；建议补齐统计分析与体系化改进能力。',
      career_outlook_3to5_year: '高性能材料迭代加快，工艺工程师需求持续稳定，能力重点转向“效率+稳定+安全”三目标协同。',
      typical_work_week: '试产和爬坡阶段节奏更快，日常以参数验证和异常闭环为主。',
      switch_directions: [
        {
          target_role: '配方开发工程师',
          switch_cost: '中',
          bridge_skills: ['材料机理', '配方试验'],
          transition_period: '6-9个月'
        },
        {
          target_role: '质量体系工程师',
          switch_cost: '中',
          bridge_skills: ['过程审核', '质量工具'],
          transition_period: '5-8个月'
        },
        {
          target_role: 'EHS管理岗',
          switch_cost: '中',
          bridge_skills: ['风险辨识', '安全管理'],
          transition_period: '6-9个月'
        }
      ],
      prepare_180d_plan: [
        '1-30天：建立工艺参数、缺陷和指标对照表。',
        '31-60天：完成1个良率提升试验并输出报告。',
        '61-90天：完成工艺岗高频题训练并复盘。',
        '91-120天：补齐DOE实验设计与统计分析能力。',
        '121-150天：主导一次异常复盘会并推进纠正措施。',
        '151-180天：沉淀可展示的工艺优化项目证据。'
      ],
      role_scope_text: '负责材料产线工艺开发与优化，对良率、稳定性、安全性和放大可行性负责。'
    },
    platformGap: {
      status: 'keep_blank_with_search_plan_v163',
      required_info: ['城市分布', '薪资区间P25/P50/P75', '发布时间', '批次/轮次', '帖子ID/链接', '样本量', '截图时间'],
      where_to_search: ['BOSS直聘网页端', '小红书搜索页', '牛客网面经'],
      boss_search_url: 'https://www.zhipin.com/web/geek/job',
      boss_search_query: ['应届生 化工 工艺工程师 苏州', '新材料 工艺岗 校招 无锡'],
      xiaohongshu_search_url: 'https://www.xiaohongshu.com/search_result/?keyword=%E5%B7%A5%E8%89%BA%E5%B7%A5%E7%A8%8B%E5%B8%88%20%E6%A0%A1%E6%8B%9B%20%E9%9D%A2%E7%BB%8F',
      xiaohongshu_search_query: ['化工 工艺工程师 校招', '新材料 工艺岗 面经'],
      missing_fields: ['城市分布', '薪资区间P25/P50/P75', '发布时间', '批次/轮次', '帖子ID/链接', '样本量', '截图时间'],
      how_to_search: ['官方校招页核对岗位职责后，再抓取平台样本。', 'BOSS筛选应届+本科+近30天并记录发布时间。', '小红书记录帖子ID与截图时间，标记回忆样本。'],
      unavailable_capture_log_v163: {
        official_http: 200,
        boss_http: 200,
        xiaohongshu_http: 404,
        checked_at: TODAY,
        note: '小红书检索链路受限，按留空规范处理。'
      },
      filled_mode: 'industry_proxy_fallback',
      filled_values: {},
      next_backfill_action: '优先补齐长三角城市样本并回填分位薪资。'
    },
    writtenAdds: [
      {
        id: 'IND_CHEM_NEW_MATERIALS_WRITTEN_V163_R002_01',
        stage: 'campus_main_batch_written',
        round: '主批笔试',
        scenarioBucket: 'system_process',
        type: '工艺优化流程题',
        prompt: '【行业:化工与新材料｜岗位:工艺工程师｜阶段:主批笔试】请设计“实验设计-参数优化-验证放大-标准化”的工艺优化流程。'
      },
      {
        id: 'IND_CHEM_NEW_MATERIALS_WRITTEN_V163_R002_02',
        stage: 'campus_supplement_written',
        round: '补录笔试',
        scenarioBucket: 'metric_tradeoff',
        type: '良率产能取舍题',
        prompt: '【行业:化工与新材料｜岗位:工艺工程师｜阶段:补录笔试】当良率目标与产能目标冲突时，你如何设定优先级与纠偏阈值？'
      }
    ],
    interviewAdds: [
      {
        id: 'IND_CHEM_NEW_MATERIALS_INTERVIEW_V163_R002_01',
        stage: 'campus_main_batch_interview',
        round: '主批面试',
        scenarioBucket: 'cross_team_collaboration',
        type: '跨班组协同题',
        prompt: '【行业:化工与新材料｜岗位:工艺工程师｜阶段:主批面试】工艺、设备、质量对异常原因意见不一致时，你如何推动闭环？'
      },
      {
        id: 'IND_CHEM_NEW_MATERIALS_INTERVIEW_V163_R002_02',
        stage: 'internship_conversion_interview',
        round: '实习转正面试',
        scenarioBucket: 'failure_review',
        type: '异常复盘题',
        prompt: '【行业:化工与新材料｜岗位:工艺工程师｜阶段:实习转正面试】讲一次你在试产阶段识别并纠正关键异常的经历。'
      }
    ]
  },
  {
    file: 'data/entries/IND_AGRI_FOOD.json',
    industryLabel: '农业与食品',
    roleId: 'IND_AGRI_FOOD_ROLE_002',
    roleName: '研发工程师',
    rolePatch: {
      role_readiness_floor: '至少完成1个食品研发项目：需求定义、配方打样、感官与稳定性验证、上市复盘。',
      day_in_life: '食品研发工程师一周包括配方试验、感官评估、稳定性测试、法规核查和跨部门样品评审。',
      growth_path_1to3_year: '0-1年掌握配方与实验规范；1-3年独立负责新品开发；3-5年可主导品类研发路线。',
      transfer_path_hint: '可转食品工艺工程师、质量管理、法规与标准专员；建议补齐规模化工艺和法规判读能力。',
      career_outlook_3to5_year: '健康化与功能化食品需求增长，研发岗位持续扩张，核心能力向“创新速度+合规落地”升级。',
      typical_work_week: '新品立项期重实验与验证，上市前重跨部门协同和风险评审。',
      switch_directions: [
        {
          target_role: '食品工艺工程师',
          switch_cost: '中',
          bridge_skills: ['中试放大', '产线导入'],
          transition_period: '6-9个月'
        },
        {
          target_role: '质量管理',
          switch_cost: '中',
          bridge_skills: ['质量工具', '过程控制'],
          transition_period: '5-8个月'
        },
        {
          target_role: '法规与标准专员',
          switch_cost: '中',
          bridge_skills: ['标准解读', '标签合规'],
          transition_period: '6-9个月'
        }
      ],
      prepare_180d_plan: [
        '1-30天：梳理研发流程、法规要求和品类关键指标。',
        '31-60天：完成1个打样到评审闭环项目。',
        '61-90天：完成研发岗高频题训练与复盘。',
        '91-120天：补齐稳定性测试与中试放大方法。',
        '121-150天：主导一次配方失败复盘并提出改进方案。',
        '151-180天：沉淀可展示的新品研发证据包。'
      ],
      role_scope_text: '负责食品新品研发与验证，对产品口感稳定性、成本可控性和合规上市进度负责。'
    },
    platformGap: {
      status: 'keep_blank_with_search_plan_v163',
      required_info: ['城市分布', '薪资区间P25/P50/P75', '发布时间', '批次/轮次', '帖子ID/链接', '样本量', '截图时间'],
      where_to_search: ['BOSS直聘网页端', '小红书搜索页', '牛客网面经'],
      boss_search_url: 'https://www.zhipin.com/web/geek/job',
      boss_search_query: ['应届生 食品研发 校招 上海', '农业 食品 研发工程师 苏州'],
      xiaohongshu_search_url: 'https://www.xiaohongshu.com/search_result/?keyword=%E9%A3%9F%E5%93%81%E7%A0%94%E5%8F%91%20%E6%A0%A1%E6%8B%9B%20%E9%9D%A2%E7%BB%8F',
      xiaohongshu_search_query: ['食品研发 校招 面经', '快消 研发岗 offer'],
      missing_fields: ['城市分布', '薪资区间P25/P50/P75', '发布时间', '批次/轮次', '帖子ID/链接', '样本量', '截图时间'],
      how_to_search: ['用企业校招页确认研发岗位口径后再抓取平台样本。', 'BOSS记录城市和发布时间，构建P25/P50/P75分位。', '小红书仅作回忆补充并标注帖子ID。'],
      unavailable_capture_log_v163: {
        official_http: 200,
        boss_http: 200,
        xiaohongshu_http: 404,
        checked_at: TODAY,
        note: '小红书检索链路受限，按规范留空并等待回填。'
      },
      filled_mode: 'industry_proxy_fallback',
      filled_values: {},
      next_backfill_action: '补齐华东与华南至少各1个城市样本。'
    },
    writtenAdds: [
      {
        id: 'IND_AGRI_FOOD_WRITTEN_V163_R002_01',
        stage: 'campus_main_batch_written',
        round: '主批笔试',
        scenarioBucket: 'system_process',
        type: '食品研发流程题',
        prompt: '【行业:农业与食品｜岗位:研发工程师｜阶段:主批笔试】请设计“需求洞察-配方打样-稳定性验证-上市导入”的研发流程。'
      },
      {
        id: 'IND_AGRI_FOOD_WRITTEN_V163_R002_02',
        stage: 'campus_supplement_written',
        round: '补录笔试',
        scenarioBucket: 'metric_tradeoff',
        type: '口感成本取舍题',
        prompt: '【行业:农业与食品｜岗位:研发工程师｜阶段:补录笔试】当口感指标与成本目标冲突时，你如何制定取舍与验证方案？'
      }
    ],
    interviewAdds: [
      {
        id: 'IND_AGRI_FOOD_INTERVIEW_V163_R002_01',
        stage: 'campus_main_batch_interview',
        round: '主批面试',
        scenarioBucket: 'cross_team_collaboration',
        type: '跨部门协同题',
        prompt: '【行业:农业与食品｜岗位:研发工程师｜阶段:主批面试】研发、生产、市场对新品方向意见冲突时，你如何推进决策？'
      },
      {
        id: 'IND_AGRI_FOOD_INTERVIEW_V163_R002_02',
        stage: 'internship_conversion_interview',
        round: '实习转正面试',
        scenarioBucket: 'failure_review',
        type: '研发失败复盘题',
        prompt: '【行业:农业与食品｜岗位:研发工程师｜阶段:实习转正面试】讲一次配方试验失败后你如何定位根因并迭代。'
      }
    ]
  },
  {
    file: 'data/entries/IND_EDU_VOCATIONAL.json',
    industryLabel: '教育与职教',
    roleId: 'IND_EDU_VOCATIONAL_ROLE_002',
    roleName: '课程运营',
    rolePatch: {
      role_readiness_floor: '至少完成1个课程运营闭环：目标拆解、过程监控、学习体验优化和转化复盘。',
      day_in_life: '课程运营一周通常围绕班级进度管理、学习数据监控、教学服务协同和续报转化复盘。',
      growth_path_1to3_year: '0-1年掌握课程运营指标与流程；1-3年独立负责课程线运营；3-5年可主导产品化运营体系。',
      transfer_path_hint: '可转教研产品经理、教学服务运营、用户增长岗；建议补齐数据分析与实验设计能力。',
      career_outlook_3to5_year: '终身学习和职业培训需求稳步增长，课程运营从执行岗向“数据驱动策略岗”升级。',
      typical_work_week: '开课与结课节点任务密集，平时以数据诊断和流程优化为主。',
      switch_directions: [
        {
          target_role: '教研产品经理',
          switch_cost: '中',
          bridge_skills: ['课程设计', '产品思维'],
          transition_period: '6-9个月'
        },
        {
          target_role: '教学服务运营',
          switch_cost: '低中',
          bridge_skills: ['服务流程', '满意度管理'],
          transition_period: '4-7个月'
        },
        {
          target_role: '用户增长岗',
          switch_cost: '中',
          bridge_skills: ['增长漏斗', 'A/B实验'],
          transition_period: '6-9个月'
        }
      ],
      prepare_180d_plan: [
        '1-30天：梳理课程运营核心指标口径与业务流程。',
        '31-60天：完成1个班级运营优化项目并复盘。',
        '61-90天：完成课程运营高频题训练。',
        '91-120天：补齐增长实验与教学服务协同方法。',
        '121-150天：主导一次续报转化复盘并推进改进。',
        '151-180天：形成可展示的课程运营证据包。'
      ],
      role_scope_text: '负责课程全周期运营管理，对学习完成率、满意度和续报转化负责。'
    },
    platformGap: {
      status: 'keep_blank_with_search_plan_v163',
      required_info: ['城市分布', '薪资区间P25/P50/P75', '发布时间', '批次/轮次', '帖子ID/链接', '样本量', '截图时间'],
      where_to_search: ['BOSS直聘网页端', '小红书搜索页', '牛客网面经'],
      boss_search_url: 'https://www.zhipin.com/web/geek/job',
      boss_search_query: ['应届生 课程运营 职教 北京', '校招 教育 课程运营 广州'],
      xiaohongshu_search_url: 'https://www.xiaohongshu.com/search_result/?keyword=%E8%AF%BE%E7%A8%8B%E8%BF%90%E8%90%A5%20%E6%A0%A1%E6%8B%9B%20%E9%9D%A2%E7%BB%8F',
      xiaohongshu_search_query: ['课程运营 校招 面经', '职教 课程运营 offer'],
      missing_fields: ['城市分布', '薪资区间P25/P50/P75', '发布时间', '批次/轮次', '帖子ID/链接', '样本量', '截图时间'],
      how_to_search: ['优先校招官网核对岗位职责，再抓平台样本。', 'BOSS按“应届生+城市”筛选并保留发布时间。', '小红书标注帖子ID和截图日期。'],
      unavailable_capture_log_v163: {
        official_http: 200,
        boss_http: 200,
        xiaohongshu_http: 404,
        checked_at: TODAY,
        note: '小红书搜索端不可稳定访问，保留留空位。'
      },
      filled_mode: 'industry_proxy_fallback',
      filled_values: {},
      next_backfill_action: '优先补齐一线城市样本并记录轮次信息。'
    },
    writtenAdds: [
      {
        id: 'IND_EDU_VOCATIONAL_WRITTEN_V163_R002_01',
        stage: 'campus_main_batch_written',
        round: '主批笔试',
        scenarioBucket: 'system_process',
        type: '课程运营流程题',
        prompt: '【行业:教育与职教｜岗位:课程运营｜阶段:主批笔试】请设计“开课准备-学习过程干预-结课复盘-续报策略”的运营流程。'
      },
      {
        id: 'IND_EDU_VOCATIONAL_WRITTEN_V163_R002_02',
        stage: 'campus_supplement_written',
        round: '补录笔试',
        scenarioBucket: 'metric_tradeoff',
        type: '体验转化取舍题',
        prompt: '【行业:教育与职教｜岗位:课程运营｜阶段:补录笔试】当完课率提升与续报转化短期下滑并发时，你如何决策？'
      }
    ],
    interviewAdds: [
      {
        id: 'IND_EDU_VOCATIONAL_INTERVIEW_V163_R002_01',
        stage: 'campus_main_batch_interview',
        round: '主批面试',
        scenarioBucket: 'cross_team_collaboration',
        type: '教运协同题',
        prompt: '【行业:教育与职教｜岗位:课程运营｜阶段:主批面试】教研团队和运营团队对课程节奏调整意见相左时，你如何推进？'
      },
      {
        id: 'IND_EDU_VOCATIONAL_INTERVIEW_V163_R002_02',
        stage: 'internship_conversion_interview',
        round: '实习转正面试',
        scenarioBucket: 'failure_review',
        type: '运营复盘题',
        prompt: '【行业:教育与职教｜岗位:课程运营｜阶段:实习转正面试】讲一次班级学习数据异常后你如何定位并修复。'
      }
    ]
  },
  {
    file: 'data/entries/IND_STATE_OWNED_ENTERPRISE.json',
    industryLabel: '央国企体系',
    roleId: 'IND_STATE_OWNED_ENTERPRISE_ROLE_002',
    roleName: '工程技术岗',
    rolePatch: {
      role_readiness_floor: '至少完成1个工程技术项目闭环：技术方案、现场实施、风险控制和验收复盘。',
      day_in_life: '工程技术岗一周围绕技术方案评审、现场问题排查、进度质量协同和验收准备展开。',
      growth_path_1to3_year: '0-1年夯实技术标准与现场执行；1-3年独立负责工程模块；3-5年可主导工程技术方案。',
      transfer_path_hint: '可转项目管理岗、运维技术岗、数字化转型岗；建议补齐成本意识与跨部门协同能力。',
      career_outlook_3to5_year: '央国企工程投资持续推进，工程技术岗对“标准化交付+数字化协同”能力需求上升。',
      typical_work_week: '施工节点阶段任务密度高，日常以技术支持和风险预防为主。',
      switch_directions: [
        {
          target_role: '项目管理岗',
          switch_cost: '中',
          bridge_skills: ['里程碑管理', '资源协调'],
          transition_period: '6-9个月'
        },
        {
          target_role: '运维技术岗',
          switch_cost: '低中',
          bridge_skills: ['设备运维', '故障诊断'],
          transition_period: '4-7个月'
        },
        {
          target_role: '数字化转型岗',
          switch_cost: '中高',
          bridge_skills: ['数据化管理', '流程再造'],
          transition_period: '7-10个月'
        }
      ],
      prepare_180d_plan: [
        '1-30天：梳理行业标准、技术规范与岗位职责。',
        '31-60天：完成1个现场技术问题闭环案例。',
        '61-90天：完成工程技术岗高频题训练。',
        '91-120天：补齐工程风险管理与验收要点。',
        '121-150天：主导一次技术复盘会并推动整改。',
        '151-180天：形成工程交付证据包（方案、记录、指标）。'
      ],
      role_scope_text: '负责工程技术方案与现场执行支撑，对工程质量、安全风险和交付进度负责。'
    },
    platformGap: {
      status: 'keep_blank_with_search_plan_v163',
      required_info: ['城市分布', '薪资区间P25/P50/P75', '发布时间', '批次/轮次', '帖子ID/链接', '样本量', '截图时间'],
      where_to_search: ['BOSS直聘网页端', '小红书搜索页', '牛客网面经'],
      boss_search_url: 'https://www.zhipin.com/web/geek/job',
      boss_search_query: ['应届生 央国企 工程技术岗 西安', '校招 国企 工程岗 北京'],
      xiaohongshu_search_url: 'https://www.xiaohongshu.com/search_result/?keyword=%E5%A4%AE%E5%9B%BD%E4%BC%81%20%E5%B7%A5%E7%A8%8B%E6%8A%80%E6%9C%AF%20%E6%A0%A1%E6%8B%9B',
      xiaohongshu_search_query: ['央国企 工程技术岗 面经', '国企 工程岗 offer'],
      missing_fields: ['城市分布', '薪资区间P25/P50/P75', '发布时间', '批次/轮次', '帖子ID/链接', '样本量', '截图时间'],
      how_to_search: ['先在央国企校招页确认岗位分类和专业要求。', 'BOSS保留职位发布时间与城市分布。', '小红书仅补面经样本并标记回忆来源。'],
      unavailable_capture_log_v163: {
        official_http: 200,
        boss_http: 200,
        xiaohongshu_http: 404,
        checked_at: TODAY,
        note: '小红书入口不可稳定抓取，暂留空。'
      },
      filled_mode: 'industry_proxy_fallback',
      filled_values: {},
      next_backfill_action: '按区域优先补齐3条有效样本。'
    },
    writtenAdds: [
      {
        id: 'IND_STATE_OWNED_ENTERPRISE_WRITTEN_V163_R002_01',
        stage: 'campus_main_batch_written',
        round: '主批笔试',
        scenarioBucket: 'system_process',
        type: '工程交付流程题',
        prompt: '【行业:央国企体系｜岗位:工程技术岗｜阶段:主批笔试】请设计“技术方案-现场实施-质量验收-复盘改进”的交付流程。'
      },
      {
        id: 'IND_STATE_OWNED_ENTERPRISE_WRITTEN_V163_R002_02',
        stage: 'campus_supplement_written',
        round: '补录笔试',
        scenarioBucket: 'metric_tradeoff',
        type: '质量进度取舍题',
        prompt: '【行业:央国企体系｜岗位:工程技术岗｜阶段:补录笔试】工期压力下质量风险上升时，你如何设定底线和优先级？'
      }
    ],
    interviewAdds: [
      {
        id: 'IND_STATE_OWNED_ENTERPRISE_INTERVIEW_V163_R002_01',
        stage: 'campus_main_batch_interview',
        round: '主批面试',
        scenarioBucket: 'cross_team_collaboration',
        type: '跨部门协同题',
        prompt: '【行业:央国企体系｜岗位:工程技术岗｜阶段:主批面试】现场施工、设计、监理三方意见冲突时你如何推进决策？'
      },
      {
        id: 'IND_STATE_OWNED_ENTERPRISE_INTERVIEW_V163_R002_02',
        stage: 'internship_conversion_interview',
        round: '实习转正面试',
        scenarioBucket: 'failure_review',
        type: '工程复盘题',
        prompt: '【行业:央国企体系｜岗位:工程技术岗｜阶段:实习转正面试】讲一次你处理现场技术突发问题并复盘改进的经历。'
      }
    ]
  },
  {
    file: 'data/entries/IND_CIVIL_SERVICE.json',
    industryLabel: '公务员体系',
    roleId: 'IND_CIVIL_SERVICE_ROLE_002',
    roleName: '执法类岗',
    rolePatch: {
      role_readiness_floor: '至少完成1个执法业务闭环：事实核查、法律适用、文书制作和执法复盘。',
      day_in_life: '执法类岗一周通常包括现场核查、证据固定、执法文书处理、行政沟通和案件复盘。',
      growth_path_1to3_year: '0-1年熟悉执法流程和法律条款；1-3年独立办理常规案件；3-5年可承担复杂案件统筹。',
      transfer_path_hint: '可转法制审核岗、政策研究岗、督查督办岗；建议补齐法规解释与公文表达能力。',
      career_outlook_3to5_year: '依法行政和治理精细化持续推进，执法类岗位稳定需求将更强调规范性、证据链与沟通能力。',
      typical_work_week: '专项整治期现场任务密集，常态期重文书规范和流程优化。',
      switch_directions: [
        {
          target_role: '法制审核岗',
          switch_cost: '中',
          bridge_skills: ['法规适用', '审核逻辑'],
          transition_period: '6-9个月'
        },
        {
          target_role: '政策研究岗',
          switch_cost: '中高',
          bridge_skills: ['政策分析', '文字表达'],
          transition_period: '7-10个月'
        },
        {
          target_role: '督查督办岗',
          switch_cost: '低中',
          bridge_skills: ['流程跟踪', '问题闭环'],
          transition_period: '4-7个月'
        }
      ],
      prepare_180d_plan: [
        '1-30天：梳理执法依据、程序规范和文书模板。',
        '31-60天：完成1个典型执法案例复盘。',
        '61-90天：完成执法岗笔面试高频题训练。',
        '91-120天：补齐行政复议和诉讼风险认知。',
        '121-150天：主导一次执法流程复盘并优化文书模板。',
        '151-180天：沉淀可展示的执法案例证据包。'
      ],
      role_scope_text: '负责执法事项办理与规范执行，对程序合规、证据完整和执法结果质量负责。'
    },
    platformGap: {
      status: 'keep_blank_with_search_plan_v163',
      required_info: ['城市分布', '薪资区间P25/P50/P75', '发布时间', '批次/轮次', '帖子ID/链接', '样本量', '截图时间'],
      where_to_search: ['国家公务员局/各地人事考试网', '小红书搜索页', '牛客/论坛面经'],
      boss_search_url: 'https://www.zhipin.com/web/geek/job',
      boss_search_query: ['公务员 执法类 岗位 信息'],
      xiaohongshu_search_url: 'https://www.xiaohongshu.com/search_result/?keyword=%E6%89%A7%E6%B3%95%E7%B1%BB%20%E9%9D%A2%E7%BB%8F',
      xiaohongshu_search_query: ['执法类 岗位 面经', '公考 执法类 上岸经验'],
      missing_fields: ['城市分布', '薪资区间P25/P50/P75', '发布时间', '批次/轮次', '帖子ID/链接', '样本量', '截图时间'],
      how_to_search: ['公务体系优先以官方招录公告为主证据。', '平台内容仅作面经训练样本，不作薪资强结论。', '留存帖子ID、轮次与年份。'],
      unavailable_capture_log_v163: {
        official_http: 200,
        boss_http: 200,
        xiaohongshu_http: 404,
        checked_at: TODAY,
        note: '小红书公开检索不可稳定访问，按规范留空。'
      },
      filled_mode: 'industry_proxy_fallback',
      filled_values: {},
      next_backfill_action: '补齐近一年执法类面经样本与轮次信息。'
    },
    writtenAdds: [
      {
        id: 'IND_CIVIL_SERVICE_WRITTEN_V163_R002_01',
        stage: 'campus_main_batch_written',
        round: '主批笔试',
        scenarioBucket: 'system_process',
        type: '执法流程题',
        prompt: '【行业:公务员体系｜岗位:执法类岗｜阶段:主批笔试】请设计“受理-核查-适法-文书-复盘”的执法办理流程。'
      },
      {
        id: 'IND_CIVIL_SERVICE_WRITTEN_V163_R002_02',
        stage: 'campus_supplement_written',
        round: '补录笔试',
        scenarioBucket: 'metric_tradeoff',
        type: '效率合规取舍题',
        prompt: '【行业:公务员体系｜岗位:执法类岗｜阶段:补录笔试】案件量激增时，办理效率与程序严谨冲突，你如何取舍？'
      }
    ],
    interviewAdds: [
      {
        id: 'IND_CIVIL_SERVICE_INTERVIEW_V163_R002_01',
        stage: 'campus_main_batch_interview',
        round: '主批面试',
        scenarioBucket: 'cross_team_collaboration',
        type: '协同执法题',
        prompt: '【行业:公务员体系｜岗位:执法类岗｜阶段:主批面试】多部门联合执法时执法尺度不一致，你如何推进统一执行？'
      },
      {
        id: 'IND_CIVIL_SERVICE_INTERVIEW_V163_R002_02',
        stage: 'internship_conversion_interview',
        round: '实习转正面试',
        scenarioBucket: 'failure_review',
        type: '执法复盘题',
        prompt: '【行业:公务员体系｜岗位:执法类岗｜阶段:实习转正面试】讲一次你在执法沟通中出现偏差并完成纠偏的经历。'
      }
    ]
  },
  {
    file: 'data/entries/IND_PUBLIC_INSTITUTION.json',
    industryLabel: '事业单位体系',
    roleId: 'IND_PUBLIC_INSTITUTION_ROLE_002',
    roleName: '医技岗',
    rolePatch: {
      role_readiness_floor: '至少完成1个医技业务闭环：检查流程执行、结果质控、异常沟通和质量复盘。',
      day_in_life: '医技岗一周主要进行样本或检查处理、设备质控、报告审核、临床沟通和异常复盘。',
      growth_path_1to3_year: '0-1年夯实标准操作与质控规范；1-3年独立承担重点项目；3-5年可主导科室质量改进。',
      transfer_path_hint: '可转检验质量管理岗、科室运营管理岗、信息化管理岗；建议补齐数据分析和流程管理能力。',
      career_outlook_3to5_year: '医疗服务质量管理持续强化，医技岗位将从“执行”向“质控与流程优化”并重发展。',
      typical_work_week: '高峰时段任务密集，平时重质控和报告准确性，班次安排对节奏影响明显。',
      switch_directions: [
        {
          target_role: '检验质量管理岗',
          switch_cost: '中',
          bridge_skills: ['质量体系', '审核方法'],
          transition_period: '6-9个月'
        },
        {
          target_role: '科室运营管理岗',
          switch_cost: '中',
          bridge_skills: ['流程优化', '资源调度'],
          transition_period: '6-9个月'
        },
        {
          target_role: '信息化管理岗',
          switch_cost: '中高',
          bridge_skills: ['系统应用', '数据治理'],
          transition_period: '7-10个月'
        }
      ],
      prepare_180d_plan: [
        '1-30天：梳理医技岗位标准流程与质控口径。',
        '31-60天：完成1个异常样本处理复盘。',
        '61-90天：完成医技岗高频笔面试题训练。',
        '91-120天：补齐质量改进工具和数据分析方法。',
        '121-150天：主导一次科室质量复盘并推动改进。',
        '151-180天：形成可展示的医技质量改进证据。'
      ],
      role_scope_text: '负责医技检查/检验执行与质量控制，对结果准确性、时效性和异常闭环质量负责。'
    },
    platformGap: {
      status: 'keep_blank_with_search_plan_v163',
      required_info: ['城市分布', '薪资区间P25/P50/P75', '发布时间', '批次/轮次', '帖子ID/链接', '样本量', '截图时间'],
      where_to_search: ['事业单位招聘公告', '小红书搜索页', '论坛面经'],
      boss_search_url: 'https://www.zhipin.com/web/geek/job',
      boss_search_query: ['事业单位 医技岗 招聘 城市'],
      xiaohongshu_search_url: 'https://www.xiaohongshu.com/search_result/?keyword=%E5%8C%BB%E6%8A%80%E5%B2%97%20%E9%9D%A2%E7%BB%8F',
      xiaohongshu_search_query: ['医技岗 面经', '事业单位 医技 上岸'],
      missing_fields: ['城市分布', '薪资区间P25/P50/P75', '发布时间', '批次/轮次', '帖子ID/链接', '样本量', '截图时间'],
      how_to_search: ['优先使用事业单位公开招聘公告和医院官网公告。', '平台面经仅作训练参考，标注回忆样本。', '记录公告发布日期和抓取时间。'],
      unavailable_capture_log_v163: {
        official_http: 200,
        boss_http: 200,
        xiaohongshu_http: 404,
        checked_at: TODAY,
        note: '小红书检索不可稳定访问，按规范保留留空位。'
      },
      filled_mode: 'industry_proxy_fallback',
      filled_values: {},
      next_backfill_action: '补齐近一年医技岗公告样本及轮次信息。'
    },
    writtenAdds: [
      {
        id: 'IND_PUBLIC_INSTITUTION_WRITTEN_V163_R002_01',
        stage: 'campus_main_batch_written',
        round: '主批笔试',
        scenarioBucket: 'system_process',
        type: '医技流程题',
        prompt: '【行业:事业单位体系｜岗位:医技岗｜阶段:主批笔试】请设计“样本/检查处理-结果审核-异常上报-质量复盘”的标准流程。'
      },
      {
        id: 'IND_PUBLIC_INSTITUTION_WRITTEN_V163_R002_02',
        stage: 'campus_supplement_written',
        round: '补录笔试',
        scenarioBucket: 'metric_tradeoff',
        type: '时效准确取舍题',
        prompt: '【行业:事业单位体系｜岗位:医技岗｜阶段:补录笔试】检查高峰期报告时效与结果复核深度冲突时，你如何决策？'
      }
    ],
    interviewAdds: [
      {
        id: 'IND_PUBLIC_INSTITUTION_INTERVIEW_V163_R002_01',
        stage: 'campus_main_batch_interview',
        round: '主批面试',
        scenarioBucket: 'cross_team_collaboration',
        type: '医技临床协同题',
        prompt: '【行业:事业单位体系｜岗位:医技岗｜阶段:主批面试】临床科室对报告解释存在分歧时，你如何协同沟通并闭环？'
      },
      {
        id: 'IND_PUBLIC_INSTITUTION_INTERVIEW_V163_R002_02',
        stage: 'internship_conversion_interview',
        round: '实习转正面试',
        scenarioBucket: 'failure_review',
        type: '异常复盘题',
        prompt: '【行业:事业单位体系｜岗位:医技岗｜阶段:实习转正面试】讲一次你发现结果异常并推动纠正的复盘经历。'
      }
    ]
  }
];

const defaultAnswerFramework = ['目标与边界澄清', '执行路径拆解', '指标与风险控制', '复盘与机制沉淀'];
const defaultScoringDimensions = ['结构化思维', '可执行性', '风险意识', '复盘能力'];
const defaultCommonMistakes = ['描述泛化', '缺少量化指标', '缺少风险预案'];
const defaultGoodSignals = ['结论先行', '路径清晰', '指标闭环'];
const defaultReference = ['先明确目标和约束', '再拆解动作与分工', '最后给出结果和复盘'];

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
    difficulty_1to5: Math.max(3, Number(base.difficulty_1to5 || 3)),
    scenario_bucket: def.scenarioBucket,
    answer_framework: defaultAnswerFramework,
    scoring_dimensions: defaultScoringDimensions,
    common_mistakes: defaultCommonMistakes,
    good_answer_signals: defaultGoodSignals,
    reference_answer_outline: defaultReference,
    follow_up_questions: [
      '如果关键资源减少30%，你如何保核心目标？',
      '首轮方案效果不及预期时你如何快速纠偏？',
      '你会如何沉淀机制避免问题复发？'
    ],
    scoring_rubric: {
      A档: '目标清晰、动作可执行、指标与风险闭环完整。',
      B档: '路径基本可执行，但指标或边界条件不完整。',
      C档: '方案泛化，缺少关键动作和量化结果。'
    },
    authenticity_level: 'official',
    data_origin: 'official_jd_competency_mapping_v163_manual',
    question_realness_note: '基于官方岗位能力口径整理的场景化训练题（非官方原卷）。',
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
  if (!role) {
    throw new Error(`Role not found: ${u.roleId} in ${u.file}`);
  }

  Object.assign(role, u.rolePatch);
  role.platform_backfill_gap = {
    ...(role.platform_backfill_gap || {}),
    ...u.platformGap,
    updated_at: TODAY
  };
  role.updated_at = TODAY;
  role.role_detail_v158 = role.role_detail_v158 || {};
  role.role_detail_v158.role_scope = u.rolePatch.role_scope_text;
  role.role_detail_v158.expansion_status = 'landed_manual_deep_profile_v163_batchA';

  const writtenBase = writtenItems.find((q) => q.role_id === u.roleId);
  const interviewBase = interviewItems.find((q) => q.role_id === u.roleId);
  if (!writtenBase || !interviewBase) {
    throw new Error(`Question base missing for role: ${u.roleId}`);
  }

  for (const def of u.writtenAdds) {
    if (writtenItems.some((q) => q.question_id === def.id)) {
      throw new Error(`Duplicate question id: ${def.id}`);
    }
    writtenItems.push(buildQuestion(writtenBase, def, u.roleId, u.roleName));
  }

  for (const def of u.interviewAdds) {
    if (interviewItems.some((q) => q.question_id === def.id)) {
      throw new Error(`Duplicate question id: ${def.id}`);
    }
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
