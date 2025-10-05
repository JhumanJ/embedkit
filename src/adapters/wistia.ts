import { Adapter, EmbedDescriptor, err } from "../core/types.js";
import { hostIs } from "../core/url.js";

const adapter: Adapter = {
  name: "wistia",
  match(u) {
    return hostIs(u, ["wistia.com", "wi.st"]);
  },
  build(u) {
    // Accept /medias/{id} or hashed id anywhere in path; simplest is last segment
    const parts = u.pathname.split("/").filter(Boolean);
    const id = parts[parts.length - 1];
    if (!id) return err("MISSING_ID", "Missing Wistia id");
    const src = `https://fast.wistia.net/embed/iframe/${encodeURIComponent(id)}`;
    const descriptor: EmbedDescriptor = {
      kind: "iframe",
      provider: "wistia",
      providerUrl: "https://wistia.com",
      id,
      src,
      aspectRatio: "16:9",
    };
    return descriptor;
  },
};

export default adapter;


