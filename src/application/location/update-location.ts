import { LocationRepository } from '@core/repositories/location-repository';
import { Location } from '@core/entities/location-entity';
import { LocationNotFoundError } from '@src/core/exceptions/location-not-found';

export class UpdateLocation {
  constructor(private readonly locationRepository: LocationRepository) {}

  public async run(location: Location): Promise<void> {
    const locationExists = await this.locationRepository.getLocationById(
      location.id
    );

    if (!locationExists?.id) {
      throw new LocationNotFoundError('Location not found');
    }

    await this.locationRepository.updateLocation(location);
  }
}
