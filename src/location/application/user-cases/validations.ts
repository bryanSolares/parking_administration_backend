import { AppError } from '@src/server/config/err/AppError';
import { LocationEntity } from '@src/location/core/entities/location-entity';
import { LocationStatus } from '@src/location/core/entities/location-entity';
import { LocationRepository } from '@src/location/core/repositories/location-repository';
import { SlotEntity } from '@src/location/core/entities/slot-entity';
import { SlotStatus } from '@src/location/core/entities/slot-entity';
import { SlotType } from '@src/location/core/entities/slot-entity';
import { VehicleType } from '@src/location/core/entities/slot-entity';
import { CostType } from '@src/location/core/entities/slot-entity';

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
      status: SlotStatus;
      limitSchedules: number;
      cost: number;
    }[];
    slotsToDelete: Set<string>;
  }): Promise<void> {
    const [location, locationHasActiveAssignment, schedulesOfSlots] =
      await this.loadData(dataRequest.locationId);

    this.validateLocationExists(location);

    this.validateLocationStatus(
      dataRequest.locationStatus,
      location!.status,
      locationHasActiveAssignment
    );

    this.validateSlotsBelongToLocation(
      dataRequest.slots,
      dataRequest.slotsToDelete,
      location!.slots
    );

    this.validateOccupiedSlots(dataRequest.slots, location!.slots);

    this.validateSlotSchedules(dataRequest.slots, schedulesOfSlots);
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
          current_number_of_schedules_used: number;
          limit_schedules: number;
        }[]
      >('get_slot_schedules_by_location', [locationId])
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
      costType: CostType;
      status: SlotStatus;
      limitSchedules: number;
      cost: number;
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
      costType: CostType;
      status: SlotStatus;
      limitSchedules: number;
      cost: number;
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
          slotCurrentData.costType !== slotRequest.costType ||
          slotCurrentData.cost !== slotRequest.cost);

      if (
        isStatusChangingToOccupied ||
        isStatusChangingFromOccupied ||
        isChangingImportantAttributes
      ) {
        throw new AppError(
          'SLOT_OCCUPIED',
          400,
          'You cannot update properties slotType, vehicleType, costType, status, cost if it is occupied',
          true
        );
      }
    });
  }

  private validateSlotSchedules(
    slotsRequest: {
      id: string;
      slotType: SlotType;
      vehicleType: VehicleType;
      costType: CostType;
      status: SlotStatus;
      limitSchedules: number;
      cost: number;
    }[],
    schedulesOfSlots: {
      slot_id: string;
      current_number_of_schedules_used: number;
      limit_schedules: number;
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
          current_number_of_schedules_used: number;
          limit_schedules: number;
        }
      >
    );

    const slotsOccupiedDataRequest = slotsRequest.filter(
      slotRequest => slotRequest.status === SlotStatus.OCCUPIED
    );

    slotsOccupiedDataRequest.forEach(slotRequest => {
      const scheduleDataSlotDatabase = scheduleDataMap[slotRequest.id];
      if (
        slotRequest.limitSchedules <
        scheduleDataSlotDatabase.current_number_of_schedules_used
      ) {
        throw new AppError(
          'CANT_UPDATE_SLOT_SCHEDULES',
          400,
          `Number of schedules in slot ${slotRequest.id} cannot be greater than the number of schedules already assigned`,
          true
        );
      }
    });
  }
}
