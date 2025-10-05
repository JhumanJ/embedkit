import { Adapter, EmbedDescriptor, err } from "../core/types.js";
import { hostIs } from "../core/url.js";

const adapter: Adapter = {
  name: "tella",
  match(u) {
    return hostIs(u, ["tella.tv"]);
  },
  build(u) {
    const parts = u.pathname.split("/").filter(Boolean);
    let id: string | undefined;
    const vidIdx = parts.indexOf("video");
    const embIdx = parts.indexOf("embed");
    if (vidIdx >= 0) id = parts[vidIdx + 1];
    else if (embIdx >= 0) id = parts[embIdx + 1];
    if (!id) return err("MISSING_ID", "Missing Tella id");
    const src = `https://tella.tv/embed/${encodeURIComponent(id)}`;
    const descriptor: EmbedDescriptor = {
      kind: "iframe",
      provider: "tella",
      providerUrl: "https://tella.tv",
      id,
      src,
      aspectRatio: "16:9",
    };
    return descriptor;
  },
};

export default adapter;


