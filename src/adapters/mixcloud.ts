import { Adapter, EmbedDescriptor } from "../core/types.js";
import { hostIs } from "../core/url.js";

const adapter: Adapter = {
  name: "mixcloud",
  match(u) {
    return hostIs(u, ["mixcloud.com"]);
  },
  build(u) {
    const encoded = encodeURIComponent(u.toString());
    const src = `https://www.mixcloud.com/widget/iframe/?feed=${encoded}`;
    const descriptor: EmbedDescriptor = {
      kind: "iframe",
      provider: "mixcloud",
      providerUrl: "https://www.mixcloud.com",
      src,
      aspectRatio: "auto",
    };
    return descriptor;
  },
};

export default adapter;


