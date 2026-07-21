const { body, validationResult } = require("express-validator");

// =======================
// Create Airport Validation
// =======================

const createAirportValidation = [
  body("code")
    .trim()
    .notEmpty()
    .withMessage("Airport code is required")
    .isLength({ min: 3, max: 3 })
    .withMessage("Airport code must be exactly 3 characters"),

  body("name")
    .trim()
    .notEmpty()
    .withMessage("Airport name is required"),

  body("city")
    .trim()
    .notEmpty()
    .withMessage("City is required"),

  body("country")
    .trim()
    .notEmpty()
    .withMessage("Country is required"),
];

// =======================
// Update Airport Validation
// =======================

const updateAirportValidation = [
  body("code")
    .optional()
    .isLength({ min: 3, max: 3 })
    .withMessage("Airport code must be exactly 3 characters"),

  body("name")
    .optional()
    .notEmpty()
    .withMessage("Airport name cannot be empty"),

  body("city")
    .optional()
    .notEmpty()
    .withMessage("City cannot be empty"),

  body("country")
    .optional()
    .notEmpty()
    .withMessage("Country cannot be empty"),
];

// =======================
// Validation Result
// =======================

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
  createAirportValidation,
  updateAirportValidation,
  validate,
};