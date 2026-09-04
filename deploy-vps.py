#!/usr/bin/env python3
"""Deploy v2 — PATCH needs base64 on v4.3.16"""
import json, urllib.request, base64, time, sys

API = "http://127.0.0.1:8000/api/v1"

def api(method, path, data=None, raw_body=None):
    tok = open("/root/.cf_token").read().strip()
    body = raw_body if raw_body else (json.dumps(data).encode() if data else None)
    req = urllib.request.Request(f"{API}{path}", method=method, data=body)
    req.add_header("Authorization", f"Bearer {tok}")
    req.add_header("Content-Type", "application/json")
    req.add_header("Accept", "application/json")
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return json.loads(r.read().decode())
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        print(f"  HTTP {e.code}: {body[:300]}")
        return None

SVC = "mylv18x5iz09r94etnscz9gy"

# Read compose
with open("/tmp/docker-compose.yml") as f:
    compose = f.read()

# PATCH with BASE64
print("=== PATCH with base64 ===")
b64 = base64.b64encode(compose.encode()).decode()
r = api("PATCH", f"/services/{SVC}", {"docker_compose_raw": b64})
print(f"Response: {str(r)[:300]}")
time.sleep(2)

# Verify
print("\n=== Verify ===")
svc = api("GET", f"/services/{SVC}")
raw = svc.get("docker_compose_raw", "") if svc else ""
print(f"  web.Dockerfile: {'✅' if 'web.Dockerfile' in raw else '❌'}")
print(f"  api.Dockerfile: {'✅' if 'api.Dockerfile' in raw else '❌'}")
print(f"  Size: {len(raw)}")

# Deploy
print("\n=== Deploy ===")
r = api("POST", "/deploy", {"uuid": SVC})
print(f"Deploy: {str(r)[:200]}")

import subprocess
subprocess.run(f"docker rm -f $(docker ps -a -q --filter name='{SVC[:12]}') 2>/dev/null", shell=True)

print("\n✅ Done!")