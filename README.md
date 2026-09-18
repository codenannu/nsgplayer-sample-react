# NSG Player — React sample

Public playground for the NSG HLS video player SDK. Vite + React + full control chrome.

| | |
|--|--|
| Port | **5173** |
| Repo | [nsgplayer-sample-react](https://github.com/codenannu/nsgplayer-sample-react) |
| SDK (pinned) | `@codenkay/video-nsgplayer-*` **^5.0.0** |
| Modes | Direct `sourceUrl` (default) · **BFF video ID** via Next sample **:3001** |

> This sample is **standalone**. It does **not** require cloning the private SDK monorepo ([`nsgplayer-video`](https://github.com/codenannu/nsgplayer-video)). It installs packages from **npm** only.

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
| Next.js + BFF | [nsgplayer-sample-nextjs](https://github.com/codenannu/nsgplayer-sample-nextjs) | **3001** | Auth token, signed URL, refresh, key proxy |
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

Wires `auth.getToken`, `playback.getSource` / `refreshSource`, and `streaming.keyProxyUrlBuilder` to:

| Method | Path |
|--------|------|
| `POST` | `/api/auth-token` |
| `GET` | `/api/videos/:videoId/signed-url` |
| `POST` | `/api/videos/:videoId/proxy-refresh` |
| `GET` | `/api/hls/key?url=&videoId=&token=&expires=&username=&mobile=` |

**Never** put `VIDEO_API_SECRET` / `clientSecret` in this React app — secrets stay on the Next BFF.

## Install peers (into your own app)

```bash
npm install @codenkay/video-nsgplayer-ui @codenkay/video-nsgplayer-react @codenkay/video-nsgplayer-core hls.js react react-dom
```

```tsx
import { NsgVideoPlayerWithControls } from "@codenkay/video-nsgplayer-ui";
import "@codenkay/video-nsgplayer-ui/styles.css";
```

### Lift BFF wiring into an existing app

1. Copy `src/shared/bffClient.ts` (or point the three callbacks at **your** BFF).
2. Copy the four route patterns from the Next sample (`src/app/api/**` + `lib/bff.ts`) onto **your** backend.
3. Keep `import "@codenkay/video-nsgplayer-ui/styles.css"` (JS import — not a CSS `@import` under Tailwind PostCSS).
4. Use published npm packages — do **not** `file:`-link a private monorepo (dual React risk).

## Shared contract

`src/shared/` is vendored identically in the Next and Angular samples (including `bffClient.ts`). Keep them in sync when editing.

## Version matrix

| Package | Tested |
|---------|--------|
| `@codenkay/video-nsgplayer-core` | ^5.0.0 |
| `@codenkay/video-nsgplayer-react` | ^5.0.0 |
| `@codenkay/video-nsgplayer-ui` | ^5.0.0 |

## Troubleshooting

- **Blank player** — HLS URL must be CORS-friendly and public (sourceUrl mode).
- **BFF CORS** — Next sample must allow `http://localhost:5173` (default `CORS_ORIGINS`).
- **AES / enc.key** — mock Next has no encryption key (501). Real AES needs Next with `VIDEO_API_*` + key allowlist.
- **Dual React** — resolve a single `react` / `react-dom` from the host app.

## License

MIT
