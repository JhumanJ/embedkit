import { Adapter, EmbedDescriptor, err } from "../core/types.js";
import { hostIs } from "../core/url.js";

const adapter: Adapter = {
  name: "loom",
  match(u: URL) {
    return hostIs(u, ["loom.com"]);
  },
  build(u: URL) {
    const parts = u.pathname.split("/").filter(Boolean);
    const idx = parts.indexOf("embed") >= 0 ? parts.indexOf("embed") : parts.indexOf("share");
    const id = idx >= 0 ? parts[idx + 1] : parts[0];
    if (!id) return err("MISSING_ID", "Missing Loom id");
    const src = `https://www.loom.com/embed/${encodeURIComponent(id)}`;
    const descriptor: EmbedDescriptor = {
      kind: "iframe",
      provider: "loom",
      providerUrl: "https://www.loom.com",
      id,
      src,
      aspectRatio: "16:9",
    };
    return descriptor;
  },
};

export default adapter;


