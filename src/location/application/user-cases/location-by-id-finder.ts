import { LocationRepository } from '@location-module-core/repositories/location-repository';
import { LocationEntity } from '@location-module-core/entities/location-entity';
import { AppError } from '@src/shared/infrastructure/server/config/err/AppError';

export class GetLocationByIdFinder {
  constructor(private readonly locationRepository: LocationRepository) {}

  public async run(id: string): Promise<LocationEntity> {
    try {
      const location = await this.locationRepository.getLocationById(id);

      if (!location) {
        throw new AppError('LOCATION_NOT_FOUND', 404, 'Location not found', true);
      }
      return location;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      console.log(error);

      throw new AppError('UNKNOWN_ERROR', 500, 'Error not identified on location by id finder use case', false);
    }
  }
}
