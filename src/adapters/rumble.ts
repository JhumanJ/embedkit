import { Adapter, EmbedDescriptor, err } from "../core/types.js";
import { hostIs } from "../core/url.js";

function extractId(u: URL): string | null {
  // Typical: https://rumble.com/vabc123-title.html -> id: vabc123
  // Embed: https://rumble.com/embed/vabc123
  const parts = u.pathname.split("/").filter(Boolean);
  const seg = parts.find((p) => /^v[\w]+/.test(p));
  if (!seg) return null;
  return seg.replace(/\.html$/, "");
}

const adapter: Adapter = {
  name: "rumble",
  match(u) {
    return hostIs(u, ["rumble.com"]);
  },
  build(u) {
    const id = extractId(u);
    if (!id) return err("MISSING_ID", "Missing Rumble id");
    const src = `https://rumble.com/embed/${encodeURIComponent(id)}`;
    const descriptor: EmbedDescriptor = {
      kind: "iframe",
      provider: "rumble",
      providerUrl: "https://rumble.com",
      id,
      src,
      aspectRatio: "16:9",
      csp: { frameSrc: ["https://rumble.com"] },
    };
    return descriptor;
  },
};

export default adapter;


