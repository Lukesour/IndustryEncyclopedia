# 中国大陆应届生求职行业百科

本仓库包含针对中国大陆应届生求职市场的行业百科数据与校验脚本。

## 主要文件
- `行业百科.json`：主数据文件（当前版本 `v1.7.6`）
- `行业百科.schema.json`：JSON Schema
- `reports/`：质量报告与来源核验报告
- `scripts/`：校验与质量流水线脚本
- `data/`：辅助数据文件

## 本次更新要点（2026-02-16）
- 公务员/事业单位/央国企三类高缺口行业新增笔试与面试场景题并更新进度。
- 修复顺丰招聘来源链路（替换为可稳定访问的岗位详情页 URL）。
- 重跑质量流水线，更新 `reports/quality_report_latest.json` 与 `reports/quality_gate_latest.json`。

## 校验命令
```bash
bash scripts/validate_industry_encyclopedia.sh 行业百科.schema.json 行业百科.json
bash scripts/validate_industry_references.sh 行业百科.json
bash scripts/run_quality_pipeline.sh 行业百科.json
```
