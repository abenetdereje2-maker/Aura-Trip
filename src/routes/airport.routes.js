const express = require("express");
const router = express.Router();

const airportController = require("../controllers/airport.controller");

const authenticate = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

const {
  createAirportValidation,
  updateAirportValidation,
  validate,
} = require("../validators/airport.validator");

// =======================
// Public Routes
// =======================

router.get("/", airportController.getAllAirports);

router.get("/:id", airportController.getAirportById);

// =======================
// Admin Routes
// =======================

router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  createAirportValidation,
  validate,
  airportController.createAirport
);

router.put(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  updateAirportValidation,
  validate,
  airportController.updateAirport
);

router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  airportController.deleteAirport
);

module.exports = router;