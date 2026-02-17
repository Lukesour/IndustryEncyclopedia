#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DATA_PATH="${1:-${ROOT_DIR}/行业百科.json}"
REPORT_DIR="${ROOT_DIR}/reports"
DATE_TAG="$(date +%Y%m%d)"
REPORT_PATH="${REPORT_DIR}/source_manual_verify_${DATE_TAG}.json"
LATEST_PATH="${REPORT_DIR}/source_manual_verify_latest.json"

mkdir -p "${REPORT_DIR}"

jq '{
  generated_at: now | strftime("%Y-%m-%dT%H:%M:%SZ"),
  version: ."文档元数据"."版本",
  total_unresolved_sources: ([."来源注册表"[] | select((.http_status // 0) != 200 or (.manual_verification_required // false) == true)] | length),
  unresolved_sources: [
    ."来源注册表"[]
    | select((.http_status // 0) != 200 or (.manual_verification_required // false) == true)
    | {
        source_id,
        source_name,
        source_type,
        source_url,
        http_status,
        manual_verification_required,
        manual_verification_note
      }
  ]
}' "${DATA_PATH}" > "${REPORT_PATH}"

cp "${REPORT_PATH}" "${LATEST_PATH}"

echo "Source manual verify report generated"
echo "- report: ${REPORT_PATH}"
echo "- latest: ${LATEST_PATH}"
