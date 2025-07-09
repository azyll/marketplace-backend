//@ts-check
import {AlreadyExistException} from '../exceptions/alreadyExist.js';
import {NotFoundException} from '../exceptions/notFound.js';
import {UnauthorizedException} from '../exceptions/unauthorized.js';
import {NotificationService} from '../services/notification.service.js';
import {defaultErrorMessage} from '../utils/error-message.js';

export const getNotifications = async (req, res) => {
  try {
    const {userId} = req.params;
    const result = await NotificationService.getNotifications(userId, req.query);
    return res.status(200).json({message: 'Notifications retrieve successfully', ...result});
  } catch (error) {
    const message = 'Failed to get notifications';
    if (error instanceof NotFoundException || error instanceof UnauthorizedException) {
      return res.status(error.statusCode).json({message, error: error.message});
    }
    return res.status(400).json({message, error: error.message || defaultErrorMessage});
  }
};

export const updateAllNotification = async (req, res) => {
  try {
    const {userId} = req.params;
    const notifications = await NotificationService.updateNotificationAsRead(userId, undefined, true);
    return res.status(200).json({message: 'All notifications update successfully', notifications});
  } catch (error) {
    const message = 'Failed to update notification';
    if (error instanceof NotFoundException || error instanceof UnauthorizedException) {
      return res.status(error.statusCode).json({message, error: error.message});
    }
    return res.status(400).json({message, error: error.message || defaultErrorMessage});
  }
};

export const updateNotification = async (req, res) => {
  try {
    const {userId} = req.params;
    const {notificationId} = req.query;
    const notifications = await NotificationService.updateNotificationAsRead(userId, notificationId);
    return res.status(200).json({message: 'Notifications update successfully', notifications});
  } catch (error) {
    const message = 'Failed to update notification';
    if (error instanceof NotFoundException || error instanceof UnauthorizedException) {
      return res.status(error.statusCode).json({message, error: error.message});
    }
    return res.status(400).json({message, error: error.message || defaultErrorMessage});
  }
};

