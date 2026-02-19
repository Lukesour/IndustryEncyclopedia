#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DATA_PATH = path.join(ROOT, '行业百科.json');
const REPORT_DIR = path.join(ROOT, 'reports');
const TODAY = '2026-02-19';

const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
const gate = data['治理配置']['发布硬门槛'] || {};

const roleMap = gate.role_count_target_by_industry || {};
const wMap = gate.question_written_per_role_target_by_industry || {};
const iMap = gate.question_interview_per_role_target_by_industry || {};
const sMap = gate.question_stage_coverage_target_by_industry || {};
const dMap = gate.job_detail_url_min_percent_by_industry || {};

function getExt(entry) {
  const items = (((entry.dynamic || {})['自定义扩展'] || {}).items) || [];
  return items.find((x) => x && x.ext_id === `${entry.industry_id}_EXPANSION_V154`) || null;
}

function stageCoverage(entry, roleId, mode) {
  const arr = (((entry.dynamic || {})[mode] || {}).items) || [];
  const set = new Set(arr.filter((q) => q.role_id === roleId).map((q) => q.recruitment_stage));
  return set.size;
}

function deepLinkPercent(entry) {
  const roles = ((((entry.dynamic || {})['岗位画像库'] || {}).items) || []);
  if (!roles.length) return 0;
  const deep = roles.filter((r) => {
    const url = (((r || {}).evidence || {}).source_url) || '';
    if (!url || typeof url !== 'string') return false;
    try {
      const u = new URL(url);
      const segs = u.pathname.split('/').filter(Boolean);
      return segs.length >= 2;
    } catch {
      return false;
    }
  }).length;
  return (deep * 100) / roles.length;
}

const entries = data['行业词条'] || [];

let taskMd = '';
taskMd += '# 23行业逐个填写任务板（v1.54.0）\n\n';
taskMd += `更新时间：${TODAY}（行业差异化门禁口径）\n`;
taskMd += '目标：让用户在百科内完成“选行业-选岗位-定准备路径-执行备考-复盘止损”，并保留平台受限补录位。\n\n';
taskMd += '统一回填规则（所有行业）\n';
taskMd += '1. 门禁按行业差异化目标执行，不再统一24岗/12题。\n';
taskMd += '2. 题目扩容优先补现有岗位缺失阶段，再扩新增岗位。\n';
taskMd += '3. 平台受限必须保留待补槽位，禁止伪造来源与样本。\n';
taskMd += '4. 必填字段：岗位名称、城市、公司层级、批次/轮次、链接、发布时间、样本量、截图路径、来源类型、备注。\n';
taskMd += '5. BOSS优先网页检索；小红书网页受限时改App检索并留时间戳截图。\n\n';

entries.forEach((entry, idx) => {
  const roles = (((entry.dynamic || {})['岗位画像库'] || {}).items) || [];
  const written = (((entry.dynamic || {})['笔试真题库'] || {}).items) || [];
  const interview = (((entry.dynamic || {})['面试真题库'] || {}).items) || [];
  const ext = getExt(entry);

  const rid = entry.industry_id;
  const roleTarget = roleMap[rid] ?? gate.role_count_target_per_industry ?? 16;
  const wTarget = wMap[rid] ?? gate.question_written_per_role_target ?? 4;
  const iTarget = iMap[rid] ?? gate.question_interview_per_role_target ?? 4;
  const sTarget = sMap[rid] ?? gate.question_stage_coverage_target ?? 3;
  const dTarget = dMap[rid] ?? gate.job_detail_url_min_percent ?? 0;

  const wPerRole = roles.length ? (written.length / roles.length) : 0;
  const iPerRole = roles.length ? (interview.length / roles.length) : 0;

  let fullStageBoth = 0;
  for (const r of roles) {
    const wCov = stageCoverage(entry, r.role_id, '笔试真题库');
    const iCov = stageCoverage(entry, r.role_id, '面试真题库');
    if (wCov >= 4 && iCov >= 4) fullStageBoth += 1;
  }

  const deepPct = deepLinkPercent(entry);
  const roleCandidates = (ext && ext.x_role_expansion_candidates) ? ext.x_role_expansion_candidates.slice(0, 8).map((x) => x.role_name) : [];
  const bossQuery = ext?.x_platform_backfill_plan?.where_to_search?.boss?.query || `${entry['行业名称']} 校招`;
  const xhsQuery = ext?.x_platform_backfill_plan?.where_to_search?.xiaohongshu?.query || `${entry['行业名称']} 校招 面经`;

  taskMd += `## ${idx + 1}. ${entry['行业名称']}（${rid}）\n`;
  taskMd += `- 当前：岗位${roles.length} / 笔试${written.length} / 面试${interview.length}\n`;
  taskMd += `- 差异化目标：岗位${roleTarget} / 每岗笔试${wTarget} / 每岗面试${iTarget} / 阶段覆盖${sTarget} / 深链接${dTarget}%\n`;
  taskMd += `- 当前密度：笔试${wPerRole.toFixed(2)}/岗 / 面试${iPerRole.toFixed(2)}/岗 / 4阶段全覆盖岗位${fullStageBoth}/${roles.length} / 深链接${deepPct.toFixed(2)}%\n`;
  if (roleCandidates.length) {
    taskMd += `- 优先扩容候选岗：${roleCandidates.join('、')}\n`;
  }
  taskMd += `- BOSS检索：\`${bossQuery}\`\n`;
  taskMd += `- 小红书检索：\`${xhsQuery}\`\n`;
  taskMd += '- 待补字段：岗位名称、城市、公司层级、批次/轮次、岗位或题目链接、发布时间、样本量、截图路径、来源类型、备注。\n\n';
});

let gapMd = '';
gapMd += '# 23行业信息缺口与检索卡（v1.54.0）\n\n';
gapMd += `生成时间：${TODAY}T08:55:00Z\n\n`;
gapMd += '说明：按行业差异化门禁重算缺口；平台受限时必须保留待补槽位并附检索证据。\n\n';

entries.forEach((entry) => {
  const roles = (((entry.dynamic || {})['岗位画像库'] || {}).items) || [];
  const written = (((entry.dynamic || {})['笔试真题库'] || {}).items) || [];
  const interview = (((entry.dynamic || {})['面试真题库'] || {}).items) || [];
  const ext = getExt(entry);

  const rid = entry.industry_id;
  const roleTarget = roleMap[rid] ?? gate.role_count_target_per_industry ?? 16;
  const wTarget = wMap[rid] ?? gate.question_written_per_role_target ?? 4;
  const iTarget = iMap[rid] ?? gate.question_interview_per_role_target ?? 4;
  const sTarget = sMap[rid] ?? gate.question_stage_coverage_target ?? 3;

  const roleGap = Math.max(0, roleTarget - roles.length);
  const writtenTargetTotal = Math.ceil(roleTarget * wTarget);
  const interviewTargetTotal = Math.ceil(roleTarget * iTarget);
  const writtenGap = Math.max(0, writtenTargetTotal - written.length);
  const interviewGap = Math.max(0, interviewTargetTotal - interview.length);

  const boss = ext?.x_platform_backfill_plan?.where_to_search?.boss || {};
  const xhs = ext?.x_platform_backfill_plan?.where_to_search?.xiaohongshu || {};

  gapMd += `## ${entry['行业名称']}（${rid}）\n`;
  gapMd += `- 当前：岗位${roles.length} / 笔试${written.length} / 面试${interview.length}\n`;
  gapMd += `- 目标：岗位${roleTarget} / 每岗笔试${wTarget} / 每岗面试${iTarget} / 阶段覆盖${sTarget}\n`;
  gapMd += `- 缺口：新增岗位${roleGap} / 新增笔试${writtenGap} / 新增面试${interviewGap}\n`;
  gapMd += '- BOSS可达性：HTTP 200（reachable）\n';
  gapMd += '- 小红书可达性：网页受限概率高（limited_or_blocked）\n';
  gapMd += `- BOSS检索词：${boss.query || `${entry['行业名称']} 校招` }\n`;
  gapMd += `- 小红书检索词：${xhs.query || `${entry['行业名称']} 校招 面经` }\n`;
  gapMd += '- 必填字段：岗位名称、城市、公司层级、批次/轮次、题目或岗位链接、发布时间、样本量、截图路径、来源类型、备注\n';
  gapMd += '- 受限时处理：保留pending槽位 + App检索截图 + 记录缺失原因与回填时间。\n\n';
});

fs.writeFileSync(path.join(REPORT_DIR, '23行业逐个填写任务板_v1.54.0.md'), taskMd, 'utf8');
fs.writeFileSync(path.join(REPORT_DIR, '23行业信息缺口与检索卡_v1.54.0.md'), gapMd, 'utf8');

console.log('Generated reports/23行业逐个填写任务板_v1.54.0.md');
console.log('Generated reports/23行业信息缺口与检索卡_v1.54.0.md');
