import test from "node:test";
import assert from "node:assert/strict";
import { resolveEmbed } from "../../src/index.js";
import type { ResolveSuccess } from "../../src/core/types.js";

function ok(r: any): asserts r is ResolveSuccess {
  assert.equal(r.ok, true, `Expected ok=true, got ${JSON.stringify(r)}`);
}

test("YouTube basic + start param", () => {
  const r = resolveEmbed("https://youtu.be/dQw4w9WgXcQ?t=43");
  ok(r);
  assert.equal(r.descriptor.provider, "youtube");
  assert.match(r.descriptor.src, /youtube\.com\/embed\/dQw4w9WgXcQ/);
  assert.match(r.descriptor.src, /modestbranding=1/);
  assert.match(r.descriptor.src, /rel=0/);
});

test("Vimeo numeric id", () => {
  const r = resolveEmbed("https://vimeo.com/123456789");
  ok(r);
  assert.equal(r.descriptor.provider, "vimeo");
  assert.match(r.descriptor.src, /player\.vimeo\.com\/video\/123456789/);
});

test("Dailymotion", () => {
  const r = resolveEmbed("https://www.dailymotion.com/video/x7xyz");
  ok(r);
  assert.equal(r.descriptor.provider, "dailymotion");
  assert.match(r.descriptor.src, /dailymotion\.com\/embed\/video\/x7xyz/);
});

test("Loom share -> embed", () => {
  const r = resolveEmbed("https://www.loom.com/share/abcd1234");
  ok(r);
  assert.equal(r.descriptor.provider, "loom");
  assert.match(r.descriptor.src, /loom\.com\/embed\/abcd1234/);
});

test("Tella video -> embed", () => {
  const r = resolveEmbed("https://tella.tv/video/xyz789");
  ok(r);
  assert.equal(r.descriptor.provider, "tella");
  assert.match(r.descriptor.src, /tella\.tv\/embed\/xyz789/);
});

test("Wistia", () => {
  const r = resolveEmbed("https://fast.wistia.com/medias/abc123xyz");
  ok(r);
  assert.equal(r.descriptor.provider, "wistia");
  assert.match(r.descriptor.src, /fast\.wistia\.net\/embed\/iframe\/abc123xyz/);
});

test("Streamable", () => {
  const r = resolveEmbed("https://streamable.com/abcd1");
  ok(r);
  assert.equal(r.descriptor.provider, "streamable");
  assert.match(r.descriptor.src, /streamable\.com\/e\/abcd1/);
});

test("Twitch live requires parent", () => {
  const r = resolveEmbed("https://www.twitch.tv/gaules", { hostname: "app.example.com" });
  ok(r);
  assert.equal(r.descriptor.provider, "twitch");
  assert.match(r.descriptor.src, /player\.twitch\.tv\/\?channel=gaules&parent=app\.example\.com/);
});

test("Facebook public plugin", () => {
  const r = resolveEmbed("https://www.facebook.com/watch/?v=10153231379946729");
  ok(r);
  assert.equal(r.descriptor.provider, "facebook");
  assert.match(r.descriptor.src, /facebook\.com\/plugins\/video\.php\?href=/);
});

test("SoundCloud", () => {
  const r = resolveEmbed("https://soundcloud.com/artist/track");
  ok(r);
  assert.equal(r.descriptor.provider, "soundcloud");
  assert.match(r.descriptor.src, /w\.soundcloud\.com\/player\/\?url=/);
});

test("Spotify track", () => {
  const r = resolveEmbed("https://open.spotify.com/track/3n3Ppam7vgaVa1iaRUc9Lp");
  ok(r);
  assert.equal(r.descriptor.provider, "spotify");
  assert.match(r.descriptor.src, /open\.spotify\.com\/embed\/track\/3n3Ppam7vgaVa1iaRUc9Lp/);
});

test("Mixcloud", () => {
  const r = resolveEmbed("https://www.mixcloud.com/someuser/somemix/");
  ok(r);
  assert.equal(r.descriptor.provider, "mixcloud");
  assert.match(r.descriptor.src, /mixcloud\.com\/widget\/iframe\/\?feed=/);
});

test("GIPHY gifs slug-id", () => {
  const r = resolveEmbed("https://giphy.com/gifs/funny-cat-3oEduABCDE");
  ok(r);
  assert.equal(r.descriptor.provider, "giphy");
  assert.match(r.descriptor.src, /giphy\.com\/embed\/3oEduABCDE/);
});

test("Twitter status", () => {
  const r = resolveEmbed("https://twitter.com/SpaceX/status/1344009123004747778", { preferLang: "fr", theme: "light" });
  ok(r);
  assert.equal(r.descriptor.provider, "twitter");
  assert.match(r.descriptor.src, /platform\.twitter\.com\/embed\/Tweet\.html\?id=1344009123004747778/);
  assert.match(r.descriptor.src, /lang=fr/);
});

test("Google Drive preview", () => {
  const r = resolveEmbed("https://drive.google.com/file/d/FILE_ID/view?usp=sharing");
  ok(r);
  assert.equal(r.descriptor.provider, "gdrive");
  assert.match(r.descriptor.src, /drive\.google\.com\/file\/d\/FILE_ID\/preview/);
});

test("Direct MP4", () => {
  const r = resolveEmbed("https://cdn.example.com/path/video.mp4");
  ok(r);
  assert.equal(r.descriptor.provider, "file");
  assert.equal(r.descriptor.kind, "video");
});

test("HLS m3u8", () => {
  const r = resolveEmbed("https://cdn.example.com/stream/playlist.m3u8");
  ok(r);
  assert.equal(r.descriptor.provider, "file");
  assert.equal(r.descriptor.kind, "video");
  assert.equal(r.descriptor.params?.["hls"], true);
});

test("Image direct", () => {
  const r = resolveEmbed("https://cdn.example.com/image.png");
  ok(r);
  assert.equal(r.descriptor.provider, "image");
  assert.equal(r.descriptor.kind, "image");
});


