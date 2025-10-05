import { Adapter, EmbedDescriptor, err } from "../core/types.js";
import { hostIs } from "../core/url.js";

function isObviouslyPrivate(u: URL): boolean {
  // Heuristic: presence of groups, profile, or non-public paths
  const p = u.pathname.toLowerCase();
  return p.includes("/groups/") || p.includes("/profile.php") || p.includes("/people/");
}

const adapter: Adapter = {
  name: "facebook",
  match(u) {
    return hostIs(u, ["facebook.com", "fb.watch"]);
  },
  build(u) {
    if (isObviouslyPrivate(u)) {
      return err("PROVIDER_CONSTRAINT", "Facebook content likely non-public");
    }
    const encoded = encodeURIComponent(u.toString());
    const src = `https://www.facebook.com/plugins/video.php?href=${encoded}`;
    const descriptor: EmbedDescriptor = {
      kind: "iframe",
      provider: "facebook",
      providerUrl: "https://www.facebook.com",
      src,
      aspectRatio: "16:9",
    };
    return descriptor;
  },
};

export default adapter;


