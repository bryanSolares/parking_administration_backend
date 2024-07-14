import { SequelizeLocationRepository } from './sequelize-postgresql-repository';

import { CreateLocation } from '@application/location/create-location';
import { UpdateLocation } from '@application/location/update-location';
import { DeleteLocation } from '@application/location/delete-location';
import { GetLocationByIdFinder } from '@application/location/location-by-id-finder';
import { LocationFinder } from '@application/location/location-finder';
import { DeleteSlots } from '@application/location/delete-slots';

import { LocationController } from '@src/infrastructure/http/controllers/location.controller';

const locationRepository = new SequelizeLocationRepository();

//Use cases
const createLocation = new CreateLocation(locationRepository);
const updateLocation = new UpdateLocation(locationRepository);
const deleteLocation = new DeleteLocation(locationRepository);
const locationFinder = new LocationFinder(locationRepository);
const locationFinderById = new GetLocationByIdFinder(locationRepository);
const deleteSlots = new DeleteSlots(locationRepository);

//Controllers
const locationController = new LocationController(
  createLocation,
  updateLocation,
  deleteLocation,
  locationFinderById,
  locationFinder,
  deleteSlots
);

export { locationController };
