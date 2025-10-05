import { Adapter, EmbedDescriptor, ResolveError, err } from "../core/types.js";
import { hostIs } from "../core/url.js";

function buildSrc(u: URL, parent?: string): { src?: string; error?: ResolveError } {
  const parts = u.pathname.split("/").filter(Boolean);
  const isVideo = parts[0] === "videos" || parts[0] === "video";
  if (!parent) return { error: err("PROVIDER_CONSTRAINT", "Twitch requires parent hostname in ctx") };

  if (isVideo) {
    const id = parts[1] || u.searchParams.get("video");
    if (!id) return { error: err("MISSING_ID", "Missing Twitch VOD id") };
    return { src: `https://player.twitch.tv/?video=${encodeURIComponent(id)}&parent=${encodeURIComponent(parent)}` };
  }

  // channel name is first segment
  const channel = parts[0];
  if (!channel) return { error: err("MISSING_ID", "Missing Twitch channel name") };
  return { src: `https://player.twitch.tv/?channel=${encodeURIComponent(channel)}&parent=${encodeURIComponent(parent)}` };
}

const adapter: Adapter = {
  name: "twitch",
  match(u) {
    return hostIs(u, ["twitch.tv"]);
  },
  build(u, ctx) {
    const { src, error } = buildSrc(u, ctx.hostname);
    if (error) return error;
    const descriptor: EmbedDescriptor = {
      kind: "iframe",
      provider: "twitch",
      providerUrl: "https://www.twitch.tv",
      src: src!,
      aspectRatio: "16:9",
      csp: { frameSrc: ["https://player.twitch.tv"] },
    };
    return descriptor;
  },
};

export default adapter;


