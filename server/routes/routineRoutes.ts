import { Router } from 'express';
import { RoutineController } from '../controllers/routineController.js';

const router = Router();

router.post('/generate', RoutineController.generatePlan);

export default router;
