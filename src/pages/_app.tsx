import "../styles/globals.css";
import type { AppType } from "next/dist/shared/lib/utils";
import aos from "aos";
import "aos/dist/aos.css";
import { Fragment, useEffect } from "react";
import Head from "next/head";
import Script from "next/script";

const MyApp: AppType = ({ Component, pageProps }) => {
  useEffect(() => {
    aos.init({
      once: true,
      disable:
        /bot|crawler|spider|crawling/i.test(navigator.userAgent) ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      duration: 600,
      easing: "ease-out-sine",
    });
  }, []);

  return (
    <Fragment>
      <Head>
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
      </Head>

      {/* tracking */}
      <Script
        defer
        data-domain="poroscout.gg"
        src="/js/script.outbound.js"
        data-api="/api/log"
      />

      <Component {...pageProps} />
    </Fragment>
  );
};

export default MyApp;
