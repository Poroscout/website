import React, { useEffect } from "react";

interface RotatingTextProps {
  text: string[];
  className?: string;
}

export default function RotatingText({ text, className }: RotatingTextProps) {
  const [active, setActive] = React.useState(0);
  const [animating, setAnimating] = React.useState(false);

  useEffect(() => {
    setActive(0);
    setAnimating(true);

    const interval = setInterval(() => {
      setActive(active => (active + 1) % text.length);
      setAnimating(true);
    }, 5000);

    return () => clearInterval(interval);
  }, [text]);

  useEffect(() => {
    if(animating) {
      const a = setTimeout(() => {
        setAnimating(false);
      }, 4000);

      return () => clearTimeout(a);
    }
  }, [animating, active]);

  return (
    <span className={className + ` ${animating ? 'fadein' : 'fadeout'}`}>{text[active]}</span>
  );
}