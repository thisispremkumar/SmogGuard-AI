import { Router } from 'express';
import { IndoorAirController } from '../controllers/indoorAirController.js';

const router = Router();

router.get('/', IndoorAirController.getAllHacks);
router.get('/:id', IndoorAirController.getHackById);

export default router;
