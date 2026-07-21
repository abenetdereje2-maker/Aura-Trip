console.log("✅ auth.routes.js loaded");

const express = require("express");
const router = express.Router();

const airlineController = require("../controllers/airline.controller");

const authenticate = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

const {
  createAirlineValidation,
  updateAirlineValidation,
  validate,
} = require("../validators/airline.validator");

// Public Routes
router.get("/", airlineController.getAllAirlines);
router.get("/:id", airlineController.getAirlineById);

// Admin Routes
router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  createAirlineValidation,
  validate,
  airlineController.createAirline
);

router.put(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  updateAirlineValidation,
  validate,
  airlineController.updateAirline
);

router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  airlineController.deleteAirline
);
console.log("Registered auth routes:");
console.log("POST /register");
console.log("POST /login");
module.exports = router;