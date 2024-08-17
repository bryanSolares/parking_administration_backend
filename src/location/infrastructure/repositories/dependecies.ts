import { SequelizeMYSQLLocationRepository } from './sequelize-mysql-repository';
import { LocationController } from '../controllers/location.controller';

import { CreateLocation } from '@src/location/application/user-cases/create-location';
import { UpdateLocation } from '@src/location/application/user-cases/update-location';
import { DeleteLocation } from '@src/location/application/user-cases/delete-location';
import { GetLocationByIdFinder } from '@src/location/application/user-cases/location-by-id-finder';
import { LocationFinder } from '@src/location/application/user-cases/location-finder';

const locationRepository = new SequelizeMYSQLLocationRepository();

//Use cases
const createLocation = new CreateLocation(locationRepository);
const updateLocation = new UpdateLocation(locationRepository);
const deleteLocation = new DeleteLocation(locationRepository);
const locationFinder = new LocationFinder(locationRepository);
const locationFinderById = new GetLocationByIdFinder(locationRepository);

//Controllers
const locationController = new LocationController(
  createLocation,
  updateLocation,
  deleteLocation,
  locationFinderById,
  locationFinder
);

export { locationController };
