// @ts-check
import {AlreadyExistException} from '../exceptions/alreadyExist.js';
import {NotFoundException} from '../exceptions/notFound.js';
import {StudentService} from '../services/student.service.js';

/**
 *  Create Student
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<import('express').Response>}
 */
export const createStudent = async (req, res) => {
  try {
    const {userId} = req.params;
    const payload = req.body;

    const student = await StudentService.createStudent(userId, payload);

    return res.status(200).json(student);
  } catch (err) {
    const message = 'Failed to create student';

    if (err instanceof NotFoundException) {
      return res.status(err.statusCode).json({
        message,
        error: err.message
      });
    }
    if (err instanceof AlreadyExistException) {
      return res.status(err.statusCode).json({message: err.message || 'err', err});
    }

    return res.status(400).json({
      message,
      error: err
    });
  }
};

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<import('express').Response>}
 */
export const getStudentByUserId = async (req, res) => {
  try {
    const {userId} = req.params;

    const student = await StudentService.getStudentByUserId(userId);

    return res.status(200).json(student);
  } catch (err) {
    const message = 'Failed to get student';

    if (err instanceof NotFoundException) {
      return res.status(err.statusCode).json({
        message,
        error: err.message
      });
    }

    return res.status(400).json({
      message,
      error: err
    });
  }
};
