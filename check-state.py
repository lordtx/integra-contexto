#!/usr/bin/env python3
"""Check Coolify state and plan deployment"""
import json, urllib.request, sys

API = "http://127.0.0.1:8000/api/v1"
tok = open("/root/.cf_token").read().strip()

def api(method, path, data=None):
    req = urllib.request.Request(f"{API}{path}", method=method, 
        data=json.dumps(data).encode() if data else None)
    req.add_header("Authorization", f"Bearer {tok}")
    req.add_header("Content-Type", "application/json")
    req.add_header("Accept", "application/json")
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            return json.loads(r.read().decode())
    except urllib.error.HTTPError as e:
        return {"error": e.code, "body": e.read().decode()[:300]}

print("=== SERVICES ===")
svcs = api("GET", "/services")
if isinstance(svcs, list):
    print(f"\nTotal: {len(svcs)} services:\n")
    for s in svcs:
        name = s.get("name", "")
        uuid = s.get("uuid", "")[:20]
        # Check compose for Supabase/PG/Redis info
        raw = s.get("docker_compose_raw", "")
        has_pg = "postgres" in raw.lower() or "postgresql" in raw.lower()
        print(f"  [{uuid}..] {name}" + (" (has postgres)" if has_pg else ""))
else:
    print(f"Error: {svcs}")

print("\n=== PROJECTS ===")
projects = api("GET", "/projects")
if isinstance(projects, list):
    for p in projects:
        print(f"  {p.get('name')} -> {p.get('uuid')[:20]}...")
        for env in p.get("environments", []):
            print(f"    env: {env.get('name')} (id={env.get('id')})")
else:
    print(f"Error: {projects}")

print("\n=== SERVERS ===")
servers = api("GET", "/servers")
if isinstance(servers, list):
    for s in servers:
        print(f"  {s.get('name')} -> {s.get('uuid')[:20]}...")
else:
    print(f"Error: {servers}")

print("\n=== KEY DATA ===")
# Find Supabase/Redis specifically
for s in svcs if isinstance(svcs, list) else []:
    raw = s.get("docker_compose_raw", "")
    if "supabase" in s.get("name","").lower() or "postgres" in raw.lower():
        print(f"\nSupabase: {s['name']} ({s['uuid'][:20]}...)")
        print(f"  PG likely available internally")
    if "redis" in s.get("name","").lower() or "redis" in raw.lower():
        print(f"\nRedis: {s['name']} ({s['uuid'][:20]}...)")