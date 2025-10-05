export type EmbedKind = "iframe" | "video" | "audio" | "image" | "link";

export type AspectRatio = "16:9" | "9:16" | "4:3" | "1:1" | "auto";

export interface EmbedDescriptor {
  kind: EmbedKind;
  provider: string;
  providerUrl?: string;
  id?: string;
  src: string;
  aspectRatio: AspectRatio;
  width?: number;
  height?: number;
  title?: string;
  thumbnailUrl?: string;
  attrs?: {
    allow?: string;
    sandbox?: string;
    referrerpolicy?: string;
    allowfullscreen?: boolean;
    frameborder?: string;
    loading?: "lazy" | "eager";
    [k: string]: string | number | boolean | undefined;
  };
  params?: Record<string, string | number | boolean>;
  csp?: {
    frameSrc?: string[];
    mediaSrc?: string[];
  };
  raw?: {
    url: string;
    matchedPattern?: string;
  };
}

export type ResolveErrorCode =
  | "INVALID_URL"
  | "UNSUPPORTED_PROVIDER"
  | "MISSING_ID"
  | "PROVIDER_CONSTRAINT"
  | "INTERNAL_ERROR";

export interface ResolveError {
  ok: false;
  code: ResolveErrorCode;
  message: string;
  details?: Record<string, unknown>;
}

export interface ResolveSuccess {
  ok: true;
  descriptor: EmbedDescriptor;
}

export type ResolveResult = ResolveSuccess | ResolveError;

export interface Ctx {
  hostname?: string;
  lang?: string;
  theme?: "light" | "dark";
}

export type Adapter = {
  name: string; // provider id per naming convention
  match(u: URL): boolean;
  build(u: URL, ctx: Ctx): EmbedDescriptor | ResolveError;
};

export const DefaultIframeAttrs: Required<Pick<NonNullable<EmbedDescriptor["attrs"]>,
  "sandbox" | "referrerpolicy" | "loading" | "allowfullscreen"
>> & { allow?: string } = {
  allow: "autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share",
  sandbox: "allow-scripts allow-same-origin allow-presentation allow-popups",
  referrerpolicy: "strict-origin-when-cross-origin",
  loading: "lazy",
  allowfullscreen: true,
};

export function err(code: ResolveErrorCode, message: string, details?: Record<string, unknown>): ResolveError {
  return { ok: false, code, message, details };
}

export function isOk(r: ResolveResult): r is ResolveSuccess {
  return (r as ResolveSuccess).ok === true;
}

export function isError(x: unknown): x is ResolveError {
  return typeof x === "object" && x !== null && (x as any).ok === false;
}


