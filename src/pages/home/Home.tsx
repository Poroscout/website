import React, { useEffect } from "react";
import Footer from "./Footer";
import Header from "./Header";
import Hero from "./Hero";

// import "../../assets/css/home.scoped.css";

function Home() {
  useEffect(() => {
    console.log('asdf')
  }, []);

  return (
    <div className="hero w-screen h-screen overflow-hidden">
      <div className="hero-grid w-screen h-screen overflow-hidden">
        <div className="hero-overlay w-screen h-screen overflow-hidden">
          <Header />
          <Hero />
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default Home;
