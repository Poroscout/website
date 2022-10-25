import { css } from "@emotion/css";
import { StaticImageData } from "next/image";
import React from "react";

const gridOverlay = css`
  background-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(148 163 184 / 0.2)'><path d='M0 .5H31.5V32'/></svg>");
  background-repeat: repeat;
  background-size: unset;
  background-blend-mode: screen;
`;

export type GraidentImageProps = {
  image: StaticImageData;
  children: React.ReactNode;
}

export default function GradientImage(props: GraidentImageProps) {
  const backgroundStyle = css`
    background-image: url(${props.image.src});
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  `;

  return (
    // background image
    <div className={`${backgroundStyle} overflow-hidden`}>
      {/* overlay with grid */}
      <div className={`${gridOverlay}`}>
        {/* gradient overlay */}
        <div className="w-screen bg-opacity-50 bg-gradient-to-b from-transparent to-slate-900 py-64">
          {/* content (centered) */}
          <div className="flex justify-center items-center min-h-[30vh]">
            {props.children}
          </div>
        </div>
      </div>
    </div>
  )
}