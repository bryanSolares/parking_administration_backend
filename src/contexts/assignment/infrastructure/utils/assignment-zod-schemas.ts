import { z } from 'zod';

export const vehicleSchema = z.array(
  z.object({
    id: z.string().uuid().optional(),
    vehicleBadge: z.string(),
    color: z.string(),
    brand: z.string(),
    model: z.string(),
    type: z.enum(['CARRO', 'MOTO', 'CAMION'])
  })
);

export const employeeSchema = z.object({
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
  phone: z.string().regex(/^\+\(50[2-5]{1}\) \d{8}$/, {
    message: 'Format phone number is +(5XX) XXXXXXXX, example: +(502) 45454545'
  }),
  vehicles: vehicleSchema
});

export const assignmentCreateSchema = z.object({
  slotId: z.string().uuid(),
  employee: employeeSchema,
  parkingCardNumber: z.string(),
  tags: z.array(z.string().uuid()).nonempty()
});

export const assignmentUpdateSchema = z.object({
  employee: z.object({
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
  }),
  vehiclesForDelete: z.array(z.string().uuid()),
  tags: z.array(z.string().uuid()).nonempty()
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

export const assignmentIdSchema = z.union([assignmentId, assignmentLoanId, discountNoteId]);

export const createDeAssignmentBodySchema = z.object({
  reason: z.string(),
  deAssignmentDate: z.string().date('YYYY-MM-DD')
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
