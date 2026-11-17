import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { geminiService } from '../services/geminiService.js';

const router = Router();

const ChatQuerySchema = z.object({
  message: z.string().min(1, 'Message cannot be empty').max(2000, 'Message exceeds 2000 character limit'),
  location: z.string().min(1).max(100).optional().default('New Delhi'),
  familyContext: z.string().max(500).optional(),
});

router.post('/chat', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = ChatQuerySchema.parse(req.body);
    const response = await geminiService.askAssistant(
      validated.message,
      validated.location,
      validated.familyContext
    );
    res.json({ status: 'success', data: response });
  } catch (err) {
    next(err);
  }
});

export default router;

