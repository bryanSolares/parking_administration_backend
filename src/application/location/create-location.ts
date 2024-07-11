import { LocationRepository } from '@core/repositories/location-repository';
import { LocationEntity } from '@src/core/entities/location-entity';

export class CreateLocation {
  constructor(private readonly locationRepository: LocationRepository) {}

  public async run(location: LocationEntity): Promise<void> {
    await this.locationRepository.createLocation(location);
  }
}
