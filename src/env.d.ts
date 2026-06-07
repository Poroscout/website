/// <reference types="astro/client" />

type KVNamespace = import("@cloudflare/workers-types").KVNamespace;
type ExecutionContext = import("@cloudflare/workers-types").ExecutionContext;

/** Worker bindings, accessed at runtime via `import { env } from "cloudflare:workers"`. */
interface Env {
  /** ISR HTML cache for the homepage. Bound in wrangler.jsonc. */
  ISR_CACHE: KVNamespace;
}

declare module "cloudflare:workers" {
  export const env: Env;
}

declare namespace App {
  interface Locals {
    /** Cloudflare ExecutionContext (Astro v6). Use for waitUntil(). */
    cfContext?: ExecutionContext;
    /**
     * Set true by getBotStats() when the stats API fetch fails and fallback
     * numbers were used. The ISR middleware reads this after rendering and
     * refuses to cache the page, so a degraded render never overwrites the
     * last-known-good HTML in KV.
     */
    statsStale?: boolean;
  }
}
