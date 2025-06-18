import {Router} from 'express';
import {createLog, getLogs} from '../../controllers/logs.controller.js';

const router = Router();

// Create Program
router.post('/', createLog);
router.get('/', getLogs);

export default router;

