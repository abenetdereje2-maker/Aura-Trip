const prisma = require("../config/prisma");

/**
 * ==========================================
 * Get all seats for a flight
 * ==========================================
 */
const getFlightSeats = async (flightId) => {
  // Check flight exists
  const flight = await prisma.flight.findUnique({
    where: { id: flightId },
  });

  if (!flight) {
    throw new Error("Flight not found.");
  }

  return await prisma.seat.findMany({
    where: {
      flightId,
    },
    orderBy: [
      {
        seatNumber: "asc",
      },
    ],
  });
};

/**
 * ==========================================
 * Get only available seats
 * ==========================================
 */
const getAvailableSeats = async (flightId) => {
  const flight = await prisma.flight.findUnique({
    where: { id: flightId },
  });

  if (!flight) {
    throw new Error("Flight not found.");
  }

  return await prisma.seat.findMany({
    where: {
      flightId,
      status: "AVAILABLE",
    },
    orderBy: {
      seatNumber: "asc",
    },
  });
};

/**
 * ==========================================
 * Get seat by ID
 * ==========================================
 */
const getSeatById = async (seatId) => {
  const seat = await prisma.seat.findUnique({
    where: {
      id: seatId,
    },
    include: {
      flight: {
        include: {
          airline: true,
          departureAirport: true,
          arrivalAirport: true,
        },
      },
    },
  });

  if (!seat) {
    throw new Error("Seat not found.");
  }

  return seat;
};

module.exports = {
  getFlightSeats,
  getAvailableSeats,
  getSeatById,
};