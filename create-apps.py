#!/usr/bin/env python3
"""Create all 3 Integra Contexto apps - fixed with env UUID"""
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
        with urllib.request.urlopen(req, timeout=30) as r:
            return json.loads(r.read().decode())
    except urllib.error.HTTPError as e:
        return {"_error": e.code, "_body": e.read().decode()[:300]}

PROJECT = "xguktfd3flccn1itijag6jsa"
SERVER = "9xu3hjh5bt7qerpukkbcwkej"
ENV_UUID = "uo9hfzghhtofvubk1qgjdnke"
REPO = "https://github.com/lordtx/integra-contexto"

apps_data = [
    {
        "name": "integra-api",
        "ports": "3001",
        "dockerfile": "infrastructure/docker/api.Dockerfile",
        "domains": "https://api.dtxnet.top",
        "env": {
            "POSTGRES_HOST": "127.0.0.1", "POSTGRES_PORT": "5432",
            "POSTGRES_DB": "integra_contexto", "POSTGRES_USER": "postgres",
            "POSTGRES_PASSWORD": "GEcUZ$3jfXykbAJlj3r!",
            "REDIS_HOST": "127.0.0.1", "REDIS_PORT": "6379",
            "REDIS_PASSWORD": "XBwH+0AY1knXrJJ2Cz6FI10EWKIkguulXbHpjpDw2u8=",
            "API_PORT": "3001",
        }
    },
    {
        "name": "integra-worker",
        "ports": "",
        "dockerfile": "infrastructure/docker/worker.Dockerfile",
        "domains": "",
        "env": {
            "POSTGRES_HOST": "127.0.0.1", "POSTGRES_PORT": "5432",
            "POSTGRES_DB": "integra_contexto", "POSTGRES_USER": "postgres",
            "POSTGRES_PASSWORD": "GEcUZ$3jfXykbAJlj3r!",
            "REDIS_HOST": "127.0.0.1", "REDIS_PORT": "6379",
            "REDIS_PASSWORD": "XBwH+0AY1knXrJJ2Cz6FI10EWKIkguulXbHpjpDw2u8=",
        }
    },
    {
        "name": "integra-web",
        "ports": "3000",
        "dockerfile": "infrastructure/docker/web.Dockerfile",
        "domains": "https://app.dtxnet.top,https://overlay.dtxnet.top",
        "env": {
            "NEXT_PUBLIC_API_URL": "https://api.dtxnet.top",
            "NEXT_PUBLIC_WS_URL": "wss://ws.dtxnet.top",
        }
    }
]

for a in apps_data:
    print(f"\n=== {a['name']} ===")
    
    # CREATE
    r = api("POST", "/applications/public", {
        "project_uuid": PROJECT,
        "server_uuid": SERVER,
        "environment_name": "production",
        "name": a["name"],
        "git_repository": REPO,
        "git_branch": "main",
        "build_pack": "dockerfile",
        "ports_exposes": a["ports"],
    })
    
    uuid = None
    if isinstance(r, dict):
        uuid = r.get("uuid") or r.get("id")
    if not uuid and isinstance(r, list) and len(r) > 0:
        uuid = r[0].get("uuid")
    if not uuid:
        print(f"  ❌ CREATE: {r.get('_error', '?')} -> {str(r)[:200]}")
        # Check if already exists
        try:
            existing = api("GET", "/applications")
            if isinstance(existing, list):
                for x in existing:
                    if x.get("name") == a["name"]:
                        uuid = x.get("uuid")
                        print(f"  Found existing: {uuid}")
                        break
        except:
            pass
        if not uuid:
            continue
    
    print(f"  UUID: {uuid}")
    time.sleep(3)
    
    # PATCH dockerfile_path + domains
    patch = {}
    if a["dockerfile"]:
        patch["dockerfile_path"] = a["dockerfile"]
    if a["domains"]:
        patch["domains"] = a["domains"]
    if patch:
        r = api("PATCH", f"/applications/{uuid}", patch)
        print(f"  Patch: {r.get('_error', 'OK') if isinstance(r,dict) else 'OK'}")
    time.sleep(2)
    
    # Delete existing envs
    existing = api("GET", f"/applications/{uuid}/envs")
    if isinstance(existing, list):
        for env in existing:
            ek = env.get("key", "")
            eu = env.get("uuid")
            if eu and ek in a["env"]:
                api("DELETE", f"/applications/{uuid}/envs/{eu}")
                time.sleep(2)
    
    # Set envs
    for k, v in a["env"].items():
        r = api("POST", f"/applications/{uuid}/envs", {"key": k, "value": v})
        status = "✅" if isinstance(r, dict) and not r.get("_error") else "❌"
        print(f"  Env {k}: {status}")
        time.sleep(2)
    
    # Deploy
    time.sleep(3)
    r = api("POST", "/deploy", {"uuid": uuid})
    print(f"  Deploy: {str(r)[:100]}")

print("\n=== DONE ===")