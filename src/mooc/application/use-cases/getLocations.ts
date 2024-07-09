import { Location } from '../../core/entities/LocationEntity';
import { ILocationRepository } from '../../core/repositories/ILocationRepository';

export class GetLocations {
  constructor(private readonly locationRepository: ILocationRepository) {}

  public async execute(): Promise<Location[]> {
    return await this.locationRepository.getLocations();
  }
}
