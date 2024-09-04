import { z } from 'zod';

const employeeSchema = z.object({
  id: z.string().uuid().optional(),
  employeeCode: z.string(),
  name: z.string(),
  workplace: z.string(),
  identifierDocument: z.string(),
  company: z.string(),
  department: z.string(),
  subManagement: z.string(),
  management1: z.string(),
  management2: z.string(),
  workSite: z.string(),
  address: z.string(),
  email: z.string().email(),
  phone: z.string().regex(/^\+\(50\d{1}\) \d{8}$/, {
    message: 'Format phone number is +(5XX) XXXXXXXX, example: +(502) 45454545'
  }),
  vehicles: z.array(
    z.object({
      id: z.string().uuid().optional(),
      vehicleBadge: z.string(),
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
  slotId: z.string().uuid(),
  employee: employeeSchema,
  parkingCardNumber: z.string(),
  tags: z.array(z.string().uuid()).nonempty()
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
  schedule: scheduleSchema.optional(),
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
  vehicles_for_delete: z.array(z.string().uuid()).optional(),
  tags: z.array(z.string().uuid())
});

const assignmentId = z.object({
  assignment_id: z.string().uuid()
});

const assignmentLoanId = z.object({
  assignment_loan_id: z.string().uuid()
});

const discountNoteId = z.object({
  discount_note_id: z.string().uuid()
});

export const assignmentIdSchema = z.union([
  assignmentId,
  assignmentLoanId,
  discountNoteId
]);

export const createDeAssignmentBodySchema = z.object({
  reason: z.string().optional(),
  de_assignment_date: z.string().date('YYYY-MM-DD').optional()
});

export const getAssignmentsSchemaForQuery = z.object({
  limit: z.coerce.number().min(1).max(100),
  page: z.coerce.number().min(1)
});

export const getEmployeeByCodeSchemaForParams = z.object({
  code: z.string()
});

export const statusDiscountNoteBodySchema = z.object({
  status: z.enum(['APROBADO', 'RECHAZADO', 'CANCELADO'])
});
