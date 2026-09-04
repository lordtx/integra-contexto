#!/usr/bin/env python3
"""Find project envs and create one"""
import json, urllib.request, sys

API = "http://127.0.0.1:8000/api/v1"
tok = open("/root/.cf_token").read().strip()

def get(path):
    r = urllib.request.Request(API+path)
    r.add_header("Authorization", "Bearer "+tok)
    r.add_header("Accept", "application/json")
    with urllib.request.urlopen(r, timeout=15) as resp:
        return json.loads(resp.read().decode())

def api(method, path, data=None):
    body = json.dumps(data).encode() if data else None
    r = urllib.request.Request(API+path, method=method, data=body)
    r.add_header("Authorization", "Bearer "+tok)
    r.add_header("Content-Type", "application/json")
    r.add_header("Accept", "application/json")
    with urllib.request.urlopen(r, timeout=15) as resp:
        return json.loads(resp.read().decode())

# All projects
projs = get("/projects")
for p in projs:
    name = p.get("name","?")
    uuid = p.get("uuid","?")
    envs = p.get("environments", [])
    print(f"\nProject: {name}")
    for e in envs:
        print(f"  Env: {e.get('name','?')} uuid={e.get('uuid','?')}")
    # Also check if there's an environment_id
    eid = p.get("environment_id", p.get("id"))
    print(f"  environment_id: {eid}")

# Create env for IntegraContexto
print("\n=== Creating env for IntegraContexto ===")
try:
    r = api("POST", "/projects/xguktfd3flccn1itijag6jsa/environments", {"name": "production"})
    print(f"Create: {json.dumps(r, indent=2)[:200]}")
except Exception as e:
    print(f"Error: {e}")