import { showNotification } from "@mantine/notifications";
import axios from "axios";
import React from "react";
import { useQuery, useQueryClient } from "react-query";
import { Route, Routes, useNavigate } from "react-router-dom";
import { getUserProfile, refreshToken } from "../../apis/userApis";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useStateContext } from "../../contexts/ContextProvider";

//component imports
import DashNav from "./components/DashNav";
import Sidebar from "./components/Sidebar";

//pages imports
import Calendar from "./pages/Calendar";
import Faqs from "./pages/Faqs";
import Main from "./pages/Main";
import Payments from "./pages/Payments";
import Categories from "./pages/admin/Categories";
import Events from "./pages/admin/Events";
import Users from "./pages/admin/Users";
import Feedback from "./pages/Feedback";
import Settings from "./pages/Settings";
import Paymentsingle from "./pages/Paymentsingle";
import Profile from "./pages/Profile";

//icon imports
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Paymentverify from "./pages/Paymentverify";
import Verifyaccount from "../Verify/Verifyaccount";

const Dashboard = () => {
  const { activeMenu, screenSize, handleClick } = useStateContext();
  const enabledStatus =
    localStorage.getItem("accessT") || sessionStorage.getItem("accessT")
      ? true
      : false;

  const queryClient = useQueryClient();

  const navigate = useNavigate();
  //profile query
  const {
    isLoading: isProfileLoading,
    data: profile,
    isError: isProfileError,
    error: profileError,
    isFetching: isProfileFetching,
    refetch: refetchProfile,
  } = useQuery(
    "profile",

    () => getUserProfile(),
    {
      enabled: true,
      retry: false,
      refetchOnWindowFocus: false,
      onSuccess: (profile) => profileSuccess(profile),
      onError: (profileError) => profileErrorHandler(profileError),
    }
  );

  //Profile Handlers
  function profileSuccess(profile) {
    queryClient.invalidateQueries(
      "payments",
      "bookedEventSummary",
      "bookedDates"
    );
  }
  function profileErrorHandler(profileError) {
    refetchRefreshedToken();
  }

  //refreshToken query
  const {
    isLoading: isRefreshTokenLoading,
    data: refreshedToken,
    isError: isRefreshTokenError,
    error: refreshTokenError,
    isFetching: isRefreshTokenFetching,
    refetch: refetchRefreshedToken,
  } = useQuery(
    "refreshToken",

    () => refreshToken(),
    {
      enabled: false,
      retry: false,
      refetchOnWindowFocus: false,
      onSuccess: (refreshedToken) => refreshTokenSuccess(refreshedToken),
      onError: (refreshTokenError) =>
        refreshTokenErrorHandler(refreshTokenError),
    }
  );

  //token Handlers
  function refreshTokenSuccess(refreshedToken) {
    const local = localStorage.getItem("refreshT");
    const session = sessionStorage.getItem("refreshT");
    if (refreshedToken) {
      if (local) {
        localStorage.setItem("accessT", refreshedToken.token);
      }
      if (session) {
        sessionStorage.setItem("accessT", refreshedToken.token);
      }
      if (!local && !session) {
        navigate("/login");
        return;
      }
      refetchProfile();
    }
  }
  function refreshTokenErrorHandler(refreshTokenError) {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login");
  }

  if (isProfileLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <AiOutlineLoading3Quarters className="text-3xl text-emerald-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-emerald-900 min-h-screen w-full">
      <Sidebar profile={profile} />
      <div
        className={`${
          activeMenu && screenSize > 800 ? "pl-80" : null
        } transition-all duration-150 ease-in-out`}
      >
        <DashNav profile={profile} />
        <div onClick={() => handleClick("")}>
          <Routes>
            <Route path="main" element={<ProtectedRoute />}>
              <Route path="" element={<Main />} />
            </Route>
            <Route path="profile" element={<ProtectedRoute />}>
              <Route path="" element={<Profile profile={profile} />} />
            </Route>
            <Route path="calendar" element={<ProtectedRoute />}>
              <Route path="" element={<Calendar />} />
            </Route>
            <Route path="/verifyaccount" element={<ProtectedRoute />}>
              <Route path="" element={<Verifyaccount />} />
            </Route>
            <Route path="payments" element={<ProtectedRoute />}>
              <Route path="" element={<Payments />} />
            </Route>
            <Route path="payments/khalti" element={<ProtectedRoute />}>
              <Route path="" element={<Paymentverify />} />
            </Route>
            <Route path="payments/:paymentId" element={<ProtectedRoute />}>
              <Route path="" element={<Paymentsingle />} />
            </Route>
            <Route path="settings" element={<ProtectedRoute />}>
              <Route path="" element={<Settings />} />
            </Route>
            <Route path="faqs" element={<ProtectedRoute />}>
              <Route path="" element={<Faqs />} />
            </Route>
            <Route path="feedback" element={<ProtectedRoute />}>
              <Route path="" element={<Feedback />} />
            </Route>
            <Route
              path="admin/events"
              element={<ProtectedRoute admin={true} />}
            >
              <Route path="" element={<Events />} />
            </Route>
            <Route
              path="admin/categories"
              element={<ProtectedRoute admin={true} />}
            >
              <Route path="" element={<Categories />} />
            </Route>
            <Route path="admin/users" element={<ProtectedRoute admin={true} />}>
              <Route path="" element={<Users />} />
            </Route>
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
