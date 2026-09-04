#!/usr/bin/env python3
"""Update Coolify service — debug first, then PATCH"""
import paramiko, json, time, sys

HOST = "187.127.48.130"
USER = "root"
PASS = "Arthvision@1"

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, username=USER, password=PASS, look_for_keys=False)

def run(cmd):
    _, o, e = ssh.exec_command(cmd, timeout=30)
    return o.read().decode().strip(), e.read().decode().strip()

# Debug: check what the API returns
print("=== 1. Debug API ===")

# Check token file exists
out, _ = run("wc -c /root/.cf_token")
print(f"Token file size: {out}")

# List projects
out, _ = run("curl -s -H 'Authorization: Bearer *** /root/.cf_token)' -H 'Accept: application/json' -H 'User-Agent: Mozilla/5.0' http://127.0.0.1:8000/api/v1/projects")
print(f"Projects response (first 200): {out[:200]}")

# List services
out, _ = run("curl -s -H 'Authorization: Bearer *** /root/.cf_token)' -H 'Accept: application/json' -H 'User-Agent: Mozilla/5.0' http://127.0.0.1:8000/api/v1/services")
print(f"Services response (first 500): {out[:500]}")

# Try to parse
try:
    data = json.loads(out)
    if isinstance(data, list):
        for s in data:
            print(f"  Service: {s.get('name', '?')} -> {s.get('uuid', '?')[:20]}")
    elif isinstance(data, dict):
        print(f"  Dict keys: {list(data.keys())}")
    else:
        print(f"  Type: {type(data)}")
except:
    print("  NOT JSON")

ssh.close()