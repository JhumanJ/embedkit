import { Adapter, EmbedDescriptor, err } from "../core/types.js";
import { hostIs } from "../core/url.js";

const adapter: Adapter = {
  name: "gdrive",
  match(u) {
    return hostIs(u, ["drive.google.com"]);
  },
  build(u) {
    const parts = u.pathname.split("/").filter(Boolean);
    const fileIdx = parts.indexOf("file");
    const id = fileIdx >= 0 ? parts[fileIdx + 2] : undefined; // file/d/{id}
    if (!id) return err("MISSING_ID", "Missing Google Drive file id");
    const isDownload = u.searchParams.get("export") === "download";
    if (isDownload) {
      // Switch to video kind if .mp4 likely, but we cannot know without network; keep iframe preview for v1
    }
    const src = `https://drive.google.com/file/d/${encodeURIComponent(id)}/preview`;
    const descriptor: EmbedDescriptor = {
      kind: "iframe",
      provider: "gdrive",
      providerUrl: "https://drive.google.com",
      id,
      src,
      aspectRatio: "16:9",
    };
    return descriptor;
  },
};

export default adapter;


