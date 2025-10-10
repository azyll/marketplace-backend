import {Router} from 'express';
import {createLog, getLogs} from '../../controllers/logs.controller.js';
import {auth} from '../../middleware/auth.js';

const router = Router();

// Create Log
router.post('/', createLog);
// Get Logs
router.get('/', auth(['admin', 'employee', 'student']), getLogs);

export default router;

