import React from "react";
import Footer from "./Footer";
import Header from "./Header";
import Hero from "./Hero";

function Home() {
  return (
    <div className="hero w-screen h-screen">
      <div className="hero-grid w-screen h-screen">
        <div className="hero-overlay w-screen h-screen">
          <Header />
          <Hero />
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default Home;
