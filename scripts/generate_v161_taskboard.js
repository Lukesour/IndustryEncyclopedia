#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const dataPath = path.join(root, '行业百科.json');
const planPath = path.join(root, 'reports', '23行业分行业扩容执行清单_v1.60.0.json');
const outJson = path.join(root, 'reports', '23行业逐行业扩容任务表_v1.61.0.json');
const outMd = path.join(root, 'reports', '23行业逐行业扩容任务表_v1.61.0.md');

const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const plan = JSON.parse(fs.readFileSync(planPath, 'utf8'));

const entries = data['行业词条'] || [];
const entryMap = new Map(entries.map((e) => [e.industry_id, e]));

const stageSetForRole = (items, roleId) => {
  const set = new Set();
  for (const q of items || []) {
    if (q.role_id === roleId && q.recruitment_stage) set.add(q.recruitment_stage);
  }
  return set;
};

const industryRows = [];
for (const task of plan.industry_tasks || []) {
  const entry = entryMap.get(task.industry_id);
  if (!entry) continue;

  const roles = entry.dynamic?.['岗位画像库']?.items || [];
  const written = entry.dynamic?.['笔试真题库']?.items || [];
  const interview = entry.dynamic?.['面试真题库']?.items || [];

  const actualRoles = roles.length;
  const roleTarget = Number(task.role_target || 0);
  const roleGap = Math.max(0, roleTarget - actualRoles);

  const writtenPerRole = actualRoles === 0 ? 0 : written.length / actualRoles;
  const interviewPerRole = actualRoles === 0 ? 0 : interview.length / actualRoles;

  const gapTo8Written = Math.max(0, actualRoles * 8 - written.length);
  const gapTo8Interview = Math.max(0, actualRoles * 8 - interview.length);
  const gapTo10Written = Math.max(0, actualRoles * 10 - written.length);
  const gapTo10Interview = Math.max(0, actualRoles * 10 - interview.length);

  let roleStageLow = 0;
  let roleNoStar = 0;
  let roleNoDeduction = 0;
  let rolePlatformPlaceholder = 0;

  for (const r of roles) {
    const ws = stageSetForRole(written, r.role_id).size;
    const is = stageSetForRole(interview, r.role_id).size;
    if (ws < 4 || is < 4) roleStageLow += 1;
    if (!(r.star_evidence_template && typeof r.star_evidence_template === 'object' && Object.keys(r.star_evidence_template).length > 0)) roleNoStar += 1;
    if (!(Array.isArray(r.common_deduction_points) && r.common_deduction_points.length > 0)) roleNoDeduction += 1;
    if (r.platform_backfill_gap?.status === 'completed_with_placeholders') rolePlatformPlaceholder += 1;
  }

  industryRows.push({
    industry_id: task.industry_id,
    industry_name: task.industry_name,
    priority: task.priority,
    current_roles_in_plan: task.current_roles,
    actual_roles_now: actualRoles,
    role_target: roleTarget,
    role_gap: roleGap,
    current_roles_delta: actualRoles - Number(task.current_roles || 0),
    written_total: written.length,
    interview_total: interview.length,
    written_per_role: Number(writtenPerRole.toFixed(3)),
    interview_per_role: Number(interviewPerRole.toFixed(3)),
    question_gap_to_8: {
      written: gapTo8Written,
      interview: gapTo8Interview
    },
    question_gap_to_10: {
      written: gapTo10Written,
      interview: gapTo10Interview
    },
    role_depth_gaps: {
      stage_coverage_below_4: roleStageLow,
      missing_star_evidence_template: roleNoStar,
      missing_common_deduction_points: roleNoDeduction,
      platform_placeholder_roles: rolePlatformPlaceholder
    },
    role_candidates: task.role_candidates || [],
    source_search: {
      boss_query: task.boss_query || '',
      xiaohongshu_query: task.xiaohongshu_query || ''
    }
  });
}

const total = industryRows.reduce((acc, r) => {
  acc.actual_roles += r.actual_roles_now;
  acc.role_target += r.role_target;
  acc.role_gap += r.role_gap;
  acc.written_total += r.written_total;
  acc.interview_total += r.interview_total;
  acc.gap8_written += r.question_gap_to_8.written;
  acc.gap8_interview += r.question_gap_to_8.interview;
  acc.gap10_written += r.question_gap_to_10.written;
  acc.gap10_interview += r.question_gap_to_10.interview;
  acc.plan_drift_count += r.current_roles_delta !== 0 ? 1 : 0;
  return acc;
}, {
  actual_roles: 0,
  role_target: 0,
  role_gap: 0,
  written_total: 0,
  interview_total: 0,
  gap8_written: 0,
  gap8_interview: 0,
  gap10_written: 0,
  gap10_interview: 0,
  plan_drift_count: 0
});

const output = {
  version: 'v1.61.0',
  generated_at: new Date().toISOString(),
  objective: '校准基线漂移并输出23行业扩容+补录可执行任务表，支持站内闭环职业决策。',
  summary: {
    industry_count: industryRows.length,
    ...total
  },
  source_layers: plan.source_layers,
  required_backfill_fields: plan.required_backfill_fields,
  execution_rules: {
    phase_1: '先校准current_roles，再按行业复杂度补岗位树。',
    phase_2: '核心岗优先补到10/10，再提升至分层目标（14-20/10-14/8-10）。',
    phase_3: '补齐star/common并把platform占位字段转为证据化实填。',
    phase_4: '发布前跑质量门禁并处理阻断项。'
  },
  industry_tasks: industryRows
    .sort((a, b) => {
      const pRank = { P0: 0, P1: 1, P2: 2 };
      const pa = pRank[a.priority] ?? 99;
      const pb = pRank[b.priority] ?? 99;
      if (pa !== pb) return pa - pb;
      if (b.role_gap !== a.role_gap) return b.role_gap - a.role_gap;
      return b.question_gap_to_10.written + b.question_gap_to_10.interview - (a.question_gap_to_10.written + a.question_gap_to_10.interview);
    })
};

fs.writeFileSync(outJson, JSON.stringify(output, null, 2) + '\n', 'utf8');

const lines = [];
lines.push('# 23行业逐行业扩容任务表（v1.61.0）');
lines.push('');
lines.push(`生成时间：${output.generated_at}`);
lines.push('');
lines.push('## 总览');
lines.push('');
lines.push(`- 行业数：${output.summary.industry_count}`);
lines.push(`- 当前岗位总数：${output.summary.actual_roles}`);
lines.push(`- 目标岗位总数：${output.summary.role_target}`);
lines.push(`- 岗位缺口总计：${output.summary.role_gap}`);
lines.push(`- 执行清单基线漂移行业数：${output.summary.plan_drift_count}`);
lines.push(`- 题库缺口（按当前岗位到8/8）：笔试+${output.summary.gap8_written}，面试+${output.summary.gap8_interview}`);
lines.push(`- 题库缺口（按当前岗位到10/10）：笔试+${output.summary.gap10_written}，面试+${output.summary.gap10_interview}`);
lines.push('');
lines.push('## 行业任务');
lines.push('');

for (const row of output.industry_tasks) {
  lines.push(`### ${row.industry_name}（${row.priority}）`);
  lines.push('');
  lines.push(`- 岗位：当前${row.actual_roles_now} / 目标${row.role_target} / 缺口${row.role_gap}`);
  lines.push(`- 清单基线漂移：${row.current_roles_delta >= 0 ? '+' : ''}${row.current_roles_delta}`);
  lines.push(`- 题库现状：笔试${row.written_total}（${row.written_per_role}/岗），面试${row.interview_total}（${row.interview_per_role}/岗）`);
  lines.push(`- 到8/8缺口：笔试+${row.question_gap_to_8.written}，面试+${row.question_gap_to_8.interview}`);
  lines.push(`- 到10/10缺口：笔试+${row.question_gap_to_10.written}，面试+${row.question_gap_to_10.interview}`);
  lines.push(`- 结构缺口：4阶段不足${row.role_depth_gaps.stage_coverage_below_4}岗，缺STAR ${row.role_depth_gaps.missing_star_evidence_template}岗，缺扣分点${row.role_depth_gaps.missing_common_deduction_points}岗，占位平台${row.role_depth_gaps.platform_placeholder_roles}岗`);
  if (row.role_candidates.length > 0) {
    lines.push(`- 建议新增细分岗位（优先）：${row.role_candidates.slice(0, 8).join('、')}`);
  }
  lines.push(`- BOSS检索词：${row.source_search.boss_query}`);
  lines.push(`- 小红书检索词：${row.source_search.xiaohongshu_query}`);
  lines.push('');
}

lines.push('## 平台缺失字段回填规范');
lines.push('');
for (const f of output.required_backfill_fields || []) {
  lines.push(`- ${f}`);
}
lines.push('');
lines.push('## 信息源层级');
lines.push('');
for (const [k, arr] of Object.entries(output.source_layers || {})) {
  lines.push(`- ${k}: ${(arr || []).join(' | ')}`);
}

fs.writeFileSync(outMd, lines.join('\n') + '\n', 'utf8');

console.log(`Generated ${path.relative(root, outJson)}`);
console.log(`Generated ${path.relative(root, outMd)}`);
