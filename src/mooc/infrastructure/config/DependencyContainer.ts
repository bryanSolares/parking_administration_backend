import { SequelizeLocationRepository } from '../repositories/SequelizeLocationRepository';

import { CreateLocation } from '../../application/use-cases/createLocation';
import { UpdateLocation } from '../../application/use-cases/updateLocation';
import { DeleteLocation } from '../../application/use-cases/deleteLocation';
import { GetLocationById } from '../../application/use-cases/getLocationById';
import { GetLocations } from '../../application/use-cases/getLocations';

export class DependencyContainer {
  public sequelizeLocationRepository = new SequelizeLocationRepository();

  //Use cases
  public createLocationUseCase = new CreateLocation(
    this.sequelizeLocationRepository
  );

  public updateLocationUseCase = new UpdateLocation(
    this.sequelizeLocationRepository
  );

  public deleteLocationUseCase = new DeleteLocation(
    this.sequelizeLocationRepository
  );

  public getLocationByIdUseCase = new GetLocationById(
    this.sequelizeLocationRepository
  );

  public getAllLocationsUseCase = new GetLocations(
    this.sequelizeLocationRepository
  );
}

export const dependencyContainer = new DependencyContainer();
