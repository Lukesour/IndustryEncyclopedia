# 中国大陆应届生求职行业百科

本仓库包含针对中国大陆应届生求职市场的行业百科数据与校验脚本。

## 主要文件
- `行业百科.json`：主数据文件（当前版本 `v1.43.0`）
- `行业百科.schema.json`：JSON Schema
- `reports/`：质量报告与来源核验报告
- `scripts/`：校验与质量流水线脚本
- `data/`：辅助数据文件
- `docs/信息源分级与抓取规范_v1.32.0.md`：一级/二级证据与抓取字段规范（含最新官方链接与Cookie说明）
- `docs/评分口径与扣分明细_v1.32.0.md`：行业质量分可解释字段与扣分项定义
- `docs/应届生决策卡模板_v1.28.0.md`：行业横向比较的三卡模板（去哪投/何时投/值不值投）
- `docs/平台样本补录指引_v1.42.1.md`：BOSS/小红书等平台样本补录字段、检索词与质检规范

## 本次更新要点（2026-02-18）
- 版本升级到 `v1.43.0`，完成证据一致性专项修复（政策日志标题/日期与证据源对齐）。
- 23/23 行业决策卡 `salary_source_id` 已统一切换到薪酬统计源，移除公司官网充当薪酬证据的语义错配。
- 关键统计证据补齐 `data_period`，支持“同口径横向比较”与回溯核查。
- 23/23 行业新增 `三层阅读卡`（30秒结论、3分钟全景、10分钟投递策略），降低用户跨字段拼接成本。
- 23/23 行业补齐运营补录位：BOSS/小红书检索词与链接、样本字段、风控说明、截图留证规则。
- 发布门禁新增：政策标题-来源一致性、政策日期-证据日期一致性、统计口径缺失、决策薪酬源语义、决策链非200来源检查。

## 校验命令
```bash
bash scripts/validate_industry_encyclopedia.sh 行业百科.schema.json 行业百科.json
bash scripts/validate_industry_references.sh 行业百科.json
node scripts/recompute_progress_v1_15.js 行业百科.json
bash scripts/run_quality_pipeline.sh 行业百科.json
bash scripts/split_industry_files.sh 行业百科.json data
```
