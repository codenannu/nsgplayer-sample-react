import { useCallback, useMemo, useRef, useState } from "react";
import type { VideoPlayer as CorePlayer } from "@codenkay/video-nsgplayer-core";
import { NsgVideoPlayerWithControls } from "@codenkay/video-nsgplayer-ui";
import { RuntimeSettingsPanel } from "./components/RuntimeSettingsPanel";
import {
  DEFAULT_PLAYGROUND_CONFIG,
  toPlayerConfigPartial,
  type PlaygroundConfig,
} from "./shared/playgroundConfig";
import { SAMPLE_HLS_URL, SDK_VERSION_MATRIX } from "./shared/sampleMedia";

type Session = {
  sourceUrl: string;
  videoId?: string;
};

export default function App() {
  const [sourceUrlDraft, setSourceUrlDraft] = useState(SAMPLE_HLS_URL);
  const [videoIdDraft, setVideoIdDraft] = useState("sample");
  const [session, setSession] = useState<Session | null>(null);
  const [config, setConfig] = useState<PlaygroundConfig>(DEFAULT_PLAYGROUND_CONFIG);
  const [error, setError] = useState<string | null>(null);
  const playerRef = useRef<CorePlayer | null>(null);

  const playerConfig = useMemo(() => toPlayerConfigPartial(config), [config]);

  const onPlay = () => {
    const url = sourceUrlDraft.trim();
    if (!url) {
      setError("Enter a public HLS source URL.");
      return;
    }
    setError(null);
    setSession({
      sourceUrl: url,
      videoId: videoIdDraft.trim() || undefined,
    });
  };

  const onStop = () => {
    playerRef.current?.destroy();
    playerRef.current = null;
    setSession(null);
    setError(null);
  };

  const onConfigChange = useCallback((next: PlaygroundConfig) => {
    setConfig(next);
    playerRef.current?.updateConfig(toPlayerConfigPartial(next));
  }, []);

  return (
    <div className="page">
      <header className="header">
        <div>
          <h1>NSG Player — React sample</h1>
          <p className="muted">
            No BFF · public <code>sourceUrl</code> only · SDK{" "}
            <code>ui@{SDK_VERSION_MATRIX.ui}</code>
          </p>
        </div>
        <p className="banner">
          Encrypted NSG streams need a BFF — use{" "}
          <strong>nsgplayer-nextjs</strong> on port <strong>3001</strong>.
        </p>
      </header>

      <section className="controls" aria-label="Playback source">
        <label>
          HLS source URL
          <input
            value={sourceUrlDraft}
            onChange={(e) => setSourceUrlDraft(e.target.value)}
            placeholder={SAMPLE_HLS_URL}
            spellCheck={false}
          />
        </label>
        <label>
          Video ID (optional identity)
          <input
            value={videoIdDraft}
            onChange={(e) => setVideoIdDraft(e.target.value)}
            placeholder="sample"
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
              Enter a source URL and click <strong>Play</strong>. A public Mux
              test stream is prefilled for zero-setup.
            </div>
          ) : (
            <div className="player-shell">
              <NsgVideoPlayerWithControls
                ref={playerRef}
                videoId={session.videoId || "sample"}
                sourceUrl={session.sourceUrl}
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
