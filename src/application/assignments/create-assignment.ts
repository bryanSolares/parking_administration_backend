import { AssignmentEntity } from '@src/core/assignments/entities/assignment-entity';
import { AssignmentRepository } from '@src/core/assignments/repositories/assignment-repository';
import { AssignmentDomainService } from '../services/assignment-domain-service';

export class CreateAssignment {
  constructor(
    private readonly assignmentRepository: AssignmentRepository,
    private readonly assignmentDomainService: AssignmentDomainService
  ) {}

  async run(assignment: AssignmentEntity): Promise<void> {
    const owner = assignment.employee;
    const guest = assignment.assignment_loan?.employee;
    const schedule = assignment.schedule;

    await this.assignmentDomainService.verifyIfSlotExistsAndIsAvailable(
      assignment.slot_id
    );

    if (owner.id) {
      await this.assignmentDomainService.validateIfEmployeeHasAnActiveAssignment(
        owner.id
      );
    }

    if (guest?.id) {
      await this.assignmentDomainService.validateIfEmployeeHasAnActiveAssignment(
        guest.id
      );
    }

    if (schedule) {
      await this.assignmentDomainService.verifyIfSlotCanHaveSchedules(
        assignment.slot_id
      );

      await this.assignmentDomainService.canCreateMoreSchedulesInSlot(
        assignment.slot_id
      );
    }

    //TODO: Email to RRHH if slot is type cost

    //TODO: Welcome email to owner

    //TODO: Welcome email to guest

    return this.assignmentRepository.createAssignment(assignment);
  }
}
