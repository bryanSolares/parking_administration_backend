import { SequelizeLocationRepository } from './sequelize-postgresql-repository';

import { CreateLocation } from '@application/location/create-location';
import { UpdateLocation } from '@application/location/update-location';
import { DeleteLocation } from '@application/location/delete-location';
import { GetLocationByIdFinder } from '@application/location/location-by-id-finder';
import { LocationFinder } from '@application/location/location-finder';
import { DeleteSlots } from '@application/location/delete-slots';

import { LocationCreateController } from '@src/infrastructure/http/controllers/location/location-create-controller';
import { LocationDeleteController } from '@src/infrastructure/http/controllers/location/location-delete-controller';
import { LocationUpdateController } from '@src/infrastructure/http/controllers/location/location-update-controller';
import { LocationFinderByIdController } from '@src/infrastructure/http/controllers/location/location-finder-by-id-controller';
import { LocationFinderController } from '@src/infrastructure/http/controllers/location/location-finder-controller';
import { SlotsDeleteController } from '@src/infrastructure/http/controllers/location/slot-delete-controller';

const locationRepository = new SequelizeLocationRepository();

//Use cases
const createLocation = new CreateLocation(locationRepository);
const updateLocation = new UpdateLocation(locationRepository);
const deleteLocation = new DeleteLocation(locationRepository);
const getLocations = new LocationFinder(locationRepository);
const getLocationById = new GetLocationByIdFinder(locationRepository);
const deleteSlots = new DeleteSlots(locationRepository);

//Controllers
const locationCreateController = new LocationCreateController(createLocation);
const locationUpdateController = new LocationUpdateController(updateLocation);
const locationDeleteController = new LocationDeleteController(deleteLocation);
const locationGetByIdController = new LocationFinderByIdController(
  getLocationById
);
const locationGetController = new LocationFinderController(getLocations);
const slotsDeleteController = new SlotsDeleteController(deleteSlots);

//Imports
const locationController = {
  createLocation: locationCreateController,
  updateLocation: locationUpdateController,
  deleteLocation: locationDeleteController,
  getLocationById: locationGetByIdController,
  getLocations: locationGetController,
  deleteSlots: slotsDeleteController
};

export { locationController };
