#!/usr/bin/env node

const fs = require('fs');

const INPUT_PATH = '行业百科.v1.1.backup.json';
const OUTPUT_PATH = '行业百科.json';
const TODAY = '2026-02-16';
const NEXT_REVIEW = '2026-05-16';

const raw = JSON.parse(fs.readFileSync(INPUT_PATH, 'utf8'));

const SOURCE_REGISTRY = [
  {
    source_id: 'SRC_MOE',
    source_name: '中华人民共和国教育部',
    source_type: 'government',
    source_url: 'https://www.moe.gov.cn',
    credibility: 'high',
    typical_update_cycle: 'monthly_or_event_driven',
    last_checked: TODAY,
  },
  {
    source_id: 'SRC_MOHRSS',
    source_name: '中华人民共和国人力资源和社会保障部',
    source_type: 'government',
    source_url: 'https://www.mohrss.gov.cn',
    credibility: 'high',
    typical_update_cycle: 'monthly_or_event_driven',
    last_checked: TODAY,
  },
  {
    source_id: 'SRC_MIIT',
    source_name: '中华人民共和国工业和信息化部',
    source_type: 'government',
    source_url: 'https://www.miit.gov.cn',
    credibility: 'high',
    typical_update_cycle: 'monthly_or_event_driven',
    last_checked: TODAY,
  },
  {
    source_id: 'SRC_NBS',
    source_name: '国家统计局',
    source_type: 'government',
    source_url: 'https://www.stats.gov.cn',
    credibility: 'high',
    typical_update_cycle: 'monthly_or_quarterly',
    last_checked: TODAY,
  },
  {
    source_id: 'SRC_SCS',
    source_name: '国家公务员局',
    source_type: 'government',
    source_url: 'https://www.scs.gov.cn',
    credibility: 'high',
    typical_update_cycle: 'annual_or_event_driven',
    last_checked: TODAY,
  },
  {
    source_id: 'SRC_SASAC',
    source_name: '国务院国有资产监督管理委员会',
    source_type: 'government',
    source_url: 'https://www.sasac.gov.cn',
    credibility: 'high',
    typical_update_cycle: 'event_driven',
    last_checked: TODAY,
  },
  {
    source_id: 'SRC_NCSS',
    source_name: '国家大学生就业服务平台',
    source_type: 'platform',
    source_url: 'https://www.ncss.cn',
    credibility: 'high',
    typical_update_cycle: 'event_driven',
    last_checked: TODAY,
  },
  {
    source_id: 'SRC_ZHILIAN',
    source_name: '智联招聘',
    source_type: 'commercial_platform',
    source_url: 'https://www.zhaopin.com',
    credibility: 'medium',
    typical_update_cycle: 'quarterly',
    last_checked: TODAY,
  },
  {
    source_id: 'SRC_BOSS',
    source_name: 'BOSS直聘',
    source_type: 'commercial_platform',
    source_url: 'https://www.zhipin.com',
    credibility: 'medium',
    typical_update_cycle: 'monthly_or_quarterly',
    last_checked: TODAY,
  },
  {
    source_id: 'SRC_51JOB',
    source_name: '前程无忧(51job)',
    source_type: 'commercial_platform',
    source_url: 'https://www.51job.com',
    credibility: 'medium',
    typical_update_cycle: 'monthly_or_quarterly',
    last_checked: TODAY,
  },
  {
    source_id: 'SRC_EDITORIAL',
    source_name: '行业百科编委会',
    source_type: 'editorial',
    source_url: null,
    credibility: 'medium',
    typical_update_cycle: 'continuous',
    last_checked: TODAY,
  },
];

const DEFAULT_ENTRY_REQUIREMENTS = {
  学历偏好: '本科及以上（按岗位差异化）',
  专业限制: '相关专业优先，跨专业可通过项目与实习补齐',
  转专业友好度_1to5: 3,
  证书要求: '非强制，按岗位需要补充',
  英语要求: '具备基础阅读与沟通能力',
  无实习可投比例估计: '0.2-0.4',
  实习要求: '建议至少1段相关实习或项目证明',
};

const DEFAULT_WORK_STYLE = {
  加班强度_1to5: 3,
  出差或驻场强度_1to5: 2,
  轮班要求: '视岗位而定',
  绩效压力_1to5: 3,
  淘汰风险_1to5: 2,
};

const DEFAULT_SCORES = {
  薪资潜力_1to5: 3,
  上岸难度_1to5: 3,
  工作强度_1to5: 3,
  稳定性_1to5: 3,
  成长性_1to5: 3,
  评分口径: '编委会结合公开岗位与行业周期给出的2026Q1基准分',
  置信度: 0.58,
};

const DEFAULT_DECISION = {
  推荐人群: ['愿意持续学习', '接受行业波动并能长期投入'],
  不推荐人群: ['仅以短期高薪为唯一目标', '对岗位强度容忍度低'],
  替代行业: [],
  转岗路径: [],
};

const INDUSTRY_OVERRIDES = {
  '互联网与AI': {
    industry_id: 'IND_INTERNET_AI',
    slug: 'internet-ai',
    company_seed: {
      company_id: 'COMP_TENCENT',
      company_name: '腾讯',
      company_tier: 't1_head',
      city_focus: ['深圳', '北京', '上海', '广州', '成都'],
      business_focus: ['消费互联网', '企业服务', 'AI应用'],
      source_url: 'https://join.qq.com',
      source_name: '腾讯招聘官网',
    },
    entry: {
      学历偏好: '本科及以上，算法与核心研发岗硕士更有优势',
      专业限制: '计算机/软件/数学/统计优先，跨专业需强项目证明',
      转专业友好度_1to5: 3,
      英语要求: '阅读技术文档能力中等以上',
      无实习可投比例估计: '0.1-0.25',
    },
    work: {
      加班强度_1to5: 5,
      出差或驻场强度_1to5: 2,
      轮班要求: '部分运营与稳定性岗位存在值班',
      绩效压力_1to5: 5,
      淘汰风险_1to5: 4,
    },
    scores: {
      薪资潜力_1to5: 5,
      上岸难度_1to5: 5,
      工作强度_1to5: 5,
      稳定性_1to5: 2,
      成长性_1to5: 5,
      置信度: 0.66,
    },
    decision: {
      推荐人群: ['技术基础扎实并愿意高频迭代', '希望在高增长赛道积累可迁移能力'],
      不推荐人群: ['希望低波动低强度工作节奏', '对快速组织变化适应性较弱'],
      替代行业: ['通信与运营商', '高端制造与工业自动化'],
      转岗路径: ['开发->平台/架构', '数据分析->策略运营->产品'],
    },
  },
  '半导体与电子': {
    industry_id: 'IND_SEMICONDUCTOR_ELECTRONICS',
    slug: 'semiconductor-electronics',
    company_seed: {
      company_id: 'COMP_SMIC',
      company_name: '中芯国际',
      company_tier: 't1_head',
      city_focus: ['上海', '深圳', '北京', '天津'],
      business_focus: ['晶圆制造', '工艺研发'],
      source_url: 'https://www.smics.com',
      source_name: '中芯国际官网',
    },
    entry: {
      学历偏好: '本科及以上，研发设计岗硕士优势明显',
      专业限制: '微电子/电子信息/材料/物理优先',
      转专业友好度_1to5: 2,
      证书要求: '无硬性证书，强调项目与实验能力',
      英语要求: '能阅读英文手册与论文',
      无实习可投比例估计: '0.15-0.35',
    },
    work: {
      加班强度_1to5: 4,
      出差或驻场强度_1to5: 3,
      轮班要求: '制造/设备岗位可能轮班',
      绩效压力_1to5: 4,
      淘汰风险_1to5: 3,
    },
    scores: {
      薪资潜力_1to5: 4,
      上岸难度_1to5: 4,
      工作强度_1to5: 4,
      稳定性_1to5: 3,
      成长性_1to5: 4,
      置信度: 0.64,
    },
    decision: {
      推荐人群: ['专业基础扎实且愿意长期深耕硬科技', '能接受周期波动与工程迭代'],
      不推荐人群: ['希望短期快速转管理且不愿深挖技术细节'],
      替代行业: ['高端制造与工业自动化', '新能源'],
      转岗路径: ['设计/验证->系统架构', '工艺/设备->制造管理'],
    },
  },
  '通信与运营商': {
    industry_id: 'IND_TELECOM_OPERATOR',
    slug: 'telecom-operators',
    company_seed: {
      company_id: 'COMP_CHINA_MOBILE',
      company_name: '中国移动',
      company_tier: 'public_sector',
      city_focus: ['北京', '上海', '广东', '江苏', '浙江'],
      business_focus: ['通信网络运营', '政企解决方案', '算力网络'],
      source_url: 'https://job.10086.cn',
      source_name: '中国移动招聘官网',
    },
    entry: {
      学历偏好: '本科及以上',
      专业限制: '通信/电子/计算机优先，ToB岗位可接受复合背景',
      转专业友好度_1to5: 3,
      证书要求: '网络认证可加分但非硬性',
      英语要求: '基础',
      无实习可投比例估计: '0.3-0.5',
    },
    work: {
      加班强度_1to5: 3,
      出差或驻场强度_1to5: 4,
      轮班要求: '网络运维岗位可能值班',
      绩效压力_1to5: 3,
      淘汰风险_1to5: 2,
    },
    scores: {
      薪资潜力_1to5: 3,
      上岸难度_1to5: 3,
      工作强度_1to5: 3,
      稳定性_1to5: 4,
      成长性_1to5: 3,
      置信度: 0.62,
    },
    decision: {
      推荐人群: ['重视平台稳定性并接受项目交付', '愿意在ToB场景积累行业经验'],
      不推荐人群: ['抗拒现场交付和周期性出差'],
      替代行业: ['能源与公用事业', '公共部门-央国企'],
      转岗路径: ['网络优化->解决方案', '通信研发->云网融合岗位'],
    },
  },
  '新能源': {
    industry_id: 'IND_NEW_ENERGY',
    slug: 'new-energy',
    company_seed: {
      company_id: 'COMP_CATL',
      company_name: '宁德时代',
      company_tier: 't1_head',
      city_focus: ['宁德', '上海', '厦门', '成都', '宜宾'],
      business_focus: ['动力电池', '储能系统'],
      source_url: 'https://www.catl.com',
      source_name: '宁德时代官网',
    },
    entry: {
      学历偏好: '本科及以上，核心研发岗硕士偏好更强',
      专业限制: '材料/化学/电气/机械优先',
      转专业友好度_1to5: 2,
      英语要求: '中等（涉海外业务岗位更高）',
      无实习可投比例估计: '0.2-0.35',
    },
    work: {
      加班强度_1to5: 4,
      出差或驻场强度_1to5: 3,
      轮班要求: '制造与运维岗位可能轮班',
      绩效压力_1to5: 4,
      淘汰风险_1to5: 3,
    },
    scores: {
      薪资潜力_1to5: 4,
      上岸难度_1to5: 4,
      工作强度_1to5: 4,
      稳定性_1to5: 3,
      成长性_1to5: 5,
      置信度: 0.65,
    },
    decision: {
      推荐人群: ['愿意在制造+研发场景长期积累', '对双碳与电力体系有兴趣'],
      不推荐人群: ['对制造现场和项目周期容忍度低'],
      替代行业: ['汽车与智能驾驶', '化工与新材料'],
      转岗路径: ['电芯研发->系统研发', '项目交付->产品经理'],
    },
  },
  '汽车与智能驾驶': {
    industry_id: 'IND_AUTO_INTELLIGENT_DRIVING',
    slug: 'auto-intelligent-driving',
    company_seed: {
      company_id: 'COMP_BYD',
      company_name: '比亚迪',
      company_tier: 't1_head',
      city_focus: ['深圳', '西安', '合肥', '长沙'],
      business_focus: ['整车', '智能驾驶', '三电系统'],
      source_url: 'https://career.byd.com',
      source_name: '比亚迪招聘官网',
    },
    entry: {
      学历偏好: '本科及以上，算法/控制岗位硕士更优',
      专业限制: '车辆工程/自动化/计算机/电子优先',
      转专业友好度_1to5: 3,
      无实习可投比例估计: '0.15-0.3',
    },
    work: {
      加班强度_1to5: 4,
      出差或驻场强度_1to5: 3,
      轮班要求: '测试与工厂相关岗位可能轮班',
      绩效压力_1to5: 4,
      淘汰风险_1to5: 3,
    },
    scores: {
      薪资潜力_1to5: 4,
      上岸难度_1to5: 4,
      工作强度_1to5: 4,
      稳定性_1to5: 3,
      成长性_1to5: 5,
      置信度: 0.64,
    },
    decision: {
      推荐人群: ['喜欢软硬件结合与复杂系统工程', '能接受快节奏项目推进'],
      不推荐人群: ['不愿接触跨学科协作和现场验证'],
      替代行业: ['新能源', '高端制造与工业自动化'],
      转岗路径: ['测试->系统工程', '算法->智能驾驶产品'],
    },
  },
  '高端制造与工业自动化': {
    industry_id: 'IND_ADVANCED_MANUFACTURING_AUTOMATION',
    slug: 'advanced-manufacturing-automation',
    company_seed: {
      company_id: 'COMP_INOVANCE',
      company_name: '汇川技术',
      company_tier: 't1_head',
      city_focus: ['深圳', '苏州', '杭州', '南京'],
      business_focus: ['工业自动化', '电驱与控制'],
      source_url: 'https://www.inovance.com',
      source_name: '汇川技术官网',
    },
    entry: {
      学历偏好: '本科及以上',
      专业限制: '自动化/机械/电气/控制优先',
      转专业友好度_1to5: 2,
      无实习可投比例估计: '0.2-0.4',
    },
    work: {
      加班强度_1to5: 3,
      出差或驻场强度_1to5: 4,
      轮班要求: '部分制造与运维岗位可能轮班',
      绩效压力_1to5: 3,
      淘汰风险_1to5: 2,
    },
    scores: {
      薪资潜力_1to5: 3,
      上岸难度_1to5: 3,
      工作强度_1to5: 3,
      稳定性_1to5: 4,
      成长性_1to5: 4,
      置信度: 0.62,
    },
    decision: {
      推荐人群: ['愿意长期做工程落地', '偏好实体产业链与现场问题解决'],
      不推荐人群: ['只偏好纯互联网办公场景'],
      替代行业: ['半导体与电子', '新能源'],
      转岗路径: ['应用工程->产品管理', '控制算法->系统架构'],
    },
  },
  '生物医药与器械': {
    industry_id: 'IND_BIOMED_DEVICE',
    slug: 'biomed-device',
    company_seed: {
      company_id: 'COMP_MINDRAY',
      company_name: '迈瑞医疗',
      company_tier: 't1_head',
      city_focus: ['深圳', '南京', '武汉', '北京', '上海'],
      business_focus: ['医疗器械研发', '临床支持'],
      source_url: 'https://www.mindray.com',
      source_name: '迈瑞医疗官网',
    },
    entry: {
      学历偏好: '本科及以上，研发与医学相关岗硕博偏好高',
      专业限制: '生物/药学/医学工程/机械电子等相关优先',
      转专业友好度_1to5: 2,
      证书要求: '部分岗位需执业资格或法规知识',
      英语要求: '中等以上（文献与法规阅读）',
      无实习可投比例估计: '0.1-0.25',
    },
    work: {
      加班强度_1to5: 3,
      出差或驻场强度_1to5: 3,
      轮班要求: '生产质控岗位可能轮班',
      绩效压力_1to5: 3,
      淘汰风险_1to5: 2,
    },
    scores: {
      薪资潜力_1to5: 3,
      上岸难度_1to5: 4,
      工作强度_1to5: 3,
      稳定性_1to5: 4,
      成长性_1to5: 4,
      置信度: 0.61,
    },
    decision: {
      推荐人群: ['愿意接受长期合规与研发周期', '关注技术与临床价值结合'],
      不推荐人群: ['不愿处理法规流程与文档要求'],
      替代行业: ['化工与新材料', '高端制造与工业自动化'],
      转岗路径: ['研发->注册/法规', '临床支持->产品经理'],
    },
  },
  '金融-银行': {
    industry_id: 'IND_FIN_BANK',
    slug: 'finance-bank',
    company_seed: {
      company_id: 'COMP_ICBC',
      company_name: '中国工商银行',
      company_tier: 'public_sector',
      city_focus: ['北京', '上海', '广州', '深圳', '南京'],
      business_focus: ['公司金融', '零售金融', '金融科技'],
      source_url: 'https://job.icbc.com.cn',
      source_name: '中国工商银行招聘官网',
    },
    entry: {
      学历偏好: '本科及以上，重点岗位倾向硕士',
      专业限制: '金融/经济/会计/法律/计算机相关优先',
      转专业友好度_1to5: 3,
      证书要求: '从业资格可加分，部分岗位要求明确',
      英语要求: '基础到中等',
      无实习可投比例估计: '0.25-0.45',
    },
    work: {
      加班强度_1to5: 3,
      出差或驻场强度_1to5: 2,
      轮班要求: '网点运营部分存在排班',
      绩效压力_1to5: 3,
      淘汰风险_1to5: 2,
    },
    scores: {
      薪资潜力_1to5: 3,
      上岸难度_1to5: 4,
      工作强度_1to5: 3,
      稳定性_1to5: 5,
      成长性_1to5: 3,
      置信度: 0.63,
    },
    decision: {
      推荐人群: ['重视稳定平台与规范培养体系', '希望积累金融基础能力'],
      不推荐人群: ['希望极快薪资跃迁且不接受流程规范'],
      替代行业: ['金融-保险', '公共部门-央国企'],
      转岗路径: ['柜面/客户经理->产品/风控', '数据岗->金融科技'],
    },
  },
  '金融-证券基金': {
    industry_id: 'IND_FIN_SECURITIES_FUND',
    slug: 'finance-securities-fund',
    company_seed: {
      company_id: 'COMP_CITIC_SECURITIES',
      company_name: '中信证券',
      company_tier: 't1_head',
      city_focus: ['北京', '上海', '深圳', '广州', '杭州'],
      business_focus: ['投行', '研究', '交易', '财富管理'],
      source_url: 'https://www.cs.ecitic.com',
      source_name: '中信证券官网',
    },
    entry: {
      学历偏好: '本科及以上，研究/投行岗位硕士及以上更常见',
      专业限制: '金融/经济/数学/统计/计算机优先',
      转专业友好度_1to5: 2,
      证书要求: '证券从业等证书加分明显',
      英语要求: '中等以上',
      无实习可投比例估计: '0.1-0.2',
    },
    work: {
      加班强度_1to5: 5,
      出差或驻场强度_1to5: 3,
      轮班要求: '交易相关岗位可能早晚班',
      绩效压力_1to5: 5,
      淘汰风险_1to5: 4,
    },
    scores: {
      薪资潜力_1to5: 5,
      上岸难度_1to5: 5,
      工作强度_1to5: 5,
      稳定性_1to5: 3,
      成长性_1to5: 4,
      置信度: 0.66,
    },
    decision: {
      推荐人群: ['数据与商业分析能力强', '能承受高强度和业绩导向文化'],
      不推荐人群: ['偏好低压力与稳定作息'],
      替代行业: ['咨询与专业服务', '金融-银行'],
      转岗路径: ['研究->买方', '投行->战投/企业战略'],
    },
  },
  '金融-保险': {
    industry_id: 'IND_FIN_INSURANCE',
    slug: 'finance-insurance',
    company_seed: {
      company_id: 'COMP_PINGAN',
      company_name: '中国平安',
      company_tier: 't1_head',
      city_focus: ['深圳', '上海', '北京', '广州', '成都'],
      business_focus: ['寿险', '产险', '健康险', '保险科技'],
      source_url: 'https://campus.pingan.com',
      source_name: '平安校园招聘官网',
    },
    entry: {
      学历偏好: '本科及以上',
      专业限制: '金融/精算/数学/统计/医学相关优先',
      转专业友好度_1to5: 3,
      证书要求: '精算/保险相关证书可显著加分',
      英语要求: '基础到中等',
      无实习可投比例估计: '0.2-0.4',
    },
    work: {
      加班强度_1to5: 3,
      出差或驻场强度_1to5: 3,
      轮班要求: '核保核赔与客服部分岗位可能排班',
      绩效压力_1to5: 4,
      淘汰风险_1to5: 3,
    },
    scores: {
      薪资潜力_1to5: 4,
      上岸难度_1to5: 3,
      工作强度_1to5: 3,
      稳定性_1to5: 4,
      成长性_1to5: 3,
      置信度: 0.61,
    },
    decision: {
      推荐人群: ['对风险管理和长期业务有兴趣', '能够接受业绩与合规双重要求'],
      不推荐人群: ['对业务指标和客户经营抗拒'],
      替代行业: ['金融-银行', '咨询与专业服务'],
      转岗路径: ['核保核赔->产品精算', '渠道->运营管理'],
    },
  },
  '快消与零售': {
    industry_id: 'IND_FMCG_RETAIL',
    slug: 'fmcg-retail',
    company_seed: {
      company_id: 'COMP_PG',
      company_name: '宝洁',
      company_tier: 't1_head',
      city_focus: ['广州', '上海', '北京', '杭州'],
      business_focus: ['品牌管理', '供应链', '渠道销售'],
      source_url: 'https://www.pgcareers.com',
      source_name: '宝洁职业官网',
    },
    entry: {
      学历偏好: '本科及以上',
      专业限制: '专业限制相对宽松，商科与理工均有机会',
      转专业友好度_1to5: 4,
      英语要求: '外企岗位常需中等以上英语能力',
      无实习可投比例估计: '0.25-0.45',
    },
    work: {
      加班强度_1to5: 3,
      出差或驻场强度_1to5: 4,
      轮班要求: '门店与一线运营岗位可能排班',
      绩效压力_1to5: 4,
      淘汰风险_1to5: 3,
    },
    scores: {
      薪资潜力_1to5: 3,
      上岸难度_1to5: 4,
      工作强度_1to5: 3,
      稳定性_1to5: 3,
      成长性_1to5: 3,
      置信度: 0.6,
    },
    decision: {
      推荐人群: ['沟通与执行能力强', '愿意贴近消费者与渠道一线'],
      不推荐人群: ['不接受出差或渠道管理节奏'],
      替代行业: ['电商与跨境电商', '咨询与专业服务'],
      转岗路径: ['销售管培->品牌/市场', '供应链->运营管理'],
    },
  },
  '电商与跨境电商': {
    industry_id: 'IND_ECOMMERCE_CROSSBORDER',
    slug: 'ecommerce-crossborder',
    company_seed: {
      company_id: 'COMP_ALIBABA',
      company_name: '阿里巴巴',
      company_tier: 't1_head',
      city_focus: ['杭州', '上海', '深圳', '广州'],
      business_focus: ['平台电商', '跨境业务', '商家运营'],
      source_url: 'https://talent.alibaba.com',
      source_name: '阿里巴巴招聘官网',
    },
    entry: {
      学历偏好: '本科及以上',
      专业限制: '专业较开放，强调数据与业务敏感度',
      转专业友好度_1to5: 4,
      英语要求: '跨境岗位通常要求中等以上',
      无实习可投比例估计: '0.2-0.35',
    },
    work: {
      加班强度_1to5: 4,
      出差或驻场强度_1to5: 3,
      轮班要求: '大促及客服相关岗位可能排班',
      绩效压力_1to5: 5,
      淘汰风险_1to5: 4,
    },
    scores: {
      薪资潜力_1to5: 4,
      上岸难度_1to5: 4,
      工作强度_1to5: 4,
      稳定性_1to5: 3,
      成长性_1to5: 4,
      置信度: 0.63,
    },
    decision: {
      推荐人群: ['对数据驱动运营和业务增长有兴趣', '能适应节奏快且结果导向的环境'],
      不推荐人群: ['抗拒大促节点高压工作'],
      替代行业: ['快消与零售', '互联网与AI'],
      转岗路径: ['类目运营->商业分析/策略', '跨境运营->国际化业务'],
    },
  },
  '物流与供应链': {
    industry_id: 'IND_LOGISTICS_SUPPLYCHAIN',
    slug: 'logistics-supply-chain',
    company_seed: {
      company_id: 'COMP_SF',
      company_name: '顺丰',
      company_tier: 't1_head',
      city_focus: ['深圳', '北京', '上海', '武汉', '杭州'],
      business_focus: ['快递物流', '仓配网络', '供应链解决方案'],
      source_url: 'https://hr.sf-express.com',
      source_name: '顺丰招聘官网',
    },
    entry: {
      学历偏好: '本科及以上，运作岗位大专亦有机会',
      专业限制: '物流/工业工程/管理/数据相关优先',
      转专业友好度_1to5: 4,
      无实习可投比例估计: '0.3-0.5',
    },
    work: {
      加班强度_1to5: 3,
      出差或驻场强度_1to5: 4,
      轮班要求: '仓运与调度岗位常见排班',
      绩效压力_1to5: 4,
      淘汰风险_1to5: 3,
    },
    scores: {
      薪资潜力_1to5: 3,
      上岸难度_1to5: 3,
      工作强度_1to5: 3,
      稳定性_1to5: 4,
      成长性_1to5: 3,
      置信度: 0.6,
    },
    decision: {
      推荐人群: ['执行与协调能力强', '愿意在复杂运营系统中积累经验'],
      不推荐人群: ['对现场协同与班次敏感'],
      替代行业: ['快消与零售', '电商与跨境电商'],
      转岗路径: ['运营->计划/网络规划', '仓储->供应链产品'],
    },
  },
  '咨询与专业服务': {
    industry_id: 'IND_CONSULTING_PRO_SERVICES',
    slug: 'consulting-professional-services',
    company_seed: {
      company_id: 'COMP_PWC',
      company_name: '普华永道中国',
      company_tier: 't1_head',
      city_focus: ['上海', '北京', '深圳', '广州', '成都'],
      business_focus: ['审计', '税务', '管理咨询', '交易服务'],
      source_url: 'https://www.pwccn.com/zh/careers.html',
      source_name: '普华永道中国职业页面',
    },
    entry: {
      学历偏好: '本科及以上',
      专业限制: '会计/财务/商科优先，咨询岗看通用能力',
      转专业友好度_1to5: 4,
      证书要求: 'CPA/CFA等证书可显著加分',
      英语要求: '中等以上',
      无实习可投比例估计: '0.15-0.3',
    },
    work: {
      加班强度_1to5: 5,
      出差或驻场强度_1to5: 4,
      轮班要求: '无固定轮班，项目周期驱动',
      绩效压力_1to5: 5,
      淘汰风险_1to5: 4,
    },
    scores: {
      薪资潜力_1to5: 4,
      上岸难度_1to5: 5,
      工作强度_1to5: 5,
      稳定性_1to5: 3,
      成长性_1to5: 4,
      置信度: 0.64,
    },
    decision: {
      推荐人群: ['逻辑与表达能力强', '愿意在高强度项目中快速成长'],
      不推荐人群: ['追求稳定低波动工作节奏'],
      替代行业: ['金融-证券基金', '互联网与AI'],
      转岗路径: ['咨询->企业战略', '审计->财务管理/内控'],
    },
  },
  '房地产与基建': {
    industry_id: 'IND_REAL_ESTATE_INFRA',
    slug: 'real-estate-infrastructure',
    company_seed: {
      company_id: 'COMP_CSCEC',
      company_name: '中国建筑',
      company_tier: 'public_sector',
      city_focus: ['北京', '上海', '广州', '深圳', '成都'],
      business_focus: ['工程总包', '基建投资', '城市建设'],
      source_url: 'https://job.cscec.com',
      source_name: '中国建筑招聘官网',
    },
    entry: {
      学历偏好: '本科及以上',
      专业限制: '土木/建筑/工程管理/造价优先',
      转专业友好度_1to5: 2,
      证书要求: '建造师等证书在后续发展中重要',
      无实习可投比例估计: '0.25-0.45',
    },
    work: {
      加班强度_1to5: 4,
      出差或驻场强度_1to5: 5,
      轮班要求: '项目现场岗位按工程节点安排',
      绩效压力_1to5: 3,
      淘汰风险_1to5: 2,
    },
    scores: {
      薪资潜力_1to5: 3,
      上岸难度_1to5: 3,
      工作强度_1to5: 4,
      稳定性_1to5: 3,
      成长性_1to5: 2,
      置信度: 0.58,
    },
    decision: {
      推荐人群: ['愿意扎根工程现场并积累项目经验', '关注长期职业资格成长'],
      不推荐人群: ['不接受项目外派与现场管理'],
      替代行业: ['能源与公用事业', '高端制造与工业自动化'],
      转岗路径: ['施工管理->项目经理', '造价->成本管理'],
    },
  },
  '化工与新材料': {
    industry_id: 'IND_CHEM_NEW_MATERIALS',
    slug: 'chemicals-new-materials',
    company_seed: {
      company_id: 'COMP_WANHUA',
      company_name: '万华化学',
      company_tier: 't1_head',
      city_focus: ['烟台', '上海', '宁波', '珠海'],
      business_focus: ['聚氨酯', '新材料', '化工研发与制造'],
      source_url: 'https://www.whchem.com',
      source_name: '万华化学官网',
    },
    entry: {
      学历偏好: '本科及以上，研发岗硕士更常见',
      专业限制: '化学/化工/材料优先',
      转专业友好度_1to5: 2,
      证书要求: '安全与环保相关知识重要',
      无实习可投比例估计: '0.2-0.35',
    },
    work: {
      加班强度_1to5: 3,
      出差或驻场强度_1to5: 3,
      轮班要求: '生产岗位可能倒班',
      绩效压力_1to5: 3,
      淘汰风险_1to5: 2,
    },
    scores: {
      薪资潜力_1to5: 3,
      上岸难度_1to5: 3,
      工作强度_1to5: 3,
      稳定性_1to5: 4,
      成长性_1to5: 3,
      置信度: 0.59,
    },
    decision: {
      推荐人群: ['专业基础扎实并愿意长期工程化实践', '对材料创新和制造流程有兴趣'],
      不推荐人群: ['对生产现场或安全合规要求不适应'],
      替代行业: ['新能源', '生物医药与器械'],
      转岗路径: ['工艺->研发管理', '生产->EHS/运营管理'],
    },
  },
  '能源与公用事业': {
    industry_id: 'IND_ENERGY_UTILITIES',
    slug: 'energy-utilities',
    company_seed: {
      company_id: 'COMP_SGCC',
      company_name: '国家电网',
      company_tier: 'public_sector',
      city_focus: ['北京', '上海', '江苏', '浙江', '山东'],
      business_focus: ['电网运行', '电力调度', '数字化电力'],
      source_url: 'https://zhaopin.sgcc.com.cn',
      source_name: '国家电网招聘平台',
    },
    entry: {
      学历偏好: '本科及以上',
      专业限制: '电气/能源/自动化/信息类优先',
      转专业友好度_1to5: 2,
      证书要求: '电力相关资格证后续重要',
      无实习可投比例估计: '0.25-0.45',
    },
    work: {
      加班强度_1to5: 3,
      出差或驻场强度_1to5: 3,
      轮班要求: '调度运维岗位可能轮班',
      绩效压力_1to5: 3,
      淘汰风险_1to5: 2,
    },
    scores: {
      薪资潜力_1to5: 3,
      上岸难度_1to5: 4,
      工作强度_1to5: 3,
      稳定性_1to5: 5,
      成长性_1to5: 3,
      置信度: 0.63,
    },
    decision: {
      推荐人群: ['重视稳定性与长期职业路径', '愿意在基础设施体系持续深耕'],
      不推荐人群: ['期待短期高波动收益与频繁跳槽'],
      替代行业: ['通信与运营商', '公共部门-央国企'],
      转岗路径: ['运维->调度/规划', '电力数据->能源数字化'],
    },
  },
  '传媒游戏与内容': {
    industry_id: 'IND_MEDIA_GAME_CONTENT',
    slug: 'media-game-content',
    company_seed: {
      company_id: 'COMP_NETEASE',
      company_name: '网易',
      company_tier: 't1_head',
      city_focus: ['杭州', '广州', '上海', '北京'],
      business_focus: ['游戏研发', '内容平台', '数字文娱'],
      source_url: 'https://campus.163.com',
      source_name: '网易校园招聘官网',
    },
    entry: {
      学历偏好: '本科及以上',
      专业限制: '内容/设计/计算机/传媒等相关优先',
      转专业友好度_1to5: 4,
      无实习可投比例估计: '0.15-0.3',
    },
    work: {
      加班强度_1to5: 4,
      出差或驻场强度_1to5: 2,
      轮班要求: '内容运营岗位可能排班',
      绩效压力_1to5: 4,
      淘汰风险_1to5: 4,
    },
    scores: {
      薪资潜力_1to5: 4,
      上岸难度_1to5: 4,
      工作强度_1to5: 4,
      稳定性_1to5: 2,
      成长性_1to5: 4,
      置信度: 0.61,
    },
    decision: {
      推荐人群: ['对内容创作或游戏产品有强兴趣', '可接受项目制节奏与热点波动'],
      不推荐人群: ['对内容行业不确定性敏感'],
      替代行业: ['互联网与AI', '快消与零售'],
      转岗路径: ['内容运营->产品运营', '游戏策划->产品经理'],
    },
  },
  '教育与职教': {
    industry_id: 'IND_EDU_VOCATIONAL',
    slug: 'education-vocational',
    company_seed: {
      company_id: 'COMP_NEW_ORIENTAL',
      company_name: '新东方',
      company_tier: 't2_strong',
      city_focus: ['北京', '上海', '广州', '深圳', '杭州'],
      business_focus: ['职业教育', '课程研发', '学习服务'],
      source_url: 'https://zhaopin.xdf.cn',
      source_name: '新东方招聘官网',
    },
    entry: {
      学历偏好: '本科及以上',
      专业限制: '专业相对开放，教研岗看学科背景',
      转专业友好度_1to5: 4,
      证书要求: '教师资格证在部分岗位重要',
      英语要求: '按学科岗位差异化',
      无实习可投比例估计: '0.3-0.5',
    },
    work: {
      加班强度_1to5: 3,
      出差或驻场强度_1to5: 2,
      轮班要求: '教学服务岗位可能按课表排班',
      绩效压力_1to5: 3,
      淘汰风险_1to5: 3,
    },
    scores: {
      薪资潜力_1to5: 3,
      上岸难度_1to5: 3,
      工作强度_1to5: 3,
      稳定性_1to5: 3,
      成长性_1to5: 3,
      置信度: 0.57,
    },
    decision: {
      推荐人群: ['表达与同理心较强', '愿意在教学与运营双线成长'],
      不推荐人群: ['对教学交付节奏缺乏耐受'],
      替代行业: ['咨询与专业服务', '传媒游戏与内容'],
      转岗路径: ['教研->课程产品', '学习顾问->运营管理'],
    },
  },
  '公务员体系': {
    industry_id: 'IND_CIVIL_SERVICE',
    slug: 'civil-service',
    company_seed: {
      company_id: 'COMP_SCS',
      company_name: '国家公务员局（招录体系）',
      company_tier: 'public_sector',
      city_focus: ['北京', '上海', '广州', '深圳', '南京'],
      business_focus: ['中央机关招录', '地方公务员招录', '政策岗位信息发布'],
      source_url: 'https://www.scs.gov.cn',
      source_name: '国家公务员局官网',
    },
    entry: {
      学历偏好: '本科及以上（按职位表要求）',
      专业限制: '按职位表执行，部分岗位不限专业',
      转专业友好度_1to5: 3,
      证书要求: '无统一证书硬性要求，按职位条件执行',
      英语要求: '按岗位要求，外事类岗位更高',
      无实习可投比例估计: '0.5-0.7',
      实习要求: '非硬性，但基层实践经历可加分',
    },
    work: {
      加班强度_1to5: 3,
      出差或驻场强度_1to5: 2,
      轮班要求: '常规无轮班，执法类按系统安排',
      绩效压力_1to5: 3,
      淘汰风险_1to5: 1,
    },
    scores: {
      薪资潜力_1to5: 3,
      上岸难度_1to5: 5,
      工作强度_1to5: 3,
      稳定性_1to5: 5,
      成长性_1to5: 3,
      置信度: 0.67,
    },
    decision: {
      推荐人群: ['重视长期稳定与公共治理价值', '具备较强应试与文字表达能力'],
      不推荐人群: ['不愿接受程序化选拔和较长周期等待'],
      替代行业: ['事业单位体系', '央国企体系'],
      转岗路径: ['基层岗位->综合管理', '专业岗->条线业务骨干'],
    },
  },
  '事业单位体系': {
    industry_id: 'IND_PUBLIC_INSTITUTION',
    slug: 'public-institution',
    company_seed: {
      company_id: 'COMP_MOHRSS',
      company_name: '各地事业单位招聘系统（汇总）',
      company_tier: 'public_sector',
      city_focus: ['北京', '上海', '广州', '深圳', '武汉'],
      business_focus: ['医疗教育科研与公共服务岗位发布'],
      source_url: 'https://www.mohrss.gov.cn',
      source_name: '人社部官网',
    },
    entry: {
      学历偏好: '本科及以上（医疗/科研类岗位硕士及以上更常见）',
      专业限制: '按单位公告执行，专业匹配要求较强',
      转专业友好度_1to5: 2,
      证书要求: '教师/医师等岗位有明确资格要求',
      英语要求: '按岗位差异化',
      无实习可投比例估计: '0.4-0.6',
      实习要求: '非硬性但相关实践经历明显加分',
    },
    work: {
      加班强度_1to5: 2,
      出差或驻场强度_1to5: 1,
      轮班要求: '医疗等特定岗位存在轮班',
      绩效压力_1to5: 2,
      淘汰风险_1to5: 1,
    },
    scores: {
      薪资潜力_1to5: 2,
      上岸难度_1to5: 4,
      工作强度_1to5: 2,
      稳定性_1to5: 5,
      成长性_1to5: 3,
      置信度: 0.65,
    },
    decision: {
      推荐人群: ['重视稳定和公共服务属性', '希望在专业条线长期沉淀'],
      不推荐人群: ['追求高薪弹性与快速行业切换'],
      替代行业: ['公务员体系', '央国企体系'],
      转岗路径: ['专技岗->科室骨干', '行政岗->综合管理'],
    },
  },
  '央国企体系': {
    industry_id: 'IND_STATE_OWNED_ENTERPRISE',
    slug: 'state-owned-enterprise',
    company_seed: {
      company_id: 'COMP_SASAC',
      company_name: '央企与地方国企（以国资委监管体系为主）',
      company_tier: 'public_sector',
      city_focus: ['北京', '上海', '深圳', '广州', '成都'],
      business_focus: ['能源', '基建', '制造', '金融与服务'],
      source_url: 'https://www.sasac.gov.cn',
      source_name: '国务院国资委官网',
    },
    entry: {
      学历偏好: '本科及以上',
      专业限制: '按企业和岗位要求执行，工科与管理类需求较多',
      转专业友好度_1to5: 3,
      证书要求: '按岗位要求，财务/工程类证书可加分',
      英语要求: '涉海外业务岗位要求较高',
      无实习可投比例估计: '0.3-0.5',
      实习要求: '建议有相关项目或实习经历',
    },
    work: {
      加班强度_1to5: 3,
      出差或驻场强度_1to5: 3,
      轮班要求: '生产与运维岗位可能轮班',
      绩效压力_1to5: 3,
      淘汰风险_1to5: 2,
    },
    scores: {
      薪资潜力_1to5: 3,
      上岸难度_1to5: 4,
      工作强度_1to5: 3,
      稳定性_1to5: 4,
      成长性_1to5: 3,
      置信度: 0.64,
    },
    decision: {
      推荐人群: ['希望兼顾稳定性与产业规模平台', '可接受制度化流程管理'],
      不推荐人群: ['希望极快晋升和高波动激励机制'],
      替代行业: ['能源与公用事业', '房地产与基建'],
      转岗路径: ['工程/职能岗->条线管理', '信息化岗->数字化管理'],
    },
  },
  '农业与食品': {
    industry_id: 'IND_AGRI_FOOD',
    slug: 'agriculture-food',
    company_seed: {
      company_id: 'COMP_YILI',
      company_name: '伊利',
      company_tier: 't1_head',
      city_focus: ['呼和浩特', '北京', '上海', '广州'],
      business_focus: ['乳品研发', '供应链', '品牌运营'],
      source_url: 'https://job.yili.com',
      source_name: '伊利招聘官网',
    },
    entry: {
      学历偏好: '本科及以上',
      专业限制: '食品科学/农学/生物/质量管理优先',
      转专业友好度_1to5: 3,
      证书要求: '质量体系相关知识可加分',
      无实习可投比例估计: '0.25-0.45',
    },
    work: {
      加班强度_1to5: 3,
      出差或驻场强度_1to5: 3,
      轮班要求: '生产和质检岗位可能排班',
      绩效压力_1to5: 3,
      淘汰风险_1to5: 2,
    },
    scores: {
      薪资潜力_1to5: 3,
      上岸难度_1to5: 3,
      工作强度_1to5: 3,
      稳定性_1to5: 4,
      成长性_1to5: 3,
      置信度: 0.58,
    },
    decision: {
      推荐人群: ['愿意在民生刚需行业长期发展', '关注质量与供应链协同'],
      不推荐人群: ['无法接受生产端流程规范与现场要求'],
      替代行业: ['快消与零售', '物流与供应链'],
      转岗路径: ['质控->质量体系', '研发->产品管理'],
    },
  },
};

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function merge(base, extra) {
  return Object.assign({}, base, extra || {});
}

function monthsInRange(start, end) {
  const a = Math.min(start, end);
  const b = Math.max(start, end);
  const out = [];
  for (let i = a; i <= b; i += 1) {
    if (i >= 1 && i <= 12) out.push(i);
  }
  return out;
}

function parseMonthsFromText(text) {
  if (!text || typeof text !== 'string') return [];
  const months = new Set();
  const rangeRegex = /([0-1]?\d)\s*[-~至]\s*([0-1]?\d)\s*月?/g;
  const singleRegex = /([0-1]?\d)\s*月/g;

  let match;
  while ((match = rangeRegex.exec(text)) !== null) {
    const start = Number(match[1]);
    const end = Number(match[2]);
    monthsInRange(start, end).forEach((m) => months.add(m));
  }
  while ((match = singleRegex.exec(text)) !== null) {
    const m = Number(match[1]);
    if (m >= 1 && m <= 12) months.add(m);
  }

  if (/春招/.test(text)) {
    [2, 3, 4].forEach((m) => months.add(m));
  }
  if (/秋招/.test(text)) {
    [8, 9, 10, 11].forEach((m) => months.add(m));
  }

  return Array.from(months).sort((a, b) => a - b);
}

function inferPeakMonths(peakTexts) {
  const merged = new Set();
  (peakTexts || []).forEach((txt) => {
    parseMonthsFromText(txt).forEach((m) => merged.add(m));
  });
  return Array.from(merged).sort((a, b) => a - b);
}

function buildTimelineStages(peakTexts, peakMonths) {
  const texts = peakTexts || [];
  const hasSpring = texts.some((x) => /春招|2-4月/.test(x));
  const hasAutumn = texts.some((x) => /秋招|8-11月|9-11月/.test(x));
  const firstHalfMonths = peakMonths.filter((m) => m >= 1 && m <= 6);
  const secondHalfMonths = peakMonths.filter((m) => m >= 7 && m <= 12);

  const springMonths = peakMonths.filter((m) => m >= 2 && m <= 4);
  const autumnMonths = peakMonths.filter((m) => m >= 8 && m <= 11);
  const stages = [];

  if (hasAutumn || secondHalfMonths.length > 0) {
    stages.push({
      stage: hasAutumn ? '秋招主周期' : '下半年集中窗口',
      start_month: hasAutumn && autumnMonths.length
        ? Math.min(...autumnMonths)
        : Math.min(...secondHalfMonths),
      end_month: hasAutumn && autumnMonths.length
        ? Math.max(...autumnMonths)
        : Math.max(...secondHalfMonths),
      notes: '以网申、测评、笔试/面试为主。',
    });
  }

  if (hasSpring || firstHalfMonths.length > 0) {
    stages.push({
      stage: hasSpring ? '春招补录周期' : '上半年集中窗口',
      start_month: hasSpring && springMonths.length
        ? Math.min(...springMonths)
        : Math.min(...firstHalfMonths),
      end_month: hasSpring && springMonths.length
        ? Math.max(...springMonths)
        : Math.max(...firstHalfMonths),
      notes: '以补录和新增需求岗位为主。',
    });
  }

  if (stages.length === 0) {
    stages.push({
      stage: '年度公告制',
      start_month: null,
      end_month: null,
      notes: '按系统或单位公告执行。',
    });
  }

  return stages;
}

function buildPrepPlan(oldPrep) {
  const list = [];
  const source = oldPrep || {};
  Object.keys(source).forEach((key) => {
    const value = Array.isArray(source[key]) ? source[key] : [];
    const hit = key.match(/\d+/);
    if (hit) {
      list.push({ days_from_start: Number(hit[0]), focus: value });
    } else {
      list.push({ days_from_start: null, label: key, focus: value });
    }
  });
  list.sort((a, b) => {
    const av = a.days_from_start === null ? 9999 : a.days_from_start;
    const bv = b.days_from_start === null ? 9999 : b.days_from_start;
    return av - bv;
  });
  return list;
}

function buildRoleProfiles(industryId, oldEntry, config, processSteps) {
  const roles = (oldEntry['应届生主流岗位'] || []).filter(Boolean);
  const hardSkills = ((oldEntry['能力模型'] || {})['专业能力'] || []).slice(0, 4);
  const softSkills = ((oldEntry['能力模型'] || {})['通用能力'] || []).slice(0, 4);

  return roles.map((roleName, index) => {
    const roleId = `${industryId}_ROLE_${String(index + 1).padStart(3, '0')}`;
    return {
      role_id: roleId,
      role_name: roleName,
      degree_preference: config.entry['学历偏好'],
      major_restriction: config.entry['专业限制'],
      hard_skills: hardSkills,
      soft_skills: softSkills,
      written_and_interview_formats: processSteps,
      internship_requirement: config.entry['实习要求'],
      english_requirement: config.entry['英语要求'],
      certificate_requirement: config.entry['证书要求'],
      no_internship_apply_ratio_estimate: config.entry['无实习可投比例估计'],
      resume_evidence_mapping: hardSkills.map((skill) => ({
        capability: skill,
        evidence_hint: `用STAR说明你在项目中如何应用“${skill}”，并给出可量化结果。`,
      })),
      updated_at: TODAY,
      evidence: {
        source_id: 'SRC_EDITORIAL',
        source_name: '行业百科编委会',
        source_url: null,
        source_type: 'editorial',
        source_date: TODAY,
        sample_size: null,
        stat_definition: '由原词条能力模型和校招流程结构化生成',
        confidence: 0.75,
      },
    };
  });
}

function buildCollection(dataStatus, coveragePercent, items, notes) {
  return {
    data_status: dataStatus,
    coverage_percent: coveragePercent,
    updated_at: TODAY,
    notes,
    items,
  };
}

function buildSalaryCollection() {
  return {
    data_status: 'not_collected',
    coverage_percent: 0,
    updated_at: null,
    notes: '已升级为量化结构，待补充城市x公司层级x岗位分位数据。',
    collection_tasks: [
      {
        task_id: 'SALARY_TASK_2026Q1',
        task_name: '完成2026Q1分位薪酬首轮采集',
        task_scope: '核心城市x公司层级x岗位',
        required_fields: [
          'city_id',
          'company_tier',
          'role_id',
          'p25_monthly_total_annualized_k_cny',
          'p50_monthly_total_annualized_k_cny',
          'p75_monthly_total_annualized_k_cny',
          'source_url',
          'source_date',
          'stat_definition',
          'sample_size',
          'confidence',
        ],
        status: 'todo',
      },
    ],
    schema_hint: {
      city_id: 'CN-BJ',
      company_tier: 't1_head/t2_strong/t3_regional/public_sector',
      role_id: 'IND_xxx_ROLE_001',
      p25_monthly_total_annualized_k_cny: 0,
      p50_monthly_total_annualized_k_cny: 0,
      p75_monthly_total_annualized_k_cny: 0,
      fixed_ratio: 0,
      performance_ratio: 0,
      year_end_ratio: 0,
      equity_ratio: 0,
      source_url: null,
      source_date: null,
      stat_definition: '明确样本口径',
      sample_size: null,
      confidence: 0,
      updated_at: null,
    },
    items: [],
  };
}

function toSourceRecords(referenceTags, companySeed) {
  const records = [
    {
      source_id: 'SRC_EDITORIAL',
      source_name: '行业百科编委会',
      source_type: 'editorial',
      source_url: null,
      source_date: '2026-02-15',
      confidence: 0.8,
      usage: '静态行业认知初稿与词条结构化基础',
    },
  ];

  if (companySeed && companySeed.source_url) {
    records.push({
      source_id: null,
      source_name: companySeed.source_name,
      source_type: 'company_official',
      source_url: companySeed.source_url,
      source_date: TODAY,
      confidence: 0.78,
      usage: '公司清单首批锚点数据',
    });
  }

  (referenceTags || []).forEach((tag) => {
    let sourceId = null;
    if (/工信/.test(tag)) sourceId = 'SRC_MIIT';
    if (/人社/.test(tag) || /就业/.test(tag)) sourceId = 'SRC_MOHRSS';
    if (/校招/.test(tag) || /大学生/.test(tag)) sourceId = 'SRC_NCSS';
    if (/研究报告/.test(tag)) sourceId = 'SRC_ZHILIAN';
    records.push({
      source_id: sourceId,
      source_name: tag,
      source_type: sourceId ? 'registry_mapped' : 'topic_tag',
      source_url: null,
      source_date: '2026-02-15',
      confidence: 0.55,
      usage: '原词条参考方向标签',
    });
  });

  return records;
}

function normalizeLegacyCollection(v) {
  if (Array.isArray(v)) {
    return buildCollection(v.length > 0 ? 'in_progress' : 'not_collected', v.length > 0 ? 20 : 0, v, v.length > 0 ? '历史数据待补充证据字段后转为verified。' : '待采集。');
  }
  if (v && typeof v === 'object') {
    const keys = Object.keys(v);
    return {
      data_status: keys.length > 0 ? 'in_progress' : 'not_collected',
      coverage_percent: keys.length > 0 ? 20 : 0,
      updated_at: keys.length > 0 ? TODAY : null,
      notes: keys.length > 0 ? '历史扩展字段已保留，待命名空间化整理。' : '待采集。',
      payload: v,
    };
  }
  return buildCollection('not_collected', 0, [], '待采集。');
}

function deriveConfig(name) {
  const override = INDUSTRY_OVERRIDES[name] || {};
  return {
    industry_id: override.industry_id || `IND_${name}`,
    slug: override.slug || name,
    company_seed: override.company_seed || null,
    entry: merge(DEFAULT_ENTRY_REQUIREMENTS, override.entry),
    work: merge(DEFAULT_WORK_STYLE, override.work),
    scores: merge(DEFAULT_SCORES, override.scores),
    decision: merge(DEFAULT_DECISION, override.decision),
  };
}

function buildCompanySeedCollection(industryId, config) {
  if (!config.company_seed) {
    return buildCollection('not_collected', 0, [], '待补充行业代表公司及校招入口。');
  }

  return buildCollection('in_progress', 12, [
    {
      company_id: config.company_seed.company_id,
      company_name: config.company_seed.company_name,
      company_tier: config.company_seed.company_tier,
      city_focus: config.company_seed.city_focus,
      business_focus: config.company_seed.business_focus,
      campus_hiring_signal: '存在官方招聘/招聘信息入口，需继续补充年度批次信息。',
      updated_at: TODAY,
      evidence: {
        source_id: null,
        source_name: config.company_seed.source_name,
        source_url: config.company_seed.source_url,
        source_type: 'company_official',
        source_date: TODAY,
        sample_size: null,
        stat_definition: '官网入口可访问性与公开职位信息',
        confidence: 0.78,
      },
    },
  ], `首批仅包含1个锚点公司（${industryId}），后续建议扩展至每行业20+公司。`);
}

function buildTimelineCollection(industryId, recruitInfo, peakTexts, peakMonths) {
  const stages = buildTimelineStages(peakTexts, peakMonths);
  return buildCollection('in_progress', 35, [
    {
      timeline_id: `${industryId}_TIMELINE_2026`,
      year: 2026,
      stages,
      notes: '由v1.1高峰期文本标准化生成，后续需补充分企业公告节点。',
      updated_at: TODAY,
      evidence: {
        source_id: 'SRC_EDITORIAL',
        source_name: '行业百科编委会',
        source_url: null,
        source_type: 'editorial',
        source_date: TODAY,
        sample_size: null,
        stat_definition: '基于历史词条高峰期文本归一化',
        confidence: 0.72,
      },
    },
  ], '当前为行业级时间窗口，缺企业级精确节点。');
}

function buildProgress(dynamicData) {
  const keys = Object.keys(dynamicData);
  let todo = 0;
  let inProgress = 0;
  let verified = 0;
  let confirmedEmpty = 0;
  let sumCoverage = 0;

  keys.forEach((key) => {
    const v = dynamicData[key];
    if (!v || typeof v !== 'object' || !('data_status' in v)) return;
    sumCoverage += Number(v.coverage_percent || 0);
    if (v.data_status === 'not_collected') todo += 1;
    if (v.data_status === 'in_progress') inProgress += 1;
    if (v.data_status === 'verified') verified += 1;
    if (v.data_status === 'confirmed_empty') confirmedEmpty += 1;
  });

  const tracked = todo + inProgress + verified + confirmedEmpty;
  return {
    todo_collections: todo,
    in_progress_collections: inProgress,
    verified_collections: verified,
    confirmed_empty_collections: confirmedEmpty,
    tracked_collections: tracked,
    coverage_percent_overall: tracked ? Number((sumCoverage / tracked).toFixed(1)) : 0,
    updated_at: TODAY,
  };
}

function createSplitPublicEntries(original) {
  const base = original['完整版词条'];
  const commonSupplement = original['后续补充预留'] || {};

  const civil = {
    ...clone(original),
    行业名称: '公务员体系',
    完整版词条: {
      ...clone(base),
      定义: '围绕党政机关招录体系形成的公共治理职业通道。',
      边界: {
        包含: ['中央机关公务员', '地方公务员', '选调与定向招录（按政策）'],
        不包含: ['事业单位与企业化用工岗位'],
      },
      核心赛道: ['综合管理', '专业技术岗（按系统）', '基层治理'],
      校招流程: {
        高峰期: ['国考及省考按年度公告', '集中窗口通常在10-12月与次年2-4月补充'],
        常见环节: ['笔试', '面试', '体检', '考察/政审', '公示录用'],
        筛选偏好: ['政策理解', '文字表达', '稳定性与岗位匹配'],
      },
      应届生主流岗位: ['综合管理岗', '执法类岗', '专业技术岗', '基层治理岗'],
      参考方向: ['国家公务员局', '各省市人事考试网', '人社系统公告'],
    },
    后续补充预留: clone(commonSupplement),
  };

  const publicInstitution = {
    ...clone(original),
    行业名称: '事业单位体系',
    完整版词条: {
      ...clone(base),
      定义: '围绕教育、医疗、科研、文化等公益服务机构形成的编制或合同制招聘体系。',
      边界: {
        包含: ['公立医院', '公办高校与中小学', '科研院所', '公共文化机构'],
        不包含: ['行政机关公务员岗位', '纯市场化企业岗位'],
      },
      核心赛道: ['医疗与医技', '教育与教辅', '科研技术支持', '综合职能管理'],
      校招流程: {
        高峰期: ['按地区与单位公告，常见窗口在3-6月与9-11月'],
        常见环节: ['公告与报名', '笔试（部分）', '结构化/专业面试', '体检与考察'],
        筛选偏好: ['专业匹配度', '服务意识', '长期稳定性'],
      },
      应届生主流岗位: ['教师岗', '医技岗', '科研助理岗', '行政职能岗'],
      参考方向: ['各地人社局与事业单位公开招聘公告', '单位官网'],
    },
    后续补充预留: clone(commonSupplement),
  };

  const soe = {
    ...clone(original),
    行业名称: '央国企体系',
    完整版词条: {
      ...clone(base),
      定义: '围绕中央企业与地方国有企业形成的市场化运营与公共职能并重的就业体系。',
      边界: {
        包含: ['中央企业总部与子公司', '地方国企集团', '国有控股上市公司'],
        不包含: ['行政机关公务员岗位'],
      },
      核心赛道: ['工程建设与制造', '能源与公用事业', '金融与投资管理', '数字化与信息化'],
      校招流程: {
        高峰期: ['9-11月秋招主周期', '2-4月春招补录'],
        常见环节: ['网申', '笔试/测评', '业务面试', '体检与背调（按要求）'],
        筛选偏好: ['岗位匹配', '稳定性', '执行力', '合规意识'],
      },
      应届生主流岗位: ['综合管理岗', '工程技术岗', '财务审计岗', '信息化岗', '运营管理岗'],
      参考方向: ['国务院国资委与企业校招官网', '企业年报与公告'],
    },
    后续补充预留: clone(commonSupplement),
  };

  return [civil, publicInstitution, soe];
}

function transformEntry(oldEntry) {
  const name = oldEntry['行业名称'];
  const oldContent = oldEntry['完整版词条'] || {};
  const oldRecruit = oldContent['校招流程'] || {};
  const peakTexts = oldRecruit['高峰期'] || [];
  const peakMonths = inferPeakMonths(peakTexts);

  const config = deriveConfig(name);
  const processSteps = oldRecruit['常见环节'] || [];
  const roleProfiles = buildRoleProfiles(config.industry_id, oldContent, config, processSteps);

  const staticSection = {
    基础认知: {
      定义: oldContent['定义'] || '',
      边界: oldContent['边界'] || { 包含: [], 不包含: [] },
      核心赛道: oldContent['核心赛道'] || [],
      产业链: oldContent['产业链'] || { 上游: [], 中游: [], 下游: [] },
      商业模式: oldContent['商业模式'] || [],
      核心指标: oldContent['核心指标'] || [],
      政策与监管关注: oldContent['政策与监管关注'] || [],
      景气驱动因素: oldContent['景气驱动因素'] || [],
      主要风险: oldContent['主要风险'] || [],
    },
    就业画像: {
      应届生主流岗位: oldContent['应届生主流岗位'] || [],
      能力模型: oldContent['能力模型'] || { 专业能力: [], 通用能力: [], 加分项: [] },
      准入门槛: config.entry,
      工作方式与强度: config.work,
    },
    招聘与成长: {
      校招流程: {
        peak_period_text: peakTexts,
        peak_months: peakMonths,
        process_steps: processSteps,
        selection_preferences: oldRecruit['筛选偏好'] || [],
      },
      城市格局: oldContent['城市格局'] || { 核心城市: [], 机会增长城市: [], 选城建议: [] },
      薪酬结构说明: oldContent['薪酬结构'] || { 常见构成: [], 影响因素: [] },
      职业路径: oldContent['职业路径'] || {},
      备战计划: buildPrepPlan(oldContent['备战要点'] || {}),
      常见误区: oldContent['常见误区'] || [],
    },
    决策输出: config.decision,
    横向比较评分: config.scores,
    参考方向标签: oldContent['参考方向'] || [],
  };

  const legacySupplement = oldEntry['后续补充预留'] || {};

  const dynamicSection = {
    公司清单: buildCompanySeedCollection(config.industry_id, config),
    岗位画像库: buildCollection(
      roleProfiles.length ? 'in_progress' : 'not_collected',
      roleProfiles.length ? 45 : 0,
      roleProfiles,
      roleProfiles.length ? '已生成岗位模板，待补充企业级JD样本与题库链接。' : '待采集岗位画像。',
    ),
    年度校招时间线: buildTimelineCollection(config.industry_id, oldRecruit, peakTexts, peakMonths),
    薪酬快照_按城市_按公司层级_按岗位: buildSalaryCollection(),
    笔试真题库: normalizeLegacyCollection(legacySupplement['笔试真题库']),
    面试真题库: normalizeLegacyCollection(legacySupplement['面试真题库']),
    政策变化日志: normalizeLegacyCollection(legacySupplement['政策变化日志']),
    行业事件日志: normalizeLegacyCollection(legacySupplement['行业事件日志']),
    从业者访谈: normalizeLegacyCollection(legacySupplement['从业者访谈']),
    案例复盘: normalizeLegacyCollection(legacySupplement['案例复盘']),
    争议问题与结论: normalizeLegacyCollection(legacySupplement['争议问题与结论']),
    外部链接: normalizeLegacyCollection(legacySupplement['外部链接']),
    自定义扩展: normalizeLegacyCollection(legacySupplement['自定义扩展']),
  };

  const progress = buildProgress(dynamicSection);

  return {
    industry_id: config.industry_id,
    slug: config.slug,
    行业名称: name,
    meta: {
      content_version: '1.2.0',
      data_version: '2026Q1',
      status: 'reviewed',
      owner: 'industry-encyclopedia-editorial',
      reviewer: 'industry-encyclopedia-reviewer',
      last_updated: TODAY,
      next_review_at: NEXT_REVIEW,
      data_cycle: 'quarterly',
      state_history: [
        {
          date: TODAY,
          from: 'published',
          to: 'reviewed',
          reason: '升级到v1.2结构并补齐治理字段',
        },
      ],
    },
    static: staticSection,
    dynamic: dynamicSection,
    progress,
    sources: toSourceRecords(oldContent['参考方向'] || [], config.company_seed),
  };
}

const expandedEntries = [];
raw['行业词条'].forEach((entry) => {
  if (entry['行业名称'] === '公共部门与央国企') {
    createSplitPublicEntries(entry).forEach((x) => expandedEntries.push(x));
  } else {
    expandedEntries.push(entry);
  }
});

const transformedEntries = expandedEntries.map((entry) => transformEntry(entry));

const industryIndex = transformedEntries.map((entry, idx) => ({
  order: idx + 1,
  industry_id: entry.industry_id,
  slug: entry.slug,
  行业名称: entry['行业名称'],
  status: entry.meta.status,
}));

const citySet = new Set();
transformedEntries.forEach((entry) => {
  const cityLayout = (((entry.static || {})['招聘与成长'] || {})['城市格局'] || {});
  const core = cityLayout['核心城市'] || [];
  const growth = cityLayout['机会增长城市'] || [];
  core.concat(growth).forEach((city) => {
    if (city) citySet.add(city);
  });
});

const cityDictionary = Array.from(citySet).sort((a, b) => a.localeCompare(b, 'zh-Hans-CN')).map((city, idx) => ({
  city_id: `CITY_${String(idx + 1).padStart(3, '0')}`,
  city_name: city,
}));

const cityIdByName = cityDictionary.reduce((acc, item) => {
  acc[item.city_name] = item.city_id;
  return acc;
}, {});

transformedEntries.forEach((entry) => {
  const cityLayout = (((entry.static || {})['招聘与成长'] || {})['城市格局'] || {});
  const coreCities = cityLayout['核心城市'] || [];
  const growthCities = cityLayout['机会增长城市'] || [];
  cityLayout['核心城市_ids'] = coreCities.map((name) => cityIdByName[name]).filter(Boolean);
  cityLayout['机会增长城市_ids'] = growthCities.map((name) => cityIdByName[name]).filter(Boolean);

  const companyItems = ((((entry.dynamic || {})['公司清单'] || {})['items']) || []);
  companyItems.forEach((item) => {
    const cityFocus = item.city_focus || [];
    item.city_ids = cityFocus.map((name) => cityIdByName[name]).filter(Boolean);
  });
});

const output = {
  文档元数据: {
    文档名称: '中国大陆应届生求职行业百科（v1.2融合版）',
    版本: 'v1.2.0',
    发布日期: TODAY,
    适用人群: raw['文档元数据']['适用人群'],
    schema_ref: './行业百科.schema.json',
    说明: [
      '本版本已完成static/dynamic分层，动态数据采用词条级治理。',
      '“公共部门与央国企”已拆分为“公务员体系/事业单位体系/央国企体系”。',
      '薪酬快照已升级为量化模板，需按季度补充分位值与证据字段。',
      '所有动态集合均新增data_status与coverage_percent，区分未采集与已核验状态。',
    ],
    变更记录: [
      {
        version: 'v1.2.0',
        date: TODAY,
        summary: [
          '新增词条级版本治理与审核信息',
          '新增准入门槛、工作方式强度、横向比较评分、决策输出',
          '新增来源注册表、ID体系、JSON Schema对齐字段',
          '新增岗位画像模板与校招时间线标准化字段',
        ],
      },
    ],
  },
  治理配置: {
    发布状态枚举: ['draft', 'reviewed', 'published', 'deprecated'],
    数据状态枚举: ['not_collected', 'in_progress', 'verified', 'confirmed_empty'],
    数据更新周期: 'quarterly',
    审核要求: '动态字段入库需包含source_url/source_date/confidence/stat_definition，缺失则不得标记为verified。',
  },
  枚举字典: {
    公司层级: ['t1_head', 't2_strong', 't3_regional', 'public_sector'],
    评分范围: '1-5',
    置信度范围: '0-1',
    关键城市: cityDictionary,
  },
  来源注册表: SOURCE_REGISTRY,
  行业索引: industryIndex,
  行业词条: transformedEntries,
};

fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
console.log(`Migrated ${transformedEntries.length} entries to ${OUTPUT_PATH}`);
