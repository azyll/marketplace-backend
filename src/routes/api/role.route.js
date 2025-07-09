import {Router} from 'express';
import {archiveRole, createRole, getRoles, updateRoles} from '../../controllers/roles.controller.js';

const router = Router();

// Create Role
router.post('/', createRole);
// Get Role
router.get('/', getRoles);
// Update Role
router.put('/', updateRoles);
// Archive Role
router.delete('/', archiveRole);

export default router;

