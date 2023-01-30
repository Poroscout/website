import "../styles/globals.css";
import { ReactNode, Suspense } from "react";
import AOS from "../partials/AOS";

const MyApp = ({
  children
}: {
  children: ReactNode
}) => {
  return (
    <html>
      <head>
        {/* meta */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* seo */}
        <meta name="theme-color" content="#3c82f6" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          property="og:image"
          content="https://poroscout.gg/poroxmoba.webp"
        />
        <meta
          property="og:url"
          content="https://poroscout.gg/?utm_medium=social&utm_source=embed"
        />

        {/* page details */}
        <title key="title">PoroScout » League of Legends Discord Bot.</title>
        <meta
          key="description"
          name="description"
          content="PoroScout is a League of Legends Discord Bot for tracking player's statistics, match history, ranked information, champion masteries, champion builds, winrates, and more!"
        />

        {/* icon */}
        <link rel="icon" href="/favicon.ico" />
      </head>

      <body>
        <Suspense>
          {children}
          <AOS />
        </Suspense>

        {/* tracking */}
        <script
          defer
          data-domain="poroscout.gg"
          src="/js/script.outbound.js"
          data-api="/api/log"
        />
      </body>
    </html>
  );
};

export default MyApp;
