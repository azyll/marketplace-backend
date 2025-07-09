// @ts-check
import {AlreadyExistException} from '../exceptions/alreadyExist.js';
import {NotFoundException} from '../exceptions/notFound.js';
import {UnauthorizedException} from '../exceptions/unauthorized.js';
import {ProgramService} from '../services/program.service.js';
import {defaultErrorMessage} from '../utils/error-message.js';

/**
 * @typedef {import('../types/index.js').QueryParams} QueryParams
 *
 */
/**
 *  Create Program
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<import('express').Response>}
 */
export const createProgram = async (req, res) => {
  const {name, departmentId} = req.body;
  try {
    await ProgramService.createProgram(name, departmentId);
    return res.status(200).json({message: 'Program create successfully'});
  } catch (error) {
    const message = 'Failed to create program';
    if (
      error instanceof NotFoundException ||
      error instanceof AlreadyExistException ||
      error instanceof UnauthorizedException
    ) {
      return res.status(error.statusCode).json({message, error: error.message});
    }
    return res.status(400).json({message, error: error.message || defaultErrorMessage});
  }
};

/**
 * Archive/Disable/Delete Program
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<import('express').Response>}
 */
export const archiveProgram = async (req, res) => {
  const {programId} = req.params;
  try {
    await ProgramService.archiveProgram(programId);
    return res.status(200).json({message: 'Program deleted successfully'});
  } catch (error) {
    const message = 'Failed to delete program';
    if (
      error instanceof NotFoundException ||
      error instanceof AlreadyExistException ||
      error instanceof UnauthorizedException
    ) {
      return res.status(error.statusCode).json({message, error: error.message});
    }
    return res.status(400).json({message, error: error.message || defaultErrorMessage});
  }
};

/**
 * Update/Edit/Modify Program
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<import('express').Response>}
 */
export const updateProgram = async (req, res) => {
  const {newProgram} = req.body;
  const {programId} = req.params;

  try {
    await ProgramService.updateProgram(programId, newProgram);
    return res.status(200).json({message: 'Program update successfully'});
  } catch (error) {
    const message = 'Failed to update program';
    if (
      error instanceof NotFoundException ||
      error instanceof AlreadyExistException ||
      error instanceof UnauthorizedException
    ) {
      return res.status(error.statusCode).json({message, error: error.message});
    }
    return res.status(400).json({message, error: error.message || defaultErrorMessage});
  }
};

/**
 * Get all program
 * @param {import('express').Request<{},{},{},QueryParams>} req
 * @param {import('express').Response} res
 * @returns {Promise<import('express').Response>}
 */

export const getPrograms = async (req, res) => {
  try {
    const program = await ProgramService.getPrograms();
    return res.status(200).json({message: 'Program retrieve successfully', result: program});
  } catch (error) {
    const message = 'Failed to get programs';
    if (
      error instanceof NotFoundException ||
      error instanceof AlreadyExistException ||
      error instanceof UnauthorizedException
    ) {
      return res.status(error.statusCode).json({message, error: error.message});
    }
    return res.status(400).json({message, error: error.message || defaultErrorMessage});
  }
};
