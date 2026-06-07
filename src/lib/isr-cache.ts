/**
 * Minimal ISR cache over Cloudflare KV. Stores rendered HTML keyed by path
 * with a timestamp, and exposes a freshness check for the stale-while-
 * revalidate flow in src/middleware.ts.
 */

export interface CachedPage {
  /** Rendered HTML. */
  html: string;
  /** Epoch ms when this entry was written. */
  timestamp: number;
  /** Seconds the entry is considered fresh. */
  revalidate: number;
}

const PREFIX = "isr";

const key = (path: string) => `${PREFIX}:${path}`;

export async function getCached(
  kv: KVNamespace,
  path: string,
): Promise<CachedPage | null> {
  try {
    return (await kv.get(key(path), "json")) as CachedPage | null;
  } catch (error) {
    console.error("[ISR] get failed:", error);
    return null;
  }
}

export function isFresh(entry: CachedPage): boolean {
  const ageSeconds = (Date.now() - entry.timestamp) / 1000;
  return ageSeconds < entry.revalidate;
}

export function ageSeconds(entry: CachedPage): number {
  return Math.floor((Date.now() - entry.timestamp) / 1000);
}

export async function setCached(
  kv: KVNamespace,
  path: string,
  html: string,
  revalidate: number,
): Promise<void> {
  const entry: CachedPage = { html, timestamp: Date.now(), revalidate };
  try {
    await kv.put(key(path), JSON.stringify(entry), {
      // Evict abandoned entries after a generous multiple of the window so KV
      // doesn't accumulate dead paths. Long enough that last-known-good still
      // survives an extended API outage.
      expirationTtl: Math.max(revalidate * 24, 600),
    });
  } catch (error) {
    console.error("[ISR] set failed:", error);
  }
}
