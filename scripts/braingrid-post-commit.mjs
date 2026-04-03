/**
 * Git post-commit: lê a mensagem do último commit e, se existir BG-TASK,
 * executa `braingrid task update`.
 *
 * Variáveis: BRAINGRID_HOOK_DISABLE, BRAINGRID_HOOK_DRY_RUN
 */

import { execFileSync, execSync } from "node:child_process";

const VALID_STATUSES = new Set([
  "PLANNED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
]);

function getRepoRoot() {
  try {
    return execSync("git rev-parse --show-toplevel", {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    }).trim();
  } catch {
    return process.cwd();
  }
}

function getLastCommitMessage(cwd) {
  return execSync("git log -1 --format=%B", {
    encoding: "utf8",
    cwd,
    stdio: ["ignore", "pipe", "pipe"],
  });
}

function parseFooter(message) {
  const lines = message.split(/\r?\n/);
  let req = null;
  let task = null;
  let status = "COMPLETED";

  const reReq = /^\s*BG-REQ:\s*(.+?)\s*$/i;
  const reTask = /^\s*BG-TASK:\s*(.+?)\s*$/i;
  const reStatus = /^\s*BG-TASK-STATUS:\s*(.+?)\s*$/i;

  for (const line of lines) {
    const mReq = line.match(reReq);
    if (mReq) req = mReq[1].trim();

    const mTask = line.match(reTask);
    if (mTask) task = mTask[1].trim();

    const mStatus = line.match(reStatus);
    if (mStatus) status = mStatus[1].trim().toUpperCase();
  }

  return { req, task, status };
}

function main() {
  if (process.env.BRAINGRID_HOOK_DISABLE === "1") {
    return;
  }

  const cwd = getRepoRoot();
  let message;
  try {
    message = getLastCommitMessage(cwd);
  } catch (e) {
    console.error("[braingrid-hook] Falha ao ler o último commit:", e.message);
    return;
  }

  const { req, task, status } = parseFooter(message);

  if (!task) {
    return;
  }

  if (!req) {
    console.error(
      "[braingrid-hook] BG-TASK presente mas falta BG-REQ na mensagem de commit."
    );
    return;
  }

  if (!VALID_STATUSES.has(status)) {
    console.error(
      `[braingrid-hook] BG-TASK-STATUS inválido: "${status}". Use: ${[
        ...VALID_STATUSES,
      ].join(", ")}`
    );
    return;
  }

  const args = [
    "task",
    "update",
    task,
    "-r",
    req,
    "--status",
    status,
  ];

  const dry = process.env.BRAINGRID_HOOK_DRY_RUN === "1";
  const cmd = ["braingrid", ...args].join(" ");

  if (dry) {
    console.log(`[braingrid-hook] dry-run: ${cmd}`);
    return;
  }

  try {
    execFileSync("braingrid", args, {
      cwd,
      stdio: "inherit",
      env: process.env,
    });
  } catch (e) {
    console.error(
      "[braingrid-hook] braingrid falhou (commit não foi revertido):",
      e.message || e
    );
  }
}

main();
