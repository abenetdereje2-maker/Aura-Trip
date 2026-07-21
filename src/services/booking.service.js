const prisma = require("../config/prisma");

// ==========================================
// Generate Booking Reference
// ==========================================
const generateBookingReference = () => {
  return (
    "ATR-" +
    Math.random().toString(36).substring(2, 8).toUpperCase()
  );
};

// ==========================================
// Create Booking
// ==========================================
const createBooking = async (userId, data) => {
  return await prisma.$transaction(async (tx) => {
    // ===============================
    // Check User
    // ===============================
    const user = await tx.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new Error("User not found.");
    }

    // ===============================
    // Check Flight
    // ===============================
    const flight = await tx.flight.findUnique({
      where: {
        id: data.flightId,
      },
    });

    if (!flight) {
      throw new Error("Flight not found.");
    }

    // ===============================
    // Check Seat
    // ===============================
    const seat = await tx.seat.findUnique({
      where: {
        id: data.seatId,
      },
    });

    if (!seat) {
      throw new Error("Seat not found.");
    }

    // ===============================
    // Seat belongs to Flight?
    // ===============================
    if (seat.flightId !== flight.id) {
      throw new Error("Seat does not belong to this flight.");
    }

    // ===============================
    // Seat Available?
    // ===============================
    if (seat.status !== "AVAILABLE") {
      throw new Error("Seat is already booked.");
    }

    // ===============================
    // Flight Full?
    // ===============================
    if (flight.availableSeats <= 0) {
      throw new Error("Flight is full.");
    }

    // ===============================
    // Update Seat
    // ===============================
    await tx.seat.update({
      where: {
        id: seat.id,
      },
      data: {
        status: "BOOKED",
      },
    });

    // ===============================
    // Update Flight
    // ===============================
    await tx.flight.update({
      where: {
        id: flight.id,
      },
      data: {
        availableSeats: {
          decrement: 1,
        },
      },
    });

    // ===============================
    // Create Booking
    // ===============================
    const booking = await tx.booking.create({
      data: {
        bookingReference: generateBookingReference(),
        userId,
        flightId: flight.id,
        seatId: seat.id,
        totalPrice: flight.price,
        status: "CONFIRMED",
        paymentStatus: "PENDING",
      },
    });

    // ===============================
    // Return Updated Booking
    // ===============================
    return await tx.booking.findUnique({
      where: {
        id: booking.id,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        flight: {
          include: {
            airline: true,
            departureAirport: true,
            arrivalAirport: true,
          },
        },
        seat: true,
      },
    });
  });
};
// ==========================================
// Get My Bookings
// ==========================================
const getMyBookings = async (userId) => {
  return await prisma.booking.findMany({
    where: {
      userId,
    },
    include: {
      flight: {
        include: {
          airline: true,
          departureAirport: true,
          arrivalAirport: true,
        },
      },
      seat: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};
// ==========================================
// Get All Bookings (Admin)
// ==========================================
const getAllBookings = async () => {
  return await prisma.booking.findMany({
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
        },
      },

      flight: {
        include: {
          airline: true,
          departureAirport: true,
          arrivalAirport: true,
        },
      },

      seat: true,
    },

    orderBy: {
      bookingDate: "desc",
    },
  });
};
const getBookingById = async (bookingId, userId, role) => {
  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId,
    },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
        },
      },
      flight: {
        include: {
          airline: true,
          departureAirport: true,
          arrivalAirport: true,
        },
      },
      seat: true,
    },
  });

  if (!booking) {
    throw new Error("Booking not found.");
  }

  // Only the owner or an ADMIN can view the booking
  if (role !== "ADMIN" && booking.userId !== userId) {
    throw new Error("Unauthorized to view this booking.");
  }

  return booking;
};
// ==========================================
// Cancel Booking
// ==========================================
const cancelBooking = async (bookingId, userId, role) => {
  return await prisma.$transaction(async (tx) => {
    // Find booking
    const booking = await tx.booking.findUnique({
      where: {
        id: bookingId,
      },
      include: {
        flight: true,
        seat: true,
      },
    });

    if (!booking) {
      throw new Error("Booking not found.");
    }

    // Only owner or ADMIN can cancel
    if (role !== "ADMIN" && booking.userId !== userId) {
      throw new Error("Unauthorized to cancel this booking.");
    }

    // Already cancelled?
    if (booking.status === "CANCELLED") {
      throw new Error("Booking is already cancelled.");
    }

    // Update booking status
    const updatedBooking = await tx.booking.update({
      where: {
        id: booking.id,
      },
      data: {
        status: "CANCELLED",
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        flight: {
          include: {
            airline: true,
            departureAirport: true,
            arrivalAirport: true,
          },
        },
        seat: true,
      },
    });

    // Release seat
    await tx.seat.update({
      where: {
        id: booking.seatId,
      },
      data: {
        status: "AVAILABLE",
      },
    });

    // Increase available seats
    await tx.flight.update({
      where: {
        id: booking.flightId,
      },
      data: {
        availableSeats: {
          increment: 1,
        },
      },
    });

    return updatedBooking;
  });
};
// ==========================================
// Delete Booking (Admin)
// ==========================================
const deleteBooking = async (bookingId) => {
  return await prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findUnique({
      where: {
        id: bookingId,
      },
      include: {
        seat: true,
        flight: true,
      },
    });

    if (!booking) {
      throw new Error("Booking not found.");
    }

    // If booking is still confirmed,
    // release the seat and increase available seats
    if (booking.status !== "CANCELLED") {
      await tx.seat.update({
        where: {
          id: booking.seatId,
        },
        data: {
          status: "AVAILABLE",
        },
      });

      await tx.flight.update({
        where: {
          id: booking.flightId,
        },
        data: {
          availableSeats: {
            increment: 1,
          },
        },
      });
    }

    await tx.booking.delete({
      where: {
        id: bookingId,
      },
    });

    return {
      message: "Booking deleted successfully.",
    };
  });
};
module.exports = {
  createBooking,
  getMyBookings,
    getBookingById,
     cancelBooking,
      getAllBookings,
      deleteBooking,
};