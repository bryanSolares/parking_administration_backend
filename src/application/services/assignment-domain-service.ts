// assignment-domain-service.ts
import { AssignmentRepository } from '@src/core/assignments/repositories/assignment-repository';

export class AssignmentDomainService {
  constructor(public readonly assignmentRepository: AssignmentRepository) {}

  async validateEmployeeAssignment(employeeId: string): Promise<void> {
    if (
      await this.assignmentRepository.employeeHasAnActiveAssignment(employeeId)
    ) {
      throw new Error(`Employee already has an assignment: ${employeeId}`);
    }
  }

  async validateSlot(slotId: string): Promise<void> {
    if (!(await this.assignmentRepository.isAValidSlot(slotId))) {
      throw new Error('Slot not found, please create it first');
    }
  }

  async canCreateMoreSchedulesInSlot(slotId: string): Promise<void> {
    if (
      !(await this.assignmentRepository.canCreateMoreSchedulesInSlot(slotId))
    ) {
      throw new Error('Cant create more schedules in slot');
    }
  }
}
