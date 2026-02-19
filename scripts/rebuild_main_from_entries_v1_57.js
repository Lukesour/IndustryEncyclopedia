#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const MAIN_PATH = path.join(ROOT, '行业百科.json');
const ENTRY_DIR = path.join(ROOT, 'data', 'entries');
const TODAY = '2026-02-19';
const VERSION = 'v1.57.0';

const main = JSON.parse(fs.readFileSync(MAIN_PATH, 'utf8'));
const entryFiles = fs.readdirSync(ENTRY_DIR).filter((f) => f.endsWith('.json'));
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
  '新增v1.57下一批次专项：核心岗4阶段覆盖与岗位深链率。',
  '质量流水线接入专项报告输出，生成core4/deeplink最新缺口清单。',
  '专项明确平台受限待补槽位、检索路径与来源分级规则。'
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

fs.writeFileSync(MAIN_PATH, `${JSON.stringify(main, null, 2)}\n`, 'utf8');
console.log(`Rebuilt main file from ${entryMap.size} entries, version ${VERSION}.`);
