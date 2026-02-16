#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SCHEMA_PATH="${1:-${ROOT_DIR}/行业百科.schema.json}"
DATA_PATH="${2:-${ROOT_DIR}/行业百科.json}"

if [[ ! -f "${SCHEMA_PATH}" ]]; then
  echo "Schema file not found: ${SCHEMA_PATH}" >&2
  exit 1
fi

if [[ ! -f "${DATA_PATH}" ]]; then
  echo "Data file not found: ${DATA_PATH}" >&2
  exit 1
fi

python3 - "${SCHEMA_PATH}" "${DATA_PATH}" <<'PY'
import json
import sys

schema_path, data_path = sys.argv[1], sys.argv[2]

try:
    import jsonschema
except Exception as exc:
    print(f"jsonschema import failed: {exc}", file=sys.stderr)
    sys.exit(2)

with open(schema_path, 'r', encoding='utf-8') as f:
    schema = json.load(f)
with open(data_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

validator = jsonschema.Draft7Validator(schema, format_checker=jsonschema.FormatChecker())
errors = sorted(validator.iter_errors(data), key=lambda e: list(e.path))

if errors:
    print(f"Validation failed: {len(errors)} error(s)")
    for err in errors[:20]:
        path = '$'
        for p in err.path:
            if isinstance(p, int):
                path += f'[{p}]'
            else:
                path += f'.{p}'
        print(f"- {path}: {err.message}")
    if len(errors) > 20:
        print(f"... {len(errors) - 20} more error(s) omitted")
    sys.exit(1)

print(f"Validation passed: {data_path}")
PY

"${ROOT_DIR}/scripts/validate_industry_references.sh" "${DATA_PATH}"
