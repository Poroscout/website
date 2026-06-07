// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";

import sitemap from "@astrojs/sitemap";

import icon from "astro-icon";

import cloudflare from "@astrojs/cloudflare";

// The Cloudflare adapter runs `astro dev` inside workerd, which trips over CJS
// deps in the on-demand homepage graph ("module is not defined"). The adapter
// is only needed to build/deploy the worker, so we skip it for `astro dev` and
// let the dev server render on-demand routes in Node (as it did pre-adapter).
// ISR/KV only matter in production anyway — the middleware no-ops in dev.
const isDevServer = process.argv.includes("dev");

// https://astro.build/config
// Output stays "static": the whole site prerenders to the CDN as before.
// Only the homepage opts into on-demand rendering (prerender = false) so the
// ISR middleware can cache its HTML in Cloudflare KV. The adapter is what makes
// a single on-demand route possible without turning the rest dynamic.
export default defineConfig({
  site: "https://poroscout.gg",
  prefetch: true,

  // imageService "compile": images are optimized at build time via the
  // workerd image service (no native `sharp`), and the on-demand homepage uses
  // a passthrough service at runtime. This keeps `sharp` out of the deployed
  // worker entirely, both the build prerender and runtime run in workerd, so
  // we must NOT override prerenderEnvironment to "node" (that would drag the
  // native sharp prerenderer back into the worker bundle).
  adapter: isDevServer ? undefined : cloudflare({ imageService: "compile" }),

  redirects: {
    "/discord": "https://discord.gg/dvvH6knvsG",
    "/invite":
      "https://discord.com/oauth2/authorize?client_id=913190001007804426&scope=bot+applications.commands&permissions=537259072",
    "/invite-user":
      "https://discord.com/oauth2/authorize?client_id=913190001007804426&integration_type=1&scope=applications.commands",
  },

  markdown: {
    shikiConfig: {
      theme: "css-variables",
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },

  fonts: [
    {
      provider: fontProviders.google(),
      name: "Montserrat",
      cssVariable: "--font-montserrat",
      fallbacks: ["sans-serif"],
      weights: ["500", "600", "900"],
      styles: ["normal"],
      subsets: ["latin"],
    },
    {
      provider: fontProviders.google(),
      name: "Libre Baskerville",
      cssVariable: "--font-libre-baskerville",
      fallbacks: ["sans-serif"],
      weights: ["400"],
    },
    {
      provider: fontProviders.google(),
      name: "Karla",
      cssVariable: "--font-karla",
      fallbacks: ["sans-serif"],
      weights: ["400", "700"],
      styles: ["normal", "italic"],
    },
    {
      provider: fontProviders.google(),
      name: "Crimson Text",
      cssVariable: "--font-crimson-text",
      fallbacks: ["serif"],
      weights: ["400", "700"],
      styles: ["normal", "italic"],
    },
  ],

  integrations: [sitemap(), mdx(), icon()],
});
