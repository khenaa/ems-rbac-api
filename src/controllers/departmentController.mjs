import Department from '../models/departmentModel.mjs';
import Manager from '../models/managerModel.mjs';
import { buildResponse, validateObjectId } from '../utils/util.mjs';

// create department
export const createDepartment = async (req, res) => {
  try {
    const { name, manager_id, description } = req.body;

    if (!name || name.trim() === '') {
      return buildResponse(res, 400, 'Department name is required');
    }

    // validate department name already exists
    const departmentExists = await Department.findOne({ name });
    if (departmentExists) {
      return buildResponse(
        res,
        400,
        'A department with this name already exists'
      );
    }

    if (manager_id) {
      // validate manager ID
      if (!validateObjectId(manager_id, res, 'manager')) return;

      // validate manager exists
      const managerExists = await Manager.findById(manager_id);
      if (!managerExists) {
        return buildResponse(res, 400, 'Manager does not exist');
      }
    }

    const newDepartment = new Department({
      name,
      manager: manager_id,
      description,
    });
    await newDepartment.save();

    return buildResponse(
      res,
      201,
      'Department created successfully',
      newDepartment
    );
  } catch (error) {
    console.error('Error creating department:', error);
    return buildResponse(res, 500, 'Error creating department', error.message);
  }
};

// get all departments
export const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find().populate(
      'manager',
      'fullName email'
    );
    return buildResponse(
      res,
      200,
      'Departments retrieved successfully',
      departments
    );
  } catch (error) {
    console.error('Error retrieving departments:', error);
    return buildResponse(
      res,
      500,
      'Error retrieving departments',
      error.message
    );
  }
};

// get a department by ID
export const getDepartmentById = async (req, res) => {
  try {
    const { id } = req.params;

    // validate department ID
    if (!validateObjectId(id, res, 'department')) return;

    const department = await Department.findById(id).populate(
      'manager',
      'fullName email'
    );
    if (!department) {
      return buildResponse(res, 404, 'Department not found');
    }

    return buildResponse(
      res,
      200,
      'Department retrieved successfully',
      department
    );
  } catch (error) {
    console.error('Error retrieving department:', error);
    return buildResponse(
      res,
      500,
      'Error retrieving department',
      error.message
    );
  }
};

// update department
export const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, manager_id, description } = req.body;

    // validate department ID
    if (!validateObjectId(id, res, 'department')) return;

    const department = await Department.findById(id);
    if (!department) {
      return buildResponse(res, 404, 'Department not found');
    }

    // validate updated department name already exists
    if (name && name !== department.name) {
      const departmentExists = await Department.findOne({ name });
      if (departmentExists) {
        return buildResponse(
          res,
          400,
          'A department with this name already exists'
        );
      }
      department.name = name;
    }

    if (manager_id) {
      // validate manager ID
      if (!validateObjectId(manager_id, res, 'manager')) return;
      const managerExists = await Manager.findById(manager_id);
      if (!managerExists) {
        return buildResponse(res, 400, 'Manager does not exist');
      }
      department.manager = manager_id;
    }

    if (description) department.description = description;

    await department.save();
    return buildResponse(
      res,
      200,
      'Department updated successfully',
      department
    );
  } catch (error) {
    console.error('Error updating department:', error);
    return buildResponse(res, 500, 'Error updating department', error.message);
  }
};

// delete department
export const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    // validate department ID
    if (!validateObjectId(id, res, 'department')) return;

    const department = await Department.findByIdAndDelete(id);
    if (!department) {
      return buildResponse(res, 404, 'Department not found');
    }

    return buildResponse(res, 200, 'Department deleted successfully');
  } catch (error) {
    console.error('Error deleting department:', error);
    return buildResponse(res, 500, 'Error deleting department', error.message);
  }
};
