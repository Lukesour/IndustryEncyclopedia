#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DATA_PATH="${1:-${ROOT_DIR}/行业百科.json}"
REPORT_PATH="${2:-${ROOT_DIR}/reports/quality_report_latest.json}"
GATE_PATH="${3:-${ROOT_DIR}/reports/quality_gate_latest.json}"
LATEST_REPORT_PATH="${4:-${ROOT_DIR}/reports/quality_report_latest.json}"
LATEST_GATE_PATH="${5:-${ROOT_DIR}/reports/quality_gate_latest.json}"

GATE_MAP_MAX="$(jq '."治理配置"."发布硬门槛".role_profile_mapping_gap_max_hits // 0' "${DATA_PATH}")"
GATE_OFFICIAL_MIN="$(jq '."治理配置"."发布硬门槛".official_job_detail_url_min_percent // 20' "${DATA_PATH}")"
GATE_SEARCH_MAX="$(jq '."治理配置"."发布硬门槛".search_query_url_max_percent // 80' "${DATA_PATH}")"
GATE_TRI_CHAIN_MIN="$(jq '."治理配置"."发布硬门槛".role_evidence_tri_chain_min_percent // 60' "${DATA_PATH}")"
GATE_PROMPT_DUP_MAX="$(jq '."治理配置"."发布硬门槛".question_prompt_duplicate_max_percent // 35' "${DATA_PATH}")"
GATE_COMPANY_AVG_MIN="$(jq '."治理配置"."发布硬门槛".decision_company_list_min_avg // 8' "${DATA_PATH}")"
GATE_TIMELINE_AVG_MIN="$(jq '."治理配置"."发布硬门槛".decision_timeline_min_avg // 4' "${DATA_PATH}")"
GATE_CASE_AVG_MIN="$(jq '."治理配置"."发布硬门槛".decision_case_min_avg // 5' "${DATA_PATH}")"
GATE_TALK_AVG_MIN="$(jq '."治理配置"."发布硬门槛".decision_talk_min_avg // 5' "${DATA_PATH}")"

ROLE_MAPPING_JSON="$(jq '
[
  ."行业词条"[] as $e
  | ($e.dynamic["岗位画像库"].items | map(.role_id) | unique) as $profile
  | (
      (($e.dynamic["笔试真题库"].items + $e.dynamic["面试真题库"].items)
       | group_by(.role_id)
       | map(.[0]))
      | map(select((.role_id as $rid | $profile | index($rid)) | not))
    ) as $missing
  | select(($missing | length) > 0)
  | {
      industry_id: $e.industry_id,
      industry_name: $e."行业名称",
      missing_count: ($missing | length),
      missing_roles: ($missing | map({role_id, role_name}))
    }
]
' "${DATA_PATH}")"
ROLE_MAPPING_COUNT="$(jq '[.[].missing_count] | add // 0' <<<"${ROLE_MAPPING_JSON}")"

DEEP_LINK_QUALITY_JSON="$(jq '
(reduce ."来源注册表"[] as $s ({}; .[$s.source_id] = $s.source_type)) as $type_map
| ([."行业词条"[] | .dynamic["岗位画像库"].items[]?]) as $roles
| ($roles | length) as $total
| {
    total_roles: $total,
    official_job_detail_count: ([
      $roles[]
      | select((.evidence.source_type // "") == "company_official")
      | select((.evidence.source_url // "") | test("^https?://[^/]+/.+"))
    ] | length),
    search_query_url_count: ([
      $roles[]
      | select((.evidence.source_url // "") | test("zhipin\\.com/web/geek/job\\?query="))
    ] | length),
    role_evidence_tri_chain_count: ([
      $roles[] as $r
      | ([($r.evidence.source_type // "")] + [($r.evidence.secondary_source_ids[]? | ($type_map[.] // ""))]) as $types
      | ($types | map(select(. != "")) | unique) as $u
      | select(
          ([$u[] | select(. == "company_official" or . == "government_platform" or . == "government_agency" or . == "government_policy" or . == "government_dataset")] | length) > 0
          and ([$u[] | select(. == "commercial_platform" or . == "general_platform")] | length) > 0
          and ([$u[] | select(. == "real_user")] | length) > 0
        )
    ] | length)
  }
| . + {
    official_job_detail_percent: (if .total_roles == 0 then 0 else (.official_job_detail_count * 100 / .total_roles) end),
    search_query_url_percent: (if .total_roles == 0 then 0 else (.search_query_url_count * 100 / .total_roles) end),
    role_evidence_tri_chain_percent: (if .total_roles == 0 then 0 else (.role_evidence_tri_chain_count * 100 / .total_roles) end)
  }
' "${DATA_PATH}")"

PROMPT_DUP_JSON="$(jq '
([."行业词条"[] | .dynamic["笔试真题库"].items[]? | (.prompt // "") | sub("^【[^】]*】"; "")]) as $w
| ([."行业词条"[] | .dynamic["面试真题库"].items[]? | (.prompt // "") | sub("^【[^】]*】"; "")]) as $i
| {
    written_total: ($w | length),
    written_unique: ($w | unique | length),
    written_duplicate_percent: (if ($w | length) == 0 then 0 else ((($w | length) - ($w | unique | length)) * 100 / ($w | length)) end),
    interview_total: ($i | length),
    interview_unique: ($i | unique | length),
    interview_duplicate_percent: (if ($i | length) == 0 then 0 else ((($i | length) - ($i | unique | length)) * 100 / ($i | length)) end)
  }
| . + {max_duplicate_percent: (if .written_duplicate_percent > .interview_duplicate_percent then .written_duplicate_percent else .interview_duplicate_percent end)}
' "${DATA_PATH}")"

DECISION_DEPTH_JSON="$(jq '
([."行业词条"[] | (.dynamic["公司清单"].items | length)]) as $company
| ([."行业词条"[] | (.dynamic["年度校招时间线"].items | length)]) as $timeline
| ([."行业词条"[] | (.dynamic["案例复盘"].items | length)]) as $case
| ([."行业词条"[] | (.dynamic["从业者访谈"].items | length)]) as $talk
| {
    industry_count: ($company | length),
    company_avg: (if ($company | length) == 0 then 0 else (($company | add) / ($company | length)) end),
    company_min: (if ($company | length) == 0 then 0 else ($company | min) end),
    timeline_avg: (if ($timeline | length) == 0 then 0 else (($timeline | add) / ($timeline | length)) end),
    timeline_min: (if ($timeline | length) == 0 then 0 else ($timeline | min) end),
    case_avg: (if ($case | length) == 0 then 0 else (($case | add) / ($case | length)) end),
    case_min: (if ($case | length) == 0 then 0 else ($case | min) end),
    talk_avg: (if ($talk | length) == 0 then 0 else (($talk | add) / ($talk | length)) end),
    talk_min: (if ($talk | length) == 0 then 0 else ($talk | min) end)
  }
' "${DATA_PATH}")"

EXPERIENCE_V158_JSON="$(jq -n \
  --argjson role_mapping_records "${ROLE_MAPPING_JSON}" \
  --argjson role_mapping_count "${ROLE_MAPPING_COUNT}" \
  --argjson deep_link "${DEEP_LINK_QUALITY_JSON}" \
  --argjson prompt_dup "${PROMPT_DUP_JSON}" \
  --argjson decision_depth "${DECISION_DEPTH_JSON}" \
  '{
    role_profile_mapping: {
      missing_roles_total: $role_mapping_count,
      missing_by_industry: $role_mapping_records
    },
    deep_link_quality: $deep_link,
    prompt_uniqueness: $prompt_dup,
    decision_module_depth: $decision_depth
  }')"

jq --argjson exp_v158 "${EXPERIENCE_V158_JSON}" '. + {experience_depth_v158: $exp_v158}' "${REPORT_PATH}" > "${REPORT_PATH}.tmp"
mv "${REPORT_PATH}.tmp" "${REPORT_PATH}"
cp "${REPORT_PATH}" "${LATEST_REPORT_PATH}"

OFFICIAL_PERCENT="$(jq '.official_job_detail_percent' <<<"${DEEP_LINK_QUALITY_JSON}")"
SEARCH_PERCENT="$(jq '.search_query_url_percent' <<<"${DEEP_LINK_QUALITY_JSON}")"
TRI_CHAIN_PERCENT="$(jq '.role_evidence_tri_chain_percent' <<<"${DEEP_LINK_QUALITY_JSON}")"
PROMPT_DUP_PERCENT="$(jq '.max_duplicate_percent' <<<"${PROMPT_DUP_JSON}")"
COMPANY_AVG="$(jq '.company_avg' <<<"${DECISION_DEPTH_JSON}")"
TIMELINE_AVG="$(jq '.timeline_avg' <<<"${DECISION_DEPTH_JSON}")"
CASE_AVG="$(jq '.case_avg' <<<"${DECISION_DEPTH_JSON}")"
TALK_AVG="$(jq '.talk_avg' <<<"${DECISION_DEPTH_JSON}")"

DECISION_DEPTH_VIOLATION_JSON="$(jq -n \
  --argjson company_avg "${COMPANY_AVG}" --argjson company_min "${GATE_COMPANY_AVG_MIN}" \
  --argjson timeline_avg "${TIMELINE_AVG}" --argjson timeline_min "${GATE_TIMELINE_AVG_MIN}" \
  --argjson case_avg "${CASE_AVG}" --argjson case_min "${GATE_CASE_AVG_MIN}" \
  --argjson talk_avg "${TALK_AVG}" --argjson talk_min "${GATE_TALK_AVG_MIN}" \
  '{
    company_avg: $company_avg,
    company_min: $company_min,
    timeline_avg: $timeline_avg,
    timeline_min: $timeline_min,
    case_avg: $case_avg,
    case_min: $case_min,
    talk_avg: $talk_avg,
    talk_min: $talk_min,
    violated_modules: [
      (if $company_avg < $company_min then "company_list" else empty end),
      (if $timeline_avg < $timeline_min then "timeline" else empty end),
      (if $case_avg < $case_min then "case_review" else empty end),
      (if $talk_avg < $talk_min then "interviews" else empty end)
    ]
  }')"
DECISION_DEPTH_HITS="$(jq '.violated_modules | length' <<<"${DECISION_DEPTH_VIOLATION_JSON}")"

OVERLAY_BLOCKERS=0
if awk -v a="${ROLE_MAPPING_COUNT}" -v b="${GATE_MAP_MAX}" 'BEGIN{exit !(a > b)}'; then OVERLAY_BLOCKERS=1; fi
if awk -v a="${OFFICIAL_PERCENT}" -v b="${GATE_OFFICIAL_MIN}" 'BEGIN{exit !(a < b)}'; then OVERLAY_BLOCKERS=1; fi
if awk -v a="${SEARCH_PERCENT}" -v b="${GATE_SEARCH_MAX}" 'BEGIN{exit !(a > b)}'; then OVERLAY_BLOCKERS=1; fi
if awk -v a="${TRI_CHAIN_PERCENT}" -v b="${GATE_TRI_CHAIN_MIN}" 'BEGIN{exit !(a < b)}'; then OVERLAY_BLOCKERS=1; fi
if awk -v a="${PROMPT_DUP_PERCENT}" -v b="${GATE_PROMPT_DUP_MAX}" 'BEGIN{exit !(a > b)}'; then OVERLAY_BLOCKERS=1; fi
if awk -v a="${DECISION_DEPTH_HITS}" 'BEGIN{exit !(a > 0)}'; then OVERLAY_BLOCKERS=1; fi

ROLE_MAPPING_THRESHOLD="$(jq -n --argjson actual "${ROLE_MAPPING_COUNT}" --argjson threshold "${GATE_MAP_MAX}" '{actual_hits:$actual, threshold_hits:$threshold}')"
OFFICIAL_THRESHOLD="$(jq -n --argjson actual "${OFFICIAL_PERCENT}" --argjson threshold "${GATE_OFFICIAL_MIN}" '{actual_percent:$actual, threshold_percent:$threshold}')"
SEARCH_THRESHOLD="$(jq -n --argjson actual "${SEARCH_PERCENT}" --argjson threshold "${GATE_SEARCH_MAX}" '{actual_percent:$actual, threshold_percent:$threshold}')"
TRI_CHAIN_THRESHOLD="$(jq -n --argjson actual "${TRI_CHAIN_PERCENT}" --argjson threshold "${GATE_TRI_CHAIN_MIN}" '{actual_percent:$actual, threshold_percent:$threshold}')"
PROMPT_DUP_THRESHOLD="$(jq -n --argjson actual "${PROMPT_DUP_PERCENT}" --argjson threshold "${GATE_PROMPT_DUP_MAX}" '{actual_percent:$actual, threshold_percent:$threshold}')"

jq \
  --argjson overlay_blockers "${OVERLAY_BLOCKERS}" \
  --argjson role_mapping_count "${ROLE_MAPPING_COUNT}" \
  --argjson role_mapping_max "${GATE_MAP_MAX}" \
  --argjson official_percent "${OFFICIAL_PERCENT}" \
  --argjson official_min "${GATE_OFFICIAL_MIN}" \
  --argjson search_percent "${SEARCH_PERCENT}" \
  --argjson search_max "${GATE_SEARCH_MAX}" \
  --argjson tri_chain_percent "${TRI_CHAIN_PERCENT}" \
  --argjson tri_chain_min "${GATE_TRI_CHAIN_MIN}" \
  --argjson prompt_dup_percent "${PROMPT_DUP_PERCENT}" \
  --argjson prompt_dup_max "${GATE_PROMPT_DUP_MAX}" \
  --argjson decision_depth_hits "${DECISION_DEPTH_HITS}" \
  --argjson company_avg "${COMPANY_AVG}" \
  --argjson company_min "${GATE_COMPANY_AVG_MIN}" \
  --argjson timeline_avg "${TIMELINE_AVG}" \
  --argjson timeline_min "${GATE_TIMELINE_AVG_MIN}" \
  --argjson case_avg "${CASE_AVG}" \
  --argjson case_min "${GATE_CASE_AVG_MIN}" \
  --argjson talk_avg "${TALK_AVG}" \
  --argjson talk_min "${GATE_TALK_AVG_MIN}" \
  --argjson role_mapping_records "${ROLE_MAPPING_JSON}" \
  --argjson role_mapping_threshold "${ROLE_MAPPING_THRESHOLD}" \
  --argjson official_threshold "${OFFICIAL_THRESHOLD}" \
  --argjson search_threshold "${SEARCH_THRESHOLD}" \
  --argjson tri_chain_threshold "${TRI_CHAIN_THRESHOLD}" \
  --argjson prompt_dup_threshold "${PROMPT_DUP_THRESHOLD}" \
  --argjson decision_depth_threshold "${DECISION_DEPTH_VIOLATION_JSON}" \
  '
  .gates += {
    role_profile_mapping_gap_hits: $role_mapping_count,
    role_profile_mapping_gap_max_hits: $role_mapping_max,
    official_job_detail_url_percent_v158: $official_percent,
    official_job_detail_url_min_percent_v158: $official_min,
    search_query_url_percent_v158: $search_percent,
    search_query_url_max_percent_v158: $search_max,
    role_evidence_tri_chain_percent: $tri_chain_percent,
    role_evidence_tri_chain_min_percent: $tri_chain_min,
    question_prompt_duplicate_percent_v158: $prompt_dup_percent,
    question_prompt_duplicate_max_percent_v158: $prompt_dup_max,
    decision_module_depth_hits_v158: $decision_depth_hits,
    decision_company_list_avg: $company_avg,
    decision_company_list_min_avg: $company_min,
    decision_timeline_avg: $timeline_avg,
    decision_timeline_min_avg: $timeline_min,
    decision_case_avg: $case_avg,
    decision_case_min_avg: $case_min,
    decision_talk_avg: $talk_avg,
    decision_talk_min_avg: $talk_min
  }
  | .issues += {
    role_profile_mapping_gap_records: $role_mapping_records,
    role_profile_mapping_gap_threshold: $role_mapping_threshold,
    official_job_detail_url_threshold_v158: $official_threshold,
    search_query_url_threshold_v158: $search_threshold,
    role_evidence_tri_chain_threshold: $tri_chain_threshold,
    question_prompt_duplicate_threshold_v158: $prompt_dup_threshold,
    decision_module_depth_threshold_v158: $decision_depth_threshold
  }
  | .has_blockers = (.has_blockers or ($overlay_blockers == 1))
  ' "${GATE_PATH}" > "${GATE_PATH}.tmp"

mv "${GATE_PATH}.tmp" "${GATE_PATH}"
cp "${GATE_PATH}" "${LATEST_GATE_PATH}"

printf '%s\n' "${OVERLAY_BLOCKERS}"
