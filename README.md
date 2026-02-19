# 中国大陆应届生求职行业百科

本仓库包含针对中国大陆应届生求职市场的行业百科数据与校验脚本。

## 主要文件
- `行业百科.json`：主数据文件（当前版本 `v1.46.0`）
- `行业百科.schema.json`：JSON Schema
- `reports/`：质量报告与来源核验报告
- `scripts/`：校验与质量流水线脚本
- `data/`：辅助数据文件
- `docs/信息源分级与抓取规范_v1.32.0.md`：一级/二级证据与抓取字段规范（含最新官方链接与Cookie说明）
- `docs/题库同权与扩容规则_v1.45.0.md`：题库同权规则、扩容目标与去模板化门槛
- `docs/23行业细分岗位与题库扩展包_v1.46.0.md`：23行业逐行业扩展内容（细分岗位、笔面试题、平台补录位）
- `docs/评分口径与扣分明细_v1.32.0.md`：行业质量分可解释字段与扣分项定义
- `docs/应届生决策卡模板_v1.28.0.md`：行业横向比较的三卡模板（去哪投/何时投/值不值投）
- `docs/平台样本补录指引_v1.42.1.md`：BOSS/小红书等平台样本补录字段、检索词与质检规范
- `reports/全量扩容执行清单_v1.45.0.md`：23行业逐行业扩容清单（岗位、题库、缺口与检索入口）
- `reports/全量扩容执行清单_v1.45.0.json`：结构化扩容清单，可直接分配执行

## 本次更新要点（2026-02-19）
- 主数据升级到 `v1.46.0`，保留“题库同权策略”（official_original / real_recall / jd_mapping 同权训练）。
- 新增 `docs/23行业细分岗位与题库扩展包_v1.46.0.md`：23行业逐行业补充细分岗位、笔试题、面试题与补录位。
- 每行业均补充平台受限场景下的缺口字段、检索关键词、搜索入口和补录步骤（BOSS/小红书/企业官网）。
- 联网核验延续（2026-02-19）：BOSS 可访问；小红书网页检索仍受限（404/风控），需 App 检索+截图留证。

## 校验命令
```bash
bash scripts/validate_industry_encyclopedia.sh 行业百科.schema.json 行业百科.json
bash scripts/validate_industry_references.sh 行业百科.json
node scripts/recompute_progress_v1_15.js 行业百科.json
bash scripts/run_quality_pipeline.sh 行业百科.json
bash scripts/split_industry_files.sh 行业百科.json data
```

## 前端审阅页
已新增静态审阅页：`review-ui/`，用于逐行业查看深度指南、决策卡、岗位画像、题库与来源证据，帮助快速判断需要增删改的信息。

启动方式：
```bash
python3 -m http.server 8000
```

浏览器打开：
`http://localhost:8000/review-ui/`

页面能力：
- 行业搜索与“仅看高风险行业”过滤
- 审阅信号看板（深度长度、回忆题占比、来源首页占比、岗位画像差异度）
- 深度指南、决策卡、题库、来源全量展开查看
- 自动加载失败时支持手动上传 `行业百科.json`
