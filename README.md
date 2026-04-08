# WES FSM

WES Field Service Management application with:

- web workspace
- mobile APK
- Express API
- file-backed runtime data store

## Public Deploy From GitHub

This repository includes a ready-to-use [render.yaml](/C:/Users/Administrator/Documents/New%20project%204/render.yaml) for deploying the web app and API publicly from GitHub.

One-click deploy:

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/PRONO2828/WES)

Quick path:

1. Push this repository to GitHub.
2. In Render, create a new `Blueprint`.
3. Connect the repo.
4. Set `WES_FSM_LOGIN_PASSWORD` when prompted.
5. Let Render generate `JWT_SECRET`.
6. Deploy and use the resulting public URL for both the browser app and the APK's `API Server` field.

Full guide:

- [DEPLOY_ANYWHERE.md](/C:/Users/Administrator/Documents/New%20project%204/docs/DEPLOY_ANYWHERE.md)

## Oracle Always Free Option

If you want a low-cost or free VM-based deployment instead of Render or Railway, use:

- [DEPLOY_ORACLE_ALWAYS_FREE.md](/C:/Users/Administrator/Documents/New%20project%204/docs/DEPLOY_ORACLE_ALWAYS_FREE.md)

Helper scripts for the Oracle VM:

- [run-wes-fsm.sh](/C:/Users/Administrator/Documents/New%20project%204/deploy/oracle/run-wes-fsm.sh)
- [update-wes-fsm.sh](/C:/Users/Administrator/Documents/New%20project%204/deploy/oracle/update-wes-fsm.sh)

## Cloudflare Tunnel Option

If you want a no-card way to share the app from this PC immediately, use:

- [DEPLOY_CLOUDFLARE_TUNNEL.md](/C:/Users/Administrator/Documents/New%20project%204/docs/DEPLOY_CLOUDFLARE_TUNNEL.md)

Windows helper scripts:

- [start-local-wes-fsm.ps1](/C:/Users/Administrator/Documents/New%20project%204/deploy/cloudflare/start-local-wes-fsm.ps1)
- [start-quick-tunnel.ps1](/C:/Users/Administrator/Documents/New%20project%204/deploy/cloudflare/start-quick-tunnel.ps1)
- [start-public-share.ps1](/C:/Users/Administrator/Documents/New%20project%204/deploy/cloudflare/start-public-share.ps1)
- [stop-public-share.ps1](/C:/Users/Administrator/Documents/New%20project%204/deploy/cloudflare/stop-public-share.ps1)

## Repository Safety

This repository is prepared for publishing:

- no `.env` files are committed
- no hardcoded login passwords are stored in the repo
- runtime secrets are expected to be set at deploy time
