import { Adapter, EmbedDescriptor, err } from "../core/types.js";
import { hostIs } from "../core/url.js";

function extractId(u: URL): string | null {
  // https://share.vidyard.com/watch/{id}
  // https://play.vidyard.com/{id}
  const parts = u.pathname.split("/").filter(Boolean);
  if (hostIs(u, ["share.vidyard.com"])) {
    const idx = parts.indexOf("watch");
    return idx >= 0 ? parts[idx + 1] || null : null;
  }
  return parts[0] || null;
}

const adapter: Adapter = {
  name: "vidyard",
  match(u) {
    return hostIs(u, ["vidyard.com", "share.vidyard.com", "play.vidyard.com"]);
  },
  build(u) {
    const id = extractId(u);
    if (!id) return err("MISSING_ID", "Missing Vidyard id");
    const src = `https://play.vidyard.com/${encodeURIComponent(id)}.html`;
    const descriptor: EmbedDescriptor = {
      kind: "iframe",
      provider: "vidyard",
      providerUrl: "https://www.vidyard.com",
      id,
      src,
      aspectRatio: "16:9",
    };
    return descriptor;
  },
};

export default adapter;


