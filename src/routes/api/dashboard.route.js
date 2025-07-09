import {Router} from 'express';
import {getDashboard} from '../../controllers/dashboard.controller.js';

const router = Router();

//Get Dashboard
router.get('/', getDashboard);
export default router;
