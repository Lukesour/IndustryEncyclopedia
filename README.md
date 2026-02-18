# 中国大陆应届生求职行业百科

本仓库包含针对中国大陆应届生求职市场的行业百科数据与校验脚本。

## 主要文件
- `行业百科.json`：主数据文件（当前版本 `v1.31.0`）
- `行业百科.schema.json`：JSON Schema
- `reports/`：质量报告与来源核验报告
- `scripts/`：校验与质量流水线脚本
- `data/`：辅助数据文件
- `docs/信息源分级与抓取规范_v1.29.0.md`：一级/二级证据与抓取字段规范（含最新官方链接）
- `docs/应届生决策卡模板_v1.28.0.md`：行业横向比较的三卡模板（去哪投/何时投/值不值投）

## 本次更新要点（2026-02-18）
- 版本升级到 `v1.31.0`，补齐剩余 2 个行业的月度校招时间线，23 个行业全部达到“至少 2 条时间线样本”。
- 全行业时间线统一为“行业窗口 + 企业批次”双层结构，支持按月投递节奏决策。
- 新增时间线条目均挂载公司官方来源，并保留 NCSS/人社部二级交叉验证。
- 质量门槛保持通过：`top1=6.68%`、`top5=24.69%`、`has_blockers=false`。
- 全行业题库深度继续保持下限：`question_depth_min=16`。

## 校验命令
```bash
bash scripts/validate_industry_encyclopedia.sh 行业百科.schema.json 行业百科.json
bash scripts/validate_industry_references.sh 行业百科.json
node scripts/recompute_progress_v1_15.js 行业百科.json
bash scripts/run_quality_pipeline.sh 行业百科.json
bash scripts/split_industry_files.sh 行业百科.json data
```
