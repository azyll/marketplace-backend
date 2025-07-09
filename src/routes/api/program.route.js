import {Router} from 'express';

import {archiveProgram, createProgram, getPrograms, updateProgram} from '../../controllers/program.controller.js';

const router = Router();

// Create Program
router.post('/', createProgram);

// Get Program
router.get('/', getPrograms);

// Update Program
router.put('/', updateProgram);

// Delete Program
router.delete('/', archiveProgram);

export default router;
