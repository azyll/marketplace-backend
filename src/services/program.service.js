import { DB } from "../database/index.js";
import { AlreadyExistException } from "../exceptions/alreadyExist.js";

export class ProgramService {
  static async createProgram(name) {
    const program = await DB.Program.findOne({
      where: { name },
    });
    if (program) {
      throw new AlreadyExistException("This program is already exists");
    }

    return await DB.Program.create({ name });
  }
}
