import { Adapter, EmbedDescriptor, err } from "../core/types.js";
import { hostIs } from "../core/url.js";

const VALID_TYPES = new Set(["track", "album", "playlist", "episode", "show"]);

const adapter: Adapter = {
  name: "spotify",
  match(u) {
    return hostIs(u, ["open.spotify.com"]);
  },
  build(u) {
    const parts = u.pathname.split("/").filter(Boolean);
    const type = parts[0];
    const id = parts[1];
    if (!type || !VALID_TYPES.has(type) || !id) return err("UNSUPPORTED_PROVIDER", "Unsupported Spotify URL");
    const src = `https://open.spotify.com/embed/${type}/${encodeURIComponent(id)}`;
    const descriptor: EmbedDescriptor = {
      kind: "iframe",
      provider: "spotify",
      providerUrl: "https://open.spotify.com",
      id,
      src,
      aspectRatio: "auto",
    };
    return descriptor;
  },
};

export default adapter;


