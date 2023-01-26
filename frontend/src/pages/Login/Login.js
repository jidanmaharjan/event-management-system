import {
  Anchor,
  Button,
  Checkbox,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
  Image,
  Notification,
} from "@mantine/core";
import React, { useRef } from "react";
import { Carousel } from "@mantine/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useForm } from "@mantine/form";

//image imports
import logo from "../../assets/images/logo.png";
import e1 from "../../assets/images/e1.png";
import e2 from "../../assets/images/e2.png";
import e3 from "../../assets/images/e3.png";
import e4 from "../../assets/images/e4.png";
import google from "../../assets/images/google.png";

import { showNotification } from "@mantine/notifications";

import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { userLogin } from "../../apis/userApis";
const Login = () => {
  const navigate = useNavigate();

  const images = [
    {
      img: e1,
      title: "Organize your special days with ease",
      desc: "We have your back in your memorable times",
    },
    {
      img: e2,
      title: "Mark your date and be ready",
      desc: "Leave the arrangements to us",
    },
    {
      img: e3,
      title: "Relive your most joyous moments",
      desc: "Catch your breath on a break",
    },
    {
      img: e4,
      title: "Special days with your Special ones",
      desc: "This special days with your loved ones",
    },
  ];
  const slides = images.map((item) => (
    <Carousel.Slide key={item.img} className="flex items-center justify-center">
      <div>
        <div className="w-40 md:w-80 mx-auto">
          <Image src={item.img} />
        </div>
        <h3 className="text-center text-lg text-white font-semibold mt-4">
          {item.title}
        </h3>
        <p className="text-sm text-gray-400 text-center mt-4">{item.desc}</p>
      </div>
    </Carousel.Slide>
  ));
  const autoplay = useRef(Autoplay({ delay: 3000 }));

  const form = useForm({
    initialValues: { password: "", email: "", rememberMe: false },

    // functions will be used to validate values at corresponding key
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        value.length < 6 ? "Password must be at least 6 characters" : null,
    },
  });

  //login query
  const {
    isLoading: isLoginLoading,
    data: login,
    isError: isloginError,
    error: loginError,
    isFetching: isLoginFetching,
    refetch: refetchLogin,
  } = useQuery(
    "login",

    () =>
      userLogin({
        email: form.values.email,
        password: form.values.password,
      }),
    {
      enabled: false,
      retry: false,
      onSuccess: (login) => loginSuccess(login),
      onError: (loginError) => loginErrorHandler(loginError),
    }
  );

  //Login Handlers
  function loginSuccess(login) {
    if (login.success) {
      showNotification({
        title: "Login Success",
        message: "Redirecting to Dashboard",
        color: "green",
      });
      if (form.values.rememberMe) {
        sessionStorage.removeItem("refreshT");
        sessionStorage.removeItem("accessT");
        localStorage.setItem("refreshT", login.refreshT);
        localStorage.setItem("accessT", login.accessT);
      } else {
        localStorage.removeItem("refreshT");
        localStorage.removeItem("accessT");
        sessionStorage.setItem("refreshT", login.refreshT);
        sessionStorage.setItem("accessT", login.accessT);
      }
      navigate("/dashboard/main");
    } else loginErrorHandler();
  }
  function loginErrorHandler(loginError) {
    showNotification({
      title: "Login Error",
      message: loginError.response.data.message,
      color: "red",
    });
  }

  return (
    <div className="bg-emerald-900 md:p-8 min-h-screen w-full flex items-center justify-center">
      <div className="flex flex-col md:flex-row items-center bg-emerald-800 w-[1080px] 2xl:h-[720px] rounded-md overflow-hidden">
        <div className="p-8 bg-emerald-800 md:w-1/2 flex justify-center">
          <div className="h-fit max-w-40 md:max-w-80 flex justify-center overflow-hidden">
            <Carousel
              slideGap="md"
              loop
              withIndicators
              withControls={false}
              plugins={[autoplay.current]}
              styles={{
                indicator: {
                  width: 12,
                  height: 4,
                  transition: "width 250ms ease",

                  "&[data-active]": {
                    width: 40,
                  },
                },
              }}
            >
              {slides}
            </Carousel>
          </div>
        </div>
        <div className="w-full md:w-1/2 h-full bg-gray-100 ">
          <form
            className="bg-gray-100 p-8"
            onSubmit={form.onSubmit(() => refetchLogin())}
          >
            <Link
              to={"/"}
              order={2}
              className="flex justify-center my-8 text-2xl font-bold items-center w-fit mx-auto"
            >
              <div className="w-10 h-10 mr-4">
                <Image src={logo} />
              </div>
              Eve.
            </Link>

            <TextInput
              label="Email address"
              placeholder="hello@gmail.com"
              size="md"
              {...form.getInputProps("email")}
            />
            <PasswordInput
              label="Password"
              placeholder="Your password"
              mt="md"
              size="md"
              {...form.getInputProps("password")}
            />
            <div className="flex flex-col md:flex-row justify-between">
              <Checkbox
                label="Remember Me"
                className="mt-8"
                size="md"
                {...form.getInputProps("rememberMe", { type: "checkbox" })}
              />
              <Link
                to={"/forgot_password"}
                className="text-emerald-400 font-semibold mt-8 hover:underline"
              >
                Forgot Password ?
              </Link>
            </div>
            <Button
              className="bg-emerald-400 hover:bg-emerald-300"
              fullWidth
              mt="xl"
              size="md"
              type="submit"
            >
              Login
            </Button>
            <Button
              className="bg-white hover:bg-emerald-100 text-gray-400"
              fullWidth
              mt="xl"
              size="md"
            >
              <Image className="mr-4" src={google} />
              Sign in with Google
            </Button>

            <Text align="center" mt="md">
              Don&apos;t have an account?{" "}
              <Link
                to={"/signup"}
                className="text-emerald-400 font-semibold hover:underline"
              >
                Sign up
              </Link>
            </Text>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
