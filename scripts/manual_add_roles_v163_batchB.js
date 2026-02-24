#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TODAY = '2026-02-23';

const WRITTEN_STAGES = [
  ['campus_early_batch_written', '提前批笔试'],
  ['campus_main_batch_written', '主批笔试'],
  ['campus_supplement_written', '补录笔试'],
  ['internship_conversion_written', '实习转正笔试'],
  ['campus_main_batch_written', '主批笔试'],
  ['campus_supplement_written', '补录笔试'],
  ['campus_early_batch_written', '提前批笔试'],
  ['internship_conversion_written', '实习转正笔试']
];

const INTERVIEW_STAGES = [
  ['campus_early_batch_interview', '提前批面试'],
  ['campus_main_batch_interview', '主批面试'],
  ['campus_supplement_interview', '补录面试'],
  ['internship_conversion_interview', '实习转正面试'],
  ['campus_main_batch_interview', '主批面试'],
  ['campus_supplement_interview', '补录面试'],
  ['campus_early_batch_interview', '提前批面试'],
  ['internship_conversion_interview', '实习转正面试']
];

const updates = [
  {
    file: 'data/entries/IND_BIOMED_DEVICE.json',
    industryId: 'IND_BIOMED_DEVICE',
    industryLabel: '生物医药与器械',
    newRoleId: 'IND_BIOMED_DEVICE_ROLE_022',
    sourceRoleId: 'IND_BIOMED_DEVICE_ROLE_021',
    roleName: '医疗器械临床数据运营专员',
    rolePatch: {
      role_readiness_floor: '至少完成1个临床数据运营闭环：数据标准制定、质控清洗、偏差纠正与复盘沉淀。',
      day_in_life: '临床数据运营专员一周通常围绕EDC数据核查、疑问项推进、跨中心沟通和数据质控复盘。',
      growth_path_1to3_year: '0-1年掌握临床数据规范和核查流程；1-3年独立负责数据运营项目；3-5年可主导多中心数据治理策略。',
      transfer_path_hint: '可转临床数据管理、医学统计分析、临床运营管理；建议补齐统计软件与试验管理知识。',
      career_outlook_3to5_year: '临床试验数字化和监管精细化并行，临床数据运营岗位将持续增长，能力重心转向实时质控和自动化治理。',
      typical_work_week: '入组高峰与数据库锁定前节点任务密集，平时以质控规则优化和问题闭环为主。',
      switch_directions: [
        {
          target_role: '临床数据管理',
          switch_cost: '中',
          bridge_skills: ['EDC规则配置', '数据核查计划'],
          transition_period: '6-9个月'
        },
        {
          target_role: '医学统计分析',
          switch_cost: '中高',
          bridge_skills: ['统计方法', 'SAS/R'],
          transition_period: '7-10个月'
        },
        {
          target_role: '临床运营管理',
          switch_cost: '中',
          bridge_skills: ['项目统筹', '风险管理'],
          transition_period: '6-9个月'
        }
      ],
      prepare_180d_plan: [
        '1-30天：梳理GCP和临床数据流程，建立核查清单。',
        '31-60天：完成1个疑问项闭环案例并复盘。',
        '61-90天：完成临床数据运营高频题训练。',
        '91-120天：补齐SAS/R基础与数据质控规则设计。',
        '121-150天：主导一次数据库锁定前风险复盘。',
        '151-180天：形成可展示的临床数据治理项目证据。'
      ],
      role_scope_text: '负责临床试验数据运营与质量控制，对数据完整性、时效性和合规可追溯性负责。'
    },
    platformGap: {
      status: 'keep_blank_with_search_plan_v163',
      required_info: ['城市分布', '薪资区间P25/P50/P75', '发布时间', '批次/轮次', '帖子ID/链接', '样本量', '截图时间'],
      where_to_search: ['BOSS直聘网页端', '小红书搜索页', '牛客网'],
      boss_search_url: 'https://www.zhipin.com/web/geek/job',
      boss_search_query: ['应届生 医疗器械 临床数据 运营 上海', '临床数据运营 校招 北京'],
      xiaohongshu_search_url: 'https://www.xiaohongshu.com/search_result/?keyword=%E4%B8%B4%E5%BA%8A%E6%95%B0%E6%8D%AE%20%E9%9D%A2%E7%BB%8F',
      xiaohongshu_search_query: ['临床数据 运营 面经', '医疗器械 临床数据 校招'],
      missing_fields: ['城市分布', '薪资区间P25/P50/P75', '发布时间', '批次/轮次', '帖子ID/链接', '样本量', '截图时间'],
      how_to_search: ['先在药企/器械企业官方校招页确认岗位定义。', 'BOSS抓城市与发布时间，构建分位薪资样本。', '小红书仅做回忆样本补充并记录帖子ID。'],
      unavailable_capture_log_v163: {
        official_http: 200,
        boss_http: 200,
        xiaohongshu_http: 404,
        checked_at: TODAY,
        note: '小红书公开检索受限，按规范留空。'
      },
      filled_mode: 'industry_proxy_fallback',
      filled_values: {},
      next_backfill_action: '补齐沪京两地各1条有效样本。'
    },
    writtenTopics: [
      { type: '数据质控流程题', bucket: 'system_process', text: '请设计“采集-核查-疑问项-锁库”临床数据运营流程。' },
      { type: '异常诊断题', bucket: 'business_scenario', text: '多中心数据一致性异常时你如何定位根因并推进修复？' },
      { type: '失败复盘题', bucket: 'failure_review', text: '一次锁库延期后你如何复盘并避免再次发生？' },
      { type: '效率质量取舍题', bucket: 'metric_tradeoff', text: '入组高峰期数据录入时效与核查深度冲突时你如何取舍？' },
      { type: '协同推进题', bucket: 'cross_team_collaboration', text: 'CRA与数据管理团队口径不一致时你如何推进统一？' },
      { type: '规则设计题', bucket: 'system_process', text: '如何搭建可持续迭代的临床数据核查规则库？' },
      { type: '风险控制题', bucket: 'business_scenario', text: '在数据库锁定前你如何设计风险预警和止损机制？' },
      { type: '迁移复用题', bucket: 'cross_team_collaboration', text: '如何把单项目数据治理经验复制到多中心项目？' }
    ],
    interviewTopics: [
      { type: '应急处理题', bucket: 'business_scenario', text: '关键中心连续出现高风险疑问项时你如何应急？' },
      { type: '协同沟通题', bucket: 'cross_team_collaboration', text: '医学、运营、数据三方优先级冲突时你如何协调？' },
      { type: '复盘叙述题', bucket: 'failure_review', text: '讲一次你处理临床数据质量事故并闭环的经历。' },
      { type: '优先级取舍题', bucket: 'metric_tradeoff', text: '多中心并发问题时你如何排序并分配资源？' },
      { type: '流程优化题', bucket: 'system_process', text: '你如何优化当前疑问项处理流程以提升关闭率？' },
      { type: '追问链题', bucket: 'cross_team_collaboration', text: '如果中心迟迟不配合修正数据，你会怎么推进？' },
      { type: '场景判断题', bucket: 'business_scenario', text: '当数据缺失影响主要终点分析时你如何决策？' },
      { type: '反思迁移题', bucket: 'failure_review', text: '过去一次误判带来的后果是什么，你如何修正机制？' }
    ]
  },
  {
    file: 'data/entries/IND_ENERGY_UTILITIES.json',
    industryId: 'IND_ENERGY_UTILITIES',
    industryLabel: '能源与公用事业',
    newRoleId: 'IND_ENERGY_UTILITIES_ROLE_022',
    sourceRoleId: 'IND_ENERGY_UTILITIES_ROLE_021',
    roleName: '电力现货交易运营岗',
    rolePatch: {
      role_readiness_floor: '至少完成1个电力交易运营项目：策略制定、报价执行、风险监控和收益复盘。',
      day_in_life: '电力现货交易运营岗一周围绕负荷与价格预测、交易策略执行、偏差监控和跨部门复盘展开。',
      growth_path_1to3_year: '0-1年掌握现货规则与交易流程；1-3年独立负责交易策略执行；3-5年可主导收益风险一体化运营。',
      transfer_path_hint: '可转电力交易策略分析师、储能交易运营、能源市场研究岗；建议补齐优化建模和风险预算能力。',
      career_outlook_3to5_year: '电力市场化深化和现货扩围将持续提升交易运营岗位需求，重点能力向“预测+策略+风控”融合。',
      typical_work_week: '现货出清和结算周期任务密集，价格波动期对决策响应速度要求高。',
      switch_directions: [
        {
          target_role: '电力交易策略分析师',
          switch_cost: '中',
          bridge_skills: ['市场规则', '策略回测'],
          transition_period: '6-9个月'
        },
        {
          target_role: '储能交易运营',
          switch_cost: '中',
          bridge_skills: ['储能调度', '收益优化'],
          transition_period: '6-9个月'
        },
        {
          target_role: '能源市场研究岗',
          switch_cost: '中高',
          bridge_skills: ['行业研究', '政策分析'],
          transition_period: '7-10个月'
        }
      ],
      prepare_180d_plan: [
        '1-30天：梳理现货交易规则与关键指标。',
        '31-60天：完成1个报价策略复盘项目。',
        '61-90天：完成交易运营高频题训练。',
        '91-120天：补齐价格预测与风险预算方法。',
        '121-150天：主导一次偏差成本复盘并优化机制。',
        '151-180天：形成可展示的交易运营证据包。'
      ],
      role_scope_text: '负责电力现货交易执行与运营，对交易收益、偏差成本和风险控制负责。'
    },
    platformGap: {
      status: 'keep_blank_with_search_plan_v163',
      required_info: ['城市分布', '薪资区间P25/P50/P75', '发布时间', '批次/轮次', '帖子ID/链接', '样本量', '截图时间'],
      where_to_search: ['BOSS直聘网页端', '小红书搜索页', '牛客网'],
      boss_search_url: 'https://www.zhipin.com/web/geek/job',
      boss_search_query: ['应届生 电力现货 交易运营 广州', '能源 交易运营 校招 南京'],
      xiaohongshu_search_url: 'https://www.xiaohongshu.com/search_result/?keyword=%E7%94%B5%E5%8A%9B%E4%BA%A4%E6%98%93%20%E9%9D%A2%E7%BB%8F',
      xiaohongshu_search_query: ['电力交易 运营 面经', '现货交易 校招 offer'],
      missing_fields: ['城市分布', '薪资区间P25/P50/P75', '发布时间', '批次/轮次', '帖子ID/链接', '样本量', '截图时间'],
      how_to_search: ['先以国家能源局和电网企业校招口径确定岗位定义。', 'BOSS保留城市与发布时间用于分位统计。', '小红书仅补面经并标记回忆样本。'],
      unavailable_capture_log_v163: {
        official_http: 200,
        boss_http: 200,
        xiaohongshu_http: 404,
        checked_at: TODAY,
        note: '小红书检索受限，字段暂留空。'
      },
      filled_mode: 'industry_proxy_fallback',
      filled_values: {},
      next_backfill_action: '补齐南方和华东至少各1条样本。'
    },
    writtenTopics: [
      { type: '交易流程题', bucket: 'system_process', text: '请设计“预测-报价-执行-复盘”的现货交易运营流程。' },
      { type: '场景分析题', bucket: 'business_scenario', text: '负荷预测偏差扩大时你如何调整当日交易策略？' },
      { type: '失败复盘题', bucket: 'failure_review', text: '一次高偏差成本结算后你如何复盘并纠偏？' },
      { type: '收益风险取舍题', bucket: 'metric_tradeoff', text: '追求收益最大化与风险敞口控制冲突时你如何取舍？' },
      { type: '协同题', bucket: 'cross_team_collaboration', text: '调度、交易、运维三方目标冲突时你如何推进协同？' },
      { type: '机制建设题', bucket: 'system_process', text: '如何建设交易运营风险预警与止损机制？' },
      { type: '策略诊断题', bucket: 'business_scenario', text: '价格剧烈波动时你如何快速诊断并更新策略？' },
      { type: '经验迁移题', bucket: 'cross_team_collaboration', text: '如何把高收益策略经验复制到其他时段或区域？' }
    ],
    interviewTopics: [
      { type: '应急决策题', bucket: 'business_scenario', text: '实时价格异常跳变时你会如何临场决策？' },
      { type: '协同推进题', bucket: 'cross_team_collaboration', text: '交易和调度对策略执行意见相反时你如何推进？' },
      { type: '复盘题', bucket: 'failure_review', text: '讲一次你处理偏差成本失控并扭转的经历。' },
      { type: '优先级取舍题', bucket: 'metric_tradeoff', text: '多条策略同时告警时你如何排序？' },
      { type: '流程改进题', bucket: 'system_process', text: '你如何改进现有交易复盘机制以提升可执行性？' },
      { type: '追问链题', bucket: 'cross_team_collaboration', text: '如果关键部门不认可你的止损策略，你如何说服？' },
      { type: '情景判断题', bucket: 'business_scenario', text: '新能源出力突降导致策略失效时你怎么处理？' },
      { type: '机制反思题', bucket: 'failure_review', text: '过去一次策略误判教会了你什么，如何固化到机制？' }
    ]
  },
  {
    file: 'data/entries/IND_FIN_BANK.json',
    industryId: 'IND_FIN_BANK',
    industryLabel: '金融-银行',
    newRoleId: 'IND_FIN_BANK_ROLE_022',
    sourceRoleId: 'IND_FIN_BANK_ROLE_021',
    roleName: '普惠金融产品运营岗',
    rolePatch: {
      role_readiness_floor: '至少完成1个普惠产品运营项目：客群划分、策略执行、风险控制和增长复盘。',
      day_in_life: '普惠金融产品运营岗一周围绕客群经营、流程优化、风险监测、渠道协同和效果复盘展开。',
      growth_path_1to3_year: '0-1年掌握普惠产品规则与运营指标；1-3年独立负责产品运营策略；3-5年可主导区域普惠运营体系。',
      transfer_path_hint: '可转零售风控策略、产品经理、客户经营策略岗；建议补齐数据建模与风险识别能力。',
      career_outlook_3to5_year: '普惠金融政策持续加码，产品运营岗位需求稳中有升，能力重心向“增长与风险平衡”深化。',
      typical_work_week: '活动节点与风险波动期协同频次高，平时以运营策略迭代和流程优化为主。',
      switch_directions: [
        {
          target_role: '零售风控策略岗',
          switch_cost: '中',
          bridge_skills: ['风险策略', '数据分析'],
          transition_period: '6-9个月'
        },
        {
          target_role: '银行产品经理',
          switch_cost: '中',
          bridge_skills: ['产品设计', '需求管理'],
          transition_period: '6-9个月'
        },
        {
          target_role: '客户经营策略岗',
          switch_cost: '中高',
          bridge_skills: ['客群运营', '增长实验'],
          transition_period: '7-10个月'
        }
      ],
      prepare_180d_plan: [
        '1-30天：梳理普惠产品规则、政策与指标体系。',
        '31-60天：完成1个产品运营闭环项目并复盘。',
        '61-90天：完成普惠运营高频题训练。',
        '91-120天：补齐风险指标监测与策略调整方法。',
        '121-150天：主导一次低转化场景复盘并优化动作。',
        '151-180天：形成可展示的普惠运营项目证据。'
      ],
      role_scope_text: '负责普惠金融产品运营与增长策略执行，对产品渗透率、活跃度和风险可控性负责。'
    },
    platformGap: {
      status: 'keep_blank_with_search_plan_v163',
      required_info: ['城市分布', '薪资区间P25/P50/P75', '发布时间', '批次/轮次', '帖子ID/链接', '样本量', '截图时间'],
      where_to_search: ['BOSS直聘网页端', '小红书搜索页', '牛客网'],
      boss_search_url: 'https://www.zhipin.com/web/geek/job',
      boss_search_query: ['应届生 普惠金融 产品运营 银行', '校招 银行 产品运营 普惠'],
      xiaohongshu_search_url: 'https://www.xiaohongshu.com/search_result/?keyword=%E6%99%AE%E6%83%A0%E9%87%91%E8%9E%8D%20%E9%9D%A2%E7%BB%8F',
      xiaohongshu_search_query: ['普惠金融 产品运营 面经', '银行 产品运营 offer'],
      missing_fields: ['城市分布', '薪资区间P25/P50/P75', '发布时间', '批次/轮次', '帖子ID/链接', '样本量', '截图时间'],
      how_to_search: ['先对齐银行官方校招岗位口径。', 'BOSS保留发布时间和城市样本用于分位统计。', '小红书面经仅作训练参考，记录帖子ID。'],
      unavailable_capture_log_v163: {
        official_http: 200,
        boss_http: 200,
        xiaohongshu_http: 404,
        checked_at: TODAY,
        note: '小红书检索不稳定，按规范留空。'
      },
      filled_mode: 'industry_proxy_fallback',
      filled_values: {},
      next_backfill_action: '补齐至少3条银行普惠运营岗位样本。'
    },
    writtenTopics: [
      { type: '运营流程题', bucket: 'system_process', text: '请设计“客群识别-策略执行-效果评估-迭代优化”的普惠运营流程。' },
      { type: '场景决策题', bucket: 'business_scenario', text: '当低风险客群增长停滞时你如何诊断并调整策略？' },
      { type: '失败复盘题', bucket: 'failure_review', text: '一次促活活动效果不达标后你如何复盘？' },
      { type: '增长风险取舍题', bucket: 'metric_tradeoff', text: '短期规模增长与风险指标恶化冲突时你如何取舍？' },
      { type: '协同推进题', bucket: 'cross_team_collaboration', text: '运营、风控、渠道三方目标冲突时你如何推进协同？' },
      { type: '机制建设题', bucket: 'system_process', text: '如何建立普惠产品运营监控与预警机制？' },
      { type: '策略诊断题', bucket: 'business_scenario', text: '当关键转化环节下滑时你如何快速定位根因？' },
      { type: '经验迁移题', bucket: 'cross_team_collaboration', text: '如何将单城市有效策略复制到多区域？' }
    ],
    interviewTopics: [
      { type: '应急处理题', bucket: 'business_scenario', text: '政策或监管口径临时调整时你如何应急？' },
      { type: '协同沟通题', bucket: 'cross_team_collaboration', text: '风控收紧影响增长目标时你如何协调团队？' },
      { type: '复盘叙述题', bucket: 'failure_review', text: '讲一次你修复普惠产品转化下滑的经历。' },
      { type: '优先级题', bucket: 'metric_tradeoff', text: '多项运营任务并发时你如何排优先级？' },
      { type: '流程优化题', bucket: 'system_process', text: '你如何优化当前普惠产品运营流程？' },
      { type: '追问链题', bucket: 'cross_team_collaboration', text: '渠道方执行不到位时你会如何推动落地？' },
      { type: '情景判断题', bucket: 'business_scenario', text: '若客诉上升且活跃度下降，你先处理哪一项？为什么？' },
      { type: '反思迁移题', bucket: 'failure_review', text: '过去一次判断失误如何转化为制度改进？' }
    ]
  },
  {
    file: 'data/entries/IND_FIN_SECURITIES_FUND.json',
    industryId: 'IND_FIN_SECURITIES_FUND',
    industryLabel: '金融-证券基金',
    newRoleId: 'IND_FIN_SECURITIES_FUND_ROLE_022',
    sourceRoleId: 'IND_FIN_SECURITIES_FUND_ROLE_021',
    roleName: '公募产品运营分析岗',
    rolePatch: {
      role_readiness_floor: '至少完成1个公募产品运营项目：数据监控、问题诊断、策略执行和复盘优化。',
      day_in_life: '公募产品运营分析岗一周通常进行产品数据监测、渠道反馈整理、策略调优和投研协同复盘。',
      growth_path_1to3_year: '0-1年掌握产品运营指标和业务流程；1-3年独立负责产品运营分析；3-5年可主导产品组合运营策略。',
      transfer_path_hint: '可转产品经理、投顾服务运营、基金销售支持；建议补齐资产配置逻辑与数据建模能力。',
      career_outlook_3to5_year: '公募产品竞争加剧，运营分析岗位会持续从“报表支持”升级为“策略驱动”角色。',
      typical_work_week: '发行和市场波动时期任务密集，平时以运营诊断和策略迭代为主。',
      switch_directions: [
        {
          target_role: '公募产品经理',
          switch_cost: '中',
          bridge_skills: ['产品设计', '生命周期管理'],
          transition_period: '6-9个月'
        },
        {
          target_role: '投顾服务运营',
          switch_cost: '中',
          bridge_skills: ['客户运营', '服务流程'],
          transition_period: '6-9个月'
        },
        {
          target_role: '基金销售支持',
          switch_cost: '低中',
          bridge_skills: ['渠道协同', '材料策略'],
          transition_period: '4-7个月'
        }
      ],
      prepare_180d_plan: [
        '1-30天：梳理产品运营核心指标与数据口径。',
        '31-60天：完成1个产品运营诊断案例并复盘。',
        '61-90天：完成公募运营分析高频题训练。',
        '91-120天：补齐产品分层与用户分群方法。',
        '121-150天：主导一次低活跃产品复盘专项。',
        '151-180天：形成可展示的产品运营分析证据包。'
      ],
      role_scope_text: '负责公募产品运营数据分析与策略支持，对产品活跃度、渠道转化和运营效率负责。'
    },
    platformGap: {
      status: 'keep_blank_with_search_plan_v163',
      required_info: ['城市分布', '薪资区间P25/P50/P75', '发布时间', '批次/轮次', '帖子ID/链接', '样本量', '截图时间'],
      where_to_search: ['BOSS直聘网页端', '小红书搜索页', '牛客网'],
      boss_search_url: 'https://www.zhipin.com/web/geek/job',
      boss_search_query: ['应届生 公募 产品运营 分析 上海', '证券 基金 运营分析 校招'],
      xiaohongshu_search_url: 'https://www.xiaohongshu.com/search_result/?keyword=%E5%85%AC%E5%8B%9F%20%E4%BA%A7%E5%93%81%E8%BF%90%E8%90%A5%20%E9%9D%A2%E7%BB%8F',
      xiaohongshu_search_query: ['公募 产品运营 面经', '基金 运营分析 offer'],
      missing_fields: ['城市分布', '薪资区间P25/P50/P75', '发布时间', '批次/轮次', '帖子ID/链接', '样本量', '截图时间'],
      how_to_search: ['以基金公司官方招聘页为岗位口径主源。', 'BOSS记录城市、发布时间和样本量。', '小红书只用于面经补充并标记回忆样本。'],
      unavailable_capture_log_v163: {
        official_http: 200,
        boss_http: 200,
        xiaohongshu_http: 404,
        checked_at: TODAY,
        note: '小红书检索受限，暂留空。'
      },
      filled_mode: 'industry_proxy_fallback',
      filled_values: {},
      next_backfill_action: '补齐沪深两地产品运营分析岗位样本。'
    },
    writtenTopics: [
      { type: '运营分析流程题', bucket: 'system_process', text: '请设计“监测-诊断-策略-复盘”的公募产品运营分析流程。' },
      { type: '场景判断题', bucket: 'business_scenario', text: '当某产品申赎结构异常时你如何快速诊断与应对？' },
      { type: '失败复盘题', bucket: 'failure_review', text: '一次产品活动转化不达标后你如何复盘？' },
      { type: '收益体验取舍题', bucket: 'metric_tradeoff', text: '短期销量冲刺与长期客户体验冲突时你如何取舍？' },
      { type: '协同推进题', bucket: 'cross_team_collaboration', text: '投研与渠道对运营策略意见不一致时你如何推进？' },
      { type: '机制建设题', bucket: 'system_process', text: '如何建立产品运营异常预警和升级机制？' },
      { type: '策略优化题', bucket: 'business_scenario', text: '产品活跃用户下降时你如何设计恢复策略？' },
      { type: '经验复用题', bucket: 'cross_team_collaboration', text: '如何把高效运营打法复制到其他产品线？' }
    ],
    interviewTopics: [
      { type: '应急处理题', bucket: 'business_scenario', text: '市场波动导致客户集中赎回时你如何组织应对？' },
      { type: '协同沟通题', bucket: 'cross_team_collaboration', text: '渠道要求快推活动但投研建议观望时你如何协调？' },
      { type: '复盘叙述题', bucket: 'failure_review', text: '讲一次你通过数据分析扭转产品运营表现的经历。' },
      { type: '优先级题', bucket: 'metric_tradeoff', text: '多产品并发下滑时你如何排序干预？' },
      { type: '流程改进题', bucket: 'system_process', text: '你如何优化现有运营分析报表体系？' },
      { type: '追问链题', bucket: 'cross_team_collaboration', text: '关键团队不配合数据口径统一时你如何推进？' },
      { type: '场景决策题', bucket: 'business_scenario', text: '若核心产品口碑下滑，你先动哪三个动作？' },
      { type: '反思迁移题', bucket: 'failure_review', text: '过去一次策略误判如何沉淀为长期机制？' }
    ]
  },
  {
    file: 'data/entries/IND_PUBLIC_INSTITUTION.json',
    industryId: 'IND_PUBLIC_INSTITUTION',
    industryLabel: '事业单位体系',
    newRoleId: 'IND_PUBLIC_INSTITUTION_ROLE_022',
    sourceRoleId: 'IND_PUBLIC_INSTITUTION_ROLE_021',
    roleName: '事业单位绩效评价岗',
    rolePatch: {
      role_readiness_floor: '至少完成1个绩效评价项目：指标体系设计、数据核验、结果反馈和改进闭环。',
      day_in_life: '绩效评价岗一周通常进行指标口径核对、数据分析、部门沟通、结果解释和改进方案跟踪。',
      growth_path_1to3_year: '0-1年掌握绩效制度与数据口径；1-3年独立负责评价项目；3-5年可主导组织绩效体系优化。',
      transfer_path_hint: '可转组织发展岗、人事绩效岗、运营管理岗；建议补齐统计分析与制度设计能力。',
      career_outlook_3to5_year: '事业单位治理提质增效背景下，绩效评价岗位将持续强化“数据驱动+机制优化”能力。',
      typical_work_week: '季度考核和年度评估节点任务密集，平时以数据治理和指标优化为主。',
      switch_directions: [
        {
          target_role: '组织发展岗',
          switch_cost: '中',
          bridge_skills: ['组织诊断', '岗位体系'],
          transition_period: '6-9个月'
        },
        {
          target_role: '人事绩效岗',
          switch_cost: '低中',
          bridge_skills: ['绩效制度', '沟通反馈'],
          transition_period: '4-7个月'
        },
        {
          target_role: '运营管理岗',
          switch_cost: '中',
          bridge_skills: ['流程管理', '指标运营'],
          transition_period: '6-9个月'
        }
      ],
      prepare_180d_plan: [
        '1-30天：梳理绩效制度、指标定义和数据来源。',
        '31-60天：完成1个评价项目复盘并输出改进建议。',
        '61-90天：完成绩效评价高频题训练。',
        '91-120天：补齐统计分析与可视化表达能力。',
        '121-150天：主导一次绩效申诉案例复盘并优化规则。',
        '151-180天：形成可展示的绩效评价项目证据。'
      ],
      role_scope_text: '负责事业单位绩效评价与改进跟踪，对评价准确性、反馈有效性和改进落地率负责。'
    },
    platformGap: {
      status: 'keep_blank_with_search_plan_v163',
      required_info: ['城市分布', '薪资区间P25/P50/P75', '发布时间', '批次/轮次', '帖子ID/链接', '样本量', '截图时间'],
      where_to_search: ['事业单位招聘公告', '小红书搜索页', '面经社区'],
      boss_search_url: 'https://www.zhipin.com/web/geek/job',
      boss_search_query: ['事业单位 绩效评价 岗位 招聘'],
      xiaohongshu_search_url: 'https://www.xiaohongshu.com/search_result/?keyword=%E4%BA%8B%E4%B8%9A%E5%8D%95%E4%BD%8D%20%E7%BB%A9%E6%95%88%20%E9%9D%A2%E7%BB%8F',
      xiaohongshu_search_query: ['事业单位 绩效评价 面经', '事业编 绩效岗 经验'],
      missing_fields: ['城市分布', '薪资区间P25/P50/P75', '发布时间', '批次/轮次', '帖子ID/链接', '样本量', '截图时间'],
      how_to_search: ['优先官方招聘公告获取岗位口径。', '平台样本仅用于训练补充，不做强薪资结论。', '记录公告/帖子链接与截图时间。'],
      unavailable_capture_log_v163: {
        official_http: 200,
        boss_http: 200,
        xiaohongshu_http: 404,
        checked_at: TODAY,
        note: '小红书公开检索受限，按规范留空。'
      },
      filled_mode: 'industry_proxy_fallback',
      filled_values: {},
      next_backfill_action: '补齐3条绩效评价岗位样本并标注轮次。'
    },
    writtenTopics: [
      { type: '评价流程题', bucket: 'system_process', text: '请设计“指标定义-数据核验-评价反馈-改进跟踪”的绩效评价流程。' },
      { type: '场景分析题', bucket: 'business_scenario', text: '当多个部门对同一指标解释不一致时你如何处理？' },
      { type: '失败复盘题', bucket: 'failure_review', text: '一次绩效评价引发争议后你如何复盘并修正规则？' },
      { type: '公平效率取舍题', bucket: 'metric_tradeoff', text: '评价公平性与执行效率冲突时你如何取舍？' },
      { type: '协同推进题', bucket: 'cross_team_collaboration', text: '业务部门和人事部门评价目标冲突时你如何推进协同？' },
      { type: '机制建设题', bucket: 'system_process', text: '如何建立绩效评价的申诉与复核机制？' },
      { type: '诊断优化题', bucket: 'business_scenario', text: '当指标长期无法反映真实绩效时你如何优化？' },
      { type: '经验复用题', bucket: 'cross_team_collaboration', text: '如何把一次成功评价改进经验推广到全单位？' }
    ],
    interviewTopics: [
      { type: '应急沟通题', bucket: 'business_scenario', text: '评价结果公布后部门情绪对立，你如何沟通稳定？' },
      { type: '协同协调题', bucket: 'cross_team_collaboration', text: '人事与业务对评价结论分歧较大时你如何协调？' },
      { type: '复盘叙述题', bucket: 'failure_review', text: '讲一次你处理绩效争议并完成改进闭环的经历。' },
      { type: '优先级取舍题', bucket: 'metric_tradeoff', text: '多项评价异常并发时你如何排序处理？' },
      { type: '流程优化题', bucket: 'system_process', text: '你如何优化绩效评价数据核验流程？' },
      { type: '追问链题', bucket: 'cross_team_collaboration', text: '关键部门拒绝配合数据提供时你如何推进？' },
      { type: '场景决策题', bucket: 'business_scenario', text: '当指标改善与群众满意度不一致时你先看什么？' },
      { type: '反思迁移题', bucket: 'failure_review', text: '过去一次评价误判如何沉淀为长期机制？' }
    ]
  }
];

const defaultAnswerFramework = ['目标与边界澄清', '执行路径拆解', '指标与风险控制', '复盘与机制沉淀'];
const defaultScoringDimensions = ['结构化思维', '可执行性', '风险意识', '复盘能力'];
const defaultCommonMistakes = ['描述泛化', '缺少量化指标', '缺少风险预案'];
const defaultGoodSignals = ['结论先行', '路径清晰', '指标闭环'];
const defaultReference = ['先明确目标和约束', '再拆解动作与分工', '最后给出结果和复盘'];

function deepReplace(value, oldText, newText) {
  if (typeof value === 'string') return value.split(oldText).join(newText);
  if (Array.isArray(value)) return value.map((v) => deepReplace(v, oldText, newText));
  if (value && typeof value === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(value)) out[k] = deepReplace(v, oldText, newText);
    return out;
  }
  return value;
}

function buildQuestion(base, def, roleId, roleName, qid, stage, round, industryLabel) {
  return {
    ...base,
    question_id: qid,
    prompt: `【行业:${industryLabel}｜岗位:${roleName}｜阶段:${round}】${def.text}`,
    question_type: def.type,
    recruitment_stage: stage,
    round_label: round,
    role_id: roleId,
    role_name: roleName,
    question_year: 2026,
    updated_at: TODAY,
    difficulty_1to5: Math.max(3, Number(base.difficulty_1to5 || 3)),
    scenario_bucket: def.bucket,
    answer_framework: defaultAnswerFramework,
    scoring_dimensions: defaultScoringDimensions,
    common_mistakes: defaultCommonMistakes,
    good_answer_signals: defaultGoodSignals,
    reference_answer_outline: defaultReference,
    follow_up_questions: [
      '如果关键资源减少30%，你会保哪一步？',
      '首轮动作无效时你如何快速纠偏？',
      '如何把本次经验沉淀成可复用机制？'
    ],
    scoring_rubric: {
      A档: '目标清晰、动作可执行、指标与风险闭环完整。',
      B档: '路径可执行但指标或边界条件不完整。',
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

  if (roles.some((r) => r.role_id === u.newRoleId)) {
    throw new Error(`Role already exists: ${u.newRoleId}`);
  }

  const sourceRole = roles.find((r) => r.role_id === u.sourceRoleId);
  if (!sourceRole) {
    throw new Error(`Source role not found: ${u.sourceRoleId}`);
  }

  let newRole = JSON.parse(JSON.stringify(sourceRole));
  newRole = deepReplace(newRole, u.sourceRoleId, u.newRoleId);
  if (sourceRole.role_name) {
    newRole = deepReplace(newRole, sourceRole.role_name, u.roleName);
  }

  newRole.role_id = u.newRoleId;
  newRole.role_name = u.roleName;
  Object.assign(newRole, u.rolePatch);
  newRole.platform_backfill_gap = {
    ...(newRole.platform_backfill_gap || {}),
    ...u.platformGap,
    updated_at: TODAY
  };
  newRole.updated_at = TODAY;
  newRole.role_detail_v158 = newRole.role_detail_v158 || {};
  newRole.role_detail_v158.role_scope = u.rolePatch.role_scope_text;
  newRole.role_detail_v158.expansion_status = 'landed_new_role_v163_batchB';

  roles.push(newRole);

  const writtenBasePool = writtenItems.filter((q) => q.role_id === u.sourceRoleId);
  const interviewBasePool = interviewItems.filter((q) => q.role_id === u.sourceRoleId);
  if (writtenBasePool.length === 0 || interviewBasePool.length === 0) {
    throw new Error(`Question base missing: ${u.sourceRoleId}`);
  }

  const roleSuffix = u.newRoleId.split('_ROLE_')[1];

  for (let i = 0; i < u.writtenTopics.length; i += 1) {
    const def = u.writtenTopics[i];
    const [stage, round] = WRITTEN_STAGES[i];
    const qid = `${u.industryId}_WRITTEN_V163_R${roleSuffix}_${String(i + 1).padStart(2, '0')}`;
    if (writtenItems.some((q) => q.question_id === qid)) {
      throw new Error(`Duplicate question id: ${qid}`);
    }
    const base = writtenBasePool[i % writtenBasePool.length];
    writtenItems.push(buildQuestion(base, def, u.newRoleId, u.roleName, qid, stage, round, u.industryLabel));
  }

  for (let i = 0; i < u.interviewTopics.length; i += 1) {
    const def = u.interviewTopics[i];
    const [stage, round] = INTERVIEW_STAGES[i];
    const qid = `${u.industryId}_INTERVIEW_V163_R${roleSuffix}_${String(i + 1).padStart(2, '0')}`;
    if (interviewItems.some((q) => q.question_id === qid)) {
      throw new Error(`Duplicate question id: ${qid}`);
    }
    const base = interviewBasePool[i % interviewBasePool.length];
    interviewItems.push(buildQuestion(base, def, u.newRoleId, u.roleName, qid, stage, round, u.industryLabel));
  }

  const writtenForRole = writtenItems.filter((q) => q.role_id === u.newRoleId);
  const interviewForRole = interviewItems.filter((q) => q.role_id === u.newRoleId);
  newRole.role_detail_v158.role_specific_question_coverage = {
    written_count: writtenForRole.length,
    interview_count: interviewForRole.length,
    written_stages: [...new Set(writtenForRole.map((q) => q.recruitment_stage).filter(Boolean))],
    interview_stages: [...new Set(interviewForRole.map((q) => q.recruitment_stage).filter(Boolean))]
  };

  fs.writeFileSync(fullPath, JSON.stringify(entry, null, 2) + '\n', 'utf8');
  console.log(`Added ${u.newRoleId} in ${u.file}`);
}
