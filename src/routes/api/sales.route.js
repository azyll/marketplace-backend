import {Router} from 'express';
import {getAnnualSales, getSale, getSales, getSalesTrend} from '../../controllers/sales.controller.js';

const router = Router();

//Get All Sales
router.get('/', getSales);

//Annual Sales
router.get('/annual', getAnnualSales);
router.get('/trend', getSalesTrend);
//Annual Sale
router.get('/:oracleInvoice', getSale);
export default router;

