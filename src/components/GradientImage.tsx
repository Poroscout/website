import Image, { StaticImageData } from "next/image";
import React from "react";

export type GraidentImageProps = {
  image: StaticImageData;
  children: React.ReactNode;
};

export default function GradientImage(props: GraidentImageProps) {
  return (
    // background image
    <div className={`relative overflow-hidden bg-cover bg-center bg-no-repeat`}>
      {/* overlay with grid */}
      <div
        className={`relative z-10 bg-grid-pattern bg-repeat bg-[unset] bg-blend-screen`}
      >
        {/* gradient overlay */}
        <div className="w-screen bg-opacity-50 bg-gradient-to-b from-transparent to-slate-900 py-64">
          {/* content (centered) */}
          <div className="flex justify-center items-center">
            {props.children}
          </div>
        </div>
      </div>

      <Image
        fill
        src={props.image}
        alt="League of Legends logo"
        className="z-0 object-cover"
        placeholder="blur"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
        priority
      />
    </div>
  );
}
