import { LocationRepository } from '@location-module-core/repositories/location-repository';
import { LocationEntity } from '@location-module-core/entities/location-entity';
import { AppError } from '@src/server/config/err/AppError';

export class GetLocationByIdFinder {
  constructor(private readonly locationRepository: LocationRepository) {}

  public async run(id: string): Promise<LocationEntity> {
    const location = await this.locationRepository.getLocationById(id);

    if (!location) {
      throw new AppError('LOCATION_NOT_FOUND', 404, 'Location not found', true);
    }

    return location;
  }
}
