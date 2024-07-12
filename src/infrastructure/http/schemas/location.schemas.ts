import { z } from 'zod';

export const locationCreateSchema = z.object({
  name: z.string(),
  address: z.string(),
  contact_reference: z.string(),
  phone: z.string().regex(/^\+\(50\d{1}\) \d{8}$/, {
    message: 'Format to phone number is +5XX XXXX-XXXX, example: +502 45454545'
  }),
  email: z.string().email(),
  comments: z.string(),
  status: z.enum(['ACTIVO', 'INACTIVO']),
  slots: z.array(
    z.object({
      slot_number: z.string(),
      slot_type: z.enum(['SIMPLE', 'MULTIPLE']),
      limit_schedules: z.number(),
      vehicle_type: z.enum(['CARRO', 'MOTO', 'CAMION']),
      cost_type: z.enum(['SIN_COSTO', 'DESCUENTO', 'COMPLEMENTO']),
      cost: z.number(),
      status: z.enum(['ACTIVO', 'INACTIVO'])
    })
  )
});

export const locationUpdateParamsSchema = z.object({
  id: z.string().uuid()
});

export const locationUpdateSchema = z.object({
  name: z.string(),
  address: z.string(),
  contact_reference: z.string(),
  phone: z.string().regex(/^\+\(50\d{1}\) \d{8}$/, {
    message: 'Format phone number is +5XX XXXX-XXXX, example: +502 45454545'
  }),
  email: z.string().email(),
  comments: z.string(),
  status: z.enum(['ACTIVO', 'INACTIVO']),
  slots: z.array(
    z.object({
      id: z.string().uuid().optional(),
      slot_number: z.string(),
      slot_type: z.enum(['SIMPLE', 'MULTIPLE']),
      limit_schedules: z.number(),
      vehicle_type: z.enum(['CARRO', 'MOTO', 'CAMION']),
      cost_type: z.enum(['SIN_COSTO', 'DESCUENTO', 'COMPLEMENTO']),
      cost: z.number(),
      status: z.enum(['ACTIVO', 'INACTIVO'])
    })
  )
});

export const locationDeleteParamsSchema = z.object({
  id: z.string().uuid()
});

export const getLocationByIdSchema = z.object({
  id: z.string().uuid()
});

export const deleteSlotsSchema = z.object({
  slots: z.array(z.string().uuid())
});
