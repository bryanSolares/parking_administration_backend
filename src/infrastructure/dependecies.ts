// import { SequelizeLocationRepository } from '@infrastructure/repositories/SequelizeLocationRepository';

import { SequelizeLocationRepository } from './repositories/sequelize-postgresql-repository';

import { CreateLocation } from '@application/location/create-location';
import { UpdateLocation } from '@application/location/update-location';
import { DeleteLocation } from '@application/location/delete-location';
import { GetLocationByIdFinder } from '@application/location/location-by-id-finder';
import { LocationFinder } from '@application/location/location-finder';

import { LocationCreateController } from '@infrastructure/http/controllers/location-create-controller';
import { LocationDeleteController } from '@infrastructure/http/controllers/location-delete-controller';
import { LocationUpdateController } from '@infrastructure/http/controllers/location-update-controller';
import { LocationFinderByIdController } from '@infrastructure/http/controllers/location-finder-by-id-controller';
import { LocationFinderController } from '@infrastructure/http/controllers/location-finder-controller';

const locationRepository = new SequelizeLocationRepository();

//Use cases
const createLocation = new CreateLocation(locationRepository);
const updateLocation = new UpdateLocation(locationRepository);
const deleteLocation = new DeleteLocation(locationRepository);
const getLocations = new LocationFinder(locationRepository);
const getLocationById = new GetLocationByIdFinder(locationRepository);

//Controllers
const locationCreateController = new LocationCreateController(createLocation);
const locationUpdateController = new LocationUpdateController(updateLocation);
const locationDeleteController = new LocationDeleteController(deleteLocation);
const locationGetByIdController = new LocationFinderByIdController(
  getLocationById
);
const locationGetController = new LocationFinderController(getLocations);

//Imports
const locationController = {
  createLocation: locationCreateController,
  updateLocation: locationUpdateController,
  deleteLocation: locationDeleteController,
  getLocationById: locationGetByIdController,
  getLocations: locationGetController
};

export { locationController };
