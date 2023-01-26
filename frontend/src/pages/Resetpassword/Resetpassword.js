import React, { useEffect, useState } from "react";
import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
  NumberInput,
  RingProgress,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  resetUserPassword,
  verifyResetUserPassword,
} from "../../apis/userApis";
import { useQuery, useQueryClient } from "react-query";
import { showNotification } from "@mantine/notifications";

const Resetpassword = () => {
  const { resetToken } = useParams();
  const navigate = useNavigate();
  const resetPasswordForm = useForm({
    initialValues: { newPassword: "", confirmNewPassword: "" },

    // functions will be used to validate values at corresponding key
    validate: {
      newPassword: (value) =>
        value.length < 6 ? "Password must be at least 6 characters" : null,
      confirmNewPassword: (value) =>
        value.length < 6 ? "Password must be at least 6 characters" : null,
    },
  });

  //verifyResetPassword query
  const {
    isLoading: isverifyResetPasswordLoading,
    data: verifyResetPassword,
    isError: isverifyResetPasswordError,
    error: verifyResetPasswordError,
    isFetching: isverifyResetPasswordFetching,
    refetch: refetchverifyResetPassword,
  } = useQuery(
    "verifyResetPassword",

    () =>
      verifyResetUserPassword({
        token: resetToken,
        newPassword: resetPasswordForm.values.newPassword,
        cNewPassword: resetPasswordForm.values.confirmNewPassword,
      }),
    {
      enabled: false,
      retry: false,
      refetchOnWindowFocus: false,
      onSuccess: (verifyResetPassword) => {
        showNotification({
          title: "Reset Password Success",
          message: verifyResetPassword.message,
          color: "green",
        });
        navigate("/login");
      },
      onError: (verifyResetPasswordError) => {
        showNotification({
          title: "Reset Password Failed",
          message: verifyResetPasswordError.response.data.message,
          color: "red",
        });
      },
    }
  );

  return (
    <div className="w-full min-h-screen flex items-center font-poppins ">
      <Container
        size={420}
        className="md:border border-gray-300 rounded-md md:p-8"
      >
        <Link className="text-blue-400 hover:underline" to={"/login"}>
          Go back to Login
        </Link>
        <Title align="center">Set New Password</Title>
        <form
          onSubmit={resetPasswordForm.onSubmit(() => {
            refetchverifyResetPassword();
          })}
        >
          <PasswordInput
            className="mt-4"
            label="Enter New Password"
            placeholder="New Password"
            {...resetPasswordForm.getInputProps("newPassword")}
          />
          <PasswordInput
            className="mt-4"
            label="Re-Enter New Password"
            placeholder="New Password"
            {...resetPasswordForm.getInputProps("confirmNewPassword")}
          />

          <Button
            className="bg-emerald-400 hover:bg-emerald-300"
            fullWidth
            mt="xl"
            type="submit"
          >
            Reset Password
          </Button>
        </form>
      </Container>
    </div>
  );
};

export default Resetpassword;
