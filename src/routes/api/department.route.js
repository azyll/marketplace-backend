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
router.put('/:departmentId', updateDepartment);
router.delete('/departmentId', archiveDepartment);

export default router;
