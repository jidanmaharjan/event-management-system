import axios from "axios";

export const checkConflict = async ({ startDate, endDate }) => {
  const options = {
    method: "POST",
    url: "/v1/event/checkconflict",
    params: {},
    headers: {},
    data: {
      startDate,
      endDate,
    },
  };
  const response = await axios.request(options);
  return response.data;
};

export const getAllEvents = async ({ page }) => {
  const options = {
    method: "GET",
    url: "/v1/event/all",
    params: { p: page },
    headers: {},
    data: {},
  };
  const response = await axios.request(options);
  return response.data;
};

export const getEvents = async ({ page }) => {
  const options = {
    method: "GET",
    url: "/v1/event/userbookings",
    params: { p: page },
    headers: {},
    data: {},
  };
  const response = await axios.request(options);
  return response.data;
};

export const getUserEventSingle = async ({ eventId }) => {
  const options = {
    method: "GET",
    url: `/v1/event/userevent/${eventId}`,
    params: {},
    headers: {},
    data: {},
  };
  const response = await axios.request(options);
  return response.data;
};

export const getEventSummary = async () => {
  const options = {
    method: "GET",
    url: "/v1/event/userbookingsummary",
    params: {},
    headers: {},
    data: {},
  };
  const response = await axios.request(options);
  return response.data;
};

export const getUserEventDates = async () => {
  const options = {
    method: "GET",
    url: "/v1/event/usereventdates",
    params: {},
    headers: {},
    data: {},
  };
  const response = await axios.request(options);
  return response.data;
};

export const createNewEvent = async ({
  eventTitle,
  eventDescription,
  startDate,
  endDate,
  categoryId,
}) => {
  const options = {
    method: "POST",
    url: "/v1/event/new",
    params: {},
    headers: {},
    data: {
      title: eventTitle,
      description: eventDescription,
      startDate,
      endDate,
      category: categoryId,
    },
  };
  const response = await axios.request(options);
  return response.data;
};

export const cancelBookingUser = async ({ cancelEventId }) => {
  const options = {
    method: "PUT",
    url: `/v1/event/cancelbooking/${cancelEventId}`,
    params: {},
    headers: {},
    data: {},
  };
  const response = await axios.request(options);
  return response.data;
};

export const initiateKhaltiPayment = async ({ eventId, paymentDetails }) => {
  const options = {
    method: "POST",
    url: `/v1/event/payment/khalti/${eventId}`,
    params: {},
    headers: {},
    data: paymentDetails,
  };
  const response = await axios.request(options);
  return response.data;
};

export const verifyKhaltiPayment = async (khaltiPaymentDetails) => {
  const options = {
    method: "POST",
    url: `/v1/event/payment/khalti/verify`,
    params: {},
    headers: {},
    data: khaltiPaymentDetails,
  };
  const response = await axios.request(options);
  return response.data;
};

export const changeEventStatusAdmin = async ({
  changeEventId,
  changedEventStatus,
}) => {
  const options = {
    method: "PUT",
    url: `/v1/event/changestatus/${changeEventId}`,
    params: {},
    headers: {},
    data: {
      eventStatus: changedEventStatus,
    },
  };
  const response = await axios.request(options);
  return response.data;
};
