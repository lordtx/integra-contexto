#!/usr/bin/env python3
"""Create apps - try without dockerfile_path, set dockerfile in .coolify file instead"""
import json, urllib.request, sys

API = "http://127.0.0.1:8000/api/v1"
tok = open("/root/.cf_token").read().strip()
PROJECT = "xguktfd3flccn1itijag6jsa"
SERVER = "9xu3hjh5bt7qerpukkbc"

def api(method, path, data=None):
    req = urllib.request.Request(f"{API}{path}", method=method,
        data=json.dumps(data).encode() if data else None)
    req.add_header("Authorization", f"Bearer {tok}")
    req.add_header("Content-Type", "application/json")
    req.add_header("Accept", "application/json")
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            raw = r.read().decode()
            return json.loads(raw)
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        try:
            return {"error": e.code, "body": json.loads(body)}
        except:
            return {"error": e.code, "body": body[:300]}
    except Exception as e:
        return {"error": str(e)}

# Check what fields are accepted by inspecting existing apps
print("=== Existing apps (for reference) ===")
apps = api("GET", "/applications")
if isinstance(apps, list):
    for a in apps[:5]:
        keys = list(a.keys())
        print(f"  {a.get('name','?')}: {a.get('uuid','')[:16]}... fields: {keys}")

# Get first app details for field reference
if isinstance(apps, list) and len(apps) > 0:
    first = apps[0]
    print(f"\n=== Sample app fields ===")
    for k in ["name", "build_pack", "git_repository", "git_branch", "dockerfile_path", "ports_exposes"]:
        print(f"  {k}: {first.get(k, 'MISSING')}")

# Check if there's a different way to pass dockerfile path
# Maybe via environment or settings
print("\n=== Trying to get app with UUID ===")
for a in apps[:1] if isinstance(apps, list) else []:
    det = api("GET", f"/applications/{a['uuid']}")
    if isinstance(det, dict):
        print(f"  Build pack: {det.get('build_pack')}")
        print(f"  dockerfile_path: {det.get('dockerfile_path', 'NOT SET')}")
        print(f"  dockerfile: {det.get('dockerfile', 'NOT SET')}")

# Try creating with dockerfile instead of dockerfile_path
print("\n=== Try creating with 'dockerfile' field ===")
trial = {
    "name": "integra-contexto-test",
    "git_repository": "https://github.com/lordtx/integra-contexto",
    "git_branch": "main",
    "build_pack": "dockerfile",
    "dockerfile": "infrastructure/docker/api.Dockerfile",
    "ports_exposes": "3001",
    "project_uuid": PROJECT,
    "server_uuid": SERVER,
    "environment_name": "production",
}
r = api("POST", "/applications/public", trial)
print(json.dumps(r, indent=2)[:500])