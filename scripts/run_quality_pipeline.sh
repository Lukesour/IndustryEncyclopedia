#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DATA_PATH="${1:-${ROOT_DIR}/行业百科.json}"
REPORT_DIR="${ROOT_DIR}/reports"
DATE_TAG="$(date +%Y%m%d)"
REPORT_PATH="${REPORT_DIR}/quality_report_${DATE_TAG}.json"
LATEST_PATH="${REPORT_DIR}/quality_report_latest.json"
GATE_PATH="${REPORT_DIR}/quality_gate_${DATE_TAG}.json"
LATEST_GATE_PATH="${REPORT_DIR}/quality_gate_latest.json"

mkdir -p "${REPORT_DIR}"

"${ROOT_DIR}/scripts/validate_industry_encyclopedia.sh" "${ROOT_DIR}/行业百科.schema.json" "${DATA_PATH}"

jq '
def stddev($arr):
  if ($arr | length) == 0 then 0
  else
    ($arr | add / length) as $mean
    | (([$arr[] | (. - $mean) * (. - $mean)] | add) / ($arr | length) | sqrt)
  end;

([."行业词条"[]|.dynamic["笔试真题库"].items[]?]) as $written_items |
([."行业词条"[]|.dynamic["面试真题库"].items[]?]) as $interview_items |
([."行业词条"[]|.dynamic|to_entries[]|.value.items[]?|(.evidence.source_id // .source_id // empty)]) as $source_refs |
([.. | objects | .source_date? | select(type == "string" and test("^\\d{4}-\\d{2}-\\d{2}$"))]) as $source_dates |
([."行业词条"[]|.progress.quality_score_overall]) as $quality_scores |
([."行业词条"[]|.progress.real_data_ratio_overall]) as $real_ratios |
([."行业词条"[]|.progress.evidence_percent_overall]) as $evidence_ratios |
([."行业词条"[]|.progress.freshness_percent_overall]) as $freshness_ratios |
([."行业词条"[]|(.dynamic["薪酬快照_按城市_按公司层级_按岗位"].observed_items|length)]) as $salary_observed_counts |
([."行业词条"[]|(.dynamic["薪酬快照_按城市_按公司层级_按岗位"].observed_items|map(.city_id)|unique|length)]) as $salary_observed_city_counts |
([."行业词条"[]|(.dynamic["薪酬快照_按城市_按公司层级_按岗位"].observed_items|map(.role_id)|unique|length)]) as $salary_observed_role_counts |
([."行业词条"[]|(.dynamic["薪酬快照_按城市_按公司层级_按岗位"].observed_items|map(.company_tier)|unique|length)]) as $salary_observed_tier_counts |
([."行业词条"[]|((.dynamic["笔试真题库"].items|length)+(.dynamic["面试真题库"].items|length))]) as $question_depth_counts |
([."行业词条"[]|(.dynamic["笔试真题库"].items|map(.role_id)|unique|length)]) as $written_role_coverages |
([."行业词条"[]|(.dynamic["面试真题库"].items|map(.role_id)|unique|length)]) as $interview_role_coverages |
([."行业词条"[]|(.dynamic["行业事件日志"].items|length)]) as $event_counts |
([."行业词条"[]|([.dynamic["行业事件日志"].items[]? | select(((.evidence.source_date // "") | type == "string") and ((.evidence.source_date // "") >= "2025-08-21"))] | length)]) as $event_recent_counts |
([."行业词条"[]|.dynamic["自定义扩展"].items[]?|(.x_decision_estimation_method // empty)]) as $decision_methods |
([."行业词条"[]|(.dynamic["自定义扩展"].items[]?.evidence.sample_size // 0)]) as $decision_sample_sizes |
([."行业词条"[]|.dynamic["自定义扩展"].items[]?|(.x_decision_reliability_tier // "NA")]) as $decision_reliability_tiers |

{
  generated_at: now | strftime("%Y-%m-%dT%H:%M:%SZ"),
  data_file: input_filename,
  document: {
    version: ."文档元数据"."版本",
    release_date: ."文档元数据"."发布日期",
    entries: (."行业词条"|length)
  },
  entry_status_dist: ([."行业词条"[]|.meta.status] | group_by(.) | map({status:.[0], count:length})),
  dynamic_status_dist: ([."行业词条"[]|.dynamic|to_entries[]|.value.data_status] | group_by(.) | map({status:.[0], count:length})),
  progress_avg: {
    coverage: ([."行业词条"[]|.progress.coverage_percent_overall] | add/length),
    evidence: ([."行业词条"[]|.progress.evidence_percent_overall] | add/length),
    real_data_ratio: ([."行业词条"[]|.progress.real_data_ratio_overall] | add/length),
    quality: ([."行业词条"[]|.progress.quality_score_overall] | add/length),
    manual_fill_completion: (
      ([."行业词条"[]|.dynamic|to_entries[]|(.value.manual_fill_progress.required_count // 0)] | add) as $required_total
      | ([."行业词条"[]|.dynamic|to_entries[]|(.value.manual_fill_progress.pending_count // 0)] | add) as $pending_total
      | if $required_total == 0 then 100 else ((($required_total - $pending_total) * 100) / $required_total) end
    )
  },
  progress_dispersion: {
    quality_score_stddev: stddev($quality_scores),
    real_data_ratio_stddev: stddev($real_ratios),
    evidence_stddev: stddev($evidence_ratios),
    freshness_stddev: stddev($freshness_ratios),
    quality_score_min: ($quality_scores | min),
    quality_score_max: ($quality_scores | max)
  },
  quality_differentiation_v2: {
    salary_observed_items_stddev: stddev($salary_observed_counts),
    salary_observed_items_min: ($salary_observed_counts | min),
    salary_observed_items_max: ($salary_observed_counts | max),
    salary_observed_city_coverage_stddev: stddev($salary_observed_city_counts),
    salary_observed_city_coverage_min: ($salary_observed_city_counts | min),
    salary_observed_city_coverage_max: ($salary_observed_city_counts | max),
    salary_observed_role_coverage_stddev: stddev($salary_observed_role_counts),
    salary_observed_role_coverage_min: ($salary_observed_role_counts | min),
    salary_observed_role_coverage_max: ($salary_observed_role_counts | max),
    salary_observed_tier_coverage_stddev: stddev($salary_observed_tier_counts),
    salary_observed_tier_coverage_min: ($salary_observed_tier_counts | min),
    salary_observed_tier_coverage_max: ($salary_observed_tier_counts | max),
    question_depth_stddev: stddev($question_depth_counts),
    question_depth_min: ($question_depth_counts | min),
    question_depth_max: ($question_depth_counts | max),
    written_role_coverage_stddev: stddev($written_role_coverages),
    written_role_coverage_min: ($written_role_coverages | min),
    written_role_coverage_max: ($written_role_coverages | max),
    interview_role_coverage_stddev: stddev($interview_role_coverages),
    interview_role_coverage_min: ($interview_role_coverages | min),
    interview_role_coverage_max: ($interview_role_coverages | max),
    event_count_stddev: stddev($event_counts),
    event_count_min: ($event_counts | min),
    event_count_max: ($event_counts | max),
    event_recent_180d_stddev: stddev($event_recent_counts),
    event_recent_180d_min: ($event_recent_counts | min),
    event_recent_180d_max: ($event_recent_counts | max),
    decision_evidence_sample_size_stddev: stddev($decision_sample_sizes),
    decision_evidence_sample_size_min: ($decision_sample_sizes | min),
    decision_evidence_sample_size_max: ($decision_sample_sizes | max)
  },
  content_realness: {
    written_total: ($written_items | length),
    written_need_real: ([ $written_items[] | select(.needs_real_question == true) ] | length),
    written_real_ready: ([ $written_items[] | select((.needs_real_question // false) == false) ] | length),
    interview_total: ($interview_items | length),
    interview_need_real: ([ $interview_items[] | select(.needs_real_question == true) ] | length),
    interview_real_ready: ([ $interview_items[] | select((.needs_real_question // false) == false) ] | length)
  },
  template_quality: {
    template_items: ([."行业词条"[]|.dynamic|to_entries[]|.value.items[]?|select((.authenticity_level // "") == "template" or (.is_template // false) == true)]|length),
    items_total: ([."行业词条"[]|.dynamic|to_entries[]|.value.items[]?]|length),
    template_ratio_percent: (
      ([."行业词条"[]|.dynamic|to_entries[]|.value.items[]?|select((.authenticity_level // "") == "template" or (.is_template // false) == true)]|length) as $tpl
      | ([."行业词条"[]|.dynamic|to_entries[]|.value.items[]?]|length) as $total
      | if $total == 0 then 0 else ($tpl * 100 / $total) end
    )
  },
  source_concentration: {
    total_refs: ($source_refs | length),
    top1_share_percent: (
      if ($source_refs | length) == 0 then 0
      else ((($source_refs | group_by(.) | map(length) | max) // 0) * 100 / ($source_refs | length))
      end
    ),
    top5_share_percent: (
      if ($source_refs | length) == 0 then 0
      else ((($source_refs | group_by(.) | map(length) | sort | reverse | .[0:5] | add) // 0) * 100 / ($source_refs | length))
      end
    )
  },
  freshness_detail: {
    source_date_records: ($source_dates | length),
    within_180_days_percent: (
      if ($source_dates | length) == 0 then 0
      else (([$source_dates[] | select((now - (. | strptime("%Y-%m-%d") | mktime)) <= (180*86400))] | length) * 100 / ($source_dates | length))
      end
    ),
    older_than_365_days_count: ([$source_dates[] | select((now - (. | strptime("%Y-%m-%d") | mktime)) > (365*86400))] | length)
  },
  salary_layers: {
    micro_estimated_items: ([."行业词条"[]|.dynamic["薪酬快照_按城市_按公司层级_按岗位"].estimated_items|length]|add),
    micro_observed_items: ([."行业词条"[]|.dynamic["薪酬快照_按城市_按公司层级_按岗位"].observed_items|length]|add),
    micro_observed_filled_items: ([."行业词条"[]|.dynamic["薪酬快照_按城市_按公司层级_按岗位"].observed_items[]?|select(.p50_monthly_total_annualized_k_cny != null)]|length),
    macro_observed_items: ([."行业词条"[]|.dynamic["薪酬实证_国家统计口径"].items|length]|add),
    micro_status_dist: ([."行业词条"[]|.dynamic["薪酬快照_按城市_按公司层级_按岗位"].data_status] | group_by(.) | map({status:.[0], count:length})),
    macro_status_dist: ([."行业词条"[]|.dynamic["薪酬实证_国家统计口径"].data_status] | group_by(.) | map({status:.[0], count:length}))
  },
  source_quality: {
    sources_total: ([."行业词条"[]|.sources[]]|length),
    sources_with_id: ([."行业词条"[]|.sources[]|select(.source_id!=null)]|length),
    sources_with_snapshot: ([."行业词条"[]|.sources[]|select(.snapshot_url!=null)]|length),
    sources_checked: ([."行业词条"[]|.sources[]|select(.access_check=="checked")]|length),
    sources_http_200: ([."行业词条"[]|.sources[]|select(.http_status==200)]|length),
    sources_need_manual_verification: ([."行业词条"[]|.sources[]|select(.manual_verification_required==true)]|length)
  },
  source_registry_quality: {
    registry_total: (."来源注册表"|length),
    registry_http_200: ([."来源注册表"[]|select(.http_status==200)]|length),
    registry_manual_verification: ([."来源注册表"[]|select(.manual_verification_required==true)]|length),
    registry_source_type_dist: ([."来源注册表"[]|.source_type] | group_by(.) | map({type:.[0], count:length}))
  },
  manual_fill: {
    pending_total: ([."行业词条"[]|.dynamic|to_entries[]|(.value.manual_fill_progress.pending_count // 0)]|add),
    required_total: ([."行业词条"[]|.dynamic|to_entries[]|(.value.manual_fill_progress.required_count // 0)]|add),
    p0_pending_total: ([."行业词条"[]|.dynamic|to_entries[]|.value.manual_fill_slots[]?|select(.priority=="P0")|select((.status // "pending_user_fill") | startswith("pending"))]|length),
    p1_pending_total: ([."行业词条"[]|.dynamic|to_entries[]|.value.manual_fill_slots[]?|select(.priority=="P1")|select((.status // "pending_user_fill") | startswith("pending"))]|length),
    p2_pending_total: ([."行业词条"[]|.dynamic|to_entries[]|.value.manual_fill_slots[]?|select(.priority=="P2")|select((.status // "pending_user_fill") | startswith("pending"))]|length)
  },
  manual_fill_explainability: {
    p0_total_slots: ([."行业词条"[]|.dynamic|to_entries[]|.value.manual_fill_slots[]?|select(.priority=="P0")]|length),
    p0_completed_slots: ([."行业词条"[]|.dynamic|to_entries[]|.value.manual_fill_slots[]?|select(.priority=="P0" and .status=="completed")]|length),
    p1_total_slots: ([."行业词条"[]|.dynamic|to_entries[]|.value.manual_fill_slots[]?|select(.priority=="P1")]|length),
    p1_completed_slots: ([."行业词条"[]|.dynamic|to_entries[]|.value.manual_fill_slots[]?|select(.priority=="P1" and .status=="completed")]|length),
    p2_total_slots: ([."行业词条"[]|.dynamic|to_entries[]|.value.manual_fill_slots[]?|select(.priority=="P2")]|length),
    p2_completed_slots: ([."行业词条"[]|.dynamic|to_entries[]|.value.manual_fill_slots[]?|select(.priority=="P2" and .status=="completed")]|length)
  },
  decision_metrics: {
    entries_with_decision_fields: ([."行业词条"[]|select(.dynamic["自定义扩展"].payload.extension_fields? != null)]|length),
    decision_items_total: ([."行业词条"[]|.dynamic["自定义扩展"].items[]?]|length),
    decision_estimation_methods_dist: ($decision_methods | group_by(.) | map({method:.[0], count:length})),
    decision_estimation_methods_count: ($decision_methods | unique | length),
    decision_reliability_tier_dist: ($decision_reliability_tiers | group_by(.) | map({tier:.[0], count:length})),
    conversion_fields_filled: ([."行业词条"[]|.dynamic["自定义扩展"].items[]?|select(.x_decision_apply_to_written_rate_percent!=null and .x_decision_written_to_interview_rate_percent!=null and .x_decision_interview_to_offer_rate_percent!=null)]|length),
    city_cost_salary_filled: ([."行业词条"[]|.dynamic["自定义扩展"].items[]?|select(.x_decision_city_cost_adjusted_salary_index!=null)]|length),
    competition_fields_filled: ([."行业词条"[]|.dynamic["自定义扩展"].items[]?|select((.x_decision_role_competition_intensity // "") != "" and .x_decision_role_competition_intensity != "待你补充")]|length),
    decision_items_with_evidence: ([."行业词条"[]|.dynamic["自定义扩展"].items[]?|select(.evidence.source_id!=null and .evidence.source_url!=null and .evidence.source_date!=null and .evidence.sample_size!=null)]|length),
    decision_placeholder_pending_items: ([."行业词条"[]|.dynamic["自定义扩展"].items[]?|select((.x_decision_real_data_placeholders.applicant_flow_dataset_id // "")=="待你补充" or (.x_decision_real_data_placeholders.observed_period // "")=="待你补充" or (.x_decision_real_data_placeholders.city_samples_min // "")=="待你补充")]|length)
  }
}' "${DATA_PATH}" > "${REPORT_PATH}"

cp "${REPORT_PATH}" "${LATEST_PATH}"

# Hard release gates.
PLACEHOLDER_COUNT="$( (rg -n -e 'pending\\.example\\.com' -e '待补内部链接' -e '示范复盘结构' -e '待补统计口径' "${DATA_PATH}" || true) | wc -l | tr -d ' ' )"

DUP_SOURCE_JSON="$(jq '
[
  ."行业词条"[]
  | {
      industry: ."行业名称",
      dup_source_ids: ([.sources[].source_id] | group_by(.) | map(select(length > 1) | .[0]))
    }
  | select((.dup_source_ids | length) > 0)
]
' "${DATA_PATH}")"
DUP_SOURCE_COUNT="$(jq 'length' <<<"${DUP_SOURCE_JSON}")"

NON200_UNMARKED_JSON="$(jq '
[
  ."来源注册表"[]
  | select(.http_status != 200 and .manual_verification_required != true)
  | {source_id, source_url, http_status}
]
' "${DATA_PATH}")"
NON200_UNMARKED_COUNT="$(jq 'length' <<<"${NON200_UNMARKED_JSON}")"

PUBLISHED_P0_JSON="$(jq '
[
  ."行业词条"[]
  | {
      industry: ."行业名称",
      status: .meta.status,
      p0_pending: (
        [
          .dynamic
          | to_entries[]
          | .value.manual_fill_slots[]?
          | select(.priority == "P0")
          | select((.status // "pending") | startswith("pending"))
        ] | length
      )
    }
  | select(.status == "published" and .p0_pending > 0)
]
' "${DATA_PATH}")"
PUBLISHED_P0_COUNT="$(jq 'length' <<<"${PUBLISHED_P0_JSON}")"

SOURCE_MISMATCH_JSON="$(jq '
def host($u):
  if ($u | type) == "string" then
    (try ($u | capture("https?://(?<h>[^/]+)").h) catch null)
  else
    null
  end;

(reduce ."来源注册表"[] as $s ({}; .[$s.source_id] = $s.source_url)) as $reg
| [
    .. | objects
    | select(has("source_id") and has("source_url"))
    | . as $o
    | ($reg[$o.source_id] // null) as $reg_url
    | select($reg_url != null)
    | (host($o.source_url)) as $obj_host
    | (host($reg_url)) as $reg_host
    | select($obj_host != null and $reg_host != null and $obj_host != $reg_host)
    | {source_id: $o.source_id, source_url: $o.source_url, registry_url: $reg_url}
  ]
  | unique
' "${DATA_PATH}")"
SOURCE_MISMATCH_COUNT="$(jq 'length' <<<"${SOURCE_MISMATCH_JSON}")"

TODAY_COMPACT="$(date +%Y%m%d)"
FUTURE_URL_JSON="$(jq --arg today "${TODAY_COMPACT}" '
[
  .. | objects
  | select(has("source_url"))
  | {
      source_id: (.source_id // null),
      source_url,
      date_token: (try (.source_url | capture("(?<d>20[0-9]{6})").d) catch null)
    }
  | select(.date_token != null and .date_token > $today)
]
| unique_by(.source_url)
' "${DATA_PATH}")"
FUTURE_URL_COUNT="$(jq 'length' <<<"${FUTURE_URL_JSON}")"

# Decision placeholder gate.
DECISION_PLACEHOLDER_JSON="$(jq '
[
  ."行业词条"[]
  | .industry_id as $industry_id
  | .dynamic["自定义扩展"].items[]?
  | select((.x_decision_real_data_placeholders.applicant_flow_dataset_id // "") == "待你补充"
      or (.x_decision_real_data_placeholders.observed_period // "") == "待你补充"
      or (.x_decision_real_data_placeholders.city_samples_min // "") == "待你补充")
  | {industry_id: $industry_id, ext_id: (.ext_id // null), placeholders: .x_decision_real_data_placeholders}
]
' "${DATA_PATH}")"
DECISION_PLACEHOLDER_COUNT="$(jq 'length' <<<"${DECISION_PLACEHOLDER_JSON}")"

# Salary observed layer consistency gates.
SALARY_OBS_INPROGRESS_JSON="$(jq '
[
  ."行业词条"[]
  | {
      industry_id,
      industry_name: ."行业名称",
      observed_status: .dynamic["薪酬快照_按城市_按公司层级_按岗位"].observed_status
    }
  | select(.observed_status != "verified")
]
' "${DATA_PATH}")"
SALARY_OBS_INPROGRESS_COUNT="$(jq 'length' <<<"${SALARY_OBS_INPROGRESS_JSON}")"

SALARY_OBS_LOWSAMPLE_JSON="$(jq '
[
  ."行业词条"[]
  | .industry_id as $iid
  | .dynamic["薪酬快照_按城市_按公司层级_按岗位"] as $col
  | ($col.min_sample_size_for_verified // 10) as $min
  | $col.observed_items[]?
  | select((.sample_size // 0) < $min)
  | {
      industry_id: $iid,
      role_id: (.role_id // null),
      city_id: (.city_id // null),
      sample_size: (.sample_size // 0),
      min_sample_size_for_verified: $min,
      source_id: (.source_id // null)
    }
]
' "${DATA_PATH}")"
SALARY_OBS_LOWSAMPLE_COUNT="$(jq 'length' <<<"${SALARY_OBS_LOWSAMPLE_JSON}")"

SALARY_OBS_COVERAGE_JSON="$(jq '
[
  ."行业词条"[]
  | .industry_id as $iid
  | ."行业名称" as $iname
  | .dynamic["薪酬快照_按城市_按公司层级_按岗位"] as $col
  | ($col.observed_items // []) as $obs
  | ($col.observed_requirements.min_cities // 4) as $min_cities
  | ($col.observed_requirements.min_roles // 4) as $min_roles
  | ($col.observed_requirements.min_company_tiers // 2) as $min_tiers
  | {
      industry_id: $iid,
      industry_name: $iname,
      observed_items: ($obs | length),
      city_coverage: ($obs | map(.city_id) | unique | length),
      role_coverage: ($obs | map(.role_id) | unique | length),
      company_tier_coverage: ($obs | map(.company_tier) | unique | length),
      min_cities: $min_cities,
      min_roles: $min_roles,
      min_company_tiers: $min_tiers
    }
]
' "${DATA_PATH}")"

QUESTION_ROLE_COVERAGE_JSON="$(jq '
[
  ."行业词条"[]
  | (.dynamic["岗位画像库"].items | length) as $role_total
  | {
      industry_id,
      industry_name: ."行业名称",
      role_total: $role_total,
      required_role_coverage: (if $role_total < 5 then $role_total else 5 end),
      written_role_coverage: (.dynamic["笔试真题库"].items | map(.role_id) | unique | length),
      interview_role_coverage: (.dynamic["面试真题库"].items | map(.role_id) | unique | length)
    }
]
' "${DATA_PATH}")"

DECISION_EVIDENCE_LOWSAMPLE_JSON="$(jq '
[
  ."行业词条"[]
  | .industry_id as $iid
  | ."行业名称" as $iname
  | .dynamic["自定义扩展"].items[]?
  | ($iid) as $industry_id
  | ($iname) as $industry_name
  | (.x_decision_min_sample_required // 8) as $min_required
  | (.evidence.sample_size // 0) as $actual
  | select($actual < $min_required)
  | {
      industry_id: $industry_id,
      industry_name: $industry_name,
      ext_id: (.ext_id // null),
      sample_size: $actual,
      min_required: $min_required,
      method: (.x_decision_estimation_method // null)
    }
]
' "${DATA_PATH}")"
DECISION_EVIDENCE_LOWSAMPLE_COUNT="$(jq 'length' <<<"${DECISION_EVIDENCE_LOWSAMPLE_JSON}")"

EVENT_LOG_COVERAGE_JSON="$(jq '
[
  ."行业词条"[]
  | {
      industry_id,
      industry_name: ."行业名称",
      event_total: (.dynamic["行业事件日志"].items | length),
      event_recent_180d: ([.dynamic["行业事件日志"].items[]? | select(((.evidence.source_date // "") | type == "string") and ((.evidence.source_date // "") >= "2025-08-21"))] | length)
    }
]
' "${DATA_PATH}")"

# New explainable gate metrics.
P0_SLOT_TOTAL="$(jq '[."行业词条"[]|.dynamic|to_entries[]|.value.manual_fill_slots[]?|select(.priority=="P0")]|length' "${DATA_PATH}")"
P0_PENDING_TOTAL="$(jq '[."行业词条"[]|.dynamic|to_entries[]|.value.manual_fill_slots[]?|select(.priority=="P0")|select((.status // "pending")|startswith("pending"))]|length' "${DATA_PATH}")"
if [[ "${P0_SLOT_TOTAL}" -eq 0 ]]; then
  P0_COMPLETION_PERCENT="100"
else
  P0_COMPLETION_PERCENT="$(awk -v t="${P0_SLOT_TOTAL}" -v p="${P0_PENDING_TOTAL}" 'BEGIN{printf "%.2f", (t-p)*100/t}')"
fi

TEMPLATE_RATIO_PERCENT="$(jq '([."行业词条"[]|.dynamic|to_entries[]|.value.items[]?]|length) as $total | ([."行业词条"[]|.dynamic|to_entries[]|.value.items[]?|select((.authenticity_level // "") == "template" or (.is_template // false) == true)]|length) as $tpl | if $total==0 then 0 else ($tpl*100/$total) end' "${DATA_PATH}")"

SOURCE_HTTP_200_RATIO="$(jq '(."来源注册表"|length) as $t | ([."来源注册表"[]|select(.http_status==200)]|length) as $h | if $t==0 then 100 else ($h*100/$t) end' "${DATA_PATH}")"

REAL_QUESTION_READY_RATIO="$(jq '([."行业词条"[]|.dynamic["笔试真题库"].items[]?] + [."行业词条"[]|.dynamic["面试真题库"].items[]?]) as $qs | ($qs|length) as $t | ([$qs[]|select((.needs_real_question // false)==false)]|length) as $r | if $t==0 then 0 else ($r*100/$t) end' "${DATA_PATH}")"

GATE_P0_MIN="$(jq '."治理配置"."发布硬门槛".p0_completion_min_percent // 85' "${DATA_PATH}")"
GATE_TEMPLATE_MAX="$(jq '."治理配置"."发布硬门槛".template_ratio_max_percent // 35' "${DATA_PATH}")"
GATE_SOURCE_MIN="$(jq '."治理配置"."发布硬门槛".source_http_200_min_percent // 90' "${DATA_PATH}")"
GATE_REAL_Q_MIN="$(jq '."治理配置"."发布硬门槛".real_question_min_percent // 25' "${DATA_PATH}")"
GATE_DECISION_PLACEHOLDER_MAX="$(jq '."治理配置"."发布硬门槛".decision_placeholder_max_hits // 0' "${DATA_PATH}")"
GATE_SALARY_OBS_INPROGRESS_MAX="$(jq '."治理配置"."发布硬门槛".salary_observed_inprogress_max // 0' "${DATA_PATH}")"
GATE_SALARY_OBS_LOWSAMPLE_MAX="$(jq '."治理配置"."发布硬门槛".salary_observed_lowsample_max // 0' "${DATA_PATH}")"
GATE_SALARY_OBS_COVERAGE_MAX="$(jq '."治理配置"."发布硬门槛".salary_observed_coverage_max_hits // 0' "${DATA_PATH}")"
GATE_SALARY_OBS_TIER_MAX="$(jq '."治理配置"."发布硬门槛".salary_observed_company_tier_max_hits // 0' "${DATA_PATH}")"
GATE_QUESTION_ROLE_MIN="$(jq '."治理配置"."发布硬门槛".question_role_coverage_min // 5' "${DATA_PATH}")"
GATE_QUESTION_ROLE_MAX="$(jq '."治理配置"."发布硬门槛".question_role_coverage_max_hits // 0' "${DATA_PATH}")"
GATE_DECISION_EVIDENCE_MAX="$(jq '."治理配置"."发布硬门槛".decision_evidence_lowsample_max_hits // 0' "${DATA_PATH}")"
GATE_EVENT_MIN_COUNT="$(jq '."治理配置"."发布硬门槛".event_log_min_count // 2' "${DATA_PATH}")"
GATE_EVENT_RECENT_MIN="$(jq '."治理配置"."发布硬门槛".event_recent_180d_min_count // 1' "${DATA_PATH}")"
GATE_SOURCE_TOP1_MAX="$(jq '."治理配置"."发布硬门槛".source_concentration_top1_max_percent // 100' "${DATA_PATH}")"
GATE_SOURCE_TOP5_MAX="$(jq '."治理配置"."发布硬门槛".source_concentration_top5_max_percent // 100' "${DATA_PATH}")"

SOURCE_TOP1_SHARE="$(jq '
([."行业词条"[]|.dynamic|to_entries[]|.value.items[]?|(.evidence.source_id // .source_id // empty)]) as $refs
| if ($refs|length)==0 then 0 else ((($refs|group_by(.)|map(length)|max)//0) * 100 / ($refs|length)) end
' "${DATA_PATH}")"
SOURCE_TOP5_SHARE="$(jq '
([."行业词条"[]|.dynamic|to_entries[]|.value.items[]?|(.evidence.source_id // .source_id // empty)]) as $refs
| if ($refs|length)==0 then 0 else ((($refs|group_by(.)|map(length)|sort|reverse|.[0:5]|add)//0) * 100 / ($refs|length)) end
' "${DATA_PATH}")"

SALARY_OBS_COVERAGE_ISSUES="$(jq '
[
  .[]
  | select(
      .observed_items < (if .min_cities > .min_roles then .min_cities else .min_roles end)
      or .city_coverage < .min_cities
      or .role_coverage < .min_roles
      or .company_tier_coverage < .min_company_tiers
    )
]
' <<<"${SALARY_OBS_COVERAGE_JSON}")"
SALARY_OBS_COVERAGE_COUNT="$(jq 'length' <<<"${SALARY_OBS_COVERAGE_ISSUES}")"

SALARY_OBS_TIER_ISSUES="$(jq '
[
  .[]
  | select(.company_tier_coverage < .min_company_tiers)
]
' <<<"${SALARY_OBS_COVERAGE_JSON}")"
SALARY_OBS_TIER_COUNT="$(jq 'length' <<<"${SALARY_OBS_TIER_ISSUES}")"

QUESTION_ROLE_ISSUES="$(jq --argjson min "${GATE_QUESTION_ROLE_MIN}" '
[
  .[]
  | (.required_role_coverage // $min) as $req
  | select(.written_role_coverage < $req or .interview_role_coverage < $req)
]
' <<<"${QUESTION_ROLE_COVERAGE_JSON}")"
QUESTION_ROLE_COUNT="$(jq 'length' <<<"${QUESTION_ROLE_ISSUES}")"

EVENT_LOG_ISSUES="$(jq --argjson min_total "${GATE_EVENT_MIN_COUNT}" --argjson min_recent "${GATE_EVENT_RECENT_MIN}" '
[
  .[]
  | select(.event_total < $min_total or .event_recent_180d < $min_recent)
]
' <<<"${EVENT_LOG_COVERAGE_JSON}")"
EVENT_LOG_ISSUE_COUNT="$(jq 'length' <<<"${EVENT_LOG_ISSUES}")"

HAS_BLOCKERS=0
if [[ "${PLACEHOLDER_COUNT}" -gt 0 ]]; then HAS_BLOCKERS=1; fi
if [[ "${DUP_SOURCE_COUNT}" -gt 0 ]]; then HAS_BLOCKERS=1; fi
if [[ "${NON200_UNMARKED_COUNT}" -gt 0 ]]; then HAS_BLOCKERS=1; fi
if [[ "${PUBLISHED_P0_COUNT}" -gt 0 ]]; then HAS_BLOCKERS=1; fi
if [[ "${SOURCE_MISMATCH_COUNT}" -gt 0 ]]; then HAS_BLOCKERS=1; fi
if [[ "${FUTURE_URL_COUNT}" -gt 0 ]]; then HAS_BLOCKERS=1; fi
if awk -v a="${DECISION_PLACEHOLDER_COUNT}" -v b="${GATE_DECISION_PLACEHOLDER_MAX}" 'BEGIN{exit !(a > b)}'; then HAS_BLOCKERS=1; fi
if awk -v a="${SALARY_OBS_INPROGRESS_COUNT}" -v b="${GATE_SALARY_OBS_INPROGRESS_MAX}" 'BEGIN{exit !(a > b)}'; then HAS_BLOCKERS=1; fi
if awk -v a="${SALARY_OBS_LOWSAMPLE_COUNT}" -v b="${GATE_SALARY_OBS_LOWSAMPLE_MAX}" 'BEGIN{exit !(a > b)}'; then HAS_BLOCKERS=1; fi
if awk -v a="${SALARY_OBS_COVERAGE_COUNT}" -v b="${GATE_SALARY_OBS_COVERAGE_MAX}" 'BEGIN{exit !(a > b)}'; then HAS_BLOCKERS=1; fi
if awk -v a="${SALARY_OBS_TIER_COUNT}" -v b="${GATE_SALARY_OBS_TIER_MAX}" 'BEGIN{exit !(a > b)}'; then HAS_BLOCKERS=1; fi
if awk -v a="${QUESTION_ROLE_COUNT}" -v b="${GATE_QUESTION_ROLE_MAX}" 'BEGIN{exit !(a > b)}'; then HAS_BLOCKERS=1; fi
if awk -v a="${DECISION_EVIDENCE_LOWSAMPLE_COUNT}" -v b="${GATE_DECISION_EVIDENCE_MAX}" 'BEGIN{exit !(a > b)}'; then HAS_BLOCKERS=1; fi
if awk -v a="${EVENT_LOG_ISSUE_COUNT}" 'BEGIN{exit !(a > 0)}'; then HAS_BLOCKERS=1; fi
if awk -v a="${SOURCE_TOP1_SHARE}" -v b="${GATE_SOURCE_TOP1_MAX}" 'BEGIN{exit !(a > b)}'; then HAS_BLOCKERS=1; fi
if awk -v a="${SOURCE_TOP5_SHARE}" -v b="${GATE_SOURCE_TOP5_MAX}" 'BEGIN{exit !(a > b)}'; then HAS_BLOCKERS=1; fi
if awk -v a="${P0_COMPLETION_PERCENT}" -v b="${GATE_P0_MIN}" 'BEGIN{exit !(a < b)}'; then HAS_BLOCKERS=1; fi
if awk -v a="${TEMPLATE_RATIO_PERCENT}" -v b="${GATE_TEMPLATE_MAX}" 'BEGIN{exit !(a > b)}'; then HAS_BLOCKERS=1; fi
if awk -v a="${SOURCE_HTTP_200_RATIO}" -v b="${GATE_SOURCE_MIN}" 'BEGIN{exit !(a < b)}'; then HAS_BLOCKERS=1; fi
if awk -v a="${REAL_QUESTION_READY_RATIO}" -v b="${GATE_REAL_Q_MIN}" 'BEGIN{exit !(a < b)}'; then HAS_BLOCKERS=1; fi

P0_COMPLETION_ISSUE="$(jq -n --argjson actual "${P0_COMPLETION_PERCENT}" --argjson threshold "${GATE_P0_MIN}" '{actual_percent:$actual, threshold_percent:$threshold}')"
TEMPLATE_RATIO_ISSUE="$(jq -n --argjson actual "${TEMPLATE_RATIO_PERCENT}" --argjson threshold "${GATE_TEMPLATE_MAX}" '{actual_percent:$actual, threshold_percent:$threshold}')"
SOURCE_HTTP_ISSUE="$(jq -n --argjson actual "${SOURCE_HTTP_200_RATIO}" --argjson threshold "${GATE_SOURCE_MIN}" '{actual_percent:$actual, threshold_percent:$threshold}')"
REAL_QUESTION_ISSUE="$(jq -n --argjson actual "${REAL_QUESTION_READY_RATIO}" --argjson threshold "${GATE_REAL_Q_MIN}" '{actual_percent:$actual, threshold_percent:$threshold}')"
DECISION_PLACEHOLDER_ISSUE="$(jq -n --argjson actual "${DECISION_PLACEHOLDER_COUNT}" --argjson threshold "${GATE_DECISION_PLACEHOLDER_MAX}" '{actual_hits:$actual, threshold_hits:$threshold}')"
SALARY_OBS_INPROGRESS_ISSUE="$(jq -n --argjson actual "${SALARY_OBS_INPROGRESS_COUNT}" --argjson threshold "${GATE_SALARY_OBS_INPROGRESS_MAX}" '{actual_hits:$actual, threshold_hits:$threshold}')"
SALARY_OBS_LOWSAMPLE_ISSUE="$(jq -n --argjson actual "${SALARY_OBS_LOWSAMPLE_COUNT}" --argjson threshold "${GATE_SALARY_OBS_LOWSAMPLE_MAX}" '{actual_hits:$actual, threshold_hits:$threshold}')"
SALARY_OBS_COVERAGE_ISSUE="$(jq -n --argjson actual "${SALARY_OBS_COVERAGE_COUNT}" --argjson threshold "${GATE_SALARY_OBS_COVERAGE_MAX}" '{actual_hits:$actual, threshold_hits:$threshold}')"
SALARY_OBS_TIER_ISSUE="$(jq -n --argjson actual "${SALARY_OBS_TIER_COUNT}" --argjson threshold "${GATE_SALARY_OBS_TIER_MAX}" '{actual_hits:$actual, threshold_hits:$threshold}')"
QUESTION_ROLE_ISSUE="$(jq -n --argjson actual "${QUESTION_ROLE_COUNT}" --argjson threshold "${GATE_QUESTION_ROLE_MAX}" --argjson min_required "${GATE_QUESTION_ROLE_MIN}" '{actual_hits:$actual, threshold_hits:$threshold, min_role_coverage:$min_required}')"
DECISION_EVIDENCE_ISSUE="$(jq -n --argjson actual "${DECISION_EVIDENCE_LOWSAMPLE_COUNT}" --argjson threshold "${GATE_DECISION_EVIDENCE_MAX}" '{actual_hits:$actual, threshold_hits:$threshold}')"
EVENT_LOG_ISSUE="$(jq -n --argjson actual "${EVENT_LOG_ISSUE_COUNT}" --argjson min_total "${GATE_EVENT_MIN_COUNT}" --argjson min_recent "${GATE_EVENT_RECENT_MIN}" '{actual_hits:$actual, min_event_total:$min_total, min_recent_180d:$min_recent}')"
SOURCE_TOP1_ISSUE="$(jq -n --argjson actual "${SOURCE_TOP1_SHARE}" --argjson threshold "${GATE_SOURCE_TOP1_MAX}" '{actual_percent:$actual, threshold_percent:$threshold}')"
SOURCE_TOP5_ISSUE="$(jq -n --argjson actual "${SOURCE_TOP5_SHARE}" --argjson threshold "${GATE_SOURCE_TOP5_MAX}" '{actual_percent:$actual, threshold_percent:$threshold}')"

jq -n \
  --arg generated_at "$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
  --arg data_file "${DATA_PATH}" \
  --argjson placeholder_count "${PLACEHOLDER_COUNT}" \
  --argjson dup_source_count "${DUP_SOURCE_COUNT}" \
  --argjson non200_unmarked_count "${NON200_UNMARKED_COUNT}" \
  --argjson published_p0_count "${PUBLISHED_P0_COUNT}" \
  --argjson source_mismatch_count "${SOURCE_MISMATCH_COUNT}" \
  --argjson future_url_count "${FUTURE_URL_COUNT}" \
  --argjson decision_placeholder_count "${DECISION_PLACEHOLDER_COUNT}" \
  --argjson decision_placeholder_max "${GATE_DECISION_PLACEHOLDER_MAX}" \
  --argjson salary_obs_inprogress_count "${SALARY_OBS_INPROGRESS_COUNT}" \
  --argjson salary_obs_inprogress_max "${GATE_SALARY_OBS_INPROGRESS_MAX}" \
  --argjson salary_obs_lowsample_count "${SALARY_OBS_LOWSAMPLE_COUNT}" \
  --argjson salary_obs_lowsample_max "${GATE_SALARY_OBS_LOWSAMPLE_MAX}" \
  --argjson salary_obs_coverage_count "${SALARY_OBS_COVERAGE_COUNT}" \
  --argjson salary_obs_coverage_max "${GATE_SALARY_OBS_COVERAGE_MAX}" \
  --argjson salary_obs_tier_count "${SALARY_OBS_TIER_COUNT}" \
  --argjson salary_obs_tier_max "${GATE_SALARY_OBS_TIER_MAX}" \
  --argjson question_role_count "${QUESTION_ROLE_COUNT}" \
  --argjson question_role_max "${GATE_QUESTION_ROLE_MAX}" \
  --argjson question_role_min "${GATE_QUESTION_ROLE_MIN}" \
  --argjson decision_evidence_lowsample_count "${DECISION_EVIDENCE_LOWSAMPLE_COUNT}" \
  --argjson decision_evidence_lowsample_max "${GATE_DECISION_EVIDENCE_MAX}" \
  --argjson event_log_issue_count "${EVENT_LOG_ISSUE_COUNT}" \
  --argjson event_log_min_count "${GATE_EVENT_MIN_COUNT}" \
  --argjson event_recent_min_count "${GATE_EVENT_RECENT_MIN}" \
  --argjson source_top1_share "${SOURCE_TOP1_SHARE}" \
  --argjson source_top1_max "${GATE_SOURCE_TOP1_MAX}" \
  --argjson source_top5_share "${SOURCE_TOP5_SHARE}" \
  --argjson source_top5_max "${GATE_SOURCE_TOP5_MAX}" \
  --argjson p0_completion_percent "${P0_COMPLETION_PERCENT}" \
  --argjson p0_completion_min "${GATE_P0_MIN}" \
  --argjson template_ratio_percent "${TEMPLATE_RATIO_PERCENT}" \
  --argjson template_ratio_max "${GATE_TEMPLATE_MAX}" \
  --argjson source_http_200_ratio "${SOURCE_HTTP_200_RATIO}" \
  --argjson source_http_200_min "${GATE_SOURCE_MIN}" \
  --argjson real_question_ready_ratio "${REAL_QUESTION_READY_RATIO}" \
  --argjson real_question_min "${GATE_REAL_Q_MIN}" \
  --argjson has_blockers "${HAS_BLOCKERS}" \
  --argjson dup_source_issues "${DUP_SOURCE_JSON}" \
  --argjson non200_unmarked_issues "${NON200_UNMARKED_JSON}" \
  --argjson published_p0_issues "${PUBLISHED_P0_JSON}" \
  --argjson source_mismatch_issues "${SOURCE_MISMATCH_JSON}" \
  --argjson future_url_issues "${FUTURE_URL_JSON}" \
  --argjson decision_placeholder_issues "${DECISION_PLACEHOLDER_JSON}" \
  --argjson salary_obs_inprogress_issues "${SALARY_OBS_INPROGRESS_JSON}" \
  --argjson salary_obs_lowsample_issues "${SALARY_OBS_LOWSAMPLE_JSON}" \
  --argjson salary_obs_coverage_issues "${SALARY_OBS_COVERAGE_ISSUES}" \
  --argjson salary_obs_tier_issues "${SALARY_OBS_TIER_ISSUES}" \
  --argjson question_role_issues "${QUESTION_ROLE_ISSUES}" \
  --argjson decision_evidence_lowsample_issues "${DECISION_EVIDENCE_LOWSAMPLE_JSON}" \
  --argjson event_log_issues "${EVENT_LOG_ISSUES}" \
  --argjson p0_completion_issue "${P0_COMPLETION_ISSUE}" \
  --argjson template_ratio_issue "${TEMPLATE_RATIO_ISSUE}" \
  --argjson source_http_issue "${SOURCE_HTTP_ISSUE}" \
  --argjson real_question_issue "${REAL_QUESTION_ISSUE}" \
  --argjson decision_placeholder_issue "${DECISION_PLACEHOLDER_ISSUE}" \
  --argjson salary_obs_inprogress_issue "${SALARY_OBS_INPROGRESS_ISSUE}" \
  --argjson salary_obs_lowsample_issue "${SALARY_OBS_LOWSAMPLE_ISSUE}" \
  --argjson salary_obs_coverage_issue "${SALARY_OBS_COVERAGE_ISSUE}" \
  --argjson salary_obs_tier_issue "${SALARY_OBS_TIER_ISSUE}" \
  --argjson question_role_issue "${QUESTION_ROLE_ISSUE}" \
  --argjson decision_evidence_issue "${DECISION_EVIDENCE_ISSUE}" \
  --argjson event_log_issue "${EVENT_LOG_ISSUE}" \
  --argjson source_top1_issue "${SOURCE_TOP1_ISSUE}" \
  --argjson source_top5_issue "${SOURCE_TOP5_ISSUE}" \
  '{
    generated_at: $generated_at,
    data_file: $data_file,
    has_blockers: ($has_blockers == 1),
    gates: {
      placeholder_text_hits: $placeholder_count,
      duplicate_source_ids_in_entry: $dup_source_count,
      non200_unmarked_registry_sources: $non200_unmarked_count,
      published_entries_with_p0_pending: $published_p0_count,
      source_id_url_host_mismatch: $source_mismatch_count,
      future_dated_source_urls: $future_url_count,
      decision_placeholder_hits: $decision_placeholder_count,
      decision_placeholder_max_hits: $decision_placeholder_max,
      salary_observed_inprogress_hits: $salary_obs_inprogress_count,
      salary_observed_inprogress_max_hits: $salary_obs_inprogress_max,
      salary_observed_lowsample_hits: $salary_obs_lowsample_count,
      salary_observed_lowsample_max_hits: $salary_obs_lowsample_max,
      salary_observed_coverage_hits: $salary_obs_coverage_count,
      salary_observed_coverage_max_hits: $salary_obs_coverage_max,
      salary_observed_company_tier_hits: $salary_obs_tier_count,
      salary_observed_company_tier_max_hits: $salary_obs_tier_max,
      question_role_coverage_hits: $question_role_count,
      question_role_coverage_max_hits: $question_role_max,
      question_role_coverage_min: $question_role_min,
      decision_evidence_lowsample_hits: $decision_evidence_lowsample_count,
      decision_evidence_lowsample_max_hits: $decision_evidence_lowsample_max,
      event_log_coverage_hits: $event_log_issue_count,
      event_log_min_count: $event_log_min_count,
      event_recent_180d_min_count: $event_recent_min_count,
      source_concentration_top1_percent: $source_top1_share,
      source_concentration_top1_max_percent: $source_top1_max,
      source_concentration_top5_percent: $source_top5_share,
      source_concentration_top5_max_percent: $source_top5_max,
      p0_completion_percent: $p0_completion_percent,
      p0_completion_min_percent: $p0_completion_min,
      template_ratio_percent: $template_ratio_percent,
      template_ratio_max_percent: $template_ratio_max,
      source_http_200_ratio_percent: $source_http_200_ratio,
      source_http_200_min_percent: $source_http_200_min,
      real_question_ready_ratio_percent: $real_question_ready_ratio,
      real_question_min_percent: $real_question_min
    },
    issues: {
      duplicate_source_ids_in_entry: $dup_source_issues,
      non200_unmarked_registry_sources: $non200_unmarked_issues,
      published_entries_with_p0_pending: $published_p0_issues,
      source_id_url_host_mismatch: $source_mismatch_issues,
      future_dated_source_urls: $future_url_issues,
      decision_placeholder_records: $decision_placeholder_issues,
      salary_observed_inprogress_records: $salary_obs_inprogress_issues,
      salary_observed_lowsample_records: $salary_obs_lowsample_issues,
      salary_observed_coverage_records: $salary_obs_coverage_issues,
      salary_observed_company_tier_records: $salary_obs_tier_issues,
      question_role_coverage_records: $question_role_issues,
      decision_evidence_lowsample_records: $decision_evidence_lowsample_issues,
      event_log_coverage_records: $event_log_issues,
      p0_completion_threshold: $p0_completion_issue,
      template_ratio_threshold: $template_ratio_issue,
      source_http_200_threshold: $source_http_issue,
      real_question_threshold: $real_question_issue,
      decision_placeholder_threshold: $decision_placeholder_issue,
      salary_observed_inprogress_threshold: $salary_obs_inprogress_issue,
      salary_observed_lowsample_threshold: $salary_obs_lowsample_issue,
      salary_observed_coverage_threshold: $salary_obs_coverage_issue,
      salary_observed_company_tier_threshold: $salary_obs_tier_issue,
      question_role_coverage_threshold: $question_role_issue,
      decision_evidence_lowsample_threshold: $decision_evidence_issue,
      event_log_coverage_threshold: $event_log_issue,
      source_concentration_top1_threshold: $source_top1_issue,
      source_concentration_top5_threshold: $source_top5_issue
    }
  }' > "${GATE_PATH}"

cp "${GATE_PATH}" "${LATEST_GATE_PATH}"

echo "Quality pipeline completed"
echo "- report: ${REPORT_PATH}"
echo "- latest: ${LATEST_PATH}"
echo "- gate: ${GATE_PATH}"
echo "- gate_latest: ${LATEST_GATE_PATH}"

if [[ "${HAS_BLOCKERS}" -eq 1 ]]; then
  echo "Release gate failed: blockers detected."
  exit 2
fi
