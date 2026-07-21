const express = require("express");
const router = express.Router();

const seatController = require("../controllers/seat.controller");

// Get all seats of a flight
router.get(
  "/flights/:flightId/seats",
  seatController.getFlightSeats
);

// Get available seats only
router.get(
  "/flights/:flightId/seats/available",
  seatController.getAvailableSeats
);

// Get seat by ID
router.get(
  "/seats/:seatId",
  seatController.getSeatById
);

module.exports = router;