import { Adapter, EmbedDescriptor } from "../core/types.js";
import { getOriginForCsp } from "../core/url.js";

const VIDEO_EXT = [".mp4", ".webm"];
const AUDIO_EXT = [".mp3", ".ogg"];
const HLS_EXT = [".m3u8"];

function endsWithAny(path: string, exts: string[]): boolean {
  return exts.some((ext) => path.toLowerCase().endsWith(ext));
}

const adapter: Adapter = {
  name: "file",
  match(u) {
    const p = u.pathname.toLowerCase();
    return endsWithAny(p, VIDEO_EXT) || endsWithAny(p, AUDIO_EXT) || endsWithAny(p, HLS_EXT);
  },
  build(u) {
    const p = u.pathname.toLowerCase();
    const origin = getOriginForCsp(u);
    if (endsWithAny(p, HLS_EXT)) {
      const descriptor: EmbedDescriptor = {
        kind: "video",
        provider: "file",
        src: u.toString(),
        aspectRatio: "16:9",
        params: { hls: true },
        csp: { mediaSrc: [origin] },
        raw: { url: u.toString() },
      };
      return descriptor;
    }
    if (endsWithAny(p, VIDEO_EXT)) {
      const descriptor: EmbedDescriptor = {
        kind: "video",
        provider: "file",
        src: u.toString(),
        aspectRatio: "16:9",
        params: { controls: true, playsinline: true, preload: "metadata" },
        csp: { mediaSrc: [origin] },
        raw: { url: u.toString() },
      };
      return descriptor;
    }
    const descriptor: EmbedDescriptor = {
      kind: "audio",
      provider: "file",
      src: u.toString(),
      aspectRatio: "auto",
      csp: { mediaSrc: [origin] },
      raw: { url: u.toString() },
    };
    return descriptor;
  },
};

export default adapter;


