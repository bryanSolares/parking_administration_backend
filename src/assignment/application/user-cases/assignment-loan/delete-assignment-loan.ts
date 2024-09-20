import { AssignmentRepository } from '@assignment-module-core/repositories/assignment-repository';
import { AssignmentLoadStatus } from '@src/assignment/core/entities/assignment-load-entity';
import { AppError } from '@src/server/config/err/AppError';

export class DeleteAssignmentLoan {
  constructor(private readonly assignmentRepository: AssignmentRepository) {}

  async run(assignmentLoanId: string): Promise<void> {
    const assignmentLoan = await this.assignmentRepository.getAssignmentLoanById(assignmentLoanId);

    if (!assignmentLoan || assignmentLoan.status === AssignmentLoadStatus.INACTIVE) {
      throw new AppError('ASSIGNMENT_LOAN_NOT_FOUND', 404, 'Assignment loan not found', true);
    }

    return this.assignmentRepository.deleteAssignmentLoan(assignmentLoanId);
  }
}
