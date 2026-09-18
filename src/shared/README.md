# Shared contract (vendor copy)

Keep these files identical across:

- `nsgplayer-react/src/shared/`
- `nsgplayer-nextjs/src/shared/`
- `nsgplayer-angular/src/shared/`

| File | Purpose |
|------|---------|
| `playgroundConfig.ts` | Runtime settings → `PlayerConfig` partial |
| `sampleMedia.ts` | Sample HLS URL + SDK version matrix |
| `bffClient.ts` | Thin browser client for Next BFF (`auth` / `playback` / `keyProxy`) |

Do not import from the `nsg-player` monorepo. Samples pin published npm packages only.

**Integration tip:** for an existing app, copy `bffClient.ts` + the Next `src/app/api/**` route patterns onto your stack — do not clone the whole playground shell unless you are greenfielding.
