import { Router } from 'express';
import { locationController } from '@infrastructure/repositories/location/dependecies';

const routes = Router();

routes.post(
  '/location',
  locationController.createLocation.run.bind(locationController.createLocation)
);
routes.get(
  '/location',
  locationController.getLocations.run.bind(locationController.getLocations)
);
routes.get(
  '/location/:id',
  locationController.getLocationById.run.bind(
    locationController.getLocationById
  )
);
routes.put(
  '/location/:id',
  locationController.updateLocation.run.bind(locationController.updateLocation)
);
routes.delete(
  '/location/slots',
  locationController.deleteSlots.run.bind(locationController.deleteSlots)
);
routes.delete(
  '/location/:id',
  locationController.deleteLocation.run.bind(locationController.deleteLocation)
);

export default routes;
