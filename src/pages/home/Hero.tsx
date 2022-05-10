import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import Images from "./Images";
import RotatingText from "./RotatingText";

export default function Hero() {
  return (
    <div className="flex h-screen">
      <div className="m-auto space-y-2 text-center">
        <h1 className="text-3xl md:text-5xl text-white font-bold leading-tight text-shadow-sm">
          Piltover's Finest
          <br /> <span className="text-league">League of Legends</span> Discord
          Bot.
        </h1>
        <p className="text-gray-200 text-lg">Poroscout can help you <RotatingText className="text-yellow-400 font-semibold" text={[
          "check a player's stats",
          "view champion builds",
          "view match history and details",
          "find the latest patch notes",
          "view player masteries",
          "find out what champions are meta",
          "see how a player is performing",
          "automatically receieve patch notes"
        ]}/>.</p>

        <div className="w-full text-center pt-2">
          <div className="space-x-3 sm:space-x-6">
            <a className="bg-league hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded whitespace-nowrap" onClick={(ev) => {
              // @ts-ignore
              window.plausible("Invite Link Click")
            }} href="https://discord.com/api/oauth2/authorize?client_id=913190001007804426&permissions=537151488&scope=bot%20applications.commands">
              <FontAwesomeIcon icon={["fas", "user-plus"]} />
              <span className="ml-2">Invite</span>
            </a>
            <a className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded whitespace-nowrap" href="https://porodocs.derock.dev/">
              <FontAwesomeIcon icon={["fas", "book"]} />
              <span className="hidden sm:inline-block ml-2">Documentation</span>
              <span className="sm:hidden ml-2">Docs</span>
            </a>
            <a className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-4 rounded whitespace-nowrap" href="https://discord.gg/dvvH6knvsG">
              <FontAwesomeIcon icon={["fab", "discord"]} />
              <span className="ml-2">Discord</span>
            </a>
          </div>
          <br />

          <Images />
        </div>
      </div>
    </div>
  );
}