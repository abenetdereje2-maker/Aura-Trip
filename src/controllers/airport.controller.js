const airportService = require("../services/airport.service");

/**
 * Create Airport
 */
const createAirport = async (req, res) => {
  try {
    const airport = await airportService.createAirport(req.body);

    return res.status(201).json({
      success: true,
      message: "Airport created successfully.",
      data: airport,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get All Airports
 */
const getAllAirports = async (req, res) => {
  try {
    const airports = await airportService.getAllAirports();

    return res.status(200).json({
      success: true,
      count: airports.length,
      data: airports,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get Airport By ID
 */
const getAirportById = async (req, res) => {
  try {
    const airport = await airportService.getAirportById(req.params.id);

    return res.status(200).json({
      success: true,
      data: airport,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Update Airport
 */
const updateAirport = async (req, res) => {
  try {
    const airport = await airportService.updateAirport(
      req.params.id,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Airport updated successfully.",
      data: airport,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Delete Airport
 */
const deleteAirport = async (req, res) => {
  try {
    await airportService.deleteAirport(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Airport deleted successfully.",
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createAirport,
  getAllAirports,
  getAirportById,
  updateAirport,
  deleteAirport,
};