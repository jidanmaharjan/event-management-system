import { Button, Modal, PasswordInput, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import React, { useState } from "react";

//icons
import { TbEdit } from "react-icons/tb";
import { useQuery } from "react-query";
import { changeUserPassword } from "../../../apis/userApis";

const Profile = ({ profile }) => {
  const [changePasswordIsOpen, setChangePasswordIsOpen] = useState(false);

  //change password query
  const {
    isLoading: ischangePasswordLoading,
    data: changePassword,
    isError: ischangePasswordError,
    error: changePasswordError,
    isFetching: ischangePasswordFetching,
    refetch: refetchchangePassword,
  } = useQuery(
    "changePassword",

    () =>
      changeUserPassword({
        oldPassword: changePasswordForm.values.oldPassword,
        newPassword: changePasswordForm.values.newPassword,
        confirmNewPassword: changePasswordForm.values.confirmNewPassword,
      }),
    {
      enabled: false,
      retry: 0,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      onSuccess: (changePassword) => {
        showNotification({
          title: "Password changed",
          message: changePassword.message,
          color: "green",
        });
        changePasswordForm.reset();
        setChangePasswordIsOpen(false);
      },
      onError: (changePasswordError) => {
        showNotification({
          title: "Change Password Error",
          message: changePasswordError.response.data.message,
          color: "red",
        });
      },
    }
  );

  const changePasswordForm = useForm({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },

    // functions will be used to validate values at corresponding key
    validate: {
      oldPassword: (value) =>
        value.length < 1 ? "Password cannot be empty" : null,

      newPassword: (value) =>
        value.length < 1 ? "Password cannot be empty" : null,
      confirmNewPassword: (value) =>
        value.length < 1 ? "Password cannot be empty" : null,
    },
  });
  return (
    <div className="p-4 text-white">
      <div className="grid  bg-emerald-700 rounded-md p-4 mt-12 relative">
        <div className="absolute top-[-2.5rem] left-4 border-8 rounded-full border-emerald-900">
          <p className="p-1 bg-emerald-300 text-5xl w-20 h-20 flex justify-center items-center font-bold text-white rounded-full mx-auto">
            {profile?.data.email.slice(0, 1)[0].toUpperCase()}
          </p>
        </div>
        <Modal
          opened={changePasswordIsOpen}
          onClose={() => setChangePasswordIsOpen(false)}
          withCloseButton={false}
          centered
          className=""
        >
          <div className="">
            <h3 className="font-semibold text-xl">Change Password</h3>
            <form
              onSubmit={changePasswordForm.onSubmit(() =>
                refetchchangePassword()
              )}
            >
              <PasswordInput
                label="Old Password"
                placeholder="Enter Old Password"
                {...changePasswordForm.getInputProps("oldPassword")}
              />
              <PasswordInput
                mt="sm"
                label="New Password"
                placeholder="Enter New Password"
                {...changePasswordForm.getInputProps("newPassword")}
              />
              <PasswordInput
                mt="sm"
                label="Confirm New Password"
                placeholder="Re-type your new password"
                {...changePasswordForm.getInputProps("confirmNewPassword")}
              />
              <Button
                disabled={ischangePasswordFetching}
                className="bg-emerald-500 hover:bg-emerald-400 w-full"
                type="submit"
                mt="sm"
              >
                Change Password
              </Button>
            </form>
          </div>
        </Modal>
        {profile && (
          <div className="mt-12 grid">
            <div className="">
              <h3 className="font-semibold text-emerald-400 text-lg 2xl:text-xl ">
                Email Address
              </h3>
              <p className="mb-2 ">{profile?.data.email}</p>
              <h3 className="font-semibold text-emerald-400 text-lg 2xl:text-xl ">
                Role
              </h3>
              <p className="mb-2 ">{profile?.data.role}</p>
              <h3 className="font-semibold text-emerald-400 text-lg 2xl:text-xl ">
                Status
              </h3>
              <p className="mb-2 ">{profile?.data.verified && "Verified"}</p>
            </div>
            <button
              onClick={() => setChangePasswordIsOpen(true)}
              className="mt-4 bg-emerald-400 text-gray-100 text-center py-3 px-4 rounded-md flex justify-center items-center"
            >
              <TbEdit className="text-xl" /> Change Password
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
