import { z } from 'zod';

export const locationCreateSchema = z.object({
  name: z.string().max(75),
  address: z.string().max(75),
  contactReference: z.string().max(60).optional(),
  phone: z.string().max(50).optional(),
  email: z.string().max(50).email(),
  comments: z.string().max(255).optional(),
  numberOfIdentifier: z.string().max(25).optional(),
  status: z.enum(['ACTIVO', 'INACTIVO']),
  slots: z.array(
    z.object({
      slotNumber: z.string().max(25),
      slotType: z.enum(['SIMPLE', 'MULTIPLE']),
      limitOfAssignments: z.number().min(1).max(255),
      vehicleType: z.enum(['CARRO', 'MOTO', 'CAMION']),
      benefitType: z.enum(['SIN_COSTO', 'DESCUENTO', 'COMPLEMENTO']),
      amount: z.number().min(0).max(999.99),
      status: z.enum(['DISPONIBLE', 'INACTIVO'])
    })
  )
});

export const locationUpdateParamsSchema = z.object({
  id: z.string().uuid()
});

export const locationUpdateSchema = z.object({
  name: z.string().max(75),
  address: z.string().max(75),
  contactReference: z.string().max(60).optional(),
  phone: z.string().max(50).optional(),
  email: z.string().max(50).email(),
  comments: z.string().max(255).optional(),
  numberOfIdentifier: z.string().max(25).optional(),
  status: z.enum(['ACTIVO', 'INACTIVO']),
  slots: z.array(
    z.object({
      id: z.string().uuid().optional(),
      slotNumber: z.string().max(25),
      slotType: z.enum(['SIMPLE', 'MULTIPLE']),
      limitOfAssignments: z.number().min(1).max(255),
      vehicleType: z.enum(['CARRO', 'MOTO', 'CAMION']),
      benefitType: z.enum(['SIN_COSTO', 'DESCUENTO', 'COMPLEMENTO']),
      amount: z.number().min(0).max(999.99),
      status: z.enum(['DISPONIBLE', 'INACTIVO', 'OCUPADO'])
    })
  ),
  slotsToDelete: z.array(z.string().uuid())
});

export const locationDeleteParamsSchema = z.object({
  id: z.string().uuid()
});

export const getLocationByIdSchema = z.object({
  id: z.string().uuid()
});

export const getLocationsSchemaForQuery = z.object({
  limit: z.coerce.number().min(1).max(100),
  page: z.coerce.number().min(1)
});

export const deleteSlotsSchema = z.object({
  slots: z.array(z.string().uuid())
});

export const trendSchema = z.object({
  type: z.enum(['daily', 'weekly', 'monthly'])
});

export const getAvailableSlotsSchema = z.object({
  locationId: z.string().uuid(),
  vehicleType: z.enum(['CARRO', 'MOTO', 'CAMION'])
});
