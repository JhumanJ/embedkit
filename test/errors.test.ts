import test from "node:test";
import assert from "node:assert/strict";
import { resolveEmbed } from "../src/index.js";

test("invalid url", () => {
  const r = resolveEmbed("notaurl");
  assert.equal(r.ok, false);
  assert.equal(r.code, "INVALID_URL");
});

test("unsupported provider", () => {
  const r = resolveEmbed("https://example.com/foo");
  assert.equal(r.ok, false);
  assert.equal(r.code, "UNSUPPORTED_PROVIDER");
});

test("twitch without parent", () => {
  const r = resolveEmbed("https://www.twitch.tv/somechannel");
  assert.equal(r.ok, false);
  assert.equal(r.code, "PROVIDER_CONSTRAINT");
});


