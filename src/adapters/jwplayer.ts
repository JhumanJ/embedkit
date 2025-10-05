import { Adapter, EmbedDescriptor, err } from "../core/types.js";
import { hostIs } from "../core/url.js";

// JW Player cloud-hosted embeds
// https://cdn.jwplayer.com/players/{mediaId}-{playerId}.html

const adapter: Adapter = {
  name: "jwplayer",
  match(u) {
    return hostIs(u, ["cdn.jwplayer.com"]);
  },
  build(u) {
    const parts = u.pathname.split("/").filter(Boolean);
    const playersIdx = parts.indexOf("players");
    const slug = playersIdx >= 0 ? parts[playersIdx + 1] : undefined; // {mediaId}-{playerId}.html
    if (!slug) return err("MISSING_ID", "Missing JW Player slug");
    const id = slug.replace(/\.html$/, "");
    const src = `https://cdn.jwplayer.com/players/${encodeURIComponent(id)}.html`;
    const descriptor: EmbedDescriptor = {
      kind: "iframe",
      provider: "jwplayer",
      providerUrl: "https://www.jwplayer.com",
      id,
      src,
      aspectRatio: "16:9",
      csp: { frameSrc: ["https://cdn.jwplayer.com"] },
    };
    return descriptor;
  },
};

export default adapter;


