import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const config = JSON.parse(readFileSync(new URL("../vercel.json", import.meta.url), "utf8"));
const rule = config.headers.find(h => h.source === "/(.*)");
const header = key => rule?.headers.find(h => h.key.toLowerCase() === key.toLowerCase())?.value;

const directives = Object.fromEntries(
  (header("Content-Security-Policy") ?? "").split(";").map(d => d.trim()).filter(Boolean).map(d => {
    const [name, ...values] = d.split(/\s+/);
    return [name, values];
  })
);

test("security headers apply to every path", () => {
  assert.ok(rule, 'a header rule with source "/(.*)" exists');
  assert.equal(header("X-Content-Type-Options"), "nosniff");
  assert.equal(header("Referrer-Policy"), "no-referrer");
});

test("CSP forbids inline and remote scripts, framing, plugins and base/form tricks", () => {
  assert.deepEqual(directives["default-src"], ["'none'"]);
  assert.deepEqual(directives["script-src"], ["'self'"]);
  assert.deepEqual(directives["frame-ancestors"], ["'none'"]);
  assert.deepEqual(directives["object-src"], ["'none'"]);
  assert.deepEqual(directives["base-uri"], ["'none'"]);
  assert.deepEqual(directives["form-action"], ["'none'"]);
  assert.deepEqual(directives["connect-src"], ["'none'"]);
});

test("the only third-party origins are the two Google Fonts hosts", () => {
  const origins = Object.values(directives).flat().filter(v => /^https?:|\*/.test(v));
  assert.deepEqual(origins.sort(), ["https://fonts.googleapis.com", "https://fonts.gstatic.com"]);
  assert.deepEqual(directives["style-src"], ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"]);
  assert.deepEqual(directives["font-src"], ["https://fonts.gstatic.com"]);
});

test("Permissions-Policy denies sensors, capture, and device APIs", () => {
  const policy = header("Permissions-Policy") ?? "";
  for (const f of ["camera", "microphone", "geolocation", "payment", "usb", "serial", "hid", "bluetooth", "midi", "display-capture"]) {
    assert.match(policy, new RegExp(`(^|, )${f}=\\(\\)`), f);
  }
});

// The CSP has no script-src 'unsafe-inline', so the built page must not need it.
test("built index.html has no inline scripts or handlers", { skip: !existsSync(new URL("../dist/index.html", import.meta.url)) && "run npm run build first" }, () => {
  const html = readFileSync(new URL("../dist/index.html", import.meta.url), "utf8");
  for (const [, attrs, body] of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/gi)) {
    assert.match(attrs, /\ssrc="/, "every script has a src");
    assert.equal(body.trim(), "", "no inline script body");
  }
  assert.doesNotMatch(html, /\son[a-z]+\s*=/i, "no inline event handlers");
});
