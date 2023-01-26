import { Accordion, Badge } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import {
  changeEventStatusAdmin,
  getAllEvents,
} from "../../../../apis/eventApis";

//icon imports
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { getAllCategory } from "../../../../apis/categoryApis";

const Events = () => {
  const [page, setPage] = useState(1);
  const [changeEventId, setChangeEventId] = useState(null);
  const [changedEventStatus, setChangedEventStatus] = useState(null);
  const queryClient = useQueryClient();

  //allEvents query
  const {
    isLoading: isallEventsLoading,
    data: allEvents,
    isError: isallEventsError,
    error: allEventserror,
    isFetching: isallEventsFetching,
    refetch: refetchallEvents,
  } = useQuery(
    "allEvents",

    () => getAllEvents({ page }),
    {
      enabled: true,
      retry: 2,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      onSuccess: (allEvents) => allEventsSuccess(allEvents),
      onError: (allEventsError) => allEventsErrorHandler(allEventsError),
    }
  );

  //allEvents Handlers
  function allEventsSuccess(allEvents) {}
  function allEventsErrorHandler(allEventsError) {
    queryClient.invalidateQueries("profile");
  }

  //changeEventStatus query
  const {
    isLoading: ischangeEventStatusLoading,
    data: changeEventStatus,
    isError: ischangeEventStatusError,
    error: changeEventStatuserror,
    isFetching: ischangeEventStatusFetching,
    refetch: refetchchangeEventStatus,
  } = useQuery(
    ["EventStatusChange", changeEventId, changedEventStatus],

    () => changeEventStatusAdmin({ changeEventId, changedEventStatus }),
    {
      enabled: false,
      retry: 2,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      onSuccess: (changeEventStatus) =>
        changeEventStatusSuccess(changeEventStatus),
      onError: (changeEventStatusError) =>
        changeEventStatusErrorHandler(changeEventStatusError),
    }
  );

  //changeEventStatus Handlers
  function changeEventStatusSuccess(changeEventStatus) {
    showNotification({
      title: "Change Event Status Success",
      message: changeEventStatus.message,
      color: "green",
    });
    refetchallEvents();
    setChangeEventId(null);
    setChangedEventStatus(null);
  }
  function changeEventStatusErrorHandler(changeEventStatusError) {
    showNotification({
      title: "Events Error",
      message: changeEventStatusError.response.data.message,
      color: "red",
    });
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
    queryClient.invalidateQueries("profile");
  }

  useEffect(() => {
    if (changeEventId && changedEventStatus) {
      refetchchangeEventStatus();
    }
  }, [changeEventId, changeEventStatus]);

  useEffect(() => {
    refetchallEvents();
  }, [page]);
  const pageDown = () => {
    if (page === 1) {
      return;
    }
    setPage((prev) => prev - 1);
  };
  const pageUp = () => {
    if (page === Math.ceil(allEvents?.count / 8)) {
      return;
    }
    setPage((prev) => prev + 1);
  };

  return (
    <div className="p-4 text-white font-poppins">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-xl mb-4">Events</h3>
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
        {allEvents?.data?.map((item, index) => (
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
                <div className="mt-4">
                  Change Status:
                  <select
                    name=""
                    id=""
                    value={changedEventStatus || item.eventStatus}
                    onChange={(e) => {
                      setChangeEventId(item._id);
                      setChangedEventStatus(e.target.value);
                    }}
                    className="bg-emerald-800 py-2 px-1 ml-4 outline-none rounded-sm font-poppins"
                  >
                    <option value="pending">pending</option>
                    <option value="approved">approved</option>
                    <option value="ongoing">ongoing</option>
                    <option value="completed">completed</option>
                    <option value="rejected">rejected</option>
                    <option value="cancelled">cancelled</option>
                  </select>
                </div>
              </div>
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  );
};

export default Events;
