import { Adapter, EmbedDescriptor } from "../core/types.js";
import { hostIs } from "../core/url.js";

const adapter: Adapter = {
  name: "soundcloud",
  match(u) {
    return hostIs(u, ["soundcloud.com"]);
  },
  build(u) {
    const encoded = encodeURIComponent(u.toString());
    const src = `https://w.soundcloud.com/player/?url=${encoded}`;
    const descriptor: EmbedDescriptor = {
      kind: "iframe",
      provider: "soundcloud",
      providerUrl: "https://soundcloud.com",
      src,
      aspectRatio: "auto",
      csp: { frameSrc: ["https://w.soundcloud.com"] },
    };
    return descriptor;
  },
};

export default adapter;


