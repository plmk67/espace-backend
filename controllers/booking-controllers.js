const uuid = require("uuid/v4");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const Booking = require("../models/booking");
const User = require("../models/user");
const HttpError = require("../models/http-error");

const { authenticateHeaderToken } = require("../controllers/user-controllers");

const createBooking = async (req, res, next) => {
  const {
    place,
    created_date,
    created_time,
    start_date,
    end_date,
    user,
    email,
    totalCost,
    status,
    title,
    host,
  } = req.body;

  const newBooking = new Booking({
    place,
    end_date,
    created_date,
    created_time,
    start_date,
    end_date,
    user,
    email,
    totalCost,
    status,
    title,
    host,
    imageUrl,
  });

  try {
    await newBooking.save();
  } catch (err) {
    const error = new HttpError(
      "Create new booking failed, please try again later.",
      500
    );
    console.log(err);
    return next(error);
  }

  res.status(201).json({
    bookings: newBooking.toObject({ getters: true }),
  });
};

const getUserBookings = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  console.log(authHeader);

  let bookings;
  try {
    bookings = await Booking.find();
  } catch (err) {
    const error = new HttpError(
      "Create new booking failed, please try again later.",
      500
    );
    console.log(err);
    return next(error);
  }

  res.status(200).json({ bookings: bookings });
};

const getUserBookingById = async (req, res, next) => {
  let id = req.params.id;

  console.log(typeof id);
  try {
    booking = await Booking.find({
      user: id,
    });
  } catch (err) {
    const error = new HttpError(
      "Cannot find user booking failed, please try again later.",
      500
    );
    return next(error);
  }

  console.log(booking);

  res.status(200).json({ booking: booking });
};

const updateUserBookingById = async (req, res, next) => {
  let place_id = req.params.id;

  console.log(place_id);
  try {
    booking = await Booking.findOneAndUpdate(
      {
        _id: place_id,
      },
      { status: "cancelled" }
    );
  } catch (err) {
    const error = new HttpError(
      "Cannot update booking, please try again later.",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "booking cancelled" });
};

exports.createBooking = createBooking;
exports.getUserBookings = getUserBookings;
exports.getUserBookingById = getUserBookingById;
exports.updateUserBookingById = updateUserBookingById;
