# 平台可达性与补录留空位说明（2026-02-19）

> 用途：记录官方入口与平台入口可达性，明确受限时的留空位字段和检索路径。

| 入口 | 请求URL | HTTP状态 | 最终URL | 结论 |
|---|---|---:|---|---|
| 教育部 | https://www.moe.gov.cn/ | 200 | http://www.moe.gov.cn/ | 可访问 |
| 人社部中国公共招聘网 | https://chinajob.mohrss.gov.cn/ | 200 | https://chinajob.mohrss.gov.cn/ | 可访问 |
| NCSS | https://www.ncss.cn/ | 200 | https://www.ncss.cn/ | 可访问 |
| 国家公务员局 | http://www.scs.gov.cn/ | 200 | http://www.scs.gov.cn/ | 可访问 |
| BOSS职位搜索 | https://www.zhipin.com/web/geek/job?query=%E5%BA%94%E5%B1%8A%E7%94%9F%20%E4%BA%92%E8%81%94%E7%BD%91%E4%B8%8EAI%20%E5%90%8E%E7%AB%AF%E5%BC%80%E5%8F%91 | 200 | https://www.zhipin.com/web/geek/job?query=%E5%BA%94%E5%B1%8A%E7%94%9F%20%E4%BA%92%E8%81%94%E7%BD%91%E4%B8%8EAI%20%E5%90%8E%E7%AB%AF%E5%BC%80%E5%8F%91 | 可访问 |
| 小红书搜索页 | https://www.xiaohongshu.com/search_result/?keyword=%E4%BA%92%E8%81%94%E7%BD%91%E4%B8%8EAI%20%E6%A0%A1%E6%8B%9B%20%E9%9D%A2%E7%BB%8F | 200 | https://www.xiaohongshu.com/search_result/?keyword=%E4%BA%92%E8%81%94%E7%BD%91%E4%B8%8EAI%20%E6%A0%A1%E6%8B%9B%20%E9%9D%A2%E7%BB%8F | 可访问 |
| 牛客笔试 | https://www.nowcoder.com/exam/company?questionJobId=10&subTabName=written_page | 200 | https://www.nowcoder.com/exam/company?questionJobId=10&subTabName=written_page | 可访问 |
| 牛客面试 | https://www.nowcoder.com/exam/interview?questionJobId=10&subTabName=interview_page | 200 | https://www.nowcoder.com/exam/interview?questionJobId=10&subTabName=interview_page | 可访问 |

## 受限时必须留空位并补录的信息

- 岗位名称
- 城市
- 公司层级
- 批次/轮次
- 薪资区间（P25/P50/P75）
- 发布时间
- 来源链接或帖子ID
- 样本量
- 截图路径与截图时间

## 检索方法

- 先官方后平台：先企业官网岗位详情页/公告页，再补平台样本。
- BOSS：`应届生 + 行业 + 岗位 + 城市`。
- 小红书：`行业 + 岗位 + 校招/面经/offer`，优先App检索并记录帖子ID与截图时间。
- 缺失城市/薪资/发布时间的样本仅作低置信补充，不进入强结论。
