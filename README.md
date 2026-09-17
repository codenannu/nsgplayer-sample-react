# NSG Player — React sample (no BFF)

Public playground for the NSG HLS video player SDK. Vite + React, full control chrome, **no backend**.

Paste a **public HLS `sourceUrl`**, click **Play**, tweak **runtime settings** on the right.

| | |
|--|--|
| Port | **5173** |
| Repo | [nsgplayer-sample-react](https://github.com/codenannu/nsgplayer-sample-react) |
| SDK (pinned) | `@codenkay/video-nsgplayer-*` **^3.0.4** |
| Secrets | None |

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
| **This repo** | [nsgplayer-sample-react](https://github.com/codenannu/nsgplayer-sample-react) | **5173** | Public `sourceUrl`, full React chrome |
| Next.js + BFF | [nsgplayer-sample-nextjs](https://github.com/codenannu/nsgplayer-sample-nextjs) | **3001** | Auth token, signed URL, refresh, key proxy |
| Angular | [nsgplayer-sample-angular](https://github.com/codenannu/nsgplayer-sample-angular) | **4200** | Headless Angular + host controls |

Encrypted / signed NSG streams need a BFF — use the **Next.js** sample.

## Quick start

```bash
git clone https://github.com/codenannu/nsgplayer-sample-react.git
cd nsgplayer-sample-react
npm install
npm run dev
```

Open http://localhost:5173

A Mux public test stream is prefilled.

## Install peers (into your own app)

```bash
npm install @codenkay/video-nsgplayer-ui @codenkay/video-nsgplayer-react @codenkay/video-nsgplayer-core hls.js react react-dom
```

```tsx
import { NsgVideoPlayerWithControls } from "@codenkay/video-nsgplayer-ui";
import "@codenkay/video-nsgplayer-ui/styles.css";
```

**Never** put `clientSecret` in browser code.

## Lift into your app

1. Copy `src/App.tsx` + settings panel patterns.
2. Keep `import "@codenkay/video-nsgplayer-ui/styles.css"` (JS import — not a CSS `@import` under Tailwind PostCSS).
3. Use published npm packages — do **not** `file:`-link a private monorepo (dual React risk).

## Shared contract

`src/shared/` is vendored identically in the Next and Angular samples. Keep them in sync when editing playground fields.

## Version matrix

| Package | Tested |
|---------|--------|
| `@codenkay/video-nsgplayer-core` | ^3.0.4 |
| `@codenkay/video-nsgplayer-react` | ^3.0.4 |
| `@codenkay/video-nsgplayer-ui` | ^3.0.4 |

## Troubleshooting

- **Blank player** — HLS URL must be CORS-friendly and public.
- **Dual React** — resolve a single `react` / `react-dom` from the host app.
- **Next App Router** — UI package ships a `"use client"` banner; import styles from JS/TS.

## License

MIT
