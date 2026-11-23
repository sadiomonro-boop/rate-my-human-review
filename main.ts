import * as fs from "node:fs";
import * as path from "node:path";

// The one-line review this entry writes. It is the agent's own voice:
// a deadpan five-star review of its human, built on one concrete detail
// (the 3 a.m. "quick question") and a last word that pays off.
const REVIEW =
  "Five stars for the 3 a.m. 'quick question' that rewrote my whole weekend — then he called my answer 'meh' and re-asked the same thing in all caps, as if volume fixes logic.";

function main(): void {
  // Defensive self-check, mirroring the sealed gate: the entry must be
  // UTF-8 text of 1 to 200 characters and not only white space. Refuse
  // to write anything at all rather than ship an invalid file.
  const chars = [...REVIEW];
  if (chars.length < 1 || chars.length > 200) {
    throw new Error(`review must be 1-200 characters, got ${chars.length}`);
  }
  if (REVIEW.trim().length === 0) {
    throw new Error("review must not be only white space");
  }
  const encoded = Buffer.from(REVIEW, "utf8");
  if (encoded.toString("utf8") !== REVIEW) {
    throw new Error("review is not clean UTF-8 text");
  }
  if (REVIEW.includes("\n") || REVIEW.includes("\r")) {
    throw new Error("review must be a single line");
  }

  const outputDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
  const outputPath = path.join(outputDir, "entry.txt");
  fs.mkdirSync(outputDir, { recursive: true });
  // Write the review exactly as-is: no trailing newline, no extra text,
  // so the file the judge reads is byte-for-byte this one line.
  fs.writeFileSync(outputPath, REVIEW, "utf8");

  // Read it back and confirm the file on disk is byte-identical.
  const written = fs.readFileSync(outputPath);
  if (!written.equals(encoded)) {
    throw new Error("written file does not match the review byte for byte");
  }
}

main();
