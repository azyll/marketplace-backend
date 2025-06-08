// @ts-check
import {AlreadyExistException} from '../exceptions/alreadyExist.js';
import {ProgramService} from '../services/program.service.js';

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
    const program = await ProgramService.createProgram(name, departmentId);
    return res.status(200).json(program);
  } catch (error) {
    if (error instanceof AlreadyExistException) {
      return res.status(error.statusCode).json({message: error.message || 'Error', error});
    }
    return res.status(error.statusCode || 400).json({message: error.message || 'Error', error});
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
    const program = await ProgramService.archiveProgram(programId);
    return res.status(200).json(program);
  } catch (error) {
    if (error instanceof AlreadyExistException) {
      return res.status(error.statusCode).json({message: error.message || 'Error', error});
    }
    return res.status(200).json({type: 'error', error: error});
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
    const program = await ProgramService.updateProgram(programId, newProgram);
    return res.status(200).json(program);
  } catch (error) {
    if (error instanceof AlreadyExistException) {
      return res.status(error.statusCode).json({message: error.message || 'Error', error});
    }
    return res.status(200).json({type: 'error', error: error});
  }
};

/**
 * Get all program
 * @param {import('express').Request<{},{},{},QueryParams>} req
 * @param {import('express').Response} res
 * @returns {Promise<import('express').Response>}
 */

export const getPrograms = async (req, res) => {
  const query = req.query;
  try {
    const program = await ProgramService.getPrograms(query);
    return res.status(200).json({message: 'success', result: program});
  } catch (error) {
    if (error instanceof AlreadyExistException) {
      return res.status(error.statusCode).json({message: error.message || 'Error', error});
    }
    return res.status(200).json({type: 'error', error: error});
  }
};
