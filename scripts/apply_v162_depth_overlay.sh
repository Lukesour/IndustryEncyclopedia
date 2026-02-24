#!/usr/bin/env bash
set -euo pipefail

DATA_PATH="${1:-}"
REPORT_PATH="${2:-}"
GATE_PATH="${3:-}"
LATEST_REPORT_PATH="${4:-}"
LATEST_GATE_PATH="${5:-}"

if [[ -z "${DATA_PATH}" || -z "${REPORT_PATH}" || -z "${GATE_PATH}" || -z "${LATEST_REPORT_PATH}" || -z "${LATEST_GATE_PATH}" ]]; then
  echo "Usage: $0 <data_path> <report_path> <gate_path> <latest_report_path> <latest_gate_path>" >&2
  exit 1
fi

GATE_DEEP_PROFILE_MIN="$(jq '."治理配置"."发布硬门槛".deep_profile_all4_min_percent // 60' "${DATA_PATH}")"
GATE_SCENARIO_MIN="$(jq '."治理配置"."发布硬门槛".scenario_bucket_min_per_role // 5' "${DATA_PATH}")"
GATE_SCENARIO_MAX_HITS="$(jq '."治理配置"."发布硬门槛".scenario_bucket_max_hits // 0' "${DATA_PATH}")"
GATE_OBSERVED_MIN="$(jq '."治理配置"."发布硬门槛".role_observed_sample_min_percent // 60' "${DATA_PATH}")"
GATE_OFFICIAL_MIN="$(jq '."治理配置"."发布硬门槛".official_question_share_min_percent // 35' "${DATA_PATH}")"
GATE_CORE_OFFICIAL_MIN="$(jq '."治理配置"."发布硬门槛".official_question_share_core_min_percent // 50' "${DATA_PATH}")"
GATE_CORE_TIER_MIN="$(jq '."治理配置"."发布硬门槛".role_tier_question_targets_v162.core // 14' "${DATA_PATH}")"
GATE_MAIN_TIER_MIN="$(jq '."治理配置"."发布硬门槛".role_tier_question_targets_v162.mainstream // 10' "${DATA_PATH}")"
GATE_LONG_TIER_MIN="$(jq '."治理配置"."发布硬门槛".role_tier_question_targets_v162.longtail // 8' "${DATA_PATH}")"
GATE_FOLLOWUP_RESOURCE_MAX="$(jq '."治理配置"."发布硬门槛".resource_reduction_followup_max_percent // 20' "${DATA_PATH}")"
GATE_ROLE_TEXT_TARGET_V162="$(jq '."治理配置"."发布硬门槛".role_text_duplicate_target_percent_v162 // 65' "${DATA_PATH}")"

V162_METRICS_JSON="$(jq \
  --argjson deep_min "${GATE_DEEP_PROFILE_MIN}" \
  --argjson scenario_min "${GATE_SCENARIO_MIN}" \
  --argjson obs_min "${GATE_OBSERVED_MIN}" \
  --argjson official_min "${GATE_OFFICIAL_MIN}" \
  --argjson core_official_min "${GATE_CORE_OFFICIAL_MIN}" \
  --argjson core_min "${GATE_CORE_TIER_MIN}" \
  --argjson main_min "${GATE_MAIN_TIER_MIN}" \
  --argjson long_min "${GATE_LONG_TIER_MIN}" \
  --argjson resource_max "${GATE_FOLLOWUP_RESOURCE_MAX}" \
  --argjson role_text_target "${GATE_ROLE_TEXT_TARGET_V162}" \
  '
  def filled($x):
    ($x != null)
    and (
      if ($x|type)=="string" then (($x|gsub("\\s+";""))|length) > 0
      elif ($x|type)=="array" then ($x|length) > 0
      elif ($x|type)=="object" then ($x|length) > 0
      else true
      end
    );

  def is_official_question($q):
    (($q.authenticity_level // "") == "official"
      or ($q.authenticity_level // "") == "official_original"
      or (($q.evidence.source_type // "") == "company_official")
      or (($q.evidence.source_type // "") == "government_platform")
      or (($q.evidence.source_type // "") == "government_agency")
      or (($q.evidence.source_type // "") == "government_dataset")
      or (($q.evidence.source_type // "") == "government")
    );

  def has_role_observed_sample($r):
    (($r.platform_backfill_gap.filled_mode // "") == "role_observed_sample")
    or (
      (
        ($r.platform_backfill_gap.filled_mode // "") == "industry_proxy_fallback"
        or ($r.platform_backfill_gap.filled_mode // "") == "keep_blank_with_search_plan_v163b2"
        or ($r.platform_backfill_gap.filled_mode // "") == "keep_blank_with_search_plan_v164"
      )
      and ((($r.platform_backfill_gap.filled_values // {}) | type) == "object")
      and ((($r.platform_backfill_gap.filled_values // {}) | keys | length) >= 5)
      and (($r.platform_backfill_gap.source_evidence // null) != null)
      and ((($r.platform_backfill_gap.source_evidence.source_url // "") | tostring | length) > 0)
    );

  ([."行业词条"[] | .dynamic["岗位画像库"].items[]?]) as $roles
  | ([."行业词条"[] | .dynamic["笔试真题库"].items[]?]) as $written
  | ([."行业词条"[] | .dynamic["面试真题库"].items[]?]) as $interview
  | ($written + $interview) as $questions
  | (reduce $written[] as $q ({}; .[$q.role_id] = ((.[$q.role_id] // 0) + 1))) as $w_counts
  | (reduce $interview[] as $q ({}; .[$q.role_id] = ((.[$q.role_id] // 0) + 1))) as $i_counts
  | (
      reduce $questions[] as $q ({};
        if (($q.scenario_bucket? // null) != null and ($q.scenario_bucket|type)=="string" and ($q.scenario_bucket|length)>0)
        then .[$q.role_id] = ((.[$q.role_id] // []) + [$q.scenario_bucket])
        else .
        end
      )
    ) as $bucket_map
  | (
      [
        ."行业词条"[] as $entry
        | ($entry.static["招聘与成长"]["岗位家族导航"]["核心岗"] // []) as $core_names
        | ($entry.static["招聘与成长"]["岗位家族导航"]["高增长岗"] // []) as $hg_entries
        | ($hg_entries | map(if type=="object" then (.mapped_role_name // .role_name // "") else . end)) as $hg_names
        | $entry.dynamic["岗位画像库"].items[]?
        | . as $role
        | {
            role_id: $role.role_id,
            role_name: $role.role_name,
            industry_id: $entry.industry_id,
            tier: (
              if ($core_names | index($role.role_name)) then "core"
              elif ($hg_names | index($role.role_name)) then "mainstream"
              else "longtail"
              end
            )
          }
      ]
    ) as $tier_rows
  | (($tier_rows | map({key: .role_id, value: .tier}) | from_entries)) as $tier_map
  | ([ $roles[] | select(filled(.career_outlook_3to5_year?) and filled(.typical_work_week?) and filled(.switch_directions?) and filled(.prepare_180d_plan?)) ] | length) as $deep_count
  | ($roles | length) as $role_total
  | ([ $roles[] | select(has_role_observed_sample(.)) ] | length) as $observed_count
  | ([ $questions[] | select(is_official_question(.)) ] | length) as $official_count
  | ([ $questions[] | select(($tier_map[.role_id] // "longtail") == "core") ]) as $core_questions
  | ([ $core_questions[] | select(is_official_question(.)) ] | length) as $core_official_count
  | ([ $roles[] | {role_id, role_name, bucket_count: (($bucket_map[.role_id] // []) | unique | length)} ]) as $bucket_rows
  | ([ $bucket_rows[] | select(.bucket_count < $scenario_min) ]) as $bucket_issues
  | ([ $roles[]
      | . as $r
      | ($tier_map[$r.role_id] // "longtail") as $tier
      | ($w_counts[$r.role_id] // 0) as $w
      | ($i_counts[$r.role_id] // 0) as $i
      | (if $tier == "core" then $core_min elif $tier == "mainstream" then $main_min else $long_min end) as $min_required
      | select($w < $min_required or $i < $min_required)
      | {
          role_id: $r.role_id,
          role_name: $r.role_name,
          tier: $tier,
          written_count: $w,
          interview_count: $i,
          min_required: $min_required
        }
    ]) as $tier_issues
  | ([ $questions[] | .follow_up_questions[]? | select(type == "string") ]) as $followups
  | ([ $followups[] | select(test("资源减半|关键资源减半|重排优先级")) ] | length) as $resource_followup_count
  | {
      deep_profile_all4_count: $deep_count,
      deep_profile_all4_percent: (if $role_total == 0 then 0 else ($deep_count * 100 / $role_total) end),
      deep_profile_all4_min_percent: $deep_min,
      scenario_bucket_min_per_role: $scenario_min,
      scenario_bucket_hits: ($bucket_issues | length),
      scenario_bucket_max_hits: 0,
      scenario_bucket_records: $bucket_issues,
      role_observed_sample_count: $observed_count,
      role_observed_sample_percent: (if $role_total == 0 then 0 else ($observed_count * 100 / $role_total) end),
      role_observed_sample_min_percent: $obs_min,
      official_question_share_count: $official_count,
      question_total: ($questions | length),
      official_question_share_percent: (if ($questions | length) == 0 then 0 else ($official_count * 100 / ($questions | length)) end),
      official_question_share_min_percent: $official_min,
      core_question_total: ($core_questions | length),
      core_official_question_share_count: $core_official_count,
      core_official_question_share_percent: (if ($core_questions | length) == 0 then 0 else ($core_official_count * 100 / ($core_questions | length)) end),
      official_question_share_core_min_percent: $core_official_min,
      role_tier_question_targets: {core: $core_min, mainstream: $main_min, longtail: $long_min},
      role_tier_question_hits: ($tier_issues | length),
      role_tier_question_records: $tier_issues,
      resource_reduction_followup_count: $resource_followup_count,
      follow_up_total: ($followups | length),
      resource_reduction_followup_percent: (if ($followups | length) == 0 then 0 else ($resource_followup_count * 100 / ($followups | length)) end),
      resource_reduction_followup_max_percent: $resource_max,
      role_text_duplicate_target_percent_v162: $role_text_target
    }
  ' "${DATA_PATH}")"

jq --argjson v162 "${V162_METRICS_JSON}" '
  .gates += {
    deep_profile_all4_count_v162: $v162.deep_profile_all4_count,
    deep_profile_all4_percent_v162: $v162.deep_profile_all4_percent,
    deep_profile_all4_min_percent_v162: $v162.deep_profile_all4_min_percent,
    scenario_bucket_min_per_role_v162: $v162.scenario_bucket_min_per_role,
    scenario_bucket_hits_v162: $v162.scenario_bucket_hits,
    scenario_bucket_max_hits_v162: $v162.scenario_bucket_max_hits,
    role_observed_sample_percent_v162: $v162.role_observed_sample_percent,
    role_observed_sample_min_percent_v162: $v162.role_observed_sample_min_percent,
    official_question_share_percent_v162: $v162.official_question_share_percent,
    official_question_share_min_percent_v162: $v162.official_question_share_min_percent,
    core_official_question_share_percent_v162: $v162.core_official_question_share_percent,
    official_question_share_core_min_percent_v162: $v162.official_question_share_core_min_percent,
    role_tier_question_hits_v162: $v162.role_tier_question_hits,
    resource_reduction_followup_percent_v162: $v162.resource_reduction_followup_percent,
    resource_reduction_followup_max_percent_v162: $v162.resource_reduction_followup_max_percent
  }
  | .issues += {
    scenario_bucket_records_v162: $v162.scenario_bucket_records,
    role_tier_question_records_v162: $v162.role_tier_question_records,
    deep_profile_all4_threshold_v162: {
      actual_percent: $v162.deep_profile_all4_percent,
      threshold_percent: $v162.deep_profile_all4_min_percent
    },
    scenario_bucket_threshold_v162: {
      actual_hits: $v162.scenario_bucket_hits,
      max_hits: $v162.scenario_bucket_max_hits,
      min_bucket_per_role: $v162.scenario_bucket_min_per_role
    },
    role_observed_sample_threshold_v162: {
      actual_percent: $v162.role_observed_sample_percent,
      threshold_percent: $v162.role_observed_sample_min_percent
    },
    official_question_share_threshold_v162: {
      actual_percent: $v162.official_question_share_percent,
      threshold_percent: $v162.official_question_share_min_percent
    },
    core_official_question_share_threshold_v162: {
      actual_percent: $v162.core_official_question_share_percent,
      threshold_percent: $v162.official_question_share_core_min_percent
    },
    resource_reduction_followup_threshold_v162: {
      actual_percent: $v162.resource_reduction_followup_percent,
      threshold_percent: $v162.resource_reduction_followup_max_percent
    }
  }
' "${GATE_PATH}" > "${GATE_PATH}.tmp"
mv "${GATE_PATH}.tmp" "${GATE_PATH}"
cp "${GATE_PATH}" "${LATEST_GATE_PATH}"

jq --argjson v162 "${V162_METRICS_JSON}" '. + {depth_upgrade_v162: $v162}' "${REPORT_PATH}" > "${REPORT_PATH}.tmp"
mv "${REPORT_PATH}.tmp" "${REPORT_PATH}"
cp "${REPORT_PATH}" "${LATEST_REPORT_PATH}"

V162_BLOCKERS=0
V162_DEEP_PERCENT="$(jq -r '.deep_profile_all4_percent' <<<"${V162_METRICS_JSON}")"
V162_DEEP_MIN="$(jq -r '.deep_profile_all4_min_percent' <<<"${V162_METRICS_JSON}")"
V162_SCENARIO_HITS="$(jq -r '.scenario_bucket_hits' <<<"${V162_METRICS_JSON}")"
V162_SCENARIO_MAX="$(jq -r '.scenario_bucket_max_hits' <<<"${V162_METRICS_JSON}")"
V162_OBS_PERCENT="$(jq -r '.role_observed_sample_percent' <<<"${V162_METRICS_JSON}")"
V162_OBS_MIN="$(jq -r '.role_observed_sample_min_percent' <<<"${V162_METRICS_JSON}")"
V162_OFFICIAL_PERCENT="$(jq -r '.official_question_share_percent' <<<"${V162_METRICS_JSON}")"
V162_OFFICIAL_MIN="$(jq -r '.official_question_share_min_percent' <<<"${V162_METRICS_JSON}")"
V162_CORE_OFFICIAL_PERCENT="$(jq -r '.core_official_question_share_percent' <<<"${V162_METRICS_JSON}")"
V162_CORE_OFFICIAL_MIN="$(jq -r '.official_question_share_core_min_percent' <<<"${V162_METRICS_JSON}")"
V162_TIER_HITS="$(jq -r '.role_tier_question_hits' <<<"${V162_METRICS_JSON}")"

if awk -v a="${V162_DEEP_PERCENT}" -v b="${V162_DEEP_MIN}" 'BEGIN{exit !(a < b)}'; then V162_BLOCKERS=1; fi
if awk -v a="${V162_SCENARIO_HITS}" -v b="${V162_SCENARIO_MAX}" 'BEGIN{exit !(a > b)}'; then V162_BLOCKERS=1; fi
if awk -v a="${V162_OBS_PERCENT}" -v b="${V162_OBS_MIN}" 'BEGIN{exit !(a < b)}'; then V162_BLOCKERS=1; fi
if awk -v a="${V162_OFFICIAL_PERCENT}" -v b="${V162_OFFICIAL_MIN}" 'BEGIN{exit !(a < b)}'; then V162_BLOCKERS=1; fi
if awk -v a="${V162_CORE_OFFICIAL_PERCENT}" -v b="${V162_CORE_OFFICIAL_MIN}" 'BEGIN{exit !(a < b)}'; then V162_BLOCKERS=1; fi
if awk -v a="${V162_TIER_HITS}" 'BEGIN{exit !(a > 0)}'; then V162_BLOCKERS=1; fi

echo "${V162_BLOCKERS}"
