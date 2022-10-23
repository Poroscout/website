import React from "react";
import useScreenDimensions from "../hooks/dimentions";
import link from "../styles/link";

type FeatureProps = {
  title: string | React.ReactNode;
  command?: string;
  description: string | React.ReactNode;
  image: string;
  imageAlt: string;

  direction?: "ltr" | "rtl";
  alternateBG?: boolean;
};

export function Feature(props: FeatureProps) {
  let direction = props.direction ?? "ltr";

  // if screen is too small, set to ltr
  const dimentions = useScreenDimensions();
  if(dimentions.width < 768) direction = "ltr";

  const elements = [
    // image
    <div className="h-full md:w-[50%]" key="image" data-aos={
      direction === "ltr" ? "fade-right" : "fade-left"
    }>
      <div className="relative w-full">
        {/* i cant get next/image working */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={props.image}
          alt={props.imageAlt}
          className="drop-shadow-md"
        />
      </div>
    </div>,

    // text
    <div className="w-full md:w-[50%]" key="text" data-aos={
      direction === "ltr" ? "fade-left" : "fade-right"
    }>
      <div className="mx-7 lg:mx-0 pt-2 text-left">
        <h2 className="text-slate-400 font-bold tracking-normal uppercase text-sm">
          {props.command}
        </h2>

        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          {props.title}
        </h1>

        <div className="mt-4 text-lg text-slate-200">{props.description}</div>
      </div>
    </div>,
  ];

  return (
    <section className={
      `${props.alternateBG ? "bg-slate-800" : "bg-slate-900"} ${link}`
    }>
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-4">
        {direction === "ltr" ? elements : elements.reverse()}
      </div>
    </section>
  );
}
