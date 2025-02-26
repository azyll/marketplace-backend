import { NotFoundException } from "../exceptions/notFound.js";
import { OrderService } from "../services/order.service.js";
import { StudentService } from "../services/student.service.js";

export const createStudent = async (req, res) => {
  try {
    const { userId } = req.params;
    const payload = req.body;

    const student = await StudentService.createStudent(userId, payload);

    res.status(200).json(student);
  } catch (err) {
    const message = "Failed to create student";

    if (err instanceof NotFoundException) {
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

export const getStudentByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const student = await StudentService.getStudentByUserId(userId);

    res.status(200).json(student);
  } catch (err) {
    const message = "Failed to get student";

    if (err instanceof NotFoundException) {
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
