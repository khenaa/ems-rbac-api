import mongoose from 'mongoose';

const adminSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      unique: true,
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      trim: true,
      select: false,
    },

    fullName: {
      type: String,
      trim: true,
    },

    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role',
      required: [true, 'Role is required'],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Admin', adminSchema);
