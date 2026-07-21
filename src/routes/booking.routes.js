const express = require("express");
const router = express.Router();

const bookingController = require("../controllers/booking.controller");

const authenticate = require("../middleware/auth.middleware");
const authorizeAdmin = require("../middleware/admin.middleware");
const {
  createBookingValidation,
  validate,
} = require("../validators/booking.validator");

// Create booking
router.post(
  "/",
  authenticate,
  createBookingValidation,
  validate,
  bookingController.createBooking
);
router.get(
  "/my-bookings",
  authenticate,
  bookingController.getMyBookings
);
// Get booking by ID
router.get(
  "/:id",
  authenticate,
  bookingController.getBookingById
);
// Cancel booking
router.patch(
  "/:id/cancel",
  authenticate,
  bookingController.cancelBooking
);
router.get(
  "/",
  authenticate,
  authorizeAdmin,
  bookingController.getAllBookings
);
router.delete(
  "/:id",
  authenticate,
  authorizeAdmin,
  bookingController.deleteBooking
);

module.exports = router;