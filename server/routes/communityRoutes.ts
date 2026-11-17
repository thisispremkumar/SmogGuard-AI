import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { communityService } from '../services/communityService.js';

const router = Router();

const NewReportSchema = z.object({
  neighborhood: z.string().min(2).max(120),
  type: z.enum(['wood_burning_smoke', 'traffic_gridlock_smog', 'clean_air_sanctuary', 'carpool_offer']),
  details: z.string().min(5).max(1000),
  severity: z.enum(['info', 'warning', 'urgent']).default('info'),
});

const PledgeSchema = z.object({
  type: z.enum(['wood_moratorium', 'carpool', 'sanctuary_host']),
});

router.get('/reports', (_req: Request, res: Response) => {
  const reports = communityService.getReports();
  const stats = communityService.getPledgeStats();
  res.json({ status: 'success', data: { reports, stats } });
});

router.post('/reports', (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = NewReportSchema.parse(req.body);
    const newReport = communityService.addReport(validated);
    res.status(201).json({ status: 'success', data: newReport });
  } catch (err) {
    next(err);
  }
});

router.post('/reports/:id/upvote', (req: Request, res: Response) => {
  const reportId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const updated = communityService.upvoteReport(reportId);
  if (!updated) {
    res.status(404).json({ status: 'fail', message: 'Report not found' });
    return;
  }
  res.json({ status: 'success', data: updated });
});

router.post('/pledge', (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = PledgeSchema.parse(req.body);
    const updatedStats = communityService.joinPledge(validated.type);
    res.json({ status: 'success', data: updatedStats });
  } catch (err) {
    next(err);
  }
});

export default router;
