#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DATA_PATH="${1:-${ROOT_DIR}/行业百科.json}"
OUT_DIR="${2:-${ROOT_DIR}/data}"
ENTRY_DIR="${OUT_DIR}/entries"

mkdir -p "${ENTRY_DIR}"

jq -c '."行业词条"[]' "${DATA_PATH}" | while IFS= read -r line; do
  id="$(printf '%s' "${line}" | jq -r '.industry_id')"
  printf '%s\n' "${line}" | jq '.' > "${ENTRY_DIR}/${id}.json"
done

jq '{
  generated_at: now | strftime("%Y-%m-%dT%H:%M:%SZ"),
  source_file: input_filename,
  version: ."文档元数据"."版本",
  release_date: ."文档元数据"."发布日期",
  entries: ([."行业索引"[] | . + {file_path:("entries/" + .industry_id + ".json")}])
}' "${DATA_PATH}" > "${OUT_DIR}/index.json"

echo "Split completed"
echo "- index: ${OUT_DIR}/index.json"
echo "- entries: ${ENTRY_DIR}"
