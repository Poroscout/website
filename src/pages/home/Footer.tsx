import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="absolute bottom-2 w-full text-center text-gray-300">
      <p>
        Developed with ❤️ by <a className="text-blue-300" href="https://derock.dev">Derock</a> •{" "}
        <a className="text-blue-300" href="https://github.com/ItzDerock">Github</a> •{" "}
        <a className="text-blue-300" href="https://ko-fi.com/derock">Donate</a> •{" "}
        <a className="text-blue-300" href="mailto:derock@derock.dev">Email</a> •{" "}
        {/* <a className="text-blue-300" href="/terms">Terms</a> */}
        <Link to="/terms" className="text-blue-300">Terms</Link>
      </p>
    </footer>
  );
}
