#!/usr/bin/env python3
"""Check existing Coolify resources — databases, Redis, ports"""
import json, urllib.request, subprocess

API = "http://127.0.0.1:8000/api/v1"
tok = open("/root/.cf_token").read().strip()

def get(path):
    r = urllib.request.Request(f"{API}{path}")
    r.add_header("Authorization", f"Bearer {tok}")
    r.add_header("Accept", "application/json")
    with urllib.request.urlopen(r, timeout=15) as resp:
        return json.loads(resp.read().decode())

# 1. Services list
print("=== ALL SERVICES ===")
svcs = get("/services")
for s in svcs:
    print(f"  {s['name']:20s} → {s['uuid'][:12]}...")

# 2. Check Supabase details
print("\n=== SUPABASE ===")
for s in svcs:
    if "supabase" in s["name"].lower():
        suuid = s["uuid"]
        envs = get(f"/services/{suuid}/envs")
        print(f"  UUID: {suuid}")
        for e in envs:
            if any(k in e.get("key","").lower() for k in ["password", "user", "host", "port", "database", "db"]):
                print(f"  {e['key']} = {e['value'][:30] if e.get('value') else '(none)'}")

# 3. Check Redis (standalone or Supabase Redis?)
print("\n=== REDIS ===")
for s in svcs:
    if "redis" in s["name"].lower() or "supabase" in s["name"].lower():
        print(f"  Checking {s['name']}...")
        envs = get(f"/services/{s['uuid']}/envs")
        for e in envs:
            if "redis" in e.get("key","").lower():
                print(f"  {e['key']} = {e['value'][:40] if e.get('value') else '(none)'}")

# 4. Check running containers / ports
print("\n=== CONTAINERS (integra*) ===")
r = subprocess.run("docker ps -a --filter name=integra --format '{{.Names}} {{.Status}}'", shell=True, capture_output=True, text=True, timeout=10)
print(r.stdout.strip() or "(none)")

# 5. Free ports
print("\n=== PORTS ===")
r = subprocess.run("ss -tlnp | grep -E '300[0-9]|543[2-9]|6379|6380' || echo free", shell=True, capture_output=True, text=True, timeout=10)
print(r.stdout.strip())