"use client";

import { useEffect } from "react";
import aos from "aos";
import "aos/dist/aos.css";

export default function AOS() {
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

  return null;
}
