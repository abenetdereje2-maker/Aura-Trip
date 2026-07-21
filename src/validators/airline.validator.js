const { body, validationResult } = require("express-validator");

const createAirlineValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Airline name is required"),

  body("code")
    .trim()
    .isLength({ min: 2, max: 3 })
    .withMessage("Airline code must be 2 or 3 characters"),
];

const updateAirlineValidation = [
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Airline name cannot be empty"),

  body("code")
    .optional()
    .trim()
    .isLength({ min: 2, max: 3 })
    .withMessage("Airline code must be 2 or 3 characters"),
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
  createAirlineValidation,
  updateAirlineValidation,
  validate,
};