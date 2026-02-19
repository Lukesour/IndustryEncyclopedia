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
DEPTH_GAP_PATH="${REPORT_DIR}/depth_gap_${DATE_TAG}.json"
LATEST_DEPTH_GAP_PATH="${REPORT_DIR}/depth_gap_latest.json"
RECENT_CUTOFF="$(date -v-180d +%Y-%m-%d 2>/dev/null || date -d '180 days ago' +%Y-%m-%d)"

mkdir -p "${REPORT_DIR}"

"${ROOT_DIR}/scripts/validate_industry_encyclopedia.sh" "${ROOT_DIR}/行业百科.schema.json" "${DATA_PATH}"

jq --arg recent_cutoff "${RECENT_CUTOFF}" '
def stddev($arr):
  if ($arr | length) == 0 then 0
  else
    ($arr | add / length) as $mean
    | (([$arr[] | (. - $mean) * (. - $mean)] | add) / ($arr | length) | sqrt)
  end;

([."行业词条"[]|.dynamic["笔试真题库"].items[]?]) as $written_items |
([."行业词条"[]|.dynamic["面试真题库"].items[]?]) as $interview_items |
([."行业词条"[]|.dynamic|to_entries[]|.value.items[]?|(.evidence.source_id // .source_id // empty)]) as $source_refs |
([.. | objects | (.publish_date? // .source_date?) | select(type == "string" and test("^\\d{4}-\\d{2}-\\d{2}$"))]) as $source_dates |
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
([."行业词条"[]|([.dynamic["行业事件日志"].items[]? | ((.evidence.publish_date // .publish_date // .evidence.source_date // .source_date // "") | tostring) as $d | select(($d | test("^\\d{4}-\\d{2}-\\d{2}$")) and ($d >= $recent_cutoff))] | length)]) as $event_recent_counts |
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
    effective_date_method: "publish_date_first_fallback_source_date",
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
  personalization: {
    slots_total: ([."行业词条"[]|.dynamic["岗位画像库"].items[]?|.project_evidence_slots[]?]|length),
    pending_total: ([."行业词条"[]|.dynamic["岗位画像库"].items[]?|.project_evidence_slots[]?|select((.status // "") as $s | ($s | startswith("pending_personalization")) or ($s == "pending_user_fill"))]|length),
    completion_percent: (
      ([."行业词条"[]|.dynamic["岗位画像库"].items[]?|.project_evidence_slots[]?]|length) as $total
      | ([."行业词条"[]|.dynamic["岗位画像库"].items[]?|.project_evidence_slots[]?|select((.status // "") as $s | ($s | startswith("pending_personalization")) or ($s == "pending_user_fill"))]|length) as $pending
      | if $total == 0 then 100 else ((($total - $pending) * 100) / $total) end
    )
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

# v1.45 depth target telemetry (non-blocking): role scale, per-role question density, source URL depth.
DEPTH_TARGET_ROLE_COUNT="$(jq '."治理配置"."发布硬门槛".role_count_target_per_industry // 24' "${DATA_PATH}")"
DEPTH_TARGET_WRITTEN_PER_ROLE="$(jq '."治理配置"."发布硬门槛".question_written_per_role_target // 12' "${DATA_PATH}")"
DEPTH_TARGET_INTERVIEW_PER_ROLE="$(jq '."治理配置"."发布硬门槛".question_interview_per_role_target // 12' "${DATA_PATH}")"
DEPTH_TARGET_STAGE_COVERAGE="$(jq '."治理配置"."发布硬门槛".question_stage_coverage_target // 4' "${DATA_PATH}")"
DEPTH_TARGET_JOB_DETAIL_URL="$(jq '."治理配置"."发布硬门槛".job_detail_url_min_percent // 60' "${DATA_PATH}")"

DEPTH_METRICS_JSON="$(jq \
  --argjson target_role "${DEPTH_TARGET_ROLE_COUNT}" \
  --argjson target_written "${DEPTH_TARGET_WRITTEN_PER_ROLE}" \
  --argjson target_interview "${DEPTH_TARGET_INTERVIEW_PER_ROLE}" \
  --argjson target_stage "${DEPTH_TARGET_STAGE_COVERAGE}" \
  --argjson target_url "${DEPTH_TARGET_JOB_DETAIL_URL}" \
  '
  ([."行业词条"[] | (.dynamic["岗位画像库"].items | length)]) as $role_counts
  | ([."行业词条"[] | ((.dynamic["笔试真题库"].items | length) / ((.dynamic["岗位画像库"].items | length) as $r | if $r == 0 then 1 else $r end))]) as $written_per_role
  | ([."行业词条"[] | ((.dynamic["面试真题库"].items | length) / ((.dynamic["岗位画像库"].items | length) as $r | if $r == 0 then 1 else $r end))]) as $interview_per_role
  | ([."行业词条"[] | .dynamic["岗位画像库"].items[]?] | length) as $role_total
  | (
      [
        ."行业词条"[]
        | .dynamic["岗位画像库"].items[]?.role_id as $rid
        | ([.dynamic["笔试真题库"].items[]? | select(.role_id == $rid) | .recruitment_stage] | unique | length)
      ]
    ) as $written_stage_coverages
  | (
      [
        ."行业词条"[]
        | .dynamic["岗位画像库"].items[]?.role_id as $rid
        | ([.dynamic["面试真题库"].items[]? | select(.role_id == $rid) | .recruitment_stage] | unique | length)
      ]
    ) as $interview_stage_coverages
  | ([.. | objects | .evidence?.source_url? | select(type=="string")]) as $urls
  | {
      target: {
        role_count_per_industry: $target_role,
        written_per_role: $target_written,
        interview_per_role: $target_interview,
        stage_coverage_per_role: $target_stage,
        job_detail_url_min_percent: $target_url
      },
      actual: {
        role_count_per_industry: {
          avg: (if ($role_counts|length)==0 then 0 else ($role_counts|add)/($role_counts|length) end),
          min: (if ($role_counts|length)==0 then 0 else ($role_counts|min) end),
          max: (if ($role_counts|length)==0 then 0 else ($role_counts|max) end)
        },
        written_per_role: {
          avg: (if ($written_per_role|length)==0 then 0 else ($written_per_role|add)/($written_per_role|length) end),
          min: (if ($written_per_role|length)==0 then 0 else ($written_per_role|min) end),
          max: (if ($written_per_role|length)==0 then 0 else ($written_per_role|max) end)
        },
        interview_per_role: {
          avg: (if ($interview_per_role|length)==0 then 0 else ($interview_per_role|add)/($interview_per_role|length) end),
          min: (if ($interview_per_role|length)==0 then 0 else ($interview_per_role|min) end),
          max: (if ($interview_per_role|length)==0 then 0 else ($interview_per_role|max) end)
        },
        stage_coverage_per_role: {
          written_avg: (if ($written_stage_coverages|length)==0 then 0 else ($written_stage_coverages|add)/($written_stage_coverages|length) end),
          interview_avg: (if ($interview_stage_coverages|length)==0 then 0 else ($interview_stage_coverages|add)/($interview_stage_coverages|length) end)
        },
        source_url_depth: {
          depth_ge2_percent: (
            if ($urls|length)==0 then 0
            else (
              (
                [$urls[] | (try (capture("https?://[^/]+(?<path>/.*)?").path // "") catch "") | split("/") | map(select(length>0)) | length | select(. >= 2)]
                | length
              ) * 100 / ($urls|length)
            )
            end
          )
        }
      }
    }
  ' "${DATA_PATH}")"

jq --argjson depth_metrics "${DEPTH_METRICS_JSON}" '. + {depth_targets_v145: $depth_metrics}' "${REPORT_PATH}" > "${REPORT_PATH}.tmp"
mv "${REPORT_PATH}.tmp" "${REPORT_PATH}"
cp "${REPORT_PATH}" "${LATEST_PATH}"

TEMPLATE_REUSE_METRICS_JSON="$(jq '
  def top1_pct($arr):
    if ($arr|length)==0 then 0
    else ((($arr|group_by(.)|map(length)|max)//0) * 100 / ($arr|length))
    end;
  def top3_pct($arr):
    if ($arr|length)==0 then 0
    else ((($arr|group_by(.)|map(length)|sort|reverse|.[0:3]|add)//0) * 100 / ($arr|length))
    end;
  ([."行业词条"[]|.dynamic["笔试真题库"].items[]?|((.answer_framework // [])|@json)]) as $w_framework
  | ([."行业词条"[]|.dynamic["面试真题库"].items[]?|((.answer_framework // [])|@json)]) as $i_framework
  | ([."行业词条"[]|.dynamic["笔试真题库"].items[]?|(.follow_up_questions[]? // empty)]) as $w_followup
  | ([."行业词条"[]|.dynamic["面试真题库"].items[]?|(.follow_up_questions[]? // empty)]) as $i_followup
  | ([."行业词条"[]|.dynamic["岗位画像库"].items[]?|((.elimination_risks // [])|@json)]) as $r_elimination
  | {
      answer_framework: {
        written_top1_percent: top1_pct($w_framework),
        written_top3_percent: top3_pct($w_framework),
        interview_top1_percent: top1_pct($i_framework),
        interview_top3_percent: top3_pct($i_framework)
      },
      follow_up_questions: {
        written_top1_percent: top1_pct($w_followup),
        written_top3_percent: top3_pct($w_followup),
        interview_top1_percent: top1_pct($i_followup),
        interview_top3_percent: top3_pct($i_followup)
      },
      elimination_risks: {
        role_profile_top1_percent: top1_pct($r_elimination),
        role_profile_top3_percent: top3_pct($r_elimination)
      }
    }
' "${DATA_PATH}")"

jq --argjson template_reuse "${TEMPLATE_REUSE_METRICS_JSON}" '. + {template_reuse_v145: $template_reuse}' "${REPORT_PATH}" > "${REPORT_PATH}.tmp"
mv "${REPORT_PATH}.tmp" "${REPORT_PATH}"
cp "${REPORT_PATH}" "${LATEST_PATH}"

# v1.55 encyclopedia-depth telemetry (report-only): high-growth landing, core-role 4-stage coverage,
# role-card deep links, pending platform verification ratio, and expansion-candidate landing.
DEPTH_V155_HG_MIN="$(jq '."治理配置"."百科深度门槛_v155".targets.high_growth_landing_min_percent // 90' "${DATA_PATH}")"
DEPTH_V155_CORE4_MIN="$(jq '."治理配置"."百科深度门槛_v155".targets.core_role_four_stage_min_percent // 85' "${DATA_PATH}")"
DEPTH_V155_DEEP_LINK_MIN="$(jq '."治理配置"."百科深度门槛_v155".targets.role_profile_deep_link_min_percent // 60' "${DATA_PATH}")"
DEPTH_V155_PENDING_MAX="$(jq '."治理配置"."百科深度门槛_v155".targets.platform_verification_pending_max_percent // 25' "${DATA_PATH}")"
DEPTH_V155_MODE="$(jq -r '."治理配置"."百科深度门槛_v155".gate_mode // "report_only"' "${DATA_PATH}")"
DEPTH_V155_ENABLED="$(jq '."治理配置"."百科深度门槛_v155".enabled // false' "${DATA_PATH}")"

DEPTH_V155_METRICS_JSON="$(jq \
  --argjson hg_min "${DEPTH_V155_HG_MIN}" \
  --argjson core4_min "${DEPTH_V155_CORE4_MIN}" \
  --argjson deep_link_min "${DEPTH_V155_DEEP_LINK_MIN}" \
  --argjson pending_max "${DEPTH_V155_PENDING_MAX}" \
  --arg depth_mode "${DEPTH_V155_MODE}" \
  --argjson depth_enabled "${DEPTH_V155_ENABLED}" \
  '
  def url_depth($u):
    if ($u|type)!="string" then 0
    else (
      (try (capture("https?://[^/]+(?<path>/.*)?").path // "") catch "")
      | split("/") | map(select(length>0)) | length
    )
    end;

  def stage_cov($items; $role_id):
    ([ $items[]? | select(.role_id == $role_id) | .recruitment_stage ] | unique | length);

  [."行业词条"[] as $entry
    | ($entry.dynamic["岗位画像库"].items // []) as $roles
    | ($entry.dynamic["笔试真题库"].items // []) as $written
    | ($entry.dynamic["面试真题库"].items // []) as $interview
    | ($entry.static["招聘与成长"]["岗位家族导航"]["核心岗"] // []) as $core_names
    | ($entry.static["招聘与成长"]["岗位家族导航"]["高增长岗"] // []) as $high_growth
    | ($entry.dynamic["自定义扩展"].items // []) as $ext_items
    | (
        [
          $ext_items[]?
          | select(.x_decision_type == "role_and_question_expansion")
          | .x_role_expansion_candidates[]?
        ]
      ) as $expansion_candidates
    | ($roles | map(select(.role_name as $n | $core_names | index($n)))) as $core_roles
    | ($roles | length) as $role_total
    | ([ $roles[]? | select((.platform_backfill_gap.status // "") | startswith("pending")) ] | length) as $pending_roles
    | (
        [
          $roles[]?
          | select(
              (.evidence?.source_url? | type == "string")
              and (
                (.evidence?.source_type // "") == "company_official"
                or (.evidence?.source_type // "") == "government_platform"
                or (.evidence?.source_type // "") == "government_agency"
                or (.evidence?.source_type // "") == "industry_association"
              )
            )
        ] | length
      ) as $deep_link_roles
    | (
        [
          $core_roles[]? as $r
          | (stage_cov($written; $r.role_id)) as $w_stage
          | (stage_cov($interview; $r.role_id)) as $i_stage
          | select($w_stage >= 4 and $i_stage >= 4)
        ] | length
      ) as $core_full4
    | ($high_growth | length) as $hg_total
    | ([ $high_growth[]? | select((.landing_status // "") == "landed_main_profile") ] | length) as $hg_landed
    | ($expansion_candidates | length) as $cand_total
    | ([ $expansion_candidates[]? | select((.status // "") == "landed_main_profile") ] | length) as $cand_landed
    | {
        industry_id: $entry.industry_id,
        industry: $entry."行业名称",
        high_growth_total: $hg_total,
        high_growth_landed: $hg_landed,
        high_growth_landing_percent: (if $hg_total == 0 then 0 else ($hg_landed * 100 / $hg_total) end),
        core_role_total: ($core_roles | length),
        core_role_full4_count: $core_full4,
        core_role_full4_percent: (if ($core_roles | length) == 0 then 0 else ($core_full4 * 100 / ($core_roles | length)) end),
        role_total: $role_total,
        role_pending_platform_count: $pending_roles,
        role_pending_platform_percent: (if $role_total == 0 then 0 else ($pending_roles * 100 / $role_total) end),
        role_deep_link_count: $deep_link_roles,
        role_deep_link_percent: (if $role_total == 0 then 0 else ($deep_link_roles * 100 / $role_total) end),
        expansion_candidate_total: $cand_total,
        expansion_candidate_landed: $cand_landed,
        expansion_candidate_landing_percent: (if $cand_total == 0 then 0 else ($cand_landed * 100 / $cand_total) end)
      }
  ] as $rows
  | {
      generated_at: now | strftime("%Y-%m-%dT%H:%M:%SZ"),
      depth_version: "v1.55.0",
      gate_mode: $depth_mode,
      enabled: $depth_enabled,
      target: {
        high_growth_landing_min_percent: $hg_min,
        core_role_four_stage_min_percent: $core4_min,
        role_profile_deep_link_min_percent: $deep_link_min,
        platform_verification_pending_max_percent: $pending_max
      },
      actual: {
        high_growth_landing_percent: (
          ([$rows[] | .high_growth_total] | add) as $t
          | ([$rows[] | .high_growth_landed] | add) as $v
          | if $t == 0 then 0 else ($v * 100 / $t) end
        ),
        core_role_four_stage_percent: (
          ([$rows[] | .core_role_total] | add) as $t
          | ([$rows[] | .core_role_full4_count] | add) as $v
          | if $t == 0 then 0 else ($v * 100 / $t) end
        ),
        role_profile_deep_link_percent: (
          ([$rows[] | .role_total] | add) as $t
          | ([$rows[] | .role_deep_link_count] | add) as $v
          | if $t == 0 then 0 else ($v * 100 / $t) end
        ),
        platform_verification_pending_percent: (
          ([$rows[] | .role_total] | add) as $t
          | ([$rows[] | .role_pending_platform_count] | add) as $v
          | if $t == 0 then 0 else ($v * 100 / $t) end
        ),
        expansion_candidate_landing_percent: (
          ([$rows[] | .expansion_candidate_total] | add) as $t
          | ([$rows[] | .expansion_candidate_landed] | add) as $v
          | if $t == 0 then 0 else ($v * 100 / $t) end
        )
      },
      by_industry: $rows,
      gaps_by_industry: [
        $rows[]
        | select(
            .high_growth_landing_percent < $hg_min
            or .core_role_full4_percent < $core4_min
            or .role_deep_link_percent < $deep_link_min
            or .role_pending_platform_percent > $pending_max
          )
      ]
    }
  ' "${DATA_PATH}")"

jq --argjson depth_v155 "${DEPTH_V155_METRICS_JSON}" '. + {encyclopedia_depth_v155: $depth_v155}' "${REPORT_PATH}" > "${REPORT_PATH}.tmp"
mv "${REPORT_PATH}.tmp" "${REPORT_PATH}"
cp "${REPORT_PATH}" "${LATEST_PATH}"

printf '%s\n' "${DEPTH_V155_METRICS_JSON}" > "${DEPTH_GAP_PATH}"
cp "${DEPTH_GAP_PATH}" "${LATEST_DEPTH_GAP_PATH}"

# v1.57 next-batch special: core-role 4-stage coverage + role deep-link rate.
SPECIAL_V157_SCRIPT="${ROOT_DIR}/scripts/generate_core4_deeplink_special_v157.js"
if [[ -f "${SPECIAL_V157_SCRIPT}" ]]; then
  node "${SPECIAL_V157_SCRIPT}" "${DATA_PATH}" "${DATE_TAG}"
fi

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
      required_role_coverage: $role_total,
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

EVENT_LOG_COVERAGE_JSON="$(jq --arg recent_cutoff "${RECENT_CUTOFF}" '
[
  ."行业词条"[]
  | {
      industry_id,
      industry_name: ."行业名称",
      event_total: (.dynamic["行业事件日志"].items | length),
      event_recent_180d: ([.dynamic["行业事件日志"].items[]? | ((.evidence.publish_date // .publish_date // .evidence.source_date // .source_date // "") | tostring) as $d | select(($d | test("^\\d{4}-\\d{2}-\\d{2}$")) and ($d >= $recent_cutoff))] | length)
    }
]
' "${DATA_PATH}")"

# Evidence consistency gates (new).
POLICY_TITLE_SOURCE_MISMATCH_JSON="$(jq '
[
  ."行业词条"[]
  | .industry_id as $industry_id
  | .dynamic["政策变化日志"].items[]?
  | select((.title // "") | test("国家统计局"))
  | select(((.evidence.source_name // "") | test("国家统计局") | not) or ((.evidence.source_type // "") != "government_dataset"))
  | {
      industry_id: $industry_id,
      log_id: (.log_id // null),
      title: (.title // null),
      source_id: (.evidence.source_id // null),
      source_name: (.evidence.source_name // null),
      source_type: (.evidence.source_type // null)
    }
]
' "${DATA_PATH}")"
POLICY_TITLE_SOURCE_MISMATCH_COUNT="$(jq 'length' <<<"${POLICY_TITLE_SOURCE_MISMATCH_JSON}")"

POLICY_DATE_SOURCE_MISMATCH_JSON="$(jq '
[
  ."行业词条"[]
  | .industry_id as $industry_id
  | .dynamic["政策变化日志"].items[]?
  | select((.date // "") != "" and (.evidence.source_date // "") != "" and (.date != .evidence.source_date))
  | {
      industry_id: $industry_id,
      log_id: (.log_id // null),
      date: (.date // null),
      source_date: (.evidence.source_date // null),
      source_id: (.evidence.source_id // null)
    }
]
' "${DATA_PATH}")"
POLICY_DATE_SOURCE_MISMATCH_COUNT="$(jq 'length' <<<"${POLICY_DATE_SOURCE_MISMATCH_JSON}")"

STATS_DATA_PERIOD_MISSING_JSON="$(jq '
[
  ."行业词条"[]
  | .industry_id as $industry_id
  | .dynamic
  | to_entries[]
  | .key as $collection
  | .value.items[]?
  | select(has("evidence") and (.evidence | type == "object"))
  | select(
      (.evidence.source_type // "") == "government_dataset"
      or (.evidence.source_type // "") == "commercial_platform"
      or (.evidence.source_type // "") == "general_platform"
    )
  | select(((.evidence.data_period // "") | tostring | length) == 0)
  | {
      industry_id: $industry_id,
      collection: $collection,
      item_id: (.snapshot_id // .question_id // .event_id // .log_id // .company_id // .link_id // .interview_id // .case_id // null),
      source_id: (.evidence.source_id // null)
    }
]
' "${DATA_PATH}")"
STATS_DATA_PERIOD_MISSING_COUNT="$(jq 'length' <<<"${STATS_DATA_PERIOD_MISSING_JSON}")"

DECISION_SALARY_SOURCE_INVALID_JSON="$(jq '
(reduce ."来源注册表"[] as $s ({}; .[$s.source_id] = $s.source_type)) as $type_map
| [
    ."行业词条"[]
    | .industry_id as $industry_id
    | .static["决策输出"].decision_cards.evidence_chain.salary_source_id as $salary_source_id
    | ($type_map[$salary_source_id] // "unknown") as $source_type
    | select($source_type != "government_dataset" and $source_type != "commercial_platform" and $source_type != "general_platform")
    | {
        industry_id: $industry_id,
        salary_source_id: $salary_source_id,
        source_type: $source_type
      }
  ]
' "${DATA_PATH}")"
DECISION_SALARY_SOURCE_INVALID_COUNT="$(jq 'length' <<<"${DECISION_SALARY_SOURCE_INVALID_JSON}")"

DECISION_EVIDENCE_NON200_JSON="$(jq '
(reduce ."来源注册表"[] as $s ({}; .[$s.source_id] = $s.http_status)) as $status_map
| [
    ."行业词条"[] as $entry
    | [
        {source_role: "timeline_source_id", source_id: ($entry.static["决策输出"].decision_cards.evidence_chain.timeline_source_id // null)},
        {source_role: "policy_source_id", source_id: ($entry.static["决策输出"].decision_cards.evidence_chain.policy_source_id // null)},
        {source_role: "salary_source_id", source_id: ($entry.static["决策输出"].decision_cards.evidence_chain.salary_source_id // null)}
      ][]
    | select(.source_id != null and (($status_map[.source_id] // 200) != 200))
    | {
        industry_id: $entry.industry_id,
        source_role,
        source_id,
        http_status: ($status_map[.source_id] // null)
      }
  ]
' "${DATA_PATH}")"
DECISION_EVIDENCE_NON200_COUNT="$(jq 'length' <<<"${DECISION_EVIDENCE_NON200_JSON}")"

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
GATE_ROLE_COUNT_MIN="$(jq '."治理配置"."发布硬门槛".role_count_target_per_industry // 24' "${DATA_PATH}")"
GATE_WRITTEN_PER_ROLE_MIN="$(jq '."治理配置"."发布硬门槛".question_written_per_role_target // 12' "${DATA_PATH}")"
GATE_INTERVIEW_PER_ROLE_MIN="$(jq '."治理配置"."发布硬门槛".question_interview_per_role_target // 12' "${DATA_PATH}")"
GATE_STAGE_COVERAGE_MIN="$(jq '."治理配置"."发布硬门槛".question_stage_coverage_target // 4' "${DATA_PATH}")"
GATE_JOB_DETAIL_URL_MIN="$(jq '."治理配置"."发布硬门槛".job_detail_url_min_percent // 60' "${DATA_PATH}")"
GATE_ROLE_SPECIFIC_WRITTEN_MIN="$(jq '."治理配置"."发布硬门槛".role_specific_written_per_role_target // 4' "${DATA_PATH}")"
GATE_ROLE_SPECIFIC_INTERVIEW_MIN="$(jq '."治理配置"."发布硬门槛".role_specific_interview_per_role_target // 4' "${DATA_PATH}")"
GATE_ROLE_SCOPE_DUP_MAX="$(jq '."治理配置"."发布硬门槛".role_scope_duplicate_max_percent // 100' "${DATA_PATH}")"
GATE_ROLE_COUNT_MIN_MAP="$(jq -c '."治理配置"."发布硬门槛".role_count_target_by_industry // {}' "${DATA_PATH}")"
GATE_WRITTEN_PER_ROLE_MIN_MAP="$(jq -c '."治理配置"."发布硬门槛".question_written_per_role_target_by_industry // {}' "${DATA_PATH}")"
GATE_INTERVIEW_PER_ROLE_MIN_MAP="$(jq -c '."治理配置"."发布硬门槛".question_interview_per_role_target_by_industry // {}' "${DATA_PATH}")"
GATE_STAGE_COVERAGE_MIN_MAP="$(jq -c '."治理配置"."发布硬门槛".question_stage_coverage_target_by_industry // {}' "${DATA_PATH}")"
GATE_JOB_DETAIL_URL_MIN_MAP="$(jq -c '."治理配置"."发布硬门槛".job_detail_url_min_percent_by_industry // {}' "${DATA_PATH}")"
GATE_FRAMEWORK_TOP1_MAX="$(jq '."治理配置"."发布硬门槛".question_answer_framework_top1_max_percent // 40' "${DATA_PATH}")"
GATE_FRAMEWORK_TOP3_MAX="$(jq '."治理配置"."发布硬门槛".question_answer_framework_top3_max_percent // 60' "${DATA_PATH}")"
GATE_FOLLOWUP_TOP3_MAX="$(jq '."治理配置"."发布硬门槛".question_followup_top3_max_percent // 35' "${DATA_PATH}")"
GATE_ELIMINATION_TOP1_MAX="$(jq '."治理配置"."发布硬门槛".elimination_risks_top1_max_percent // 35' "${DATA_PATH}")"
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
GATE_POLICY_TITLE_SOURCE_MISMATCH_MAX="$(jq '."治理配置"."发布硬门槛".policy_title_source_mismatch_max_hits // 0' "${DATA_PATH}")"
GATE_POLICY_DATE_SOURCE_MISMATCH_MAX="$(jq '."治理配置"."发布硬门槛".policy_date_source_mismatch_max_hits // 0' "${DATA_PATH}")"
GATE_STATS_DATA_PERIOD_MISSING_MAX="$(jq '."治理配置"."发布硬门槛".stats_data_period_missing_max_hits // 0' "${DATA_PATH}")"
GATE_DECISION_SALARY_SOURCE_INVALID_MAX="$(jq '."治理配置"."发布硬门槛".decision_salary_source_invalid_max_hits // 0' "${DATA_PATH}")"
GATE_DECISION_EVIDENCE_NON200_MAX="$(jq '."治理配置"."发布硬门槛".decision_evidence_non200_max_hits // 0' "${DATA_PATH}")"

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

DEPTH_ROLE_ISSUES_JSON="$(jq --argjson min_role "${GATE_ROLE_COUNT_MIN}" --argjson min_role_map "${GATE_ROLE_COUNT_MIN_MAP}" '
[
  ."行业词条"[]
  | (($min_role_map[.industry_id] // $min_role)) as $min_required
  | {
      industry_id,
      industry: ."行业名称",
      role_count: (.dynamic["岗位画像库"].items | length),
      min_required: $min_required
    }
  | select(.role_count < .min_required)
]
' "${DATA_PATH}")"
DEPTH_ROLE_ISSUES_COUNT="$(jq 'length' <<<"${DEPTH_ROLE_ISSUES_JSON}")"

DEPTH_WRITTEN_PER_ROLE_ISSUES_JSON="$(jq --argjson min_density "${GATE_WRITTEN_PER_ROLE_MIN}" --argjson min_density_map "${GATE_WRITTEN_PER_ROLE_MIN_MAP}" '
[
  ."行业词条"[]
  | .industry_id as $industry_id
  | (.dynamic["岗位画像库"].items | length) as $roles
  | (.dynamic["笔试真题库"].items | length) as $written
  | (($min_density_map[$industry_id] // $min_density)) as $min_required
  | {
      industry_id,
      industry: ."行业名称",
      role_count: $roles,
      written_count: $written,
      written_per_role: (if $roles == 0 then 0 else ($written / $roles) end),
      min_required: $min_required
    }
  | select(.written_per_role < .min_required)
]
' "${DATA_PATH}")"
DEPTH_WRITTEN_PER_ROLE_ISSUES_COUNT="$(jq 'length' <<<"${DEPTH_WRITTEN_PER_ROLE_ISSUES_JSON}")"

DEPTH_INTERVIEW_PER_ROLE_ISSUES_JSON="$(jq --argjson min_density "${GATE_INTERVIEW_PER_ROLE_MIN}" --argjson min_density_map "${GATE_INTERVIEW_PER_ROLE_MIN_MAP}" '
[
  ."行业词条"[]
  | .industry_id as $industry_id
  | (.dynamic["岗位画像库"].items | length) as $roles
  | (.dynamic["面试真题库"].items | length) as $interview
  | (($min_density_map[$industry_id] // $min_density)) as $min_required
  | {
      industry_id,
      industry: ."行业名称",
      role_count: $roles,
      interview_count: $interview,
      interview_per_role: (if $roles == 0 then 0 else ($interview / $roles) end),
      min_required: $min_required
    }
  | select(.interview_per_role < .min_required)
]
' "${DATA_PATH}")"
DEPTH_INTERVIEW_PER_ROLE_ISSUES_COUNT="$(jq 'length' <<<"${DEPTH_INTERVIEW_PER_ROLE_ISSUES_JSON}")"

DEPTH_STAGE_COVERAGE_ISSUES_JSON="$(jq --argjson min_stage "${GATE_STAGE_COVERAGE_MIN}" --argjson min_stage_map "${GATE_STAGE_COVERAGE_MIN_MAP}" '
[
  ."行业词条"[] as $entry
  | $entry.dynamic["岗位画像库"].items[]? as $role
  | (($min_stage_map[$entry.industry_id] // $min_stage)) as $min_required
  | ([ $entry.dynamic["笔试真题库"].items[]? | select(.role_id == $role.role_id) | .recruitment_stage ] | unique | length) as $written_stage_coverage
  | ([ $entry.dynamic["面试真题库"].items[]? | select(.role_id == $role.role_id) | .recruitment_stage ] | unique | length) as $interview_stage_coverage
  | {
      industry_id: $entry.industry_id,
      industry: $entry."行业名称",
      role_id: $role.role_id,
      role_name: $role.role_name,
      written_stage_coverage: $written_stage_coverage,
      interview_stage_coverage: $interview_stage_coverage,
      min_required: $min_required
    }
  | select(.written_stage_coverage < .min_required or .interview_stage_coverage < .min_required)
]
' "${DATA_PATH}")"
DEPTH_STAGE_COVERAGE_ISSUES_COUNT="$(jq 'length' <<<"${DEPTH_STAGE_COVERAGE_ISSUES_JSON}")"

DEPTH_JOB_DETAIL_URL_ISSUES_JSON="$(jq --argjson min_ratio "${GATE_JOB_DETAIL_URL_MIN}" --argjson min_ratio_map "${GATE_JOB_DETAIL_URL_MIN_MAP}" '
[
  ."行业词条"[] as $entry
  | (($min_ratio_map[$entry.industry_id] // $min_ratio)) as $min_required_percent
  | ($entry.dynamic["岗位画像库"].items // []) as $roles
  | ($roles | length) as $role_total
  | (
      [
        $roles[]?
        | select(
            (.evidence?.source_url? | type == "string")
            and (
              (.evidence?.source_type // "") == "company_official"
              or (.evidence?.source_type // "") == "government_platform"
              or (.evidence?.source_type // "") == "government_agency"
              or (.evidence?.source_type // "") == "industry_association"
            )
          )
      ]
      | length
    ) as $deep_link_count
  | {
      industry_id: $entry.industry_id,
      industry: $entry."行业名称",
      role_total: $role_total,
      deep_link_count: $deep_link_count,
      deep_link_percent: (if $role_total == 0 then 0 else ($deep_link_count * 100 / $role_total) end),
      min_required_percent: $min_required_percent
    }
  | select(.deep_link_percent < .min_required_percent)
]
' "${DATA_PATH}")"
DEPTH_JOB_DETAIL_URL_ISSUES_COUNT="$(jq 'length' <<<"${DEPTH_JOB_DETAIL_URL_ISSUES_JSON}")"

ROLE_SPECIFIC_ISSUES_JSON="$(jq --argjson min_w "${GATE_ROLE_SPECIFIC_WRITTEN_MIN}" --argjson min_i "${GATE_ROLE_SPECIFIC_INTERVIEW_MIN}" '
[
  ."行业词条"[] as $entry
  | $entry.dynamic["岗位画像库"].items[]? as $role
  | ($role.role_detail_v158.role_specific_question_coverage.written_count // 0) as $written_count
  | ($role.role_detail_v158.role_specific_question_coverage.interview_count // 0) as $interview_count
  | {
      industry_id: $entry.industry_id,
      industry: $entry."行业名称",
      role_id: $role.role_id,
      role_name: $role.role_name,
      written_count: $written_count,
      interview_count: $interview_count,
      min_written: $min_w,
      min_interview: $min_i
    }
  | select(.written_count < .min_written or .interview_count < .min_interview)
]
' "${DATA_PATH}")"
ROLE_SPECIFIC_ISSUES_COUNT="$(jq 'length' <<<"${ROLE_SPECIFIC_ISSUES_JSON}")"

ROLE_SCOPE_DUPLICATE_PERCENT="$(jq '
([."行业词条"[]|.dynamic["岗位画像库"].items[]?|(.role_detail_v158.role_scope // "")|select(length>0)]) as $scopes
| ($scopes|length) as $total
| ($scopes|unique|length) as $uniq
| if $total == 0 then 0 else (100 - ($uniq * 100 / $total)) end
' "${DATA_PATH}")"
ROLE_SCOPE_TOTAL_COUNT="$(jq '[."行业词条"[]|.dynamic["岗位画像库"].items[]?|(.role_detail_v158.role_scope // "")|select(length>0)]|length' "${DATA_PATH}")"
ROLE_SCOPE_UNIQUE_COUNT="$(jq '[."行业词条"[]|.dynamic["岗位画像库"].items[]?|(.role_detail_v158.role_scope // "")|select(length>0)]|unique|length' "${DATA_PATH}")"
ROLE_TOTAL_COUNT="$(jq '[."行业词条"[]|.dynamic["岗位画像库"].items[]?|.role_id]|length' "${DATA_PATH}")"

TEMPLATE_REUSE_GATE_JSON="$(jq '
def top1_pct($arr):
  if ($arr|length)==0 then 0
  else ((($arr|group_by(.)|map(length)|max)//0) * 100 / ($arr|length))
  end;
def top3_pct($arr):
  if ($arr|length)==0 then 0
  else ((($arr|group_by(.)|map(length)|sort|reverse|.[0:3]|add)//0) * 100 / ($arr|length))
  end;
([."行业词条"[]|.dynamic["笔试真题库"].items[]?|((.answer_framework // [])|@json)]) as $w_framework
| ([."行业词条"[]|.dynamic["面试真题库"].items[]?|((.answer_framework // [])|@json)]) as $i_framework
| ([."行业词条"[]|.dynamic["笔试真题库"].items[]?|(.follow_up_questions[]? // empty)]) as $w_followup
| ([."行业词条"[]|.dynamic["面试真题库"].items[]?|(.follow_up_questions[]? // empty)]) as $i_followup
| ([."行业词条"[]|.dynamic["岗位画像库"].items[]?|((.elimination_risks // [])|@json)]) as $r_elimination
| {
    framework_written_top1: top1_pct($w_framework),
    framework_written_top3: top3_pct($w_framework),
    framework_interview_top1: top1_pct($i_framework),
    framework_interview_top3: top3_pct($i_framework),
    followup_written_top3: top3_pct($w_followup),
    followup_interview_top3: top3_pct($i_followup),
    elimination_top1: top1_pct($r_elimination)
  }
' "${DATA_PATH}")"

FRAMEWORK_WRITTEN_TOP1="$(jq '.framework_written_top1' <<<"${TEMPLATE_REUSE_GATE_JSON}")"
FRAMEWORK_WRITTEN_TOP3="$(jq '.framework_written_top3' <<<"${TEMPLATE_REUSE_GATE_JSON}")"
FRAMEWORK_INTERVIEW_TOP1="$(jq '.framework_interview_top1' <<<"${TEMPLATE_REUSE_GATE_JSON}")"
FRAMEWORK_INTERVIEW_TOP3="$(jq '.framework_interview_top3' <<<"${TEMPLATE_REUSE_GATE_JSON}")"
FOLLOWUP_WRITTEN_TOP3="$(jq '.followup_written_top3' <<<"${TEMPLATE_REUSE_GATE_JSON}")"
FOLLOWUP_INTERVIEW_TOP3="$(jq '.followup_interview_top3' <<<"${TEMPLATE_REUSE_GATE_JSON}")"
ELIMINATION_TOP1="$(jq '.elimination_top1' <<<"${TEMPLATE_REUSE_GATE_JSON}")"

TEMPLATE_REUSE_ISSUES_JSON="$(jq -n \
  --argjson fw_w_top1 "${FRAMEWORK_WRITTEN_TOP1}" \
  --argjson fw_w_top3 "${FRAMEWORK_WRITTEN_TOP3}" \
  --argjson fw_i_top1 "${FRAMEWORK_INTERVIEW_TOP1}" \
  --argjson fw_i_top3 "${FRAMEWORK_INTERVIEW_TOP3}" \
  --argjson fu_w_top3 "${FOLLOWUP_WRITTEN_TOP3}" \
  --argjson fu_i_top3 "${FOLLOWUP_INTERVIEW_TOP3}" \
  --argjson elim_top1 "${ELIMINATION_TOP1}" \
  --argjson fw_top1_max "${GATE_FRAMEWORK_TOP1_MAX}" \
  --argjson fw_top3_max "${GATE_FRAMEWORK_TOP3_MAX}" \
  --argjson fu_top3_max "${GATE_FOLLOWUP_TOP3_MAX}" \
  --argjson elim_top1_max "${GATE_ELIMINATION_TOP1_MAX}" \
  '[
    {metric: "answer_framework_written_top1_percent", actual_percent: $fw_w_top1, threshold_percent: $fw_top1_max, violated: ($fw_w_top1 > $fw_top1_max)},
    {metric: "answer_framework_written_top3_percent", actual_percent: $fw_w_top3, threshold_percent: $fw_top3_max, violated: ($fw_w_top3 > $fw_top3_max)},
    {metric: "answer_framework_interview_top1_percent", actual_percent: $fw_i_top1, threshold_percent: $fw_top1_max, violated: ($fw_i_top1 > $fw_top1_max)},
    {metric: "answer_framework_interview_top3_percent", actual_percent: $fw_i_top3, threshold_percent: $fw_top3_max, violated: ($fw_i_top3 > $fw_top3_max)},
    {metric: "follow_up_written_top3_percent", actual_percent: $fu_w_top3, threshold_percent: $fu_top3_max, violated: ($fu_w_top3 > $fu_top3_max)},
    {metric: "follow_up_interview_top3_percent", actual_percent: $fu_i_top3, threshold_percent: $fu_top3_max, violated: ($fu_i_top3 > $fu_top3_max)},
    {metric: "elimination_risks_top1_percent", actual_percent: $elim_top1, threshold_percent: $elim_top1_max, violated: ($elim_top1 > $elim_top1_max)}
  ] | map(select(.violated) | del(.violated))')"
TEMPLATE_REUSE_ISSUES_COUNT="$(jq 'length' <<<"${TEMPLATE_REUSE_ISSUES_JSON}")"

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
if awk -v a="${DEPTH_ROLE_ISSUES_COUNT}" 'BEGIN{exit !(a > 0)}'; then HAS_BLOCKERS=1; fi
if awk -v a="${DEPTH_WRITTEN_PER_ROLE_ISSUES_COUNT}" 'BEGIN{exit !(a > 0)}'; then HAS_BLOCKERS=1; fi
if awk -v a="${DEPTH_INTERVIEW_PER_ROLE_ISSUES_COUNT}" 'BEGIN{exit !(a > 0)}'; then HAS_BLOCKERS=1; fi
if awk -v a="${DEPTH_STAGE_COVERAGE_ISSUES_COUNT}" 'BEGIN{exit !(a > 0)}'; then HAS_BLOCKERS=1; fi
if awk -v a="${DEPTH_JOB_DETAIL_URL_ISSUES_COUNT}" 'BEGIN{exit !(a > 0)}'; then HAS_BLOCKERS=1; fi
if awk -v a="${ROLE_SPECIFIC_ISSUES_COUNT}" 'BEGIN{exit !(a > 0)}'; then HAS_BLOCKERS=1; fi
if awk -v a="${ROLE_SCOPE_DUPLICATE_PERCENT}" -v b="${GATE_ROLE_SCOPE_DUP_MAX}" 'BEGIN{exit !(a > b)}'; then HAS_BLOCKERS=1; fi
if awk -v a="${TEMPLATE_REUSE_ISSUES_COUNT}" 'BEGIN{exit !(a > 0)}'; then HAS_BLOCKERS=1; fi
if awk -v a="${SOURCE_TOP1_SHARE}" -v b="${GATE_SOURCE_TOP1_MAX}" 'BEGIN{exit !(a > b)}'; then HAS_BLOCKERS=1; fi
if awk -v a="${SOURCE_TOP5_SHARE}" -v b="${GATE_SOURCE_TOP5_MAX}" 'BEGIN{exit !(a > b)}'; then HAS_BLOCKERS=1; fi
if awk -v a="${POLICY_TITLE_SOURCE_MISMATCH_COUNT}" -v b="${GATE_POLICY_TITLE_SOURCE_MISMATCH_MAX}" 'BEGIN{exit !(a > b)}'; then HAS_BLOCKERS=1; fi
if awk -v a="${POLICY_DATE_SOURCE_MISMATCH_COUNT}" -v b="${GATE_POLICY_DATE_SOURCE_MISMATCH_MAX}" 'BEGIN{exit !(a > b)}'; then HAS_BLOCKERS=1; fi
if awk -v a="${STATS_DATA_PERIOD_MISSING_COUNT}" -v b="${GATE_STATS_DATA_PERIOD_MISSING_MAX}" 'BEGIN{exit !(a > b)}'; then HAS_BLOCKERS=1; fi
if awk -v a="${DECISION_SALARY_SOURCE_INVALID_COUNT}" -v b="${GATE_DECISION_SALARY_SOURCE_INVALID_MAX}" 'BEGIN{exit !(a > b)}'; then HAS_BLOCKERS=1; fi
if awk -v a="${DECISION_EVIDENCE_NON200_COUNT}" -v b="${GATE_DECISION_EVIDENCE_NON200_MAX}" 'BEGIN{exit !(a > b)}'; then HAS_BLOCKERS=1; fi
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
DEPTH_ROLE_ISSUE="$(jq -n --argjson actual "${DEPTH_ROLE_ISSUES_COUNT}" --argjson min_required "${GATE_ROLE_COUNT_MIN}" --argjson min_required_map "${GATE_ROLE_COUNT_MIN_MAP}" '{actual_hits:$actual, min_roles_per_industry:$min_required, min_roles_per_industry_by_industry:$min_required_map}')"
DEPTH_WRITTEN_PER_ROLE_ISSUE="$(jq -n --argjson actual "${DEPTH_WRITTEN_PER_ROLE_ISSUES_COUNT}" --argjson min_required "${GATE_WRITTEN_PER_ROLE_MIN}" --argjson min_required_map "${GATE_WRITTEN_PER_ROLE_MIN_MAP}" '{actual_hits:$actual, min_written_per_role:$min_required, min_written_per_role_by_industry:$min_required_map}')"
DEPTH_INTERVIEW_PER_ROLE_ISSUE="$(jq -n --argjson actual "${DEPTH_INTERVIEW_PER_ROLE_ISSUES_COUNT}" --argjson min_required "${GATE_INTERVIEW_PER_ROLE_MIN}" --argjson min_required_map "${GATE_INTERVIEW_PER_ROLE_MIN_MAP}" '{actual_hits:$actual, min_interview_per_role:$min_required, min_interview_per_role_by_industry:$min_required_map}')"
DEPTH_STAGE_COVERAGE_ISSUE="$(jq -n --argjson actual "${DEPTH_STAGE_COVERAGE_ISSUES_COUNT}" --argjson min_required "${GATE_STAGE_COVERAGE_MIN}" --argjson min_required_map "${GATE_STAGE_COVERAGE_MIN_MAP}" '{actual_hits:$actual, min_stage_coverage_per_role:$min_required, min_stage_coverage_per_role_by_industry:$min_required_map}')"
DEPTH_JOB_DETAIL_URL_ISSUE="$(jq -n --argjson actual "${DEPTH_JOB_DETAIL_URL_ISSUES_COUNT}" --argjson min_required "${GATE_JOB_DETAIL_URL_MIN}" --argjson min_required_map "${GATE_JOB_DETAIL_URL_MIN_MAP}" '{actual_hits:$actual, min_job_detail_url_percent:$min_required, min_job_detail_url_percent_by_industry:$min_required_map}')"
ROLE_SPECIFIC_ISSUE="$(jq -n --argjson actual "${ROLE_SPECIFIC_ISSUES_COUNT}" --argjson min_written "${GATE_ROLE_SPECIFIC_WRITTEN_MIN}" --argjson min_interview "${GATE_ROLE_SPECIFIC_INTERVIEW_MIN}" '{actual_hits:$actual, min_role_specific_written_per_role:$min_written, min_role_specific_interview_per_role:$min_interview}')"
ROLE_SCOPE_DUP_ISSUE="$(jq -n --argjson actual "${ROLE_SCOPE_DUPLICATE_PERCENT}" --argjson threshold "${GATE_ROLE_SCOPE_DUP_MAX}" '{actual_percent:$actual, threshold_percent:$threshold}')"
TEMPLATE_REUSE_ISSUE="$(jq -n --argjson actual "${TEMPLATE_REUSE_ISSUES_COUNT}" --argjson framework_top1_max "${GATE_FRAMEWORK_TOP1_MAX}" --argjson framework_top3_max "${GATE_FRAMEWORK_TOP3_MAX}" --argjson followup_top3_max "${GATE_FOLLOWUP_TOP3_MAX}" --argjson elimination_top1_max "${GATE_ELIMINATION_TOP1_MAX}" '{actual_hits:$actual, framework_top1_max_percent:$framework_top1_max, framework_top3_max_percent:$framework_top3_max, followup_top3_max_percent:$followup_top3_max, elimination_top1_max_percent:$elimination_top1_max}')"
SOURCE_TOP1_ISSUE="$(jq -n --argjson actual "${SOURCE_TOP1_SHARE}" --argjson threshold "${GATE_SOURCE_TOP1_MAX}" '{actual_percent:$actual, threshold_percent:$threshold}')"
SOURCE_TOP5_ISSUE="$(jq -n --argjson actual "${SOURCE_TOP5_SHARE}" --argjson threshold "${GATE_SOURCE_TOP5_MAX}" '{actual_percent:$actual, threshold_percent:$threshold}')"
POLICY_TITLE_SOURCE_MISMATCH_ISSUE="$(jq -n --argjson actual "${POLICY_TITLE_SOURCE_MISMATCH_COUNT}" --argjson threshold "${GATE_POLICY_TITLE_SOURCE_MISMATCH_MAX}" '{actual_hits:$actual, threshold_hits:$threshold}')"
POLICY_DATE_SOURCE_MISMATCH_ISSUE="$(jq -n --argjson actual "${POLICY_DATE_SOURCE_MISMATCH_COUNT}" --argjson threshold "${GATE_POLICY_DATE_SOURCE_MISMATCH_MAX}" '{actual_hits:$actual, threshold_hits:$threshold}')"
STATS_DATA_PERIOD_MISSING_ISSUE="$(jq -n --argjson actual "${STATS_DATA_PERIOD_MISSING_COUNT}" --argjson threshold "${GATE_STATS_DATA_PERIOD_MISSING_MAX}" '{actual_hits:$actual, threshold_hits:$threshold}')"
DECISION_SALARY_SOURCE_INVALID_ISSUE="$(jq -n --argjson actual "${DECISION_SALARY_SOURCE_INVALID_COUNT}" --argjson threshold "${GATE_DECISION_SALARY_SOURCE_INVALID_MAX}" '{actual_hits:$actual, threshold_hits:$threshold}')"
DECISION_EVIDENCE_NON200_ISSUE="$(jq -n --argjson actual "${DECISION_EVIDENCE_NON200_COUNT}" --argjson threshold "${GATE_DECISION_EVIDENCE_NON200_MAX}" '{actual_hits:$actual, threshold_hits:$threshold}')"

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
  --argjson depth_role_issues_count "${DEPTH_ROLE_ISSUES_COUNT}" \
  --argjson depth_role_min "${GATE_ROLE_COUNT_MIN}" \
  --argjson depth_role_min_map "${GATE_ROLE_COUNT_MIN_MAP}" \
  --argjson depth_written_per_role_issues_count "${DEPTH_WRITTEN_PER_ROLE_ISSUES_COUNT}" \
  --argjson depth_written_per_role_min "${GATE_WRITTEN_PER_ROLE_MIN}" \
  --argjson depth_written_per_role_min_map "${GATE_WRITTEN_PER_ROLE_MIN_MAP}" \
  --argjson depth_interview_per_role_issues_count "${DEPTH_INTERVIEW_PER_ROLE_ISSUES_COUNT}" \
  --argjson depth_interview_per_role_min "${GATE_INTERVIEW_PER_ROLE_MIN}" \
  --argjson depth_interview_per_role_min_map "${GATE_INTERVIEW_PER_ROLE_MIN_MAP}" \
  --argjson depth_stage_coverage_issues_count "${DEPTH_STAGE_COVERAGE_ISSUES_COUNT}" \
  --argjson depth_stage_coverage_min "${GATE_STAGE_COVERAGE_MIN}" \
  --argjson depth_stage_coverage_min_map "${GATE_STAGE_COVERAGE_MIN_MAP}" \
  --argjson depth_job_detail_url_issues_count "${DEPTH_JOB_DETAIL_URL_ISSUES_COUNT}" \
  --argjson depth_job_detail_url_min "${GATE_JOB_DETAIL_URL_MIN}" \
  --argjson depth_job_detail_url_min_map "${GATE_JOB_DETAIL_URL_MIN_MAP}" \
  --argjson framework_written_top1_percent "${FRAMEWORK_WRITTEN_TOP1}" \
  --argjson framework_written_top3_percent "${FRAMEWORK_WRITTEN_TOP3}" \
  --argjson framework_interview_top1_percent "${FRAMEWORK_INTERVIEW_TOP1}" \
  --argjson framework_interview_top3_percent "${FRAMEWORK_INTERVIEW_TOP3}" \
  --argjson followup_written_top3_percent "${FOLLOWUP_WRITTEN_TOP3}" \
  --argjson followup_interview_top3_percent "${FOLLOWUP_INTERVIEW_TOP3}" \
  --argjson elimination_top1_percent "${ELIMINATION_TOP1}" \
  --argjson framework_top1_max "${GATE_FRAMEWORK_TOP1_MAX}" \
  --argjson framework_top3_max "${GATE_FRAMEWORK_TOP3_MAX}" \
  --argjson followup_top3_max "${GATE_FOLLOWUP_TOP3_MAX}" \
  --argjson elimination_top1_max "${GATE_ELIMINATION_TOP1_MAX}" \
  --argjson template_reuse_issues_count "${TEMPLATE_REUSE_ISSUES_COUNT}" \
  --argjson source_top1_share "${SOURCE_TOP1_SHARE}" \
  --argjson source_top1_max "${GATE_SOURCE_TOP1_MAX}" \
  --argjson source_top5_share "${SOURCE_TOP5_SHARE}" \
  --argjson source_top5_max "${GATE_SOURCE_TOP5_MAX}" \
  --argjson policy_title_source_mismatch_count "${POLICY_TITLE_SOURCE_MISMATCH_COUNT}" \
  --argjson policy_title_source_mismatch_max "${GATE_POLICY_TITLE_SOURCE_MISMATCH_MAX}" \
  --argjson policy_date_source_mismatch_count "${POLICY_DATE_SOURCE_MISMATCH_COUNT}" \
  --argjson policy_date_source_mismatch_max "${GATE_POLICY_DATE_SOURCE_MISMATCH_MAX}" \
  --argjson stats_data_period_missing_count "${STATS_DATA_PERIOD_MISSING_COUNT}" \
  --argjson stats_data_period_missing_max "${GATE_STATS_DATA_PERIOD_MISSING_MAX}" \
  --argjson decision_salary_source_invalid_count "${DECISION_SALARY_SOURCE_INVALID_COUNT}" \
  --argjson decision_salary_source_invalid_max "${GATE_DECISION_SALARY_SOURCE_INVALID_MAX}" \
  --argjson decision_evidence_non200_count "${DECISION_EVIDENCE_NON200_COUNT}" \
  --argjson decision_evidence_non200_max "${GATE_DECISION_EVIDENCE_NON200_MAX}" \
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
  --argjson depth_role_issues "${DEPTH_ROLE_ISSUES_JSON}" \
  --argjson depth_written_per_role_issues "${DEPTH_WRITTEN_PER_ROLE_ISSUES_JSON}" \
  --argjson depth_interview_per_role_issues "${DEPTH_INTERVIEW_PER_ROLE_ISSUES_JSON}" \
  --argjson depth_stage_coverage_issues "${DEPTH_STAGE_COVERAGE_ISSUES_JSON}" \
  --argjson depth_job_detail_url_issues "${DEPTH_JOB_DETAIL_URL_ISSUES_JSON}" \
  --argjson template_reuse_issues "${TEMPLATE_REUSE_ISSUES_JSON}" \
  --argjson policy_title_source_mismatch_issues "${POLICY_TITLE_SOURCE_MISMATCH_JSON}" \
  --argjson policy_date_source_mismatch_issues "${POLICY_DATE_SOURCE_MISMATCH_JSON}" \
  --argjson stats_data_period_missing_issues "${STATS_DATA_PERIOD_MISSING_JSON}" \
  --argjson decision_salary_source_invalid_issues "${DECISION_SALARY_SOURCE_INVALID_JSON}" \
  --argjson decision_evidence_non200_issues "${DECISION_EVIDENCE_NON200_JSON}" \
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
  --argjson depth_role_issue "${DEPTH_ROLE_ISSUE}" \
  --argjson depth_written_per_role_issue "${DEPTH_WRITTEN_PER_ROLE_ISSUE}" \
  --argjson depth_interview_per_role_issue "${DEPTH_INTERVIEW_PER_ROLE_ISSUE}" \
  --argjson depth_stage_coverage_issue "${DEPTH_STAGE_COVERAGE_ISSUE}" \
  --argjson depth_job_detail_url_issue "${DEPTH_JOB_DETAIL_URL_ISSUE}" \
  --argjson template_reuse_issue "${TEMPLATE_REUSE_ISSUE}" \
  --argjson source_top1_issue "${SOURCE_TOP1_ISSUE}" \
  --argjson source_top5_issue "${SOURCE_TOP5_ISSUE}" \
  --argjson policy_title_source_mismatch_issue "${POLICY_TITLE_SOURCE_MISMATCH_ISSUE}" \
  --argjson policy_date_source_mismatch_issue "${POLICY_DATE_SOURCE_MISMATCH_ISSUE}" \
  --argjson stats_data_period_missing_issue "${STATS_DATA_PERIOD_MISSING_ISSUE}" \
  --argjson decision_salary_source_invalid_issue "${DECISION_SALARY_SOURCE_INVALID_ISSUE}" \
  --argjson decision_evidence_non200_issue "${DECISION_EVIDENCE_NON200_ISSUE}" \
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
      role_count_coverage_hits: $depth_role_issues_count,
      role_count_target_per_industry: $depth_role_min,
      role_count_target_by_industry: $depth_role_min_map,
      written_per_role_hits: $depth_written_per_role_issues_count,
      written_per_role_min: $depth_written_per_role_min,
      written_per_role_target_by_industry: $depth_written_per_role_min_map,
      interview_per_role_hits: $depth_interview_per_role_issues_count,
      interview_per_role_min: $depth_interview_per_role_min,
      interview_per_role_target_by_industry: $depth_interview_per_role_min_map,
      stage_coverage_per_role_hits: $depth_stage_coverage_issues_count,
      stage_coverage_per_role_min: $depth_stage_coverage_min,
      stage_coverage_per_role_target_by_industry: $depth_stage_coverage_min_map,
      job_detail_url_depth_hits: $depth_job_detail_url_issues_count,
      job_detail_url_min_percent: $depth_job_detail_url_min,
      job_detail_url_min_percent_by_industry: $depth_job_detail_url_min_map,
      answer_framework_written_top1_percent: $framework_written_top1_percent,
      answer_framework_written_top3_percent: $framework_written_top3_percent,
      answer_framework_interview_top1_percent: $framework_interview_top1_percent,
      answer_framework_interview_top3_percent: $framework_interview_top3_percent,
      follow_up_written_top3_percent: $followup_written_top3_percent,
      follow_up_interview_top3_percent: $followup_interview_top3_percent,
      elimination_risks_top1_percent: $elimination_top1_percent,
      answer_framework_top1_max_percent: $framework_top1_max,
      answer_framework_top3_max_percent: $framework_top3_max,
      follow_up_top3_max_percent: $followup_top3_max,
      elimination_risks_top1_max_percent: $elimination_top1_max,
      template_reuse_hits: $template_reuse_issues_count,
      policy_title_source_mismatch_hits: $policy_title_source_mismatch_count,
      policy_title_source_mismatch_max_hits: $policy_title_source_mismatch_max,
      policy_date_source_mismatch_hits: $policy_date_source_mismatch_count,
      policy_date_source_mismatch_max_hits: $policy_date_source_mismatch_max,
      stats_data_period_missing_hits: $stats_data_period_missing_count,
      stats_data_period_missing_max_hits: $stats_data_period_missing_max,
      decision_salary_source_invalid_hits: $decision_salary_source_invalid_count,
      decision_salary_source_invalid_max_hits: $decision_salary_source_invalid_max,
      decision_evidence_non200_hits: $decision_evidence_non200_count,
      decision_evidence_non200_max_hits: $decision_evidence_non200_max,
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
      role_count_coverage_records: $depth_role_issues,
      written_per_role_records: $depth_written_per_role_issues,
      interview_per_role_records: $depth_interview_per_role_issues,
      stage_coverage_per_role_records: $depth_stage_coverage_issues,
      job_detail_url_depth_records: $depth_job_detail_url_issues,
      template_reuse_records: $template_reuse_issues,
      policy_title_source_mismatch_records: $policy_title_source_mismatch_issues,
      policy_date_source_mismatch_records: $policy_date_source_mismatch_issues,
      stats_data_period_missing_records: $stats_data_period_missing_issues,
      decision_salary_source_invalid_records: $decision_salary_source_invalid_issues,
      decision_evidence_non200_records: $decision_evidence_non200_issues,
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
      role_count_coverage_threshold: $depth_role_issue,
      written_per_role_threshold: $depth_written_per_role_issue,
      interview_per_role_threshold: $depth_interview_per_role_issue,
      stage_coverage_per_role_threshold: $depth_stage_coverage_issue,
      job_detail_url_depth_threshold: $depth_job_detail_url_issue,
      template_reuse_threshold: $template_reuse_issue,
      source_concentration_top1_threshold: $source_top1_issue,
      source_concentration_top5_threshold: $source_top5_issue,
      policy_title_source_mismatch_threshold: $policy_title_source_mismatch_issue,
      policy_date_source_mismatch_threshold: $policy_date_source_mismatch_issue,
      stats_data_period_missing_threshold: $stats_data_period_missing_issue,
      decision_salary_source_invalid_threshold: $decision_salary_source_invalid_issue,
      decision_evidence_non200_threshold: $decision_evidence_non200_issue
    }
  }' > "${GATE_PATH}"

cp "${GATE_PATH}" "${LATEST_GATE_PATH}"

# v1.59 role-specific depth and role-scope semantic de-dup gates.
jq \
  --argjson role_specific_hits "${ROLE_SPECIFIC_ISSUES_COUNT}" \
  --argjson role_specific_written_min "${GATE_ROLE_SPECIFIC_WRITTEN_MIN}" \
  --argjson role_specific_interview_min "${GATE_ROLE_SPECIFIC_INTERVIEW_MIN}" \
  --argjson role_scope_dup_percent "${ROLE_SCOPE_DUPLICATE_PERCENT}" \
  --argjson role_scope_dup_max "${GATE_ROLE_SCOPE_DUP_MAX}" \
  --argjson role_specific_records "${ROLE_SPECIFIC_ISSUES_JSON}" \
  --argjson role_specific_threshold "${ROLE_SPECIFIC_ISSUE}" \
  --argjson role_scope_dup_threshold "${ROLE_SCOPE_DUP_ISSUE}" \
  '
  .gates += {
    role_specific_coverage_hits: $role_specific_hits,
    role_specific_written_per_role_min: $role_specific_written_min,
    role_specific_interview_per_role_min: $role_specific_interview_min,
    role_scope_duplicate_percent: $role_scope_dup_percent,
    role_scope_duplicate_max_percent: $role_scope_dup_max
  }
  | .issues += {
    role_specific_coverage_records: $role_specific_records,
    role_specific_coverage_threshold: $role_specific_threshold,
    role_scope_duplicate_threshold: $role_scope_dup_threshold
  }
  ' "${GATE_PATH}" > "${GATE_PATH}.tmp"
mv "${GATE_PATH}.tmp" "${GATE_PATH}"
cp "${GATE_PATH}" "${LATEST_GATE_PATH}"

# v1.58 overlay: mapping integrity, deep-link quality, prompt de-dup and decision-module depth.
V158_OVERLAY_SCRIPT="${ROOT_DIR}/scripts/apply_v158_quality_overlay.sh"
if [[ -f "${V158_OVERLAY_SCRIPT}" ]]; then
  OVERLAY_BLOCKERS="$("${V158_OVERLAY_SCRIPT}" "${DATA_PATH}" "${REPORT_PATH}" "${GATE_PATH}" "${LATEST_PATH}" "${LATEST_GATE_PATH}" || true)"
  if [[ "${OVERLAY_BLOCKERS}" == "1" ]]; then
    HAS_BLOCKERS=1
  fi
fi

# Append v1.59 role-specific/semantic-depth telemetry to quality report.
jq \
  --argjson role_total "${ROLE_TOTAL_COUNT}" \
  --argjson role_specific_issue_count "${ROLE_SPECIFIC_ISSUES_COUNT}" \
  --argjson role_specific_written_min "${GATE_ROLE_SPECIFIC_WRITTEN_MIN}" \
  --argjson role_specific_interview_min "${GATE_ROLE_SPECIFIC_INTERVIEW_MIN}" \
  --argjson role_scope_total "${ROLE_SCOPE_TOTAL_COUNT}" \
  --argjson role_scope_unique "${ROLE_SCOPE_UNIQUE_COUNT}" \
  --argjson role_scope_dup_percent "${ROLE_SCOPE_DUPLICATE_PERCENT}" \
  --argjson role_scope_dup_max "${GATE_ROLE_SCOPE_DUP_MAX}" \
  '
  . + {
    role_specific_depth_v159: {
      total_roles: $role_total,
      blocked_roles: $role_specific_issue_count,
      passed_roles: ($role_total - $role_specific_issue_count),
      min_written_per_role: $role_specific_written_min,
      min_interview_per_role: $role_specific_interview_min
    },
    role_scope_uniqueness_v159: {
      scope_total: $role_scope_total,
      scope_unique: $role_scope_unique,
      duplicate_percent: $role_scope_dup_percent,
      duplicate_max_percent: $role_scope_dup_max
    }
  }
  ' "${REPORT_PATH}" > "${REPORT_PATH}.tmp"
mv "${REPORT_PATH}.tmp" "${REPORT_PATH}"
cp "${REPORT_PATH}" "${LATEST_PATH}"

echo "Quality pipeline completed"
echo "- report: ${REPORT_PATH}"
echo "- latest: ${LATEST_PATH}"
echo "- gate: ${GATE_PATH}"
echo "- gate_latest: ${LATEST_GATE_PATH}"

if [[ "${HAS_BLOCKERS}" -eq 1 ]]; then
  echo "Release gate failed: blockers detected."
  exit 2
fi
