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
    return res.status(200).json({message: 'Fetch Role Successfully', data: role});
  } catch (error) {
    return res.status(400).json({
      message: 'Failed to create role',
      error: error instanceof Error ? error.message : String(error)
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
 * Archive/Disable/Delete Role
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<import('express').Response>}
 */
export const restoreRole = async (req, res) => {
  const {roleId} = req.params;
  console.log(roleId);
  try {
    const program = await RoleService.restoreRole(roleId);
    return res.status(200).json(program);
  } catch (error) {
    console.log(error);
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
  const {roleId} = req.params;

  try {
    const role = await RoleService.updateRole(roleId, req.body);
    return res.status(200).json(role);
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
    const program = await RoleService.getRoles(req.query);
    return res.status(200).json({message: 'success', ...program});
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

/**
 * Get all program
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<import('express').Response>}
 */

export const getRole = async (req, res) => {
  try {
    const program = await RoleService.getRoles(req.query);
    return res.status(200).json({message: 'success', ...program});
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

/**
 * Get all program
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<import('express').Response>}
 */

export const getRoleById = async (req, res) => {
  try {
    const {roleId} = req.params;
    const role = await RoleService.getRoleById(roleId);
    return res.status(200).json(role);
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

