import test from 'node:test';
import assert from 'node:assert/strict';
import { sanitizeInput, parseStructuredJsonResponse } from '../src/lib/gemini';

test('sanitizeInput - trims whitespace and truncates length', () => {
  const raw = '   This is a sample dispute explanation.   ';
  const result = sanitizeInput(raw, 16);
  assert.strictEqual(result, 'This is a sample');
});

test('sanitizeInput - strips ASCII control characters', () => {
  const malicious = 'Hello\x00\x08World\x1F\x7F!';
  const cleaned = sanitizeInput(malicious);
  assert.strictEqual(cleaned, 'HelloWorld!');
});

test('sanitizeInput - handles non-string input safely', () => {
  assert.strictEqual(sanitizeInput(null), '');
  assert.strictEqual(sanitizeInput(undefined), '');
  assert.strictEqual(sanitizeInput(12345), '');
});

test('parseStructuredJsonResponse - parses clean JSON', () => {
  const raw = '{"status": "success", "score": 85}';
  const parsed = parseStructuredJsonResponse(raw, { status: 'failed' });
  assert.deepStrictEqual(parsed, { status: 'success', score: 85 });
});

test('parseStructuredJsonResponse - extracts JSON from markdown code fences', () => {
  const raw = '```json\n{"reportTitle": "CASE REPORT", "confidence": 0.95}\n```';
  const parsed = parseStructuredJsonResponse(raw, {});
  assert.deepStrictEqual(parsed, { reportTitle: 'CASE REPORT', confidence: 0.95 });
});

test('parseStructuredJsonResponse - handles text surrounding JSON', () => {
  const raw = 'Here is the analyzed output:\n\n{"clause": "Clause 4", "risk": "Moderate"}\n\nHope this helps.';
  const parsed = parseStructuredJsonResponse(raw, {});
  assert.deepStrictEqual(parsed, { clause: 'Clause 4', risk: 'Moderate' });
});

test('parseStructuredJsonResponse - returns fallback on malformed JSON', () => {
  const raw = 'This is not JSON at all.';
  const fallback = { fallback: true };
  const parsed = parseStructuredJsonResponse(raw, fallback);
  assert.deepStrictEqual(parsed, fallback);
});
