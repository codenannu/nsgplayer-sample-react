const STORAGE_KEY = "nsg_device_id";

function randomDeviceId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID().replace(/-/g, "");
  }
  return `web${Date.now().toString(16)}${Math.random().toString(16).slice(2)}`;
}

/**
 * Persistent anonymous browser device id for web playback grants (max 200 chars).
 * Keep identical across nsgplayer-react / nsgplayer-nextjs / nsgplayer-angular.
 */
export function getOrCreateDeviceId(): string {
  if (typeof window === "undefined") {
    return "server-web-device";
  }
  try {
    const existing = window.localStorage.getItem(STORAGE_KEY)?.trim();
    if (existing) {
      return existing.slice(0, 200);
    }
    const created = randomDeviceId().slice(0, 200);
    window.localStorage.setItem(STORAGE_KEY, created);
    return created;
  } catch {
    return randomDeviceId().slice(0, 200);
  }
}
