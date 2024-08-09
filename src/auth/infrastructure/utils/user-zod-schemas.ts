import { z } from 'zod';

export const userSchema = z.object({
  name: z.string(),
  username: z.string(),
  status: z.enum(['ACTIVO', 'INACTIVO']),
  email: z.string().optional(),
  password: z.string().optional(),
  phone: z.string().optional()
});

export const idUserSchema = z.object({ user_id: z.string().uuid() });

export const finderSchema = z.object({
  limit: z.coerce
    .number({
      message: 'Limit must be number and should be greater than 0'
    })
    .min(1),
  page: z.coerce
    .number({
      message: 'Page must be number and should be greater than 0'
    })
    .min(1)
});
