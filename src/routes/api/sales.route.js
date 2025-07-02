import {Router} from 'express';
import {getAnnualSales, getSale, getSales} from '../../controllers/sales.controller.js';

const router = Router();

router.get('/', getSales);
router.get('/annual', getAnnualSales);
router.get('/:oracleInvoice', getSale);
export default router;

