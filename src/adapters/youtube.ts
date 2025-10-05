import { Adapter, EmbedDescriptor, err } from "../core/types.js";
import { hostIs, parseYouTubeStart } from "../core/url.js";

function extractId(u: URL): string | null {
  // youtu.be/{id}
  if (hostIs(u, ["youtu.be"])) {
    const id = u.pathname.split("/").filter(Boolean)[0];
    return id || null;
  }
  // youtube.com/watch?v=...
  const v = u.searchParams.get("v");
  if (v) return v;
  // shorts/{id} => normalize to id
  const parts = u.pathname.split("/").filter(Boolean);
  const shortsIdx = parts.indexOf("shorts");
  if (shortsIdx >= 0 && parts[shortsIdx + 1]) return parts[shortsIdx + 1];
  return null;
}

const adapter: Adapter = {
  name: "youtube",
  match(u) {
    return hostIs(u, ["youtube.com", "m.youtube.com", "youtu.be"]);
  },
  build(u) {
    const id = extractId(u);
    if (!id) return err("MISSING_ID", "Missing YouTube video id");
    const start = parseYouTubeStart(u);
    const params = new URLSearchParams();
    params.set("modestbranding", "1");
    params.set("rel", "0");
    if (start > 0) params.set("start", String(start));

    const src = `https://www.youtube.com/embed/${encodeURIComponent(id)}?${params.toString()}`;

    const descriptor: EmbedDescriptor = {
      kind: "iframe",
      provider: "youtube",
      providerUrl: "https://www.youtube.com",
      id,
      src,
      aspectRatio: "16:9",
      attrs: {
        allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
      },
      csp: { frameSrc: ["https://www.youtube.com", "https://www.youtube-nocookie.com"] },
      raw: { url: u.toString(), matchedPattern: hostIs(u, ["youtu.be"]) ? "youtu.be" : "youtube.com" },
    };
    return descriptor;
  },
};

export default adapter;


