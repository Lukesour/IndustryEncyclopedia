# 中国大陆应届生求职行业百科

本仓库包含针对中国大陆应届生求职市场的行业百科数据与校验脚本。

## 主要文件
- `行业百科.json`：主数据文件（当前版本 `v1.37.0`）
- `行业百科.schema.json`：JSON Schema
- `reports/`：质量报告与来源核验报告
- `scripts/`：校验与质量流水线脚本
- `data/`：辅助数据文件
- `docs/信息源分级与抓取规范_v1.32.0.md`：一级/二级证据与抓取字段规范（含最新官方链接与Cookie说明）
- `docs/评分口径与扣分明细_v1.32.0.md`：行业质量分可解释字段与扣分项定义
- `docs/应届生决策卡模板_v1.28.0.md`：行业横向比较的三卡模板（去哪投/何时投/值不值投）

## 本次更新要点（2026-02-18）
- 版本升级到 `v1.37.0`，按行业逐条刷新政策变化日志与事件日志中的过期统计锚点。
- 将来源列表中的过期薪酬锚点替换为更近官方口径，并同步更新薪酬观察层的过渡说明（待工资统计发布后回归）。
- 持续联网核验新增来源可达性，并保留国家电网反爬来源的人工核验提示（需 `sgcc.com.cn` Cookie 复核）。
- 延续 `v1.35.0` 的来源修复：蔚来校招入口统一到 `https://nio.jobs.feishu.cn/campus`。
- 质量门槛继续通过：`has_blockers=false`，并保持 `source_id_url_host_mismatch=0`。

## 校验命令
```bash
bash scripts/validate_industry_encyclopedia.sh 行业百科.schema.json 行业百科.json
bash scripts/validate_industry_references.sh 行业百科.json
node scripts/recompute_progress_v1_15.js 行业百科.json
bash scripts/run_quality_pipeline.sh 行业百科.json
bash scripts/split_industry_files.sh 行业百科.json data
```
