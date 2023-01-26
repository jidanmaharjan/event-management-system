import { Badge } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { getAllCategory } from "../../../apis/categoryApis";
import {
  getUserEventSingle,
  initiateKhaltiPayment,
} from "../../../apis/eventApis";

const Paymentsingle = () => {
  const queryClient = useQueryClient();
  const { paymentId } = useParams();
  const [totalDays, setTotalDays] = useState(null);
  const navigate = useNavigate();

  //singleEvent query
  const {
    isLoading: issingleEventLoading,
    data: singleEvent,
    isError: issingleEventError,
    error: singleEventError,
    isFetching: issingleEventFetching,
    refetch: refetchsingleEvent,
  } = useQuery(
    "singleEvent",

    () =>
      getUserEventSingle({
        eventId: paymentId,
      }),
    {
      enabled: true,
      retry: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      onSuccess: (singleEvent) => {
        setTotalDays(
          moment
            .duration(
              moment(singleEvent?.data.endDate).diff(
                moment(singleEvent?.data.startDate)
              )
            )
            .asDays() + 1
        );
      },
    }
  );

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
      onSuccess: (category) => {},
    }
  );

  //khaltiPayment query
  const {
    isLoading: iskhaltiPaymentLoading,
    data: khaltiPayment,
    isError: iskhaltiPaymentError,
    error: khaltiPaymentError,
    isFetching: iskhaltiPaymentFetching,
    refetch: refetchkhaltiPayment,
  } = useQuery(
    "khaltiPayment",

    () =>
      initiateKhaltiPayment({
        eventId: paymentId,
        paymentDetails: {
          return_url: "http://localhost:3000/dashboard/payments/khalti",
          website_url: "http://localhost:3000",
          amount: Math.round(
            Number(
              (category?.filter(
                (unit) => unit._id === singleEvent?.data.category
              )[0].price -
                (category?.filter(
                  (unit) => unit._id === singleEvent?.data.category
                )[0].discount.percent *
                  category?.filter(
                    (unit) => unit._id === singleEvent?.data.category
                  )[0].price) /
                  100) *
                totalDays *
                100
            )
          ),
          customer_phone: singleEvent?.data.title,
          purchase_order_id: paymentId,
          purchase_order_name: category?.filter(
            (unit) => unit._id === singleEvent?.data.category
          )[0].name,
          discount: Number(
            category?.filter(
              (unit) => unit._id === singleEvent?.data.category
            )[0].discount.percent *
              category?.filter(
                (unit) => unit._id === singleEvent?.data.category
              )[0].price *
              totalDays
          ),
        },
      }),
    {
      enabled: false,
      retry: 0,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      onSuccess: (khaltiPayment) => {
        showNotification({
          title: "Payment on Process",
          message: "Redirecting to Khalti",
          color: "blue",
        });
        window.location.href = khaltiPayment?.data.payment_url;
      },
      onError: (khaltiPaymentError) => {
        showNotification({
          title: "Payment Error",
          message: khaltiPaymentError.response.data.message,
          color: "red",
        });
      },
    }
  );

  useEffect(() => {
    refetchsingleEvent();
  }, [paymentId]);
  return (
    <div className="p-4 text-white font-poppins">
      <h3 className="font-semibold text-xl mb-4">Payment Gateway</h3>
      <section className="body-font overflow-hidden text-white">
        <div className="container mx-auto">
          <div className=" mx-auto flex flex-wrap">
            <div className="lg:w-1/2 w-full  lg:py-6 mt-6 lg:mt-0">
              <h1 className="text-emerald-400 text-3xl title-font font-medium mb-1 uppercase">
                {
                  category?.filter(
                    (unit) => unit._id === singleEvent?.data.category
                  )[0]?.name
                }
              </h1>

              <p className="leading-relaxed mb-4">
                {singleEvent?.data.description}
              </p>
              <h3 className="text-lg font-semibold text-emerald-400">
                Details
              </h3>
              <div className="flex justify-center flex-col pb-5 border-b-2 border-gray-100 mb-5">
                <div>Contact: {singleEvent?.data.title}</div>
                <div>
                  Event Start:{" "}
                  {moment(singleEvent?.data.startDate).format("YYYY MM DD")}
                </div>
                <div>
                  Event End:{" "}
                  {moment(singleEvent?.data.endDate).format("YYYY MM DD")}
                </div>
                <div>
                  Status:{" "}
                  <Badge
                    variant="filled"
                    color={`${
                      singleEvent?.data.eventStatus === "pending"
                        ? "blue"
                        : singleEvent?.data.eventStatus === "approved"
                        ? "grape"
                        : singleEvent?.data.eventStatus === "ongoing"
                        ? "orange"
                        : singleEvent?.data.eventStatus === "completed"
                        ? "green"
                        : singleEvent?.data.eventStatus === "rejected"
                        ? "red"
                        : singleEvent?.data.eventStatus === "cancelled"
                        ? "yellow"
                        : "gray"
                    }`}
                  >
                    {singleEvent?.data.eventStatus}
                  </Badge>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-emerald-400">
                Pricing
              </h3>
              <div className="flex justify-center flex-col pb-5 border-b-2 border-gray-100 mb-5">
                <div>
                  Price: Rs.
                  {
                    category?.filter(
                      (unit) => unit._id === singleEvent?.data.category
                    )[0]?.price
                  }
                </div>
                <div>Total Days: {totalDays}</div>
                {category?.filter(
                  (unit) => unit._id === singleEvent?.data.category
                )[0]?.discount.percent ? (
                  <div>
                    Discount: Rs.{" "}
                    {(
                      (category?.filter(
                        (unit) => unit._id === singleEvent?.data.category
                      )[0]?.discount.percent *
                        category?.filter(
                          (unit) => unit._id === singleEvent?.data.category
                        )[0]?.price) /
                      100
                    ).toFixed(2)}{" "}
                    <span className="text-emerald-400 uppercase">
                      {"(" +
                        category?.filter(
                          (unit) => unit._id === singleEvent?.data.category
                        )[0]?.discount.occasion +
                        ")"}
                    </span>
                  </div>
                ) : null}
              </div>
              <div className="flex flex-col md:flex-row">
                <div className="title-font font-medium text-2xl text-white">
                  Total: Rs.{" "}
                  {(
                    (category?.filter(
                      (unit) => unit._id === singleEvent?.data.category
                    )[0]?.price -
                      (category?.filter(
                        (unit) => unit._id === singleEvent?.data.category
                      )[0]?.discount.percent *
                        category?.filter(
                          (unit) => unit._id === singleEvent?.data.category
                        )[0]?.price) /
                        100) *
                    totalDays
                  ).toFixed(2)}
                </div>
                <button
                  onClick={() => refetchkhaltiPayment()}
                  className="flex ml-auto text-white bg-emerald-500 border-0 py-2 px-6 focus:outline-none hover:bg-emerald-600 rounded"
                >
                  Pay with Khalti
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Paymentsingle;
