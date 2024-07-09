import { LocationRepository } from '@core/repositories/location-repository';

export class CreateLocation {
  constructor(private readonly locationRepository: LocationRepository) {}

  public async run(location: any): Promise<void> {
    await this.locationRepository.createLocation(location);
  }
}
