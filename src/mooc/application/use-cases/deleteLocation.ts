import { ILocationRepository } from '../../core/repositories/ILocationRepository';
import { LocationNotFound } from '../../core/errors/LocationNotFound';

export class DeleteLocation {
  constructor(private readonly locationRepository: ILocationRepository) {}

  public async execute(id: string): Promise<void> {
    const locationexists = await this.locationRepository.getLocationById(id);

    if (!locationexists.id) {
      throw new LocationNotFound('Location not found');
    }

    await this.locationRepository.deleteLocation(id);
  }
}
