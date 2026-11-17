import { Router } from 'express';
import { ImpactController } from '../controllers/impactController.js';

const router = Router();

router.post('/calculate', ImpactController.calculateImpact);

export default router;
