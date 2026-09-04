#!/usr/bin/env python3
"""Find coolify-redis password"""
import subprocess, json

# Check redis CLI
r = subprocess.run("docker exec coolify-redis redis-cli CONFIG GET requirepass 2>/dev/null", 
    shell=True, capture_output=True, text=True, timeout=10)
print(f"Redis requirepass: {r.stdout.strip() or '(no auth)'}")
print(f"Redis err: {r.stderr.strip()[:100]}")

# Try from inside container - check /proc/1/environ for REDIS_PASSWORD
r = subprocess.run("docker exec coolify-redis cat /proc/1/environ 2>/dev/null | tr '\\0' '\\n' | grep -i pass", 
    shell=True, capture_output=True, text=True, timeout=10)
print(f"\nRedis env password: {r.stdout.strip() or '(not found)'}")

# Check what command redis is running with
r = subprocess.run("docker inspect coolify-redis --format '{{.Args}}'", 
    shell=True, capture_output=True, text=True, timeout=10)
print(f"\nRedis args: {r.stdout.strip() or '(not found)'}")

# Check Redis compose from Coolify services
API = "http://127.0.0.1:8000/api/v1"
tok = open("/root/.cf_token").read().strip()
import urllib.request
for suuid in ["kicgix0hgfux4g7jeh17uaik", "qgv5lrlyqgzhmpmxkccokx6b"]:
    req = urllib.request.Request(f"{API}/services/{suuid}")
    req.add_header("Authorization", f"Bearer {tok}")
    req.add_header("Accept", "application/json")
    try:
        d = json.loads(urllib.request.urlopen(req,timeout=10).read().decode())
        raw = d.get("docker_compose_raw", "")
        for line in raw.split("\n"):
            if "redis" in line.lower() and ("pass" in line.lower() or "require" in line.lower()):
                print(f"\nRedis from {suuid}: {line.strip()[:100]}")
    except:
        pass

# Try default Redis passwords
for pw in ["", "coolify", "redis", "password"]:
    r = subprocess.run(f"docker exec coolify-redis redis-cli -a '{pw}' PING 2>/dev/null", 
        shell=True, capture_output=True, text=True, timeout=5)
    if "PONG" in r.stdout:
        print(f"\n✅ Redis password found: '{pw}'")
        break