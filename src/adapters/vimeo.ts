import { Adapter, EmbedDescriptor, err } from "../core/types.js";
import { hostIs } from "../core/url.js";

const adapter: Adapter = {
  name: "vimeo",
  match(u) {
    return hostIs(u, ["vimeo.com"]);
  },
  build(u) {
    const first = u.pathname.split("/").filter(Boolean)[0];
    if (!first || !/^\d+$/.test(first)) return err("MISSING_ID", "Missing Vimeo numeric id");
    const id = first;
    const src = `https://player.vimeo.com/video/${id}`;
    const descriptor: EmbedDescriptor = {
      kind: "iframe",
      provider: "vimeo",
      providerUrl: "https://vimeo.com",
      id,
      src,
      aspectRatio: "16:9",
      csp: { frameSrc: ["https://player.vimeo.com"] },
    };
    return descriptor;
  },
};

export default adapter;


