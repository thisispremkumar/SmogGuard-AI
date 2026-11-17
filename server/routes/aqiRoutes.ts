import { Router } from 'express';
import { AqiController } from '../controllers/aqiController.js';

const router = Router();

router.get('/', AqiController.getAirQuality);
router.get('/hotspots', AqiController.getHotspots);

export default router;
