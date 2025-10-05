import { Ctx, ResolveError, err } from "./types.js";

export function normalizeInputUrl(input: string): URL | ResolveError {
  const raw = String(input || "").trim();
  if (!raw) return err("INVALID_URL", "Empty input");
  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    try {
      u = new URL(`http://${raw}`);
    } catch {
      return err("INVALID_URL", "Invalid URL");
    }
  }
  if (u.protocol !== "http:" && u.protocol !== "https:") {
    return err("INVALID_URL", "Unsupported URL scheme", { scheme: u.protocol });
  }
  // normalize host and force https
  try {
    u.hostname = u.hostname.toLowerCase();
  } catch {
    // ignore
  }
  if (u.protocol === "http:") {
    try {
      u.protocol = "https:";
    } catch {
      return err("PROVIDER_CONSTRAINT", "Provider does not support HTTPS");
    }
  }
  return u;
}

export function getOriginForCsp(u: URL): string {
  return `${u.protocol}//${u.host}`;
}

export function pickBoolean(u: URL, key: string): boolean | undefined {
  const v = u.searchParams.get(key);
  if (v == null) return undefined;
  if (v === "" || v === "1" || v.toLowerCase() === "true") return true;
  if (v === "0" || v.toLowerCase() === "false") return false;
  return undefined;
}

export function parseYouTubeStart(u: URL): number {
  const t = u.searchParams.get("t") || u.searchParams.get("start");
  if (!t) return 0;
  if (/^\d+$/.test(t)) return parseInt(t, 10);
  const m = /(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/i.exec(t);
  if (!m) return 0;
  const h = m[1] ? parseInt(m[1], 10) : 0;
  const mm = m[2] ? parseInt(m[2], 10) : 0;
  const s = m[3] ? parseInt(m[3], 10) : 0;
  return h * 3600 + mm * 60 + s;
}

export function boolToBinary(v: boolean | undefined): string | undefined {
  if (v == null) return undefined;
  return v ? "1" : "0";
}

export function hostIs(u: URL, hosts: string[]): boolean {
  const h = u.hostname.toLowerCase();
  return hosts.some((hn) => h === hn || h.endsWith(`.${hn}`));
}

export function ensureHttpsUrlString(s: string): string {
  if (s.startsWith("http://")) return s.replace(/^http:\/\//, "https://");
  return s;
}

export function commonCtx(u: URL, ctx: Ctx): Required<Pick<Ctx, "lang" | "theme">> & { hostname?: string } {
  return {
    hostname: ctx.hostname,
    lang: ctx.lang || "en",
    theme: ctx.theme || "light",
  };
}


