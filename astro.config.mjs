// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import { imageService } from "@unpic/astro/service";

import sitemap from "@astrojs/sitemap";

import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  site: "https://poroscout.gg",
  prefetch: true,

  vite: {
    plugins: [tailwindcss()],
  },

  image: {
    service: imageService({
      placeholder: "blurhash",
    }),
  },

  experimental: {
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
  },

  integrations: [sitemap(), mdx(), icon()],
});
