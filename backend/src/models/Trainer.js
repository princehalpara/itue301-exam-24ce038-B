import mongoose from 'mongoose';

const trainerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Trainer name is required'],
      trim: true,
    },
    specialization: {
      type: String,
      required: [true, 'Trainer specialization is required'],
      trim: true,
    },
    available: {
      type: Boolean,
      default: true,
    },
    experienceYears: {
      type: Number,
      default: 3,
    },
    bio: {
      type: String,
      default: '',
    },
    rating: {
      type: Number,
      default: 4.8,
    },
    avatar: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Trainer = mongoose.model('Trainer', trainerSchema);

export default Trainer;
