import http from "http";
import { appendFile, mkdir, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const assetsDir = path.join(__dirname, "assets");
const eventLogPath = path.join(__dirname, "capture-events.log");
const port = Number(process.env.CAPTURE_PORT || 4011);

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS, GET"
  });
  res.end(JSON.stringify(payload));
}

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    sendJson(res, 200, { ok: true });
    return;
  }

  if (req.method === "GET" && req.url === "/health") {
    sendJson(res, 200, { ok: true, port, assetsDir });
    return;
  }

  if (req.method === "POST" && req.url === "/event") {
    try {
      const chunks = [];
      for await (const chunk of req) {
        chunks.push(chunk);
      }
      const payload = JSON.parse(Buffer.concat(chunks).toString("utf8"));
      const line = `[${new Date().toISOString()}] ${String(payload.message || "event")} ${payload.detail ? JSON.stringify(payload.detail) : ""}\n`;
      await appendFile(eventLogPath, line, "utf8");
      sendJson(res, 200, { ok: true });
    } catch (error) {
      sendJson(res, 500, {
        ok: false,
        error: error instanceof Error ? error.message : "Event log error"
      });
    }
    return;
  }

  if (req.method !== "POST" || req.url !== "/capture") {
    sendJson(res, 404, { ok: false, error: "Not found" });
    return;
  }

  try {
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const payload = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    const name = String(payload.name || "").replace(/[^a-z0-9._-]/gi, "_");
    const dataUrl = String(payload.dataUrl || "");
    if (!name || !dataUrl.startsWith("data:image/png;base64,")) {
      sendJson(res, 400, { ok: false, error: "Invalid capture payload" });
      return;
    }

    const buffer = Buffer.from(dataUrl.replace(/^data:image\/png;base64,/, ""), "base64");
    await mkdir(assetsDir, { recursive: true });
    const filePath = path.join(assetsDir, name);
    await writeFile(filePath, buffer);
    sendJson(res, 200, {
      ok: true,
      filePath,
      size: buffer.length
    });
  } catch (error) {
    sendJson(res, 500, {
      ok: false,
      error: error instanceof Error ? error.message : "Capture server error"
    });
  }
});

server.listen(port, () => {
  console.log(`WES presentation capture server listening on http://127.0.0.1:${port}`);
});
