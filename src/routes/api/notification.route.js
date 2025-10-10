import {Router} from 'express';
import {NotificationService} from '../../services/notification.service.js';
import {
  getNotifications,
  updateAllNotification,
  updateNotification
} from '../../controllers/notification.controller.js';
import {auth} from '../../middleware/auth.js';

const route = Router();
//Get User Notification
route.get(
  '/:userId',
  auth(['admin', 'employee', 'student'], {
    selfOnly: {
      param: 'userId',
      roles: ['admin', 'employee', 'student']
    }
  }),
  getNotifications
);

//Update all user notification status
route.put(
  '/:userId/all',
  auth(['admin', 'employee', 'student'], {
    selfOnly: {
      param: 'userId',
      roles: ['admin', 'employee', 'student']
    }
  }),
  updateAllNotification
);
//Update user notification status
route.put(
  '/:userId',
  auth(['admin', 'employee', 'student'], {
    selfOnly: {
      param: 'userId',
      roles: ['admin', 'employee', 'student']
    }
  }),
  updateNotification
);
export default route;

