const airlineService = require("../services/airline.service");

/**
 * Create Airline
 */
const createAirline = async (req, res) => {
  try {
    const airline = await airlineService.createAirline(req.body);

    return res.status(201).json({
      success: true,
      message: "Airline created successfully.",
      data: airline,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get All Airlines
 */
const getAllAirlines = async (req, res) => {
  try {
    const airlines = await airlineService.getAllAirlines();

    return res.status(200).json({
      success: true,
      message: "Airlines retrieved successfully.",
      count: airlines.length,
      data: airlines,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get Airline By ID
 */
const getAirlineById = async (req, res) => {
  try {
    const airline = await airlineService.getAirlineById(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Airline retrieved successfully.",
      data: airline,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Update Airline
 */
const updateAirline = async (req, res) => {
  try {
    const airline = await airlineService.updateAirline(
      req.params.id,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Airline updated successfully.",
      data: airline,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Delete Airline
 */
const deleteAirline = async (req, res) => {
  try {
    await airlineService.deleteAirline(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Airline deleted successfully.",
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createAirline,
  getAllAirlines,
  getAirlineById,
  updateAirline,
  deleteAirline,
};