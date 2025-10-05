import { Adapter, EmbedDescriptor } from "../core/types.js";
import { commonCtx, hostIs } from "../core/url.js";

const TWEET_RE = /\/status\/(\d+)/;

const adapter: Adapter = {
  name: "twitter",
  match(u) {
    return hostIs(u, ["twitter.com", "x.com"]);
  },
  build(u, ctx) {
    const m = u.pathname.match(TWEET_RE);
    const id = m?.[1];
    if (!id) return { ok: false, code: "MISSING_ID", message: "Missing tweet id" } as const;
    const c = commonCtx(u, ctx);
    const src = `https://platform.twitter.com/embed/Tweet.html?id=${encodeURIComponent(id)}&theme=${encodeURIComponent(c.theme)}&lang=${encodeURIComponent(c.lang)}&dnt=true`;
    const descriptor: EmbedDescriptor = {
      kind: "iframe",
      provider: "twitter",
      providerUrl: "https://twitter.com",
      id,
      src,
      aspectRatio: "auto",
      attrs: {
        // Allow list intentionally small for twitter
        sandbox: "allow-scripts allow-same-origin allow-popups",
      },
      csp: { frameSrc: ["https://platform.twitter.com", "https://*.twimg.com"] },
    };
    return descriptor;
  },
};

export default adapter;


