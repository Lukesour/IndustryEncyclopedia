# 中国大陆应届生求职行业百科

本仓库包含针对中国大陆应届生求职市场的行业百科数据与校验脚本。

## 主要文件
- `行业百科.json`：主数据文件（当前版本 `v1.34.0`）
- `行业百科.schema.json`：JSON Schema
- `reports/`：质量报告与来源核验报告
- `scripts/`：校验与质量流水线脚本
- `data/`：辅助数据文件
- `docs/信息源分级与抓取规范_v1.32.0.md`：一级/二级证据与抓取字段规范（含最新官方链接与Cookie说明）
- `docs/评分口径与扣分明细_v1.32.0.md`：行业质量分可解释字段与扣分项定义
- `docs/应届生决策卡模板_v1.28.0.md`：行业横向比较的三卡模板（去哪投/何时投/值不值投）

## 本次更新要点（2026-02-18）
- 版本升级到 `v1.34.0`，23个行业全部补齐结构化 `decision_cards`（去哪投/何时投/值不值投）并绑定证据链字段。
- 个性化证据层从 `132/132 pending` 提升到 `0 pending`：岗位画像库已逐角色补入公开匿名STAR样例（需用户改写为个人真实经历）。
- 决策可信度标签完成一致性校准：`A/B` 分层替代“全A”，并与 `x_decision_data_gap_note` 保持一致。
- 修正 7 个“公司官方入口”来源映射，将 BOSS 检索页替换为企业官方入口（反爬站点保留人工复核标记）。
- 低分行业（化工/智能驾驶/快消/高端制造/咨询）新增官方来源题型（笔试+面试各1条），降低单一回忆题依赖。
- 质量门槛继续通过：`has_blockers=false`，且 `source_id_url_host_mismatch=0`、`personalization_completion=100%`。

## 校验命令
```bash
bash scripts/validate_industry_encyclopedia.sh 行业百科.schema.json 行业百科.json
bash scripts/validate_industry_references.sh 行业百科.json
node scripts/recompute_progress_v1_15.js 行业百科.json
bash scripts/run_quality_pipeline.sh 行业百科.json
bash scripts/split_industry_files.sh 行业百科.json data
```
