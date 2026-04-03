# WES FSM Anywhere Deployment

Your current APK works only when it can reach a laptop-hosted API or another reachable server.

To let users sign in from anywhere, the API must be reachable on the public internet.

## What Was Prepared

- The Express server can now serve both:
  - the WES FSM web app
  - the `/api` backend
- A root [Dockerfile](/C:/Users/Administrator/Documents/New%20project%204/Dockerfile) was added so the whole app can be deployed as one container.

## Production Environment

Set these variables in your server shell, process manager, or cloud host dashboard. Do not commit them to this repository.

```text
PORT=4000
JWT_SECRET=<generate-a-random-secret-at-deploy-time>
WES_FSM_LOGIN_PASSWORD=<set-a-workspace-login-password-at-deploy-time>
CLIENT_ORIGIN=https://your-public-domain.example
STATIC_ROOT=/app
```

## Docker Deploy

Build:

```bash
docker build -t wes-fsm-anywhere .
```

Run:

```bash
docker run -d --name wes-fsm -p 4000:4000 \
  -e PORT=4000 \
  -e JWT_SECRET=<generate-a-random-secret-at-deploy-time> \
  -e WES_FSM_LOGIN_PASSWORD=<set-a-workspace-login-password-at-deploy-time> \
  -e CLIENT_ORIGIN=https://your-public-domain.example \
  -e STATIC_ROOT=/app \
  wes-fsm-anywhere
```

If you want the data file to survive container replacement, mount the database folder:

```bash
docker run -d --name wes-fsm -p 4000:4000 \
  -e PORT=4000 \
  -e JWT_SECRET=<generate-a-random-secret-at-deploy-time> \
  -e WES_FSM_LOGIN_PASSWORD=<set-a-workspace-login-password-at-deploy-time> \
  -e CLIENT_ORIGIN=https://your-public-domain.example \
  -e STATIC_ROOT=/app \
  -v /your-server-path/database:/app/database \
  wes-fsm-anywhere
```

## Public URLs After Deploy

If you deploy to:

`https://wesfsm.example.com`

then:

- Web app:
  `https://wesfsm.example.com`
- API:
  `https://wesfsm.example.com/api`

## APK / Phone Use

The current APK login screen already has an `API Server` field.

Enter:

`https://wesfsm.example.com/api`

and it will be stored on the device.

If you want a new APK with the public API URL prefilled, update:

- [mobile-config.js](/C:/Users/Administrator/Documents/New%20project%204/mobile-config.js)
- [mobile-config.js](/C:/Users/Administrator/Documents/New%20project%204/client/android/app/src/main/assets/public/mobile-config.js)

Replace the office IP with your public API URL:

```js
window.WES_RUNTIME_CONFIG = {
  apiBaseUrl: "https://wesfsm.example.com/api"
};
```

Then rebuild the APK.

## Important Limitation

Without a public host, no APK can truly work "from anywhere".

The APK is already capable of working anywhere, but only if its backend is deployed publicly instead of running on your laptop.
