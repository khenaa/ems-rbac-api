import { Router } from 'express';
import {
  createRole,
  getRoles,
  getRoleById,
  updateRole,
  deleteRole,
} from '../controllers/roleController.mjs';
import { authMiddleware } from '../middlewares/authMiddleware.mjs';
import { restrictedTo } from '../middlewares/restrictedTo.mjs';

const router = Router();

router.use(authMiddleware, restrictedTo('Admin'));

router.post('/', createRole);

router.get('/', getRoles);

router.get('/:id', getRoleById);

router.patch('/:id', updateRole);

router.delete('/:id', deleteRole);

export default router;
