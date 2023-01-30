import CountingNumber from "../../components/CountingNumber";
import { getBotStats } from "../../lib/stats";

export default async function StatCards() {
  // get stats
  const stats = await getBotStats();

  return (
    <section className="absolute top-[-9rem] w-full mx-auto py-12 sm:px-6 lg:px-8 space-y-4 left-[50%] translate-x-[-50%]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="rounded-md grid md:grid-cols-3 bg-slate-800 divide-y md:divide-y-0 md:divide-x divide-gray-700 px-6 md:px-0 md:py-8 text-center">
          {/* 1st item */}
          <div className="py-6 md:py-0 md:px-8">
            <div
              className="text-4xl font-bold leading-tight tracking-tighter text-white mb-2"
              data-aos="fade-up"
            >
              <CountingNumber number={stats.guilds} />+
            </div>
            <div
              className="text-lg text-gray-400"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              Servers
            </div>
          </div>
          {/* 2nd item */}
          <div className="py-6 md:py-0 md:px-8">
            <div
              className="text-4xl font-bold leading-tight tracking-tighter text-white mb-2"
              data-aos="fade-up"
            >
              <CountingNumber number={stats.users} />+
            </div>
            <div
              className="text-lg text-gray-400"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              Users
            </div>
          </div>
          {/* 3rd item */}
          <div className="py-6 md:py-0 md:px-8">
            <div
              className="text-4xl font-bold leading-tight tracking-tighter text-white mb-2"
              data-aos="fade-up"
            >
              <CountingNumber number={stats.linked_accounts} />+
            </div>
            <div
              className="text-lg text-gray-400"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              Linked Accounts
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
