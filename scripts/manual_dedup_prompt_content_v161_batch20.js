#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const ENTRIES_DIR = path.join(ROOT, 'data', 'entries');

const TARGET_TO_TEMPLATE = new Map([
  [
    '请结合该岗位的核心职责，设计一次关键场景的目标、执行步骤与结果指标。',
    ({ industry, roleName, project, kpi }) =>
      `请围绕${industry}行业${roleName}在“${project}”场景，设定业务目标与约束条件，给出执行步骤、里程碑与基于${kpi}的结果指标。`,
  ],
  [
    '请给出“目标拆解-执行推进-复盘沉淀”的标准流程，并说明关键检查点。',
    ({ industry, roleName, skill }) =>
      `请以${industry}行业${roleName}为对象，按“目标拆解-执行推进-复盘沉淀”输出流程，说明在${skill}环节的检查点与异常处理机制。`,
  ],
  [
    '请给出一个该岗位关键业务场景的完整分析路径，并说明你如何验证结果。',
    ({ industry, roleName, kpi }) =>
      `请针对${industry}行业${roleName}常见场景，给出从数据/事实收集到方案验证的完整分析路径，并说明如何用${kpi}验证有效性。`,
  ],
  [
    '请设计该岗位在“目标设定-执行跟踪-复盘优化”中的机制流程和关键节点。',
    ({ industry, roleName, skill }) =>
      `请为${industry}行业${roleName}设计“目标设定-执行跟踪-复盘优化”机制，明确跨团队接口、节奏节点和${skill}相关风险控制。`,
  ],
  [
    '首轮执行结果不达标时，你会如何拆解根因并完成第二轮优化？',
    ({ industry, roleName, project }) =>
      `在${industry}行业${roleName}的“${project}”首轮执行未达标时，你会如何定位根因、重排动作优先级，并完成第二轮优化闭环？`,
  ],
  [
    '当效率目标、质量目标和风险边界冲突时，你会如何排序并给出决策依据？',
    ({ industry, roleName, kpi }) =>
      `在${industry}行业${roleName}中，若效率、质量与风险边界冲突，请给出你的排序原则、量化依据以及对${kpi}的影响评估。`,
  ],
  [
    '请讲一个你在类似职责中处理关键问题的思路：如何判断、推进和验证结果？',
    ({ industry, roleName, project }) =>
      `请结合你在${industry}行业${roleName}相关经历，说明一次处理关键问题的思路：如何判断优先级、推进${project}并验证结果。`,
  ],
  [
    '当上下游团队目标不一致时，你如何推动协同并确保关键节点落地？',
    ({ industry, roleName, skill }) =>
      `当${industry}行业${roleName}工作中上下游目标不一致时，你如何建立共识、推进协同，并确保${skill}关键节点按期落地？`,
  ],
  [
    '请讲你如何推进一个关键业务任务，从判断到落地再到效果复盘。',
    ({ industry, roleName }) =>
      `请复盘一次你推进${industry}行业${roleName}关键任务的经历，重点说明从问题判断、动作落地到结果复盘的完整闭环。`,
  ],
  [
    '当跨团队目标冲突时，你如何定义共识、推动协同并保障节点交付？',
    ({ industry, roleName, project }) =>
      `在${industry}行业${roleName}场景下，若跨团队目标冲突，你如何定义共识指标、分配责任并保障“${project}”节点交付？`,
  ],
  [
    '请复盘一次失误案例：你如何识别问题、修正策略并避免重复发生？',
    ({ industry, roleName }) =>
      `请复盘一次你在${industry}行业${roleName}工作中的失误案例：如何识别问题、修正策略，并通过机制避免再次发生。`,
  ],
  [
    '多任务并行且资源受限时，你如何设定优先级并向相关方解释取舍？',
    ({ industry, roleName, kpi }) =>
      `多任务并行且资源受限时，作为${industry}行业${roleName}，你如何设定优先级、向相关方解释取舍，并守住${kpi}底线？`,
  ],
]);

function normalizePrompt(prompt) {
  return String(prompt || '').replace(/^【[^】]*】/, '').trim();
}

function splitPrefix(prompt) {
  const raw = String(prompt || '');
  const m = raw.match(/^(【[^】]*】)([\s\S]*)$/);
  if (!m) return { prefix: '', body: raw.trim() };
  return { prefix: m[1], body: (m[2] || '').trim() };
}

function pickFirst(values, fallback = '') {
  if (!Array.isArray(values)) return fallback;
  for (const v of values) {
    const s = String(v || '').trim();
    if (s) return s.replace(/[。；;]+$/g, '');
  }
  return fallback;
}

function compactKpi(kpiText) {
  const raw = String(kpiText || '')
    .replace(/核心KPI[:：]?/g, '')
    .replace(/。+$/g, '')
    .trim();
  return raw || '交付时效、质量与结果指标';
}

function sanitizeInline(text, fallback) {
  const s = String(text || '').replace(/[\n\r\t]/g, ' ').trim();
  if (!s) return fallback;
  return s;
}

const files = fs
  .readdirSync(ENTRIES_DIR)
  .filter((f) => f.endsWith('.json'))
  .sort();

let fileChanged = 0;
let rewritten = 0;
const touchedByFile = [];

for (const file of files) {
  const p = path.join(ENTRIES_DIR, file);
  const data = JSON.parse(fs.readFileSync(p, 'utf8'));
  const industry = sanitizeInline(data['行业名称'], data.industry_id || '该行业');

  const roleMap = new Map();
  for (const role of data?.dynamic?.['岗位画像库']?.items || []) {
    roleMap.set(role.role_id, role);
  }

  let changedInFile = 0;
  for (const bankName of ['笔试真题库', '面试真题库']) {
    for (const q of data?.dynamic?.[bankName]?.items || []) {
      const normalized = normalizePrompt(q.prompt);
      const builder = TARGET_TO_TEMPLATE.get(normalized);
      if (!builder) continue;

      const role = roleMap.get(q.role_id) || {};
      const roleName = sanitizeInline(q.role_name || role.role_name, '该岗位');
      const skill = sanitizeInline(
        pickFirst(role.hard_skills) || pickFirst(role.soft_skills),
        '关键能力'
      );
      const project = sanitizeInline(
        pickFirst(role.typical_projects),
        `${roleName}关键专项`
      );
      const kpi = sanitizeInline(compactKpi(role.core_output_kpi), '交付时效、质量与结果指标');

      const ctx = { industry, roleName, skill, project, kpi };
      const body = builder(ctx);
      const { prefix } = splitPrefix(q.prompt);
      const nextPrompt = prefix ? `${prefix}${body}` : body;

      if (nextPrompt !== q.prompt) {
        q.prompt = nextPrompt;
        changedInFile += 1;
      }
    }
  }

  if (changedInFile > 0) {
    fs.writeFileSync(p, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
    fileChanged += 1;
    rewritten += changedInFile;
    touchedByFile.push({ file, rewritten: changedInFile });
  }
}

console.log(
  JSON.stringify(
    {
      files_total: files.length,
      files_changed: fileChanged,
      prompts_rewritten: rewritten,
      top_changed_files: touchedByFile.sort((a, b) => b.rewritten - a.rewritten).slice(0, 10),
    },
    null,
    2
  )
);
