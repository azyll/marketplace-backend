import {Router} from 'express';
import {NotificationService} from '../../services/notification.service.js';
import {
  getNotifications,
  updateAllNotification,
  updateNotification
} from '../../controllers/notification.controller.js';

const route = Router();
//Get User Notification
route.get('/:userId', getNotifications);

//Update all user notification status
route.put('/:userId/all', updateAllNotification);
//Update user notification status
route.put('/:userId', updateNotification);
export default route;

