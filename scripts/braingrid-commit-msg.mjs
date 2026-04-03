/**
 * Git commit-msg: valida rodapé BG-* antes de aceitar o commit.
 * Só valida se existir BG-TASK ou BG-REQ.
 */

import { readFileSync } from "node:fs";

const VALID_STATUSES = new Set([
  "PLANNED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
]);

function parseFooter(message) {
  const lines = message.split(/\r?\n/);
  let req = null;
  let task = null;
  let status = null;

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
  const path = process.argv[2];
  if (!path) {
    process.exit(0);
  }

  let message;
  try {
    message = readFileSync(path, "utf8");
  } catch {
    process.exit(0);
  }

  const { req, task, status } = parseFooter(message);

  if (!task && !req) {
    process.exit(0);
  }

  if (task && !req) {
    console.error(
      "commit-msg: com BG-TASK é obrigatório BG-REQ (ex.: BG-REQ: REQ-1)"
    );
    process.exit(1);
  }

  if (status && !VALID_STATUSES.has(status)) {
    console.error(
      `commit-msg: BG-TASK-STATUS inválido "${status}". Valores: ${[
        ...VALID_STATUSES,
      ].join(", ")}`
    );
    process.exit(1);
  }

  process.exit(0);
}

main();
