import React from "react";
import { Link, NavLink } from "react-router-dom";

//data imports
import { webDetails } from "../data/data";

const Navbar = () => {
  return (
    <header className="text-gray-600 body-font w-full">
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        <Link
          to={"/"}
          className="flex title-font font-medium items-center text-gray-900 hover:text-emerald-400 mb-4 md:mb-0"
        >
          <img className="w-10 h-10" src={webDetails.logo} alt="" />

          <span className="ml-3 text-xl font-semibold">{webDetails.name}</span>
        </Link>
        <nav className="md:ml-auto md:mr-auto flex flex-wrap items-center text-base justify-center font-semibold">
          <NavLink to={"/about"} className="mr-5 hover:text-emerald-400">
            About
          </NavLink>
          <NavLink to={"/services"} className="mr-5 hover:text-emerald-400">
            Services
          </NavLink>
          <NavLink
            to={"/plans-and-pricing"}
            className="mr-5 hover:text-emerald-400"
          >
            Plans and Pricing
          </NavLink>
          <NavLink to={"/contact"} className="mr-5 hover:text-emerald-400">
            Contact Us
          </NavLink>
        </nav>
        <Link
          to={"/login"}
          className="inline-flex items-center bg-emerald-400 border-0 py-3 px-4 focus:outline-none hover:bg-emerald-300 rounded text-base mt-4 md:mt-0 text-white"
        >
          Go to App
          <svg
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            className="w-4 h-4 ml-1"
            viewBox="0 0 24 24"
          >
            <path d="M5 12h14M12 5l7 7-7 7"></path>
          </svg>
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
