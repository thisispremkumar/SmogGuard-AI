import { Router, Request, Response } from 'express';
import { indoorAirService } from '../services/indoorAirService.js';
import { IndoorAirHack } from '../types/index.js';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  const category = req.query.category as IndoorAirHack['category'] | undefined;
  if (category) {
    const hacks = indoorAirService.getHacksByCategory(category);
    res.json({ status: 'success', data: hacks });
    return;
  }
  const hacks = indoorAirService.getAllHacks();
  res.json({ status: 'success', data: hacks });
});

router.get('/:id', (req: Request, res: Response) => {
  const hackId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const hack = indoorAirService.getHackById(hackId);
  if (!hack) {
    res.status(404).json({ status: 'fail', message: 'Indoor air hack not found' });
    return;
  }
  res.json({ status: 'success', data: hack });
});

export default router;
