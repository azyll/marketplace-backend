import { ProgramService } from "../services/program.service.js";
export const createProgram = async (req, res) => {
  const { name } = req.body;

  try {
    const program = await ProgramService.createProgram(name);
    res.status(200).json({ type: "successful", program });
  } catch (error) {
    res.status(200).json({ type: "error", error });
  }
};
