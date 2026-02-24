#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const MAIN_PATH = path.join(ROOT, '行业百科.json');
const ENTRY_DIR = path.join(ROOT, 'data', 'entries');
const TODAY = '2026-02-24';
const VERSION = 'v1.65.0';

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
  '延续全岗位深度治理：岗位决策关键四字段与六件套持续保持全覆盖，支持单站完成职业决策。',
  '题库分层提档：全量岗位升级到core>=16、mainstream>=12、longtail>=10，并补齐岗位特异化追问链、扣分点与评分锚点。',
  '岗位级实证与留空检索机制并行：对可采字段补充岗位级样本；对平台受限字段保留留空位并附检索入口、检索词与回填路径。',
  '扩容落地与命名治理持续生效：维持岗位树（核心/主流/新兴/支持）及别名字典映射，降低同义岗位重复与检索断层。',
  '发布门禁维持阻断模式：深度与实证关键指标持续进入发布校验，避免只涨数量不涨决策价值。'
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

if (!main['治理配置']['百科深度门槛_v155']) main['治理配置']['百科深度门槛_v155'] = {};
main['治理配置']['百科深度门槛_v155'].gate_mode = 'blocking';
main['治理配置']['百科深度门槛_v155'].enabled = true;

if (!main['治理配置']['岗位命名治理_v164']) {
  main['治理配置']['岗位命名治理_v164'] = {
    enabled: true,
    layers: ['核心岗', '主流岗', '新兴岗', '支持岗'],
    alias_dict_report_path: 'reports/岗位别名字典_v1.64.0.json',
    note: '岗位命名需映射到唯一canonical_role_name，避免近义岗位重复。'
  };
}

if (main['治理配置']['扩容执行清单']) {
  main['治理配置']['扩容执行清单']['plan_version'] = VERSION;
  main['治理配置']['扩容执行清单']['generated_at'] = TODAY;
  main['治理配置']['扩容执行清单']['last_manual_batch'] = 'v1.65.0_tier_upgrade_and_role_specific_refine';
  main['治理配置']['扩容执行清单']['last_manual_batch_scope'] = Array.from(entryMap.keys()).sort();
  main['治理配置']['扩容执行清单']['last_manual_batch_date'] = TODAY;
  main['治理配置']['扩容执行清单']['v164_platform_gap_report_markdown_path'] = 'reports/平台受限字段留空与检索卡_v1.64.0.md';
  main['治理配置']['扩容执行清单']['v164_platform_gap_report_json_path'] = 'reports/平台受限字段留空与检索卡_v1.64.0.json';
  main['治理配置']['扩容执行清单']['v164_execution_record_json_path'] = 'reports/v1.64.0_逐岗位补深与补题执行记录.json';
  main['治理配置']['扩容执行清单']['v1641_expansion_mapping_record_json_path'] = 'reports/v1.64.1_扩容候选映射修复记录.json';
  main['治理配置']['扩容执行清单']['v1641_core_highfreq_record_json_path'] = 'reports/v1.64.1_核心高频岗16题档补题记录.json';
  main['治理配置']['扩容执行清单']['v1641_source_access_record_markdown_path'] = 'reports/v1.64.1_联网信息源补录与可达性记录.md';
  main['治理配置']['扩容执行清单']['v165_tier_upgrade_record_json_path'] = 'reports/v1.65.0_题量提档与去同质化记录.json';
}

fs.writeFileSync(MAIN_PATH, `${JSON.stringify(main, null, 2)}\n`, 'utf8');
console.log(`Rebuilt main file from ${entryMap.size} entries, version ${VERSION}.`);
