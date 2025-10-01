// scripts/ai-review.js
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { Anthropic } from "@anthropic-ai/sdk";

async function main() {
  try {
    const diffPath = process.argv[2] || "pr.diff";
    if (!fs.existsSync(diffPath)) {
      console.error(`Diff file not found: ${diffPath}`);
      process.exit(2);
    }
    const prNumber = process.env.GITHUB_PR_NUMBER || "N/A";
    const repo = process.env.GITHUB_REPOSITORY || "N/A";
    const diff = fs.readFileSync(diffPath, "utf8");

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const systemPrompt = [
      "You are a rigorous senior code reviewer.",
      "Task: Review the given Git diff and produce concise, actionable comments.",
      "Focus on: correctness, security, performance, readability, testability, accessibility.",
      "Output structure:",
      "1) Summary (key risks, quick wins)",
      "2) Inline suggestions (file:line → issue → code patch)",
      "3) Tests to add (bulleted)",
      "4) Accessibility & DX notes",
    ].join("\n");

    const userMsg = [
      `Repository: ${repo}`,
      `PR: #${prNumber}`,
      "====== BEGIN DIFF ======",
      diff,
      "======= END DIFF =======",
    ].join("\n");

    const msg = await client.messages.create({
      model: "claude-3-5-sonnet-latest",
      max_tokens: 1800,
      temperature: 0.1,
      system: systemPrompt,
      messages: [{ role: "user", content: userMsg }],
    });

    const text = msg.content?.[0]?.text?.trim() || "No review content.";
    const outPath = path.resolve("claude-review.md");
    fs.writeFileSync(outPath, text, "utf8");
    console.log(`Wrote ${outPath}`);
  } catch (err) {
    console.error("AI review failed:", err?.message || err);
    process.exit(1);
  }
}

main();
