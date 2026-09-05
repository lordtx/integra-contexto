#!/usr/bin/env python3
import json, urllib.request

tok = open("/root/.cf_token").read().strip()
r = urllib.request.Request("http://127.0.0.1:8000/api/v1/services")
r.add_header("Authorization", "Bearer " + tok)
r.add_header("Accept", "application/json")
svcs = json.loads(urllib.request.urlopen(r, timeout=15).read().decode())
for s in svcs:
    print(f"{s['name']:25s} -> {s['uuid'][:12]}...")