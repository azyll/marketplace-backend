import express from 'express';
import {
  addUser,
  archiveUser,
  updateUser,
  getAllUsers,
  getUser,
  restoreUser,
  updatePassword,
  userModulesPermission,
  getUserDetails,
  getAllArchivedUsers,
  userResetPassword
} from '../../controllers/user.controller.js';
import {validate} from '../../middleware/validation.js';
import {Joi} from 'sequelize-joi';
import {auth} from '../../middleware/auth.js';

const router = express.Router();

// Get All Users
router.get('/archive', auth(['admin', 'student']), getAllArchivedUsers);
router.get('/', auth(['admin', 'student', 'employee']), getAllUsers);

// Create User
router.post('/', auth(['admin']), addUser);

// Update User

router.put(
  '/password',
  validate({
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional(),
    username: Joi.string().optional(),
    programId: Joi.string().optional()
  }),
  userResetPassword
);

router.get('/:userId/module-permission', auth(['admin', 'employee']), userModulesPermission);
// Get User by UserId
router.get('/:userId', auth(['admin', 'student', 'employee']), getUser);
// Archive User
router.delete('/:userId', auth(['admin']), archiveUser);

// Restore User
router.put('/:userId/restore', auth(['admin', 'employee']), restoreUser);

// Update User Password
router.post(
  '/:userId/update-password',
  auth(['admin', 'student', 'employee'], {
    selfOnly: {
      param: 'userId',
      roles: ['employee', 'student']
    }
  }),
  validate({
    newPassword: Joi.string().required(),
    oldPassword: Joi.string().required()
  }),
  updatePassword
);

router.put(
  '/:userId',
  auth(['admin', 'student', 'employee'], {
    selfOnly: {
      param: 'userId',
      roles: ['employee', 'student']
    }
  }),
  validate({
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional(),
    username: Joi.string().optional(),
    password: Joi.string().optional()
  }),
  updateUser
);

export default router;
