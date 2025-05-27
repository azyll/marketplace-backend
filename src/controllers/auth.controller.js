// @ts-check
import {AuthService} from '../services/auth.service.js';
import {UnauthorizedException} from '../exceptions/unauthorized.js';

/**
 * User login
 * @param {import('express').Request<{},{},{email:string,password:string}>} req
 * @param {import('express').Response} res
 * @returns {Promise<import('express').Response|undefined>} Response Object
 */
export const login = async (req, res) => {
  try {
    const {email, password} = req.body;
    const accessToken = await AuthService.login(email, password);
    res.status(200).json({accessToken});
  } catch (err) {
    const message = 'Failed to login';
    if (err instanceof UnauthorizedException) {
      return res.status(err.statusCode).json({
        message,
        error: err.message
      });
    }

    return res.status(400).json({
      message,
      error: err.message
    });
  }
};

/**
 * User Logout
 * @param {import('express').Request<{},{},{email:string,password:string}>} req
 * @param {import('express').Response} res
 * @returns {Promise<import('express').Response|undefined>} Response Object
 */
export const logout = async (req, res) => {
  try {
    await AuthService.logout();
  } catch (error) {
    return res.send(400).json('logout failed');
  }
};
