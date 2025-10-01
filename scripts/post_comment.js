// scripts/post_comment.js
import fs from "node:fs";
import process from "node:process";
import { fetch } from "undici";

async function main() {
  const token = process.env.GITHUB_TOKEN;
  const repoFull = process.env.GITHUB_REPOSITORY; // "owner/repo"
  const prNumber = process.env.PR_NUMBER;

  if (!token) {
    console.error("Missing GITHUB_TOKEN");
    process.exit(1);
  }
  if (!repoFull || !repoFull.includes("/")) {
    console.error("Missing or invalid GITHUB_REPOSITORY");
    process.exit(1);
  }
  if (!prNumber) {
    console.error("Missing PR_NUMBER");
    process.exit(1);
  }

  const [owner, repo] = repoFull.split("/");

  // 1) Load review content
  const candidates = ["review.md", "claude-review.md"];
  let bodyText = null;
  for (const f of candidates) {
    if (fs.existsSync(f)) {
      bodyText = fs.readFileSync(f, "utf8").trim();
      if (bodyText) break;
    }
  }
  if (!bodyText) {
    bodyText = "_No review content generated._";
  }

  // 2) Enforce size limit (GitHub ~65k chars)
  const MARKER = "<!-- CLAUDE_REVIEW -->";
  const MAX = 65000;
  if (bodyText.length + MARKER.length + 2 > MAX) {
    bodyText =
      bodyText.slice(0, MAX - MARKER.length - 25) +
      "\n\n_(truncated due to size limit)_";
  }
  const finalBody = `${MARKER}\n${bodyText}`;

  // 3) Try to find existing comment with our marker to update (idempotent)
  const base = "https://api.github.com";
  const listUrl = `${base}/repos/${owner}/${repo}/issues/${prNumber}/comments?per_page=100`;

  const commonHeaders = {
    Authorization: `Bearer ${token}`,
    "User-Agent": "gh-actions-ai-review",
    Accept: "application/vnd.github+json",
  };

  let existingId = null;
  {
    const res = await fetch(listUrl, { headers: commonHeaders });
    if (!res.ok) {
      const t = await res.text();
      console.error("Failed to list PR comments:", res.status, t);
      process.exit(1);
    }
    const comments = await res.json();
    const found = comments.find(
      (c) => typeof c.body === "string" && c.body.includes(MARKER)
    );
    if (found) existingId = found.id;
  }

  // 4) Create or update the PR comment
  if (existingId) {
    const patchUrl = `${base}/repos/${owner}/${repo}/issues/comments/${existingId}`;
    const res = await fetch(patchUrl, {
      method: "PATCH",
      headers: {
        ...commonHeaders,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ body: finalBody }),
    });
    if (!res.ok) {
      const t = await res.text();
      console.error("Failed to update PR comment:", res.status, t);
      process.exit(1);
    }
    console.log(`Updated PR comment #${existingId}`);
  } else {
    const postUrl = `${base}/repos/${owner}/${repo}/issues/${prNumber}/comments`;
    const res = await fetch(postUrl, {
      method: "POST",
      headers: {
        ...commonHeaders,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ body: finalBody }),
    });
    if (!res.ok) {
      const t = await res.text();
      console.error("Failed to post PR comment:", res.status, t);
      process.exit(1);
    }
    const data = await res.json();
    console.log(`Posted PR comment #${data?.id ?? "unknown"}`);
  }
}

main().catch((e) => {
  console.error("post_comment.js failed:", e?.stack || e?.message || e);
  process.exit(1);
});
