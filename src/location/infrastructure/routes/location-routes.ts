import { Router } from 'express';

import { locationCreateSchema } from '../utils/location-zod-schemas';
import { locationUpdateSchema } from '../utils/location-zod-schemas';
import { locationUpdateParamsSchema } from '../utils/location-zod-schemas';
import { locationDeleteParamsSchema } from '../utils/location-zod-schemas';
import { getLocationByIdSchema } from '../utils/location-zod-schemas';
import { getLocationsSchemaForQuery } from '../utils/location-zod-schemas';
import { trendSchema } from '../utils/location-zod-schemas';
import { getAvailableSlotsSchema } from '../utils/location-zod-schemas';

import { locationController } from '@src/location/infrastructure/repositories/dependecies';
import { validateRequest } from '@src/shared/infrastructure/utils/zod-validator';

const routes = Router();

routes
  .post('/location', validateRequest(locationCreateSchema, 'body'), locationController.createLocation.bind(locationController))
  .get(
    '/location',
    validateRequest(getLocationsSchemaForQuery, 'query'),
    locationController.locationFinder.bind(locationController)
  )
  .get(
    '/location/available-slots/',
    validateRequest(getAvailableSlotsSchema, 'body'),
    locationController.getSlotsAvailable.bind(locationController)
  )
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
    '/location/:id',
    validateRequest(locationDeleteParamsSchema, 'params'),
    locationController.deleteLocation.bind(locationController)
  )
  .get('/location/stats/overview', locationController.overviewParkingData.bind(locationController))
  .get(
    '/location/stats/trend',
    validateRequest(trendSchema, 'query'),
    locationController.trendParkingData.bind(locationController)
  );

export default routes;
