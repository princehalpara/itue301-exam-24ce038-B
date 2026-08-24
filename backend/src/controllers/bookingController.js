import ClassBooking from '../models/ClassBooking.js';
import Trainer from '../models/Trainer.js';

/**
 * @desc    Create a new gym class booking
 * @route   POST /api/v1/bookings
 * @access  Private (authGuard)
 */
export const createBooking = async (req, res, next) => {
  try {
    const { trainerId, date, timeSlot, notes } = req.body;
    const memberId = req.member._id;

    // Validate presence
    if (!trainerId || !date || !timeSlot) {
      return res.status(400).json({
        success: false,
        message: 'Please provide trainerId, date, and timeSlot for the booking',
      });
    }

    // Verify trainer exists
    const trainer = await Trainer.findById(trainerId);
    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: `Trainer not found with ID ${trainerId}`,
      });
    }

    // Save new booking to MongoDB
    const booking = await ClassBooking.create({
      memberId,
      trainerId,
      date,
      timeSlot,
      notes: notes || '',
      status: 'booked',
    });

    // Populate trainer and member info for response
    const populatedBooking = await ClassBooking.findById(booking._id)
      .populate('memberId', 'name email')
      .populate('trainerId', 'name specialization');

    res.status(201).json({
      success: true,
      message: 'Class booking created successfully',
      data: populatedBooking,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all bookings for the currently authenticated member
 * @route   GET /api/v1/bookings/my
 * @access  Private (authGuard)
 */
export const getMyBookings = async (req, res, next) => {
  try {
    const memberId = req.member._id;

    // Populates memberId (name email) and trainerId (name specialization)
    const bookings = await ClassBooking.find({ memberId })
      .populate('memberId', 'name email')
      .populate('trainerId', 'name specialization')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update booking status (booked, attended, cancelled)
 * @route   PATCH /api/v1/bookings/:id/status
 * @access  Private (authGuard)
 */
export const updateBookingStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ['booked', 'attended', 'cancelled'];
    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status '${status}'. Allowed values: ${allowedStatuses.join(', ')}`,
      });
    }

    // Find booking
    const booking = await ClassBooking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `Booking not found with ID ${id}`,
      });
    }

    // Update status
    booking.status = status;
    await booking.save();

    // Re-populate with member and trainer details
    const updatedBooking = await ClassBooking.findById(id)
      .populate('memberId', 'name email')
      .populate('trainerId', 'name specialization');

    res.status(200).json({
      success: true,
      message: `Booking status updated to '${status}' successfully`,
      data: updatedBooking,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all gym bookings across the platform (Admin)
 * @route   GET /api/v1/bookings/all
 * @access  Private (authGuard)
 */
export const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await ClassBooking.find()
      .populate('memberId', 'name email membershipType')
      .populate('trainerId', 'name specialization')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};
