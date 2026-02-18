# 中国大陆应届生求职行业百科

本仓库包含针对中国大陆应届生求职市场的行业百科数据与校验脚本。

## 主要文件
- `行业百科.json`：主数据文件（当前版本 `v1.28.0`）
- `行业百科.schema.json`：JSON Schema
- `reports/`：质量报告与来源核验报告
- `scripts/`：校验与质量流水线脚本
- `data/`：辅助数据文件
- `docs/信息源分级与抓取规范_v1.26.0.md`：一级/二级证据与抓取字段规范（含最新官方链接）
- `docs/应届生决策卡模板_v1.28.0.md`：行业横向比较的三卡模板（去哪投/何时投/值不值投）

## 本次更新要点（2026-02-18）
- 引入 v1.28 评分口径：在综合分中新增题库深度分、来源集中惩罚、时效惩罚，提升行业分区分度与可解释性。
- 发布硬门槛收紧：`top1<=7.5%`、`top5<=26%`、`event_log_min_count>=8`、`event_recent_180d_min_count>=6`。
- 联网新增 8 个官方来源（商务部/网信办/工信部/能源局/证监会/新闻出版署）并完成 `HTTP 200` 核验。
- 对高波动行业逐条新增政策与事件条目（互联网AI、电商跨境、新能源、传媒内容、证券基金、物流、半导体）。
- 新增《应届生决策卡统一模板》文档，支持行业横向决策输出标准化。

## 校验命令
```bash
bash scripts/validate_industry_encyclopedia.sh 行业百科.schema.json 行业百科.json
bash scripts/validate_industry_references.sh 行业百科.json
node scripts/recompute_progress_v1_15.js 行业百科.json
bash scripts/run_quality_pipeline.sh 行业百科.json
bash scripts/split_industry_files.sh 行业百科.json data
```
