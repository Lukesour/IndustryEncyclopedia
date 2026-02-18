# 中国大陆应届生求职行业百科

本仓库包含针对中国大陆应届生求职市场的行业百科数据与校验脚本。

## 主要文件
- `行业百科.json`：主数据文件（当前版本 `v1.40.0`）
- `行业百科.schema.json`：JSON Schema
- `reports/`：质量报告与来源核验报告
- `scripts/`：校验与质量流水线脚本
- `data/`：辅助数据文件
- `docs/信息源分级与抓取规范_v1.32.0.md`：一级/二级证据与抓取字段规范（含最新官方链接与Cookie说明）
- `docs/评分口径与扣分明细_v1.32.0.md`：行业质量分可解释字段与扣分项定义
- `docs/应届生决策卡模板_v1.28.0.md`：行业横向比较的三卡模板（去哪投/何时投/值不值投）

## 本次更新要点（2026-02-18）
- 版本升级到 `v1.40.0`，完成 23/23 行业决策卡去模板化改写（投递建议、首轮策略、补投触发、止损节点均改为行业特异文本）。
- 决策卡 `C池` 已全部补齐（23/23 非空），公共部门行业采用岗位池表达，提升保底投递可执行性。
- 决策证据链语义已修正：`policy_source_id` 从统一薪酬源改为行业政策源（如工信部、能源局、证监会、国资委、国家公务员局等）。
- 决策证据链独立性已修正：`primary_source_id` 不再重复出现在 `secondary_source_ids`。
- 持续联网核验来源可达性，保留国家电网反爬来源人工核验提示（需 `sgcc.com.cn` Cookie 复核）。
- 质量门槛继续通过：`has_blockers=false`，并保持 `source_id_url_host_mismatch=0`。

## 校验命令
```bash
bash scripts/validate_industry_encyclopedia.sh 行业百科.schema.json 行业百科.json
bash scripts/validate_industry_references.sh 行业百科.json
node scripts/recompute_progress_v1_15.js 行业百科.json
bash scripts/run_quality_pipeline.sh 行业百科.json
bash scripts/split_industry_files.sh 行业百科.json data
```
