# 中国大陆应届生求职行业百科

本仓库包含针对中国大陆应届生求职市场的行业百科数据与校验脚本。

## 主要文件
- `行业百科.json`：主数据文件（当前版本 `v1.35.0`）
- `行业百科.schema.json`：JSON Schema
- `reports/`：质量报告与来源核验报告
- `scripts/`：校验与质量流水线脚本
- `data/`：辅助数据文件
- `docs/信息源分级与抓取规范_v1.32.0.md`：一级/二级证据与抓取字段规范（含最新官方链接与Cookie说明）
- `docs/评分口径与扣分明细_v1.32.0.md`：行业质量分可解释字段与扣分项定义
- `docs/应届生决策卡模板_v1.28.0.md`：行业横向比较的三卡模板（去哪投/何时投/值不值投）

## 本次更新要点（2026-02-18）
- 版本升级到 `v1.35.0`，并将蔚来来源切换为可稳定访问的官方校招入口（`https://nio.jobs.feishu.cn/campus`），同步更新证据链URL。
- 为5个高波动行业（互联网与AI、跨境电商、新能源、金融-银行、汽车与智能驾驶）逐条新增第3条争议问题与结论，采用2025Q4-2026Q1官方来源。
- 为上述5个行业逐条新增可执行月度投递日历（提前批/主批/签约/春招补录），增强“何时投”的决策能力。
- 对仍受反爬策略限制的官方站点（国家电网）继续保留人工核验标记，避免误判为可稳定自动抓取。
- 质量门槛继续通过：`has_blockers=false`，并保持 `source_id_url_host_mismatch=0`。

## 校验命令
```bash
bash scripts/validate_industry_encyclopedia.sh 行业百科.schema.json 行业百科.json
bash scripts/validate_industry_references.sh 行业百科.json
node scripts/recompute_progress_v1_15.js 行业百科.json
bash scripts/run_quality_pipeline.sh 行业百科.json
bash scripts/split_industry_files.sh 行业百科.json data
```
