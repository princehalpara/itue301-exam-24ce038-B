import express from 'express';
import {
  createBooking,
  getMyBookings,
  updateBookingStatus,
  getAllBookings,
} from '../controllers/bookingController.js';
import { authGuard } from '../middleware/authGuard.js';

const router = express.Router();

// Protected Routes
router.use(authGuard);

// POST /api/v1/bookings
router.post('/', createBooking);

// GET /api/v1/bookings/my
router.get('/my', getMyBookings);

// PATCH /api/v1/bookings/:id/status
router.patch('/:id/status', updateBookingStatus);

// GET /api/v1/bookings/all (Admin / Staff Overview)
router.get('/all', getAllBookings);

export default router;
