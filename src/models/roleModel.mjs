import mongoose from 'mongoose';

const roleSchema = mongoose.Schema(
  {
    role_name: {
      type: String,
      required: [true, 'role name is required'],
      unique: true,
      enum: ['Admin', 'Manager', 'Employee'],
    },

    permissions: {
      type: [String],
      required: [true, 'permissions are required'],
      enum: [
        'create',
        'read',
        'update',
        'delete',
        'manageRoles',
        'manageDepartments',
      ],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Role', roleSchema);
