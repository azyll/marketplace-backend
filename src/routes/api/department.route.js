import {Router} from 'express';

import {
  createDepartment,
  archiveDepartment,
  getDepartments,
  updateDepartment,
  getDepartment
} from '../../controllers/department.controller.js';

const router = Router();

// Create Department
router.post('/', createDepartment);
// Get All Departments
router.get('/', getDepartments);
// Get Department
router.get('/:departmentId', getDepartment);
// Update Department
router.put('/:departmentId', updateDepartment);
// Archive Department
router.delete('/departmentId', archiveDepartment);

export default router;
