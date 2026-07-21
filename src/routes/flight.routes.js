const express = require("express");
const router = express.Router();

const flightController = require("../controllers/flight.controller");

const authenticate = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

const {
  createFlightValidation,
  updateFlightValidation,
  validate,
} = require("../validators/flight.validator");

// =====================================
// Public Routes
// =====================================

// Search Flights
router.get("/search", flightController.searchFlights);

// Get All Flights
router.get("/", flightController.getAllFlights);

// Get Flight By ID
router.get("/:id", flightController.getFlightById);

// =====================================
// Admin Routes
// =====================================

// Create Flight
router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  createFlightValidation,
  validate,
  flightController.createFlight
);

// Update Flight
router.put(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  updateFlightValidation,
  validate,
  flightController.updateFlight
);

// Delete Flight
router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  flightController.deleteFlight
);

module.exports = router;