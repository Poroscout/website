import type { GetServerSideProps, NextPage } from "next";
import { Feature } from "../components/Feature";
import { env } from "../env/server.mjs";
import Footer from "../partials/Footer";
import HomeHero from "../partials/home/HomeHero";
import StatCards from "../partials/home/Stats";
import { css } from "@emotion/css";

import champions from "../assets/features/champions.webp";
import graphs from "../assets/features/graphs.webp";
import match from "../assets/features/match.webp";
import patchnotes from "../assets/features/patchnotes.webp";
import profile from "../assets/features/profile.webp";
import SlashCommand from "../components/SlashCommand";
import { CallToAction } from "../partials/home/CallToAction";

const checkmarkList = css`
  /* green check mark */
  list-style: none;

  li::before {
    content: url("data:image/svg+xml,%3Csvg width='20' height='20' style='margin-top: auto; margin-bottom: auto;' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M7.5 13.5L4.5 10.5L3.5 11.5L7.5 15.5L16.5 6.5L15.5 5.5L7.5 13.5Z' fill='lightgreen'/%3E%3C/svg%3E%0A");
    margin-right: 0.25rem;

    /* center the check */
    display: inline-block;
    vertical-align: middle;
    height: auto;
    width: auto;

    padding-top: 2px;
  }

  li {
    margin-left: 0.5rem;
  }
`;

type HomeProps = {
  stats: {
    guilds?: number;
    users?: number;
    linked_accounts?: number;
  };
};

const Home: NextPage<HomeProps> = (props) => {
  return (
    <>
      
      <HomeHero />

      <main className="bg-slate-900">
        <div className="relative h-16 mx-auto max-w-7xl justify-center md:mb-0 mb-60">
          <StatCards stats={props.stats} />
        </div>

        <Feature
          command="/champion & more"
          title="Scout Champion Data"
          description={
            <>
              Partnered with{" "}
              <a href="https://mobalytics.gg/?utm">Mobalytics.gg</a>, PoroScout
              provides accurate and up-to-date champion data for any champion.
              <br />
              <br />
              PoroScout can show the following information:
              <ul className={checkmarkList}>
                <li>Champion Build & Runes</li>
                <li>Champion Abilities</li>
                <li>Champion Winrates, Pickrates, and Banrates</li>
                <li>Champion Skill Order</li>
                <li>Champion Counters and Synergies</li>
                <li>and more!</li>
              </ul>
            </>
          }
          image={champions}
          imageAlt="Image showing /champion, /counters, and /synergies"
          direction="ltr"
        />

        <Feature
          command="/graph & /mmr"
          title="Scout Historical Data"
          description={
            <>
              PoroScout can keep track of your daily LP and MMR gains, as well
              as your wins and losses which can later be retrieved and graphed
              using the <SlashCommand>/graph mmr</SlashCommand> and{" "}
              <SlashCommand>/graph lp</SlashCommand> commands.
              <br /> <br />
              Using data from{" "}
              <a href="https://whatismymmr.com">WhatIsMyMMR.com</a>, PoroScout
              can also display your ranked (flex and duos) and normals MMR as
              well as your position on a normal distribution curve.
            </>
          }
          image={graphs}
          imageAlt="Image showing /graph mmr, /graph lp, and /mmr commands."
          direction="rtl"
          alternateBG
        />

        <Feature
          command="/matches"
          title="Scout Match Details"
          description={
            <>
              With the <SlashCommand>/matches</SlashCommand> command, PoroScout
              can lookup recent games played by a summoner and display the
              following information:
              <ul className={checkmarkList}>
                <li>Full Team Composition</li>
                <li>Banned champions</li>
                <li>Player KDAs and CS</li>
                <li>Gold Difference against laning enemy</li>
                <li>Damage dealt, taken, and shielded</li>
                <li>and more!</li>
              </ul>
            </>
          }
          image={match}
          imageAlt="Image showing /matches command."
        />

        <Feature
          command="/profile & /mastery"
          title="Scout Summoner Profiles"
          description={
            <>
              With the <SlashCommand>/profile</SlashCommand> command, you can
              lookup a summoner&apos;s profile and display the following information:
              <ul className={checkmarkList}>
                <li>Summoner Level</li>
                <li>Ranked Solo/Duo and Flex stats</li>
                <li>Top Champions</li>
                <li>Recent & Live Games</li>
                <li>and more...</li>
              </ul>

              <br />
              And with the <SlashCommand>/mastery</SlashCommand> command, you can
              lookup a summoner&apos;s top 10 mastered champions.
            </>
          }

          image={profile}
          imageAlt="Image showing /profile command."

          direction="rtl"
          alternateBG
        />

        <Feature
          command="/patchnotes"
          title="Scout Patch Notes"
          description={
            <>
              Using the <SlashCommand>/patchnotes</SlashCommand> command, you
              can find details about the latest League patch notes.
              <br /> <br />
              You can also use{" "}
              <SlashCommand>/configure patchnotes</SlashCommand> to select a
              channel to automatically receive patch note updates on patch day.
            </>
          }
          image={patchnotes}
          imageAlt="Image showing PoroScout sending latest patchnotes."
        />

        <CallToAction />
      </main>

      <Footer />
    </>
  );
};

export const getServerSideProps: GetServerSideProps<HomeProps> = async (
  context
) => {
  // cache for 5 minutes
  context.res.setHeader(
    "Cache-Control",
    "public, s-maxage=300, stale-while-revalidate=59"
  );

  // fetch stats from API
  const res = await fetch(`${env.API_URL}/stats`)
    .then((data) => data.json())
    .catch((err) => {
      console.error(err);
      return {};
    });

  // return stats
  return {
    props: {
      stats: {
        guilds: parseInt(res.guilds),
        users: parseInt(res.users),
        linked_accounts: parseInt(res.linked_accounts),
      },
    },
  };
};

export default Home;
