import {Router} from 'express';

import {
  createDepartment,
  archiveDepartment,
  getDepartments,
  updateDepartment
} from '../../controllers/department.controller.js';

const router = Router();

// Create Program
router.post('/', createDepartment);
router.get('/', getDepartments);
router.put('/', updateDepartment);
router.delete('/', archiveDepartment);

export default router;
