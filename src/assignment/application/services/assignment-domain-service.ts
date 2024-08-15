import { AssignmentRepository } from '@assignment-module-core/repositories/assignment-repository';
import { LocationRepository } from '@location-module-core/repositories/location-repository';
import { AppError } from '@src/server/config/err/AppError';

export class AssignmentDomainService {
  constructor(
    public readonly assignmentRepository: AssignmentRepository,
    private readonly locationRepository: LocationRepository
  ) {}

  async slotIsMultipleType(slotId: string): Promise<boolean> {
    const slot = await this.locationRepository.getSlotById(slotId);
    return slot!.slot_type === 'MULTIPLE';
  }

  async validateIfEmployeeHasAnActiveAssignment(
    employeeId: string
  ): Promise<void> {
    if (
      await this.assignmentRepository.employeeHasAnActiveAssignment(employeeId)
    ) {
      throw new AppError(
        'EMPLOYEE_WITH_ACTIVE_ASSIGNMENT',
        400,
        `Employee already has an assignment: ${employeeId}`,
        true
      );
    }
  }

  async canCreateMoreSchedulesInSlot(slotId: string): Promise<void> {
    if (
      !(await this.assignmentRepository.canCreateMoreSchedulesInSlot(slotId))
    ) {
      throw new AppError(
        'CANT_CREATE_MORE_SCHEDULES_IN_SLOT',
        400,
        'Cant create more schedules in slot',
        true
      );
    }
  }

  async verifyIfSlotCanHaveSchedules(slotId: string): Promise<void> {
    const slot = await this.locationRepository.getSlotById(slotId);

    if (slot?.slot_type === 'single') {
      throw new AppError(
        'SLOT_CANT_HAVE_SCHEDULES',
        400,
        'Slot cant have schedules',
        true
      );
    }
  }

  async verifyIfSlotExistsAndIsAvailable(slotId: string): Promise<void> {
    const slot = await this.locationRepository.getSlotById(slotId);

    if (!slot) {
      throw new AppError('SLOT_NOT_FOUND', 404, 'Slot not found', true);
    }

    if (slot.status === 'INACTIVO' || slot.status === 'OCUPADO') {
      throw new AppError('SLOT_NOT_AVAILABLE', 400, 'Slot not available', true);
    }

    const location = await this.locationRepository.getLocationById(
      slot?.location_id
    );

    if (location?.status !== 'ACTIVO') {
      throw new AppError(
        'LOCATION_NOT_ACTIVE',
        400,
        'Location not active',
        true
      );
    }
  }
}
