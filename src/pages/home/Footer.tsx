import React from "react";

export default function Footer() {
  return (
    <footer className="absolute bottom-2 w-full text-center text-gray-300">
      <p>
        Developed with ❤️ by <a className="text-blue-300" href="https://derock.dev">Derock</a> •{" "}
        <a className="text-blue-300" href="https://github.com/ItzDerock">Github</a> •{" "}
        <a className="text-blue-300" href="https://ko-fi.com/derock">Donate</a> •{" "}
        <a className="text-blue-300" href="mailto:derock@derock.dev">Email</a>
      </p>
      <p className="text-gray-400 hidden sm:block">
        PoroScout isn't endorsed by Riot Games and doesn't reflect the views or
        opinions of Riot Games or anyone officially involved in producing or
        managing Riot Games properties.
        <br /> Riot Games, and all associated properties are trademarks or
        registered trademarks of Riot Games, Inc.
      </p>
      <p className="text-gray-400 block sm:hidden">
        PoroScout isn't endorsed by Riot Games and doesn't reflect the views or
        opinions of Riot Games...
      </p>
    </footer>
  );
}
