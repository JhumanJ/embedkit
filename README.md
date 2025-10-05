# EmbedKit

[![npm version](https://img.shields.io/npm/v/embedkit.svg)](https://www.npmjs.com/package/embedkit)

Transform a user URL into a normalized embed JSON descriptor — no network calls, no SDKs. Works in Node and browsers. TypeScript-first.

## Install

```bash
npm install embedkit
```

## Quick start

```ts
import { resolveEmbed, isSupported } from "embedkit";

const res = resolveEmbed("https://youtu.be/dQw4w9WgXcQ?t=43", {
  preferLang: "fr",
  theme: "dark",
  hostname: "app.example.com", // required by some providers (e.g. Twitch)
});

if (res.ok) {
  // Decide how to render based on res.descriptor.kind
  console.log(res.descriptor);
} else {
  console.warn(res.code, res.message);
}
```

## Examples

### YouTube

- Input:

```text
https://youtu.be/dQw4w9WgXcQ?t=43
# also works:
# https://www.youtube.com/watch?t=43&v=dQw4w9WgXcQ&feature=youtu.be
```

- Output (resolveEmbed result):

```json
{
  "ok": true,
  "descriptor": {
    "kind": "iframe",
    "provider": "youtube",
    "providerUrl": "https://www.youtube.com",
    "id": "dQw4w9WgXcQ",
    "src": "https://www.youtube.com/embed/dQw4w9WgXcQ?modestbranding=1&rel=0&start=43",
    "aspectRatio": "16:9",
    "attrs": {
      "allow": "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
      "sandbox": "allow-scripts allow-same-origin allow-presentation allow-popups",
      "referrerpolicy": "strict-origin-when-cross-origin",
      "loading": "lazy",
      "allowfullscreen": true
    },
    "csp": {
      "frameSrc": [
        "https://www.youtube.com",
        "https://www.youtube-nocookie.com"
      ]
    },
    "raw": {
      "url": "https://youtu.be/dQw4w9WgXcQ?t=43",
      "matchedPattern": "youtu.be"
    }
  }
}
```

## Why this is useful

- **Paste a URL, get an embed**: Users don’t need to know about provider-specific embed URLs or `<iframe>` parameters. They paste a link; you render the right thing.
- **No SDKs or network calls**: Works offline/edge; great for SSR and privacy-sensitive setups.
- **Consistent shape**: You always receive a normalized descriptor to render securely and consistently.

### Paste-URL flow (typical UI)

```ts
import { resolveEmbed } from "embedkit";

function handleSubmit(url: string) {
  const res = resolveEmbed(url, { hostname: location.hostname });
  if (!res.ok) return showError(res.message);

  const d = res.descriptor;
  if (d.kind === "iframe") {
    // e.g. <iframe src={d.src} {...d.attrs} />
  } else if (d.kind === "video") {
    // e.g. <video src={d.src} controls />
  } else if (d.kind === "audio") {
    // e.g. <audio src={d.src} controls />
  } else if (d.kind === "image") {
    // e.g. <img src={d.src} alt={d.title ?? ""} />
  }
}
```

## What it does

- Detects provider from a URL
- Extracts identifiers and useful parameters (e.g. YouTube start time)
- Returns a normalized JSON descriptor for safe, client-only rendering
- No network requests, no oEmbed

## Supported providers (v1)

- youtube, vimeo, dailymotion, loom, tella, wistia, streamable, twitch, facebook, soundcloud, spotify, mixcloud, bandcamp (unsupported by design in v1), giphy, twitter, gdrive, file, image

## API

```ts
export type EmbedKind = "iframe" | "video" | "audio" | "image" | "link";
export type AspectRatio = "16:9" | "9:16" | "4:3" | "1:1" | "auto";

export interface EmbedDescriptor {
  /* see src/core/types.ts */
}

export type ResolveErrorCode =
  | "INVALID_URL"
  | "UNSUPPORTED_PROVIDER"
  | "MISSING_ID"
  | "PROVIDER_CONSTRAINT"
  | "INTERNAL_ERROR";

export type ResolveResult = ResolveSuccess | ResolveError;

export function resolveEmbed(
  input: string,
  opts?: { preferLang?: string; theme?: "light" | "dark"; hostname?: string }
): ResolveResult;
export function isSupported(url: string): boolean;
export function registerAdapter(adapter: Adapter): void;
```

### Security and CSP

- Always returns HTTPS `src`; otherwise fails with `PROVIDER_CONSTRAINT`.
- Provides `descriptor.csp.frameSrc`/`mediaSrc` so your app can build a strict CSP.
- Applies safe default `iframe` attributes if not overridden: `sandbox`, `referrerpolicy`, `loading`, `allowfullscreen`. Some providers add `allow`.

### Rendering guidance

- kind "iframe": render an `<iframe>` with `descriptor.attrs`
- kind "video"/"audio": render `<video>/<audio>` with your own attributes; `params` may include flags like `hls`, `autoplay`, `muted`
- kind "image": render `<img>`

## Extensibility

You can register your own adapters:

```ts
import { registerAdapter } from "embedkit";

registerAdapter({
  name: "mycdn",
  match(u) {
    return u.hostname.endsWith("mycdn.example");
  },
  build(u) {
    return {
      kind: "video",
      provider: "mycdn",
      src: u.toString(),
      aspectRatio: "16:9",
    };
  },
});
```

## Development

- Node 18+ recommended
- Build: `npm run build`
- Tests: `npm test` (Node test runner)

## License

MIT
