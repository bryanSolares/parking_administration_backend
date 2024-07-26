import { LocationRepository } from '@location-module-core/repositories/location-repository';
import { LocationNotFoundError } from '@location-module-core/exceptions/location-not-found';

export class DeleteLocation {
  constructor(private readonly locationRepository: LocationRepository) {}

  public async run(id: string): Promise<void> {
    const locationexists = await this.locationRepository.getLocationById(id);

    if (!locationexists?.id) {
      throw new LocationNotFoundError('Location not found');
    }

    await this.locationRepository.deleteLocation(id);
  }
}
