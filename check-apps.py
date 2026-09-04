#!/usr/bin/env python3
"""Check app status and fix dockerfile_path"""
import json, urllib.request, time

API = "http://127.0.0.1:8000/api/v1"
tok = open("/root/.cf_token").read().strip()

def api(method, path, data=None):
    body = json.dumps(data).encode() if data else None
    req = urllib.request.Request(f"{API}{path}", method=method, data=body)
    req.add_header("Authorization", f"Bearer {tok}")
    req.add_header("Content-Type", "application/json")
    req.add_header("Accept", "application/json")
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            return json.loads(r.read().decode())
    except urllib.error.HTTPError as e:
        return {"_error": e.code, "_body": e.read().decode()[:500]}

# Check each app
for name, uuid in [("integra-api","bhgcivw5kf2muagssgsahs2l"), 
                    ("integra-worker","cklvkpluyrxevyqolbtergkf"),
                    ("integra-web","uccspetkvvjoia4agyp7i5an")]:
    print(f"\n=== {name} ===")
    app = api("GET", f"/applications/{uuid}")
    if isinstance(app, dict) and not app.get("_error"):
        print(f"  build_pack: {app.get('build_pack')}")
        print(f"  dockerfile_path: {app.get('dockerfile_path', '(not set)')}")
        print(f"  ports: {app.get('ports_exposes')}")
        print(f"  domains: {app.get('fqdn', app.get('domains', '(none)'))}")
        print(f"  git_repository: {app.get('git_repository')}")
        print(f"  git_branch: {app.get('git_branch')}")
    else:
        print(f"  Error: {app}")

# Try separate PATCH for dockerfile_path only
print("\n=== Testing PATCH dockerfile_path separately ===")
for name, uuid, df in [("integra-api","bhgcivw5kf2muagssgsahs2l","infrastructure/docker/api.Dockerfile"),
                        ("integra-worker","cklvkpluyrxevyqolbtergkf","infrastructure/docker/worker.Dockerfile"),
                        ("integra-web","uccspetkvvjoia4agyp7i5an","infrastructure/docker/web.Dockerfile")]:
    r = api("PATCH", f"/applications/{uuid}", {"dockerfile_path": df})
    print(f"  {name}: {r.get('_error','OK') if isinstance(r,dict) else 'OK'} - {str(r)[:200]}")

# Try PATCH only domains for api and web
for name, uuid, dom in [("integra-api","bhgcivw5kf2muagssgsahs2l","https://api.dtxnet.top"),
                         ("integra-web","uccspetkvvjoia4agyp7i5an","https://app.dtxnet.top,https://overlay.dtxnet.top")]:
    r = api("PATCH", f"/applications/{uuid}", {"domains": dom})
    print(f"  Domains {name}: {r.get('_error','OK') if isinstance(r,dict) else 'OK'} - {str(r)[:200]}")