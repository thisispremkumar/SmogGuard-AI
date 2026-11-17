import { Request, Response, NextFunction } from 'express';
import { aqiService } from '../services/aqiService.js';
import { sendSuccess } from '../utils/apiResponse.js';

/**
 * Controller handling Air Quality and Thermal Inversion telemetry
 */
export class AqiController {
  public static async getAirQuality(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const city = (req.query.city as string) || 'New Delhi';
      const telemetry = await aqiService.getAirQuality(city);
      sendSuccess(res, telemetry);
    } catch (err) {
      next(err);
    }
  }

  public static getHotspots(_req: Request, res: Response): void {
    const hotspots = aqiService.getAvailableHotspots();
    sendSuccess(res, hotspots);
  }
}
