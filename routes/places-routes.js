const express = require("express");
const { check } = require("express-validator");
const placesControllers = require("../controllers/places-controllers");
const router = express.Router();

router.post(
  "/",
  [check("title").not().isEmpty()],
  placesControllers.createPlace
);

router.get("/", placesControllers.getPlaces);
router.get("/googleMapsReq", placesControllers.googleAPIrequest);
router.get("/:id", placesControllers.getPlaceById);

module.exports = router;
