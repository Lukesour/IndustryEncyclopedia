# 中国大陆应届生求职行业百科

本仓库包含针对中国大陆应届生求职市场的行业百科数据与校验脚本。

## 主要文件
- `行业百科.json`：主数据文件（当前版本 `v1.27.0`）
- `行业百科.schema.json`：JSON Schema
- `reports/`：质量报告与来源核验报告
- `scripts/`：校验与质量流水线脚本
- `data/`：辅助数据文件
- `docs/信息源分级与抓取规范_v1.26.0.md`：一级/二级证据与抓取字段规范（含最新官方链接）

## 本次更新要点（2026-02-17）
- 23个行业全部统一到“政策日志7条 + 事件日志8条”口径，消除跨行业密度不一致。
- 为剩余12个行业逐条补入官方政策/事件条目，并统一补齐 `fact/impact/industry_indicator/evidence_chain` 字段。
- 新增10个官方来源（工信部、教育部、商务部、网信办、交通运输部、国资委等）并完成 `HTTP 200` 核验。
- 全量保持 `publish_date/captured_at` 日期语义，避免“采集日抬高新鲜度”误差。
- 重跑质量流水线，事件密度提升到全行业 `min=8`，来源集中度进一步下降。

## 校验命令
```bash
bash scripts/validate_industry_encyclopedia.sh 行业百科.schema.json 行业百科.json
bash scripts/validate_industry_references.sh 行业百科.json
node scripts/recompute_progress_v1_15.js 行业百科.json
bash scripts/run_quality_pipeline.sh 行业百科.json
bash scripts/split_industry_files.sh 行业百科.json data
```
