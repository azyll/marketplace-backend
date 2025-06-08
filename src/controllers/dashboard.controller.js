import {NotFoundException} from '../exceptions/notFound.js';
import {NotificationService} from '../services/notification.service.js';

/**
 * Update Student
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns
 */
export const getDashboard = async (req, res) => {
  try {
    const notifications = await NotificationService.getNotifications('a211be73-084e-4760-a056-092343a30675');
    return res.status(200).json({message: 'notifications', notifications});
  } catch (error) {
    return res.status(error.statusCode).json({message: error.message || 'Error', error});
  }
};
