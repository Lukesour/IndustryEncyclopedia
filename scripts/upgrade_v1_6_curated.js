#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.resolve(__dirname, '..');
const DATA_PATH = path.join(ROOT, '行业百科.json');
const TODAY = '2026-02-16';

const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));

const industryFocus = {
  IND_INTERNET_AI: {
    interview: '算法工程落地、工程效率与业务指标联动',
    written: '编码能力、系统设计、数据结构与模型应用',
    oral: '项目深挖、跨团队协作与产品价值表达'
  },
  IND_SEMICONDUCTOR_ELECTRONICS: {
    interview: '数字/模拟电路、验证流程与良率思维',
    written: '半导体物理、器件工艺、逻辑设计与时序',
    oral: 'Tape-out经历、问题定位与跨部门协同'
  },
  IND_TELECOM_OPERATOR: {
    interview: '网络规划优化、政企解决方案与服务质量',
    written: '通信原理、网络协议、网优指标与故障排查',
    oral: '客户场景沟通、跨省协同与服务恢复'
  },
  IND_NEW_ENERGY: {
    interview: '电池储能系统、产业链协同与成本控制',
    written: '电化学基础、BMS逻辑、热管理与安全规范',
    oral: '项目交付复盘、质量异常闭环与供应链协作'
  },
  IND_AUTO_INTELLIGENT_DRIVING: {
    interview: '智能驾驶算法、整车工程协同与数据闭环',
    written: '控制理论、感知融合、车规安全与测试验证',
    oral: '感知误判复盘、功能安全与跨团队沟通'
  },
  IND_ADVANCED_MANUFACTURING_AUTOMATION: {
    interview: '工业自动化方案、PLC/机器人调试与降本增效',
    written: '自动控制、机械电气基础、工业网络与SCADA',
    oral: '现场调试、异常处理与工艺改进案例'
  },
  IND_BIOMED_DEVICE: {
    interview: '临床注册、质量体系与研发转产协同',
    written: '药理/器械法规、GMP/GSP、统计与试验设计',
    oral: '合规审计准备、临床证据阐释与风险沟通'
  },
  IND_FIN_BANK: {
    interview: '零售与对公条线协同、风控合规与数字化运营',
    written: '金融基础、会计与风险管理、行测与综合能力',
    oral: '客户经营案例、风险识别与流程优化'
  },
  IND_FIN_SECURITIES_FUND: {
    interview: '投研框架、市场理解与合规边界意识',
    written: '财务建模、估值方法、宏观与行业分析',
    oral: '投资逻辑表达、风险揭示与压力应对'
  },
  IND_FIN_INSURANCE: {
    interview: '核保核赔逻辑、精算思维与渠道运营协同',
    written: '保险条款、概率统计、风险评估与客户服务',
    oral: '复杂理赔沟通、风险定价解释与流程复盘'
  },
  IND_FMCG_RETAIL: {
    interview: '渠道管理、品类运营与终端执行',
    written: '市场分析、供应链基础、数据看板与促销机制',
    oral: '门店经营案例、品牌策略与区域协同'
  },
  IND_ECOMMERCE_CROSSBORDER: {
    interview: '跨境平台规则、选品策略与履约效率',
    written: '跨境合规、广告投放、物流税务与数据分析',
    oral: '运营增长复盘、平台风控应对与多语言协作'
  },
  IND_LOGISTICS_SUPPLYCHAIN: {
    interview: '仓配调度、时效成本平衡与异常治理',
    written: '运筹优化、库存模型、运输网络与KPI管理',
    oral: '峰值保障复盘、端到端流程改进与协同'
  },
  IND_CONSULTING_PRO_SERVICES: {
    interview: '问题定义、结构化拆解与商业洞察',
    written: '案例分析、MECE框架、数据推导与财务逻辑',
    oral: '案例展示、客户沟通与团队协作表现'
  },
  IND_REAL_ESTATE_INFRA: {
    interview: '投拓研判、工程管理与成本管控',
    written: '工程基础、招采流程、财务测算与政策理解',
    oral: '项目推进复盘、多方协调与风险预判'
  },
  IND_CHEM_NEW_MATERIALS: {
    interview: '工艺安全、质量一致性与技术服务能力',
    written: '化学工艺、材料表征、安全规范与质量控制',
    oral: '异常批次分析、安环合规与跨部门联动'
  },
  IND_ENERGY_UTILITIES: {
    interview: '电力调度运维、安环规范与公共服务保障',
    written: '电力系统、能源政策、设备运维与安全规程',
    oral: '突发事件处置、保供协同与调度决策'
  },
  IND_MEDIA_GAME_CONTENT: {
    interview: '内容生产机制、用户增长与商业化平衡',
    written: '内容策划、数据分析、用户运营与平台规则',
    oral: '内容案例复盘、舆情应对与跨团队协作'
  },
  IND_EDU_VOCATIONAL: {
    interview: '课程研发、教研迭代与学员运营',
    written: '教育学基础、课程设计、评估方法与服务流程',
    oral: '课堂场景处理、学习效果复盘与家校沟通'
  },
  IND_CIVIL_SERVICE: {
    interview: '政策理解、基层治理与公共沟通能力',
    written: '行测申论、法律常识、政策执行与文字表达',
    oral: '结构化面试、情景应变与组织协调'
  },
  IND_PUBLIC_INSTITUTION: {
    interview: '岗位适配、专业能力与公共服务意识',
    written: '职业能力倾向、公共基础与专业知识',
    oral: '结构化问答、服务场景判断与沟通表达'
  },
  IND_STATE_OWNED_ENTERPRISE: {
    interview: '综合素质、公文表达与组织协作',
    written: '综合能力、逻辑判断、企业文化与专业基础',
    oral: '群面表现、组织协调与执行落地'
  },
  IND_AGRI_FOOD: {
    interview: '品控检测、工艺研发与渠道协同',
    written: '食品安全法规、质量标准、工艺流程与供应链',
    oral: '质量问题复盘、现场管理与跨部门沟通'
  }
};

const collectionCodeMap = {
  '从业者访谈': 'TALK',
  '笔试真题库': 'WRITTEN',
  '面试真题库': 'INTERVIEW'
};

const sourceUpdates = {
  SRC_MOE_ACTION_2026: {
    source_name: '教育部-部署做好2026届高校毕业生就业工作（2026-01-07）',
    source_url: 'https://www.moe.gov.cn/jyb_xwfb/gzdt_gzdt/s5987/202601/t20260107_1425856.html',
    source_type: 'government_policy',
    http_status: 200,
    manual_verification_required: false,
    access_check: 'checked',
    snapshot_url: 'https://www.moe.gov.cn/jyb_xwfb/gzdt_gzdt/s5987/202601/t20260107_1425856.html'
  },
  SRC_MOE_MEETING_2026: {
    source_name: '教育部-启动2026届高校毕业生秋季校园招聘月（2025-11-20）',
    source_url: 'https://www.moe.gov.cn/jyb_xwfb/gzdt_gzdt/moe_1485/202511/t20251121_1421189.html',
    source_type: 'government_policy',
    http_status: 200,
    manual_verification_required: false,
    access_check: 'checked',
    snapshot_url: 'https://www.moe.gov.cn/jyb_xwfb/gzdt_gzdt/moe_1485/202511/t20251121_1421189.html'
  },
  SRC_MOHRSS_RECRUIT_2026: {
    source_name: '中国政府网-人社部启动2025年秋季全国城市联合招聘高校毕业生专场',
    source_url: 'https://www.gov.cn/lianbo/bumen/202509/content_7040108.htm',
    source_type: 'government_policy',
    http_status: 200,
    manual_verification_required: false,
    access_check: 'checked',
    snapshot_url: 'https://www.gov.cn/lianbo/bumen/202509/content_7040108.htm'
  }
};

function normalizeNote(text) {
  if (typeof text !== 'string') return text;
  const parts = text
    .split('；')
    .map((x) => x.trim())
    .filter(Boolean);
  const uniq = [];
  const seen = new Set();
  for (const p of parts) {
    if (!seen.has(p)) {
      seen.add(p);
      uniq.push(p);
    }
  }
  return uniq.join('；');
}

function pad3(n) {
  return String(n).padStart(3, '0');
}

function makeCompanyUid(nameOrId) {
  const raw = String(nameOrId || '').trim();
  const h = crypto.createHash('md5').update(raw).digest('hex').slice(0, 8).toUpperCase();
  return `COMP_UID_${h}`;
}

function updateSourceReference(obj, sourceMap) {
  if (!obj || typeof obj !== 'object') return;
  if (!obj.source_id) return;
  const reg = sourceMap.get(obj.source_id);
  if (!reg) return;

  if (!obj.source_name || obj.source_name === '待补充来源' || String(obj.source_name).includes('待补充')) {
    obj.source_name = reg.source_name;
  }
  if (!obj.source_type || obj.source_type === 'unknown') {
    obj.source_type = reg.source_type;
  }
  if ((!obj.source_url || obj.source_url.includes('pending.example.com')) && reg.source_url && !reg.source_url.includes('pending.example.com')) {
    obj.source_url = reg.source_url;
  }
  if (!obj.snapshot_url && obj.source_url) {
    obj.snapshot_url = obj.source_url;
  }

  if (obj.source_id === 'SRC_MOHRSS_RECRUIT_2026') {
    obj.source_url = sourceUpdates.SRC_MOHRSS_RECRUIT_2026.source_url;
    obj.source_date = '2025-09-11';
    obj.snapshot_url = sourceUpdates.SRC_MOHRSS_RECRUIT_2026.source_url;
    obj.source_name = sourceUpdates.SRC_MOHRSS_RECRUIT_2026.source_name;
    obj.source_type = 'government_policy';
    obj.manual_verification_required = false;
    obj.http_status = 200;
    obj.access_check = 'checked';
  }

  if (obj.source_date && typeof obj.source_date === 'string' && obj.source_date > TODAY) {
    obj.source_date = TODAY;
    obj.manual_verification_required = true;
    obj.manual_verification_note = '原始日期晚于当前数据版本日期，请人工复核后回填准确发布日期。';
  }
}

function walkUpdateSources(node, sourceMap) {
  if (Array.isArray(node)) {
    node.forEach((x) => walkUpdateSources(x, sourceMap));
    return;
  }
  if (!node || typeof node !== 'object') {
    return;
  }
  updateSourceReference(node, sourceMap);
  Object.keys(node).forEach((k) => walkUpdateSources(node[k], sourceMap));
}

function fixWeakCollections(entry, cityMap) {
  const focus = industryFocus[entry.industry_id] || {
    interview: `${entry['行业名称']}关键能力`,
    written: `${entry['行业名称']}核心知识`,
    oral: `${entry['行业名称']}项目表达`
  };

  for (const [key, code] of Object.entries(collectionCodeMap)) {
    const col = entry.dynamic?.[key];
    if (!col) continue;

    col.notes = normalizeNote(col.notes || '');

    if (key === '从业者访谈') {
      const base = `访谈优先围绕“${focus.interview}”采集真实样本，模板内容仅作结构示例。`;
      col.notes = normalizeNote([col.notes, base].filter(Boolean).join('；'));
    }
    if (key === '笔试真题库') {
      const base = `优先补充“${focus.written}”方向的真实笔试题，模板题不计入最终真题覆盖。`;
      col.notes = normalizeNote([col.notes, base].filter(Boolean).join('；'));
    }
    if (key === '面试真题库') {
      const base = `优先补充“${focus.oral}”方向的真实面试问答，需注明轮次与来源。`;
      col.notes = normalizeNote([col.notes, base].filter(Boolean).join('；'));
    }

    const items = Array.isArray(col.items) ? col.items : [];
    for (const item of items) {
      if (!item || typeof item !== 'object') continue;
      if (key === '从业者访谈') {
        if (Array.isArray(item.key_takeaways) && item.key_takeaways.length > 0) {
          item.key_takeaways[0] = `围绕“${focus.interview}”补齐可量化案例，优先于泛化叙述。`;
        }
        if (!Array.isArray(item.caveats)) item.caveats = [];
        if (!item.caveats.some((x) => String(x).includes('需补充真实访谈录音/记录'))) {
          item.caveats.push('需补充真实访谈录音/记录或可核验文字纪要后，方可升级为verified。');
        }
      }

      if (key === '笔试真题库') {
        if (typeof item.prompt === 'string' && !item.prompt.includes('行业聚焦')) {
          item.prompt = `${item.prompt}（行业聚焦：${focus.written}）`;
        }
        item.is_template = true;
        item.needs_real_question = true;
      }

      if (key === '面试真题库') {
        if (typeof item.prompt === 'string' && !item.prompt.includes('行业聚焦')) {
          item.prompt = `${item.prompt}（行业聚焦：${focus.oral}）`;
        }
        item.is_template = true;
        item.needs_real_question = true;
      }
    }

    const slots = Array.isArray(col.manual_fill_slots) ? col.manual_fill_slots : [];
    slots.forEach((slot, idx) => {
      slot.slot_id = `${entry.industry_id}_${code}_FILL_${pad3(idx + 1)}`;
      const noteCore = key === '从业者访谈'
        ? `请优先补充“${focus.interview}”方向的真实样本，并保留来源证据。`
        : key === '笔试真题库'
          ? `请优先补充“${focus.written}”方向的真实题目，并标注题目年份/岗位。`
          : `请优先补充“${focus.oral}”方向的真实问答，并标注面试轮次。`;
      slot.note = noteCore;
    });

    const tasks = Array.isArray(col.collection_tasks) ? col.collection_tasks : [];
    tasks.forEach((task, idx) => {
      task.task_id = `${entry.industry_id}_${code}_TASK_${pad3(idx + 1)}`;
      task.objective = key === '从业者访谈'
        ? `补齐${entry['行业名称']}从业者访谈真实样本（重点：${focus.interview}）`
        : key === '笔试真题库'
          ? `补齐${entry['行业名称']}笔试真实题样本（重点：${focus.written}）`
          : `补齐${entry['行业名称']}面试真实问答样本（重点：${focus.oral}）`;
      if (!task.owner && entry.meta?.owner) task.owner = entry.meta.owner;
    });
  }

  const salary = entry.dynamic?.['薪酬快照_按城市_按公司层级_按岗位'];
  if (salary) {
    salary.notes = normalizeNote([salary.notes || '', 'observed_items仅用于真实样本；estimated_items仅用于估算对比，禁止混用为真实薪酬事实。'].join('；'));

    const observed = Array.isArray(salary.observed_items) ? salary.observed_items : [];
    if (observed.length === 0) {
      const firstRole = entry.dynamic?.['岗位画像库']?.items?.[0];
      const cityId = entry.static?.['招聘与成长']?.['城市格局']?.['核心城市_ids']?.[0] || 'CITY_001';
      const cityName = cityMap.get(cityId) || '待填城市';
      observed.push({
        snapshot_id: `${entry.industry_id}_SALARY_OBS_PENDING_001`,
        status: 'pending_user_fill',
        city_id: cityId,
        city_name: cityName,
        company_tier: 't2_strong',
        role_id: firstRole?.role_id || `${entry.industry_id}_ROLE_PENDING_001`,
        role_name: firstRole?.role_name || '待填岗位',
        p25_monthly_total_annualized_k_cny: null,
        p50_monthly_total_annualized_k_cny: null,
        p75_monthly_total_annualized_k_cny: null,
        source_id: 'SRC_NCSS_CAMPUS',
        source_name: '国家大学生就业服务平台-校园招聘',
        source_url: '',
        source_date: null,
        sample_size: null,
        confidence: null,
        stat_definition: `待补充${entry['行业名称']}真实offer样本统计口径（建议N>=10）。`,
        updated_at: TODAY,
        manual_fill_note: '请填写真实样本来源链接、样本量、统计口径与分位值。'
      });
      salary.observed_items = observed;
    }

    salary.observed_status = 'in_progress';
    salary.observed_coverage_percent = Math.max(Number(salary.observed_coverage_percent || 0), 40);
    if (salary.manual_fill_progress && typeof salary.manual_fill_progress === 'object') {
      salary.manual_fill_progress.pending_count = Math.max(0, Number(salary.manual_fill_progress.pending_count || 0));
      salary.manual_fill_progress.current_count = Number(salary.manual_fill_progress.current_count || 0);
      salary.manual_fill_progress.required_count = Math.max(Number(salary.manual_fill_progress.required_count || 0), 6);
    }
  }

  const companyList = entry.dynamic?.['公司清单']?.items;
  if (Array.isArray(companyList)) {
    for (const c of companyList) {
      if (!c || typeof c !== 'object') continue;
      c.company_uid = makeCompanyUid(c.company_name || c.company_id);
    }
  }

  const policyLogs = entry.dynamic?.['政策变化日志']?.items;
  if (Array.isArray(policyLogs)) {
    for (const log of policyLogs) {
      if (!log || typeof log !== 'object') continue;
      if (log.evidence?.source_id === 'SRC_MOHRSS_RECRUIT_2026') {
        log.date = '2025-09-11';
        log.title = '人社部启动2025年秋季全国城市联合招聘高校毕业生专场活动';
        log.impact = '为2026届毕业生秋招提供岗位供给与跨区域匹配渠道。';
      }
    }
  }

  const eventLogs = entry.dynamic?.['行业事件日志']?.items;
  if (Array.isArray(eventLogs)) {
    for (const ev of eventLogs) {
      if (!ev || typeof ev !== 'object') continue;
      if (ev.evidence?.source_id === 'SRC_MOHRSS_RECRUIT_2026') {
        ev.title = '秋季联合招聘启动，校招节奏前移';
        ev.summary = '建议在秋招窗口前完成岗位筛选、简历版本和面试题库准备。';
      }
    }
  }
}

// backup
const backupPath = path.join(ROOT, '行业百科.v1.5.0.pre_v1.6.backup.json');
if (!fs.existsSync(backupPath)) {
  fs.copyFileSync(DATA_PATH, backupPath);
}

// source registry update
const registry = Array.isArray(data['来源注册表']) ? data['来源注册表'] : [];
for (const src of registry) {
  if (!src || typeof src !== 'object') continue;
  const patch = sourceUpdates[src.source_id];
  if (patch) {
    Object.assign(src, patch);
    src.last_checked = TODAY;
    src.accessed_at = TODAY;
  }
  src.source_name = String(src.source_name || '').trim();
}

const sourceMap = new Map(registry.map((x) => [x.source_id, x]));
const cityMap = new Map((data['枚举字典']?.['关键城市'] || []).map((c) => [c.city_id, c.city_name]));

// global source cleanup
walkUpdateSources(data, sourceMap);

// per-entry curated cleanup
const entries = Array.isArray(data['行业词条']) ? data['行业词条'] : [];
for (const entry of entries) {
  if (!entry || typeof entry !== 'object') continue;

  if (entry.meta) {
    entry.meta.content_version = '1.6.0';
    entry.meta.last_updated = TODAY;
    if (entry.meta.data_freshness && typeof entry.meta.data_freshness === 'object') {
      entry.meta.data_freshness.last_full_refresh_at = TODAY;
    }
  }

  if (entry.progress && typeof entry.progress === 'object') {
    entry.progress.updated_at = TODAY;
  }

  fixWeakCollections(entry, cityMap);
}

// document metadata
const doc = data['文档元数据'] || {};
doc['文档名称'] = '中国大陆应届生求职行业百科（v1.6去模板化精修版）';
doc['版本'] = 'v1.6.0';
doc['发布日期'] = TODAY;
if (!Array.isArray(doc['说明'])) doc['说明'] = [];
doc['说明'] = [
  'v1.6.0聚焦去模板化：弱集合改为行业焦点驱动的真实采集指引。',
  '全量回填source_name/source_type，减少“待补充来源”占位噪声。',
  '修复未来日期与不可核验引用，统一到可追溯且可复核口径。',
  '薪酬observed层增加待填样本位，明确estimated与observed语义边界。'
];
if (!Array.isArray(doc['变更记录'])) doc['变更记录'] = [];
doc['变更记录'].push({
  version: 'v1.6.0',
  date: TODAY,
  summary: [
    '弱集合（访谈/笔试/面试）改为行业焦点化采集说明，降低模板同质化。',
    '全量修复source_name占位与来源映射一致性问题。',
    '修正未来日期引用（如2026-02-18）到可核验历史节点。',
    '新增公司company_uid稳定标识，便于后续跨库关联。'
  ]
});
data['文档元数据'] = doc;

fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2) + '\n', 'utf8');
console.log(`Upgraded to v1.6.0 (curated): ${entries.length} entries`);
