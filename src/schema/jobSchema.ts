import { z } from 'zod';
import type { CreateJobFormData } from '@/types/job';

export const jobSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  company: z.string().min(2, 'Company is required'),
  location: z.string().min(2, 'Location is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  deadline: z.date({ required_error: 'Deadline is required' }),
});

export type JobSchema = typeof jobSchema;
export type JobSchemaType = z.infer<typeof jobSchema>;
