# 中国大陆应届生求职行业百科

本仓库包含针对中国大陆应届生求职市场的行业百科数据与校验脚本。

## 主要文件
- `行业百科.json`：主数据文件（当前版本 `v1.30.0`）
- `行业百科.schema.json`：JSON Schema
- `reports/`：质量报告与来源核验报告
- `scripts/`：校验与质量流水线脚本
- `data/`：辅助数据文件
- `docs/信息源分级与抓取规范_v1.29.0.md`：一级/二级证据与抓取字段规范（含最新官方链接）
- `docs/应届生决策卡模板_v1.28.0.md`：行业横向比较的三卡模板（去哪投/何时投/值不值投）

## 本次更新要点（2026-02-18）
- 版本升级到 `v1.30.0`，将剩余 13 个行业题库统一补齐到 `8条笔试+8条面试`。
- 新增题目证据优先采用“行业公司官方来源 + NCSS交叉验证”，降低单一回忆样本依赖。
- 质量指标更新：`question_depth_min` 从 `14` 提升到 `16`，全行业题库深度下限提升。
- 质量门槛保持通过：`top1=6.76%`、`top5=25.02%`、`has_blockers=false`。
- 主文件行业索引与词条 `progress` 评分口径保持一致，横向排序可直接用于决策页展示。

## 校验命令
```bash
bash scripts/validate_industry_encyclopedia.sh 行业百科.schema.json 行业百科.json
bash scripts/validate_industry_references.sh 行业百科.json
node scripts/recompute_progress_v1_15.js 行业百科.json
bash scripts/run_quality_pipeline.sh 行业百科.json
bash scripts/split_industry_files.sh 行业百科.json data
```
