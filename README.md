# WES FSM

WES Field Service Management application with:

- web workspace
- mobile APK
- Express API
- file-backed runtime data store

## Public Deploy From GitHub

This repository includes a ready-to-use [render.yaml](/C:/Users/Administrator/Documents/New%20project%204/render.yaml) for deploying the web app and API publicly from GitHub.

Quick path:

1. Push this repository to GitHub.
2. In Render, create a new `Blueprint`.
3. Connect the repo.
4. Set `WES_FSM_LOGIN_PASSWORD` when prompted.
5. Let Render generate `JWT_SECRET`.
6. Deploy and use the resulting public URL for both the browser app and the APK's `API Server` field.

Full guide:

- [DEPLOY_ANYWHERE.md](/C:/Users/Administrator/Documents/New%20project%204/docs/DEPLOY_ANYWHERE.md)

## Repository Safety

This repository is prepared for publishing:

- no `.env` files are committed
- no hardcoded login passwords are stored in the repo
- runtime secrets are expected to be set at deploy time
