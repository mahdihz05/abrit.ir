#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const checklistPath = path.join(root, "01_STARTER_V1_EXECUTION_CHECKLIST.md");
const outputPath = path.join(root, "09_PROJECT_PROGRESS.md");

const weights = {
  0: 2, 1: 5, 2: 5, 3: 4, 4: 6, 5: 4, 6: 7, 7: 4, 8: 6, 9: 5,
  10: 5, 11: 4, 12: 6, 13: 4, 14: 4, 15: 7, 16: 5, 17: 7, 18: 4,
  19: 2, 20: 3, 21: 1,
};

if (Object.values(weights).reduce((a,b) => a+b, 0) !== 100) {
  throw new Error("Phase weights do not sum to 100.");
}
if (!fs.existsSync(checklistPath)) {
  throw new Error(`Missing ${checklistPath}`);
}

const text = fs.readFileSync(checklistPath, "utf8");
const matches = [...text.matchAll(/^# Phase (\d+) — (.+)$/gm)];
if (!matches.length) throw new Error("No phases found.");

let overall = 0;
let totalDone = 0, totalBlocked = 0, totalIP = 0, totalOpen = 0;
const rows = [];

for (let i = 0; i < matches.length; i++) {
  const m = matches[i];
  const phase = Number(m[1]);
  const name = m[2].trim();
  const start = m.index + m[0].length;
  const end = i + 1 < matches.length ? matches[i+1].index : text.length;
  const body = text.slice(start, end);
  const boxes = [...body.matchAll(/^- \[([ x~!])\]/gm)].map(x => x[1]);

  const done = boxes.filter(x => x === "x").length;
  const blocked = boxes.filter(x => x === "!").length;
  const ip = boxes.filter(x => x === "~").length;
  const open = boxes.filter(x => x === " ").length;
  const total = boxes.length;

  totalDone += done; totalBlocked += blocked; totalIP += ip; totalOpen += open;

  const fraction = total ? done / total : 0;
  const weight = weights[phase] || 0;
  const contribution = fraction * weight;
  overall += contribution;

  let status = "NOT STARTED";
  if (done > 0 || ip > 0) status = "IN PROGRESS";
  if (blocked > 0) status = "BLOCKED";
  if (total > 0 && done === total) status = "DONE";

  rows.push(
    `| ${phase} — ${name} | ${weight}% | ${done}/${total} (${(fraction*100).toFixed(1)}%) | ${contribution.toFixed(1)}% | ${status} |`
  );
}

overall = Math.round(overall * 10) / 10;
const now = new Date().toISOString();

const output = `# Payload CMS Starter V1 — Live Progress

> Machine-maintained by \`10_update_progress.mjs\`.
> Source of truth: \`01_STARTER_V1_EXECUTION_CHECKLIST.md\`.

## Overall

**Project Progress: ${overall.toFixed(1)}%**

- DONE items: ${totalDone}
- BLOCKED items: ${totalBlocked}
- IN PROGRESS items: ${totalIP}
- OPEN items: ${totalOpen}
- Last updated: ${now}

## Phase Progress

| Phase | Weight | Checklist Progress | Weighted Contribution | Status |
|---|---:|---:|---:|---|
${rows.join("\n")}

## Progress Rules

- \`[x]\` = completed and counts toward progress.
- \`[~]\` = in progress; not counted as completed.
- \`[ ]\` = open.
- \`[!]\` = externally blocked; not counted as completed.
- 100% requires every authoritative checklist item to be \`[x]\`.
- At every phase boundary: checklist -> state -> progress -> compact -> continue.

## Completion / Publication Rule

\`.payload-starter-v1-complete\` may be created only if:

- Project Progress is 100.0%;
- GitHub \`main\` is pushed;
- remote tag \`v1.0.0\` is pushed;
- final published-repository verification passes;
- final report exists;
- no blocked/open/in-progress checklist item remains.
`;

fs.writeFileSync(outputPath, output, "utf8");
console.log(`Starter V1 progress updated: ${overall.toFixed(1)}%`);
if (totalBlocked) console.log(`Blocked items: ${totalBlocked}`);
