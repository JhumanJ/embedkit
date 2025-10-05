import { Adapter } from "../core/types.js";
import { hostIs } from "../core/url.js";

// For v1 we return unsupported unless trivial pattern is provided
const adapter: Adapter = {
  name: "bandcamp",
  match(u) {
    return hostIs(u, ["bandcamp.com"]);
  },
  build() {
    return { ok: false, code: "UNSUPPORTED_PROVIDER", message: "Bandcamp not trivially supported in v1" } as const;
  },
};

export default adapter;


