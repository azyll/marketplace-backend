// @ts-check

import {AlreadyExistException} from '../exceptions/alreadyExist.js';
import {NotFoundException} from '../exceptions/notFound.js';
import {UnauthorizedException} from '../exceptions/unauthorized.js';
import {ActivityLogService} from '../services/activity-log.service.js';
import {defaultErrorMessage} from '../utils/error-message.js';

/**
 *  Create Log
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<import('express').Response>}
 */
export const createLog = async (req, res) => {
  const {title, content, type} = req.body;
  try {
    await ActivityLogService.createLog(title, content, type);
    return res.status(200).json({message: 'Log created successfully'});
  } catch (error) {
    const message = 'Failed to add activity log';
    if (error instanceof UnauthorizedException) {
      return res.status(error.statusCode).json({message, error: error.message});
    }
    return res.status(400).json({message, error: error.message || defaultErrorMessage});
  }
};

/**
 * Get all program
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<import('express').Response>}
 */

export const getLogs = async (req, res) => {
  try {
    const logs = await ActivityLogService.getLogs();
    return res.status(200).json({message: 'Log retrieve successfully', data: logs});
  } catch (error) {
    const message = 'Failed to get activity logs';
    if (error instanceof NotFoundException || error instanceof UnauthorizedException) {
      return res.status(error.statusCode).json({message, error: error.message});
    }
    return res.status(400).json({message, error: error.message || defaultErrorMessage});
  }
};
