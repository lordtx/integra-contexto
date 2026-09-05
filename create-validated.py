#!/usr/bin/env python3
"""Create apps with full validation"""
import json, urllib.request, time, sys

API = "http://127.0.0.1:8000/api/v1"
tok = open("/root/.cf_token").read().strip()

def api(method, path, data=None):
    body = json.dumps(data).encode() if data else None
    req = urllib.request.Request(f"{API}{path}", method=method, data=body)
    req.add_header("Authorization", f"Bearer {tok}")
    req.add_header("Content-Type", "application/json")
    req.add_header("Accept", "application/json")
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            return json.loads(r.read().decode())
    except urllib.error.HTTPError as e:
        err = e.read().decode()
        print(f"  ERROR {e.code}: {err[:300]}")
        return {"_error": e.code, "_body": err[:300]}

PROJECT = "xguktfd3flccn1itijag6jsa"
SERVER = "9xu3hjh5bt7qerpukkbcwkej"

apps = [
    {"name": "integra-api", "branch": "deploy-api", "dockerfile": "infrastructure/docker/api.Dockerfile",
     "ports": "3001", "domains": "https://api.dtxnet.top",
     "env": {"POSTGRES_HOST": "127.0.0.1", "POSTGRES_PORT": "5432", "POSTGRES_DB": "integra_contexto",
             "POSTGRES_USER": "postgres", "POSTGRES_PASSWORD": "GEcUZ$3jfXykbAJlj3r!",
             "REDIS_HOST": "127.0.0.1", "REDIS_PORT": "6379", "REDIS_PASSWORD": "XBwH+0AY1knXrJJ2Cz6FI10EWKIkguulXbHpjpDw2u8=",
             "API_PORT": "3001"}},
    {"name": "integra-worker", "branch": "deploy-worker", "dockerfile": "infrastructure/docker/worker.Dockerfile",
     "ports": "", "domains": "",
     "env": {"POSTGRES_HOST": "127.0.0.1", "POSTGRES_PORT": "5432", "POSTGRES_DB": "integra_contexto",
             "POSTGRES_USER": "postgres", "POSTGRES_PASSWORD": "GEcUZ$3jfXykbAJlj3r!",
             "REDIS_HOST": "127.0.0.1", "REDIS_PORT": "6379", "REDIS_PASSWORD": "XBwH+0AY1knXrJJ2Cz6FI10EWKIkguulXbHpjpDw2u8="}},
    {"name": "integra-web", "branch": "deploy-web", "dockerfile": "infrastructure/docker/web.Dockerfile",
     "ports": "3000", "domains": "https://app.dtxnet.top,https://overlay.dtxnet.top",
     "env": {"NEXT_PUBLIC_API_URL": "https://api.dtxnet.top", "NEXT_PUBLIC_WS_URL": "wss://ws.dtxnet.top"}},
]

for a in apps:
    print(f"\n=== {a['name']} ===")
    
    # CREATE
    r = api("POST", "/applications/public", {
        "project_uuid": PROJECT, "server_uuid": SERVER,
        "environment_name": "production", "name": a["name"],
        "git_repository": "https://github.com/lordtx/integra-contexto",
        "git_branch": a["branch"], "build_pack": "dockerfile",
        "ports_exposes": a["ports"],
    })
    
    uuid = None
    if isinstance(r, dict):
        uuid = r.get("uuid") or r.get("id")
    if not uuid and isinstance(r, list):
        uuid = r[0].get("uuid") if r else None
    if not uuid:
        print(f"  ❌ CREATE failed: {r}")
        continue
    
    print(f"  UUID: {uuid}")
    time.sleep(4)
    
    # PATCH domains only (dockerfile_path not allowed)
    patch = {}
    if a["domains"]:
        patch["domains"] = a["domains"]
    if patch:
        r = api("PATCH", f"/applications/{uuid}", patch)
        print(f"  Patch domains: {'OK' if isinstance(r, dict) and not r.get('_error') else 'FAIL'}")
    time.sleep(2)
    
    # Set envs
    for k, v in a["env"].items():
        r = api("POST", f"/applications/{uuid}/envs", {"key": k, "value": v})
        print(f"  Env {k}: {'✅' if isinstance(r, dict) and not r.get('_error') else '❌'}")
        time.sleep(2)
    
    # DEPLOY
    time.sleep(3)
    r = api("POST", "/deploy", {"uuid": uuid})
    print(f"  Deploy: {str(r)[:100]}")
    
    # Verify app exists
    time.sleep(3)
    v = api("GET", f"/applications/{uuid}")
    if isinstance(v, dict) and not v.get("_error"):
        print(f"  ✅ Verified: {v.get('name')} status={v.get('status')}")
    else:
        print(f"  ❌ Verification failed: {v}")

print("\n=== ALL CREATED ===")