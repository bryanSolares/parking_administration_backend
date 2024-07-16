import { AssignmentEntity } from '@src/core/assignments/entities/assignment-entity';
import { AssignmentRepository } from '@src/core/assignments/repositories/assignment-repository';
import { AssignmentDomainService } from '../services/assignment-domain-service';

export class CreateAssignment {
  constructor(
    private readonly assignmentRepository: AssignmentRepository,
    private readonly assignmentDomainService: AssignmentDomainService
  ) {}

  async run(assignment: AssignmentEntity): Promise<void> {
    if (assignment.employee.id) {
      await this.assignmentDomainService.validateEmployeeAssignment(
        assignment.employee.id
      );
    }

    if (assignment.assignment_loan?.employee.id) {
      if (assignment.assignment_loan) {
        await this.assignmentDomainService.validateEmployeeAssignment(
          assignment.assignment_loan.employee.id
        );
      }
    }

    await this.assignmentDomainService.validateSlot(assignment.slot_id);

    if (assignment.schedule) {
      await this.assignmentDomainService.canCreateMoreSchedulesInSlot(
        assignment.slot_id
      );
    }

    return this.assignmentRepository.createAssignment(assignment);
  }
}
