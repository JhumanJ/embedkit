import assert from "node:assert/strict";
import { resolveEmbed, isSupported } from "../../src/index.js";
import type { ResolveSuccess, ResolveResult } from "../../src/core/types.js";

const ctx = { hostname: "app.example.com", preferLang: "fr", theme: "dark" as const };

function ok(v: ResolveResult): asserts v is ResolveSuccess {
  assert.equal((v as ResolveSuccess).ok, true, `Expected ok=true, got ${JSON.stringify(v)}`);
}

function err(v: any, code: string) {
  assert.equal(v.ok, false);
  assert.equal(v.code, code);
}

export async function test_basic() {
  assert.equal(isSupported("https://youtu.be/dQw4w9WgXcQ?t=43"), true);
  const yt = resolveEmbed("https://youtu.be/dQw4w9WgXcQ?t=43", { preferLang: ctx.preferLang, theme: ctx.theme, hostname: ctx.hostname });
  ok(yt);
  assert.equal(yt.descriptor.provider, "youtube");
  assert.equal(yt.descriptor.kind, "iframe");
  assert.equal(yt.descriptor.aspectRatio, "16:9");
  assert.match(yt.descriptor.src, /youtube\.com\/embed\/dQw4w9WgXcQ/);

  const twitchNoParent = resolveEmbed("https://www.twitch.tv/somechannel");
  err(twitchNoParent, "PROVIDER_CONSTRAINT");

  const unsupported = resolveEmbed("https://example.com/foo");
  err(unsupported, "UNSUPPORTED_PROVIDER");

  const mp4 = resolveEmbed("https://cdn.example.com/video.mp4");
  ok(mp4);
  assert.equal(mp4.descriptor.kind, "video");
}


