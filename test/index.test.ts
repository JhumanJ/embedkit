import test from "node:test";
import assert from "node:assert/strict";
import { resolveEmbed, isSupported } from "../src/index.js";

test("isSupported and resolve basic", () => {
  assert.equal(isSupported("https://vimeo.com/1234567"), true);
  const r = resolveEmbed("https://vimeo.com/1234567");
  assert.equal(r.ok, true);
});


