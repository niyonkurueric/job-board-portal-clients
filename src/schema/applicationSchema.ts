import { z } from 'zod';

export const applicationSchema = z.object({
  cvLink: z.string().url({ message: 'Please enter a valid URL' }),
  coverLetter: z.string().min(50, 'Cover letter must be at least 50 characters'),
});
