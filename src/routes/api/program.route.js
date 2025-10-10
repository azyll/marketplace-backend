import {Router} from 'express';
import {Joi} from 'sequelize-joi';
import {archiveProgram, createProgram, getPrograms, updateProgram} from '../../controllers/program.controller.js';
import {auth} from '../../middleware/auth.js';
import {validate} from '../../middleware/validation.js';

const router = Router();

// Create Program
router.post(
  '/',
  auth(['admin', 'employee', 'student']),
  validate({
    name: Joi.string().trim().required(),
    departmentId: Joi.string().uuid().trim().required()
  }),
  createProgram
);

// Get Program
router.get('/', getPrograms);

// Update Program
router.put('/', auth(['admin', 'employee', 'student']), updateProgram);

// Delete Program
router.delete('/', auth(['admin', 'employee', 'student']), archiveProgram);

export default router;
