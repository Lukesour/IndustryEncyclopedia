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

HAS_BLOCKERS=0
if [[ "${PLACEHOLDER_COUNT}" -gt 0 ]]; then HAS_BLOCKERS=1; fi
if [[ "${DUP_SOURCE_COUNT}" -gt 0 ]]; then HAS_BLOCKERS=1; fi
if [[ "${NON200_UNMARKED_COUNT}" -gt 0 ]]; then HAS_BLOCKERS=1; fi
if [[ "${PUBLISHED_P0_COUNT}" -gt 0 ]]; then HAS_BLOCKERS=1; fi
if [[ "${SOURCE_MISMATCH_COUNT}" -gt 0 ]]; then HAS_BLOCKERS=1; fi
if [[ "${FUTURE_URL_COUNT}" -gt 0 ]]; then HAS_BLOCKERS=1; fi
if awk -v a="${P0_COMPLETION_PERCENT}" -v b="${GATE_P0_MIN}" 'BEGIN{exit !(a < b)}'; then HAS_BLOCKERS=1; fi
if awk -v a="${TEMPLATE_RATIO_PERCENT}" -v b="${GATE_TEMPLATE_MAX}" 'BEGIN{exit !(a > b)}'; then HAS_BLOCKERS=1; fi
if awk -v a="${SOURCE_HTTP_200_RATIO}" -v b="${GATE_SOURCE_MIN}" 'BEGIN{exit !(a < b)}'; then HAS_BLOCKERS=1; fi
if awk -v a="${REAL_QUESTION_READY_RATIO}" -v b="${GATE_REAL_Q_MIN}" 'BEGIN{exit !(a < b)}'; then HAS_BLOCKERS=1; fi

P0_COMPLETION_ISSUE="$(jq -n --argjson actual "${P0_COMPLETION_PERCENT}" --argjson threshold "${GATE_P0_MIN}" '{actual_percent:$actual, threshold_percent:$threshold}')"
TEMPLATE_RATIO_ISSUE="$(jq -n --argjson actual "${TEMPLATE_RATIO_PERCENT}" --argjson threshold "${GATE_TEMPLATE_MAX}" '{actual_percent:$actual, threshold_percent:$threshold}')"
SOURCE_HTTP_ISSUE="$(jq -n --argjson actual "${SOURCE_HTTP_200_RATIO}" --argjson threshold "${GATE_SOURCE_MIN}" '{actual_percent:$actual, threshold_percent:$threshold}')"
REAL_QUESTION_ISSUE="$(jq -n --argjson actual "${REAL_QUESTION_READY_RATIO}" --argjson threshold "${GATE_REAL_Q_MIN}" '{actual_percent:$actual, threshold_percent:$threshold}')"

jq -n \
  --arg generated_at "$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
  --arg data_file "${DATA_PATH}" \
  --argjson placeholder_count "${PLACEHOLDER_COUNT}" \
  --argjson dup_source_count "${DUP_SOURCE_COUNT}" \
  --argjson non200_unmarked_count "${NON200_UNMARKED_COUNT}" \
  --argjson published_p0_count "${PUBLISHED_P0_COUNT}" \
  --argjson source_mismatch_count "${SOURCE_MISMATCH_COUNT}" \
  --argjson future_url_count "${FUTURE_URL_COUNT}" \
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
  --argjson p0_completion_issue "${P0_COMPLETION_ISSUE}" \
  --argjson template_ratio_issue "${TEMPLATE_RATIO_ISSUE}" \
  --argjson source_http_issue "${SOURCE_HTTP_ISSUE}" \
  --argjson real_question_issue "${REAL_QUESTION_ISSUE}" \
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
      p0_completion_threshold: $p0_completion_issue,
      template_ratio_threshold: $template_ratio_issue,
      source_http_200_threshold: $source_http_issue,
      real_question_threshold: $real_question_issue
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
