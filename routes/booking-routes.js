const express = require("express");
const { check } = require("express-validator");
const bookingControllers = require("../controllers/booking-controllers");
const userControllers = require("../controllers/user-controllers");
const router = express.Router();

router.post("/create", bookingControllers.createBooking);
router.get(
  "/trips/:user_id",
  userControllers.authenticateHeaderToken,
  bookingControllers.getUserBookings
);
router.get("/trips/detail/:id", bookingControllers.getUserBookingById);
router.patch("/trips/:id", bookingControllers.updateUserBookingById);

module.exports = router;
