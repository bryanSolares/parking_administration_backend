import { Router } from 'express';
import { locationController } from '@infrastructure/dependecies';

const routes = Router();

routes.post(
  '/',
  locationController.createLocation.run.bind(locationController.createLocation)
);
routes.get(
  '/',
  locationController.getLocations.run.bind(locationController.getLocations)
);
routes.get(
  '/:id',
  locationController.getLocationById.run.bind(
    locationController.getLocationById
  )
);
routes.put(
  '/:id',
  locationController.updateLocation.run.bind(locationController.updateLocation)
);
routes.delete(
  '/:id',
  locationController.deleteLocation.run.bind(locationController.deleteLocation)
);

export default routes;
