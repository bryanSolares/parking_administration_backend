import { LocationRepository } from '@core/repositories/location-repository';
import { LocationNotFound } from '@src/core/exceptions/location-not-found';

export class DeleteLocation {
  constructor(private readonly locationRepository: LocationRepository) {}

  public async run(id: string): Promise<void> {
    const locationexists = await this.locationRepository.getLocationById(id);

    if (!locationexists.id) {
      throw new LocationNotFound('Location not found');
    }

    await this.locationRepository.deleteLocation(id);
  }
}
