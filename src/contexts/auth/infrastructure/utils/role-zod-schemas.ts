import { z } from 'zod';

export const roleSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  status: z.enum(['ACTIVO', 'INACTIVO']),
  list_of_access: z.array(
    z.object({
      resource: z.string().uuid(),
      can_access: z.boolean()
    })
  )
});

export const idRoleSchema = z.object({ role_id: z.string().uuid() });

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
