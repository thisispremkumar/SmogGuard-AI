import { Router, Request, Response, NextFunction } from 'express';
import { aqiService } from '../services/aqiService.js';

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const city = (req.query.city as string) || 'New Delhi';
    const data = await aqiService.getAirQuality(city);
    res.json({ status: 'success', data });
  } catch (err) {
    next(err);
  }
});

router.get('/hotspots', (_req: Request, res: Response) => {
  const hotspots = aqiService.getAvailableHotspots();
  res.json({ status: 'success', data: hotspots });
});

export default router;

