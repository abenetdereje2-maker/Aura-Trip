const { body, validationResult } = require("express-validator");

// ===============================
// Create Flight Validation
// ===============================

const createFlightValidation = [
  body("flightNumber")
    .trim()
    .notEmpty()
    .withMessage("Flight number is required"),

  body("airlineId")
    .trim()
    .notEmpty()
    .withMessage("Airline ID is required"),

  body("departureAirportId")
    .trim()
    .notEmpty()
    .withMessage("Departure airport is required"),

  body("arrivalAirportId")
    .trim()
    .notEmpty()
    .withMessage("Arrival airport is required")
    .custom((value, { req }) => {
      if (value === req.body.departureAirportId) {
        throw new Error(
          "Departure and arrival airports cannot be the same"
        );
      }
      return true;
    }),

  body("departureTime")
    .isISO8601()
    .withMessage("Departure time must be a valid date"),

  body("arrivalTime")
    .isISO8601()
    .withMessage("Arrival time must be a valid date"),

  body("duration")
    .isInt({ min: 1 })
    .withMessage("Duration must be greater than zero"),

  body("price")
    .isFloat({ gt: 0 })
    .withMessage("Price must be greater than zero"),

  body("availableSeats")
    .isInt({ min: 1 })
    .withMessage("Available seats must be at least 1"),
];

// ===============================
// Update Flight Validation
// ===============================

const updateFlightValidation = [
  body("flightNumber").optional(),

  body("airlineId").optional(),

  body("departureAirportId").optional(),

  body("arrivalAirportId")
    .optional()
    .custom((value, { req }) => {
      if (
        value &&
        req.body.departureAirportId &&
        value === req.body.departureAirportId
      ) {
        throw new Error(
          "Departure and arrival airports cannot be the same"
        );
      }
      return true;
    }),

  body("departureTime")
    .optional()
    .isISO8601(),

  body("arrivalTime")
    .optional()
    .isISO8601(),

  body("duration")
    .optional()
    .isInt({ min: 1 }),

  body("price")
    .optional()
    .isFloat({ gt: 0 }),

  body("availableSeats")
    .optional()
    .isInt({ min: 1 }),
];

// ===============================
// Validation Result
// ===============================

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  next();
};

module.exports = {
  createFlightValidation,
  updateFlightValidation,
  validate,
};