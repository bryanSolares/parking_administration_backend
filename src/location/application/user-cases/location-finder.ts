import { LocationRepository } from '@location-module-core/repositories/location-repository';
import { LocationFinderResult } from '@location-module-core/repositories/location-repository';

export class LocationFinder {
  constructor(private readonly locationRepository: LocationRepository) {}

  public async run(
    limit: number,
    page: number
  ): Promise<LocationFinderResult | null> {
    return await this.locationRepository.getLocations(limit, page);
  }
}
