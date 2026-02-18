# 中国大陆应届生求职行业百科

本仓库包含针对中国大陆应届生求职市场的行业百科数据与校验脚本。

## 主要文件
- `行业百科.json`：主数据文件（当前版本 `v1.42.1`）
- `行业百科.schema.json`：JSON Schema
- `reports/`：质量报告与来源核验报告
- `scripts/`：校验与质量流水线脚本
- `data/`：辅助数据文件
- `docs/信息源分级与抓取规范_v1.32.0.md`：一级/二级证据与抓取字段规范（含最新官方链接与Cookie说明）
- `docs/评分口径与扣分明细_v1.32.0.md`：行业质量分可解释字段与扣分项定义
- `docs/应届生决策卡模板_v1.28.0.md`：行业横向比较的三卡模板（去哪投/何时投/值不值投）
- `docs/平台样本补录指引_v1.42.1.md`：BOSS/小红书等平台样本补录字段、检索词与质检规范

## 本次更新要点（2026-02-18）
- 版本升级到 `v1.42.1`，全行业决策卡 `salary_source_id` 从单一统计源切换为行业薪酬实证源。
- 23/23行业 `自定义扩展` 新增 BOSS/小红书补录指引，明确“岗位/城市/薪资区间/发布时间/链接/样本量”必填字段。
- 逐条修正规范：访谈与案例中官方来源样本统一标记为 `official`，并规范 `data_origin` 语义。
- 新增 `docs/平台样本补录指引_v1.42.1.md`，给出可达性核验、逐行业检索词和质检规则。
- 联网复核招聘与就业入口（BOSS、智联、猎聘、前程无忧、NCSS、中国公共招聘网等）。

## 校验命令
```bash
bash scripts/validate_industry_encyclopedia.sh 行业百科.schema.json 行业百科.json
bash scripts/validate_industry_references.sh 行业百科.json
node scripts/recompute_progress_v1_15.js 行业百科.json
bash scripts/run_quality_pipeline.sh 行业百科.json
bash scripts/split_industry_files.sh 行业百科.json data
```
