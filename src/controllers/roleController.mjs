import Role from '../models/roleModel.mjs';
import { buildResponse, validateObjectId } from '../utils/util.mjs';

// create a new role
export const createRole = async (req, res) => {
  try {
    const { role_name, permissions } = req.body;

    if (!role_name || role_name.trim() === '') {
      return buildResponse(res, 400, 'Role name is required');
    }

    if (
      !permissions ||
      !Array.isArray(permissions) ||
      permissions.length === 0
    ) {
      return buildResponse(
        res,
        400,
        'Permissions are required and should be an array'
      );
    }

    // validate role already exists
    const roleExists = await Role.findOne({ role_name });
    if (roleExists) {
      return buildResponse(res, 400, 'Role with this name already exists');
    }

    const newRole = new Role({ role_name, permissions });
    await newRole.save();

    return buildResponse(res, 201, 'Role created successfully', newRole);
  } catch (error) {
    console.error('Error creating role:', error);
    return buildResponse(res, 500, 'Error creating role', error.message);
  }
};

// get all roles
export const getRoles = async (req, res) => {
  try {
    const roles = await Role.find();
    return buildResponse(res, 200, 'Roles fetched successfully', roles);
  } catch (error) {
    console.error('Error fetching roles:', error);
    return buildResponse(res, 500, 'Error fetching roles', error.message);
  }
};

// get a role by ID
export const getRoleById = async (req, res) => {
  try {
    const { id } = req.params;

    // validate role ID
    if (!validateObjectId(id, res, 'role')) return;

    const role = await Role.findById(id);
    if (!role) return buildResponse(res, 404, 'Role not found');

    return buildResponse(res, 200, 'Role fetched successfully', role);
  } catch (error) {
    console.error('Error fetching role:', error);
    return buildResponse(res, 500, 'Error fetching role', error.message);
  }
};

// update a role
export const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role_name, permissions } = req.body;

    // validate role ID
    if (!validateObjectId(id, res, 'role')) return;

    if (role_name) {
      if (role_name.trim() === '') {
        return buildResponse(res, 400, 'role_name is required');
      }
    }

    if (permissions) {
      if (!Array.isArray(permissions) || permissions.length === 0) {
        return buildResponse(400, {
          message: 'permissions must be a non-empty array of strings',
        });
      }
    }

    const updatedRole = await Role.findByIdAndUpdate(
      id,
      { role_name, permissions },
      { new: true, runValidators: true }
    );

    if (!updatedRole) return buildResponse(res, 404, 'Role not found');

    return buildResponse(res, 200, 'Role updated successfully', updatedRole);
  } catch (error) {
    console.error('Error updating role:', error);
    return buildResponse(res, 500, 'Error updating role', error.message);
  }
};

// delete a role
export const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;

    // validate role ID
    if (!validateObjectId(id, res, 'role')) return;

    const deletedRole = await Role.findByIdAndDelete(id);
    if (!deletedRole) return buildResponse(res, 404, 'Role not found');

    return buildResponse(res, 200, 'Role deleted successfully');
  } catch (error) {
    console.error('Error deleting role:', error);
    return buildResponse(res, 500, 'Error deleting role', error.message);
  }
};
