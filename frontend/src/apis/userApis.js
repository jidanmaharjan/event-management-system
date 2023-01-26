import axios from "axios";

export const userLogin = async ({ email, password }) => {
  const options = {
    method: "POST",
    url: "/v1/auth/login",
    params: {},
    headers: {},
    data: {
      email,
      password,
    },
  };
  const response = await axios.request(options);
  return response.data;
};

export const userRegister = async ({ email, password, cpassword }) => {
  const options = {
    method: "POST",
    url: "/v1/auth/register",
    params: {},
    headers: {},
    data: {
      email,
      password,
      cpassword,
    },
  };
  const response = await axios.request(options);
  return response.data;
};

export const getUserProfile = async () => {
  const options = {
    method: "GET",
    url: "/v1/auth/profile",
    params: {},
    headers: {},
    data: {},
  };
  const response = await axios.request(options);
  return response.data;
};

export const getAllUsersAdmin = async ({ page }) => {
  const options = {
    method: "GET",
    url: `/v1/auth/admin/getallusers?p=${page}`,
    params: {},
    headers: {},
    data: {},
  };
  const response = await axios.request(options);
  return response.data;
};

export const sendOtpUser = async ({ userEmail }) => {
  const options = {
    method: "POST",
    url: `/v1/auth/sendotp`,
    params: {},
    headers: {},
    data: {
      email: userEmail,
    },
  };
  const response = await axios.request(options);
  return response.data;
};

export const changeUserPassword = async ({
  oldPassword,
  newPassword,
  confirmNewPassword,
}) => {
  const options = {
    method: "PUT",
    url: `/v1/auth/changepassword`,
    params: {},
    headers: {},
    data: {
      oldPassword,
      newPassword,
      cNewPassword: confirmNewPassword,
    },
  };
  const response = await axios.request(options);
  return response.data;
};

export const resetUserPassword = async ({ email }) => {
  const options = {
    method: "POST",
    url: `/v1/auth/resetpassword`,
    params: {},
    headers: {},
    data: {
      email,
    },
  };
  const response = await axios.request(options);
  return response.data;
};

export const verifyResetUserPassword = async ({
  token,
  newPassword,
  cNewPassword,
}) => {
  console.log(token, newPassword, cNewPassword);
  const options = {
    method: "POST",
    url: `/v1/auth/verifyresetpassword`,
    params: {},
    headers: {},
    data: {
      token,
      newPassword,
      cNewPassword,
    },
  };
  const response = await axios.request(options);
  return response.data;
};

export const verifyOtpUser = async ({ userEmail, otpCode }) => {
  const options = {
    method: "POST",
    url: `/v1/auth/verifyotp`,
    params: {},
    headers: {},
    data: {
      email: userEmail,
      otp: otpCode,
    },
  };
  const response = await axios.request(options);
  return response.data;
};

export const deleteUserAdmin = async ({ userId }) => {
  const options = {
    method: "DELETE",
    url: `/v1/auth/admin/action/${userId}`,
    params: {},
    headers: {},
    data: {},
  };
  const response = await axios.request(options);
  return response.data;
};

export const refreshToken = async () => {
  const token =
    localStorage.getItem("refreshT") ||
    sessionStorage.getItem("refreshT") ||
    null;

  const options = {
    method: "POST",
    url: "/v1/auth/renew",
    params: {},
    headers: {},
    data: {
      token,
    },
  };
  const response = await axios.request(options);
  return response.data;
};
