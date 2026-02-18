# 中国大陆应届生求职行业百科

本仓库包含针对中国大陆应届生求职市场的行业百科数据与校验脚本。

## 主要文件
- `行业百科.json`：主数据文件（当前版本 `v1.33.0`）
- `行业百科.schema.json`：JSON Schema
- `reports/`：质量报告与来源核验报告
- `scripts/`：校验与质量流水线脚本
- `data/`：辅助数据文件
- `docs/信息源分级与抓取规范_v1.32.0.md`：一级/二级证据与抓取字段规范（含最新官方链接与Cookie说明）
- `docs/评分口径与扣分明细_v1.32.0.md`：行业质量分可解释字段与扣分项定义
- `docs/应届生决策卡模板_v1.28.0.md`：行业横向比较的三卡模板（去哪投/何时投/值不值投）

## 本次更新要点（2026-02-18）
- 版本升级到 `v1.33.0`，继续增强区域样本覆盖：非公共部门行业普遍具备 `t3_regional` 层级样本。
- 新增 5 个高波动行业的区域城市薪酬观察样本（互联网、电商、新能源、半导体、证券基金），提升城市覆盖区分度。
- 对公共部门行业补充“企业化t3口径不强制适用”说明，避免横向比较口径误用。
- 对咨询/能源/银行补充区域样本待补入口ID，方便你后续手工补齐真实区域龙头招聘来源。
- 质量门槛继续通过：`has_blockers=false`，来源集中度仍低于发布上限。

## 校验命令
```bash
bash scripts/validate_industry_encyclopedia.sh 行业百科.schema.json 行业百科.json
bash scripts/validate_industry_references.sh 行业百科.json
node scripts/recompute_progress_v1_15.js 行业百科.json
bash scripts/run_quality_pipeline.sh 行业百科.json
bash scripts/split_industry_files.sh 行业百科.json data
```
