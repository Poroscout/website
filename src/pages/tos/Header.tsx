import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="top-2 w-full text-center font-semibold text-xl mt-2 text-gray-800">
      <p className="w-fit">
        <Link to="/">
          <img
            src={require("../../assets/img/logo.png")}
            alt="logo"
            className="h-12 w-12 inline mx-2"
          />
          <span className="align-middle">PoroScout</span>
        </Link>
      </p>
    </header>
  );
}
