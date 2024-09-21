import { z } from 'zod';

export const dataForAcceptanceFormSchema = z.object({
  headEmployeeData: z.object({
    employeeCode: z.string(),
    name: z.string(),
    phone: z.string(),
    email: z.string(),
    subManagement: z.string(),
    management1: z.string()
  }),
  assignmentDate: z.string().date('YYYY-MM-DD')
});

export const statusAcceptanceFormSchema = z.object({
  status: z.enum(['ACEPTADO', 'RECHAZADO', 'CANCELADO'])
});
