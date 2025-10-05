import { Adapter, Ctx, DefaultIframeAttrs, EmbedDescriptor, ResolveError, ResolveResult, err, isOk, isError } from "./core/types.js";
import { normalizeInputUrl } from "./core/url.js";
import { getAdapters, registerAdapter } from "./adapters/index.js";

export type { Adapter, Ctx } from "./core/types.js";
export type { EmbedDescriptor, ResolveError, ResolveResult } from "./core/types.js";

export function isSupported(input: string): boolean {
  const parsed = normalizeInputUrl(input);
  if ((parsed as ResolveError).ok === false) return false;
  const u = parsed as URL;
  return getAdapters().some((a) => a.match(u));
}

export function resolveEmbed(
  input: string,
  opts?: { preferLang?: string; theme?: "light" | "dark"; hostname?: string }
): ResolveResult {
  const parsed = normalizeInputUrl(input);
  if ((parsed as ResolveError).ok === false) return parsed as ResolveError;
  const u = parsed as URL;
  const ctx: Ctx = { lang: opts?.preferLang, theme: opts?.theme, hostname: opts?.hostname };

  const adapters = getAdapters();
  const adapter = adapters.find((a) => a.match(u));
  if (!adapter) return err("UNSUPPORTED_PROVIDER", "Provider not recognized", { url: u.toString() });

  const builtOrErr = adapter.build(u, ctx);
  if (isError(builtOrErr)) return builtOrErr;
  const descriptorInput = builtOrErr as EmbedDescriptor;

  const descriptor: EmbedDescriptor = {
    ...descriptorInput,
    raw: {
      url: u.toString(),
      matchedPattern: descriptorInput.raw?.matchedPattern || adapter.name,
    },
  };

  if (!descriptor.kind) return err("INTERNAL_ERROR", "Missing kind in descriptor");
  if (!descriptor.src || !descriptor.src.startsWith("https://")) {
    return err("PROVIDER_CONSTRAINT", "Embed src must be HTTPS");
  }

  if (descriptor.kind === "iframe") {
    descriptor.attrs = { ...DefaultIframeAttrs, ...(descriptor.attrs || {}) };
  }

  return { ok: true, descriptor };
}

export { registerAdapter };


