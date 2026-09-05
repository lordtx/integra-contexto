#!/usr/bin/env python3
import subprocess, json

# Quick status check
r = subprocess.run("docker ps --filter name=integra --format '{{.Names}} {{.Status}}'", shell=True, capture_output=True, text=True, timeout=5)
print("Running:", r.stdout.strip() or "(none)")

r = subprocess.run("docker ps -a --filter name=integra --format '{{.Names}} {{.Status}}'", shell=True, capture_output=True, text=True, timeout=5)
print("All:", r.stdout.strip() or "(none)")

r = subprocess.run("docker images --format '{{.Repository}}:{{.Tag}}' | grep integra || echo 'no images'", shell=True, capture_output=True, text=True, timeout=5)
print("Images:", r.stdout.strip())