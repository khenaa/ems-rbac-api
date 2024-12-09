import Employee from '../models/employeeModel.mjs';
import Department from '../models/departmentModel.mjs';
import Manager from '../models/managerModel.mjs';
import { buildResponse, validateObjectId } from '../utils/util.mjs';

export const getProfile = async (req, res) => {
  try {
    const { currentUser } = req;

    const employee = await Employee.findById(currentUser.id).select(
      '-password'
    );

    if (!employee) {
      return buildResponse(res, 404, 'Employee not found.');
    }

    return buildResponse(
      res,
      200,
      'Employee profile retrieved successfully.',
      employee
    );
  } catch (error) {
    console.error('Error fetching employee profile:', error);
    return buildResponse(res, 500, 'Error fetching employee profile', {
      error: error.message,
    });
  }
};

export const getEmployees = async (req, res) => {
  try {
    const { id, role } = req.currentUser;

    if (role === 'Admin') {
      const employees = await Employee.find().populate(
        'department',
        'name manager'
      );
      return buildResponse(
        res,
        200,
        'Employees fetched successfully',
        employees
      );
    }

    if (role === 'Manager') {
      const manager = await Manager.findById(id).populate('department');
      if (!manager || !manager.department) {
        return buildResponse(res, 404, 'Department not found for the Manager');
      }

      // return employees in the Manager's department
      const employees = await Employee.find({
        department: manager.department._id,
      }).populate('department', 'name manager');
      return buildResponse(
        res,
        200,
        'Employees fetched successfully',
        employees
      );
    }

    return buildResponse(res, 403, 'Access Denied');
  } catch (error) {
    return buildResponse(res, 500, 'Error fetching employees', {
      error: error.message,
    });
  }
};

export const getEmployeeById = async (req, res) => {
  try {
    const { id, role } = req.currentUser;

    const { employeeId } = req.params;

    // validate employee ID
    if (!validateObjectId(employeeId, res, 'employee')) return;

    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return buildResponse(res, 404, 'Employee not found');
    }

    const manager = await Manager.findById(id).populate('department');
    if (!manager || !manager.department) {
      return buildResponse(
        res,
        404,
        'Current user or their department not found'
      );
    }

    if (role === 'Admin') {
      return buildResponse(
        res,
        200,
        'Employee profile fetched successfully',
        employee
      );
    }

    console.log(
      manager.department._id.toString() === employee.department.toString()
    );

    // managers can only access employees in their own department
    if (
      role === 'Manager' &&
      manager.department._id.toString() === employee.department.toString()
    ) {
      return buildResponse(
        res,
        200,
        'Employee profile fetched successfully',
        employee
      );
    }

    return buildResponse(
      res,
      403,
      'Access Denied! You cannot view employees from other departments'
    );
  } catch (error) {
    return buildResponse(res, 500, 'Error fetching employee profile', {
      error: error.message,
    });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const { id, role } = req.currentUser;
    const { employeeId } = req.params;

    const { employmentStatus, jobTitle } = req.body;

    if (employmentStatus) {
      if (employmentStatus.trim() === '') {
        return buildResponse(res, 400, 'employmentStatus is required');
      }
    }

    if (jobTitle) {
      if (jobTitle.trim() === '') {
        return buildResponse(res, 400, 'jobTitle is required');
      }
    }

    // validate employee ID
    if (!validateObjectId(employeeId, res, 'employee')) return;

    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return buildResponse(res, 404, 'Employee not found');
    }

    const manager = await Manager.findById(id).populate('department');
    if (!manager || !manager.department) {
      return buildResponse(res, 404, 'manager or their department not found');
    }

    // Admins can always update any employee profile
    if (role === 'Admin') {
      // update employee data
      const updatedEmployee = await Employee.findByIdAndUpdate(
        employeeId,
        { employmentStatus, jobTitle },
        { new: true }
      );
      return buildResponse(
        res,
        200,
        'Employee profile updated successfully',
        updatedEmployee
      );
    }

    // Managers can only update employees in their own department
    if (
      role === 'Manager' &&
      manager.department._id.toString() === employee.department.toString()
    ) {
      const updatedEmployee = await Employee.findByIdAndUpdate(
        employeeId,
        { employmentStatus, jobTitle },
        { new: true }
      );
      return buildResponse(
        res,
        200,
        'Employee profile updated successfully',
        updatedEmployee
      );
    }

    // If the manager is trying to update an employee from another department
    return buildResponse(
      res,
      403,
      'Access Denied. You cannot update employees from other departments'
    );
  } catch (error) {
    return buildResponse(res, 500, 'Error updating employee profile', {
      error: error.message,
    });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;

    // validate employee ID
    if (!validateObjectId(employeeId, res, 'employee')) return;

    const employee = await Employee.findByIdAndDelete(employeeId);

    if (!employee) {
      return buildResponse(res, 404, 'Employee not found');
    }

    return buildResponse(res, 200, 'Employee deleted successfully');
  } catch (error) {
    return buildResponse(res, 500, 'Error deleting employee', {
      error: error.message,
    });
  }
};
