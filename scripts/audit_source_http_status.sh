#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DATA_PATH="${1:-${ROOT_DIR}/行业百科.json}"
OUT_PATH="${2:-${ROOT_DIR}/reports/url_status_audit_latest.json}"
PARALLEL="${PARALLEL:-12}"
TIMEOUT_SEC="${TIMEOUT_SEC:-8}"

mkdir -p "$(dirname "${OUT_PATH}")"

TMP_URLS="$(mktemp)"
TMP_RESULTS="$(mktemp)"

# Collect unique URLs from registry, entry sources, and dynamic evidence/items
jq -r '
  [
    (."来源注册表"[]?.source_url),
    (."行业词条"[]?.sources[]?.source_url),
    (."行业词条"[]?.dynamic[]?.items[]?.source_url),
    (."行业词条"[]?.dynamic[]?.items[]?.evidence?.source_url),
    (."行业词条"[]?.dynamic[]?.estimated_items[]?.source_url),
    (."行业词条"[]?.dynamic[]?.observed_items[]?.source_url),
    (."行业词条"[]?.dynamic[]?.official_benchmark[]?.source_url)
  ]
  | flatten
  | map(select(. != null and . != ""))
  | unique
  | .[]
' "${DATA_PATH}" > "${TMP_URLS}"

cat "${TMP_URLS}" | xargs -I{} -P "${PARALLEL}" bash -c '
  url="$1"
  ua="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
  code=$(curl -I -L -A "$ua" -s --max-time "'"${TIMEOUT_SEC}"'" --retry 2 --retry-all-errors --retry-delay 1 -o /dev/null -w "%{http_code}" "$url" || true)
  # Some official sites block HEAD but allow GET. Fallback to GET before marking non-200.
  if [[ "$code" != "200" ]]; then
    code=$(curl -L -A "$ua" -s --max-time "'"${TIMEOUT_SEC}"'" --retry 2 --retry-all-errors --retry-delay 1 -o /dev/null -w "%{http_code}" "$url" || true)
  fi
  # Redirect responses are treated as reachable for user click experience.
  if [[ "$code" == "301" || "$code" == "302" || "$code" == "307" || "$code" == "308" ]]; then code="200"; fi
  if [[ -z "$code" ]]; then code="000"; fi
  echo -e "$url\t$code"
' _ {} > "${TMP_RESULTS}"

# Build JSON report
python3 - "${TMP_RESULTS}" "${OUT_PATH}" <<'PY'
import json
import sys
from datetime import datetime, timezone

results_path, out_path = sys.argv[1], sys.argv[2]
rows = []
with open(results_path, 'r', encoding='utf-8') as f:
    for line in f:
        line = line.strip('\n')
        if not line:
            continue
        parts = line.split('\t')
        if len(parts) != 2:
            continue
        url, code = parts
        try:
            code_num = int(code)
        except Exception:
            code_num = 0
        rows.append({"url": url, "http_status": code_num})

rows = sorted(rows, key=lambda x: x["url"])
status_dist = {}
for r in rows:
    status_dist[r["http_status"]] = status_dist.get(r["http_status"], 0) + 1

report = {
    "generated_at": datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ'),
    "total_urls": len(rows),
    "status_distribution": [{"http_status": k, "count": status_dist[k]} for k in sorted(status_dist.keys())],
    "rows": rows,
}

with open(out_path, 'w', encoding='utf-8') as f:
    json.dump(report, f, ensure_ascii=False, indent=2)
    f.write('\n')

print(out_path)
PY

rm -f "${TMP_URLS}" "${TMP_RESULTS}"

echo "URL audit completed"
echo "- output: ${OUT_PATH}"
