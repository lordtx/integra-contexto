#!/usr/bin/env python3
"""Trigger deploy for all integra apps"""
import json, urllib.request, time

API = "http://127.0.0.1:8000/api/v1"
tok = open("/root/.cf_token").read().strip()

def get(path):
    r = urllib.request.Request(f"{API}{path}")
    r.add_header("Authorization", f"Bearer {tok}")
    r.add_header("Accept", "application/json")
    return json.loads(urllib.request.urlopen(r, timeout=15).read().decode())

def post(path, data):
    body = json.dumps(data).encode()
    r = urllib.request.Request(f"{API}{path}", method="POST", data=body)
    r.add_header("Authorization", f"Bearer {tok}")
    r.add_header("Content-Type", "application/json")
    r.add_header("Accept", "application/json")
    return json.loads(urllib.request.urlopen(r, timeout=15).read().decode())

# List integra apps
apps = get("/applications")
for a in apps:
    if "integra" in a.get("name", "").lower():
        uuid = a.get("uuid")
        name = a.get("name")
        print(f"Deploying {name} ({uuid})...")
        r = post("/deploy", {"uuid": uuid})
        print(f"  {r.get('deployments', [{}])[0].get('message', 'queued')}")
        time.sleep(3)

print("\n=== All deployments triggered ===")