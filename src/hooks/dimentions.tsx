"use client";

import { useEffect, useState } from "react";

export default function useScreenDimensions() {
  const [dimensions, setDimensions] = useState({
    width: 500,
    height: 500,
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return dimensions;
}
