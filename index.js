require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");

const placesRoutes = require("./routes/places-routes");
const userRoutes = require("./routes/user-routes");
const favouriteRoutes = require("./routes/favourite-routes");
const bookingRoutes = require("./routes/booking-routes");

const HttpError = require("./models/http-error");
const cookieParser = require("cookie-parser");
const bearerToken = require("express-bearer-token");

const app = express();

app.use(bearerToken());
app.use(cookieParser());
app.use(bodyParser.json());

//set up for Heroku
app.set("trust proxy", 1);

app.use(
  session({
    cookie: {
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // must be 'none' to enable cross-site delivery
      secure: process.env.NODE_ENV === "production", // must be true if sameSite='none'
    },
  })
);

//cors-policy error handling
app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://aesthetic-moxie-c4b0c5.netlify.app"
  );

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
app.use("/api/favourite", favouriteRoutes);

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

//connect to mongoose

const port = process.env.PORT || 5001;

mongoose
  .connect(`${process.env.MONGO_URL}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    app.listen(port);
  })
  .catch((err) => {
    console.log(err);
  });
