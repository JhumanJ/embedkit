import { Adapter, EmbedDescriptor, err } from "../core/types.js";
import { hostIs } from "../core/url.js";

const adapter: Adapter = {
  name: "dailymotion",
  match(u) {
    return hostIs(u, ["dailymotion.com"]);
  },
  build(u) {
    const parts = u.pathname.split("/").filter(Boolean);
    const idx = parts.indexOf("video");
    const id = idx >= 0 ? parts[idx + 1] : undefined;
    if (!id) return err("MISSING_ID", "Missing Dailymotion id");
    const src = `https://www.dailymotion.com/embed/video/${encodeURIComponent(id)}`;
    const descriptor: EmbedDescriptor = {
      kind: "iframe",
      provider: "dailymotion",
      providerUrl: "https://www.dailymotion.com",
      id,
      src,
      aspectRatio: "16:9",
    };
    return descriptor;
  },
};

export default adapter;


