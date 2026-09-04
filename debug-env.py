#!/usr/bin/env python3
"""Debug: find project environment UUID"""
import json, urllib.request, sys

API = "http://127.0.0.1:8000/api/v1"
tok = open("/root/.cf_token").read().strip()

def get(path):
    r = urllib.request.Request(f"{API}{path}")
    r.add_header("Authorization", f"Bearer {tok}")
    r.add_header("Accept", "application/json")
    with urllib.request.urlopen(r, timeout=15) as resp:
        return json.loads(resp.read().decode())

# Get project
p = get("/projects/xguktfd3flccn1itijag6jsa")
print(f"Project: {p.get('name')}")
print(f"Environments: {json.dumps(p.get('environments', []), indent=2)}")

# Also try to create via POST /applications/public without environment_name
# Let me see what GET /applications returns
apps = get("/applications")
print(f"\nAll apps count: {len(apps) if isinstance(apps, list) else 'N/A'}")
for a in (apps if isinstance(apps, list) else []):
    print(f"  {a.get('name')}: env={a.get('environment_id')}")