FROM node:20-alpine

WORKDIR /app

COPY package.json ./
COPY server/package.json ./server/package.json
COPY server ./server
COPY assets ./assets
COPY database ./database
COPY index.html ./
COPY manifest.webmanifest ./
COPY favicon-32.png ./
COPY apple-touch-icon.png ./
COPY mobile-config.js ./
COPY sw.js ./
COPY wes-icon-192.png ./
COPY wes-icon-512.png ./
COPY wes-logo.png ./
COPY wes-logo.svg ./
COPY cordova.js ./
COPY cordova_plugins.js ./

RUN npm install --workspace server --omit=dev

ENV NODE_ENV=production
ENV PORT=4000
ENV STATIC_ROOT=/app

EXPOSE 4000

CMD ["npm", "run", "start", "--workspace", "server"]
