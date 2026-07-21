const prisma = require("../config/prisma");

// ==========================================
// Create Flight
// ==========================================
const createFlight = async (data) => {
  // Check duplicate flight number
  const existingFlight = await prisma.flight.findUnique({
    where: {
      flightNumber: data.flightNumber.toUpperCase(),
    },
  });

  if (existingFlight) {
    throw new Error("Flight number already exists.");
  }

  // Check airline exists
  const airline = await prisma.airline.findUnique({
    where: {
      id: data.airlineId,
    },
  });

  if (!airline) {
    throw new Error("Airline not found.");
  }

  // Check departure airport exists
  const departureAirport = await prisma.airport.findUnique({
    where: {
      id: data.departureAirportId,
    },
  });

  if (!departureAirport) {
    throw new Error("Departure airport not found.");
  }

  // Check arrival airport exists
  const arrivalAirport = await prisma.airport.findUnique({
    where: {
      id: data.arrivalAirportId,
    },
  });

  if (!arrivalAirport) {
    throw new Error("Arrival airport not found.");
  }

  // Prevent same airport
  if (data.departureAirportId === data.arrivalAirportId) {
    throw new Error("Departure and arrival airports cannot be the same.");
  }

  const flight = await prisma.flight.create({
    data: {
      flightNumber: data.flightNumber.toUpperCase(),
      airlineId: data.airlineId,
      departureAirportId: data.departureAirportId,
      arrivalAirportId: data.arrivalAirportId,
      departureTime: new Date(data.departureTime),
      arrivalTime: new Date(data.arrivalTime),
      duration: Number(data.duration),
      price: Number(data.price),
      totalSeats: Number(data.totalSeats),  
      availableSeats: Number(data.availableSeats),
    },
    include: {
      airline: true,
      departureAirport: true,
      arrivalAirport: true,
    },
  });

  return flight;
};

// ==========================================
// Get All Flights
// ==========================================
const getAllFlights = async () => {
  return await prisma.flight.findMany({
    include: {
      airline: true,
      departureAirport: true,
      arrivalAirport: true,
    },
    orderBy: {
      departureTime: "asc",
    },
  });
};

// ==========================================
// Get Flight By ID
// ==========================================
const getFlightById = async (id) => {
  const flight = await prisma.flight.findUnique({
    where: {
      id,
    },
    include: {
      airline: true,
      departureAirport: true,
      arrivalAirport: true,
    },
  });

  if (!flight) {
    throw new Error("Flight not found.");
  }

  return flight;
};

// ==========================================
// Update Flight
// ==========================================
const updateFlight = async (id, data) => {
  await getFlightById(id);

  // Check duplicate flight number
  if (data.flightNumber) {
    const existingFlight = await prisma.flight.findFirst({
      where: {
        flightNumber: data.flightNumber.toUpperCase(),
        NOT: {
          id,
        },
      },
    });

    if (existingFlight) {
      throw new Error("Flight number already exists.");
    }
  }

  // Validate airline
  if (data.airlineId) {
    const airline = await prisma.airline.findUnique({
      where: {
        id: data.airlineId,
      },
    });

    if (!airline) {
      throw new Error("Airline not found.");
    }
  }

  // Validate departure airport
  if (data.departureAirportId) {
    const departureAirport = await prisma.airport.findUnique({
      where: {
        id: data.departureAirportId,
      },
    });

    if (!departureAirport) {
      throw new Error("Departure airport not found.");
    }
  }

  // Validate arrival airport
  if (data.arrivalAirportId) {
    const arrivalAirport = await prisma.airport.findUnique({
      where: {
        id: data.arrivalAirportId,
      },
    });

    if (!arrivalAirport) {
      throw new Error("Arrival airport not found.");
    }
  }

  // Prevent same airport
  if (
    data.departureAirportId &&
    data.arrivalAirportId &&
    data.departureAirportId === data.arrivalAirportId
  ) {
    throw new Error("Departure and arrival airports cannot be the same.");
  }

  return await prisma.flight.update({
    where: {
      id,
    },
    data: {
      flightNumber: data.flightNumber
        ? data.flightNumber.toUpperCase()
        : undefined,
      airlineId: data.airlineId,
      departureAirportId: data.departureAirportId,
      arrivalAirportId: data.arrivalAirportId,
      departureTime: data.departureTime
        ? new Date(data.departureTime)
        : undefined,
      arrivalTime: data.arrivalTime
        ? new Date(data.arrivalTime)
        : undefined,
      duration:
        data.duration !== undefined
          ? Number(data.duration)
          : undefined,
      price:
  data.price !== undefined
    ? Number(data.price)
    : undefined,

totalSeats:
  data.totalSeats !== undefined
    ? Number(data.totalSeats)
    : undefined,

availableSeats:
  data.availableSeats !== undefined
    ? Number(data.availableSeats)
    : undefined,
    },
    include: {
      airline: true,
      departureAirport: true,
      arrivalAirport: true,
    },
  });
};

// ==========================================
// Delete Flight
// ==========================================
const deleteFlight = async (id) => {
  await getFlightById(id);

  return await prisma.flight.delete({
    where: {
      id,
    },
  });
};

// ==========================================
// Search Flights
// ==========================================
const searchFlights = async (query) => {
  const { from, to, date } = query;

  const where = {};

  if (from) {
    where.departureAirport = {
      code: from.toUpperCase(),
    };
  }

  if (to) {
    where.arrivalAirport = {
      code: to.toUpperCase(),
    };
  }

  if (date) {
    const start = new Date(date);
    const end = new Date(date);

    end.setDate(end.getDate() + 1);

    where.departureTime = {
      gte: start,
      lt: end,
    };
  }

  return await prisma.flight.findMany({
    where,
    include: {
      airline: true,
      departureAirport: true,
      arrivalAirport: true,
    },
    orderBy: {
      departureTime: "asc",
    },
  });
};

module.exports = {
  createFlight,
  getAllFlights,
  getFlightById,
  updateFlight,
  deleteFlight,
  searchFlights,
};