import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { impactCalculatorService } from '../services/impactCalculatorService.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const ImpactInputSchema = z.object({
  carpoolDaysPerWeek: z.number().min(0).max(7).default(2),
  heatingTempDropDegC: z.number().min(0).max(6).default(1.5),
  diyFilterActive: z.boolean().default(true),
  transitShift: z.boolean().default(false),
  commuteDistanceKm: z.number().min(0).max(200).optional().default(16),
  outdoorPm25: z.number().min(0).max(1000).optional().default(150),
  familySize: z.number().min(1).max(12).optional().default(3),
});

/**
 * Controller executing mathematical health & emission impact models
 */
export class ImpactController {
  public static calculateImpact(req: Request, res: Response, next: NextFunction): void {
    try {
      const validated = ImpactInputSchema.parse(req.body);
      const calculation = impactCalculatorService.calculateImpact(validated);
      sendSuccess(res, calculation);
    } catch (err) {
      next(err);
    }
  }
}
