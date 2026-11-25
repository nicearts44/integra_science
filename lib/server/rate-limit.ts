/**
 * Limitation de débit — 3 soumissions par adresse IP par heure
 * (CONTEXT_MVP § 8.4, couche 3). Au-delà : réponse 429.
 */
const hits = new Map<string, number[]>();
const WINDOW_MS = 60 * 60 * 1000;
const MAX = 3;

export function rateLimited(ip: string): boolean {
  const now = Date.now();
  const list = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (list.length >= MAX) {
    hits.set(ip, list);
    return true;
  }
  list.push(now);
  hits.set(ip, list);
  return false;
}
