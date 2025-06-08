import {Router} from 'express';
import {getInventory} from '../../controllers/inventory.controller.js';

const router = Router();

//Get Inventory
router.get('/', getInventory);

export default router;
