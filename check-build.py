#!/usr/bin/env python3
"""Check build logs on Coolify"""
import json, urllib.request, sys

SVC = "mylv18x5iz09r94etnscz9gy"
API = "http://127.0.0.1:8000/api/v1"

tok = open("/root/.cf_token").read().strip()

def api(path):
    req = urllib.request.Request(f"{API}{path}")
    req.add_header("Authorization", f"Bearer {tok}")
    req.add_header("Accept", "application/json")
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.loads(r.read().decode())

print("=== Deployments ===")
deps = api(f"/deployments?application_uuid={SVC}")
if isinstance(deps, list):
    print(f"Total: {len(deps)}")
    for d in deps:
        print(f"  [{d.get('status')}] commit={d.get('commit','?')[:12]} created={d.get('created_at','')}")
        logs = d.get("logs", "")
        if logs:
            try:
                entries = json.loads(logs)
                for e in entries[-3:]:
                    t = e.get("type","?")
                    cmd = e.get("command","")[:60]
                    out = e.get("output","")[:300]
                    if out:
                        print(f"    [{t}] {cmd}")
                        print(f"      {out}")
            except:
                print(f"    Raw: {logs[:300]}")
else:
    print(f"  {str(deps)[:300]}")

print("\n=== Containers ===")
import subprocess
r = subprocess.run("docker ps -a --filter name=integra --format '{{.Names}} {{.Status}}' 2>/dev/null || echo no-docker", shell=True, capture_output=True, text=True, timeout=10)
print(r.stdout or "(none)")

print("\n=== Images ===")
r = subprocess.run("docker images --format '{{.Repository}}:{{.Tag}}' 2>/dev/null | grep -i integra || echo no-images", shell=True, capture_output=True, text=True, timeout=10)
print(r.stdout or "(none)")