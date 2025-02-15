import { DB } from "../database/index.js";

export class ProgramService {
  static async createProgram(programName) {
    const result = DB.Program.create({ name: programName });
    return result;
  }
}
