import React, { useEffect } from "react";

//icons imports
import { FaBars, FaBell } from "react-icons/fa";
import { BsFillChatLeftFill } from "react-icons/bs";
import { FiSearch, FiMessageSquare } from "react-icons/fi";

import { useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import { useStateContext } from "../../../contexts/ContextProvider";

const DashNav = ({ profile }) => {
  const queryClient = useQueryClient();
  const {
    activeMenu,
    setActiveMenu,
    screenSize,
    setScreenSize,
    isClicked,
    handleClick,
  } = useStateContext();

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (screenSize <= 900) {
      setActiveMenu(false);
    } else {
      setActiveMenu(true);
    }
  }, [screenSize]);

  const logoutHandler = () => {
    localStorage.clear();
    sessionStorage.clear();

    queryClient.removeQueries("profile");
  };
  return (
    <div className="flex items-center justify-between p-4 text-white bg-emerald-800 rounded-sm sticky top-0 z-40">
      <button
        onClick={() => setActiveMenu((prev) => !prev)}
        className="p-2 bg-emerald-600 hover:bg-emerald-500 rounded-sm"
      >
        <FaBars />
      </button>
      {/* <form className="flex items-center border border-emerald-600 p-1 px-4">
        <input
          className="p-2 outline-none text-gray-300 bg-transparent "
          type="search"
          name=""
          id=""
        />
        <button type="submit">
          <FiSearch />
        </button>
      </form> */}
      <div className="flex items-center">
        <button className="p-2 mx-2 bg-emerald-600 hover:bg-emerald-500 rounded-sm">
          <BsFillChatLeftFill />
        </button>
        <button className="p-2 mx-2 bg-emerald-600 hover:bg-emerald-500 rounded-sm">
          <FaBell />
        </button>
        <span className="w-[2px] h-8 bg-gray-300 block mx-4"></span>
        <div className="flex items-center relative">
          <h2
            className="font-semibold mr-4 cursor-pointer hidden sm:block"
            onClick={() => handleClick("userProfile")}
          >
            Hi, {profile?.data.email?.split("@")[0]}
          </h2>
          <img
            onClick={() => handleClick("userProfile")}
            className="w-10 h-10 object-cover rounded-full cursor-pointer"
            src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt=""
          />
          {isClicked.userProfile && (
            <div className="bg-emerald-700 p-1 grid absolute right-2 -bottom-24 rounded-md rounded-tr-none">
              <Link
                onClick={() => {
                  handleClick("");
                }}
                className="hover:bg-emerald-600 p-2 rounded-md"
                to="/dashboard/profile"
              >
                Profile
              </Link>
              <Link
                className="hover:bg-emerald-600 p-2 rounded-md"
                onClick={() => {
                  logoutHandler();
                  handleClick("");
                }}
                to="/login"
              >
                Logout
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashNav;
