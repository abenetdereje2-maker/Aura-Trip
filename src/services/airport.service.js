const prisma = require("../config/prisma");

/**
 * Create Airport
 */
const createAirport = async (data) => {
  const existingAirport = await prisma.airport.findUnique({
    where: {
      code: data.code.toUpperCase(),
    },
  });

  if (existingAirport) {
    throw new Error("Airport code already exists.");
  }

  return await prisma.airport.create({
    data: {
      code: data.code.toUpperCase(),
      name: data.name,
      city: data.city,
      country: data.country,
    },
  });
};

/**
 * Get All Airports
 */
const getAllAirports = async () => {
  return await prisma.airport.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

/**
 * Get Airport By ID
 */
const getAirportById = async (id) => {
  const airport = await prisma.airport.findUnique({
    where: {
      id,
    },
  });

  if (!airport) {
    throw new Error("Airport not found.");
  }

  return airport;
};

/**
 * Update Airport
 */
const updateAirport = async (id, data) => {
  await getAirportById(id);

  return await prisma.airport.update({
    where: {
      id,
    },
    data: {
      code: data.code ? data.code.toUpperCase() : undefined,
      name: data.name,
      city: data.city,
      country: data.country,
    },
  });
};

/**
 * Delete Airport
 */
const deleteAirport = async (id) => {
  await getAirportById(id);

  return await prisma.airport.delete({
    where: {
      id,
    },
  });
};

module.exports = {
  createAirport,
  getAllAirports,
  getAirportById,
  updateAirport,
  deleteAirport,
};