import { UserService } from "../services/user.service.js";
import { NotFoundException } from "../exceptions/notFound.js";

export const getUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await UserService.getUser(userId);

    res.status(200).json(user);
  } catch (err) {
    if (err instanceof NotFoundException) {
      return res.status(err.statusCode).json({
        message: "Failed to fetch user",
        error: err.message,
      });
    }

    res.status(400).json({
      message: "Failed to fetch user",
      error: err.message,
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const query = req.query;

    const users = await UserService.getUsers(query);

    res.json(users);
  } catch (err) {
    res.status(400).json({
      message: "Failed to fetch users",
      error: err.message,
    });
  }
};

export const addUser = async (req, res) => {
  try {
    const payload = req.body;

    const user = await UserService.addUser(payload);

    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({
      message: "User creation unsuccessful",
      error: err.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const payload = req.body;

    const newUser = await UserService.updateUser(userId, payload);

    res.status(200).json(newUser);
  } catch (err) {
    res.status(400).json({
      message: "Failed to edit user",
      error: err.message,
    });
  }
};

export const archiveUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await UserService.archiveUser(userId);

    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({
      message: "User cannot be deleted",
      error: err.message,
    });
  }
};

export const restoreUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await UserService.restoreUser(userId);

    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({
      message: "User cannot be restored",
      error: err.message,
    });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { userId } = req.params;
    const payload = req.body;

    const user = await UserService.updatePassword(userId, payload);

    res.status(200).json(user);
  } catch (err) {
    if (err instanceof NotFoundException) {
      return res.status(err.statusCode).json({
        message: "Failed to update password",
        error: err.message,
      });
    }

    res.status(400).json({
      message: "Failed to update password",
      error: err.message,
    });
  }
};
