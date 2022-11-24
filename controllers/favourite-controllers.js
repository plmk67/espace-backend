const uuid = require("uuid/v4");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const Favourite = require("../models/favourite");
const User = require("../models/user");
const HttpError = require("../models/http-error");

const { authenticateHeaderToken } = require("../controllers/user-controllers");

const createFavourite = async (req, res, next) => {
  const { place, user, title, host, imageUrl } = req.body;

  const newFavourite = new Favourite({
    place,
    user,
    title,
    host,
    imageUrl,
  });

  try {
    newFavourite.save();
  } catch (err) {
    const error = new HttpError(
      "Unable to add favourite, please try again later",
      500
    );
    return next(error);
  }

  res.json({
    message: "favourite!",
  });
};

const getFavourites = async (req, res, next) => {
  let favourite;

  try {
    favourite = await Favourite.find({
      user: req.params.user_id,
      place: req.params.place_id,
    });
  } catch (err) {
    const error = new HttpError(
      "Unable to find favourite, please try again later",
      500
    );
    return next(error);
  }

  res.status(200).json({
    favourite: favourite,
  });
};

const deleteFavourite = async (req, res, next) => {
  let favourite;

  try {
    favourite = await Favourite.deleteMany({
      user: req.params.user_id,
      place: req.params.place_id,
    });
  } catch (err) {
    const error = new HttpError(
      "Unable to find favourite, please try again later",
      500
    );
    return next(error);
  }

  res.status(200).json({
    message: "deleted!",
  });
};

exports.createFavourite = createFavourite;
exports.getFavourites = getFavourites;
exports.deleteFavourite = deleteFavourite;
