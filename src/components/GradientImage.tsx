import { StaticImageData } from "next/image";
import React from "react";

export type GraidentImageProps = {
  image: StaticImageData;
  children: React.ReactNode;
}

export default function GradientImage(props: GraidentImageProps) {
  return (
    // background image
    <div className={`overflow-hidden bg-cover bg-center bg-no-repeat`} style={{
      backgroundImage: `url(${props.image.src})`,
    }}>
      {/* overlay with grid */}
      <div className={`bg-grid-pattern bg-repeat bg-[unset] bg-blend-screen`}>
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
