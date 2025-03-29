// @ts-check
import {DB} from '../database/index.js';
import {AlreadyExistException} from '../exceptions/alreadyExist.js';

const {Program} = DB;
export class ProgramService {
  /**
   *
   * @param {string} name - program name
   * @returns {Promise<Program>} data from the database
   * @throws {AlreadyExistException} if the program is already exists
   */
  static async createProgram(name) {
    const [program, isJustCreated] = await Program.findOrCreate({
      where: {name}
    });

    if (!isJustCreated) {
      throw new AlreadyExistException('This program is already exists');
    }

    return program;
  }
}
