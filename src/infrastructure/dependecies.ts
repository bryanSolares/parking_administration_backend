import { SequelizeLocationRepository } from './repositories/sequelize-postgresql-repository';
import { WSEmployeeRepository } from './repositories/assignments/ws-employee.repository';

import { CreateLocation } from '@application/location/create-location';
import { UpdateLocation } from '@application/location/update-location';
import { DeleteLocation } from '@application/location/delete-location';
import { GetLocationByIdFinder } from '@application/location/location-by-id-finder';
import { LocationFinder } from '@application/location/location-finder';
import { DeleteSlots } from '@application/location/delete-slots';

import { GetEmployeeByCode } from '@application/assignments/get-employee-by-code';

import { LocationCreateController } from '@infrastructure/http/controllers/location-create-controller';
import { LocationDeleteController } from '@infrastructure/http/controllers/location-delete-controller';
import { LocationUpdateController } from '@infrastructure/http/controllers/location-update-controller';
import { LocationFinderByIdController } from '@infrastructure/http/controllers/location-finder-by-id-controller';
import { LocationFinderController } from '@infrastructure/http/controllers/location-finder-controller';
import { SlotsDeleteController } from '@infrastructure/http/controllers/slot-delete-controller';

import { EmployeeFinderByCode } from '@infrastructure/http/controllers/assignment/employee-finder-by-code';

const locationRepository = new SequelizeLocationRepository();
const employeeRepository = new WSEmployeeRepository();

//Use cases
const createLocation = new CreateLocation(locationRepository);
const updateLocation = new UpdateLocation(locationRepository);
const deleteLocation = new DeleteLocation(locationRepository);
const getLocations = new LocationFinder(locationRepository);
const getLocationById = new GetLocationByIdFinder(locationRepository);
const deleteSlots = new DeleteSlots(locationRepository);

const getEmployeeByCode = new GetEmployeeByCode(employeeRepository);

//Controllers
const locationCreateController = new LocationCreateController(createLocation);
const locationUpdateController = new LocationUpdateController(updateLocation);
const locationDeleteController = new LocationDeleteController(deleteLocation);
const locationGetByIdController = new LocationFinderByIdController(
  getLocationById
);
const locationGetController = new LocationFinderController(getLocations);
const slotsDeleteController = new SlotsDeleteController(deleteSlots);

const employeeFinderByCode = new EmployeeFinderByCode(getEmployeeByCode);

//Imports
const locationController = {
  createLocation: locationCreateController,
  updateLocation: locationUpdateController,
  deleteLocation: locationDeleteController,
  getLocationById: locationGetByIdController,
  getLocations: locationGetController,
  deleteSlots: slotsDeleteController,
  employeeFinderByCode: employeeFinderByCode
};

const assignmentController = {
  employeeFinderByCode: employeeFinderByCode
};

export { locationController, assignmentController };
