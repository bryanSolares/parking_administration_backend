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
    let locationEntity: LocationEntity;
    try {
      locationEntity = LocationEntity.fromPrimitives(data);
    } catch (error) {
      const e = error as Error;
      throw new AppError('VALIDATION_ENTITY', 400, e.message, true);
    }
    await this.locationRepository.createLocation(locationEntity);
  }
}
