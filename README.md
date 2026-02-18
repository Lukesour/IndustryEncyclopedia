# 中国大陆应届生求职行业百科

本仓库包含针对中国大陆应届生求职市场的行业百科数据与校验脚本。

## 主要文件
- `行业百科.json`：主数据文件（当前版本 `v1.42.2`）
- `行业百科.schema.json`：JSON Schema
- `reports/`：质量报告与来源核验报告
- `scripts/`：校验与质量流水线脚本
- `data/`：辅助数据文件
- `docs/信息源分级与抓取规范_v1.32.0.md`：一级/二级证据与抓取字段规范（含最新官方链接与Cookie说明）
- `docs/评分口径与扣分明细_v1.32.0.md`：行业质量分可解释字段与扣分项定义
- `docs/应届生决策卡模板_v1.28.0.md`：行业横向比较的三卡模板（去哪投/何时投/值不值投）
- `docs/平台样本补录指引_v1.42.1.md`：BOSS/小红书等平台样本补录字段、检索词与质检规范

## 本次更新要点（2026-02-18）
- 版本升级到 `v1.42.2`，在 `v1.42.1` 基础上将平台补录规则结构化写入 23 个行业词条。
- 23/23 行业新增 `payload.platform_backfill_guidance`（BOSS/XIAOHONGSHU），包含检索词、链接、必填字段、操作步骤与风险说明。
- 23/23 行业 `自定义扩展` 新增运营检索占位字段：`ops_boss_search_query/url`、`ops_xiaohongshu_search_query/url`、`ops_backfill_required_fields`、`ops_backfill_min_samples_per_role_city`。
- 对小红书网页端不可稳定访问场景，保留“App端检索+截图补录”的标准化流程，不强行填入不可验证样本。
- 主文件、分拆词条和质量报告已重新同步并通过门禁校验。

## 校验命令
```bash
bash scripts/validate_industry_encyclopedia.sh 行业百科.schema.json 行业百科.json
bash scripts/validate_industry_references.sh 行业百科.json
node scripts/recompute_progress_v1_15.js 行业百科.json
bash scripts/run_quality_pipeline.sh 行业百科.json
bash scripts/split_industry_files.sh 行业百科.json data
```
