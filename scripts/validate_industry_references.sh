#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DATA_PATH="${1:-${ROOT_DIR}/行业百科.json}"

if [[ ! -f "${DATA_PATH}" ]]; then
  echo "Data file not found: ${DATA_PATH}" >&2
  exit 1
fi

python3 - "${DATA_PATH}" <<'PY'
import json
import re
import sys
from urllib.parse import urlparse

path = sys.argv[1]
with open(path, 'r', encoding='utf-8') as f:
    data = json.load(f)

errors = []

SOURCE_ID_RE = re.compile(r'^SRC_[A-Z0-9_]+$')

city_dict = {x['city_id'] for x in data.get('枚举字典', {}).get('关键城市', [])}
source_registry = data.get('来源注册表', [])
source_registry_ids = {x.get('source_id') for x in source_registry}
company_tiers = set(data.get('枚举字典', {}).get('公司层级', []))
source_type_dict = set(data.get('枚举字典', {}).get('来源类型枚举', []))

entries = data.get('行业词条', [])
index_items = data.get('行业索引', [])

entry_ids = [e.get('industry_id') for e in entries]
index_ids = [x.get('industry_id') for x in index_items]

if len(entry_ids) != len(set(entry_ids)):
    errors.append('行业词条中存在重复industry_id')
if set(entry_ids) != set(index_ids):
    errors.append('行业索引与行业词条的industry_id集合不一致')

# source registry checks
seen_registry_id = set()
for r in source_registry:
    sid = r.get('source_id')
    surl = r.get('source_url')
    if not sid or not isinstance(sid, str) or not SOURCE_ID_RE.match(sid):
        errors.append(f'来源注册表存在非法source_id: {sid}')
    if sid in seen_registry_id:
        errors.append(f'来源注册表存在重复source_id: {sid}')
    seen_registry_id.add(sid)

    if not surl:
        errors.append(f'来源注册表{sid}缺少source_url')
    else:
        p = urlparse(surl)
        if p.scheme not in ('http', 'https'):
            errors.append(f'来源注册表{sid} URL协议非法: {surl}')


def validate_source_obj(iid, src, prefix):
    sid = src.get('source_id')
    if not sid:
        errors.append(f'{iid}: {prefix}缺少source_id')
        return
    if not SOURCE_ID_RE.match(str(sid)):
        errors.append(f'{iid}: {prefix} source_id格式非法 {sid}')
    if sid not in source_registry_ids:
        errors.append(f'{iid}: {prefix} source_id未注册 {sid}')

    surl = src.get('source_url')
    if not surl:
        errors.append(f'{iid}: {prefix}缺少source_url')
    else:
        p = urlparse(surl)
        if p.scheme not in ('http', 'https'):
            errors.append(f'{iid}: {prefix} URL协议非法 {surl}')

    stype = src.get('source_type')
    if not stype:
        errors.append(f'{iid}: {prefix}缺少source_type')
    elif source_type_dict and stype not in source_type_dict:
        errors.append(f'{iid}: {prefix} source_type不在枚举字典中 {stype}')


def evidence_of(item, collection_key):
    if collection_key in ('薪酬快照_按城市_按公司层级_按岗位', '薪酬实证_国家统计口径'):
        return item
    return item.get('evidence', {})


for e in entries:
    iid = e.get('industry_id', '<unknown>')
    dynamic = e.get('dynamic', {})

    # must include salary macro collection in v1.4
    if '薪酬实证_国家统计口径' not in dynamic:
        errors.append(f'{iid}: 缺少薪酬实证_国家统计口径集合')

    # role ids
    role_items = dynamic.get('岗位画像库', {}).get('items', [])
    role_ids = [r.get('role_id') for r in role_items if r.get('role_id')]
    if len(role_ids) != len(set(role_ids)):
        errors.append(f'{iid}: 岗位画像库存在重复role_id')
    role_id_set = set(role_ids)

    # city ids in static
    city_layout = e.get('static', {}).get('招聘与成长', {}).get('城市格局', {})
    for cid in city_layout.get('核心城市_ids', []) + city_layout.get('机会增长城市_ids', []):
        if cid not in city_dict:
            errors.append(f'{iid}: 城市格局存在未知city_id {cid}')

    # source records at entry level
    for idx, s in enumerate(e.get('sources', []), start=1):
        validate_source_obj(iid, s, f'sources[{idx}]')

    for key, col in dynamic.items():
        if not isinstance(col, dict):
            continue

        min_sample = col.get('min_sample_size_for_verified', 1)
        status = col.get('data_status')

        # manual fill structure check
        if col.get('manual_fill_required'):
            slots = col.get('manual_fill_slots', [])
            progress = col.get('manual_fill_progress')
            if not isinstance(slots, list) or len(slots) == 0:
                errors.append(f'{iid}: {key} manual_fill_required=true 但manual_fill_slots为空')
            if not isinstance(progress, dict):
                errors.append(f'{iid}: {key} 缺少manual_fill_progress')
            for slot in slots:
                if slot.get('status') == 'pending_user_fill':
                    if slot.get('priority') not in ('P0', 'P1', 'P2'):
                        errors.append(f'{iid}: {key} manual_fill_slots存在非法priority')
                    if not slot.get('due_date'):
                        errors.append(f'{iid}: {key} manual_fill_slots缺少due_date')

        # company checks
        if key == '公司清单':
            for c in col.get('items', []):
                tier = c.get('company_tier')
                if tier not in company_tiers:
                    errors.append(f'{iid}: 公司层级非法 {tier}')
                for cid in c.get('city_ids', []):
                    if cid not in city_dict:
                        errors.append(f'{iid}: 公司清单存在未知city_id {cid}')

        # salary micro checks
        if key == '薪酬快照_按城市_按公司层级_按岗位':
            if col.get('linked_macro_collection') != '薪酬实证_国家统计口径':
                errors.append(f'{iid}: 薪酬微观层缺少正确linked_macro_collection')
            for s in col.get('items', []):
                cid = s.get('city_id')
                if cid not in city_dict:
                    errors.append(f'{iid}: 薪酬快照存在未知city_id {cid}')
                rid = s.get('role_id')
                if rid and rid not in role_id_set:
                    errors.append(f'{iid}: 薪酬快照role_id未在岗位画像库定义 {rid}')
                if s.get('company_tier') not in company_tiers:
                    errors.append(f'{iid}: 薪酬快照company_tier非法 {s.get("company_tier")}')

        # salary macro checks
        if key == '薪酬实证_国家统计口径' and status == 'verified':
            items = col.get('items', [])
            if len(items) < 2:
                errors.append(f'{iid}: 薪酬实证层标记verified但items不足2条')

        # verified records checks
        if status == 'verified':
            items = col.get('items', [])
            if len(items) == 0:
                errors.append(f'{iid}: {key}标记verified但items为空')
                continue

            for item in items:
                ev = evidence_of(item, key)
                needed = ['source_id', 'source_url', 'source_date', 'confidence', 'sample_size']
                if any(ev.get(k) in (None, '') for k in needed):
                    errors.append(f'{iid}: {key} verified记录缺少证据字段')
                if ev.get('sample_size', 0) < min_sample:
                    errors.append(f'{iid}: {key} verified记录sample_size<{min_sample}')

        # all item-level evidence/source checks
        for item in col.get('items', []):
            ev = evidence_of(item, key)
            if isinstance(ev, dict) and ev:
                validate_source_obj(iid, ev, f'{key}.item')

        for arr_key in ('estimated_items', 'observed_items', 'official_benchmark'):
            for item in col.get(arr_key, []):
                if isinstance(item, dict) and 'source_url' in item:
                    validate_source_obj(iid, item, f'{key}.{arr_key}')

if errors:
    print(f'Reference validation failed: {len(errors)} error(s)')
    for msg in errors[:80]:
        print(f'- {msg}')
    if len(errors) > 80:
        print(f'... {len(errors)-80} more error(s) omitted')
    sys.exit(1)

print(f'Reference validation passed: {path}')
PY
