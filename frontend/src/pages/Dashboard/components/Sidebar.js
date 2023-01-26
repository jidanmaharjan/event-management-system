import React from "react";
import { NavLink } from "react-router-dom";

import { useQuery, useQueryClient } from "react-query";
import { getUserProfile, refreshToken } from "../../../apis/userApis";

//images imports
import logo from "../../../assets/images/logo.png";

//icon imports
import { MdSpaceDashboard } from "react-icons/md";
import {
  AiOutlineCloseCircle,
  AiOutlineLoading3Quarters,
} from "react-icons/ai";

//data imports
import { navbarData } from "../../../data/data";
import { useStateContext } from "../../../contexts/ContextProvider";

const Sidebar = ({ profile }) => {
  const { activeMenu, setActiveMenu } = useStateContext();
  const activeLink =
    "bg-emerald-600/80 flex items-center text-white m-2 p-2 rounded-sm navIsActive";
  const inActiveLink =
    "hover:bg-emerald-700/80 flex items-center text-white m-2 p-2 rounded-sm";

  const queryClient = useQueryClient();

  // if (isProfileFetching || isRefreshTokenFetching) {
  //   return (
  //     <div className="w-80 min-h-screen bg-emerald-900 grid place-content-center">
  //       <AiOutlineLoading3Quarters className="animate-spin text-3xl text-emerald-300 mr-2" />
  //     </div>
  //   );
  // }

  return (
    <div
      className={`${
        activeMenu ? "w-80" : "-translate-x-[100%]"
      } z-50 transition-all duration-150 ease-in-out bg-emerald-800 h-screen overflow-hidden hover:overflow-y-scroll fixed left-0 rounded-sm`}
    >
      <button
        onClick={() => setActiveMenu(false)}
        className="text-2xl absolute top-4 right-4 text-white md:hidden"
      >
        <AiOutlineCloseCircle />
      </button>
      <div className="flex items-center text-2xl font-bold p-4 text-white">
        <img src={logo} className="w-10 h-10 mr-2" alt="" />
        <span>Eve.</span>
      </div>
      {navbarData.map((section, sectionIndex) => {
        if (section.title === "ADMIN PANEL") {
          if (profile?.data?.role === "admin") {
            return (
              <div key={sectionIndex} className="relative">
                <h2 className="font-semibold text-white/80 px-4 mt-8">
                  {section.title}
                </h2>
                {section.nav.map((item, itemIndex) => (
                  <NavLink
                    to={"/dashboard" + item.link}
                    key={itemIndex}
                    className={({ isActive }) =>
                      isActive ? activeLink : inActiveLink
                    }
                  >
                    <span className="text-xl mr-2">{item.icon}</span>
                    {item.title}
                  </NavLink>
                ))}
              </div>
            );
          }
        } else {
          return (
            <div key={sectionIndex} className="relative">
              <h2 className="font-semibold text-white/80 px-4 mt-8">
                {section.title}
              </h2>
              {section.nav.map((item, itemIndex) => (
                <NavLink
                  to={"/dashboard" + item.link}
                  key={itemIndex}
                  className={({ isActive }) =>
                    isActive ? activeLink : inActiveLink
                  }
                >
                  <span className="text-xl mr-2">{item.icon}</span>
                  {item.title}
                </NavLink>
              ))}
            </div>
          );
        }
      })}
    </div>
  );
};

export default Sidebar;
