import mongoose from 'mongoose';

const departmentSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Department name is required'],
      unique: true,
      trim: true,
    },

    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Manager',
    },

    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Department', departmentSchema);
