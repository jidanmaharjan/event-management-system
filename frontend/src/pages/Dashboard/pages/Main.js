import React, { useEffect, useState } from "react";
import { Calendar } from "@mantine/dates";
import { getEventSummary, getUserEventDates } from "../../../apis/eventApis";
import { useQuery, useQueryClient } from "react-query";
import moment from "moment";

//icon imports
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const Main = () => {
  const queryClient = useQueryClient();
  const [bookedDatesModified, setBookedDatesModified] = useState([]);
  // const [bookedDateSummaryModified, setBookedDateSummaryModified] = useState({
  //   pending: 0,
  //   approved: 0,
  //   ongoing: 0,
  //   completed: 0,
  //   rejected: 0,
  //   cancelled: 0,
  // });
  const [pending, setPending] = useState(0);
  const [approved, setApproved] = useState(0);
  const [ongoing, setOngoing] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [rejected, setRejected] = useState(0);
  const [cancelled, setCancelled] = useState(0);

  //bookedDates query
  const {
    isLoading: isbookedDatesLoading,
    data: bookedDates,
    isError: isbookedDatesError,
    error: bookedDatesError,
    isFetching: isbookedDatesFetching,
    refetch: refetchbookedDates,
  } = useQuery(
    "bookedDates",

    () => getUserEventDates(),
    {
      enabled: true,
      retry: false,
      refetchOnWindowFocus: false,
      onSuccess: (bookedDates) => bookedDatesSuccess(bookedDates),
      onError: (bookedDatesError) => bookedDatesErrorHandler(bookedDatesError),
    }
  );

  //bookedDates Handlers
  function bookedDatesSuccess(bookedDates) {
    const array = [];
    if (bookedDates?.data.length > 0) {
      for (let index = 0; index < bookedDates?.data?.length; index++) {
        let incrementDate = moment(bookedDates?.data[index].startDate).format(
          "YYYY MM DD"
        );
        let incre = 1;
        array.push(incrementDate);
        while (
          incrementDate !==
          moment(bookedDates?.data[index].endDate).format("YYYY MM DD")
        ) {
          incrementDate = moment(bookedDates?.data[index].startDate)
            .add(incre, "days")
            .format("YYYY MM DD");
          incre++;
          array.push(incrementDate);
        }
      }
      setBookedDatesModified(array);
    }
  }
  function bookedDatesErrorHandler(bookedDatesError) {}

  //bookedEventSummary query
  const {
    isLoading: isbookedEventSummaryLoading,
    data: bookedEventSummary,
    isError: isbookedEventSummaryError,
    error: bookedEventSummaryError,
    isFetching: isbookedEventSummaryFetching,
    refetch: refetchbookedEventSummary,
  } = useQuery(
    "bookedEventSummary",

    () => getEventSummary(),
    {
      enabled: true,
      retry: false,
      refetchOnWindowFocus: false,
      onSuccess: (bookedEventSummary) => {
        setPending(0);
        setApproved(0);
        setOngoing(0);
        setCompleted(0);
        setRejected(0);
        setCancelled(0);
        bookedEventSummary?.data.map((unit) => {
          switch (unit.eventStatus) {
            case "pending":
              setPending((prev) => prev + 1);
              break;
            case "approved":
              setApproved((prev) => prev + 1);
              break;
            case "completed":
              setCompleted((prev) => prev + 1);
              break;
            case "ongoing":
              setOngoing((prev) => prev + 1);
              break;
            case "rejected":
              setRejected((prev) => prev + 1);
              break;
            case "cancelled":
              setCancelled((prev) => prev + 1);
              break;
          }
        });
      },
      onError: () => {},
    }
  );

  return (
    <div className="p-4 text-white">
      <h3 className="font-semibold text-lg">Booking History</h3>
      {isbookedEventSummaryLoading ? (
        <div className="w-full min-h-32 flex items-center justify-center">
          <AiOutlineLoading3Quarters className="text-3xl text-emerald-400 animate-spin" />
        </div>
      ) : (
        <div className="flex overflow-x-hidden hover:overflow-x-scroll mt-4 gap-4">
          <div className="bg-emerald-700 p-4 rounded-sm w-60">
            <h2 className="text-2xl">{bookedEventSummary?.count}</h2>
            <h3>Total bookings</h3>
          </div>
          <div className="bg-emerald-700 p-4 rounded-sm w-60">
            <h2 className="text-2xl">{pending}</h2>
            <h3>Pending</h3>
          </div>
          <div className="bg-emerald-700 p-4 rounded-sm w-60">
            <h2 className="text-2xl">{approved}</h2>
            <h3>Approved</h3>
          </div>
          <div className="bg-emerald-700 p-4 rounded-sm w-60">
            <h2 className="text-2xl">{ongoing}</h2>
            <h3>Ongoing</h3>
          </div>
          <div className="bg-emerald-700 p-4 rounded-sm w-60">
            <h2 className="text-2xl">{completed}</h2>
            <h3>Completed</h3>
          </div>
          <div className="bg-emerald-700 p-4 rounded-sm w-60">
            <h2 className="text-2xl">{cancelled}</h2>
            <h3>Cancelled</h3>
          </div>
        </div>
      )}

      <h3 className="font-semibold text-lg mt-4">Upcoming Events</h3>
      <Calendar
        className="bg-emerald-800 rounded-md mt-4"
        fullWidth
        size="xl"
        dayStyle={
          (date) =>
            bookedDatesModified.length > 0 &&
            bookedDatesModified.includes(moment(date).format("YYYY MM DD"))
              ? { backgroundColor: "#10b981", color: "white" }
              : null
          // bookedDates?.data.forEach((element) => {
          //   date.getFullYear() === new Date(element.startDate).getFullYear() &&
          //   date.getMonth() === new Date(element.startDate).getMonth() &&
          //   date.getDate() === new Date(element.startDate).getDate()
          //     ? { backgroundColor: "red", color: "white" }
          //     : null;
          // })
        }
        styles={(theme) => ({
          cell: {
            border: `1px solid ${
              theme.colorScheme === "dark"
                ? theme.colors.dark[4]
                : theme.colors.gray[2]
            }`,
          },
          day: {
            borderRadius: 0,
            height: 70,
            fontSize: theme.fontSizes.lg,
            color: "gray",
          },
          weekday: { fontSize: theme.fontSizes.lg },
          weekdayCell: {
            fontSize: theme.fontSizes.xl,
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[5]
                : theme.colors.gray[0],
            border: `1px solid ${
              theme.colorScheme === "dark"
                ? theme.colors.dark[4]
                : theme.colors.gray[2]
            }`,
            height: 70,
          },
        })}
      />
    </div>
  );
};

export default Main;
