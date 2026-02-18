# 中国大陆应届生求职行业百科

本仓库包含针对中国大陆应届生求职市场的行业百科数据与校验脚本。

## 主要文件
- `行业百科.json`：主数据文件（当前版本 `v1.29.0`）
- `行业百科.schema.json`：JSON Schema
- `reports/`：质量报告与来源核验报告
- `scripts/`：校验与质量流水线脚本
- `data/`：辅助数据文件
- `docs/信息源分级与抓取规范_v1.29.0.md`：一级/二级证据与抓取字段规范（含最新官方链接）
- `docs/应届生决策卡模板_v1.28.0.md`：行业横向比较的三卡模板（去哪投/何时投/值不值投）

## 本次更新要点（2026-02-18）
- 版本升级到 `v1.29.0`，逐行业补齐 7 个低深度行业题库到 `8条笔试+8条面试`。
- 重点增强公共部门三行业（事业单位/公务员/央国企）：访谈与案例从 `3->5`，校招时间线从 `1->3`。
- 联网新增 2 条官方来源并接入证据链：教育部公务员材料审核通知、农业农村部面试公告（均 `HTTP 200`）。
- 修复主文件 `行业索引` 与词条 `progress` 评分口径漂移，统一质量分、分位与排序。
- 发布门槛维持通过：`top1=6.88%`、`top5=24.92%`、`has_blockers=false`。

## 校验命令
```bash
bash scripts/validate_industry_encyclopedia.sh 行业百科.schema.json 行业百科.json
bash scripts/validate_industry_references.sh 行业百科.json
node scripts/recompute_progress_v1_15.js 行业百科.json
bash scripts/run_quality_pipeline.sh 行业百科.json
bash scripts/split_industry_files.sh 行业百科.json data
```
