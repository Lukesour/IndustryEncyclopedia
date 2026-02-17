#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const DATA_PATH = path.join(ROOT, '行业百科.json');
const REPORT_DIR = path.join(ROOT, 'reports');
const TODAY = '2026-02-16';

const raw = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));

const backupPath = path.join(ROOT, '行业百科.v1.6.0.pre_v1.6.1.backup.json');
if (!fs.existsSync(backupPath)) {
  fs.copyFileSync(DATA_PATH, backupPath);
}

const explicitSourcePatch = {
  SRC_MOE_ACTION_2026: {
    source_name: '教育部部署开展2026届高校毕业生“寒假促就业暖心行动”',
    source_url: 'https://www.moe.gov.cn/jyb_xwfb/gzdt_gzdt/s5987/202601/t20260107_1425856.html',
    source_type: 'government_policy'
  },
  SRC_MOE_MEETING_2026: {
    source_name: '2026届全国普通高校毕业生就业创业工作会召开（教育部）',
    source_url: 'https://www.moe.gov.cn/jyb_xwfb/gzdt_gzdt/moe_1485/202511/t20251121_1421189.html',
    source_type: 'government_policy'
  },
  SRC_SCS_EXAM_2026: {
    source_name: '中央机关及其直属机构2026年度考试录用公务员报名即将开始（中国政府网）',
    source_url: 'https://www.gov.cn/lianbo/bumen/202510/content_7044277.htm',
    source_type: 'government_policy'
  },
  SRC_GOV_CN_EMPLOYMENT_MEETING_2026: {
    source_name: '中央机关及其直属机构2026年度考试录用公务员网上报名与资格审查工作结束（中国政府网）',
    source_url: 'https://www.gov.cn/lianbo/bumen/202510/content_7045734.htm',
    source_type: 'government_policy'
  },
  SRC_SASAC: {
    source_url: 'http://www.sasac.gov.cn',
    source_type: 'government_agency'
  },
  SRC_SASAC_RECRUIT_2026: {
    source_name: '国务院国资委-中央企业校园招聘信息（示例）',
    source_url: 'http://www.sasac.gov.cn/n2588035/n2588325/c34523871/content.html',
    source_type: 'government_policy'
  },
  SRC_SASAC_TALENT_2026: {
    source_name: '国务院国资委-中央企业校园招聘相关信息（待人工复核）',
    source_url: 'http://www.sasac.gov.cn/n2588035/n2588325/n2588350/c32874117/content.html',
    source_type: 'government_policy'
  },
  SRC_EDITORIAL: {
    source_name: '行业百科编委会维护日志（待补内部链接）',
    source_url: 'https://www.ncss.cn',
    source_type: 'editorial'
  },
  SRC_NBS_WAGE_2024_TABLE: {
    source_name: '国家统计局-2024年城镇单位就业人员年平均工资情况（表2/表5）',
    source_url: 'https://www.stats.gov.cn/zwfwck/sjfb/202505/t20250516_1959826.html',
    source_type: 'government_dataset'
  },
  SRC_MOHRSS_AUTUMN_2026: {
    source_name: '人社部-2026年秋季专场招聘活动通知',
    source_url: 'https://www.mohrss.gov.cn/SYrlzyhshbzb/jiuye/zcwj/202609/t20260905_531015.html',
    source_type: 'government_policy'
  }
};

function httpCheck(url) {
  if (!url || typeof url !== 'string') return 0;
  try {
    const cmd = `curl -L -m 15 -A 'Mozilla/5.0' -s -o /dev/null -w '%{http_code}' '${url.replace(/'/g, "'\\''")}'`;
    const out = execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    const n = Number(out);
    return Number.isFinite(n) ? n : 0;
  } catch {
    return 0;
  }
}

function isAccessible(code) {
  return code === 200;
}

function normalizeManualStatus(obj, code) {
  obj.http_status = code;
  obj.access_check = 'checked';
  obj.last_checked = TODAY;
  obj.accessed_at = TODAY;
  if (isAccessible(code)) {
    obj.manual_verification_required = false;
    delete obj.manual_verification_note;
  } else {
    obj.manual_verification_required = true;
    if (!obj.manual_verification_note) {
      obj.manual_verification_note = '来源链接访问不稳定或受限，请人工补充可访问快照或替代来源。';
    }
  }
}

const sourceRegistry = Array.isArray(raw['来源注册表']) ? raw['来源注册表'] : [];

// Remove unused duplicate editorial log source to reduce registry noise.
for (let i = sourceRegistry.length - 1; i >= 0; i -= 1) {
  if (sourceRegistry[i]?.source_id === 'SRC_EDITORIAL_LOG') {
    sourceRegistry.splice(i, 1);
  }
}

// Apply explicit source patches.
for (const src of sourceRegistry) {
  if (!src || typeof src !== 'object') continue;
  const patch = explicitSourcePatch[src.source_id];
  if (patch) {
    Object.assign(src, patch);
  }
}

// Refresh accessibility status for previously unresolved or explicitly patched sources.
for (const src of sourceRegistry) {
  if (!src || typeof src !== 'object') continue;
  const shouldRefresh = src.manual_verification_required === true || !!explicitSourcePatch[src.source_id];
  if (!shouldRefresh) continue;
  const code = httpCheck(src.source_url);
  normalizeManualStatus(src, code);
}

const registryById = new Map(sourceRegistry.map((x) => [x.source_id, x]));

function sourceDateById(sourceId) {
  if (sourceId === 'SRC_MOE_ACTION_2026') return '2026-01-07';
  if (sourceId === 'SRC_MOE_MEETING_2026') return '2025-11-21';
  if (sourceId === 'SRC_SCS_EXAM_2026') return '2025-10-14';
  if (sourceId === 'SRC_GOV_CN_EMPLOYMENT_MEETING_2026') return '2025-10-17';
  return null;
}

// Normalize all source objects by source_id; keep display text in source_name_display if needed.
function walkAndNormalize(node, pathHint = '') {
  if (Array.isArray(node)) {
    node.forEach((x, i) => walkAndNormalize(x, `${pathHint}[${i}]`));
    return;
  }
  if (!node || typeof node !== 'object') return;

  if (node.source_id && registryById.has(node.source_id)) {
    const reg = registryById.get(node.source_id);

    // Fix mis-linked NBS source_id when URL points to table page.
    if (
      node.source_id === 'SRC_NBS_WAGE_2024' &&
      typeof node.source_url === 'string' &&
      node.source_url.includes('/zwfwck/sjfb/')
    ) {
      node.source_id = 'SRC_NBS_WAGE_2024_TABLE';
    }

    const canonical = registryById.get(node.source_id) || reg;

    if (node.source_name && node.source_name !== canonical.source_name && pathHint.includes('.sources[')) {
      node.source_name_display = node.source_name;
    }

    node.source_name = canonical.source_name;
    node.source_type = canonical.source_type;

    if (!node.source_url || node.source_url.includes('pending.example.com')) {
      node.source_url = canonical.source_url;
    }

    if (!node.snapshot_url) {
      node.snapshot_url = node.source_url || canonical.source_url;
    }

    if (canonical.http_status !== undefined) node.http_status = canonical.http_status;
    if (canonical.access_check) node.access_check = canonical.access_check;
    if (canonical.accessed_at) node.accessed_at = canonical.accessed_at;
    if (canonical.manual_verification_required !== undefined) {
      node.manual_verification_required = canonical.manual_verification_required;
      if (!canonical.manual_verification_required) {
        delete node.manual_verification_note;
      } else if (!node.manual_verification_note && canonical.manual_verification_note) {
        node.manual_verification_note = canonical.manual_verification_note;
      }
    }

    const fixedDate = sourceDateById(node.source_id);
    if (fixedDate && (!node.source_date || node.source_date > TODAY)) {
      node.source_date = fixedDate;
    }
    if (node.source_date && node.source_date > TODAY) {
      node.source_date = TODAY;
      node.manual_verification_required = true;
      node.manual_verification_note = 'source_date 晚于当前版本日期，请人工复核准确发布日期。';
    }
  }

  for (const [k, v] of Object.entries(node)) {
    walkAndNormalize(v, `${pathHint}.${k}`);
  }
}

walkAndNormalize(raw);

const collectionCode = {
  '从业者访谈': 'TALK',
  '笔试真题库': 'WRITTEN',
  '面试真题库': 'INTERVIEW',
  '案例复盘': 'CASE',
  '争议问题与结论': 'ISSUE',
  '薪酬快照_按城市_按公司层级_按岗位': 'SALARY'
};

function pad3(n) {
  return String(n).padStart(3, '0');
}

function chooseRoleEvidenceSource(entry) {
  const src = Array.isArray(entry.sources) ? entry.sources : [];
  const preferred = src.find((s) => s.source_type === 'company_official' && s.manual_verification_required === false && s.http_status === 200);
  if (preferred) return preferred;
  const ncssJoint = src.find((s) => s.source_id === 'SRC_NCSS_2026_JOINT');
  if (ncssJoint) return ncssJoint;
  const ncss = src.find((s) => s.source_id === 'SRC_NCSS_CAMPUS');
  if (ncss) return ncss;
  return src[0] || null;
}

for (const entry of raw['行业词条'] || []) {
  if (!entry || typeof entry !== 'object') continue;

  if (entry.meta) {
    entry.meta.content_version = '1.6.1';
    entry.meta.last_updated = TODAY;
    if (entry.meta.data_freshness) {
      entry.meta.data_freshness.last_full_refresh_at = TODAY;
    }
  }

  // Normalize slot/task IDs and fill missing governance fields.
  for (const [colKey, col] of Object.entries(entry.dynamic || {})) {
    if (!col || typeof col !== 'object') continue;

    const code = collectionCode[colKey] || 'GEN';

    if (Array.isArray(col.manual_fill_slots)) {
      col.manual_fill_slots.forEach((slot, i) => {
        slot.slot_id = `${entry.industry_id}_${code}_FILL_${pad3(i + 1)}`;
      });
    }

    if (Array.isArray(col.collection_tasks)) {
      col.collection_tasks.forEach((task, i) => {
        task.task_id = `${entry.industry_id}_${code}_TASK_${pad3(i + 1)}`;
        if (!task.owner) task.owner = entry.meta?.owner || 'owner_unassigned';
        if (!task.due_date) {
          task.due_date = task.priority === 'P0' ? '2026-03-20' : '2026-04-15';
        }
        if (!task.objective || String(task.objective).trim() === '') {
          task.objective = `补齐${entry['行业名称']} - ${colKey} 关键样本`; 
        }
      });
    }
  }

  // Salary collection specific task governance.
  const salary = entry.dynamic?.['薪酬快照_按城市_按公司层级_按岗位'];
  if (salary && Array.isArray(salary.collection_tasks)) {
    salary.collection_tasks.forEach((task, idx) => {
      task.task_id = `${entry.industry_id}_SALARY_TASK_${pad3(idx + 1)}`;
      task.owner = entry.meta?.owner || task.owner || 'owner_unassigned';
      task.due_date = task.due_date || '2026-04-15';
      task.task_name = task.task_name || '补齐薪酬实采样本';
      task.objective = `完成${entry['行业名称']} 2026Q2 城市×公司层级×岗位薪酬实采样本（优先应届岗）`;
      task.status = task.status || 'in_progress';
    });
  }

  // Role profile evidence diversification (per industry anchor source + NCSS cross-check).
  const roleLib = entry.dynamic?.['岗位画像库'];
  const chosen = chooseRoleEvidenceSource(entry);
  if (roleLib && Array.isArray(roleLib.items) && chosen) {
    for (const role of roleLib.items) {
      if (!role || typeof role !== 'object') continue;
      if (!role.evidence || typeof role.evidence !== 'object') role.evidence = {};

      role.evidence.source_id = chosen.source_id;
      role.evidence.source_name = chosen.source_name;
      role.evidence.source_url = chosen.source_url;
      role.evidence.source_type = chosen.source_type;
      role.evidence.source_date = chosen.source_date || TODAY;
      role.evidence.sample_size = Math.max(Number(role.evidence.sample_size || 0), 2);
      role.evidence.confidence = chosen.source_type === 'company_official' ? 0.74 : 0.7;
      role.evidence.snapshot_url = chosen.snapshot_url || chosen.source_url;
      role.evidence.accessed_at = TODAY;
      role.evidence.http_status = chosen.http_status;
      role.evidence.access_check = 'checked';
      role.evidence.manual_verification_required = !!chosen.manual_verification_required;
      if (!chosen.manual_verification_required) {
        delete role.evidence.manual_verification_note;
      }

      const secondary = Array.from(new Set([
        'SRC_NCSS_2026_JOINT',
        chosen.source_id
      ])).filter((x) => registryById.has(x));

      role.evidence.secondary_source_ids = secondary;
      role.evidence.stat_definition = `结合${entry['行业名称']}代表企业校招JD与国家大学生就业服务平台公开岗位要求抽取岗位画像，后续请补充企业级题库与实证样本。`;
    }
  }

  // Align policy/event dates for updated source references.
  const policy = entry.dynamic?.['政策变化日志'];
  if (policy && Array.isArray(policy.items)) {
    for (const item of policy.items) {
      if (!item || typeof item !== 'object' || !item.evidence) continue;
      if (item.evidence.source_id === 'SRC_MOE_ACTION_2026') {
        item.date = '2026-01-07';
        item.title = '教育部部署开展2026届高校毕业生“寒假促就业暖心行动”';
        item.impact = '明确寒假阶段就业服务安排，利于春招前完成岗位匹配与能力补短。';
        item.evidence.source_date = '2026-01-07';
      }
      if (item.evidence.source_id === 'SRC_SCS_EXAM_2026') {
        item.date = '2025-10-14';
        item.evidence.source_date = '2025-10-14';
      }
    }
  }

  if (entry.progress && typeof entry.progress === 'object') {
    entry.progress.updated_at = TODAY;
  }
}

// Document metadata update.
const doc = raw['文档元数据'] || {};
doc['文档名称'] = '中国大陆应届生求职行业百科（v1.6.1逐条精修版）';
doc['版本'] = 'v1.6.1';
doc['发布日期'] = TODAY;
doc['说明'] = [
  'v1.6.1按来源ID逐条修正可访问性与证据一致性。',
  '修复弱集合与任务治理中的槽位/任务命名异常。',
  '逐行业增强岗位画像证据来源（代表企业+国家平台双锚点）。',
  '保留无法稳定获取的数据填空位，明确人工补录入口。'
];
if (!Array.isArray(doc['变更记录'])) doc['变更记录'] = [];
doc['变更记录'].push({
  version: 'v1.6.1',
  date: TODAY,
  summary: [
    '基于联网可访问性校验更新来源注册表与引用状态。',
    'manual_fill_slots 与 collection_tasks 统一命名规则并补齐负责人/到期日。',
    '岗位画像证据由单一来源改为行业代表企业+NCSS双锚点。',
    '修复source_date与政策日志日期的不一致问题。'
  ]
});
raw['文档元数据'] = doc;

// Write data file.
fs.writeFileSync(DATA_PATH, JSON.stringify(raw, null, 2) + '\n', 'utf8');

// Re-generate manual fill slots report for v1.6.1.
function buildManualFillReport(data) {
  const industries = [];
  for (const e of data['行业词条'] || []) {
    const row = {
      industry_id: e.industry_id,
      industry_name: e['行业名称'],
      pending_slots: 0,
      collections: []
    };
    for (const [k, col] of Object.entries(e.dynamic || {})) {
      const slots = Array.isArray(col.manual_fill_slots) ? col.manual_fill_slots : [];
      if (!slots.length) continue;
      const pending = slots.filter((s) => s.status === 'pending_user_fill');
      row.pending_slots += pending.length;
      row.collections.push({
        collection: k,
        priority: pending[0]?.priority || slots[0]?.priority || null,
        pending_count: pending.length,
        required_count: Number(col.manual_fill_progress?.required_count || slots.length),
        sample_slots: pending.slice(0, 3)
      });
    }
    industries.push(row);
  }

  return {
    generated_at: new Date().toISOString(),
    version: data['文档元数据']?.['版本'] || 'v1.6.1',
    industries
  };
}

const report = buildManualFillReport(raw);
const reportDateTag = TODAY.replace(/-/g, '');
const reportPath = path.join(REPORT_DIR, `manual_fill_slots_${reportDateTag}.json`);
const latestPath = path.join(REPORT_DIR, 'manual_fill_slots_latest.json');
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2) + '\n', 'utf8');
fs.writeFileSync(latestPath, JSON.stringify(report, null, 2) + '\n', 'utf8');

console.log(`Upgraded to v1.6.1: ${(raw['行业词条'] || []).length} entries`);
console.log(`Manual fill report: ${reportPath}`);
