// scripts/create_issues.js
import fs from "node:fs";
import process from "node:process";
import { fetch } from "undici";

function fail(msg) {
  console.error(msg);
  process.exit(1);
}

async function main() {
  const token = process.env.GITHUB_TOKEN;
  const repoFull = process.env.REPO || process.env.GITHUB_REPOSITORY; // "owner/repo"
  const prNumber = process.env.PR_NUMBER;
  const prUrl =
    process.env.PR_URL ||
    (repoFull && prNumber
      ? `https://github.com/${repoFull}/pull/${prNumber}`
      : "");

  if (!token) fail("Missing GITHUB_TOKEN");
  if (!repoFull || !repoFull.includes("/"))
    fail("Missing or invalid REPO/GITHUB_REPOSITORY");
  if (!prNumber) fail("Missing PR_NUMBER");

  const [owner, repo] = repoFull.split("/");

  // 1) Load issues.json (optional)
  if (!fs.existsSync("issues.json")) {
    console.log("issues.json not found — nothing to create. Exiting 0.");
    process.exit(0);
  }

  let raw;
  try {
    raw = JSON.parse(fs.readFileSync("issues.json", "utf8"));
  } catch (e) {
    fail(`Failed to parse issues.json: ${e.message}`);
  }

  // Hỗ trợ 2 dạng: { issues: [...] } hoặc [...] trực tiếp
  const list = Array.isArray(raw)
    ? raw
    : Array.isArray(raw?.issues)
    ? raw.issues
    : [];
  if (!list.length) {
    console.log("issues.json has no items — exiting 0.");
    process.exit(0);
  }

  // Lọc High/Critical
  const candidates = list.filter((it) => {
    const sev = String(it.severity || it.level || "").toLowerCase();
    return sev === "high" || sev === "critical";
  });

  if (!candidates.length) {
    console.log("No High/Critical issues — exiting 0.");
    process.exit(0);
  }

  const base = "https://api.github.com";
  const headers = {
    Authorization: `Bearer ${token}`,
    "User-Agent": "gh-actions-ai-review",
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
  };

  // 2) Lấy danh sách issue đang mở để tránh trùng
  const existing = [];
  {
    const url = `${base}/repos/${owner}/${repo}/issues?state=open&per_page=100`;
    const res = await fetch(url, { headers });
    if (!res.ok) {
      const t = await res.text();
      fail(`Failed to list issues: ${res.status} ${t}`);
    }
    const data = await res.json();
    for (const i of data) existing.push(i.title);
  }

  // 3) Tạo từng issue
  for (const it of candidates) {
    const sev = String(it.severity || it.level || "High");
    const prefix =
      sev.toUpperCase() === "CRITICAL"
        ? "[AI Review][CRITICAL]"
        : "[AI Review][HIGH]";

    // Tiêu đề
    const title = it.title
      ? `${prefix} ${it.title}`.trim()
      : `${prefix} ${it.file || ""} ${it.rule ? `- ${it.rule}` : ""}`.trim() ||
        `${prefix} Unnamed issue`;

    if (existing.includes(title)) {
      console.log(`Skip existing open issue: ${title}`);
      continue;
    }

    // Nội dung
    const desc = [
      it.body || it.description || it.detail || "_No details provided._",
      "",
      prUrl ? `**PR:** ${prUrl} ( #${prNumber} )` : "",
      it.file ? `**File:** \`${it.file}\`` : "",
      it.line ? `**Line:** ${it.line}` : "",
      it.rule ? `**Rule:** ${it.rule}` : "",
      "",
      it.suggestion ? `**Suggestion:**\n${it.suggestion}` : "",
      it.patch ? `\n**Proposed Patch:**\n\`\`\`diff\n${it.patch}\n\`\`\`` : "",
    ]
      .filter(Boolean)
      .join("\n");

    // Nhãn
    const labels = Array.isArray(it.labels) ? it.labels.slice(0) : [];
    if (!labels.includes("ai-review")) labels.push("ai-review");
    const sevLabel = sev.toLowerCase() === "critical" ? "critical" : "high";
    if (!labels.includes(sevLabel)) labels.push(sevLabel);

    // Gọi API tạo issue
    const createUrl = `${base}/repos/${owner}/${repo}/issues`;
    const res = await fetch(createUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({
        title,
        body: desc,
        labels,
      }),
    });

    if (!res.ok) {
      const t = await res.text();
      console.error(`Failed to create issue "${title}": ${res.status} ${t}`);
      // Không fail toàn job để không chặn workflow; tiếp tục tạo các issue khác
      continue;
    }

    const data = await res.json();
    console.log(`Created issue #${data?.number}: ${title}`);
  }

  console.log("Done creating issues.");
}

main().catch((e) => {
  console.error("create_issues.js failed:", e?.stack || e?.message || e);
  process.exit(1);
});
