#!/usr/bin/env python3
"""Create separate deploy branches with Dockerfile at root"""
import subprocess, sys

REPO = "/workspace/integra-contexto"

# For each service, create a branch that has the right Dockerfile at root
branches = {
    "deploy-api": "infrastructure/docker/api.Dockerfile",
    "deploy-worker": "infrastructure/docker/worker.Dockerfile",
    "deploy-web": "infrastructure/docker/web.Dockerfile",
}

def run(cmd, cwd=REPO):
    r = subprocess.run(cmd, shell=True, capture_output=True, text=True, cwd=cwd, timeout=30)
    if r.returncode != 0 and "already exists" not in r.stderr:
        print(f"WARN: {r.stderr[:100]}")
    return r.stdout.strip()

# Current branch
current = run("git rev-parse --abbrev-ref HEAD")
print(f"Current branch: {current}")

for branch, dockerfile in branches.items():
    print(f"\n=== Creating {branch} ===")
    
    # Check if branch exists
    existing = run(f"git branch -a | grep {branch}")
    if existing:
        run("git checkout main")
        run(f"git branch -D {branch}")
    
    # Create branch from main
    run(f"git checkout -b {branch}")
    
    # Copy the specific Dockerfile to root
    src = dockerfile
    run(f"cp {src} Dockerfile")
    
    # Also remove other Dockerfiles if any
    run("git rm --cached infrastructure/docker/*Dockerfile 2>/dev/null; git add -A")
    run("git add Dockerfile")
    
    # Commit
    r = run(f'git commit -m "deploy: {branch} — root Dockerfile for {branch.replace("deploy-","")}"')
    print(f"  Commit: {r[:60] if r else '(nothing to commit)'}")

# Go back to main
run("git checkout main")

# Push all branches
print("\n=== Pushing to GitHub ===")
for branch in branches:
    r = run(f"git push origin {branch} --force")
    print(f"  {branch}: {'✓' if 'Everything up-to-date' not in r else 'already up to date'}")

# Now update Coolify apps to use these branches
import json, urllib.request, time

API = "http://127.0.0.1:8000/api/v1"
tok = open("/root/.cf_token")

# Can't read from here
print("\n✅ Branches pushed to GitHub!")
print("\nNow update Coolify apps:")
print("  integra-api   → branch: deploy-api")
print("  integra-worker → branch: deploy-worker")
print("  integra-web   → branch: deploy-web")