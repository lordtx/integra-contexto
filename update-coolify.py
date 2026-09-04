#!/usr/bin/env python3
"""Update Coolify service — direct working curl commands"""
import paramiko, json, time, sys

HOST = "187.127.48.130"
USER = "root"
PASS = "Arthvision@1"

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, username=USER, password=PASS, look_for_keys=False)
sftp = ssh.open_sftp()

def run(cmd):
    _, o, e = ssh.exec_command(cmd, timeout=60)
    return o.read().decode().strip(), e.read().decode().strip()

# 1. List services
print("=== 1. Services ===")
out, _ = run("""TOK=$(cat /root/.cf_token); curl -s -X GET -H "Authorization: Bearer *** -H "Accept: application/json" http://127.0.0.1:8000/api/v1/services""")
try:
    svcs = json.loads(out)
except:
    print(f"FAIL: {out[:300]}")
    sys.exit(1)

svc_uuid = None
for s in svcs:
    n = s.get("name", "")
    print(f"  {n}")
    if "integra" in n.lower():
        svc_uuid = s["uuid"]

if not svc_uuid:
    print("NOT FOUND")
    sys.exit(1)
print(f"UUID: {svc_uuid}")

# 2. Read compose, fix defaults, write payload
print("\n=== 2. Payload ===")
with open("/workspace/integra-contexto/docker-compose.yml") as f:
    compose = f.read()
for old, new in [
    ("${POSTGRES_PORT:-5433}", "5433"),
    ("${REDIS_PORT:-6380}", "6380"),
    ("${API_PORT:-3001}", "3001"),
    ("${WEB_PORT:-3000}", "3000"),
    ("${POSTGRES_DB:-integra_contexto}", "integra_contexto"),
    ("${POSTGRES_USER:-integra}", "integra"),
]:
    compose = compose.replace(old, new)

payload = json.dumps({"docker_compose_raw": compose})
with sftp.open("/tmp/patch.json", "w") as f:
    f.write(payload)
print(f"Payload: {len(payload)} bytes")

# 3. PATCH
print(f"\n=== 3. PATCH ===")
out, _ = run(f"""TOK=$(cat /root/.cf_token); curl -s -X PATCH -H "Authorization: Bearer *** -H "Accept: application/json" -H "Content-Type: application/json" --data-binary @/tmp/patch.json http://127.0.0.1:8000/api/v1/services/{svc_uuid}""")
print(f"Response: {out[:300]}")

# 4. Verify
print(f"\n=== 4. Verify ===")
out, _ = run(f"""TOK=$(cat /root/.cf_token); curl -s -X GET -H "Authorization: Bearer *** -H "Accept: application/json" http://127.0.0.1:8000/api/v1/services/{svc_uuid}""")
try:
    svc = json.loads(out)
    raw = svc.get("docker_compose_raw", "")
    print(f"  web.Dockerfile: {'✅' if 'web.Dockerfile' in raw else '❌'}")
    print(f"  api.Dockerfile: {'✅' if 'api.Dockerfile' in raw else '❌'}")
    print(f"  Size: {len(raw)}")
except:
    print(f"FAIL: {out[:300]}")

# 5. Envs — delete existing + create new
print(f"\n=== 5. Envs ===")
envs = {
    "POSTGRES_PASSWORD": "%(P3st3r)_{C0nt3xt0}!",
    "REDIS_PASSWORD": "%(R3d1s)_C0nt3xt0!#",
    "NEXT_PUBLIC_API_URL": "https://api.dtxnet.top",
    "NEXT_PUBLIC_WS_URL": "wss://ws.dtxnet.top",
}

out, _ = run(f"""TOK=$(cat /root/.cf_token); curl -s -X GET -H "Authorization: Bearer *** -H "Accept: application/json" http://127.0.0.1:8000/api/v1/services/{svc_uuid}/envs""")
try:
    existing = json.loads(out)
    for env in existing:
        k = env.get("key", "")
        if k in envs:
            euuid = env.get("uuid")
            if euuid:
                run(f"""TOK=$(cat /root/.cf_token); curl -s -X DELETE -H "Authorization: Bearer *** http://127.0.0.1:8000/api/v1/services/{svc_uuid}/envs/{euuid}""")
                time.sleep(2)
except:
    pass

for k, v in envs.items():
    payload = json.dumps({"key": k, "value": v})
    with sftp.open(f"/tmp/env-{k}.json", "w") as f:
        f.write(payload)
    out, _ = run(f"""TOK=$(cat /root/.cf_token); curl -s -X POST -H "Authorization: Bearer *** -H "Accept: application/json" -H "Content-Type: application/json" --data-binary @/tmp/env-{k}.json http://127.0.0.1:8000/api/v1/services/{svc_uuid}/envs""")
    print(f"  {k}: {out[:80]}")
    time.sleep(2)

# 6. Deploy
print(f"\n=== 6. Deploy ===")
dep = json.dumps({"uuid": svc_uuid})
with sftp.open("/tmp/deploy.json", "w") as f:
    f.write(dep)
out, _ = run(f"""TOK=$(cat /root/.cf_token); curl -s -X POST -H "Authorization: Bearer *** -H "Accept: application/json" -H "Content-Type: application/json" --data-binary @/tmp/deploy.json http://127.0.0.1:8000/api/v1/deploy""")
print(f"Deploy: {out}")

# 7. Remove old containers
svc_short = svc_uuid[:12]
run(f"docker rm -f $(docker ps -a -q --filter name='{svc_short}') 2>/dev/null; echo ok")

sftp.close()
ssh.close()
print("\n✅ Done! Check server.dtxnet.top")