import mongoose from 'mongoose';

const employeeSchema = mongoose.Schema(
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

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
    },

    updatedByAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
    },
    updatedByManager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Manager',
    },

    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: [true, 'Department is required'],
    },

    isVerified: {
      type: Boolean,
      default: true,
    },

    employmentStatus: {
      type: String,
      enum: ['Active', 'On Leave', 'Terminated'],
      default: 'Active',
    },

    jobTitle: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Employee', employeeSchema);
