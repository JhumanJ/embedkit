import { Adapter, EmbedDescriptor } from "../core/types.js";
import { hostIs } from "../core/url.js";

function extractId(u: URL): string | null {
  const parts = u.pathname.split("/").filter(Boolean);
  const gifsIdx = parts.indexOf("gifs");
  if (gifsIdx >= 0) {
    const slug = parts[gifsIdx + 1] || "";
    const m = slug.match(/-(\w+)$/);
    if (m) return m[1];
  }
  const embIdx = parts.indexOf("embed");
  if (embIdx >= 0 && parts[embIdx + 1]) return parts[embIdx + 1];
  return null;
}

const adapter: Adapter = {
  name: "giphy",
  match(u) {
    return hostIs(u, ["giphy.com"]);
  },
  build(u) {
    const id = extractId(u);
    if (!id) return { ok: false, code: "MISSING_ID", message: "Missing GIPHY id" } as const;
    const src = `https://giphy.com/embed/${encodeURIComponent(id)}`;
    const descriptor: EmbedDescriptor = {
      kind: "iframe",
      provider: "giphy",
      providerUrl: "https://giphy.com",
      id,
      src,
      aspectRatio: "auto",
    };
    return descriptor;
  },
};

export default adapter;


