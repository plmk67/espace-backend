const express = require("express");
const { check } = require("express-validator");
const userControllers = require("../controllers/user-controllers");
const router = express.Router();

router.get("/:id", userControllers.getUserTrips);
router.post("/login", userControllers.login);
router.post("/logout", userControllers.logout);
router.post("/signup", userControllers.signUp);

module.exports = router;
