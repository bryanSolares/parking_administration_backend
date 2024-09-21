import { AssignmentRepository } from '@src/contexts/assignment/core/repositories/assignment-repository';
import { AssignmentLoadStatus } from '@src/contexts/assignment/core/entities/assignment-load-entity';
import { AppError } from '@src/contexts/shared/infrastructure/exception/AppError';

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
