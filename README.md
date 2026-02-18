# 中国大陆应届生求职行业百科

本仓库包含针对中国大陆应届生求职市场的行业百科数据与校验脚本。

## 主要文件
- `行业百科.json`：主数据文件（当前版本 `v1.43.1`）
- `行业百科.schema.json`：JSON Schema
- `reports/`：质量报告与来源核验报告
- `scripts/`：校验与质量流水线脚本
- `data/`：辅助数据文件
- `docs/信息源分级与抓取规范_v1.32.0.md`：一级/二级证据与抓取字段规范（含最新官方链接与Cookie说明）
- `docs/评分口径与扣分明细_v1.32.0.md`：行业质量分可解释字段与扣分项定义
- `docs/应届生决策卡模板_v1.28.0.md`：行业横向比较的三卡模板（去哪投/何时投/值不值投）
- `docs/平台样本补录指引_v1.42.1.md`：BOSS/小红书等平台样本补录字段、检索词与质检规范

## 本次更新要点（2026-02-18）
- 版本升级到 `v1.43.1`，逐行业人工重写23个行业的`10分钟投递策略`，修复模板化和病句，提升可执行性。
- 23/23 行业 `LINK_002` 升级为政策锚点直达页，`LINK_003` 统一为校招直达页，并补充“该链接证明什么”的用途说明。
- 保留并强化 BOSS/小红书补录位：当网页受限时，改用 App 检索并要求截图留证、帖子ID、发布时间、城市与岗位字段。
- 延续 `v1.43.0` 的证据一致性门禁（政策错配、`data_period` 缺失、决策薪酬源语义、决策链非200）并保持通过。

## 校验命令
```bash
bash scripts/validate_industry_encyclopedia.sh 行业百科.schema.json 行业百科.json
bash scripts/validate_industry_references.sh 行业百科.json
node scripts/recompute_progress_v1_15.js 行业百科.json
bash scripts/run_quality_pipeline.sh 行业百科.json
bash scripts/split_industry_files.sh 行业百科.json data
```
