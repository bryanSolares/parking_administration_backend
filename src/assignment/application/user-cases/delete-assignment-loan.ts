import { AssignmentRepository } from '@assignment-module-core/repositories/assignment-repository';
import { AppError } from '@src/server/config/err/AppError';

export class DeleteAssignmentLoan {
  constructor(private readonly assignmentRepository: AssignmentRepository) {}

  async run(assignmentLoanId: string): Promise<void> {
    const assignmentLoan =
      await this.assignmentRepository.getAssignmentLoanById(assignmentLoanId);

    if (!assignmentLoan || assignmentLoan.status === 'INACTIVO') {
      throw new AppError(
        'ASSIGNMENT_LOAN_NOT_FOUND',
        404,
        'Assignment loan not found',
        true
      );
    }

    return this.assignmentRepository.deleteAssignmentLoan(assignmentLoanId);
  }
}
