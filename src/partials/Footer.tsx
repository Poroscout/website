import Link from "next/link";

export default function Footer(props: { withBorder?: boolean }) {
  return (
    <footer className="bg-slate-900 px-8">
      { props.withBorder && <hr className="border-t-slate-700 border-t-2" /> }

      {/* 3 cols */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="text-slate-300">
            <h3 className="text-lg font-bold">PoroScout</h3>
            <p className="mt-2 text-sm">
              PoroScout is a Discord bot that provides League of Legends
              summoner information and statistics. 
              
              <br /><br />
              
              PoroScout isn&apos;t endorsed by
              Riot Games and doesn&apos;t reflect the views or opinions of Riot Games
              or anyone officially involved in producing or managing Riot Games
              properties. Riot Games, and all associated properties are
              trademarks or registered trademarks of Riot Games, Inc.
            </p>
          </div>
          <div className="text-slate-300">
            <h3 className="text-lg font-bold">Resources</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <a href="/discord" className="text-slate-200 hover:text-white">
                  Support
                </a>
              </li>
              <li>
                <a href="https://docs.poroscout.gg" className="text-slate-200 hover:text-white">
                  Documentation
                </a>
              </li>
              <li>
                <a href="/invite" className="text-slate-200 hover:text-white">
                  Invite
                </a>
              </li>
              <li>
                <a href="https://github.com/PoroScout" className="text-slate-200 hover:text-white">
                  GitHub
                </a>
              </li>
            </ul>
          </div>
          <div className="text-slate-300">
            <h3 className="text-lg font-bold">Company</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link href="/terms">
                  <span className="text-slate-200 hover:text-white">
                    Terms of Service & Privacy Policy
                  </span>
                </Link>
              </li>
              <li>
                <a href="https://ko-fi.com/derock" className="text-slate-200 hover:text-white">
                  Donate
                </a>
              </li>
              <li>
                <a href="https://github.com/sponsors/ItzDerock" className="text-slate-200 hover:text-white">
                  Sponsor
                </a>
              </li>
              <li>
                <a href="https://derock.dev/?utm_source=poroscout" className="text-slate-200 hover:text-white">
                  Developed by Derock
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
