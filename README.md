# NSG Player — React sample (no BFF)

Minimal Vite + React playground for `@codenkay/video-nsgplayer-ui`.

Paste a **public HLS `sourceUrl`**, click **Play**, tweak **runtime settings** on the right.

| | |
|--|--|
| Port | **5173** |
| SDK | `@codenkay/video-nsgplayer-ui` / `react` / `core` **^3.0.4** |
| Secrets | None |

## Quick start

```bash
git clone <this-repo> nsgplayer-react
cd nsgplayer-react
npm install
npm run dev
```

Open http://localhost:5173

A Mux public test stream is prefilled. Encrypted NSG content needs a BFF — see **nsgplayer-nextjs** (port 3001).

## Lift into your app

1. Copy `src/App.tsx` + settings panel patterns.
2. Keep `import "@codenkay/video-nsgplayer-ui/styles.css"`.
3. Install peers: `react`, `react-dom`, `hls.js`, and the three `@codenkay/video-nsgplayer-*` packages.

## Shared contract

`src/shared/` is vendored identically in the Next and Angular samples. Keep them in sync when editing fields.

## Troubleshooting

- **Client Component / Next App Router** — this Vite sample is fine; in Next use the UI package (ships `"use client"`).
- **Dual React** — do not `file:`-link the monorepo packages; use published npm.
- **Blank player** — confirm the HLS URL is CORS-friendly and public.
