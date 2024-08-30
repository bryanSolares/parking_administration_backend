import { SequelizeMYSQLLocationRepository } from './sequelize-mysql-repository';
import { LocationController } from '../controllers/location.controller';

import { CreateLocation } from '@src/location/application/user-cases/create-location';
import { UpdateLocation } from '@src/location/application/user-cases/update-location';
import { DeleteLocation } from '@src/location/application/user-cases/delete-location';
import { GetLocationByIdFinder } from '@src/location/application/user-cases/location-by-id-finder';
import { LocationFinder } from '@src/location/application/user-cases/location-finder';
import { StatisticsDataUseCase } from '@src/location/application/user-cases/statistics-data';

const locationRepository = new SequelizeMYSQLLocationRepository();

import { ValidationsUseCases } from '@location-module-application/user-cases/validations';

const validationsUseCases = new ValidationsUseCases(locationRepository);

//Use cases
const createLocation = new CreateLocation(locationRepository);
const updateLocation = new UpdateLocation(
  locationRepository,
  validationsUseCases
);
const deleteLocation = new DeleteLocation(locationRepository);
const locationFinder = new LocationFinder(locationRepository);
const locationFinderById = new GetLocationByIdFinder(locationRepository);
const statisticsDataUseCase = new StatisticsDataUseCase(locationRepository);

//Controllers
const locationController = new LocationController(
  createLocation,
  updateLocation,
  deleteLocation,
  locationFinderById,
  locationFinder,
  statisticsDataUseCase
);

export { locationController };
