import { LocationRepository } from '@location-module-core/repositories/location-repository';
import { LocationEntity } from '@location-module-core/entities/location-entity';
import { LocationNotFoundError } from '@location-module-core/exceptions/location-not-found';

export class GetLocationByIdFinder {
  constructor(private readonly locationRepository: LocationRepository) {}

  public async run(id: string): Promise<LocationEntity> {
    const location = await this.locationRepository.getLocationById(id);

    if (!location) {
      throw new LocationNotFoundError('Location not found');
    }

    return location;
  }
}
