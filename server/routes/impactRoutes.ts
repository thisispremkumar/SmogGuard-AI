import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { impactCalculatorService } from '../services/impactCalculatorService.js';

const router = Router();

const ImpactInputSchema = z.object({
  carpoolDaysPerWeek: z.number().min(0).max(7).default(2),
  heatingTempDropDegC: z.number().min(0).max(6).default(1.5),
  diyFilterActive: z.boolean().default(true),
  transitShift: z.boolean().default(false),
  commuteDistanceKm: z.number().min(0).max(200).optional().default(16),
  outdoorPm25: z.number().min(0).max(1000).optional().default(150),
  familySize: z.number().min(1).max(12).optional().default(3),
});

router.post('/calculate', (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = ImpactInputSchema.parse(req.body);
    const result = impactCalculatorService.calculateImpact(validated);
    res.json({ status: 'success', data: result });
  } catch (err) {
    next(err);
  }
});

export default router;

