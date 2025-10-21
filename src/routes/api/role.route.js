import {Router} from 'express';
import {archiveRole, createRole, getRoles, updateRoles} from '../../controllers/roles.controller.js';
import {validate} from '../../middleware/validation.js';
import {Joi} from 'sequelize-joi';

const router = Router();

// Create Role
router.post(
  '/',
  validate({
    name: Joi.string().trim().required(),
    systemTag: Joi.string().required().trim().valid('student', 'admin', 'employee')
  }),
  createRole
);
// Get Role
router.get('/', getRoles);
// Update Role
router.put(
  '/:roleId',
  validate({
    name: Joi.string().trim().required(),
    systemTag: Joi.string().required().trim().valid('student', 'admin', 'employee')
  }),
  updateRoles
);
// Archive Role
router.delete('/:roleId', archiveRole);

export default router;

