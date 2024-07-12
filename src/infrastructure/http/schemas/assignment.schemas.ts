import { z } from 'zod';

export const assignmentCreateSchema = z.object({
  slot_id: z.string().uuid(),
  status: z.enum(['ACTIVO', 'INACTIVO']),
  employee: z.object({
    id: z.string().uuid().optional(),
    code_employee: z.string(),
    name: z.string(),
    workplace: z.string(),
    identifier_document: z.string(),
    company: z.string(),
    department: z.string(),
    sub_management: z.string(),
    management_1: z.string(),
    management_2: z.string(),
    work_site: z.string(),
    address: z.string(),
    email: z.string().email(),
    phone: z.string().regex(/^\+\(50\d{1}\) \d{8}$/, {
      message: 'Format phone number is +5XX XXXX-XXXX, example: +502 45454545'
    }),
    vehicles: z.array(
      z.object({
        id: z.string().uuid().optional(),
        vehicle_badge: z.string(),
        color: z.string(),
        brand: z.string(),
        model: z.string(),
        type: z.enum(['CARRO', 'MOTO', 'CAMION'])
      })
    )
  }),
  schedule: z
    .object({
      start_time_assignment: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
        message:
          'Format to time is HH:MM and time must be between 00:00 and 23:59'
      }),
      end_time_assignment: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
        message:
          'Format to time is HH:MM and time must be between 00:00 and 23:59'
      })
    })
    .optional()
});

export const getAssignmentByIdSchema = z.object({
  id: z.string().uuid()
});

export const createDiscountNodeByIdAssignmentSchema = z.object({
  assignment_id: z.string().uuid()
});

export const createDeAssignmentParamsSchema = z.object({
  assignment_id: z.string().uuid()
});

export const createDeAssignmentBodySchema = z.object({
  reason: z.string(),
  de_assignment_date: z.string().date('YYYY-MM-DD')
});
