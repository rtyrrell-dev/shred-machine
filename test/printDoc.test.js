import { test } from "node:test";
import assert from "node:assert/strict";
import { buildPrintHtml, escapeHtml } from "../src/printDoc.js";

// Reference: the template exactly as it was written in App.jsx before
// escaping was added (including its inline print script).
const OLD_SCRIPT = "<script>window.onload=()=>window.print()</script>";
const oldTemplate = ({ color, nc, label, bpm, isLead, tab }) =>
  `<html><head><title>SHRED MACHINE</title><style>body{background:#000;color:#eee;font-family:monospace;padding:2rem;}h1{color:${color};font-size:1.3rem;}p{color:#888;font-size:.8rem;margin:0 0 1rem;}pre{font-size:.85rem;line-height:1.8;color:${nc};}</style></head><body><h1>⚡ SHRED MACHINE</h1><p>${label} | ${bpm} BPM | ${isLead?'LEAD':'RHYTHM'}</p><pre>${tab}</pre>${OLD_SCRIPT}</body></html>`;

const REAL_TAB = [
  "e|----------------|----------------|----------------|----------------|",
  "B|12p5h8-12p5h8~~--|7/9\\7----------|5---------------|0---------------|",
  "G|----------------|----------------|----------------|----------------|",
].join("\n");

const base = { color: "#ff2d78", nc: "#ff8ab8", label: "EVH Tap (12-5-8)", bpm: 132, isLead: true, tab: REAL_TAB };

test("output is identical to the old template minus the inline script", () => {
  for (const isLead of [true, false]) {
    const input = { ...base, isLead, color: isLead ? "#ff2d78" : "#00f5ff", nc: isLead ? "#ff8ab8" : "#7ef5ff" };
    assert.equal(buildPrintHtml(input), oldTemplate(input).replace(OLD_SCRIPT, ""));
  }
});

test("the printed document contains no script", () => {
  assert.doesNotMatch(buildPrintHtml(base), /<script/i);
});

test("the only other difference from the old template is escaping", () => {
  const hostile = { ...base, label: `<img src=x onerror=alert(1)> & "q" 'q'`, tab: `</pre><script>alert(1)</script>` };
  const html = buildPrintHtml(hostile);
  assert.doesNotMatch(html, /<script/i);
  assert.doesNotMatch(html, /<img/i);
  // Same as the old template once the dynamic text is escaped first.
  const expected = oldTemplate({ ...hostile, label: escapeHtml(hostile.label), tab: escapeHtml(hostile.tab) }).replace(OLD_SCRIPT, "");
  assert.equal(html, expected);
});

test("escapeHtml handles all five characters and non-strings", () => {
  assert.equal(escapeHtml(`&<>"'`), "&amp;&lt;&gt;&quot;&#39;");
  assert.equal(escapeHtml(120), "120");
});
