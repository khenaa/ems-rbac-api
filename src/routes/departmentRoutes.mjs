import { Router } from 'express';
import {
  createDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
} from '../controllers/departmentController.mjs';
import { authMiddleware } from '../middlewares/authMiddleware.mjs';
import { restrictedTo } from '../middlewares/restrictedTo.mjs';

const router = Router();

router.use(authMiddleware, restrictedTo('Admin'));

router.post('/', createDepartment);

router.get('/', getDepartments);

router.get('/:id', getDepartmentById);

router.patch('/:id', updateDepartment);

router.delete('/:id', deleteDepartment);

export default router;
