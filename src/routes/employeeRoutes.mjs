import { Router } from 'express';
import {
  getProfile,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} from '../controllers/employeeController.mjs';
import { authMiddleware } from '../middlewares/authMiddleware.mjs';
import { restrictedTo } from '../middlewares/restrictedTo.mjs';

const router = Router();

router.use(authMiddleware);

router.get('/profile', getProfile);

router.get('/', restrictedTo('Admin', 'Manager'), getEmployees);

router.get('/:employeeId', restrictedTo('Admin', 'Manager'), getEmployeeById);

router.patch('/:employeeId', restrictedTo('Admin', 'Manager'), updateEmployee);

router.delete('/employeeId', restrictedTo('Admin'), deleteEmployee);

export default router;
