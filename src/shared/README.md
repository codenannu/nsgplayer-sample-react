# Shared contract (vendor copy)

Keep these files identical across:

- `nsgplayer-react/src/shared/`
- `nsgplayer-nextjs/src/shared/`
- `nsgplayer-angular/src/shared/`

Files:

| File | Purpose |
|------|---------|
| `bffClient.ts` | Browser adapters: auth, signed-url/refresh (`x-device-id`), `mediaProxyUrlBuilder` |
| `deviceId.ts` | Persistent anonymous `device_id` for web grants |
| `playgroundConfig.ts` | Runtime settings panel shape |
| `sampleMedia.ts` | Public Mux URL + SDK version matrix |

Do not import from the private `nsg-player` monorepo. Samples pin published npm packages only.

## Enterprise BFF expectations (SDK 5.4 / 5.2 / 5.3 / 5.2)

- Browser never calls the playback host; use `/api/media?url=` via `mediaProxyUrlBuilder`.
- BFF validates and **forwards** the viewer `Origin` on grant, refresh, media, and key.
- Grant body includes `platform: "web"` and `device_id` (from `x-device-id`).
- Management bearer stays on the server; never on media/key/student routes.
- Whitelist sample origins (including `http://localhost:3001`) in Primary Admin.
