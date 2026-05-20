import { UIMessage } from "ai";

const STORAGE_KEY = "yeongju-sunbi-ai:chat:v1";
const MAX_MESSAGES = 50;

export function loadMessages(): UIMessage[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed as UIMessage[];
  } catch {
    return null;
  }
}

export function saveMessages(messages: UIMessage[]): void {
  if (typeof window === "undefined") return;
  try {
    const capped = messages.slice(-MAX_MESSAGES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(capped));
  } catch {
    // Storage quota exceeded or unavailable — silently ignore
  }
}

export function clearMessages(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Silently ignore
  }
}
