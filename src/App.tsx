import { useCallback, useMemo, useRef, useState } from "react";
import type {
  AuthConfig,
  PlaybackCredentialConfig,
  VideoPlayer as CorePlayer,
} from "@codenkay/video-nsgplayer-core";
import { NsgVideoPlayerWithControls } from "@codenkay/video-nsgplayer-ui";
import { RuntimeSettingsPanel } from "./components/RuntimeSettingsPanel";
import {
  createBffAdapters,
  DEFAULT_BFF_ORIGIN,
  normalizeBffOrigin,
} from "./shared/bffClient";
import {
  DEFAULT_PLAYGROUND_CONFIG,
  toPlayerConfigPartial,
  type PlaygroundConfig,
} from "./shared/playgroundConfig";
import { SAMPLE_HLS_URL, SDK_VERSION_MATRIX } from "./shared/sampleMedia";

type Mode = "sourceUrl" | "bff";

type Session =
  | { mode: "sourceUrl"; sourceUrl: string; videoId: string }
  | { mode: "bff"; videoId: string };

const BFF_ORIGIN = normalizeBffOrigin(
  import.meta.env.VITE_BFF_ORIGIN || DEFAULT_BFF_ORIGIN,
);

export default function App() {
  const [mode, setMode] = useState<Mode>("sourceUrl");
  const [sourceUrlDraft, setSourceUrlDraft] = useState(SAMPLE_HLS_URL);
  const [videoIdDraft, setVideoIdDraft] = useState("sample");
  const [session, setSession] = useState<Session | null>(null);
  const [config, setConfig] = useState<PlaygroundConfig>(DEFAULT_PLAYGROUND_CONFIG);
  const [error, setError] = useState<string | null>(null);
  const playerRef = useRef<CorePlayer | null>(null);

  const bff = useMemo(() => createBffAdapters(BFF_ORIGIN), []);

  const auth = useMemo<AuthConfig | undefined>(
    () => (session?.mode === "bff" ? bff.auth : undefined),
    [session, bff],
  );

  const playback = useMemo<PlaybackCredentialConfig | undefined>(
    () => (session?.mode === "bff" ? bff.playback : undefined),
    [session, bff],
  );

  const playerConfig = useMemo(() => {
    const base = toPlayerConfigPartial(config);
    if (session?.mode !== "bff") return base;
    return { ...base, streaming: bff.streaming };
  }, [config, session, bff]);

  const onPlay = () => {
    if (mode === "sourceUrl") {
      const url = sourceUrlDraft.trim();
      if (!url) {
        setError("Enter a public HLS source URL.");
        return;
      }
      setError(null);
      setSession({
        mode: "sourceUrl",
        sourceUrl: url,
        videoId: videoIdDraft.trim() || "sample",
      });
      return;
    }

    const id = videoIdDraft.trim();
    if (!id) {
      setError("Enter a video ID.");
      return;
    }
    setError(null);
    setSession({ mode: "bff", videoId: id });
  };

  const onStop = () => {
    playerRef.current?.destroy();
    playerRef.current = null;
    setSession(null);
    setError(null);
  };

  const onConfigChange = useCallback(
    (next: PlaygroundConfig) => {
      setConfig(next);
      const base = toPlayerConfigPartial(next);
      playerRef.current?.updateConfig(
        session?.mode === "bff"
          ? { ...base, streaming: bff.streaming }
          : base,
      );
    },
    [session, bff],
  );

  const onModeChange = (next: Mode) => {
    onStop();
    setMode(next);
  };

  return (
    <div className="page">
      <header className="header">
        <div>
          <h1>NSG Player — React sample</h1>
          <p className="muted">
            Dual mode · UI chrome · SDK <code>ui@{SDK_VERSION_MATRIX.ui}</code> ·
            port <strong>5173</strong>
          </p>
        </div>
        <p className="banner">
          <strong>sourceUrl</strong> plays public HLS with no backend.{" "}
          <strong>BFF</strong> mode calls{" "}
          <code>{BFF_ORIGIN}</code> (run{" "}
          <strong>nsgplayer-nextjs</strong> on <strong>3001</strong>) for auth,
          signed URL, refresh, and AES key proxy — same contract as the Angular
          sample.
        </p>
      </header>

      <section className="controls" aria-label="Playback source">
        <label>
          Mode
          <select
            value={mode}
            onChange={(e) => onModeChange(e.target.value as Mode)}
          >
            <option value="sourceUrl">Direct sourceUrl (no BFF)</option>
            <option value="bff">BFF video ID (port 3001)</option>
          </select>
        </label>

        {mode === "sourceUrl" ? (
          <label>
            HLS source URL
            <input
              value={sourceUrlDraft}
              onChange={(e) => setSourceUrlDraft(e.target.value)}
              placeholder={SAMPLE_HLS_URL}
              spellCheck={false}
            />
          </label>
        ) : null}

        <label>
          Video ID {mode === "sourceUrl" ? "(optional identity)" : ""}
          <input
            value={videoIdDraft}
            onChange={(e) => setVideoIdDraft(e.target.value)}
            placeholder={mode === "bff" ? "demo-video" : "sample"}
          />
        </label>

        <div className="actions">
          <button type="button" className="primary" onClick={onPlay}>
            Play
          </button>
          <button type="button" onClick={onStop} disabled={!session}>
            Stop
          </button>
        </div>
      </section>

      <div className="layout">
        <main className="player-pane">
          {!session ? (
            <div className="placeholder" role="status">
              Choose a mode, then click <strong>Play</strong>. Public Mux HLS is
              prefilled for zero-setup; BFF mode needs Next on :3001.
            </div>
          ) : (
            <div className="player-shell">
              <NsgVideoPlayerWithControls
                key={`${session.mode}-${session.videoId}-${session.mode === "sourceUrl" ? session.sourceUrl : "bff"}`}
                ref={playerRef}
                videoId={session.videoId}
                sourceUrl={
                  session.mode === "sourceUrl" ? session.sourceUrl : undefined
                }
                auth={auth}
                playback={playback}
                config={playerConfig}
                className="player"
                onError={(err) => setError(err.message)}
                onAuthError={(err) => setError(err.message)}
              />
            </div>
          )}
          {error ? (
            <p className="error" role="alert">
              {error}
            </p>
          ) : null}
        </main>
        <aside className="settings-pane">
          <RuntimeSettingsPanel value={config} onChange={onConfigChange} />
        </aside>
      </div>
    </div>
  );
}
