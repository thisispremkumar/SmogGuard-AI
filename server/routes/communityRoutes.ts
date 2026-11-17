import { Router } from 'express';
import { CommunityController } from '../controllers/communityController.js';

const router = Router();

router.get('/reports', CommunityController.getReports);
router.post('/reports', CommunityController.addReport);
router.post('/reports/:id/upvote', CommunityController.upvoteReport);
router.post('/pledge', CommunityController.joinPledge);

export default router;
