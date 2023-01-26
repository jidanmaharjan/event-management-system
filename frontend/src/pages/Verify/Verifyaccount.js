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
import {
  getUserProfile,
  sendOtpUser,
  verifyOtpUser,
} from "../../apis/userApis";
import { useQuery, useQueryClient } from "react-query";
import { showNotification } from "@mantine/notifications";

const Verifyaccount = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [timer, setTimer] = useState(null);

  const otpForm = useForm({
    initialValues: { otp: null },

    // functions will be used to validate values at corresponding key
    validate: {
      otp: (value) => (!value || value < 1 ? "Enter OTP" : null),
    },
  });

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
  }

  //sendOtp query
  const {
    isLoading: issendOtpLoading,
    data: sendOtp,
    isError: issendOtpError,
    error: sendOtpError,
    isFetching: issendOtpFetching,
    refetch: refetchsendOtp,
  } = useQuery(
    ["sendOtp", profile?.data?.email],

    () => sendOtpUser({ userEmail: profile?.data?.email }),
    {
      enabled: profile && !profile?.data?.verified && true,
      retry: false,
      refetchOnWindowFocus: false,
      onSuccess: (sendOtp) => sendOtpSuccess(sendOtp),
      onError: (sendOtpError) => sendOtpErrorHandler(sendOtpError),
    }
  );

  //sendOtp Handlers
  function sendOtpSuccess(sendOtp) {
    showNotification({
      title: "OTP Success",
      message: "OTP sent successfully",
      color: "green",
    });
    setTimer(null);
    setTimer(60);
  }
  function sendOtpErrorHandler(sendOtpError) {
    showNotification({
      title: "OTP Error",
      message: "OTP failed to send",
      color: "red",
    });
  }

  //verifyOtp query
  const {
    isLoading: isverifyOtpLoading,
    data: verifyOtp,
    isError: isverifyOtpError,
    error: verifyOtpError,
    isFetching: isverifyOtpFetching,
    refetch: refetchverifyOtp,
  } = useQuery(
    ["verifyOtp", profile?.data?.email, otpForm.values.otp],

    () =>
      verifyOtpUser({
        userEmail: profile?.data?.email,
        otpCode: otpForm.values.otp,
      }),
    {
      enabled: false,
      retry: false,
      refetchOnWindowFocus: false,
      onSuccess: (verifyOtp) => verifyOtpSuccess(verifyOtp),
      onError: (verifyOtpError) => verifyOtpErrorHandler(verifyOtpError),
    }
  );

  //verifyOtp Handlers
  function verifyOtpSuccess(verifyOtp) {
    showNotification({
      title: "OTP Verification Success",
      message: "OTP verified successfully",
      color: "green",
    });
    refetchProfile();
    navigate("/dashboard/main");
  }
  function verifyOtpErrorHandler(verifyOtpError) {
    showNotification({
      title: "OTP Error",
      message: verifyOtpError.response.data.message,
      color: "red",
    });
  }

  useEffect(() => {
    if (timer && timer > 0) {
      const clock = setTimeout(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(clock);
    }
  }, [timer]);

  useEffect(() => {
    if (profile?.data?.verified) {
      navigate("/dashboard/main");
    }
  }, []);

  return (
    <div className="w-full min-h-screen flex items-center font-poppins ">
      <Container
        size={420}
        className="md:border border-gray-300 rounded-md md:p-8"
      >
        <Link className="text-blue-400 hover:underline" to={"/"}>
          Go Home
        </Link>
        <Title align="center">Verify your account</Title>
        <form
          onSubmit={otpForm.onSubmit(() => {
            refetchverifyOtp();
          })}
        >
          <NumberInput
            className="mt-4"
            label="Enter OTP"
            placeholder="OTP"
            {...otpForm.getInputProps("otp")}
          />

          <Button
            disabled={isverifyOtpFetching}
            className="bg-emerald-400 hover:bg-emerald-300"
            fullWidth
            mt="xl"
            type="submit"
          >
            Verify OTP
          </Button>
        </form>
        <Button
          disabled={(timer && timer > 0 && true) || issendOtpFetching}
          onClick={() => refetchsendOtp()}
          variant="outline"
          className="text-emerald-400 border-emerald-400"
          fullWidth
          mt="xl"
        >
          {timer && timer > 0 ? (
            <RingProgress
              size={30}
              thickness={2}
              label={
                <Text size="xs" align="center">
                  {timer}
                </Text>
              }
              sections={[{ value: (timer * 100) / 60, color: "cyan" }]}
            />
          ) : null}{" "}
          Resend OTP
        </Button>
      </Container>
    </div>
  );
};

export default Verifyaccount;
