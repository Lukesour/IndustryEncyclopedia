# 中国大陆应届生求职行业百科

本仓库包含针对中国大陆应届生求职市场的行业百科数据与校验脚本。

## 主要文件
- `行业百科.json`：主数据文件（当前版本 `v1.25.0`）
- `行业百科.schema.json`：JSON Schema
- `reports/`：质量报告与来源核验报告
- `scripts/`：校验与质量流水线脚本
- `data/`：辅助数据文件
- `docs/信息源分级与抓取规范_v1.25.0.md`：一级/二级证据与抓取字段规范

## 本次更新要点（2026-02-17）
- 23个行业事件日志前两条改写为行业特异事件，并升级为“事实+影响+证据链”结构。
- 行业事件日志 `min_sample_size_for_verified` 统一提升到 `2`，并补齐 `publish_date/captured_at` 日期语义。
- 岗位画像库新增“高分回答示例 + 失分点 + STAR证据模板”，个性化槽位状态从 `pending_user_fill` 分离为 `pending_personalization`。
- 薪酬微观实证层按证据类型细分状态（政府统计/公司JD/offer回忆/商业平台），显式区分观察值与估算值。
- 评分脚本升级：新鲜度优先使用 `publish_date`，并新增来源独立性权重与个性化补全分层统计。
- 重跑质量流水线，更新 `reports/quality_report_latest.json` 与 `reports/quality_gate_latest.json`。

## 校验命令
```bash
bash scripts/validate_industry_encyclopedia.sh 行业百科.schema.json 行业百科.json
bash scripts/validate_industry_references.sh 行业百科.json
node scripts/recompute_progress_v1_15.js 行业百科.json
bash scripts/run_quality_pipeline.sh 行业百科.json
bash scripts/split_industry_files.sh 行业百科.json data
```
