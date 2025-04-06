// @ts-check
import {UnauthorizedException} from '../exceptions/unauthorized.js';
import jwt from 'jsonwebtoken';
import {DB} from '../database/index.js';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRED = process.env.JWT_EXPIRED ?? '1d';

export class AuthService {
  /**
   * User login
   * @param {string} email - user email
   * @param {string} password - user password
   * @returns {Promise<string>} jwt token with user data as payload
   */
  static async login(email, password) {
    const user = await DB.User.scope('withPassword').findOne({
      where: {email},
      include: [{model: DB.Role, as: 'role'}]
    });

    if (!user) throw new UnauthorizedException('Invalid Credentials');

    const isValid = await user.authenticate(password);

    if (!isValid) throw new UnauthorizedException('Invalid Credentials');

    return jwt.sign({id: user.id, email: user.email, roleSystemTag: user.role.systemTag}, JWT_SECRET, {
      expiresIn: JWT_EXPIRED
    });
  }
  /**
   *
   * @param {string} token
   * @returns {Promise<object>} token payload
   */
  static async verifyToken(token) {
    const accessToken = token.split(' ')[1];

    return jwt.verify(accessToken, JWT_SECRET);
  }

  static async logout() {}
}
