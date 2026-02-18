# 中国大陆应届生求职行业百科

本仓库包含针对中国大陆应届生求职市场的行业百科数据与校验脚本。

## 主要文件
- `行业百科.json`：主数据文件（当前版本 `v1.44.0`）
- `行业百科.schema.json`：JSON Schema
- `reports/`：质量报告与来源核验报告
- `scripts/`：校验与质量流水线脚本
- `data/`：辅助数据文件
- `docs/信息源分级与抓取规范_v1.32.0.md`：一级/二级证据与抓取字段规范（含最新官方链接与Cookie说明）
- `docs/评分口径与扣分明细_v1.32.0.md`：行业质量分可解释字段与扣分项定义
- `docs/应届生决策卡模板_v1.28.0.md`：行业横向比较的三卡模板（去哪投/何时投/值不值投）
- `docs/平台样本补录指引_v1.42.1.md`：BOSS/小红书等平台样本补录字段、检索词与质检规范

## 本次更新要点（2026-02-18）
- 在 23/23 行业 `static.决策输出` 下新增 `深度求职指南_v1_44_2026Q1`，逐行业补齐“行业变化、岗位决策树、面试高频场景、90天准备路线、风险止损与转向”。
- 每个行业新增 BOSS/小红书运营补录位，明确信息缺口、检索关键词、必采字段与截图留证规则，便于内容运营继续补一手样本。
- 对新增权威信息源进行了联网校验与修正：明显失效的政策详情页已替换为可访问的官方入口或已验证统计页面，减少不可达链接。
- 全量同步主文件与分拆词条后，校验与质量门禁继续通过（`has_blockers=false`），并保持证据一致性硬门槛（政策错配、`data_period`、决策链语义）为 0。

## 校验命令
```bash
bash scripts/validate_industry_encyclopedia.sh 行业百科.schema.json 行业百科.json
bash scripts/validate_industry_references.sh 行业百科.json
node scripts/recompute_progress_v1_15.js 行业百科.json
bash scripts/run_quality_pipeline.sh 行业百科.json
bash scripts/split_industry_files.sh 行业百科.json data
```
