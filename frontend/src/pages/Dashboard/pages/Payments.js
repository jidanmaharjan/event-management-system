import { Accordion, Badge, Button, Modal } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { getAllCategory } from "../../../apis/categoryApis";
import { cancelBookingUser, getEvents } from "../../../apis/eventApis";

//icon imports
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";

const Payments = () => {
  const [page, setPage] = useState(1);
  const [confirmCancelIsOpen, setConfirmCancelIsOpen] = useState(false);
  const [cancelId, setCancelId] = useState(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  //payments query
  const {
    isLoading: isPaymentsLoading,
    data: payments,
    isError: isPaymentError,
    error: paymenterror,
    isFetching: isPaymentFetching,
    refetch: refetchPayments,
  } = useQuery(
    "payments",

    () => getEvents({ page }),
    {
      enabled: true,
      retry: 2,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      onSuccess: (payments) => paymentsSuccess(payments),
      onError: (paymentsError) => paymentsErrorHandler(paymentsError),
    }
  );

  //Payments Handlers
  function paymentsSuccess(payments) {}
  function paymentsErrorHandler(paymentsError) {
    queryClient.invalidateQueries("profile");
  }

  //category query
  const {
    isLoading: isCategoryLoading,
    data: category,
    isError: isCategoryError,
    error: categoryError,
    isFetching: isCategoryFetching,
    refetch: refetchCategory,
  } = useQuery(
    "category",

    () => getAllCategory(),
    {
      initialData: () => {
        const data = queryClient.getQueryData("category");
        if (data) return data;
        else return undefined;
      },
      enabled: true,
      retry: 0,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      onSuccess: (category) => categorySuccess(category),
      onError: (categoryError) => categoryErrorHandler(categoryError),
    }
  );

  //Category Handlers
  function categorySuccess(category) {}
  function categoryErrorHandler(categoryError) {
    showNotification({
      title: "Category Error",
      message: categoryError.response.data.message,
      color: "red",
    });
  }

  //cancelBooking query
  const {
    isLoading: iscancelBookingLoading,
    data: cancelBooking,
    isError: iscancelBookingError,
    error: cancelBookingError,
    isFetching: iscancelBookingFetching,
    refetch: refetchcancelBooking,
  } = useQuery(
    "cancelBooking",

    () => cancelBookingUser({ cancelEventId: cancelId }),
    {
      enabled: false,
      retry: 0,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      onSuccess: (cancelBooking) => cancelBookingSuccess(cancelBooking),
      onError: (cancelBookingError) =>
        cancelBookingErrorHandler(cancelBookingError),
    }
  );

  //cancelBooking Handlers
  function cancelBookingSuccess(cancelBooking) {
    showNotification({
      title: "Cancel Booking Success",
      message: cancelBooking.message,
      color: "green",
    });
    setConfirmCancelIsOpen(false);
    setCancelId(null);
    refetchPayments();
  }
  function cancelBookingErrorHandler(cancelBookingError) {
    showNotification({
      title: "cancelBooking Error",
      message: cancelBookingError.response.data.message,
      color: "red",
    });
    setConfirmCancelIsOpen(false);
    setCancelId(null);
  }

  useEffect(() => {
    refetchPayments();
  }, [page]);
  const pageDown = () => {
    if (page === 1) {
      return;
    }
    setPage((prev) => prev - 1);
  };
  const pageUp = () => {
    if (page === Math.ceil(payments?.count / 8)) {
      return;
    }
    setPage((prev) => prev + 1);
  };
  return (
    <div className="text-white font-poppins p-4">
      <Modal
        opened={confirmCancelIsOpen}
        onClose={() => setConfirmCancelIsOpen(false)}
        title="Are you sure to cancel this booking?"
        centered
      >
        <div>
          <div className="mt-4 text-white">
            <button
              onClick={() => refetchcancelBooking()}
              disabled={iscancelBookingFetching}
              className="p-2 rounded-sm bg-red-400 font-semibold font-poppins"
            >
              Yes, Cancel Booking
            </button>
            <button
              onClick={() => setConfirmCancelIsOpen(false)}
              className="p-2 rounded-sm bg-blue-400 font-semibold font-poppins ml-4"
            >
              No
            </button>
          </div>
        </div>
      </Modal>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-xl mb-4">Booked Events</h3>
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
      <Accordion defaultValue="customization">
        {payments?.data?.map((item, index) => (
          <Accordion.Item
            key={item._id}
            value={item._id}
            className="border-none mb-2"
          >
            <Accordion.Control className="bg-emerald-800 text-white hover:bg-emerald-700">
              {item.title}
            </Accordion.Control>
            <Accordion.Panel>
              <div className="text-white" key={item._id}>
                <h3 className="text-gray-300 ">{item.description}</h3>
                <h3 className="font-semibold mt-2">
                  From: {moment(item.startDate).format("YYYY MM DD")}
                </h3>
                <h3 className="font-semibold mt-2">
                  To: {moment(item.endDate).format("YYYY MM DD")}
                </h3>
                <h3 className="mt-4">
                  Category:{" "}
                  <Badge variant="light" color="teal">
                    {category?.find((unit) => unit._id === item.category)?.name}
                  </Badge>
                </h3>
                <h3 className="mt-2">
                  Payment Status:{" "}
                  <Badge
                    variant="outline"
                    color={`${
                      item.payment.status === "unpaid"
                        ? "red"
                        : item.payment.status === "paid"
                        ? "green"
                        : "yellow"
                    }`}
                  >
                    {item.payment.status}
                  </Badge>
                </h3>
                {!item.payment.status === "unpaid" && (
                  <h3 className="mt-2">
                    Payment Amount: {item.payment.amount}
                  </h3>
                )}
                <div className=" mt-2  w-fit">
                  Status:{" "}
                  <Badge
                    variant="filled"
                    color={`${
                      item.eventStatus === "pending"
                        ? "blue"
                        : item.eventStatus === "approved"
                        ? "grape"
                        : item.eventStatus === "ongoing"
                        ? "orange"
                        : item.eventStatus === "completed"
                        ? "green"
                        : item.eventStatus === "rejected"
                        ? "red"
                        : item.eventStatus === "cancelled"
                        ? "yellow"
                        : "gray"
                    }`}
                  >
                    {item.eventStatus}
                  </Badge>
                </div>
                {item.eventStatus !== "rejected" &&
                  item.eventStatus !== "cancelled" && (
                    <div className="mt-4">
                      {item.payment.status !== "paid" && (
                        <Button
                          onClick={() =>
                            navigate(`/dashboard/payments/${item._id}`)
                          }
                          className="bg-emerald-700 mr-4"
                          color="teal"
                        >
                          Pay Now
                        </Button>
                      )}
                      {(item.eventStatus === "pending" ||
                        item.eventStatus === "approved") && (
                        <Button
                          onClick={() => {
                            setCancelId(item._id);
                            setConfirmCancelIsOpen(true);
                          }}
                          className="bg-emerald-200"
                          variant="light"
                          color="teal"
                        >
                          Cancel Booking
                        </Button>
                      )}
                    </div>
                  )}
              </div>
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  );
};

export default Payments;
