import { Router } from 'express';
import { LocationController } from '../controllers/LocationController';

const routes = Router();

routes.post('/', LocationController.createLocation.bind(LocationController));
routes.get('/', LocationController.getLocations.bind(LocationController));
routes.get('/:id', LocationController.getLocationById.bind(LocationController));
routes.put('/:id', LocationController.updateLocation.bind(LocationController));
routes.delete(
  '/:id',
  LocationController.deleteLocation.bind(LocationController)
);
//

export default routes;
