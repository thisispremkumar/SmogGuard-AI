import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { communityService } from '../services/communityService.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

export const NewReportSchema = z.object({
  neighborhood: z.string().min(2).max(120),
  type: z.enum(['wood_burning_smoke', 'traffic_gridlock_smog', 'clean_air_sanctuary', 'carpool_offer']),
  details: z.string().min(5).max(1000),
  severity: z.enum(['info', 'warning', 'urgent']).default('info'),
});

export const PledgeSchema = z.object({
  type: z.enum(['wood_moratorium', 'carpool', 'sanctuary_host']),
});

/**
 * Controller handling neighborhood smog watch and collective pledges
 */
export class CommunityController {
  public static getReports(_req: Request, res: Response): void {
    const reports = communityService.getReports();
    const stats = communityService.getPledgeStats();
    sendSuccess(res, { reports, stats });
  }

  public static addReport(req: Request, res: Response, next: NextFunction): void {
    try {
      const validated = NewReportSchema.parse(req.body);
      const newReport = communityService.addReport(validated);
      sendSuccess(res, newReport, 201);
    } catch (err) {
      next(err);
    }
  }

  public static upvoteReport(req: Request, res: Response): void {
    const reportId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const updated = communityService.upvoteReport(reportId);
    if (!updated) {
      sendError(res, 'Report not found', 404);
      return;
    }
    sendSuccess(res, updated);
  }

  public static joinPledge(req: Request, res: Response, next: NextFunction): void {
    try {
      const validated = PledgeSchema.parse(req.body);
      const updatedStats = communityService.joinPledge(validated.type);
      sendSuccess(res, updatedStats);
    } catch (err) {
      next(err);
    }
  }
}
