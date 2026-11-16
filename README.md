# NSG Player — React sample

Public playground for the NSG HLS video player SDK. Vite + React + full control chrome.

| | |
|--|--|
| Port | **5173** |
| Repo | [nsgplayer-sample-react](https://github.com/codenannu/nsgplayer-sample-react) |
| SDK (pinned) | core **^5.4.0** · react **^5.2.0** · ui **^5.3.0** |
| Modes | Direct `sourceUrl` (default) · **BFF video ID** via Next sample **:3001** |

> This sample is **standalone**. It does **not** require cloning the private SDK monorepo. It installs packages from **npm** only.

## What’s new in this release

- Pins enterprise SDK line (core 5.4 / react 5.2 / ui 5.3).
- BFF mode sends **`x-device-id`** and uses **`streaming.mediaProxyUrlBuilder`** → Next `/api/media` (browser never hits the playback host).
- UI **5.3.0**: idle toolbar (5s / leave ~1.2s) + bottom-edge progress, responsive chrome, lease error states.
- React **5.2.0**: `useStudentLease` available for institution student flows (see core docs); this playground stays on signed-url BFF.

## SDK packages

| Package | Role | Used here |
|---------|------|-----------|
| [`@codenkay/video-nsgplayer-core`](https://www.npmjs.com/package/@codenkay/video-nsgplayer-core) | Framework-agnostic HLS engine | Yes (peer of UI) |
| [`@codenkay/video-nsgplayer-react`](https://www.npmjs.com/package/@codenkay/video-nsgplayer-react) | React shell / headless `<VideoPlayer />` | Yes (peer of UI) |
| [`@codenkay/video-nsgplayer-ui`](https://www.npmjs.com/package/@codenkay/video-nsgplayer-ui) | Control chrome (seek, quality, speed, live, zoom) | **Primary** |
| [`@codenkay/video-nsgplayer-angular`](https://www.npmjs.com/package/@codenkay/video-nsgplayer-angular) | Angular headless component | No — see [Angular sample](https://github.com/codenannu/nsgplayer-sample-angular) |

## Related samples

| Sample | Repository | Port | Purpose |
|--------|------------|------|---------|
| **This repo** | [nsgplayer-sample-react](https://github.com/codenannu/nsgplayer-sample-react) | **5173** | Full React chrome · public HLS **or** BFF client |
| Next.js + BFF | [nsgplayer-sample-nextjs](https://github.com/codenannu/nsgplayer-sample-nextjs) | **3001** | Origin-forwarding BFF + media proxy |
| Angular | [nsgplayer-sample-angular](https://github.com/codenannu/nsgplayer-sample-angular) | **4200** | Headless Angular · same BFF client contract |

## Quick start (public HLS)

```bash
git clone https://github.com/codenannu/nsgplayer-sample-react.git
cd nsgplayer-sample-react
npm install
npm run dev
```

Open http://localhost:5173 — Mode **Direct sourceUrl** (Mux test stream prefilled).

## BFF mode (optional)

Same enterprise client contract as the Angular sample (`src/shared/bffClient.ts`):

1. Run [nsgplayer-sample-nextjs](https://github.com/codenannu/nsgplayer-sample-nextjs) on port **3001**.
2. Switch Mode to **BFF video ID** and click **Play**.

Optional env (`.env.example`):

```bash
VITE_BFF_ORIGIN=http://localhost:3001
```

Wires `auth.getToken`, `playback.getSource` / `refreshSource`, `streaming.mediaProxyUrlBuilder`, and legacy `keyProxyUrlBuilder` to:

| Method | Path |
|--------|------|
| `POST` | `/api/auth-token` |
| `GET` | `/api/videos/:videoId/signed-url` (sends `x-device-id`) |
| `POST` | `/api/videos/:videoId/proxy-refresh` |
| `GET` | `/api/media?url=` |
| `GET` | `/api/hls/key?...` (legacy) |

**Never** put `VIDEO_API_BEARER_TOKEN` / secrets in this React app — secrets stay on the Next BFF. Whitelist `http://localhost:5173` in the BFF `CORS_ORIGINS` and the website origin in Primary Admin.

## Install peers (into your own app)

```bash
npm install @codenkay/video-nsgplayer-ui @codenkay/video-nsgplayer-react @codenkay/video-nsgplayer-core hls.js react react-dom
```

```tsx
import { NsgVideoPlayerWithControls } from "@codenkay/video-nsgplayer-ui";
import "@codenkay/video-nsgplayer-ui/styles.css";
```

### Lift BFF wiring into an existing app

1. Copy `src/shared/bffClient.ts` + `deviceId.ts` (or point callbacks at **your** BFF).
2. Copy the Next sample routes (`/api/media`, signed-url, refresh, key) onto **your** backend.
3. Keep `import "@codenkay/video-nsgplayer-ui/styles.css"` (JS import — not a CSS `@import` under Tailwind PostCSS).
4. Use published npm packages — do **not** `file:`-link a private monorepo (dual React risk).

## Shared contract

`src/shared/` is vendored identically in the Next and Angular samples (including `bffClient.ts` and `deviceId.ts`). Keep them in sync when editing.

## Version matrix

| Package | Tested |
|---------|--------|
| `@codenkay/video-nsgplayer-core` | ^5.4.0 |
| `@codenkay/video-nsgplayer-react` | ^5.2.0 |
| `@codenkay/video-nsgplayer-ui` | ^5.3.0 |

## Troubleshooting

- **Blank player** — HLS URL must be CORS-friendly and public (sourceUrl mode).
- **BFF CORS** — Next sample must allow `http://localhost:5173` (default `CORS_ORIGINS`).
- **Origin 403 from BFF** — ensure Next has your SPA origin in `CORS_ORIGINS`.
- **AES / enc.key** — mock Next has no encryption key (501 on legacy key). Real AES uses `/api/media`.
- **Dual React** — resolve a single `react` / `react-dom` from the host app.

## License

MIT
