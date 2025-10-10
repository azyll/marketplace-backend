import {Router} from 'express';
import {Joi} from 'sequelize-joi';
import {
  createDepartment,
  archiveDepartment,
  getDepartments,
  updateDepartment,
  getDepartment
} from '../../controllers/department.controller.js';
import {auth} from '../../middleware/auth.js';
import {validate} from '../../middleware/validation.js';

const router = Router();

// Create Department
router.post(
  '/',
  auth(['admin']),
  validate({
    name: Joi.string().trim().required()
  }),
  createDepartment
);
// Get All Departments
router.get('/', auth(['admin', 'employee', 'student']), getDepartments);
// Get Department
router.get('/:departmentId', auth(['admin', 'employee', 'student']), getDepartment);
// Update Department
router.put('/:departmentId', auth(['admin']), updateDepartment);
// Archive Department
router.delete('/departmentId', auth(['admin']), archiveDepartment);

export default router;
