#!/usr/bin/env python3
"""Check build status"""
import json, urllib.request, time

API = "http://127.0.0.1:8000/api/v1"
SVC = "mylv18x5iz09r94etnscz9gy"

def get(path):
    tok = open("/root/.cf_token").read().strip()
    req = urllib.request.Request(f"{API}{path}")
    req.add_header("Authorization", f"Bearer {tok}")
    req.add_header("Accept", "application/json")
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            return json.loads(r.read().decode())
    except Exception as e:
        return f"Error: {e}"

# Check deployments
print("=== Deployments ===")
deps = get(f"/deployments?application_uuid={SVC}")
if isinstance(deps, list):
    for d in deps:
        print(f"  [{d.get('status')}] {d.get('commit','?')[:16]}")
elif isinstance(deps, dict):
    print(f"  {deps.get('message', deps)}")
else:
    print(f"  {str(deps)[:200]}")

# Check containers via subprocess
import subprocess
r = subprocess.run("docker ps -a --filter name=mylv18x5iz09r94etnscz9gy --format '{{.Names}} {{.Status}}'", shell=True, capture_output=True, text=True, timeout=10)
print("\n=== Containers ===")
if r.stdout:
    print(r.stdout)
else:
    print("(none running yet — build in progress)")

# Check if integra-web exists
r2 = subprocess.run("docker ps -a --filter name=integra-web --format '{{.Names}} {{.Status}}'", shell=True, capture_output=True, text=True, timeout=10)
if r2.stdout:
    print(f"\nWeb container: {r2.stdout}")

# Quick health check if web is running
r3 = subprocess.run("docker ps --filter name=integra-web --filter status=running --format '{{.Names}}'", shell=True, capture_output=True, text=True, timeout=5)
if r3.stdout.strip():
    import socket
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.settimeout(3)
    if s.connect_ex(('127.0.0.1', 3000)) == 0:
        print("\n✅ Web is running on port 3000!")
    else:
        print("\n❌ Web container exists but port 3000 not listening")
    s.close()

# Try to read current service compose
svc_data = get(f"/services/{SVC}")
if isinstance(svc_data, dict):
    raw = svc_data.get("docker_compose_raw", "")
    print(f"\nCompose last verify: web.Dockerfile={'✅' if 'web.Dockerfile' in raw else '❌'}, size={len(raw)}")