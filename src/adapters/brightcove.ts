import { Adapter, EmbedDescriptor, err } from "../core/types.js";
import { hostIs } from "../core/url.js";

// Brightcove embed patterns vary by account; we'll support the standard players.brightcove.net format
// https://players.brightcove.net/{accountId}/{playerId}_default/index.html?videoId={videoId}

const adapter: Adapter = {
  name: "brightcove",
  match(u) {
    return hostIs(u, ["players.brightcove.net"]);
  },
  build(u) {
    const parts = u.pathname.split("/").filter(Boolean);
    const accountId = parts[0];
    const playerSeg = parts[1];
    const hasIndex = parts.includes("index.html");
    const videoId = u.searchParams.get("videoId") || undefined;
    if (!accountId || !playerSeg || !hasIndex || !videoId) {
      return err("MISSING_ID", "Missing Brightcove parameters");
    }
    const src = u.toString();
    const descriptor: EmbedDescriptor = {
      kind: "iframe",
      provider: "brightcove",
      providerUrl: "https://www.brightcove.com",
      id: videoId,
      src,
      aspectRatio: "16:9",
      csp: { frameSrc: ["https://players.brightcove.net"] },
    };
    return descriptor;
  },
};

export default adapter;


