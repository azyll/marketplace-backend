import {Router} from 'express';
import {getSales} from '../../controllers/sales.controller.js';
const router = Router();

router.get('/', getSales);
export default router;

