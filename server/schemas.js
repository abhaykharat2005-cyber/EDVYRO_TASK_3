import { z } from 'zod';

export const applicationSchema = z.object({
  internshipId: z.coerce.number().int().positive(),
  fullName: z.string().trim().min(2, 'Enter your full name').max(80),
  email: z.string().trim().email('Enter a valid email address').max(120),
  phone: z.string().trim().regex(/^[+0-9()\-\s]{8,18}$/, 'Enter a valid phone number'),
  college: z.string().trim().min(2, 'Enter your college name').max(120),
  skills: z.string().trim().min(2, 'List at least one skill').max(250),
  coverNote: z.string().trim().min(20, 'Write at least 20 characters').max(1000)
});
