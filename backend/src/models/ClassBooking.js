import mongoose from 'mongoose';

const classBookingSchema = new mongoose.Schema(
  {
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member',
      required: [true, 'Member ID is required for booking'],
    },
    trainerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trainer',
      required: [true, 'Trainer ID is required for booking'],
    },
    date: {
      type: String,
      required: [true, 'Class date is required'],
      trim: true,
    },
    timeSlot: {
      type: String,
      required: [true, 'Class time slot is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: ['booked', 'attended', 'cancelled'],
        message: '{VALUE} is not a valid booking status. Allowed: booked, attended, cancelled',
      },
      default: 'booked',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const ClassBooking = mongoose.model('ClassBooking', classBookingSchema);

export default ClassBooking;
