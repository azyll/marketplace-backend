import {Router} from 'express';

import {
  createDepartment,
  archiveDepartment,
  getDepartments,
  updateDepartment
} from '../../controllers/department.controller.js';

const router = Router();

// Create Department
router.post('/', createDepartment);
// Get Departments
router.get('/', getDepartments);
// Update Department
router.put('/:departmentId', updateDepartment);
// Archive Department
router.delete('/departmentId', archiveDepartment);

export default router;
