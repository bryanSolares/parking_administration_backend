import { AssignmentRepository } from '@src/core/assignments/repositories/assignment-repository';
import { LocationRepository } from '@src/core/repositories/location-repository';

export class AssignmentDomainService {
  constructor(
    public readonly assignmentRepository: AssignmentRepository,
    private readonly locationRepository: LocationRepository
  ) {}

  async validateIfEmployeeHasAnActiveAssignment(
    employeeId: string
  ): Promise<void> {
    if (
      await this.assignmentRepository.employeeHasAnActiveAssignment(employeeId)
    ) {
      throw new Error(`Employee already has an assignment: ${employeeId}`);
    }
  }

  async canCreateMoreSchedulesInSlot(slotId: string): Promise<void> {
    if (
      !(await this.assignmentRepository.canCreateMoreSchedulesInSlot(slotId))
    ) {
      throw new Error('Cant create more schedules in slot');
    }
  }

  async verifyIfSlotCanHaveSchedules(slotId: string): Promise<void> {
    const slot = await this.locationRepository.getSlotById(slotId);

    if (slot?.slot_type === 'single') {
      throw new Error('Slot cant have schedules');
    }
  }

  async verifyIfSlotExistsAndIsAvailable(slotId: string): Promise<void> {
    const slot = await this.locationRepository.getSlotById(slotId);

    if (!slot) {
      throw new Error('Slot not found');
    }

    if (slot.status === 'INACTIVO' || slot.status === 'OCUPADO') {
      throw new Error('Slot is not available');
    }
  }
}
