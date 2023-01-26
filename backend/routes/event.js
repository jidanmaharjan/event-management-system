const express = require("express");
const router = express.Router();

const {
  createEvent,
  getEvents,
  getBookedDates,
  getUsersEvents,
  updateBooking,
  cancelBooking,
  checkConflict,
  getUserEventDates,
  getUsersEventSummary,
  getEventUserSingle,
  khaltiPayment,
  verifyKhaltiPayment,
} = require("../controllers/eventController");
const {
  isAuthenticated,
  authorizedRoles,
} = require("../middlewares/authMiddleware");

router.route("/new").post(isAuthenticated, createEvent);
router.route("/bookeddates").get(getBookedDates);
router.route("/userbookings").get(isAuthenticated, getUsersEvents);
router.route("/userbookingsummary").get(isAuthenticated, getUsersEventSummary);
router.route("/usereventdates").get(isAuthenticated, getUserEventDates);
router.route("/userevent/:id").get(isAuthenticated, getEventUserSingle);
router.route("/cancelbooking/:id").put(isAuthenticated, cancelBooking);
router.route("/checkconflict").post(checkConflict);
router.route("/all").get(isAuthenticated, authorizedRoles("admin"), getEvents);
router
  .route("/changestatus/:id")
  .put(isAuthenticated, authorizedRoles("admin"), updateBooking);

//payment
router
  .route("/payment/khalti/verify")
  .post(isAuthenticated, verifyKhaltiPayment);
router.route("/payment/khalti/:eventId").post(isAuthenticated, khaltiPayment);
module.exports = router;
