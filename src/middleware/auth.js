import {AuthService} from '../services/auth.service.js';

export const SYSTEM_TAG = ['student', 'admin', 'employee'];

/**
 * @typedef SelfOnlyOptions
 * @property {string} param
 * @property {("student" | "admin" | "employee")[]} roles
 */

/**
 * @typedef AuthenticationOptions
 * @property {SelfOnlyOptions} selfOnly
 */

/**
 * User Authentication
 * @param {("student" | "admin" | "employee")[]} roles
 * @param {AuthenticationOptions=} options
 */
export const auth = (roles, options) => {
  return async (req, res, next) => {
    try {
      const accessToken = req.headers.authorization;

      if (!accessToken)
        return res.status(401).json({
          message: 'Unauthorized'
        });

      const user = await AuthService.verifyToken(accessToken);

      if (!roles.includes(user.roleSystemTag)) {
        return res.status(401).json({
          message: 'Unauthorized'
        });
      }

      if (options?.selfOnly && options?.selfOnly?.param && options?.selfOnly?.roles?.length > 0) {
        const selfOnlyRoles = options.selfOnly.roles;
        const selfOnlyParam = options.selfOnly.param;

        const isSameId = user.id === req.params[selfOnlyParam];

        if (selfOnlyRoles.includes(user.roleSystemTag) && !isSameId) {
          return res.status(401).json({
            message: 'Unauthorized'
          });
        }
      }

      req.user = user;

      next();
    } catch (error) {
      return res.status(400).json({
        message: 'Invalid Request',
        error
      });
    }
  };
};
