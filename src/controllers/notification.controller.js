import {NotificationService} from '../services/notification.service.js';

export const getNotifications = async (req, res) => {
  try {
    const {id} = req.params;
    const result = await NotificationService.getNotifications(id, req.query);
    return res.status(200).json({message: 'notifications', result});
  } catch (error) {
    return res.status(error.statusCode || 400).json({message: error.message || 'Error', error});
  }
};

export const updateAllNotification = async (req, res) => {
  try {
    const {id} = req.params;
    const notifications = await NotificationService.updateNotificationAsRead(id, undefined, true);
    return res.status(200).json({message: 'notifications', notifications});
  } catch (error) {
    return res.status(error.statusCode || 400).json({message: error.message || 'Error', error});
  }
};

export const updateNotification = async (req, res) => {
  try {
    const {id} = req.params;
    const {notificationId} = req.query;
    const notifications = await NotificationService.updateNotificationAsRead(id, notificationId);
    return res.status(200).json({message: 'notifications', notifications});
  } catch (error) {
    return res.status(error.statusCode || 400).json({message: error.message || 'Error', error});
  }
};

