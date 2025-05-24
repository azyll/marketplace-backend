// @ts-check
import {AlreadyExistException} from '../exceptions/alreadyExist.js';
import {DepartmentService} from '../services/department.service.js';

/**
 * @typedef {import('../types/index.js').QueryParams} QueryParams
 *
 */
/**
 *  Create Department
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<import('express').Response>}
 */
export const createDepartment = async (req, res) => {
  const {name} = req.body;
  try {
    const program = await DepartmentService.createDepartment(name);
    return res.status(200).json(program);
  } catch (error) {
    if (error instanceof AlreadyExistException) {
      return res.status(error.statusCode).json({message: error.message || 'Error', error});
    }
    return res.status(200).json({type: 'error', error: error});
  }
};

/**
 * Archive/Disable/Delete Department
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<import('express').Response>}
 */
export const archiveDepartment = async (req, res) => {
  const {programId} = req.params;
  try {
    const program = await DepartmentService.archiveDepartment(programId);
    return res.status(200).json(program);
  } catch (error) {
    if (error instanceof AlreadyExistException) {
      return res.status(error.statusCode).json({message: error.message || 'Error', error});
    }
    return res.status(200).json({type: 'error', error: error});
  }
};

/**
 * Update/Edit/Modify Department
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<import('express').Response>}
 */
export const updateDepartment = async (req, res) => {
  const {newProgram} = req.body;
  const {programId} = req.params;

  try {
    const program = await DepartmentService.updateDepartment(programId, newProgram);
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

export const getDepartments = async (req, res) => {
  const query = req.query;
  try {
    const program = await DepartmentService.getDepartments();
    return res.status(200).json({message: 'success', result: program});
  } catch (error) {
    if (error instanceof AlreadyExistException) {
      return res.status(error.statusCode).json({message: error.message || 'Error', error});
    }
    return res.status(200).json({type: 'error', error: error});
  }
};
