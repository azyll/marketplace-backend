import {Router} from 'express';
import {archiveRole, createRole, getRoles, updateRoles} from '../../controllers/roles.controller.js';

const router = Router();

// Create Program
router.post('/', createRole);
router.get('/', getRoles);
router.put('/', updateRoles);
router.delete('/', archiveRole);

export default router;

