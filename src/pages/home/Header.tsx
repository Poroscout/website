import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="top-2 w-full text-center text-white font-semibold text-xl hidden sm:block absolute"> 
      <p className="w-fit">
        <Link to="#">
          <img src={require('../../assets/img/logo.png')} alt="logo" className="h-12 w-12 inline mx-2" />
          <span className="align-middle">PoroScout</span>
        </Link>
      </p>
    </header>
  );
}
