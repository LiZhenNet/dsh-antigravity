import assert from "node:assert/strict";
import test from "node:test";

import { sanitizeText } from "../lib/text.js";

test("sanitizeText preserves valid supplementary Unicode characters", () => {
  assert.equal(sanitizeText("环境检测 📷 ✅ 🚀"), "环境检测 📷 ✅ 🚀");
});

test("sanitizeText replaces only unpaired surrogate code units", () => {
  assert.equal(sanitizeText(`before\uD800after`), "before\uFFFDafter");
  assert.equal(sanitizeText(`before\uDC00after`), "before\uFFFDafter");
});

test("sanitizeText normalizes nullish and non-string values", () => {
  assert.equal(sanitizeText(null), "");
  assert.equal(sanitizeText(42), "42");
});
