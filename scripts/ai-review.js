// scripts/ai-review.js
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { Anthropic } from "@anthropic-ai/sdk";

// Lấy danh sách model từ env (phân tách dấu phẩy), nếu không có dùng fallback mặc định
const MODEL_LIST = process.env.CLAUDE_MODEL
  ? process.env.CLAUDE_MODEL.split(",")
      .map((s) => s.trim())
      .filter(Boolean)
  : [
      "claude-sonnet-4-5",
      "claude-3-7-sonnet",
      "claude-3-5-sonnet-20241022",
      "claude-3-haiku-20240307",
    ];
const LANG = (process.env.REVIEW_LANG || "en").toLowerCase();
const isVI = LANG.startsWith("vi");

const MAX_CHARS_PER_CALL = 120_000;
const systemPrompt = isVI
  ? [
      "Bạn là senior code ReactJs reviewer giàu kinh nghiệm.",
      "Nhiệm vụ: đọc từng phần Git diff và đưa ra nhận xét NGẮN GỌN, CỤ THỂ, HÀNH ĐỘNG ĐƯỢC, bằng TIẾNG VIỆT.",
      "Ưu tiên: tính đúng đắn, bảo mật, hiệu năng, khả năng bảo trì/đọc, khả năng kiểm thử, khả năng truy cập (a11y).",
      "Định dạng đầu ra cho mỗi phần:",
      "- **Tệp**: <tên hoặc nhãn chunk>",
      "- **Vấn đề chính**: gạch đầu dòng ngắn, rõ “lý do vì sao”.",
      "- **Gợi ý vá**: kèm patch `diff` nếu có thể.",
      "- **Kiểm thử nên thêm**: gợi ý test cases ngắn gọn.",
    ].join("\n")
  : [
      "You are a rigorous senior Reactjs code reviewer.",
      "Review the given Git diff chunk and produce concise, actionable comments.",
      "Focus on: correctness, security, performance, readability, testability, accessibility.",
      "For each chunk, output:",
      "- File being reviewed",
      "- Key Issues",
      "- Suggested patches (diff format if possible)",
      "- Tests to add",
    ].join("\n");

function splitText(text, limit) {
  if (text.length <= limit) return [text];
  const out = [];
  for (let i = 0; i < text.length; i += limit)
    out.push(text.slice(i, i + limit));
  return out;
}

async function callClaude(client, model, userMsg) {
  return client.messages.create({
    model,
    max_tokens: 1600,
    temperature: 0.1,
    system: systemPrompt,
    messages: [{ role: "user", content: userMsg }],
  });
}

async function createWithFallback(client, userMsg) {
  let lastErr;
  for (const m of MODEL_LIST) {
    try {
      const res = await callClaude(client, m, userMsg);
      return { modelUsed: m, res };
    } catch (e) {
      // Nếu là 404 model not found hoặc 400 invalid model => thử model kế tiếp
      const code = e?.error?.type || e?.status || e?.code;
      if (
        code === "not_found_error" ||
        code === 404 ||
        code === "invalid_request_error" ||
        code === 400
      ) {
        lastErr = e;
        // eslint-disable-next-line no-console
        console.warn(`Model "${m}" failed (${code}). Trying next...`);
        continue;
      }
      // Lỗi khác: ném ra luôn
      throw e;
    }
  }
  throw (
    lastErr || new Error("No available Claude model from CLAUDE_MODEL list.")
  );
}

async function reviewChunk(client, fileName, diffText) {
  const userMsg = [
    `File: ${fileName}`,
    "====== BEGIN DIFF ======",
    diffText,
    "======= END DIFF =======",
  ].join("\n");

  const { modelUsed, res } = await createWithFallback(client, userMsg);
  const text = res.content?.[0]?.text?.trim() || "";
  return { modelUsed, text };
}

async function main() {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  // Giữ nguyên logic lấy diff (pr.diff hoặc DIFF_DIR)
  const arg = process.argv[2];
  const diffDir =
    process.env.DIFF_DIR ||
    (arg && fs.existsSync(arg) && fs.lstatSync(arg).isDirectory() ? arg : null);

  const outputs = [];
  let modelChosen = null;

  if (diffDir) {
    const files = fs.readdirSync(diffDir).filter((f) => f.endsWith(".diff"));
    for (const f of files) {
      const p = path.join(diffDir, f);
      const fileDiff = fs.readFileSync(p, "utf8").trim();
      if (!fileDiff) continue;

      const chunks = splitText(fileDiff, MAX_CHARS_PER_CALL);
      for (let i = 0; i < chunks.length; i++) {
        const label =
          chunks.length > 1 ? `${f} [chunk ${i + 1}/${chunks.length}]` : f;
        const { modelUsed, text } = await reviewChunk(client, label, chunks[i]);
        modelChosen = modelChosen || modelUsed;
        if (text) outputs.push(`### ${label}\n\n${text}`);
      }
    }
  } else {
    const diffPath = arg || "pr.diff";
    if (!fs.existsSync(diffPath)) {
      console.error(`Diff file not found: ${diffPath}`);
      process.exit(2);
    }
    const whole = fs.readFileSync(diffPath, "utf8");
    const chunks = splitText(whole, MAX_CHARS_PER_CALL);
    for (let i = 0; i < chunks.length; i++) {
      const { modelUsed, text } = await reviewChunk(
        client,
        `pr.diff [chunk ${i + 1}/${chunks.length}]`,
        chunks[i]
      );
      modelChosen = modelChosen || modelUsed;
      if (text)
        outputs.push(
          `### pr.diff [chunk ${i + 1}/${chunks.length}]\n\n${text}`
        );
    }
  }

  const header = `# Claude Review\n\n_Model candidates:_ ${MODEL_LIST.join(
    ", "
  )}\n_Model used:_ ${modelChosen || "N/A"}\n_Language:_ ${
    isVI ? "vi" : "en"
  }\n_Date:_ ${new Date().toISOString()}\n`;

  fs.writeFileSync(
    "claude-review.md",
    header + outputs.join("\n\n---\n\n"),
    "utf8"
  );
  console.log("Wrote claude-review.md");
}

main().catch((e) => {
  console.error(
    "AI review failed:",
    e?.response?.data || e?.error || e?.message || e
  );
  process.exit(1);
});
