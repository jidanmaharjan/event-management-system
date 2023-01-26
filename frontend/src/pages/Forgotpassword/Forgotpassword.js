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
import { Link, useNavigate } from "react-router-dom";
import { resetUserPassword } from "../../apis/userApis";
import { useQuery, useQueryClient } from "react-query";
import { showNotification } from "@mantine/notifications";

const Forgotpassword = () => {
  const resetPasswordForm = useForm({
    initialValues: { email: "" },

    // functions will be used to validate values at corresponding key
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    },
  });

  //resetPassword query
  const {
    isLoading: isresetPasswordLoading,
    data: resetPassword,
    isError: isresetPasswordError,
    error: resetPasswordError,
    isFetching: isresetPasswordFetching,
    refetch: refetchresetPassword,
  } = useQuery(
    "resetPassword",

    () => resetUserPassword({ email: resetPasswordForm.values.email }),
    {
      enabled: false,
      retry: false,
      refetchOnWindowFocus: false,
      onSuccess: (resetPassword) => {
        showNotification({
          title: "Reset Link Success",
          message: resetPassword.message,
          color: "blue",
        });
        resetPasswordForm.reset();
      },
      onError: (resetPasswordError) => {
        showNotification({
          title: "Reset Link Failed",
          message: resetPasswordError.response.data.message,
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
        <Title align="center">Reset Password</Title>
        <form
          onSubmit={resetPasswordForm.onSubmit(() => {
            refetchresetPassword();
          })}
        >
          <TextInput
            className="mt-4"
            label="Enter Email"
            placeholder="Email"
            {...resetPasswordForm.getInputProps("email")}
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

export default Forgotpassword;
