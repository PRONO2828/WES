# WES FSM Anywhere Deployment

The APK can work from anywhere once the WES FSM backend is hosted on a public URL instead of your laptop.

This repository is already prepared for that:

- the Express server serves both the WES FSM web app and the `/api` backend
- the root [Dockerfile](/C:/Users/Administrator/Documents/New%20project%204/Dockerfile) can deploy the whole app as one service
- the new [render.yaml](/C:/Users/Administrator/Documents/New%20project%204/render.yaml) lets Render create the service directly from GitHub

## Fastest Path: GitHub -> Render

1. Push this repository to GitHub.
2. In Render, choose `New` -> `Blueprint`.
3. Connect the GitHub repository that contains this project.
4. Render will detect [render.yaml](/C:/Users/Administrator/Documents/New%20project%204/render.yaml).
5. When prompted, set `WES_FSM_LOGIN_PASSWORD`.
6. Let Render generate `JWT_SECRET`.
7. Finish the first deploy and wait for the health check at `/api/health` to pass.

After deploy, Render gives you a public URL such as:

`https://wes-fsm.onrender.com`

Then:

- web app: `https://wes-fsm.onrender.com`
- API: `https://wes-fsm.onrender.com/api`

## Render Settings Used By This Repo

The Render blueprint provisions:

- one public web service
- Docker-based deploy from this repository
- persistent storage mounted at `/app/database`
- automatic redeploys when you push to the default Git branch

The persistent disk matters because Render's default filesystem is ephemeral and would otherwise lose your runtime data on redeploy.

## Environment Variables

These are the runtime variables this app expects:

```text
PORT=4000
STATIC_ROOT=/app
JWT_SECRET=<generate-at-deploy-time>
WES_FSM_LOGIN_PASSWORD=<set-at-deploy-time>
```

`CLIENT_ORIGIN` is optional. If you leave it unset, the API accepts browser and installed-app requests from any origin. That is the simplest setup for public phone access. If you later want to restrict CORS, set it to your web domain and keep in mind that installed mobile apps may also need `http://localhost`, `https://localhost`, `capacitor://localhost`, or `ionic://localhost`.

## APK / Phone Use

The current APK already has an `API Server` field on the login screen.

After the public deploy is live, enter:

`https://wes-fsm.onrender.com/api`

or your custom domain equivalent:

`https://wesfsm.example.com/api`

That value is stored on the phone, so the APK will work away from your laptop and office Wi-Fi.

## Optional: Pre-Fill The Public API In A New APK

If you want a new APK that already points to the public API, update:

- [mobile-config.js](/C:/Users/Administrator/Documents/New%20project%204/mobile-config.js)
- [mobile-config.js](/C:/Users/Administrator/Documents/New%20project%204/client/android/app/src/main/assets/public/mobile-config.js)

Use:

```js
window.WES_RUNTIME_CONFIG = {
  apiBaseUrl: "https://wes-fsm.onrender.com/api"
};
```

Then rebuild the APK and upload that rebuilt APK to GitHub.

## Manual Docker Deploy

If you prefer another host that supports Docker, the same repo can be run with:

```bash
docker build -t wes-fsm-anywhere .
docker run -d --name wes-fsm -p 4000:4000 \
  -e PORT=4000 \
  -e STATIC_ROOT=/app \
  -e JWT_SECRET=<generate-at-deploy-time> \
  -e WES_FSM_LOGIN_PASSWORD=<set-at-deploy-time> \
  -v /your-server-path/database:/app/database \
  wes-fsm-anywhere
```

## Official References

- Render deploys: [https://render.com/docs/deploys/](https://render.com/docs/deploys/)
- Render web services: [https://render.com/docs/web-services](https://render.com/docs/web-services)
- Render blueprints: [https://render.com/docs/blueprint-spec](https://render.com/docs/blueprint-spec)
- Render persistent disks: [https://render.com/docs/disks](https://render.com/docs/disks)
