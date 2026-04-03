const http = require("http");
const fs = require("fs");
const path = require("path");

const port = Number(process.env.PORT || 5513);
const rootDir = path.join(__dirname, "android", "app", "src", "main", "assets", "public");

const mimeTypes = {
  ".apk": "application/vnd.android.package-archive",
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".manifest": "text/cache-manifest; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
};

function send(res, statusCode, body, contentType = "text/plain; charset=utf-8") {
  res.writeHead(statusCode, {
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": "no-store",
    "Content-Type": contentType,
  });
  res.end(body);
}

function resolvePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  const clean = decoded === "/" ? "/index.html" : decoded;
  const relativePath = clean.replace(/^\/+/, "");
  const fullPath = path.normalize(path.join(rootDir, relativePath));
  if (!fullPath.startsWith(rootDir)) {
    return null;
  }
  return fullPath;
}

const server = http.createServer((req, res) => {
  if (req.url === "/health") {
    return send(
      res,
      200,
      JSON.stringify({ ok: true, port, rootDir }),
      "application/json; charset=utf-8"
    );
  }

  const filePath = resolvePath(req.url || "/");
  if (!filePath) {
    return send(res, 403, "Forbidden");
  }

  fs.stat(filePath, (statError, stat) => {
    if (statError) {
      return send(res, 404, "Not found");
    }

    const targetPath = stat.isDirectory() ? path.join(filePath, "index.html") : filePath;
    fs.readFile(targetPath, (readError, data) => {
      if (readError) {
        return send(res, 404, "Not found");
      }

      const extension = path.extname(targetPath).toLowerCase();
      const contentType = mimeTypes[extension] || "application/octet-stream";
      res.writeHead(200, {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-store",
        "Content-Type": contentType,
      });
      res.end(data);
    });
  });
});

server.listen(port, "0.0.0.0", () => {
  console.log(`WES phone build server listening on http://0.0.0.0:${port}`);
  console.log(`Serving ${rootDir}`);
});
