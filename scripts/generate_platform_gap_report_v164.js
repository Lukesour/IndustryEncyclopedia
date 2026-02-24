#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const ENTRY_DIR = path.join(ROOT, 'data', 'entries');
const OUT_JSON = path.join(ROOT, 'reports', '平台受限字段留空与检索卡_v1.64.0.json');
const OUT_MD = path.join(ROOT, 'reports', '平台受限字段留空与检索卡_v1.64.0.md');
const TODAY = '2026-02-24';

const files = fs.readdirSync(ENTRY_DIR).filter((f) => f.endsWith('.json')).sort();
const industries = [];
let totalRoles = 0;

for (const f of files) {
  const p = path.join(ENTRY_DIR, f);
  const entry = JSON.parse(fs.readFileSync(p, 'utf8'));
  const roles = entry.dynamic?.['岗位画像库']?.items || [];

  const roleCards = [];
  for (const role of roles) {
    const gap = role.platform_backfill_gap || {};
    const missing = Array.isArray(gap.missing_fields) ? gap.missing_fields : [];
    if (missing.length === 0) continue;

    roleCards.push({
      role_id: role.role_id,
      role_name: role.role_name,
      missing_fields: missing,
      where_to_search: gap.where_to_search || [],
      boss_search_url: gap.boss_search_url || null,
      boss_search_query: gap.boss_search_query || [],
      xiaohongshu_search_url: gap.xiaohongshu_search_url || null,
      xiaohongshu_search_query: gap.xiaohongshu_search_query || [],
      how_to_search: gap.how_to_search || [],
      next_backfill_action: gap.next_backfill_action || '',
      unavailable_capture_log_v164: gap.unavailable_capture_log_v164 || null
    });
  }

  if (roleCards.length > 0) {
    industries.push({
      industry_id: entry.industry_id,
      industry_name: entry['行业名称'],
      role_count_with_missing: roleCards.length,
      roles: roleCards
    });
    totalRoles += roleCards.length;
  }
}

const payload = {
  generated_at: `${TODAY}T00:00:00Z`,
  version: 'v1.64.0',
  summary: {
    industries_with_missing: industries.length,
    roles_with_missing_fields: totalRoles
  },
  industries
};

fs.writeFileSync(OUT_JSON, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

const lines = [];
lines.push('# 平台受限字段留空与检索卡（v1.64.0）');
lines.push('');
lines.push(`生成日期：${TODAY}`);
lines.push(`涉及行业：${industries.length}`);
lines.push(`涉及岗位：${totalRoles}`);
lines.push('');

for (const ind of industries) {
  lines.push(`## ${ind.industry_name}（${ind.industry_id}）`);
  lines.push('');
  for (const role of ind.roles) {
    lines.push(`### ${role.role_name}（${role.role_id}）`);
    lines.push(`- 缺失字段：${role.missing_fields.join('、')}`);
    lines.push(`- 检索入口：${(role.where_to_search || []).join('；')}`);
    if (role.boss_search_url) lines.push(`- BOSS入口：${role.boss_search_url}`);
    if ((role.boss_search_query || []).length > 0) lines.push(`- BOSS检索词：${role.boss_search_query.join(' | ')}`);
    if (role.xiaohongshu_search_url) lines.push(`- 小红书入口：${role.xiaohongshu_search_url}`);
    if ((role.xiaohongshu_search_query || []).length > 0) lines.push(`- 小红书检索词：${role.xiaohongshu_search_query.join(' | ')}`);
    if ((role.how_to_search || []).length > 0) lines.push(`- 检索方法：${role.how_to_search.join('；')}`);
    if (role.unavailable_capture_log_v164) {
      const log = role.unavailable_capture_log_v164;
      lines.push(`- 可达性：BOSS HTTP ${log.boss_search_http ?? 'NA'}；小红书 HTTP ${log.xiaohongshu_search_http ?? 'NA'}；牛客 HTTP ${log.nowcoder_http ?? 'NA'}（检查时间 ${log.checked_at || TODAY}）`);
    }
    if (role.next_backfill_action) lines.push(`- 回填动作：${role.next_backfill_action}`);
    lines.push('');
  }
}

fs.writeFileSync(OUT_MD, `${lines.join('\n')}\n`, 'utf8');
console.log(`Generated ${OUT_JSON}`);
console.log(`Generated ${OUT_MD}`);
