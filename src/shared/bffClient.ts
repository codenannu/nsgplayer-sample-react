/**
 * Thin browser client for the Next.js BFF sample (nsgplayer-nextjs :3001).
 * Keep identical across nsgplayer-react / nsgplayer-nextjs / nsgplayer-angular `src/shared/`.
 *
 * Contract (no secrets in the browser):
 *   POST /api/auth-token                 (stub when BFF uses static bearer)
 *   GET  /api/videos/:videoId/signed-url (sends x-device-id)
 *   POST /api/videos/:videoId/proxy-refresh
 *   GET  /api/media?url=                 (playlist / segment / key proxy)
 *   GET  /api/hls/key?...                (legacy key proxy; prefer /api/media)
 *
 * The browser must not call the playback host directly. Use mediaProxyUrlBuilder.
 */

import type {
  AuthConfig,
  AuthToken,
  PlaybackCredentialConfig,
  PlaybackSource,
  StreamingConfig,
} from "@codenkay/video-nsgplayer-core";
import { getOrCreateDeviceId } from "./deviceId";

export const DEFAULT_BFF_ORIGIN = "http://localhost:3001";

export function normalizeBffOrigin(origin: string): string {
  return origin.replace(/\/$/, "");
}

async function readJsonOrThrow<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `BFF request failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

function deviceHeaders(): HeadersInit {
  return {
    "x-device-id": getOrCreateDeviceId(),
  };
}

/** Auth adapter pointing at an absolute BFF origin (or "" for same-origin). */
export function createBffAuth(origin: string): AuthConfig {
  const base = normalizeBffOrigin(origin);
  return {
    getToken: async (ctx) =>
      readJsonOrThrow<AuthToken>(
        await fetch(`${base}/api/auth-token`, {
          method: "POST",
          headers: { "content-type": "application/json", ...deviceHeaders() },
          body: JSON.stringify(ctx ?? {}),
        }),
      ),
  };
}

/** Playback adapters pointing at an absolute BFF origin (or "" for same-origin). */
export function createBffPlayback(origin: string): PlaybackCredentialConfig {
  const base = normalizeBffOrigin(origin);
  return {
    getSource: async ({ videoId }) =>
      readJsonOrThrow<PlaybackSource>(
        await fetch(
          `${base}/api/videos/${encodeURIComponent(videoId)}/signed-url`,
          { headers: deviceHeaders() },
        ),
      ),
    refreshSource: async ({ videoId }) =>
      readJsonOrThrow<PlaybackSource>(
        await fetch(
          `${base}/api/videos/${encodeURIComponent(videoId)}/proxy-refresh`,
          {
            method: "POST",
            headers: {
              "content-type": "application/json",
              ...deviceHeaders(),
            },
            body: "{}",
          },
        ),
      ),
  };
}

/**
 * Streaming config for BFF mode: same-origin media proxy (required) plus
 * legacy keyProxyUrlBuilder for older callers.
 */
export function createBffStreamingConfig(origin: string): StreamingConfig {
  const base = normalizeBffOrigin(origin);
  return {
    keyProxyMaxFailures: 2,
    mediaProxyUrlBuilder: ({ url }) =>
      `${base}/api/media?url=${encodeURIComponent(url)}`,
    keyProxyUrlBuilder: ({
      videoId,
      keyUrl,
      token,
      expires,
      username,
      mobile,
    }) => {
      const params = new URLSearchParams({ url: keyUrl, videoId });
      if (token) params.set("token", token);
      if (expires) params.set("expires", expires);
      if (username) params.set("username", username);
      if (mobile) params.set("mobile", mobile);
      return `${base}/api/hls/key?${params.toString()}`;
    },
  };
}

export type BffAdapters = {
  auth: AuthConfig;
  playback: PlaybackCredentialConfig;
  streaming: StreamingConfig;
};

/** Full BFF client bundle used by React / Angular / Next playgrounds. */
export function createBffAdapters(origin: string): BffAdapters {
  return {
    auth: createBffAuth(origin),
    playback: createBffPlayback(origin),
    streaming: createBffStreamingConfig(origin),
  };
}
