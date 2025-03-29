import {AlreadyExistException} from '../exceptions/alreadyExist.js';
import {ProgramService} from '../services/program.service.js';
export const createProgram = async (req, res) => {
  const {name} = req.body;
  try {
    const program = await ProgramService.createProgram(name);
    res.status(200).json(program);
  } catch (error) {
    if (error instanceof AlreadyExistException) {
      return res.status(error.statusCode).json({message: error.message | 'Error', error});
    }
    res.status(200).json({type: 'error', error: error.message});
  }
};
