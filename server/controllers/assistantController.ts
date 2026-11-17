import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { geminiService } from '../services/geminiService.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const ChatQuerySchema = z.object({
  message: z.string().min(1, 'Message cannot be empty').max(2000, 'Message exceeds 2000 character limit'),
  location: z.string().min(1).max(100).optional().default('New Delhi'),
  familyContext: z.string().max(500).optional(),
});

/**
 * Controller orchestrating GenAI atmospheric and family health reasoning
 */
export class AssistantController {
  public static async chat(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = ChatQuerySchema.parse(req.body);
      const advisory = await geminiService.askAssistant(
        validated.message,
        validated.location,
        validated.familyContext
      );
      sendSuccess(res, advisory);
    } catch (err) {
      next(err);
    }
  }
}
