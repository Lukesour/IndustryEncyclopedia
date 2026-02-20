const state = {
  raw: null,
  entries: [],
  metrics: new Map(),
  globalMetrics: null,
  qualityGate: null,
  selectedId: null,
  search: "",
  riskOnly: false,
};

const el = {
  metaLine: document.getElementById("metaLine"),
  searchInput: document.getElementById("searchInput"),
  riskOnlyToggle: document.getElementById("riskOnlyToggle"),
  industryList: document.getElementById("industryList"),
  globalSummary: document.getElementById("globalSummary"),
  industryView: document.getElementById("industryView"),
  emptyState: document.getElementById("emptyState"),
  fileInput: document.getElementById("fileInput"),
  headlineCard: document.getElementById("headlineCard"),
  signalsCard: document.getElementById("signalsCard"),
  guideCard: document.getElementById("guideCard"),
  decisionCard: document.getElementById("decisionCard"),
  rolesCard: document.getElementById("rolesCard"),
  questionsCard: document.getElementById("questionsCard"),
  sourcesCard: document.getElementById("sourcesCard"),
};

function safeGet(obj, path, fallback = null) {
  let cur = obj;
  for (const key of path) {
    if (!cur || typeof cur !== "object" || !(key in cur)) return fallback;
    cur = cur[key];
  }
  return cur;
}

function textLength(value, ignoreUrls = false) {
  if (typeof value === "string") {
    if (ignoreUrls && /^https?:\/\//.test(value)) return 0;
    return value.length;
  }
  if (Array.isArray(value)) return value.reduce((sum, item) => sum + textLength(item, ignoreUrls), 0);
  if (value && typeof value === "object") return Object.values(value).reduce((sum, item) => sum + textLength(item, ignoreUrls), 0);
  return 0;
}

function ratioText(v) {
  return Number.isFinite(v) ? `${(v * 100).toFixed(1)}%` : "-";
}

function isRootUrl(url) {
  try {
    const u = new URL(url);
    return !u.pathname || u.pathname === "/";
  } catch {
    return false;
  }
}

function isDateLike(v) {
  return typeof v === "string" && /^\d{4}-\d{2}-\d{2}/.test(v);
}

function pickGuide(entry) {
  const decision = safeGet(entry, ["static", "决策输出"], {});
  if (!decision || typeof decision !== "object") return {};
  if (decision["深度求职指南_v1_44_2026Q1"] && typeof decision["深度求职指南_v1_44_2026Q1"] === "object") {
    return decision["深度求职指南_v1_44_2026Q1"];
  }
  const key = Object.keys(decision).find((k) => k.includes("深度求职指南"));
  return key && typeof decision[key] === "object" ? decision[key] : {};
}

function scoreRisk(m) {
  let s = 0;
  if (m.guideCoreChars < 1200) s += 2;
  if (m.interviewRecallRatio > 0.8) s += 2;
  if (m.writtenRecallRatio > 0.8) s += 2;
  if (m.roleVariation < 4) s += 1;
  if (m.rootGuideUrlRatio > 0.25) s += 1;
  if (m.roleSpecificReadyRatio < 0.85) s += 1;
  if (m.roleDeepLinkRatio < 0.7) s += 1;
  return s;
}

function buildEntryMetrics(entry) {
  const guide = pickGuide(entry);
  const guideCoreChars = textLength(
    {
      行业变化与招聘含义: guide["行业变化与招聘含义"],
      岗位选择决策树: guide["岗位选择决策树"],
      面试高频行业场景: guide["面试高频行业场景"],
      "90天准备路线": guide["90天准备路线"],
      风险止损与转向: guide["风险止损与转向"],
      决策闭环四问: guide["决策闭环四问_v1_45_2026Q1"] || guide["决策闭环四问"],
      分人群投递策略: guide["分人群投递策略_v1_45_2026Q1"] || guide["分人群投递策略"],
    },
    true
  );

  const guideSources = Array.isArray(guide["权威信息源"]) ? guide["权威信息源"] : [];
  const rootGuideUrls = guideSources.filter((s) => isRootUrl(s.source_url)).length;
  const rootGuideUrlRatio = guideSources.length ? rootGuideUrls / guideSources.length : 0;

  const interviewItems = safeGet(entry, ["dynamic", "面试真题库", "items"], []);
  const writtenItems = safeGet(entry, ["dynamic", "笔试真题库", "items"], []);
  const roleItems = safeGet(entry, ["dynamic", "岗位画像库", "items"], []);

  const interviewMissingFramework = interviewItems.filter((x) => !Array.isArray(x.answer_framework) || x.answer_framework.length === 0).length;
  const interviewRecall = interviewItems.filter((x) => {
    const txt = `${x.question_realness_note || ""} ${safeGet(x, ["evidence", "stat_definition"], "")} ${x.question_type || ""}`;
    return /回忆|非官方/.test(txt);
  }).length;
  const writtenRecall = writtenItems.filter((x) => {
    const txt = `${x.question_realness_note || ""} ${safeGet(x, ["evidence", "stat_definition"], "")} ${x.question_type || ""}`;
    return /回忆|非官方/.test(txt);
  }).length;

  const roleVariation = new Set(roleItems.map((x) => `${x.role_readiness_floor || ""}|${x.transfer_path_hint || ""}`)).size;

  const writtenByRole = new Map();
  const interviewByRole = new Map();
  for (const q of writtenItems) {
    if (!q.role_id) continue;
    const current = writtenByRole.get(q.role_id) || { count: 0, stages: new Set() };
    current.count += 1;
    if (q.recruitment_stage) current.stages.add(q.recruitment_stage);
    writtenByRole.set(q.role_id, current);
  }
  for (const q of interviewItems) {
    if (!q.role_id) continue;
    const current = interviewByRole.get(q.role_id) || { count: 0, stages: new Set() };
    current.count += 1;
    if (q.recruitment_stage) current.stages.add(q.recruitment_stage);
    interviewByRole.set(q.role_id, current);
  }

  let roleSpecificReadyCount = 0;
  for (const role of roleItems) {
    const rid = role.role_id;
    if (!rid) continue;
    const w = writtenByRole.get(rid);
    const i = interviewByRole.get(rid);
    if (w && i && w.count >= 6 && i.count >= 6 && w.stages.size >= 4 && i.stages.size >= 4) {
      roleSpecificReadyCount += 1;
    }
  }

  const roleDeepLinkCount = roleItems.filter((r) => {
    const url = safeGet(r, ["evidence", "source_url"], "");
    return typeof url === "string" && /^https?:\/\//.test(url) && !isRootUrl(url);
  }).length;

  const platformPlaceholderRoles = roleItems.filter((r) => {
    const status = safeGet(r, ["platform_backfill_gap", "status"], "");
    return status === "completed_with_placeholders" || status === "pending";
  }).length;

  const decision = safeGet(entry, ["static", "决策输出", "decision_cards"], {});
  const whereApply = decision.where_to_apply || {};
  const applyRoleCount = (whereApply["主投岗位"] || []).length;
  const cityCount = (whereApply["主投城市"] || []).length;
  const aCount = (whereApply["A池"] || []).length;
  const bCount = (whereApply["B池"] || []).length;

  const m = {
    quality: Number(safeGet(entry, ["progress", "quality_score_overall"], 0)),
    guideCoreChars,
    guideSourcesCount: guideSources.length,
    rootGuideUrlRatio,
    interviewCount: interviewItems.length,
    interviewMissingFramework,
    interviewRecallRatio: interviewItems.length ? interviewRecall / interviewItems.length : 0,
    writtenCount: writtenItems.length,
    writtenRecallRatio: writtenItems.length ? writtenRecall / writtenItems.length : 0,
    roleCount: roleItems.length,
    roleVariation,
    roleSpecificReadyCount,
    roleSpecificReadyRatio: roleItems.length ? roleSpecificReadyCount / roleItems.length : 0,
    roleDeepLinkCount,
    roleDeepLinkRatio: roleItems.length ? roleDeepLinkCount / roleItems.length : 0,
    platformPlaceholderRoles,
    decisionShape: `${applyRoleCount}/${cityCount}/A${aCount}/B${bCount}`,
    entryUpdatedAt: safeGet(entry, ["meta", "last_updated"], safeGet(entry, ["progress", "updated_at"], "-")),
  };
  m.riskScore = scoreRisk(m);
  return m;
}

function normalizeEntries(raw) {
  const entries = Array.isArray(raw["行业词条"]) ? raw["行业词条"] : [];
  const orderMap = new Map();
  const idx = Array.isArray(raw["行业索引"]) ? raw["行业索引"] : [];
  idx.forEach((x, i) => orderMap.set(x.industry_id, x.order || i));
  entries.sort((a, b) => (orderMap.get(a.industry_id) || 999) - (orderMap.get(b.industry_id) || 999));
  return entries;
}

function computeGlobalMetrics() {
  const out = {
    industries: state.entries.length,
    rolesTotal: 0,
    writtenTotal: 0,
    interviewTotal: 0,
    highRiskIndustries: 0,
    averageQuality: 0,
    latestUpdated: "-",
  };
  let qualitySum = 0;

  for (const entry of state.entries) {
    const m = state.metrics.get(entry.industry_id);
    if (!m) continue;
    out.rolesTotal += m.roleCount;
    out.writtenTotal += m.writtenCount;
    out.interviewTotal += m.interviewCount;
    if (m.riskScore >= 3) out.highRiskIndustries += 1;
    qualitySum += m.quality;

    const entryDate = m.entryUpdatedAt;
    if (isDateLike(entryDate) && (out.latestUpdated === "-" || entryDate > out.latestUpdated)) {
      out.latestUpdated = entryDate;
    }
  }

  out.averageQuality = out.industries ? qualitySum / out.industries : 0;
  return out;
}

function setMetaLine() {
  const meta = state.raw ? safeGet(state.raw, ["文档元数据"], {}) : {};
  const version = meta["版本"] || safeGet(state.raw, ["文档元数据", "当前版本"]) || "-";
  const release = meta["发布日期"] || "-";
  const g = state.globalMetrics || {};
  const gateText = state.qualityGate ? (state.qualityGate.has_blockers ? "门禁阻断" : "门禁通过") : "门禁未加载";
  const updated = g.latestUpdated && g.latestUpdated !== "-" ? g.latestUpdated : release;
  el.metaLine.textContent = `行业 ${g.industries || state.entries.length} | 岗位 ${g.rolesTotal || 0} | 题库 ${g.writtenTotal || 0}/${g.interviewTotal || 0} | 更新 ${updated} | ${version} | ${gateText}`;
}

function entryMatches(entry, q) {
  if (!q) return true;
  const guide = pickGuide(entry);
  const text = JSON.stringify(
    {
      name: entry["行业名称"],
      guide,
      roles: safeGet(entry, ["dynamic", "岗位画像库", "items"], []),
      questions: {
        written: safeGet(entry, ["dynamic", "笔试真题库", "items"], []).slice(0, 25),
        interview: safeGet(entry, ["dynamic", "面试真题库", "items"], []).slice(0, 25),
      },
    },
    null,
    0
  );
  return text.toLowerCase().includes(q.toLowerCase());
}

function getFilteredEntries() {
  return state.entries.filter((e) => {
    const m = state.metrics.get(e.industry_id);
    if (!m) return false;
    if (state.riskOnly && m.riskScore < 3) return false;
    if (!entryMatches(e, state.search)) return false;
    return true;
  });
}

function renderGlobalSummary() {
  if (!state.raw || !state.globalMetrics) {
    el.globalSummary.classList.add("hidden");
    return;
  }

  const g = state.globalMetrics;
  const gate = state.qualityGate;
  const gateState = gate ? (gate.has_blockers ? '<span class="tag danger">阻断</span>' : '<span class="tag good">通过</span>') : '<span class="tag warn">未加载</span>';
  const gateUpdated = gate && gate.generated_at ? gate.generated_at.slice(0, 10) : "-";

  el.globalSummary.innerHTML = `
    <h3>全库总览（最新数据）</h3>
    <div class="metrics-grid">
      <div class="metric"><div class="k">行业数</div><div class="v">${g.industries}</div></div>
      <div class="metric"><div class="k">细分岗位总数</div><div class="v">${g.rolesTotal}</div></div>
      <div class="metric"><div class="k">笔试题总数</div><div class="v">${g.writtenTotal}</div></div>
      <div class="metric"><div class="k">面试题总数</div><div class="v">${g.interviewTotal}</div></div>
      <div class="metric"><div class="k">平均质量分</div><div class="v">${g.averageQuality.toFixed(1)}</div></div>
      <div class="metric"><div class="k">高风险行业</div><div class="v">${g.highRiskIndustries}</div></div>
      <div class="metric"><div class="k">数据最新更新日</div><div class="v">${g.latestUpdated}</div></div>
      <div class="metric"><div class="k">质量门禁</div><div class="v">${gateState}</div></div>
    </div>
    <p class="note">门禁快照日期：${gateUpdated}。${gate ? `source_http_200=${ratioText((safeGet(gate, ["gates", "source_http_200_ratio_percent"], 0) || 0) / 100)}；题干重复率=${(safeGet(gate, ["gates", "question_prompt_duplicate_percent_v158"], 0) || 0).toFixed(2)}%。` : "若要展示门禁详情，请确认 reports/quality_gate_latest.json 可访问。"}</p>
  `;
  el.globalSummary.classList.remove("hidden");
}

function renderIndustryList() {
  const list = getFilteredEntries();
  el.industryList.innerHTML = "";
  if (!list.length) {
    el.industryList.innerHTML = `<div class="note">没有匹配的行业，请调整搜索条件。</div>`;
    return;
  }

  for (const entry of list) {
    const m = state.metrics.get(entry.industry_id);
    const item = document.createElement("div");
    item.className = `industry-item ${entry.industry_id === state.selectedId ? "active" : ""}`;
    item.innerHTML = `
      <div class="name">${entry["行业名称"]}</div>
      <div class="industry-meta">
        <span class="tag">质量 ${m.quality.toFixed(1)}</span>
        <span class="tag">岗 ${m.roleCount}</span>
        <span class="tag">题 ${m.writtenCount + m.interviewCount}</span>
        <span class="tag ${m.riskScore >= 4 ? "danger" : m.riskScore >= 3 ? "warn" : "good"}">风险 ${m.riskScore}</span>
        <span class="tag">回忆题 ${ratioText(Math.max(m.writtenRecallRatio, m.interviewRecallRatio))}</span>
      </div>
    `;
    item.addEventListener("click", () => {
      state.selectedId = entry.industry_id;
      render();
    });
    el.industryList.appendChild(item);
  }
}

function renderHeadline(entry, m) {
  el.headlineCard.innerHTML = `
    <h2>${entry["行业名称"]}</h2>
    <p>行业ID：<span class="mono">${entry.industry_id}</span> | 状态：${safeGet(entry, ["meta", "status"], "-")} | 质量分：${m.quality.toFixed(1)} | 最近更新：${m.entryUpdatedAt || "-"}</p>
    <div class="metrics-grid">
      <div class="metric"><div class="k">细分岗位数</div><div class="v">${m.roleCount}</div></div>
      <div class="metric"><div class="k">面试题数量</div><div class="v">${m.interviewCount}</div></div>
      <div class="metric"><div class="k">笔试题数量</div><div class="v">${m.writtenCount}</div></div>
      <div class="metric"><div class="k">角色专属覆盖</div><div class="v">${m.roleSpecificReadyCount}/${m.roleCount}</div></div>
      <div class="metric"><div class="k">岗位深链占比</div><div class="v">${ratioText(m.roleDeepLinkRatio)}</div></div>
      <div class="metric"><div class="k">决策卡结构</div><div class="v">${m.decisionShape}</div></div>
      <div class="metric"><div class="k">深度正文字符</div><div class="v">${m.guideCoreChars}</div></div>
      <div class="metric"><div class="k">审阅风险分</div><div class="v">${m.riskScore}</div></div>
    </div>
  `;
}

function renderSignals(entry, m) {
  const hints = [];
  if (m.guideCoreChars < 1200) hints.push(`<span class="tag warn">深度正文偏短（${m.guideCoreChars}）</span>`);
  if (m.interviewRecallRatio > 0.8) hints.push(`<span class="tag danger">面试回忆题占比高（${ratioText(m.interviewRecallRatio)}）</span>`);
  if (m.writtenRecallRatio > 0.8) hints.push(`<span class="tag danger">笔试回忆题占比高（${ratioText(m.writtenRecallRatio)}）</span>`);
  if (m.rootGuideUrlRatio > 0.25) hints.push(`<span class="tag warn">权威源首页链接偏多（${ratioText(m.rootGuideUrlRatio)}）</span>`);
  if (m.roleVariation < 4) hints.push(`<span class="tag warn">岗位画像差异度不足（${m.roleVariation}）</span>`);
  if (m.roleSpecificReadyRatio < 0.9) hints.push(`<span class="tag warn">角色专属题覆盖偏低（${ratioText(m.roleSpecificReadyRatio)}）</span>`);
  if (m.roleDeepLinkRatio < 0.7) hints.push(`<span class="tag warn">岗位深链占比偏低（${ratioText(m.roleDeepLinkRatio)}）</span>`);
  if (!hints.length) hints.push(`<span class="tag good">当前行业关键审阅项无明显阻塞</span>`);

  const manualVerifyCount = (entry.sources || []).filter((s) => s.manual_verification_required).length;

  el.signalsCard.innerHTML = `
    <h3>审阅信号</h3>
    <div class="industry-meta">${hints.join("")}</div>
    <div class="metrics-grid">
      <div class="metric"><div class="k">面试框架缺口</div><div class="v">${m.interviewMissingFramework}</div></div>
      <div class="metric"><div class="k">面试回忆题占比</div><div class="v">${ratioText(m.interviewRecallRatio)}</div></div>
      <div class="metric"><div class="k">笔试回忆题占比</div><div class="v">${ratioText(m.writtenRecallRatio)}</div></div>
      <div class="metric"><div class="k">岗位画像差异度</div><div class="v">${m.roleVariation}</div></div>
      <div class="metric"><div class="k">权威源首页占比</div><div class="v">${ratioText(m.rootGuideUrlRatio)}</div></div>
      <div class="metric"><div class="k">来源人工核验</div><div class="v">${manualVerifyCount}</div></div>
      <div class="metric"><div class="k">角色专属达标岗位</div><div class="v">${m.roleSpecificReadyCount}/${m.roleCount}</div></div>
      <div class="metric"><div class="k">平台待补岗位</div><div class="v">${m.platformPlaceholderRoles}</div></div>
    </div>
  `;
}

function renderGuide(entry) {
  const guide = pickGuide(entry);
  const sections = [
    ["行业变化与招聘含义", guide["行业变化与招聘含义"]],
    ["岗位选择决策树", guide["岗位选择决策树"]],
    ["面试高频行业场景", guide["面试高频行业场景"]],
    ["90天准备路线", guide["90天准备路线"]],
    ["风险止损与转向", guide["风险止损与转向"]],
    ["决策闭环四问", guide["决策闭环四问_v1_45_2026Q1"] || guide["决策闭环四问"]],
  ];

  const sectionHtml = sections
    .map(([title, value]) => {
      if (!value) return "";
      if (Array.isArray(value)) {
        return `<h4>${title}</h4><ul class="list">${value.map((x) => `<li>${x}</li>`).join("")}</ul>`;
      }
      if (typeof value === "object") {
        return `<h4>${title}</h4><ul class="list">${Object.entries(value)
          .map(([k, v]) => `<li><strong>${k}</strong>：${typeof v === "string" ? v : JSON.stringify(v)}</li>`)
          .join("")}</ul>`;
      }
      return `<h4>${title}</h4><p>${value}</p>`;
    })
    .join("");

  const sources = Array.isArray(guide["权威信息源"]) ? guide["权威信息源"] : [];
  const sourceHtml = sources
    .map(
      (s) => `<tr>
        <td><span class="mono">${s.source_id || "-"}</span></td>
        <td>${s.source_name || "-"}</td>
        <td>${s.evidence_level || "-"}</td>
        <td>${s.usage || "-"}</td>
        <td><a class="source-link" href="${s.source_url || "#"}" target="_blank" rel="noopener">打开</a></td>
      </tr>`
    )
    .join("");

  el.guideCard.innerHTML = `
    <h3>深度求职指南</h3>
    ${sectionHtml || `<p class="note">暂无深度求职指南内容</p>`}
    <h4>权威信息源</h4>
    <div class="table-wrap">
      <table>
        <thead><tr><th>source_id</th><th>来源</th><th>层级</th><th>用途</th><th>链接</th></tr></thead>
        <tbody>${sourceHtml || `<tr><td colspan="5">暂无来源</td></tr>`}</tbody>
      </table>
    </div>
  `;
}

function renderDecision(entry) {
  const decision = safeGet(entry, ["static", "决策输出", "decision_cards"], {});
  const whereApply = decision.where_to_apply || {};
  const guide = pickGuide(entry);
  const matrix =
    decision["分人群投递矩阵_v1_45_2026Q1"] ||
    guide["分人群投递策略_v1_45_2026Q1"] ||
    guide["分人群投递策略"] ||
    [];
  const gateHint = decision["决策门禁提示_v1_45_2026Q1"] || decision["决策门禁提示"] || "-";

  const matrixHtml = (Array.isArray(matrix) ? matrix : [])
    .map(
      (x) => `<div class="matrix-card">
        <div class="title">${x["人群标签"] || "未命名人群"}</div>
        <p><strong>主投岗位：</strong>${x["主投岗位"] || "-"}</p>
        <p><strong>城市策略：</strong>${x["城市策略"] || "-"}</p>
        <p><strong>公司池策略：</strong>${x["公司池策略"] || "-"}</p>
        <p><strong>止损阈值：</strong>${x["止损阈值"] || "-"}</p>
      </div>`
    )
    .join("");

  el.decisionCard.innerHTML = `
    <h3>决策卡与分人群矩阵</h3>
    <div class="table-wrap">
      <table>
        <thead><tr><th>字段</th><th>内容</th></tr></thead>
        <tbody>
          <tr><td>主投岗位</td><td>${(whereApply["主投岗位"] || []).join("、") || "-"}</td></tr>
          <tr><td>主投城市</td><td>${(whereApply["主投城市"] || []).join("、") || "-"}</td></tr>
          <tr><td>A池</td><td>${(whereApply["A池"] || []).join("、") || "-"}</td></tr>
          <tr><td>B池</td><td>${(whereApply["B池"] || []).join("、") || "-"}</td></tr>
          <tr><td>门禁提示</td><td>${gateHint}</td></tr>
        </tbody>
      </table>
    </div>
    <h4>分人群投递策略</h4>
    <div class="matrix-grid">${matrixHtml || `<div class="note">当前行业尚未补充分人群矩阵。</div>`}</div>
  `;
}

function renderRoles(entry) {
  const roles = safeGet(entry, ["dynamic", "岗位画像库", "items"], []);
  const rows = roles
    .map((r) => {
      const sourceName = safeGet(r, ["evidence", "source_name"], "-");
      const gapStatus = safeGet(r, ["platform_backfill_gap", "status"], "-");
      const missingFields = safeGet(r, ["platform_backfill_gap", "missing_fields"], []);
      const gapText = `${gapStatus}${Array.isArray(missingFields) && missingFields.length ? `（待补${missingFields.length}项）` : ""}`;
      return `<tr>
        <td>${r.role_name || "-"}</td>
        <td>${r.role_readiness_floor || "-"}</td>
        <td>${r.transfer_path_hint || "-"}</td>
        <td>${sourceName}</td>
        <td>${gapText}</td>
      </tr>`;
    })
    .join("");

  el.rolesCard.innerHTML = `
    <h3>岗位画像库（${roles.length}）</h3>
    <div class="table-wrap">
      <table>
        <thead><tr><th>岗位</th><th>入行门槛</th><th>转岗提示</th><th>主证据</th><th>平台补录状态</th></tr></thead>
        <tbody>${rows || `<tr><td colspan="5">暂无岗位画像</td></tr>`}</tbody>
      </table>
    </div>
  `;
}

function renderQuestions(entry) {
  const PREVIEW_LIMIT = 30;
  const written = safeGet(entry, ["dynamic", "笔试真题库", "items"], []);
  const interview = safeGet(entry, ["dynamic", "面试真题库", "items"], []);

  function renderOne(q) {
    const fw = Array.isArray(q.answer_framework) ? q.answer_framework : [];
    return `<details>
      <summary>${q.question_id || "-"} | ${q.role_name || "-"} | ${q.question_type || "-"}</summary>
      <div class="question-body">
        <p><strong>题干：</strong>${q.prompt || "-"}</p>
        <p><strong>阶段：</strong>${q.round_label || "-"}（${q.recruitment_stage || "-"}） | <strong>年份：</strong>${q.question_year || "-"}</p>
        <p><strong>真实性说明：</strong>${q.question_realness_note || "-"}</p>
        <p><strong>来源：</strong><span class="mono">${safeGet(q, ["evidence", "source_id"], "-")}</span> / ${safeGet(q, ["evidence", "source_name"], "-")} / <a class="source-link" href="${safeGet(q, ["evidence", "source_url"], "#")}" target="_blank" rel="noopener">链接</a></p>
        <p><strong>答题框架：</strong>${fw.length ? fw.join(" → ") : "-"}</p>
      </div>
    </details>`;
  }

  const writtenPreview = written.slice(0, PREVIEW_LIMIT);
  const interviewPreview = interview.slice(0, PREVIEW_LIMIT);

  const writtenHtml = writtenPreview.map(renderOne).join("");
  const interviewHtml = interviewPreview.map(renderOne).join("");

  el.questionsCard.innerHTML = `
    <h3>题库审阅</h3>
    <h4>笔试真题库（${written.length}）</h4>
    ${written.length > PREVIEW_LIMIT ? `<p class="note">当前仅展示前 ${PREVIEW_LIMIT} 条笔试题以提升页面性能。</p>` : ""}
    ${writtenHtml || `<p class="note">暂无笔试题</p>`}
    <h4>面试真题库（${interview.length}）</h4>
    ${interview.length > PREVIEW_LIMIT ? `<p class="note">当前仅展示前 ${PREVIEW_LIMIT} 条面试题以提升页面性能。</p>` : ""}
    ${interviewHtml || `<p class="note">暂无面试题</p>`}
  `;
}

function renderSources(entry) {
  const sources = Array.isArray(entry.sources) ? entry.sources : [];
  const rows = sources
    .map(
      (s) => `<tr>
        <td><span class="mono">${s.source_id || "-"}</span></td>
        <td>${s.source_name || "-"}</td>
        <td>${s.source_type || "-"}</td>
        <td>${s.http_status ?? "-"}</td>
        <td>${s.manual_verification_required ? `<span class="tag warn">需人工核验</span>` : `<span class="tag good">已核验</span>`}</td>
        <td><a class="source-link" href="${s.source_url || "#"}" target="_blank" rel="noopener">打开</a></td>
      </tr>`
    )
    .join("");

  el.sourcesCard.innerHTML = `
    <h3>来源与证据链（${sources.length}）</h3>
    <div class="table-wrap">
      <table>
        <thead><tr><th>source_id</th><th>来源名</th><th>类型</th><th>HTTP</th><th>核验</th><th>链接</th></tr></thead>
        <tbody>${rows || `<tr><td colspan="6">暂无来源</td></tr>`}</tbody>
      </table>
    </div>
  `;
}

function renderMainView() {
  const entry = state.entries.find((e) => e.industry_id === state.selectedId);
  if (!entry) {
    el.industryView.classList.add("hidden");
    el.emptyState.classList.remove("hidden");
    return;
  }

  const m = state.metrics.get(entry.industry_id);
  el.emptyState.classList.add("hidden");
  el.industryView.classList.remove("hidden");

  renderHeadline(entry, m);
  renderSignals(entry, m);
  renderGuide(entry);
  renderDecision(entry);
  renderRoles(entry);
  renderQuestions(entry);
  renderSources(entry);
}

function render() {
  renderGlobalSummary();
  renderIndustryList();
  renderMainView();
}

function afterLoad(raw) {
  state.raw = raw;
  state.entries = normalizeEntries(raw);
  state.metrics.clear();
  for (const e of state.entries) state.metrics.set(e.industry_id, buildEntryMetrics(e));
  state.globalMetrics = computeGlobalMetrics();

  if (!state.selectedId && state.entries.length) {
    state.selectedId = state.entries[0].industry_id;
  }

  setMetaLine();
  render();
}

async function loadFromFetch() {
  const candidates = ["../行业百科.json", "/行业百科.json", "行业百科.json"];
  for (const url of candidates) {
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) continue;
      const raw = await res.json();
      if (raw && Array.isArray(raw["行业词条"])) {
        afterLoad(raw);
        return true;
      }
    } catch {
      // continue
    }
  }
  return false;
}

async function loadQualityGateLatest() {
  const candidates = ["../reports/quality_gate_latest.json", "/reports/quality_gate_latest.json", "reports/quality_gate_latest.json"];
  for (const url of candidates) {
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) continue;
      const raw = await res.json();
      if (raw && typeof raw === "object" && raw.gates) {
        state.qualityGate = raw;
        return true;
      }
    } catch {
      // continue
    }
  }
  return false;
}

function bindEvents() {
  el.searchInput.addEventListener("input", (e) => {
    state.search = e.target.value.trim();
    render();
  });

  el.riskOnlyToggle.addEventListener("change", (e) => {
    state.riskOnly = !!e.target.checked;
    const filtered = getFilteredEntries();
    if (!filtered.some((x) => x.industry_id === state.selectedId) && filtered.length) {
      state.selectedId = filtered[0].industry_id;
    }
    render();
  });

  el.fileInput.addEventListener("change", async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    try {
      const text = await file.text();
      const raw = JSON.parse(text);
      afterLoad(raw);
      await loadQualityGateLatest();
      setMetaLine();
      render();
    } catch {
      alert("JSON 解析失败，请确认文件是有效的行业百科主文件。");
    }
  });
}

async function bootstrap() {
  bindEvents();
  const ok = await loadFromFetch();
  if (!ok) {
    el.emptyState.classList.remove("hidden");
    el.industryView.classList.add("hidden");
    el.globalSummary.classList.add("hidden");
    el.metaLine.textContent = "未自动加载到数据，请启动本地服务或手动上传 JSON。";
    return;
  }

  await loadQualityGateLatest();
  setMetaLine();
  render();
}

bootstrap();
