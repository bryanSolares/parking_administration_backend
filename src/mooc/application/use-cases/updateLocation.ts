import { ILocationRepository } from '../../core/repositories/ILocationRepository';
import { Location } from '../../core/entities/LocationEntity';
import { LocationNotFound } from '../../core/errors/LocationNotFound';

export class UpdateLocation {
  constructor(private readonly locationRepository: ILocationRepository) {}

  public async execute(location: Location): Promise<void> {
    const locationExists = await this.locationRepository.getLocationById(
      location.id
    );

    if (!locationExists.id) {
      throw new LocationNotFound('Location not found');
    }

    await this.locationRepository.updateLocation(location);
  }
}
