import {Router} from 'express';
import {
  archiveRole,
  createRole,
  getRole,
  getRoleById,
  getRoles,
  restoreRole,
  updateRoles
} from '../../controllers/roles.controller.js';
import {validate} from '../../middleware/validation.js';
import {Joi} from 'sequelize-joi';

const router = Router();

// Create Role
router.post(
  '/',
  validate({
    name: Joi.string().trim().required(),
    systemTag: Joi.string().required().trim().valid('student', 'admin', 'employee'),
    modulePermission: Joi.array().optional()
  }),
  createRole
);

// Get Role
router.get('/:roleId', getRoleById);
// Get Role
router.get('/', getRoles);

router.put('/:roleId/restore', restoreRole);
// Update Role
router.put(
  '/:roleId',
  validate({
    name: Joi.string().trim().required(),
    systemTag: Joi.string().required().trim().valid('student', 'admin', 'employee'),
    modulePermission: Joi.array().optional()
  }),
  updateRoles
);
// Archive Role
router.delete('/:roleId', archiveRole);

export default router;

