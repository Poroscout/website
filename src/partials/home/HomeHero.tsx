import GradientImage from "../../components/GradientImage";
import lolImage from "../../assets/lol.webp";

export default function HomeHero() {
  return (
    <header>
      <GradientImage image={lolImage}>
        <div className="text-center drop-shadow-md md:scale-105 px-4">
          <h2 className="text-slate-200 font-semibold tracking-wide uppercase text-md">
            Piltover&apos;s Finest
          </h2>
          <p className="mt-2 text-4xl leading-12 font-extrabold tracking-tight text-white">
            League of Legends Discord Bot
          </p>
          <p className="mt-4 max-w-2xl text-xl text-slate-200 lg:mx-auto">
            PoroScout is a Discord bot that provides League of Legends summoner and champion
            information and statistics.
          </p>
          <div className="mt-6 space-y-2">
            <a
              href="/invite"
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Invite PoroScout
            </a>
            <a
              href="https://docs.poroscout.gg"
              className="ml-3 inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-500 bg-white hover:bg-blue-50"
            >
              View Documentation
            </a>
          </div>
        </div>
      </GradientImage>
    </header>
  );
}
