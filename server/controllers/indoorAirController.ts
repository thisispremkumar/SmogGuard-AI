import { Request, Response } from 'express';
import { indoorAirService } from '../services/indoorAirService.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { IndoorAirHack } from '../types/index.js';

/**
 * Controller serving physics-backed indoor air quality hacks
 */
export class IndoorAirController {
  public static getAllHacks(req: Request, res: Response): void {
    const category = req.query.category as IndoorAirHack['category'] | undefined;
    if (category) {
      const hacks = indoorAirService.getHacksByCategory(category);
      sendSuccess(res, hacks);
      return;
    }
    const hacks = indoorAirService.getAllHacks();
    sendSuccess(res, hacks);
  }

  public static getHackById(req: Request, res: Response): void {
    const hackId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const hack = indoorAirService.getHackById(hackId);
    if (!hack) {
      sendError(res, 'Indoor air hack not found', 404);
      return;
    }
    sendSuccess(res, hack);
  }
}
