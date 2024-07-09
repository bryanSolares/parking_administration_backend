import { ILocationRepository } from '../../core/repositories/ILocationRepository';
import { Location } from '../../core/entities/LocationEntity';
import { LocationNotFound } from '../../core/errors/LocationNotFound';

export class GetLocationById {
  constructor(private readonly locationRepository: ILocationRepository) {}

  public async execute(id: string): Promise<Location> {
    const location = await this.locationRepository.getLocationById(id);

    if (!location) {
      throw new LocationNotFound('Location not found');
    }

    return location;
  }
}
