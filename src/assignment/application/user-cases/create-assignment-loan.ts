import { AssignmentRepository } from '@assignment-module-core/repositories/assignment-repository';
import { AssignmentLoadEntity } from '@assignment-module-core/entities/assignment-load-entity';
import { AssignmentNotFoundError } from '@assignment-module-core/exceptions/assignment-not-found';

export class CreateAssignmentLoan {
  constructor(private readonly assignmentRepository: AssignmentRepository) {}

  async run(assignmentLoan: AssignmentLoadEntity) {
    const assignment = this.assignmentRepository.getAssignmentById(
      assignmentLoan.assignment_id
    );
    if (!assignment) {
      throw new AssignmentNotFoundError('Assignment not found');
    }

    //TODO: validate assignment have loan previously
    const assignmentLoanActive =
      await this.assignmentRepository.getAssignmentLoanActiveByIdAssignment(
        assignmentLoan.assignment_id
      );

    if (assignmentLoanActive) {
      throw new Error('Assignment already have loan');
    }

    await this.assignmentRepository.createAssignmentLoan(assignmentLoan);
  }
}
