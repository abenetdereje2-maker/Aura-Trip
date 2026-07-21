const bookingService = require("../services/booking.service");

// ==========================================
// Create Booking
// ==========================================
const createBooking = async (req, res) => {
  try {
    const booking = await bookingService.createBooking(
      req.user.id,
      req.body
    );

    res.status(201).json({
      success: true,
      message: "Booking created successfully.",
      data: booking,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// Get My Bookings
// ==========================================
const getMyBookings = async (req, res) => {
  try {
    const bookings = await bookingService.getMyBookings(
      req.user.id
    );

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// Get Booking By ID
// ==========================================
const getBookingById = async (req, res) => {
  try {
    const booking = await bookingService.getBookingById(
      req.params.id,
      req.user.id,
      req.user.role
    );

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};
// ==========================================
// Cancel Booking
// ==========================================
const cancelBooking = async (req, res) => {
  try {
    const booking = await bookingService.cancelBooking(
      req.params.id,
      req.user.id,
      req.user.role
    );

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully.",
      data: booking,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
// ==========================================
// Admin - Get All Bookings
// ==========================================
const getAllBookings = async (req, res) => {
  try {
    const bookings = await bookingService.getAllBookings();

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ==========================================
// Delete Booking (Admin)
// ==========================================
const deleteBooking = async (req, res) => {
  try {
    const result = await bookingService.deleteBooking(req.params.id);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
   getAllBookings,
     deleteBooking,
};