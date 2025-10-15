import {Router} from 'express';
import {
  getAnnualSales,
  getSale,
  getSaleByOrderId,
  getSales,
  getSalesTrend,
  getTotalSalesPerDepartment
} from '../../controllers/sales.controller.js';
import {auth} from '../../middleware/auth.js';

const router = Router();

//Get All Sales
router.get('/', auth(['admin', 'employee']), getSales);

//Annual Sales
router.get('/annual', auth(['admin', 'employee']), getAnnualSales);
router.get('/trend', auth(['admin', 'employee']), getSalesTrend);
router.get('/total-per-department', auth(['admin', 'employee']), getTotalSalesPerDepartment);
//Annual Sale
router.get('/order/:orderId', auth(['admin', 'employee', 'student']), getSaleByOrderId);
router.get('/:oracleInvoice', auth(['admin', 'employee']), getSale);
export default router;

