#!/usr/bin/env python3
"""Run deploy script in background and poll"""
import paramiko, time

h = '187.127.48.130'
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(h, username='root', password='Arthvision@1', look_for_keys=False)

# Kill any previous run
ssh.exec_command("pkill -f create-apps2.py 2>/dev/null; echo ok", timeout=5)

# Start fresh
_, _, _ = ssh.exec_command("nohup python3 /tmp/create-apps2.py > /tmp/apps-log.txt 2>&1 & echo PID=$!", timeout=10)
time.sleep(3)

# Poll log
for i in range(8):  # 2 min total
    time.sleep(15)
    _, o, _ = ssh.exec_command("cat /tmp/apps-log.txt 2>/dev/null | tail -20", timeout=5)
    log = o.read().decode().strip()
    if log:
        print(f"[+{i*15+15}s] {log[:400]}")
    # Check if still running
    _, o2, _ = ssh.exec_command("pgrep -f create-apps2.py || echo 'DONE'", timeout=5)
    if 'DONE' in o2.read().decode().strip():
        print("=== Process finished ===")
        break

# Final output
_, o, _ = ssh.exec_command("cat /tmp/apps-log.txt", timeout=10)
print('\n=== FULL LOG ===')
print(o.read().decode()[:3000])
ssh.close()