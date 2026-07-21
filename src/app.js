const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

// Routes
const seatRoutes = require("./routes/seat.routes");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const airlineRoutes = require("./routes/airline.routes");
const airportRoutes = require("./routes/airport.routes");
const flightRoutes = require("./routes/flight.routes");
const bookingRoutes = require("./routes/booking.routes");
// Middlewares
const notFound = require("./middleware/notFound.middleware");
const errorHandler = require("./middleware/error.middleware");

const app = express();

// ======================
// Global Middlewares
// ======================

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug Middleware (Temporary)
app.use((req, res, next) => {
  console.log("--------------------------------");
  console.log("METHOD:", req.method);
  console.log("URL:", req.originalUrl);
  console.log("BODY:", req.body);
  console.log("--------------------------------");
  next();
});

// ======================
// Health Check
// ======================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 Welcome to AURA-TRIP API",
    version: "1.0.0",
  });
});

// Test Route
app.post("/test", (req, res) => {
  res.json({
    success: true,
    message: "POST works",
    body: req.body,
  });
});

// ======================
// API Routes
// ======================

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/airlines", airlineRoutes);
app.use("/api/airports", airportRoutes);
app.use("/api/flights", flightRoutes);
app.use("/api", seatRoutes);
app.use("/api/bookings", bookingRoutes);
// ======================
// 404 Middleware
// ======================

app.use(notFound);

// ======================
// Global Error Handler
// ======================

app.use(errorHandler);

module.exports = app;