import { Adapter } from "../core/types.js";

const registry: Adapter[] = [];

export function registerAdapter(adapter: Adapter): void {
  const exists = registry.some((a) => a.name === adapter.name);
  if (!exists) registry.push(adapter);
}

export function getAdapters(): Adapter[] {
  return registry.slice();
}

// Pre-register built-in adapters by importing their modules for side-effects
// Each module should default-export an Adapter and call registerAdapter here.
import yt from "./youtube.js";
import vimeo from "./vimeo.js";
import dailymotion from "./dailymotion.js";
import loom from "./loom.js";
import tella from "./tella.js";
import wistia from "./wistia.js";
import streamable from "./streamable.js";
import twitch from "./twitch.js";
import facebook from "./facebook.js";
import soundcloud from "./soundcloud.js";
import spotify from "./spotify.js";
import mixcloud from "./mixcloud.js";
import giphy from "./giphy.js";
import twitter from "./twitter.js";
import gdrive from "./gdrive.js";
import file from "./file.js";
import image from "./image.js";
import bandcamp from "./bandcamp.js";

// Ensure they're retained (some bundlers treeshake imports if unused)
registerAdapter(yt);
registerAdapter(vimeo);
registerAdapter(dailymotion);
registerAdapter(loom);
registerAdapter(tella);
registerAdapter(wistia);
registerAdapter(streamable);
registerAdapter(twitch);
registerAdapter(facebook);
registerAdapter(soundcloud);
registerAdapter(spotify);
registerAdapter(mixcloud);
registerAdapter(giphy);
registerAdapter(twitter);
registerAdapter(gdrive);
registerAdapter(file);
registerAdapter(image);
registerAdapter(bandcamp);

export { registry };


