import { showNotification } from "@mantine/notifications";
import { useQuery, useQueryClient } from "react-query";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { getUserProfile, refreshToken } from "../apis/userApis";

const ProtectedRoute = ({ admin }) => {
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
      initialData: () => {
        const data = queryClient.getQueryData("profile");
        if (data) return data;
        else return undefined;
      },
      enabled: true,
      retry: false,
      refetchOnWindowFocus: false,
      onSuccess: (profile) => profileSuccess(profile),
      onError: (profileError) => profileErrorHandler(profileError),
    }
  );

  //Profile Handlers
  function profileSuccess(profile) {}
  function profileErrorHandler(profileError) {
    // showNotification({
    //   title: "Profile Error",
    //   message: profileError.response.data.message,
    //   color: "red",
    // });
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
      refetchProfile();
    }
  }
  function refreshTokenErrorHandler(refreshTokenError) {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login");
  }
  //   if (profile.isF && isAuthenticated === false) {
  //     return <Navigate to="/login" />;
  //   }
  //   if (!loading && isAdmin === true && user.role === "user") {
  //     return <Navigate to="/" />;
  //   }
  //   if (!loading && isAuthenticated === true) {
  //     return <Outlet />;
  //   }
  if (!isProfileFetching && !profile) {
    return <Navigate to="/login" />;
  }
  if (!isProfileFetching && profile?.data?.verified !== true) {
    return <Navigate to="/dashboard/verifyaccount" />;
  }
  if (admin && !isProfileFetching && profile?.data?.role !== "admin") {
    return <Navigate to="/dashboard/main" />;
  }
  if (!isProfileFetching && profile.success) {
    return <Outlet />;
  }
};

export default ProtectedRoute;
