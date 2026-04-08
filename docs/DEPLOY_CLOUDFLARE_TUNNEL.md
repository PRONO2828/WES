# WES FSM Via Cloudflare Tunnel

This is the fastest no-card way to let users far away open WES FSM through the internet.

Recommended use:

- use a Cloudflare **Quick Tunnel** first
- keep the WES FSM server running on this PC
- share the generated public URL with users

How it works:

- WES FSM runs locally on port `4000`
- `cloudflared` creates an outbound tunnel from this PC to Cloudflare
- users open the public `trycloudflare.com` URL

## Important Limits

This path is good for immediate access, but it is not the same as a real always-on cloud server.

The tunnel only works while:

- this PC is powered on
- this PC stays connected to the internet
- WES FSM is running locally
- `cloudflared` is still running

If the PC shuts down, sleeps, or loses internet, far-away users will stop being able to use the app until it comes back.

Also:

- Quick Tunnel URLs are temporary
- the public URL changes when you start a new quick tunnel

For a stable long-term setup, later you can move to a named tunnel with your own domain in Cloudflare.

## What This Repo Includes

Helper scripts:

- [start-local-wes-fsm.ps1](/C:/Users/Administrator/Documents/New%20project%204/deploy/cloudflare/start-local-wes-fsm.ps1)
- [start-quick-tunnel.ps1](/C:/Users/Administrator/Documents/New%20project%204/deploy/cloudflare/start-quick-tunnel.ps1)
- [start-public-share.ps1](/C:/Users/Administrator/Documents/New%20project%204/deploy/cloudflare/start-public-share.ps1)
- [stop-public-share.ps1](/C:/Users/Administrator/Documents/New%20project%204/deploy/cloudflare/stop-public-share.ps1)

## 1. Start WES FSM Locally

Run:

```powershell
powershell -ExecutionPolicy Bypass -File .\deploy\cloudflare\start-local-wes-fsm.ps1
```

That starts the WES FSM server on:

```text
http://127.0.0.1:4000/
```

The server also exposes:

```text
http://127.0.0.1:4000/api/health
```

## 2. Start A Quick Tunnel

Run:

```powershell
powershell -ExecutionPolicy Bypass -File .\deploy\cloudflare\start-quick-tunnel.ps1
```

That starts:

```text
cloudflared tunnel --url http://localhost:4000
```

Cloudflare will print a public URL similar to:

```text
https://random-name.trycloudflare.com
```

## One-Command Start

If you want the repo to launch both the local WES FSM server and the quick tunnel for you, run:

```powershell
powershell -ExecutionPolicy Bypass -File .\deploy\cloudflare\start-public-share.ps1
```

That script:

- starts the WES FSM server on port `4000`
- generates a runtime JWT secret
- generates a temporary login password if you do not pass one
- starts the Cloudflare quick tunnel
- prints the public URL and the APK API URL

To stop both later:

```powershell
powershell -ExecutionPolicy Bypass -File .\deploy\cloudflare\stop-public-share.ps1
```

## 3. Share The Public URL

Share that exact URL with users.

Because WES FSM serves both the frontend and the API from the same local service, users only need the single public URL.

Example:

```text
https://random-name.trycloudflare.com
```

APK/API field:

```text
https://random-name.trycloudflare.com/api
```

## 4. Keep The Session Alive

Leave both windows running:

- the WES FSM server window
- the `cloudflared` tunnel window

Do not close them while users are using the app.

## Optional Next Step

If you later add a domain to Cloudflare, we can switch from a temporary quick tunnel to:

- a named tunnel
- a stable hostname like `https://fsm.yourdomain.com`

## Official References

- Cloudflare Tunnel overview: https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/
- Cloudflare Tunnel setup: https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/get-started/
- Quick tunnels: https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/do-more-with-tunnels/trycloudflare/
