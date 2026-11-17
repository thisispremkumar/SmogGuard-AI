import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { routinePlannerService } from '../services/routinePlannerService.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { FamilyProfile } from '../types/index.js';

export const FamilyProfileSchema = z.object({
  id: z.string().optional().default('default-fam'),
  name: z.string().min(1).max(100).default('My Family'),
  vulnerableMembers: z.array(z.enum(['infant', 'asthmatic', 'elderly', 'pregnant', 'heart_condition'])).default([]),
  commuteMode: z.enum(['public_transit', 'car_solo', 'carpool', 'cycling', 'walking', 'work_from_home']).default('car_solo'),
  commuteDistanceKm: z.number().min(0).max(200).default(15),
  heatingType: z.enum(['district_heat', 'heat_pump', 'natural_gas', 'wood_biomass', 'electric_resistance']).default('natural_gas'),
  cookingFuel: z.enum(['induction', 'gas_stove', 'electric']).default('gas_stove'),
  hasAirPurifier: z.boolean().default(false),
  homeType: z.enum(['apartment', 'detached_house', 'sealed_modern', 'older_leaky']).default('apartment'),
  locationName: z.string().min(1).max(100).optional().default('New Delhi'),
});

/**
 * Controller orchestrating personalized winter smog family schedules
 */
export class RoutineController {
  public static async generatePlan(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = FamilyProfileSchema.parse(req.body);
      const locationName = validated.locationName || 'New Delhi';

      const profile: FamilyProfile = {
        id: validated.id,
        name: validated.name,
        vulnerableMembers: validated.vulnerableMembers,
        commuteMode: validated.commuteMode,
        commuteDistanceKm: validated.commuteDistanceKm,
        heatingType: validated.heatingType,
        cookingFuel: validated.cookingFuel,
        hasAirPurifier: validated.hasAirPurifier,
        homeType: validated.homeType,
      };

      const plan = await routinePlannerService.generatePlan(profile, locationName);
      sendSuccess(res, plan);
    } catch (err) {
      next(err);
    }
  }
}
