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

jq '{
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
  salary_layers: {
    micro_estimated_items: ([."行业词条"[]|.dynamic["薪酬快照_按城市_按公司层级_按岗位"].estimated_items|length]|add),
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

HAS_BLOCKERS=0
if [[ "${PLACEHOLDER_COUNT}" -gt 0 ]]; then HAS_BLOCKERS=1; fi
if [[ "${DUP_SOURCE_COUNT}" -gt 0 ]]; then HAS_BLOCKERS=1; fi
if [[ "${NON200_UNMARKED_COUNT}" -gt 0 ]]; then HAS_BLOCKERS=1; fi
if [[ "${PUBLISHED_P0_COUNT}" -gt 0 ]]; then HAS_BLOCKERS=1; fi
if [[ "${SOURCE_MISMATCH_COUNT}" -gt 0 ]]; then HAS_BLOCKERS=1; fi
if [[ "${FUTURE_URL_COUNT}" -gt 0 ]]; then HAS_BLOCKERS=1; fi

jq -n \
  --arg generated_at "$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
  --arg data_file "${DATA_PATH}" \
  --argjson placeholder_count "${PLACEHOLDER_COUNT}" \
  --argjson dup_source_count "${DUP_SOURCE_COUNT}" \
  --argjson non200_unmarked_count "${NON200_UNMARKED_COUNT}" \
  --argjson published_p0_count "${PUBLISHED_P0_COUNT}" \
  --argjson source_mismatch_count "${SOURCE_MISMATCH_COUNT}" \
  --argjson future_url_count "${FUTURE_URL_COUNT}" \
  --argjson has_blockers "${HAS_BLOCKERS}" \
  --argjson dup_source_issues "${DUP_SOURCE_JSON}" \
  --argjson non200_unmarked_issues "${NON200_UNMARKED_JSON}" \
  --argjson published_p0_issues "${PUBLISHED_P0_JSON}" \
  --argjson source_mismatch_issues "${SOURCE_MISMATCH_JSON}" \
  --argjson future_url_issues "${FUTURE_URL_JSON}" \
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
      future_dated_source_urls: $future_url_count
    },
    issues: {
      duplicate_source_ids_in_entry: $dup_source_issues,
      non200_unmarked_registry_sources: $non200_unmarked_issues,
      published_entries_with_p0_pending: $published_p0_issues,
      source_id_url_host_mismatch: $source_mismatch_issues,
      future_dated_source_urls: $future_url_issues
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
