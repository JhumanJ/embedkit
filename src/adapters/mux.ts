import { Adapter, EmbedDescriptor, err } from "../core/types.js";
import { hostIs } from "../core/url.js";

// Mux: https://stream.mux.com/{playbackId}.m3u8 or .mp4 (we'll prefer <video> direct)
// Embed iframe also exists via https://player.mux.com/ (but usually SDK). We'll do direct video.

const adapter: Adapter = {
  name: "mux",
  match(u) {
    return hostIs(u, ["stream.mux.com"]) && /\.(m3u8|mp4)(\?|$)/i.test(u.pathname);
  },
  build(u) {
    const isHls = /\.m3u8(\?|$)/i.test(u.pathname);
    const descriptor: EmbedDescriptor = {
      kind: "video",
      provider: "file",
      src: u.toString(),
      aspectRatio: "16:9",
      csp: { mediaSrc: [`${u.protocol}//${u.host}`] },
      raw: { url: u.toString(), matchedPattern: "mux" },
    };
    if (isHls) descriptor.params = { hls: true };
    return descriptor;
  },
};

export default adapter;


