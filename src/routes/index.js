import express from 'express';
import userRoutes from './api/user.route.js';
import studentRoute from './api/student.route.js';
import authRoute from './api/auth.route.js';
import productRoute from './api/product.route.js';
import programRoute from './api/program.route.js';
import cartRoute from './api/cart.route.js';
import orderRoute from './api/order.route.js';
import inventoryRoute from './api/inventory.route.js';
import DashboardRoute from './api/dashboard.route.js';
import DepartmentRoute from './api/department.route.js';
import SalesRoute from './api/sales.route.js';
import NotificationRoute from './api/notification.route.js';
import RoleRoute from './api/role.route.js';
import LogRoute from './api/logs.route.js';

const router = express.Router();

router.use('/user', userRoutes);
router.use('/student', studentRoute);
router.use('/auth', authRoute);
router.use('/product', productRoute);
router.use('/program', programRoute);
router.use('/department', DepartmentRoute);
router.use('/cart', cartRoute);
router.use('/order', orderRoute);
router.use('/inventory', inventoryRoute);
router.use('/dashboard', DashboardRoute);
router.use('/sales', SalesRoute);
router.use('/notification', NotificationRoute);
router.use('/role', RoleRoute);
router.use('/log', LogRoute);

export default router;
