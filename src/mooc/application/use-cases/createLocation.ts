import { ILocationRepository } from '../../core/repositories/ILocationRepository';

export class CreateLocation {
  constructor(private readonly locationRepository: ILocationRepository) {}

  public async execute(location: any): Promise<void> {
    await this.locationRepository.createLocation(location);
  }
}
