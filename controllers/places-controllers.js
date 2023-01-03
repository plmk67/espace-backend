const uuid = require("uuid/v4");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const Place = require("../models/place");

const createPlace = async (req, res, next) => {
  // validate the req that is being passed through
  const errors = validationResult(req);

  // check if there are errors
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const {
    imageUrl,
    imageAlt,
    beds,
    baths,
    title,
    formattedPrice,
    reviewCount,
    rating,
  } = req.body;

  const newPlace = new Place({
    imageUrl,
    imageAlt,
    beds,
    baths,
    title,
    formattedPrice,
    reviewCount,
    rating,
  });

  try {
    await newPlace.save();
  } catch (err) {
    const error = new HttpError(
      "Create new space failed, please try again later.",
      500
    );
    return next(error);
  }

  res.status(201).json({ place: newPlace.toObject({ getters: true }) });
};

const getPlaces = async (req, res, next) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  let places;
  let results = {};

  try {
    places = await Place.find();

    // if (endIndex < places.length) {
    //   results.next = {
    //     page: page + 1,
    //     limit: limit,
    //   };
    // }

    // if (startIndex > 0) {
    //   results.prev = {
    //     page: page - 1,
    //     limit: limit,
    //   };
    // }
    // results.results = places.slice(startIndex, endIndex);
  } catch (err) {
    const error = new HttpError(
      "Could not find place for the provided id.",
      404
    );
    return next(error);
  }

  res.json({
    places: places.map((place) => place.toObject({ getters: true })),
  });
};

const getPlaceById = async (req, res, next) => {
  try {
    place = await Place.findById(req.params.id);
  } catch (err) {
    const error = new HttpError(
      "Could not find place for the provided id.",
      404
    );
    return next(error);
  }

  res.json({
    place: place,
  });
};

const googleAPIrequest = async (req, res, next) => {
  res.json({ API_KEY: process.env.GOOGLE_API_SECRET });
};

function paginatedResults(model) {
  return (req, res, next) => {};
}

exports.createPlace = createPlace;
exports.getPlaces = getPlaces;
exports.getPlaceById = getPlaceById;
exports.googleAPIrequest = googleAPIrequest;
