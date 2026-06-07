import { defineMiddleware } from "astro:middleware";
import { env } from "cloudflare:workers";
import { ageSeconds, getCached, isFresh, setCached } from "./lib/isr-cache";

/** Only the homepage is ISR-cached. */
const ISR_PATH = "/";
/** Seconds before the cached homepage is considered stale (1 hour). */
const REVALIDATE = 3600;

const htmlResponse = (html: string, cacheStatus: string, age: number) =>
  new Response(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      // KV is the source of truth; let the browser/edge keep it briefly too.
      "Cache-Control": `public, max-age=0, s-maxage=300, stale-while-revalidate=${REVALIDATE}`,
      "X-Cache-Status": cacheStatus,
      "X-Cache-Age": String(age),
    },
  });

export const onRequest = defineMiddleware(async (context, next) => {
  const { request, locals, url } = context;

  // Only the homepage GET goes through ISR. Everything else (prerendered
  // routes at build time, non-GET, other paths) renders normally.
  if (request.method !== "GET" || url.pathname !== ISR_PATH) {
    return next();
  }

  const kv = env?.ISR_CACHE;
  const ctx = locals.cfContext;
  if (!kv) return next();

  try {
    const cached = await getCached(kv, ISR_PATH);

    if (cached && isFresh(cached)) {
      return htmlResponse(cached.html, "HIT", ageSeconds(cached));
    }

    if (cached) {
      // Stale: serve immediately, regenerate in the background.
      const stale = htmlResponse(cached.html, "STALE", ageSeconds(cached));
      ctx?.waitUntil(regenerate(kv, next, locals));
      return stale;
    }

    // Cold miss: render synchronously, cache only a healthy render.
    const response = await next();
    if (response.status !== 200) return response;
    const html = await response.text();

    if (!locals.statsStale) {
      ctx?.waitUntil(setCached(kv, ISR_PATH, html, REVALIDATE));
    }
    return htmlResponse(
      html,
      locals.statsStale ? "MISS-STALE-NOCACHE" : "MISS",
      0,
    );
  } catch (error) {
    console.error("[ISR] middleware error, falling back to SSR:", error);
    return next();
  }
});

/**
 * Re-render the homepage and refresh KV, but only if the stats API was
 * healthy. If getBotStats fell back (locals.statsStale), we keep the existing
 * last-known-good entry so an API outage never replaces good numbers.
 */
async function regenerate(
  kv: KVNamespace,
  next: () => Promise<Response>,
  locals: App.Locals,
): Promise<void> {
  try {
    const fresh = await next();
    if (fresh.status !== 200) return;
    const html = await fresh.text();
    if (locals.statsStale) {
      console.warn(
        "[ISR] regen skipped: stats API down, keeping last-known-good",
      );
      return;
    }
    await setCached(kv, ISR_PATH, html, REVALIDATE);
  } catch (error) {
    console.error("[ISR] background regeneration failed:", error);
  }
}
