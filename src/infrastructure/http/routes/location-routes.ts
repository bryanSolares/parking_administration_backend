import { Router } from 'express';
import { locationController } from '@infrastructure/repositories/location/dependecies';

import { validateRequest } from '@src/infrastructure/http/middlewares/zod.validate';

import { locationCreateSchema } from '@infrastructure/http/schemas/location.schemas';
import { locationUpdateSchema } from '@infrastructure/http/schemas/location.schemas';
import { locationUpdateParamsSchema } from '@infrastructure/http/schemas/location.schemas';
import { locationDeleteParamsSchema } from '@infrastructure/http/schemas/location.schemas';
import { getLocationByIdSchema } from '@infrastructure/http/schemas/location.schemas';
import { deleteSlotsSchema } from '@infrastructure/http/schemas/location.schemas';

const routes = Router();

routes
  .post(
    '/location',
    validateRequest(locationCreateSchema, 'body'),
    locationController.createLocation.run.bind(
      locationController.createLocation
    )
  )
  .get(
    '/location',
    locationController.getLocations.run.bind(locationController.getLocations)
  )
  .get(
    '/location/:id',
    validateRequest(getLocationByIdSchema, 'params'),
    locationController.getLocationById.run.bind(
      locationController.getLocationById
    )
  )
  .put(
    '/location/:id',
    validateRequest(locationUpdateParamsSchema, 'params'),
    validateRequest(locationUpdateSchema, 'body'),
    locationController.updateLocation.run.bind(
      locationController.updateLocation
    )
  )
  .delete(
    '/location/slots',
    validateRequest(deleteSlotsSchema, 'body'),
    locationController.deleteSlots.run.bind(locationController.deleteSlots)
  )
  .delete(
    '/location/:id',
    validateRequest(locationDeleteParamsSchema, 'params'),
    locationController.deleteLocation.run.bind(
      locationController.deleteLocation
    )
  );

export default routes;
