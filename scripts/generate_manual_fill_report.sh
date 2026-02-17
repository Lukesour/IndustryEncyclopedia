#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DATA_PATH="${1:-${ROOT_DIR}/行业百科.json}"
REPORT_DIR="${ROOT_DIR}/reports"
DATE_TAG="$(date +%Y%m%d)"
REPORT_PATH="${REPORT_DIR}/manual_fill_slots_${DATE_TAG}.json"
LATEST_PATH="${REPORT_DIR}/manual_fill_slots_latest.json"

mkdir -p "${REPORT_DIR}"

jq '{
  generated_at: now | strftime("%Y-%m-%dT%H:%M:%SZ"),
  version: ."文档元数据"."版本",
  industries: [
    ."行业词条"[]
    | {
        industry_id,
        industry_name: ."行业名称",
        pending_slots: ([.dynamic | to_entries[] | .value.manual_fill_slots[]? | select((.status // "pending_user_fill") | startswith("pending"))] | length),
        collections: [
          .dynamic
          | to_entries[]
          | select((.value.manual_fill_slots // []) | length > 0)
          | {
              collection: .key,
              priority: (([.value.manual_fill_slots[] | select((.status // "pending_user_fill") | startswith("pending")) | .priority] | first) // ([.value.manual_fill_slots[] | .priority] | first) // "P1"),
              pending_count: ([.value.manual_fill_slots[] | select((.status // "pending_user_fill") | startswith("pending"))] | length),
              required_count: (.value.manual_fill_progress.required_count // (.value.manual_fill_slots | length) // 0),
              sample_slots: ([.value.manual_fill_slots[] | select((.status // "pending_user_fill") | startswith("pending"))] | .[0:3])
            }
        ]
      }
  ]
}' "${DATA_PATH}" > "${REPORT_PATH}"

cp "${REPORT_PATH}" "${LATEST_PATH}"

echo "Manual fill report generated"
echo "- report: ${REPORT_PATH}"
echo "- latest: ${LATEST_PATH}"
