import BundleAnalyzer from "@next/bundle-analyzer";

/**
 * Don't be scared of the generics here.
 * All they do is to give us autocompletion when using this.
 *
 * @template {import('next').NextConfig} T
 * @param {T} config - A generic parameter that flows through to the return type
 * @constraint {{import('next').NextConfig}}
 */
function defineNextConfig(config) {
  return BundleAnalyzer({
    enabled: process.env.ANALYZE === "true",
  })(config);
}

export default defineNextConfig({
  reactStrictMode: true,
  swcMinify: true,

  async rewrites() {
    return [
      // plausible
      {
        source: "/js/script.outbound.js",
        destination: "https://plausible.io/js/plausible.outbound-links.js",
      },
      {
        source: "/api/log",
        destination: "https://stats.derock.dev/api/event",
      },
    ];
  },
});
