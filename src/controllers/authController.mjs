import bcrypt from 'bcrypt';
import Employee from '../models/employeeModel.mjs';
import Manager from '../models/managerModel.mjs';
import Role from '../models/roleModel.mjs';
import Admin from '../models/adminModel.mjs';
import Department from '../models/departmentModel.mjs';
import sendEmail from '../emails/sendEmail.mjs';
import { registerTemplate } from '../emails/emailTemplates/registerTemplate.mjs';
import {
  buildResponse,
  generatePassword,
  getTargetCollection,
  validateObjectId,
} from '../utils/util.mjs';
import { generateToken } from '../utils/authUtil.mjs';

export const register = async (req, res) => {
  try {
    const { id } = req.currentUser;

    const { fullName, email, role, department } = req.body;

    if (!fullName || fullName.trim() === '') {
      return buildResponse(res, 400, 'fullName is required');
    }
    if (!email || email.trim() === '') {
      return buildResponse(res, 400, 'email is required');
    }
    if (!role || role.trim() === '') {
      return buildResponse(res, 400, 'role is required');
    }
    if (!department || department.trim() === '') {
      return buildResponse(res, 400, 'department is required');
    }

    // validate role ID
    if (!validateObjectId(role, res, 'role')) return;

    const roleData = await Role.findById(role);
    if (!roleData) {
      return buildResponse(res, 400, 'role does not exist');
    }

    // validate department ID
    if (!validateObjectId(department, res, 'department')) return;

    const departmentData = await Department.findById(department);
    if (!departmentData) {
      return buildResponse(res, 400, 'department does not exist');
    }

    // validate email already exists
    let existingUser;
    if (roleData.role_name === 'Manager') {
      existingUser = await Manager.findOne({ email }).exec();
    } else {
      existingUser = await Employee.findOne({ email }).exec();
    }

    if (existingUser) {
      return buildResponse(res, 400, 'A user with this email already exists');
    }

    // generate password
    const password = generatePassword(12);

    const hashedPassword = await bcrypt.hash(password, 12);

    let newUser;
    if (roleData.role_name === 'Manager') {
      // validate department has a manager
      if (departmentData.manager) {
        return buildResponse(res, 400, 'Department already has a manager');
      }

      // create manager
      newUser = new Manager({
        fullName,
        email,
        password: hashedPassword,
        role: roleData._id,
        department: departmentData._id,
        createdBy: id,
      });

      // update the department manager
      departmentData.manager = newUser._id;
      await departmentData.save();
    } else {
      // create Employee
      newUser = new Employee({
        fullName,
        email,
        password: hashedPassword,
        role: roleData._id,
        department: departmentData._id,
        createdBy: id,
      });
    }

    await newUser.save();

    // send email with login details
    const message = registerTemplate(fullName, email, password);
    const emailResponse = await sendEmail(
      email,
      'Your Account Details',
      message
    );
    if (!emailResponse.status) {
      return buildResponse(
        res,
        500,
        'The user has been registered, but there was a problem sending the email' +
          '-' +
          emailResponse.message
      );
    }

    const user = {
      id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      role: roleData.role_name,
      department: departmentData.name,
    };

    return buildResponse(
      res,
      201,
      'User registered successfully. Login details sent to email.',
      user
    );
  } catch (error) {
    console.error('Error registering user:', error);
    return buildResponse(res, 500, 'Error registering user', {
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, userType } = req.body;

    if (!email || email.trim() === '') {
      return buildResponse(res, 400, 'email is required');
    }
    if (!password || password.trim() === '') {
      return buildResponse(res, 400, 'password is required');
    }
    if (!userType || userType.trim() === '') {
      return buildResponse(
        res,
        400,
        'userType (employee, admin or manager)  is required'
      );
    }

    const TargetCollection = getTargetCollection(userType);

    const user = await TargetCollection.findOne({ email })
      .select('+password')
      .populate('role');
    if (!user) {
      return buildResponse(res, 401, 'Invalid email or password');
    }

    const userRole = user.role.role_name;

    // validate password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return buildResponse(res, 401, 'Invalid email or password');
    }

    // generate JWT token
    const token = generateToken(user._id, userRole);

    // remove password from response
    user.password = undefined;

    const responsePayload = {
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: userRole,
      },
    };

    return buildResponse(res, 200, 'Login successful', responsePayload);
  } catch (error) {
    console.error('Error logging in:', error);
    return buildResponse(res, 500, 'Error logging in', error.message);
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { id, role } = req.currentUser;

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return buildResponse(res, 400, 'All fields are required');
    }

    // get model based on the user role
    const UserModel = getTargetCollection(role.toLowerCase());

    // validate user exist
    const user = await UserModel.findById(id).select('+password');
    if (!user) {
      return buildResponse(res, 404, 'User not found');
    }

    // validate old password
    const isPasswordMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordMatch) {
      return buildResponse(res, 401, 'Current password is incorrect');
    }

    // hash and save the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    await user.save();

    return buildResponse(res, 200, 'Password changed successfully');
  } catch (error) {
    console.error('Error changing password:', error);
    return buildResponse(res, 500, 'Error changing password', error.message);
  }
};
