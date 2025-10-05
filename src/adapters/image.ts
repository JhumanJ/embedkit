import { Adapter, EmbedDescriptor } from "../core/types.js";

const IMG_EXT = [".jpg", ".jpeg", ".png", ".gif", ".webp"];

function endsWithAny(path: string, exts: string[]): boolean {
  return exts.some((ext) => path.toLowerCase().endsWith(ext));
}

const adapter: Adapter = {
  name: "image",
  match(u) {
    return endsWithAny(u.pathname, IMG_EXT);
  },
  build(u) {
    const descriptor: EmbedDescriptor = {
      kind: "image",
      provider: "image",
      src: u.toString(),
      aspectRatio: "auto",
      raw: { url: u.toString() },
    };
    return descriptor;
  },
};

export default adapter;


