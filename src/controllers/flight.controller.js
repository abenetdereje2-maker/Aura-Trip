const flightService = require("../services/flight.service");

/**
 * Create Flight
 */
const createFlight = async (req, res) => {
  try {
    const flight = await flightService.createFlight(req.body);

    return res.status(201).json({
      success: true,
      message: "Flight created successfully.",
      data: flight,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get All Flights
 */
const getAllFlights = async (req, res) => {
  try {
    const flights = await flightService.getAllFlights();

    return res.status(200).json({
      success: true,
      count: flights.length,
      data: flights,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get Flight By ID
 */
const getFlightById = async (req, res) => {
  try {
    const flight = await flightService.getFlightById(req.params.id);

    return res.status(200).json({
      success: true,
      data: flight,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Update Flight
 */
const updateFlight = async (req, res) => {
  try {
    const flight = await flightService.updateFlight(
      req.params.id,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Flight updated successfully.",
      data: flight,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Delete Flight
 */
const deleteFlight = async (req, res) => {
  try {
    await flightService.deleteFlight(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Flight deleted successfully.",
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Search Flights
 */
const searchFlights = async (req, res) => {
  try {
    const flights = await flightService.searchFlights(req.query);

    return res.status(200).json({
      success: true,
      count: flights.length,
      data: flights,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createFlight,
  getAllFlights,
  getFlightById,
  updateFlight,
  deleteFlight,
  searchFlights,
};