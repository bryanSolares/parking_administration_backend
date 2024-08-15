import { ForeignKeyConstraintError } from 'sequelize';
import { LocationRepository } from '@location-module-core/repositories/location-repository';
import { AppError } from '@src/server/config/err/AppError';

export class DeleteLocation {
  constructor(private readonly locationRepository: LocationRepository) {}

  public async run(id: string): Promise<void> {
    const locationexists = await this.locationRepository.getLocationById(id);

    if (!locationexists?.id) {
      throw new AppError('LOCATION_NOT_FOUND', 404, 'Location not found', true);
    }

    try {
      await this.locationRepository.deleteLocation(id);
    } catch (error) {
      if (error instanceof ForeignKeyConstraintError) {
        throw new AppError(
          'FOREING_KEY_CONSTRAINT',
          400,
          'You can not delete slots with assignment or schedule',
          true
        );
      }

      throw new AppError('UNEXPECTED_ERROR', 500, 'Unexpected error', false);
    }
  }
}
