// @ts-check

import {ActivityLogService} from '../services/activity-log.service.js';

/**
 *  Create Log
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<import('express').Response>}
 */
export const createLog = async (req, res) => {
  const {title, content, type} = req.body;
  try {
    const program = await ActivityLogService.createLog(title, content, type);
    return res.status(200).json(program);
  } catch (error) {
    return res.status(error.statusCode || 400).json({message: error.message || 'Error', error});
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
    return res.status(200).json({message: 'success', result: logs});
  } catch (error) {
    return res.status(error.statusCode || 400).json({message: error.message || 'Error', error});
  }
};
