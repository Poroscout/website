import Link from "next/link";
import lolImage from "../../assets/lol.webp";
import GradientImage from "../../components/GradientImage";

const lastUpdated = new Date("2024-02-12T20:01:50.190Z");

export default function TermsHero() {
  return (
    <header>
      <GradientImage image={lolImage}>
        <div className="text-center drop-shadow-md md:scale-105">
          <Link href="/">
            <span className="text-slate-200 font-semibold tracking-wide uppercase text-md hover:text-slate-100 cursor-pointer">
              PoroScout
            </span>
          </Link>
          <p className="mt-2 text-4xl leading-12 font-extrabold tracking-tight text-white">
            Terms of Service and Privacy Policy
          </p>
          <p className="mt-4 max-w-2xl text-xl text-slate-200 lg:mx-auto">
            Last Updated:{" "}
            {lastUpdated.toLocaleString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
      </GradientImage>
    </header>
  );
}
