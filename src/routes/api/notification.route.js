import {Router} from 'express';
import {NotificationService} from '../../services/notification.service.js';
import {
  getNotifications,
  updateAllNotification,
  updateNotification
} from '../../controllers/notification.controller.js';

const route = Router();

route.get('/:userId', getNotifications);

route.put('/:userId/all', updateAllNotification);
route.put('/:userId', updateNotification);
export default route;

