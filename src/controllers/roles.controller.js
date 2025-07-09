//@ts-check
import {AlreadyExistException} from '../exceptions/alreadyExist.js';
import {NotFoundException} from '../exceptions/notFound.js';
import {UnauthorizedException} from '../exceptions/unauthorized.js';
import {RoleService} from '../services/role.service.js';
import {defaultErrorMessage} from '../utils/error-message.js';

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<import('express').Response>}
 */
export const createRole = async (req, res) => {
  try {
    const role = await RoleService.createRole(req.body);
    return res.status(200).json({message: 'Fetch Role Successfully', result: role});
  } catch (error) {
    return res.status(400).json({
      message: 'Failed to create role',
      error
    });
  }
};

/**
 * Archive/Disable/Delete Role
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<import('express').Response>}
 */
export const archiveRole = async (req, res) => {
  const {roleId} = req.params;
  try {
    const program = await RoleService.archiveRole(roleId);
    return res.status(200).json(program);
  } catch (error) {
    const message = 'Failed to archive role';
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
export const updateRoles = async (req, res) => {
  const {newProgram} = req.body;
  const {programId} = req.params;

  try {
    const program = await RoleService.updateRole(programId, newProgram);
    return res.status(200).json(program);
  } catch (error) {
    const message = 'Failed to update role';
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
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<import('express').Response>}
 */

export const getRoles = async (req, res) => {
  try {
    const program = await RoleService.getRoles();
    return res.status(200).json({message: 'success', result: program});
  } catch (error) {
    const message = 'Failed to get roles';
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

