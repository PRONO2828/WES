# WES FSM On Oracle Cloud Always Free

This is the lowest-cost path for running WES FSM from anywhere while keeping records on disk.

Recommended setup:

- one Ubuntu VM on Oracle Cloud Always Free
- Docker running the existing WES FSM app from this repository
- persistent host storage mapped to `/app/database`

That gives you:

- public access from anywhere
- one backend URL for both the browser app and phone APK
- jobs, reports, and user activity kept on the VM disk across restarts

## What To Create In Oracle

In the Oracle Cloud console, create:

1. A `Compute` instance
2. Shape: `VM.Standard.E2.1.Micro` if it shows `Always Free Eligible`
3. Image: Ubuntu LTS
4. A public IPv4 address
5. A VCN/subnet created automatically if you do not already have one
6. Your SSH public key so you can log in

Why this shape:

- it is x86, which avoids architecture surprises
- it is simple for Docker and Node-based apps

## Open The App Port

After the VM is created, open inbound TCP port `4000` in the subnet security list or network security group.

Minimum inbound rules:

- TCP `22` for SSH
- TCP `4000` for WES FSM

If you later add a reverse proxy and HTTPS, also open:

- TCP `80`
- TCP `443`

## Connect To The Server

From your own computer:

```bash
ssh ubuntu@YOUR_PUBLIC_IP
```

## Install Git And Docker On Ubuntu

On the Oracle VM:

```bash
sudo apt update
sudo apt install -y git docker.io
sudo systemctl enable --now docker
sudo usermod -aG docker "$USER"
```

Then sign out and sign back in once so Docker works without `sudo`.

## Download The Project

On the Oracle VM:

```bash
git clone https://github.com/PRONO2828/WES.git
cd WES
```

## Set Runtime Secrets On The Server

Create a local file on the server only. Do not commit it to GitHub.

```bash
cat > ~/wes-fsm-secrets.sh <<'EOF'
export JWT_SECRET='replace-with-a-random-secret'
export WES_FSM_LOGIN_PASSWORD='replace-with-your-login-password'
EOF
chmod 600 ~/wes-fsm-secrets.sh
source ~/wes-fsm-secrets.sh
```

You can generate a random JWT secret with:

```bash
openssl rand -hex 32
```

## Start WES FSM

This repository includes a helper script:

- [run-wes-fsm.sh](/C:/Users/Administrator/Documents/New%20project%204/deploy/oracle/run-wes-fsm.sh)

Run:

```bash
cd ~/WES
source ~/wes-fsm-secrets.sh
bash deploy/oracle/run-wes-fsm.sh
```

What it does:

- builds the Docker image from this repo
- creates a persistent host folder at `~/wes-fsm-data`
- copies the current JSON data store there the first time
- runs the container with `--restart unless-stopped`
- mounts `~/wes-fsm-data` into `/app/database`

## Check That It Is Working

From the server:

```bash
curl http://127.0.0.1:4000/api/health
```

From any phone or browser:

```text
http://YOUR_PUBLIC_IP:4000/
```

API base for the APK:

```text
http://YOUR_PUBLIC_IP:4000/api
```

## Updating Later Without Losing Records

This repository also includes:

- [update-wes-fsm.sh](/C:/Users/Administrator/Documents/New%20project%204/deploy/oracle/update-wes-fsm.sh)

Run:

```bash
cd ~/WES
source ~/wes-fsm-secrets.sh
bash deploy/oracle/update-wes-fsm.sh
```

That pulls the latest GitHub code and restarts the container while keeping the data in `~/wes-fsm-data`.

## Where Your Data Lives

Runtime records are stored on the VM host at:

```text
~/wes-fsm-data/wes-fsm-store.json
```

Inside the container, that maps to:

```text
/app/database/wes-fsm-store.json
```

As long as you keep the Oracle VM and its disk, your records remain available.

## Important Note About Always Free

Oracle documents Always Free compute resources as always-free eligible, but free compute capacity can still have platform limits and availability constraints. If your instance is stopped or removed, data stored only on that VM can be lost unless you keep backups.

For extra safety, copy `~/wes-fsm-data/wes-fsm-store.json` somewhere else occasionally.

## Official References

- Oracle Free Tier: https://www.oracle.com/cloud/free/
- Oracle Always Free resources: https://docs.oracle.com/en-us/iaas/Content/FreeTier/freetier_topic-Always_Free_Resources.htm
- OCI compute instances: https://docs.oracle.com/en-us/iaas/Content/Compute/home.htm

