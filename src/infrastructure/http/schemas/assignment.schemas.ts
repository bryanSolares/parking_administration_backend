import { z } from 'zod';

const employeeSchema = z.object({
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
});

const scheduleSchema = z.object({
  start_time_assignment: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Format to time is HH:MM and time must be between 00:00 and 23:59'
  }),
  end_time_assignment: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Format to time is HH:MM and time must be between 00:00 and 23:59'
  })
});

export const assignmentCreateSchema = z.object({
  slot_id: z.string().uuid(),
  employee: employeeSchema,
  schedule: scheduleSchema.optional(),
  assignment_loan: z
    .object({
      start_date_assignment: z.string().date('YYYY-MM-DD'),
      end_date_assignment: z.string().date('YYYY-MM-DD'),
      employee: employeeSchema
    })
    .optional()
});

export const assignmentUpdateSchema = z.object({
  employee: z.object({
    id: z.string().uuid(),
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
  schedule: scheduleSchema,
  assignment_loan: z
    .object({
      start_date_assignment: z.string().date('YYYY-MM-DD'),
      end_date_assignment: z.string().date('YYYY-MM-DD'),
      employee: z.object({
        id: z.string().uuid(),
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
      })
    })
    .optional(),
  vehicles_for_delete: z.array(z.string().uuid()).optional()
});

export const schemaQueryOfAssignmentIdUpdateAssignment = z.object({
  assignment_id: z.string().uuid()
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

export const createDeAssignmentBodySchema = z
  .object({
    reason: z.string().optional(),
    de_assignment_date: z.string().date('YYYY-MM-DD').optional()
  })
  .optional();

export const getAssignmentsSchemaForQuery = z.object({
  limit: z.coerce.number().min(1).max(100),
  page: z.coerce.number().min(1)
});

export const getEmployeeByCodeSchemaForParams = z.object({
  code: z.string()
});
