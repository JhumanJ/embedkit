import { Adapter, EmbedDescriptor } from "../core/types.js";
import { hostIs } from "../core/url.js";

function extractIdFromIframeHost(u: URL): string | null {
  // https://iframe.videodelivery.net/{id}
  const parts = u.pathname.split("/").filter(Boolean);
  return parts[0] || null;
}

function isHls(u: URL): boolean {
  return /\.(m3u8)(\?|$)/i.test(u.pathname);
}

const adapter: Adapter = {
  name: "cloudflare-stream",
  match(u) {
    return hostIs(u, ["videodelivery.net", "iframe.videodelivery.net", "watch.cloudflarestream.com"]);
  },
  build(u) {
    if (hostIs(u, ["iframe.videodelivery.net"])) {
      const id = extractIdFromIframeHost(u);
      if (id) {
        const src = `https://iframe.videodelivery.net/${encodeURIComponent(id)}`;
        const descriptor: EmbedDescriptor = {
          kind: "iframe",
          provider: "cloudflare-stream",
          providerUrl: "https://www.cloudflare.com/products/cloudflare-stream/",
          id,
          src,
          aspectRatio: "16:9",
          csp: { frameSrc: ["https://iframe.videodelivery.net"] },
        };
        return descriptor;
      }
    }
    // Direct media under videodelivery.net (HLS/mp4)
    const descriptor: EmbedDescriptor = {
      kind: "video",
      provider: "file",
      src: u.toString(),
      aspectRatio: "16:9",
      csp: { mediaSrc: [`${u.protocol}//${u.host}`] },
      raw: { url: u.toString(), matchedPattern: "cloudflare-stream" },
    };
    if (isHls(u)) descriptor.params = { hls: true };
    return descriptor;
  },
};

export default adapter;


