import { Adapter, EmbedDescriptor, err } from "../core/types.js";
import { hostIs } from "../core/url.js";

const adapter: Adapter = {
  name: "streamable",
  match(u) {
    return hostIs(u, ["streamable.com"]);
  },
  build(u) {
    const id = u.pathname.split("/").filter(Boolean)[0];
    if (!id) return err("MISSING_ID", "Missing Streamable id");
    const src = `https://streamable.com/e/${encodeURIComponent(id)}`;
    const descriptor: EmbedDescriptor = {
      kind: "iframe",
      provider: "streamable",
      providerUrl: "https://streamable.com",
      id,
      src,
      aspectRatio: "16:9",
    };
    return descriptor;
  },
};

export default adapter;


