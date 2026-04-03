import { spawn } from "node:child_process";

const npmExecPath = process.env.npm_execpath;

if (!npmExecPath) {
  console.error("npm_execpath is not available. Run this script through `npm run dev`.");
  process.exit(1);
}

const nodePath = process.execPath;
const children = [];
let closed = false;

function runWorkspace(workspace) {
  const child = spawn(nodePath, [npmExecPath, "run", "dev", "--workspace", workspace], {
    stdio: "inherit",
    env: process.env
  });

  child.on("exit", (code) => {
    if (closed) {
      return;
    }

    closed = true;
    children.forEach((entry) => {
      if (entry !== child && !entry.killed) {
        entry.kill("SIGINT");
      }
    });
    process.exit(code ?? 0);
  });

  children.push(child);
}

runWorkspace("server");
runWorkspace("client");

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    if (closed) {
      return;
    }

    closed = true;
    children.forEach((child) => {
      if (!child.killed) {
        child.kill("SIGINT");
      }
    });
    process.exit(0);
  });
}
