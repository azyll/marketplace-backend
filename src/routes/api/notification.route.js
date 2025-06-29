import {Router} from 'express';
import {NotificationService} from '../../services/notification.service.js';

const route = Router();

route.get('/:id', async (req, res) => {
  try {
    const {id} = req.params;
    const notifications = await NotificationService.getNotifications(id);
    return res.status(200).json({message: 'notifications', notifications});
  } catch (error) {
    return res.status(error.statusCode || 400).json({message: error.message || 'Error', error});
  }
});

route.put('/:id/all', async (req, res) => {
  try {
    const {id} = req.params;
    const notifications = await NotificationService.updateNotificationAsRead(id, undefined, true);
    return res.status(200).json({message: 'notifications', notifications});
  } catch (error) {
    return res.status(error.statusCode || 400).json({message: error.message || 'Error', error});
  }
});
route.put('/:id', async (req, res) => {
  try {
    const {id} = req.params;
    const {notificationId} = req.query;
    const notifications = await NotificationService.updateNotificationAsRead(id, notificationId);
    return res.status(200).json({message: 'notifications', notifications});
  } catch (error) {
    return res.status(error.statusCode || 400).json({message: error.message || 'Error', error});
  }
});
export default route;

