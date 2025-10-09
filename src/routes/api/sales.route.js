import {Router} from 'express';
import {
  getAnnualSales,
  getSale,
  getSales,
  getSalesTrend,
  getTotalSalesPerDepartment
} from '../../controllers/sales.controller.js';

const router = Router();

//Get All Sales
router.get('/', getSales);

//Annual Sales
router.get('/annual', getAnnualSales);
router.get('/trend', getSalesTrend);
router.get('/total-per-department', getTotalSalesPerDepartment);
//Annual Sale
router.get('/:oracleInvoice', getSale);
export default router;

