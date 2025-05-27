// @ts-check
import {UserService} from '../services/user.service.js';
import {NotFoundException} from '../exceptions/notFound.js';

/**
 * @typedef {import('../types/index.js').QueryParams} QueryParams
 */

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<import('express').Response>}
 */
export const getUser = async (req, res) => {
  try {
    const {userId} = req.params;

    const user = await UserService.getUser(userId);

    return res.status(200).json(user);
  } catch (err) {
    if (err instanceof NotFoundException) {
      return res.status(err.statusCode).json({
        message: 'Failed to fetch user',
        error: err.message
      });
    }
    return res.status(400).json({
      message: 'Failed to fetch user',
      error: err
    });
  }
};

/**
 * @param {import('express').Request<{},{},{},QueryParams>} req
 * @param {import('express').Response} res
 * @returns {Promise<import('express').Response>}
 */
export const getAllUsers = async (req, res) => {
  try {
    const query = req.query;
    const users = await UserService.getUsers(query);

    return res.status(200).json(users);
  } catch (err) {
    return res.status(400).json({
      message: 'Failed to fetch users',
      error: err
    });
  }
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<import('express').Response>}
 */
export const addUser = async (req, res) => {
  try {
    const payload = req.body;

    const user = await UserService.addUser(payload);

    return res.status(201).json(user);
  } catch (err) {
    return res.status(400).json({
      message: 'User creation unsuccessful',
      error: err
    });
  }
};

/**
 * @param {import('express').Request<{userId:string},{},{firstName:string,lastName:string,email:string,password:string}>} req
 * @param {import('express').Response} res
 * @returns {Promise<import('express').Response>}
 */
export const updateUser = async (req, res) => {
  try {
    const {userId} = req.params;
    const payload = req.body;

    const newUser = await UserService.updateUser(userId, payload);

    return res.status(200).json(newUser);
  } catch (err) {
    return res.status(400).json({
      message: 'Failed to edit user',
      error: err
    });
  }
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<import('express').Response>}
 */
export const archiveUser = async (req, res) => {
  try {
    const {userId} = req.params;

    const user = await UserService.archiveUser(userId);

    return res.status(200).json(user);
  } catch (err) {
    return res.status(400).json({
      message: 'User cannot be deleted',
      error: err
    });
  }
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<import('express').Response>}
 */
export const restoreUser = async (req, res) => {
  try {
    const {userId} = req.params;

    const user = await UserService.restoreUser(userId);

    return res.status(200).json(user);
  } catch (err) {
    return res.status(400).json({
      message: 'User cannot be restored',
      error: err
    });
  }
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<import('express').Response>}
 */
export const updatePassword = async (req, res) => {
  try {
    const {userId} = req.params;
    const payload = req.body;

    const user = await UserService.updatePassword(userId, payload);

    return res.status(200).json(user);
  } catch (err) {
    if (err instanceof NotFoundException) {
      return res.status(err.statusCode).json({
        message: 'Failed to update password',
        error: err.message
      });
    }

    return res.status(400).json({
      message: 'Failed to update password',
      error: err
    });
  }
};
/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<import('express').Response>}
 */
export const createRole = async (req, res) => {
  try {
    const role = await UserService.createRole(req.body);
    return res.status(200).json(role);
  } catch (error) {
    return res.status(400).json({
      message: 'Failed to create role',
      error
    });
  }
};
