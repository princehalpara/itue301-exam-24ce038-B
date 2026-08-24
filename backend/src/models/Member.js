import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Member name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Member email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    membershipType: {
      type: String,
      enum: {
        values: ['basic', 'premium', 'platinum'],
        message: '{VALUE} is not a valid membership type. Allowed: basic, premium, platinum',
      },
      default: 'basic',
    },
  },
  {
    timestamps: true,
  }
);

const Member = mongoose.model('Member', memberSchema);

export default Member;
