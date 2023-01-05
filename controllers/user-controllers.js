const uuid = require("uuid/v4");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const ObjectId = require("mongodb").ObjectID;
const bcrypt = require("bcrypt");
const HttpError = require("../models/http-error");
const User = require("../models/user");
const Place = require("../models/place");
const jwt = require("jsonwebtoken");

const getUserTrips = async (req, res, next) => {
  const id = req.params.id;
  try {
    places = await Place.find({
      user: ObjectId(id),
    });
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

const login = async (req, res, next) => {
  const { email, password } = req.body;
  let user;

  try {
    user = await User.findOne({
      email: email,
    });
  } catch (err) {
    const error = new HttpError("Unable to login, please try again later", 500);
    return next(error);
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!user || !validPassword) {
    const error = new HttpError("Please verify login information", 404);
    return next(error);
  }

  const id = user._id;

  const accessToken = generateAccessToken({ id });
  const refreshToken = generateRefreshToken({ id });

  res.cookie("token", accessToken, {
    httpOnly: false,
    sameSite: "none",
    secure: true,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: false,
    sameSite: "none",
    secure: true,
  });

  res.status(201).json({
    email: user.email,
    id: user._id,
    name: user.name,
  });
};

const signUp = async (req, res, next) => {
  const { email, password, name } = req.body;

  //check if email has existing users

  var id = mongoose.Types.ObjectId();
  const salt = await bcrypt.genSalt(10);

  let encryptedPassword = await bcrypt.hash(password, salt);
  const newUser = new User({
    email,
    password: encryptedPassword,
    name,
    id,
  });

  User.exists({ email: email }, (error, existingUser) => {
    if (existingUser === null || existingUser === false) {
      newUser.save();

      const accessToken = generateAccessToken({ id });
      const refreshToken = generateRefreshToken({ id });

      res.cookie("token", accessToken, {
        httpOnly: false,
        secure: true,
        sameSite: "none",
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: false,
        secure: true,
        sameSite: "none",
      });

      res.status(201).json({
        email: newUser.email,
        name: newUser.name,
        id: newUser.id,
      });
    } else {
      res.status(404).json({ message: "User already exists" });
    }
  });
};

const logout = async (req, res, next) => {
  //expire an Access Token

  res.cookie("token", "none", {
    expires: new Date(Date.now() + 5 * 1000),
  });

  res.cookie("refreshToken", "none", {
    expires: new Date(Date.now() + 5 * 1000),
  });

  res
    .status(200)
    .json({ success: true, message: "User logged out successfully" });
};

const authenticateHeaderToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  console.log(authHeader);
  console.log(token);

  token
    ? jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
          res.status(403).json({ error: err });
        } else {
          next();
        }
      })
    : res.status(401).json({ error: "no token" });
};

function generateAccessToken(id) {
  return jwt.sign(id, process.env.ACCESS_TOKEN_SECRET);
}

function generateRefreshToken(id) {
  return jwt.sign(id, process.env.REFRESH_TOKEN_SECRET);
}

exports.getUserTrips = getUserTrips;
exports.login = login;
exports.logout = logout;
exports.signUp = signUp;
exports.authenticateHeaderToken = authenticateHeaderToken;
