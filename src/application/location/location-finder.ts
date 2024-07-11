import { LocationEntity } from '@core/entities/location-entity';
import { LocationRepository } from '@core/repositories/location-repository';

export class LocationFinder {
  constructor(private readonly locationRepository: LocationRepository) {}

  public async run(): Promise<LocationEntity[] | null> {
    return await this.locationRepository.getLocations();
  }
}
