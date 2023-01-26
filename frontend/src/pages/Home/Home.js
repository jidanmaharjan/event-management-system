import React from "react";

//component imports
import Hero from "./Hero";
import History from "./History";
import Services from "./Services";
import Statistics from "./Statistics";
import Testimonial from "./Testimonial";

const Home = () => {
  return (
    <div>
      <Hero />
      <Services />
      <Statistics />
      <History />
      <Testimonial />
    </div>
  );
};

export default Home;
