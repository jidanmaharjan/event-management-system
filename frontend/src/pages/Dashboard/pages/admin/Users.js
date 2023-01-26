import { Modal, Table } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import React, { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { deleteUserAdmin, getAllUsersAdmin } from "../../../../apis/userApis";

//icon imports
import { AiOutlineDelete, AiOutlineLeft, AiOutlineRight } from "react-icons/ai";

const Users = () => {
  const [page, setPage] = useState(1);
  const [userToDelete, setUserToDelete] = useState(null);
  const [confirmDeleteIsOpen, setConfirmDeleteIsOpen] = useState(false);
  const queryClient = useQueryClient();

  //allUsers query
  const {
    isLoading: isallUsersLoading,
    data: allUsers,
    isError: isallUsersError,
    error: allUsersError,
    isFetching: isallUsersFetching,
    refetch: refetchallUsers,
  } = useQuery(
    "getAllUsers",

    () => getAllUsersAdmin({ page }),
    {
      enabled: true,
      retry: 0,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      onSuccess: (allUsers) => allUsersSuccess(allUsers),
      onError: (allUsersError) => allUsersErrorHandler(allUsersError),
    }
  );

  //allUsers Handlers
  function allUsersSuccess(allUsers) {
    console.log(allUsers);
  }
  function allUsersErrorHandler(allUsersError) {
    queryClient.invalidateQueries("profile");
  }

  //deleteUser query
  const {
    isLoading: isdeleteUserLoading,
    data: deleteUser,
    isError: isdeleteUserError,
    error: deleteUserError,
    isFetching: isdeleteUserFetching,
    refetch: refetchdeleteUser,
  } = useQuery(
    "deleteUser",

    () => deleteUserAdmin({ userId: userToDelete }),
    {
      enabled: false,
      retry: 0,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      onSuccess: (deleteUser) => deleteUserSuccess(deleteUser),
      onError: (deleteUserError) => deleteUserErrorHandler(deleteUserError),
    }
  );

  //deleteUser Handlers
  function deleteUserSuccess(deleteUser) {
    showNotification({
      title: "Delete User Success",
      message: deleteUser.message,
      color: "green",
    });
    setConfirmDeleteIsOpen(false);
    setUserToDelete(null);
    refetchallUsers();
  }
  function deleteUserErrorHandler(deleteUserError) {
    showNotification({
      title: "Delete User Error",
      message: deleteUserError.response.data.message,
      color: "red",
    });
  }

  useEffect(() => {
    refetchallUsers();
  }, [page]);
  const pageDown = () => {
    if (page === 1) {
      return;
    }
    setPage((prev) => prev - 1);
  };
  const pageUp = () => {
    if (page === Math.ceil(allUsers?.count / 8)) {
      return;
    }
    setPage((prev) => prev + 1);
  };

  const rows =
    allUsers &&
    allUsers?.data.map((element, index) => (
      <tr key={element._id}>
        <td>{index + 1}</td>
        <td>{element.email}</td>
        <td>{element.role}</td>
        <td>{element.verified ? "Verified" : "Unverified"}</td>
        <td>
          <button
            onClick={() => {
              setConfirmDeleteIsOpen(true);
              setUserToDelete(element._id);
            }}
            className="flex items-center bg-red-400 hover:bg-red-300 py-1 px-2 rounded-sm font-semibold"
          >
            <AiOutlineDelete /> Delete
          </button>
        </td>
      </tr>
    ));
  return (
    <div className="p-4 text-white font-poppins">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-xl mb-4">Users</h3>
        <div className="flex items-center">
          <button
            onClick={pageDown}
            className="p-2 bg-emerald-800 rounded-sm hover:bg-emerald-700"
          >
            <AiOutlineLeft />
          </button>
          <span className=" ml-2 outline-none p-2">{page}</span>
          <button
            onClick={pageUp}
            className="p-2 bg-emerald-800 rounded-sm hover:bg-emerald-700 ml-2"
          >
            <AiOutlineRight />
          </button>
        </div>
      </div>
      <Modal
        opened={confirmDeleteIsOpen}
        onClose={() => setConfirmDeleteIsOpen(false)}
        title="Are you sure to delete?"
        centered
      >
        <div>
          <div onClick={() => refetchdeleteUser()} className="mt-4 text-white">
            <button
              disabled={isdeleteUserFetching}
              className="p-2 rounded-sm bg-red-400 font-semibold font-poppins"
            >
              Delete
            </button>
            <button
              onClick={() => setConfirmDeleteIsOpen(false)}
              className="p-2 rounded-sm bg-blue-400 font-semibold font-poppins ml-4"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
      <div className="overflow-x-scroll">
        <Table className="text-white">
          <thead>
            <tr>
              <th className="text-white">S.No.</th>
              <th className="text-white">Email</th>
              <th className="text-white">Role</th>
              <th className="text-white">Status</th>
              <th className="text-white">Action</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </div>
    </div>
  );
};

export default Users;
