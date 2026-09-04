#!/usr/bin/env python3
"""Extract Supabase credentials from Coolify compose"""
import json, urllib.request

API = "http://127.0.0.1:8000/api/v1"
tok = open("/root/.cf_token").read().strip()

def get(path):
    r = urllib.request.Request(f"{API}{path}")
    r.add_header("Authorization", f"Bearer {tok}")
    r.add_header("Accept", "application/json")
    with urllib.request.urlopen(r, timeout=15) as resp:
        return json.loads(resp.read().decode())

# Get Supabase service compose
svc = get("/services/qgv5lrlyqgzhmpmxkccokx6b")
raw = svc.get("docker_compose_raw", "")
print(f"=== Supabase Compose (credentials) ===")
for line in raw.split("\n"):
    ll = line.strip().lower()
    if any(k in ll for k in ["postgres", "password", "user", "database", "db_", "db:", "redis", "anon", "service_role", "jwt"]):
        print(line.strip()[:120])

# Also check env vars  
print(f"\n=== Supabase Env Vars ===")
envs = get(f"/services/qgv5lrlyqgzhmpmxkccokx6b/envs")
for e in envs:
    k = e.get("key","")
    if any(x in k.lower() for x in ["postgres", "user", "password", "db", "redis", "host", "port"]):
        print(f"  {k} = {e.get('value','(none)')[:60]}")

# Check the actual Supabase database container
import subprocess
r = subprocess.run("docker ps --filter name=supabase-db --format '{{.Names}} {{.Status}}'", shell=True, capture_output=True, text=True, timeout=10)
print(f"\nSupabase DB container: {r.stdout.strip() or '(none)'}")

# Check what Postgres is available 
r = subprocess.run("docker ps --filter name=postgres --format '{{.Names}} {{.Status}}'", shell=True, capture_output=True, text=True, timeout=10)
print(f"Postgres containers: {r.stdout.strip() or '(none)'}")

# Check Redis containers  
r = subprocess.run("docker ps --filter name=redis --format '{{.Names}} {{.Status}}'", shell=True, capture_output=True, text=True, timeout=10)
print(f"Redis containers: {r.stdout.strip() or '(none)'}")

# Try connecting to Supabase DB from the host
r = subprocess.run("PGPASSWORD= postgres -h 127.0.0.1 -p 5432 -U postgres -c 'SELECT 1' 2>&1 || echo fail", shell=True, capture_output=True, text=True, timeout=10, env={"PGPASSWORD":""})
print(f"\nDB test: {r.stdout.strip()[:100]}")
print(f"DB err: {r.stderr.strip()[:100]}")