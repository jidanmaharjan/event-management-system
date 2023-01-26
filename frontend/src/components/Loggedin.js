import { showNotification } from "@mantine/notifications";
import { useQuery, useQueryClient } from "react-query";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { getUserProfile, refreshToken } from "../apis/userApis";

//icon imports
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const Loggedin = () => {
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
    const local = localStorage.getItem("refreshT");
    const session = sessionStorage.getItem("refreshT");
    if (local || session) {
      refetchRefreshedToken();
    }
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
    if (refreshedToken && (local || session)) {
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

  if (!isProfileFetching && profile) {
    return <Navigate to="/dashboard/main" />;
  }
  if (!isProfileFetching && !profile) {
    return <Outlet />;
  }
  return (
    <>
      {isProfileFetching && (
        <div className="w-full min-h-screen bg-emerald-900 grid place-content-center">
          <AiOutlineLoading3Quarters className="animate-spin text-3xl text-emerald-300 mr-2" />
        </div>
      )}
    </>
  );
};

export default Loggedin;
