import { ForeignKeyConstraintError } from 'sequelize';
import { LocationRepository } from '@location-module-core/repositories/location-repository';
import { LocationEntity } from '@location-module-core/entities/location-entity';
import { AppError } from '@src/server/config/err/AppError';

export class UpdateLocation {
  constructor(private readonly locationRepository: LocationRepository) {}

  public async run(
    location: LocationEntity,
    slotsToDelete: string[]
  ): Promise<void> {
    const locationExists = await this.locationRepository.getLocationById(
      location.id
    );

    if (!locationExists) {
      throw new AppError('LOCATION_NOT_FOUND', 404, 'Location not found', true);
    }

    try {
      await this.locationRepository.updateLocation(location, slotsToDelete);
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
