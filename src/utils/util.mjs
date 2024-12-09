import crypto from 'crypto';
import mongoose from 'mongoose';
import Employee from '../models/employeeModel.mjs';
import Manager from '../models/managerModel.mjs';
import Admin from '../models/adminModel.mjs';

export const buildResponse = (res, statusCode, message = null, data = null) => {
  return res.status(statusCode).json({
    status: statusCode >= 400 ? 'fail' : 'success',
    message,
    data,
  });
};

export const generatePassword = (length = 10) => {
  const charset =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let password = '';

  // Use crypto for more secure randomness
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(charset.length); // Secure random index
    password += charset[randomIndex];
  }

  return password;
};

export const validateObjectId = (id, res, entityName) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    buildResponse(res, 400, `Invalid ${entityName} ID`);
    return false;
  }
  return true;
};

export const getTargetCollection = (userType) => {
  switch (userType.toLowerCase()) {
    case 'employee':
      return Employee;
    case 'manager':
      return Manager;
    case 'admin':
      return Admin;
    default:
      throw new Error(
        "Invalid userType. userType should be 'employee', 'manager', or 'admin'"
      );
  }
};
