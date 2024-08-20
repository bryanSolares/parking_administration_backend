import { AppError } from '@src/server/config/err/AppError';

import { LocationStatus } from '@src/location/core/entities/location-entity';
import { LocationRepository } from '@src/location/core/repositories/location-repository';
import { SlotStatus } from '@src/location/core/entities/slot-entity';
import { SlotType } from '@src/location/core/entities/slot-entity';
import { VehicleType } from '@src/location/core/entities/slot-entity';
import { CostType } from '../../core/entities/slot-entity';

export class ValidationsUseCases {
  constructor(private readonly locationRepository: LocationRepository) {}

  async validateIfCanUpdate(dataRequest: {
    locationId: string;
    locationStatus: LocationStatus;
    slots: {
      id: string;
      slotType: SlotType;
      vehicleType: VehicleType;
      costType: CostType;
    }[];
    slotsToDelete: Set<string>;
  }): Promise<void> {
    const ERROR_MESSAGES = {
      LOCATION_NOT_FOUND: 'Location not found',
      SLOT_NOT_BELONG: (id: string, message: string) =>
        `You cannot ${message} slot with id ${id} because it does not belong to location`,
      LOCATION_HAS_ACTIVE_ASSIGNMENT:
        'You cannot inactivate a location with active assignments',
      SLOT_OCCUPIED: 'You cannot update because it is occupied'
    };

    const [location, locationHasActiveAssignment] = await Promise.all([
      this.locationRepository.getLocationById(dataRequest.locationId),
      this.locationRepository.executeBoolFunction(
        'location_has_active_assignment',
        [dataRequest.locationId]
      )
    ]);

    if (!location) {
      throw new AppError(
        'LOCATION_NOT_FOUND',
        404,
        ERROR_MESSAGES.LOCATION_NOT_FOUND,
        true
      );
    }

    if (
      dataRequest.locationStatus === LocationStatus.INACTIVE &&
      location.status !== LocationStatus.INACTIVE &&
      locationHasActiveAssignment
    ) {
      throw new AppError(
        'LOCATION_HAS_ACTIVE_ASSIGNMENT',
        400,
        ERROR_MESSAGES.LOCATION_HAS_ACTIVE_ASSIGNMENT,
        true
      );
    }

    const slotIds = new Set(location.slots.map(slot => slot.id));

    // Validate if slots sent belong to location
    for (const slotRequest of dataRequest.slots) {
      if (!slotIds.has(slotRequest.id)) {
        throw new AppError(
          'SLOT_NOT_BELONG',
          400,
          ERROR_MESSAGES.SLOT_NOT_BELONG(slotRequest.id, 'update'),
          true
        );
      }
    }

    // Validate if slot to delete belong to location
    for (const slotId of dataRequest.slotsToDelete) {
      if (!slotIds.has(slotId)) {
        throw new AppError(
          'SLOT_NOT_BELONG',
          400,
          ERROR_MESSAGES.SLOT_NOT_BELONG(slotId, 'delete'),
          true
        );
      }
    }

    // Validate slots with "OCCUPIED" status
    for (const slotRequest of dataRequest.slots) {
      const slotCurrentData = location.slots.find(
        slt => slt.id === slotRequest.id && slt.status === SlotStatus.OCCUPIED
      );
      if (
        slotCurrentData &&
        (slotCurrentData.slotType !== slotRequest.slotType ||
          slotCurrentData.vehicleType !== slotRequest.vehicleType ||
          slotCurrentData.costType !== slotRequest.costType)
      ) {
        throw new AppError(
          'SLOT_OCCUPIED',
          400,
          ERROR_MESSAGES.SLOT_OCCUPIED,
          true
        );
      }
    }

    // Validate if can up or down slot schedules
  }
}
