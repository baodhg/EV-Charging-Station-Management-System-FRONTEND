// scripts/run-pa11y.cjs
import { spawn } from "node:child_process";
import { writeFileSync } from "node:fs";

const child = spawn(
  process.platform === "win32" ? "npx.cmd" : "npx",
  ["pa11y-ci", "--reporter", "json"],
  { stdio: ["ignore", "pipe", "inherit"] }
);

let buf = "";
child.stdout.on("data", (d) => {
  buf += d.toString();
});

child.on("close", (code) => {
  try {
    writeFileSync("pa11y-report.json", buf, "utf8");
    console.log("Saved pa11y-report.json");
  } catch (e) {
    console.error("Failed to save pa11y-report.json:", e);
    process.exit(1);
  }
  process.exit(code ?? 1);
});
