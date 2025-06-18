import {Router} from 'express';
import {getSale, getSales} from '../../controllers/sales.controller.js';
const router = Router();

router.get('/', getSales);
router.get('/:oracleInvoice', getSale);
export default router;

