import {Router} from 'express';

import {archiveProgram, createProgram, getPrograms, updateProgram} from '../../controllers/program.controller.js';

const router = Router();

// Create Program
router.post('/', createProgram);
router.get('/', getPrograms);
router.put('/', updateProgram);
router.delete('/', archiveProgram);

export default router;
