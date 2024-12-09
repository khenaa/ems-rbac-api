import mongoose from 'mongoose';

const managerSchema = mongoose.Schema(
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
      required: [true, 'Full name is required'],
      trim: true,
    },

    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role',
      required: [true, 'Role is required'],
    },

    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: [true, 'Department is required'],
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
    },

    isVerified: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Manager', managerSchema);
