const http = require("http");
const fs = require("fs");
const path = require("path");

const port = Number(process.env.WES_MAP_PORT || 5512);
const host = "127.0.0.1";
const pdfName = "WES-FSM-Development-Map.pdf";
const pdfPath = path.join(__dirname, pdfName);

function send(res, status, headers, body) {
  res.writeHead(status, headers);
  res.end(body);
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url || "/", `http://${host}:${port}`);

  if (url.pathname === "/health") {
    send(
      res,
      200,
      { "Content-Type": "application/json; charset=utf-8" },
      JSON.stringify({ ok: true, port, pdfName })
    );
    return;
  }

  if (url.pathname === `/${pdfName}`) {
    fs.readFile(pdfPath, (error, buffer) => {
      if (error) {
        send(res, 404, { "Content-Type": "text/plain; charset=utf-8" }, "PDF not found");
        return;
      }

      send(
        res,
        200,
        {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${pdfName}"`,
          "Content-Length": buffer.length
        },
        buffer
      );
    });
    return;
  }

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>WES FSM PDF Download</title>
    <style>
      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        background: linear-gradient(180deg, #0d1823 0%, #102030 100%);
        color: #edf5f9;
        font-family: "Segoe UI", Arial, sans-serif;
      }
      .card {
        width: min(560px, calc(100vw - 32px));
        padding: 28px;
        border-radius: 24px;
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid rgba(255, 255, 255, 0.12);
      }
      h1 {
        margin: 0 0 10px;
        font-size: 28px;
      }
      p {
        margin: 0 0 18px;
        color: #9eb2c2;
        line-height: 1.5;
      }
      a {
        display: inline-block;
        padding: 12px 18px;
        border-radius: 999px;
        background: #f3a33b;
        color: #10202f;
        font-weight: 700;
        text-decoration: none;
      }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>WES FSM Development Map</h1>
      <p>Use the button below to download the printable A4 PDF.</p>
      <a href="/${pdfName}">Download PDF</a>
    </div>
  </body>
</html>`;

  send(res, 200, { "Content-Type": "text/html; charset=utf-8" }, html);
});

server.listen(port, host, () => {
  console.log(`WES FSM PDF download server listening on http://${host}:${port}`);
});
