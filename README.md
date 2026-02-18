# 中国大陆应届生求职行业百科

本仓库包含针对中国大陆应届生求职市场的行业百科数据与校验脚本。

## 主要文件
- `行业百科.json`：主数据文件（当前版本 `v1.34.1`）
- `行业百科.schema.json`：JSON Schema
- `reports/`：质量报告与来源核验报告
- `scripts/`：校验与质量流水线脚本
- `data/`：辅助数据文件
- `docs/信息源分级与抓取规范_v1.32.0.md`：一级/二级证据与抓取字段规范（含最新官方链接与Cookie说明）
- `docs/评分口径与扣分明细_v1.32.0.md`：行业质量分可解释字段与扣分项定义
- `docs/应届生决策卡模板_v1.28.0.md`：行业横向比较的三卡模板（去哪投/何时投/值不值投）

## 本次更新要点（2026-02-18）
- 版本升级到 `v1.34.1`，继续逐条手工补强7个行业的官方来源题型（笔试+面试），降低题库对回忆题单点依赖。
- 继续逐条手工补充7条城市薪酬观测样本（成都/武汉/西安），并回收对应城市缺口待填位。
- 公共部门条目（公务员/事业单位/央国企）补入官方考试大纲与公告映射题，提升可追溯性与训练可执行性。
- 来源链路修正：埃斯顿与中国石油来源替换为可访问官方页面，并同步更新证据字段。
- 对仍有反爬策略的官方站点（如蔚来、国家电网）保留人工核验标记，避免误判为可稳定自动抓取。
- 质量门槛继续通过：`has_blockers=false`，并保持 `source_id_url_host_mismatch=0`。

## 校验命令
```bash
bash scripts/validate_industry_encyclopedia.sh 行业百科.schema.json 行业百科.json
bash scripts/validate_industry_references.sh 行业百科.json
node scripts/recompute_progress_v1_15.js 行业百科.json
bash scripts/run_quality_pipeline.sh 行业百科.json
bash scripts/split_industry_files.sh 行业百科.json data
```
