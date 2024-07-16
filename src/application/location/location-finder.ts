import {
  LocationFinderResult,
  LocationRepository
} from '@core/repositories/location-repository';

export class LocationFinder {
  constructor(private readonly locationRepository: LocationRepository) {}

  public async run(
    limit: number,
    page: number
  ): Promise<LocationFinderResult | null> {
    return await this.locationRepository.getLocations(limit, page);
  }
}
