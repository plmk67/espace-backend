require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const placesRoutes = require("./routes/places-routes");
const userRoutes = require("./routes/user-routes");

const bookingRoutes = require("./routes/booking-routes");

const HttpError = require("./models/http-error");
const cookieParser = require("cookie-parser");
const bearerToken = require("express-bearer-token");

const app = express();

app.use(bearerToken());
app.use(cookieParser());
app.use(bodyParser.json());

//cors-policy error handling
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, PUT"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

//routes
app.use("/api/places", placesRoutes);
app.use("/api/users", userRoutes);
app.use("/api/bookings", bookingRoutes);

//error routes
app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

//connect to moongoose
mongoose
  .connect(`${process.env.MONGO_URL}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    app.listen(4000);
  })
  .catch((err) => {
    console.log(err);
  });
