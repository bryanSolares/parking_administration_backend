import { LocationRepository } from '@location-module-core/repositories/location-repository';
import { LocationEntity } from '@location-module-core/entities/location-entity';
import { LocationStatus } from '@location-module-core/entities/location-entity';
import { CostType } from '@src/location/core/entities/slot-entity';
import { VehicleType } from '@src/location/core/entities/slot-entity';
import { SlotStatus } from '@src/location/core/entities/slot-entity';
import { SlotType } from '@src/location/core/entities/slot-entity';
import { AppError } from '@src/server/config/err/AppError';

export class CreateLocation {
  constructor(private readonly locationRepository: LocationRepository) {}

  public async run(data: {
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
  }): Promise<void> {
    try {
      const locationEntity = LocationEntity.fromPrimitives(data);
      await this.locationRepository.createLocation(locationEntity);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(
        'UNKNOWN_ERROR',
        500,
        'Error not identified on create location use case',
        false
      );
    }
  }
}
