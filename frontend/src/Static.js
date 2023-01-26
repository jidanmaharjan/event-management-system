import React from "react";
import { Route, Routes } from "react-router-dom";

//component imports
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

//pages imports
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import Error from "./pages/Error/Error";
import Home from "./pages/Home/Home";
import Pricing from "./pages/Pricing/Pricing";
import Services from "./pages/Services/Services";

const Static = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="" element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="plans-and-pricing" element={<Pricing />} />
        <Route path="contact" element={<Contact />} />
        <Route path="services" element={<Services />} />
        <Route path="*" element={<Error />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default Static;
