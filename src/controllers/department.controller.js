import {AlreadyExistException} from '../exceptions/alreadyExist.js';
import {NotFoundException} from '../exceptions/notFound.js';
import {UnauthorizedException} from '../exceptions/unauthorized.js';
import {DepartmentService} from '../services/department.service.js';
import {defaultErrorMessage} from '../utils/error-message.js';

export const createDepartment = async (req, res) => {
  const {name} = req.body;
  try {
    await DepartmentService.createDepartment(name);
    return res.status(200).json({message: 'Department creation successful'});
  } catch (error) {
    const message = 'Failed to create department';
    if (error instanceof AlreadyExistException || error instanceof UnauthorizedException) {
      return res.status(error.statusCode).json({message, error: error.message});
    }
    return res.status(400).json({message, error: error.message || defaultErrorMessage});
  }
};

export const archiveDepartment = async (req, res) => {
  const {departmentId} = req.params;
  try {
    await DepartmentService.archiveDepartment(departmentId);
    return res.status(200).json({message: 'Department deletion successful'});
  } catch (error) {
    const message = 'Failed to delete department';
    if (error instanceof NotFoundException || error instanceof UnauthorizedException) {
      return res.status(error.statusCode).json({message, error: error.message});
    }
    return res.status(400).json({message, error: error.message || defaultErrorMessage});
  }
};

export const updateDepartment = async (req, res) => {
  const {newProgram} = req.body;
  const {departmentId} = req.params;

  try {
    await DepartmentService.updateDepartment(departmentId, newProgram);
    return res.status(200).json({message: 'Department update successful'});
  } catch (error) {
    const message = 'Failed to update department';
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

export const getDepartments = async (req, res) => {
  const query = req.query;
  try {
    const department = await DepartmentService.getDepartments();
    return res.status(200).json({message: 'Department retrieve successful', data: department});
  } catch (error) {
    const message = 'Failed to get departments';
    if (error instanceof NotFoundException || error instanceof UnauthorizedException) {
      return res.status(error.statusCode).json({message, error: error.message});
    }
    return res.status(400).json({message, error: error.message || defaultErrorMessage});
  }
};
