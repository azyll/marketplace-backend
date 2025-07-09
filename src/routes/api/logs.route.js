import {Router} from 'express';
import {createLog, getLogs} from '../../controllers/logs.controller.js';

const router = Router();

// Create Log
router.post('/', createLog);
// Get Logs
router.get('/', getLogs);

export default router;

