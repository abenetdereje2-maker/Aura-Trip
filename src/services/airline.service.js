const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

/**
 * Create Airline
 */
const createAirline = async (data) => {
  const code = data.code.toUpperCase();

  // Check if airline code already exists
  const existingAirline = await prisma.airline.findUnique({
    where: {
      code,
    },
  });

  if (existingAirline) {
    throw new Error("Airline code already exists.");
  }

  // Create airline
  return await prisma.airline.create({
    data: {
      name: data.name,
      code,
      logo: data.logo || null,
    },
  });
};

/**
 * Get All Airlines
 */
const getAllAirlines = async () => {
  return await prisma.airline.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

/**
 * Get Airline By ID
 */
const getAirlineById = async (id) => {
  const airline = await prisma.airline.findUnique({
    where: {
      id,
    },
  });

  if (!airline) {
    throw new Error("Airline not found.");
  }

  return airline;
};

/**
 * Update Airline
 */
const updateAirline = async (id, data) => {
  // Check if airline exists
  await getAirlineById(id);

  // If code is being updated, check uniqueness
  if (data.code) {
    const code = data.code.toUpperCase();

    const existingAirline = await prisma.airline.findUnique({
      where: {
        code,
      },
    });

    if (existingAirline && existingAirline.id !== id) {
      throw new Error("Airline code already exists.");
    }

    data.code = code;
  }

  return await prisma.airline.update({
    where: {
      id,
    },
    data: {
      name: data.name,
      code: data.code,
      logo: data.logo,
    },
  });
};

/**
 * Delete Airline
 */
const deleteAirline = async (id) => {
  // Check if airline exists
  await getAirlineById(id);

  return await prisma.airline.delete({
    where: {
      id,
    },
  });
};

module.exports = {
  createAirline,
  getAllAirlines,
  getAirlineById,
  updateAirline,
  deleteAirline,
};