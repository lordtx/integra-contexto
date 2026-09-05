#!/usr/bin/env python3
"""Clean up old integra apps and get Supabase credentials"""
import json, urllib.request

tok = open("/root/.cf_token").read().strip()

def api(method, path, data=None):
    body = json.dumps(data).encode() if data else None
    req = urllib.request.Request(f"http://127.0.0.1:8000/api/v1{path}", method=method, data=body)
    req.add_header("Authorization", "Bearer " + tok)
    req.add_header("Content-Type", "application/json")
    req.add_header("Accept", "application/json")
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            return json.loads(r.read().decode())
    except urllib.error.HTTPError as e:
        return {"_error": e.code, "_body": e.read().decode()[:300]}

# 1. Delete old integra apps
print("=== Deleting old integra apps ===")
apps = api("GET", "/applications")
for a in apps:
    if "integra" in a.get("name", ""):
        uuid = a.get("uuid")
        r = api("DELETE", f"/applications/{uuid}")
        print(f"  Deleted {a['name']}: {r}")

# 2. Get Supabase credentials
print("\n=== Supabase credentials ===")
supa = api("GET", "/services/qgv5lrlyqgzhmpmxkccokx6b")
raw = supa.get("docker_compose_raw", "")
for line in raw.split("\n"):
    ll = line.strip().lower()
    if any(k in ll for k in ["postgres", "password", "user", "database", "db_", "db:", "redis", "anon", "service_role", "jwt"]):
        print(line.strip()[:120])

print("\n=== Supabase env vars ===")
envs = api("GET", "/services/qgv5lrlyqgzhmpmxkccokx6b/envs")
for e in envs:
    k = e.get("key", "")
    if any(x in k.lower() for x in ["postgres", "user", "password", "db", "redis", "host", "port"]):
        print(f"  {k} = {e.get('value','(none)')[:60]}")

# Check coolify-redis
print("\n=== Redis ===")
# Find redis service
for s in api("GET", "/services"):
    if "redis" in s.get("name", "").lower() and "coolify" in s.get("name", "").lower():
        print(f"  Found: {s['name']} -> {s['uuid'][:12]}")
        envs = api("GET", f"/services/{s['uuid']}/envs")
        for e in envs:
            print(f"  {e.get('key')} = {e.get('value','(none)')[:60]}")