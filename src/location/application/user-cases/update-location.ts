import { ForeignKeyConstraintError } from 'sequelize';
import { LocationRepository } from '@location-module-core/repositories/location-repository';
import {
  LocationEntity,
  LocationStatus
} from '@location-module-core/entities/location-entity';
import { AppError } from '@src/server/config/err/AppError';
import {
  SlotType,
  SlotStatus,
  CostType,
  VehicleType
} from '@src/location/core/entities/slot-entity';
import { ValidationsUseCases } from './validations';

export class UpdateLocation {
  constructor(
    private readonly locationRepository: LocationRepository,
    private readonly validationsUseCases: ValidationsUseCases
  ) {}

  public async run(
    data: {
      id: string;
      name: string;
      address: string;
      contactReference: string;
      phone: string;
      email: string;
      comments: string;
      status: LocationStatus;
      slots: {
        id: string;
        slotNumber: string;
        slotType: SlotType;
        limitSchedules: number;
        status: SlotStatus;
        costType: CostType;
        vehicleType: VehicleType;
        cost: number;
      }[];
    },
    slotsToDelete: Set<string>
  ): Promise<void> {
    try {
      await this.validationsUseCases.validateIfCanUpdate({
        locationId: data.id,
        locationStatus: data.status,
        slots: data.slots.filter(slot => slot.id),
        slotsToDelete: new Set(slotsToDelete)
      });

      const locationEntity = LocationEntity.fromPrimitives(data);

      await this.locationRepository.updateLocation(
        locationEntity,
        slotsToDelete
      );
    } catch (error) {
      if (error instanceof ForeignKeyConstraintError) {
        throw new AppError(
          'FOREING_KEY_CONSTRAINT',
          400,
          'You can not delete slots with assignment or schedule',
          true
        );
      }

      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(
        'UNKNOWN_ERROR',
        500,
        'Error not identified on update location use case',
        false
      );
    }
  }
}
