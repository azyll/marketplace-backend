// @ts-check
import {AlreadyExistException} from '../exceptions/alreadyExist.js';
import {ProgramService} from '../services/program.service.js';

/**
 * POST => Create Product
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<import('express').Response>}
 */
export const createProgram = async (req, res) => {
  const {name} = req.body;
  try {
    const program = await ProgramService.createProgram(name);
    return res.status(200).json(program);
  } catch (error) {
    if (error instanceof AlreadyExistException) {
      return res.status(error.statusCode).json({message: error.message || 'Error', error});
    }
    return res.status(200).json({type: 'error', error: error});
  }
};
