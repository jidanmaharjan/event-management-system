import React, { useEffect, useRef, useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";
import moment from "moment/moment";
import { useQuery, useQueryClient } from "react-query";
import { showNotification } from "@mantine/notifications";

import { getAllCategory } from "../../../apis/categoryApis";
import { checkConflict, createNewEvent } from "../../../apis/eventApis";

//icon imports
import { GiBigDiamondRing } from "react-icons/gi";
import { FaBaby, FaBirthdayCake } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const Calendar = () => {
  const [value, setValue] = useState({
    startDate: null,
    endDate: null,
  });
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const eventTitleRef = useRef();
  const eventDescriptionRef = useRef();

  const handleValueChange = (newValue) => {
    console.log("newValue:", newValue);
    console.log(moment(newValue.startDate).format("YYYY MM DD"));
    console.log(moment(newValue.endDate).format("YYYY MM DD"));
    setValue(newValue);
  };

  //createEvent query
  const {
    isLoading: isCreateEventLoading,
    data: createEvent,
    isError: isCreateEventError,
    error: createEventError,
    isFetching: isCreateEventFetching,
    refetch: refetchCreateEvent,
  } = useQuery(
    "createEvent",

    () =>
      createNewEvent({
        eventTitle: eventTitleRef.current.value,
        eventDescription: eventDescriptionRef.current.value,
        startDate: value.startDate,
        endDate: value.endDate,
        categoryId: selectedCategory,
      }),
    {
      enabled: false,
      retry: 0,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      onSuccess: (createEvent) => createEventSuccess(createEvent),
      onError: (createEventError) => createEventErrorHandler(createEventError),
    }
  );

  //createEvent Handlers
  function createEventSuccess(createEvent) {
    showNotification({
      title: "Event Created",
      message: "Event successfully created",
      color: "green",
    });
    navigate("/dashboard/payments");
  }
  function createEventErrorHandler(createEventError) {
    showNotification({
      title: "createEvent Error",
      message: createEventError.response.data.message,
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

  //check conflicts query
  const {
    isLoading: isCheckConflictLoading,
    data: checkconflict,
    isError: isCheckConflictError,
    error: checkConflictError,
    isFetching: isCheckConflictFetching,
    refetch: refetchCheckConflict,
  } = useQuery(
    "checkconflict",

    () => checkConflict(value),
    {
      enabled: false,
      retry: 2,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  const bookEventHandler = (e) => {
    e.preventDefault();
    if (!value.startDate || !value.endDate) {
      showNotification({
        title: "Date Error",
        message: "Pick your event date",
        color: "yellow",
      });
      return;
    }
    if (isCheckConflictError) {
      showNotification({
        title: "Date Error",
        message: "There is a conflicting event",
        color: "yellow",
      });
      return;
    }
    if (!selectedCategory) {
      showNotification({
        title: "Category Error",
        message: "Select a category",
        color: "yellow",
      });
      return;
    }
    if (!eventTitleRef.current.value && !eventDescriptionRef.current.value) {
      showNotification({
        title: "Event Details Error",
        message: "Enter event title and description",
        color: "yellow",
      });
      return;
    }
    if (eventTitleRef.current.value.length !== 10) {
      showNotification({
        title: "Contact Error",
        message: "Enter correct Contact Info",
        color: "yellow",
      });
      return;
    }
    refetchCreateEvent();
  };

  useEffect(() => {
    if (value.startDate !== null && value.endDate !== null) {
      refetchCheckConflict();
    }
  }, [value]);

  return (
    <div className="p-4 text-white font-poppins">
      <h3 className="font-semibold text-xl">Book an event</h3>
      <h3 className="font-semibold text-lg mt-4 mb-2">Pick your Date</h3>
      <Datepicker
        value={value}
        inputClassName="outline-none"
        readOnly={true}
        disabled={isCheckConflictFetching}
        separator={"|"}
        placeholder={"Select Date"}
        onChange={handleValueChange}
        primaryColor={"emerald"}
      />
      <div className="p-4">
        {isCheckConflictFetching && (
          <div className="flex items-center">
            <AiOutlineLoading3Quarters className="animate-spin text-emerald-300 mr-2" />
            <p>Checking Conflicting Events</p>
          </div>
        )}

        {!isCheckConflictFetching &&
          (isCheckConflictError ? (
            <h3 className="text-red-400">
              {checkConflictError?.response.data.message}
            </h3>
          ) : (
            <h3 className="text-green-400">
              {checkconflict && checkconflict.message}
            </h3>
          ))}
      </div>
      <h3 className="font-semibold mt-4 mb-2">Category</h3>
      <div className="flex gap-4 flex-wrap mb-4">
        {category &&
          category.map((item, index) => {
            return (
              <button
                disabled={selectedCategory === item.id}
                key={item._id}
                onClick={() => setSelectedCategory(item._id)}
                className={`p-2 bg-emerald-700 hover:bg-emerald-600 ${
                  selectedCategory === item._id &&
                  "bg-emerald-600 border border-white/80"
                }  rounded-md`}
              >
                {/* <FaBirthdayCake className="text-2xl mx-auto" /> */}
                <p className="text-sm">{item.name}</p>
              </button>
            );
          })}
      </div>
      <div className="bg-emerald-800 p-4 rounded-md mt-4">
        <h3 className="font-semibold text-lg  mb-2">Describe your event</h3>
        <form className="grid gap-2" onSubmit={bookEventHandler}>
          <label htmlFor="eventTitle" className="font-semibold">
            Contact Number
          </label>
          <input
            ref={eventTitleRef}
            className="p-3 bg-emerald-700 rounded-md outline-none"
            type="number"
            id="eventTitle"
            placeholder="9841114545"
            required
          />
          <label htmlFor="eventDescription" className="font-semibold">
            Description
          </label>
          <textarea
            ref={eventDescriptionRef}
            className="p-3 bg-emerald-700 rounded-md outline-none"
            type="text"
            id="eventDescription"
            placeholder="I need an wedding event with capacity of 100 at GreenStreet Beverly Hills with beautiful view. Bride's Name is Chloe and Groom's name is Xavier."
            required
          />

          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-500 p-3 font-semibold rounded-md mt-2"
          >
            Initiate Booking
          </button>
        </form>
      </div>
    </div>
  );
};

export default Calendar;
