import { test, after } from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

// Spawns the real server over stdio and sends it hostile input.
const transport = new StdioClientTransport({
  command: process.execPath,
  args: [fileURLToPath(new URL("../index.js", import.meta.url))],
});
const client = new Client({ name: "validation-test", version: "0.0.0" });
await client.connect(transport);
after(() => client.close());

// Must be rejected by schema validation specifically, not by a handler crash.
const VALIDATION = /input validation|invalid|not found/i;
async function rejected(name, args) {
  try {
    const res = await client.callTool({ name, arguments: args });
    return res.isError === true && VALIDATION.test(res.content?.[0]?.text ?? "");
  } catch (err) {
    return VALIDATION.test(String(err.message));
  }
}

test("valid ids and types are accepted", async () => {
  for (const id of ["evh", "dem", "lnch", "jade", "ian"]) {
    const profile = await client.callTool({ name: "get_guitarist_profile", arguments: { guitarist_id: id } });
    assert.notEqual(profile.isError, true, id);
    for (const type of ["lead", "rhythm"]) {
      const tab = await client.callTool({ name: "generate_tab", arguments: { guitarist_id: id, type } });
      assert.notEqual(tab.isError, true, `${id}/${type}`);
    }
  }
});

test("guitarist_id outside the allowlist is rejected", async () => {
  const bad = ["../../etc/passwd", "..\..\windows", "__proto__", "constructor", "toString", "EVH", "evh ", "", "evh\u0000", 1, null, ["evh"], {}];
  for (const guitarist_id of bad) {
    assert.ok(await rejected("get_guitarist_profile", { guitarist_id }), JSON.stringify(guitarist_id));
    assert.ok(await rejected("generate_tab", { guitarist_id, type: "lead" }), JSON.stringify(guitarist_id));
  }
});

test("type outside the allowlist is rejected", async () => {
  for (const type of ["solo", "LEAD", "__proto__", "", 0, null, undefined]) {
    assert.ok(await rejected("generate_tab", { guitarist_id: "evh", type }), JSON.stringify(type));
  }
});

test("missing arguments are rejected", async () => {
  assert.ok(await rejected("get_guitarist_profile", {}));
  assert.ok(await rejected("generate_tab", { guitarist_id: "evh" }));
});

test("unknown tools are rejected", async () => {
  assert.ok(await rejected("read_file", { path: "/etc/passwd" }));
});
