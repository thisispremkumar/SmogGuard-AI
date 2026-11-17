import { Router } from 'express';
import { AssistantController } from '../controllers/assistantController.js';

const router = Router();

router.post('/chat', AssistantController.chat);

export default router;
