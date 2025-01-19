import { UnauthorizedException } from "../exceptions/unauthorized.js";
import jwt from "jsonwebtoken";
import { DB } from "../database/index.js";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRED = process.env.JWT_EXPIRED ?? "1d";

export class AuthService {
  static async login(email, password) {
    const user = await DB.User.scope("withPassword").findOne({
      where: { email },
      include: [
        {
          as: "role",
          model: DB.Role,
        },
      ],
    });

    if (!user) throw new UnauthorizedException("Invalid Credentials");

    const isValid = await user.authenticate(password);

    if (!isValid) throw new UnauthorizedException("Invalid Credentials");

    return jwt.sign(
      { id: user.id, email: user.email, roleSystemTag: user.role.systemTag },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRED,
      },
    );
  }

  static async verifyToken(token) {
    const accessToken = token.split(" ")[1];

    return jwt.verify(accessToken, JWT_SECRET);
  }
}
