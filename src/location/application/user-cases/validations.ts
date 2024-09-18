import { AppError } from '@src/server/config/err/AppError';
import { LocationEntity } from '@src/location/core/entities/location-entity';
import { LocationStatus } from '@src/location/core/entities/location-entity';
import { LocationRepository } from '@src/location/core/repositories/location-repository';
import { SlotEntity } from '@src/location/core/entities/slot-entity';
import { SlotStatus } from '@src/location/core/entities/slot-entity';
import { SlotType } from '@src/location/core/entities/slot-entity';
import { VehicleType } from '@src/location/core/entities/slot-entity';
import { BenefitType } from '@src/location/core/entities/slot-entity';

export class ValidationsUseCases {
  constructor(private readonly locationRepository: LocationRepository) {}

  async validateIfCanUpdate(dataRequest: {
    locationId: string;
    locationStatus: LocationStatus;
    slots: {
      id: string;
      slotType: SlotType;
      vehicleType: VehicleType;
      benefitType: BenefitType;
      status: SlotStatus;
      limitOfAssignments: number;
      amount: number;
    }[];
    slotsToDelete: Set<string>;
  }): Promise<void> {
    const [location, locationHasActiveAssignment, activeAssignmentForLocation] =
      await this.loadData(dataRequest.locationId);

    const newSlots = dataRequest.slots.filter(slot => !slot.id);
    const oldSlots = dataRequest.slots.filter(slot => slot.id);

    this.validateLocationExists(location);
    this.validateIfNewSlotsAreValid(newSlots);
    this.validateIfSlotsToDeleteCanBeDeleted(
      dataRequest.slotsToDelete,
      location!.slots
    );

    this.validateLocationStatus(
      dataRequest.locationStatus,
      location!.status,
      locationHasActiveAssignment
    );

    this.validateSlotsBelongToLocation(
      oldSlots,
      dataRequest.slotsToDelete,
      location!.slots
    );

    this.validateOccupiedSlots(oldSlots, location!.slots);

    this.validateIfChangeMaxNumberOfAssignments(
      oldSlots,
      activeAssignmentForLocation
    );
  }

  private validateIfSlotsToDeleteCanBeDeleted(
    slotsToDelete: Set<string>,
    slots: SlotEntity[]
  ): void {
    const occupiedSlotsMap = new Map(
      slots
        .filter(slot => slot.status === SlotStatus.OCCUPIED)
        .map(slot => [slot.id, slot])
    );

    const hasAnyInvalidSlotId = Array.from(slotsToDelete).some(slotId =>
      occupiedSlotsMap.has(slotId)
    );

    if (hasAnyInvalidSlotId) {
      throw new AppError(
        'FOREIGN_KEY_CONSTRAINT',
        400,
        `You cannot delete a slot with active assignments`,
        true
      );
    }
  }

  private validateIfNewSlotsAreValid(
    slots: {
      id: string;
      slotType: SlotType;
      vehicleType: VehicleType;
      benefitType: BenefitType;
      status: SlotStatus;
      limitOfAssignments: number;
      amount: number;
    }[]
  ) {
    slots.forEach(slot => {
      if (!slot.id && slot.status === SlotStatus.OCCUPIED) {
        throw new AppError(
          'SLOT_NOT_VALID',
          400,
          'You cannot create a slot with occupied status',
          true
        );
      }
    });
  }

  private async loadData(locationId: string) {
    return await Promise.all([
      this.locationRepository.getLocationById(locationId),
      this.locationRepository.executeFunction<boolean>(
        'location_has_active_assignment',
        [locationId]
      ),
      this.locationRepository.callProcedure<
        {
          slot_id: string;
          location_id: string;
          current_number_of_assignments: number;
          limit_of_assignments: number;
        }[]
      >('get_active_assignments_by_location', [locationId])
    ]);
  }

  private validateLocationExists(location: LocationEntity | null): void {
    if (!location) {
      throw new AppError('LOCATION_NOT_FOUND', 404, 'Location not found', true);
    }
  }

  private validateLocationStatus(
    newStatus: LocationStatus,
    currentStatus: LocationStatus,
    hasActiveAssignment: boolean
  ): void {
    if (
      newStatus === LocationStatus.INACTIVE &&
      currentStatus !== LocationStatus.INACTIVE &&
      hasActiveAssignment
    ) {
      throw new AppError(
        'LOCATION_HAS_ACTIVE_ASSIGNMENT',
        400,
        'You cannot inactivate a location with active assignments',
        true
      );
    }
  }

  private validateSlotsBelongToLocation(
    slotsRequest: {
      id: string;
      slotType: SlotType;
      vehicleType: VehicleType;
      benefitType: BenefitType;
      status: SlotStatus;
      limitOfAssignments: number;
      amount: number;
    }[],
    slotsToDelete: Set<string>,
    locationSlots: SlotEntity[]
  ): void {
    const slotIds = new Set(locationSlots.map(slot => slot.id));

    for (const slotRequest of slotsRequest) {
      if (!slotIds.has(slotRequest.id)) {
        throw new AppError(
          'SLOT_NOT_BELONG',
          400,
          `You cannot update slot with id ${slotRequest.id} because it does not belong to location`,
          true
        );
      }
    }

    for (const slotIdToDelete of slotsToDelete) {
      if (!slotIds.has(slotIdToDelete)) {
        throw new AppError(
          'SLOT_NOT_BELONG',
          400,
          `You cannot delete slot with id ${slotIdToDelete} because it does not belong to location`,
          true
        );
      }
    }
  }

  private validateOccupiedSlots(
    slotsRequest: {
      id: string;
      slotType: SlotType;
      vehicleType: VehicleType;
      benefitType: BenefitType;
      status: SlotStatus;
      limitOfAssignments: number;
      amount: number;
    }[],
    locationSlots: SlotEntity[]
  ): void {
    const slotsOccupiedMap = new Map(locationSlots.map(slt => [slt.id, slt]));

    slotsRequest.forEach(slotRequest => {
      const slotCurrentData = slotsOccupiedMap.get(slotRequest.id);

      if (!slotCurrentData) return;

      const isStatusChangingToOccupied =
        slotRequest.status === SlotStatus.OCCUPIED &&
        slotCurrentData.status !== SlotStatus.OCCUPIED;

      const isStatusChangingFromOccupied =
        slotRequest.status !== SlotStatus.OCCUPIED &&
        slotCurrentData.status === SlotStatus.OCCUPIED;

      const isChangingImportantAttributes =
        slotCurrentData.status === SlotStatus.OCCUPIED &&
        (slotCurrentData.slotType !== slotRequest.slotType ||
          slotCurrentData.vehicleType !== slotRequest.vehicleType ||
          slotCurrentData.benefitType !== slotRequest.benefitType ||
          slotCurrentData.amount !== slotRequest.amount);

      if (
        isStatusChangingToOccupied ||
        isStatusChangingFromOccupied ||
        isChangingImportantAttributes
      ) {
        throw new AppError(
          'SLOT_OCCUPIED',
          400,
          'You cannot update properties slotType, vehicleType, benefitType, status, amount if it is occupied',
          true
        );
      }
    });
  }

  private validateIfChangeMaxNumberOfAssignments(
    slotsRequest: {
      id: string;
      slotType: SlotType;
      vehicleType: VehicleType;
      benefitType: BenefitType;
      status: SlotStatus;
      limitOfAssignments: number;
      amount: number;
    }[],
    schedulesOfSlots: {
      slot_id: string;
      current_number_of_assignments: number;
      limit_of_assignments: number;
    }[]
  ): void {
    if (schedulesOfSlots.length === 0) return;

    const scheduleDataMap = schedulesOfSlots.reduce(
      (acc, slot) => {
        acc[slot.slot_id] = slot;
        return acc;
      },
      {} as Record<
        string,
        {
          slot_id: string;
          current_number_of_assignments: number;
          limit_of_assignments: number;
        }
      >
    );

    const slotsOccupiedDataRequest = slotsRequest.filter(
      slotRequest => slotRequest.status === SlotStatus.OCCUPIED
    );

    slotsOccupiedDataRequest.forEach(slotRequest => {
      const scheduleDataSlotDatabase = scheduleDataMap[slotRequest.id];
      if (
        slotRequest.limitOfAssignments <
        scheduleDataSlotDatabase.current_number_of_assignments
      ) {
        throw new AppError(
          'CANT_UPDATE_SLOT_SCHEDULES',
          400,
          `Number of schedules in slot ${slotRequest.id} cannot be less than the number of schedules already assigned`,
          true
        );
      }
    });
  }
}
