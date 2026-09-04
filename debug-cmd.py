#!/usr/bin/env python3
"""Debug: test curl command character by character"""
import paramiko, json

HOST = "187.127.48.130"
USER = "root"
PASS = "Arthvision@1"

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, username=USER, password=PASS, look_for_keys=False)

# Build the EXACT same command as in update-coolify.py
cmd = """TOK=$(cat /root/.cf_token); curl -s -X GET -H "Authorization: Bearer *** -H "Accept: application/json" http://127.0.0.1:8000/api/v1/services"""

print("CMD LENGTH:", len(cmd))
print("CMD REPR:")
for i, c in enumerate(cmd):
    print(f"  {i}: {repr(c)}")

_, o, e = ssh.exec_command(cmd, timeout=30)
out_bytes = o.read()
out = out_bytes.decode()
print(f"\nOUTPUT ({len(out)} chars):")
print(repr(out[:200]))
print(f"\nERR: {e.read().decode()[:200]}")
ssh.close()