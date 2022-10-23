import { env } from "./src/env/server.mjs";

/**
 * Don't be scared of the generics here.
 * All they do is to give us autocompletion when using this.
 *
 * @template {import('next').NextConfig} T
 * @param {T} config - A generic parameter that flows through to the return type
 * @constraint {{import('next').NextConfig}}
 */
function defineNextConfig(config) {
  return config;
}

export default defineNextConfig({
  reactStrictMode: true,
  swcMinify: true,

  async rewrites() {
    return [
      {
        source: "/invite",
        destination: "https://discord.com/oauth2/authorize?client_id=913190001007804426&permissions=537151488&scope=bot%20applications.commands"
      },

      {
        source: "/discord",
        destination: "https://discord.com/invite/dvvH6knvsG"
      }
    ]
  }
});
