#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const MAIN_PATH = path.join(ROOT, '行业百科.json');
const ENTRY_DIR = path.join(ROOT, 'data', 'entries');
const TODAY = '2026-02-23';
const VERSION = 'v1.63.0';

const main = JSON.parse(fs.readFileSync(MAIN_PATH, 'utf8'));
const entryFiles = fs.readdirSync(ENTRY_DIR).filter((f) => f.endsWith('.json')).sort();
const entryMap = new Map();

for (const f of entryFiles) {
  const p = path.join(ENTRY_DIR, f);
  const entry = JSON.parse(fs.readFileSync(p, 'utf8'));
  entryMap.set(entry.industry_id, entry);
}

main['行业词条'] = (main['行业词条'] || []).map((entry) => entryMap.get(entry.industry_id) || entry);

if (!main['文档元数据']) main['文档元数据'] = {};
main['文档元数据']['版本'] = VERSION;
main['文档元数据']['发布日期'] = TODAY;
if (!Array.isArray(main['文档元数据']['变更记录'])) main['文档元数据']['变更记录'] = [];

const summary = [
  '补深8个低配行业核心岗位：逐岗补齐职业决策六件套并新增笔面试题（每岗+2笔+2面）。',
  '扩容5个低落地率行业细分岗位（ROLE_022）：每岗新增8笔+8面并写入平台留空检索卡。',
  '全库题目补齐scenario_bucket并逐岗保证5类场景桶覆盖，提升题库训练系统可用性。'
];

const already = main['文档元数据']['变更记录'].some((x) => x && x.version === VERSION);
if (!already) {
  main['文档元数据']['变更记录'].push({ date: TODAY, version: VERSION, summary });
}

if (Array.isArray(main['行业索引'])) {
  main['行业索引'] = main['行业索引'].map((idx) => {
    const entry = entryMap.get(idx.industry_id);
    if (!entry) return idx;
    return {
      ...idx,
      行业名称: entry['行业名称'] || idx['行业名称'],
      slug: entry.slug || idx.slug
    };
  });
}

// Rebuild role master dictionary to include newly added roles.
if (!main['枚举字典']) main['枚举字典'] = {};
const roleMaster = [];
for (const entry of main['行业词条'] || []) {
  const industryId = entry.industry_id;
  const industryName = entry['行业名称'] || '';
  const roles = entry.dynamic?.['岗位画像库']?.items || [];
  for (const r of roles) {
    roleMaster.push({
      industry_id: industryId,
      industry_name: industryName,
      role_id: r.role_id,
      role_name: r.role_name
    });
  }
}
roleMaster.sort((a, b) => {
  if (a.industry_id !== b.industry_id) return a.industry_id.localeCompare(b.industry_id);
  return a.role_id.localeCompare(b.role_id);
});
main['枚举字典']['岗位主数据'] = roleMaster;

if (!main['治理配置']) main['治理配置'] = {};
main['治理配置']['治理配置更新时间'] = TODAY;
if (main['治理配置']['扩容执行清单']) {
  main['治理配置']['扩容执行清单']['plan_version'] = VERSION;
  main['治理配置']['扩容执行清单']['generated_at'] = TODAY;
  main['治理配置']['扩容执行清单']['last_manual_batch'] = 'v1.63.0_low_industries_batchA_plus_expansion_batchB';
  main['治理配置']['扩容执行清单']['last_manual_batch_scope'] = [
    'IND_TELECOM_OPERATOR',
    'IND_REAL_ESTATE_INFRA',
    'IND_CHEM_NEW_MATERIALS',
    'IND_AGRI_FOOD',
    'IND_EDU_VOCATIONAL',
    'IND_STATE_OWNED_ENTERPRISE',
    'IND_CIVIL_SERVICE',
    'IND_PUBLIC_INSTITUTION',
    'IND_BIOMED_DEVICE',
    'IND_ENERGY_UTILITIES',
    'IND_FIN_BANK',
    'IND_FIN_SECURITIES_FUND'
  ];
  main['治理配置']['扩容执行清单']['last_manual_batch_date'] = TODAY;
  main['治理配置']['扩容执行清单']['v163_platform_gap_report_markdown_path'] = 'reports/平台受限字段留空与检索卡_v1.63.0.md';
  main['治理配置']['扩容执行清单']['v163_platform_gap_report_json_path'] = 'reports/平台受限字段留空与检索卡_v1.63.0.json';
  main['治理配置']['扩容执行清单']['v163_depth_spec_markdown_path'] = 'docs/百科深度升级执行规范_v1.63.0.md';
  main['治理配置']['扩容执行清单']['v163_source_spec_markdown_path'] = 'docs/信息源分级与抓取规范_v1.34.0.md';
}

fs.writeFileSync(MAIN_PATH, `${JSON.stringify(main, null, 2)}\n`, 'utf8');
console.log(`Rebuilt main file from ${entryMap.size} entries, version ${VERSION}.`);
