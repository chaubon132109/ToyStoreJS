// src/components/HomePage.js
import React from "react";
import Slideshow from "./Slideshow";
import "../../style/login.css";
import NewYearCountdown from "./CommingSoon";
import FeaturedProducts from "./FeaturedProducts";

const HomePage = () => {
  return (
    <div className="mx-64 my-10 bg-slate-100">
      <Slideshow />
      <FeaturedProducts></FeaturedProducts>
      <NewYearCountdown></NewYearCountdown>
    </div>
  );
};

export default HomePage;
