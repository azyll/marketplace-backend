import {Router} from 'express';
import {NotificationService} from '../../services/notification.service.js';
import {
  getNotifications,
  updateAllNotification,
  updateNotification
} from '../../controllers/notification.controller.js';

const route = Router();

route.get('/:id', getNotifications);

route.put('/:id/all', updateAllNotification);
route.put('/:id', updateNotification);
export default route;

