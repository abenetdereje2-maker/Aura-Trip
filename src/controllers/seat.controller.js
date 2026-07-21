const seatService = require("../services/seat.service");

/**
 * Get all seats
 */
const getFlightSeats = async (req, res) => {
  try {
    const seats = await seatService.getFlightSeats(req.params.flightId);

    res.status(200).json({
      success: true,
      count: seats.length,
      data: seats,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get available seats
 */
const getAvailableSeats = async (req, res) => {
  try {
    const seats = await seatService.getAvailableSeats(req.params.flightId);

    res.status(200).json({
      success: true,
      count: seats.length,
      data: seats,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get seat by ID
 */
const getSeatById = async (req, res) => {
  try {
    const seat = await seatService.getSeatById(req.params.seatId);

    res.status(200).json({
      success: true,
      data: seat,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getFlightSeats,
  getAvailableSeats,
  getSeatById,
};