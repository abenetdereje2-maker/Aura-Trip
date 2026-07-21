const { body, validationResult } = require("express-validator");

const createBookingValidation = [
  body("flightId")
    .trim()
    .notEmpty()
    .withMessage("Flight ID is required"),

  body("seatId")
    .trim()
    .notEmpty()
    .withMessage("Seat ID is required"),
];

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
  createBookingValidation,
  validate,
};