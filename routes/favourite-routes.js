const express = require("express");
const { check } = require("express-validator");
const favouriteControllers = require("../controllers/favourite-controllers");
const router = express.Router();

router.post("/create", favouriteControllers.createFavourite);

router.get("/:user_id/:place_id", favouriteControllers.getFavourites);
router.delete("/:user_id/:place_id", favouriteControllers.deleteFavourite);

module.exports = router;
