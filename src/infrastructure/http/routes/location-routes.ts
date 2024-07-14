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
    locationController.createLocation.bind(locationController)
  )
  .get('/location', locationController.locationFinder.bind(locationController))
  .get(
    '/location/:id',
    validateRequest(getLocationByIdSchema, 'params'),
    locationController.locationFinderById.bind(locationController)
  )
  .put(
    '/location/:id',
    validateRequest(locationUpdateParamsSchema, 'params'),
    validateRequest(locationUpdateSchema, 'body'),
    locationController.updateLocation.bind(locationController)
  )
  .delete(
    '/location/slots',
    validateRequest(deleteSlotsSchema, 'body'),
    locationController.deleteSlots.bind(locationController)
  )
  .delete(
    '/location/:id',
    validateRequest(locationDeleteParamsSchema, 'params'),
    locationController.deleteLocation.bind(locationController)
  );

export default routes;
