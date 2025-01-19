import { AuthService } from "../services/auth.service.js";
import { UnauthorizedException } from "../exceptions/unauthorized.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const accessToken = await AuthService.login(email, password);

    res.status(200).json({ accessToken });
  } catch (err) {
    const message = "Failed to login";

    if (err instanceof UnauthorizedException) {
      return res.status(err.statusCode).json({
        message,
        error: err.message,
      });
    }

    res.status(400).json({
      message,
      error: err.message,
    });
  }
};
