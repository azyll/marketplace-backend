import express from 'express';
import {validate} from '../../middleware/validation.js';
import {Joi} from 'sequelize-joi';
import {
  bulkCreateStudents,
  createStudent,
  getStudentByUserId,
  getStudents
} from '../../controllers/student.controller.js';
import {auth} from '../../middleware/auth.js';
import {uploadExcelFile} from '../../middleware/upload-file-formdata.js';

const router = express.Router();

// Bulk Create Student
router.post('/bulk', auth(['admin', 'employee']), uploadExcelFile(), bulkCreateStudents);
// Create Student
router.post(
  '/:userId',
  auth(['admin', 'employee']),
  validate({
    id: Joi.number().required(),
    programId: Joi.string().required(),
    level: Joi.string().required().valid('shs', 'tertiary'),
    sex: Joi.string().trim().valid('female', 'male').required()
  }),
  createStudent
);

// Get Student by UserId
router.get('/', getStudents);
router.get('/user/:userId', auth(['student'], {selfOnly: {param: 'userId', roles: ['student']}}), getStudentByUserId);

export default router;
