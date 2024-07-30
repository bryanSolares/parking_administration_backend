import { AssignmentRepository } from '@assignment-module-core/repositories/assignment-repository';
import { AssignmentNotFoundError } from '@src/assignment/core/exceptions/assignment-not-found';

export class DeleteAssignmentLoan {
  constructor(private readonly assignmentRepository: AssignmentRepository) {}

  async run(assignmentId: string): Promise<void> {
    const assignmentLoan =
      await this.assignmentRepository.getAssignmentLoanActiveByIdAssignment(
        assignmentId
      );

    if (!assignmentLoan || assignmentLoan.status === 'INACTIVO') {
      throw new AssignmentNotFoundError('Assignment not found');
    }

    return this.assignmentRepository.deleteAssignmentLoan(assignmentId);
  }
}
