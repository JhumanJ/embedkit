import { Adapter, EmbedDescriptor, err } from "../core/types.js";
import { hostIs } from "../core/url.js";

function extractId(u: URL): { bvid?: string; aid?: string } {
  // Support BV videos: https://www.bilibili.com/video/BV1xx411c7mD
  // Fallback to av (aid) if present in query or path
  const parts = u.pathname.split("/").filter(Boolean);
  const videoIdx = parts.indexOf("video");
  if (videoIdx >= 0 && parts[videoIdx + 1]) {
    const seg = parts[videoIdx + 1];
    if (/^BV/i.test(seg)) return { bvid: seg };
    if (/^av\d+$/i.test(seg)) return { aid: seg.replace(/^av/i, "") };
  }
  const aid = u.searchParams.get("aid") || undefined;
  if (aid) return { aid };
  return {};
}

const adapter: Adapter = {
  name: "bilibili",
  match(u) {
    return hostIs(u, ["bilibili.com"]);
  },
  build(u) {
    const { bvid, aid } = extractId(u);
    if (!bvid && !aid) return err("MISSING_ID", "Missing Bilibili id");
    const qs = new URLSearchParams();
    if (bvid) qs.set("bvid", bvid);
    if (aid) qs.set("aid", aid);
    const src = `https://player.bilibili.com/player.html?${qs.toString()}`;
    const descriptor: EmbedDescriptor = {
      kind: "iframe",
      provider: "bilibili",
      providerUrl: "https://www.bilibili.com",
      id: bvid || aid,
      src,
      aspectRatio: "16:9",
      csp: { frameSrc: ["https://player.bilibili.com"] },
    };
    return descriptor;
  },
};

export default adapter;


