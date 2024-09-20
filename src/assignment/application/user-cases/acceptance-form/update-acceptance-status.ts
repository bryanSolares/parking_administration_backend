import { AssignmentStatus } from '@src/assignment/core/entities/assignment-entity';
import { AssignmentRepository } from '@src/assignment/core/repositories/assignment-repository';
import { AppError } from '@src/shared/infrastructure/server/config/err/AppError';

export class UpdateAcceptanceStatusUseCase {
  constructor(private readonly assignmentRepository: AssignmentRepository) {}

  async run(assignmentId: string, status: AssignmentStatus.ACCEPTED | AssignmentStatus.CANCELLED | AssignmentStatus.REJECTED) {
    const assignment = await this.assignmentRepository.getAssignmentById(assignmentId);

    if (!assignment) {
      throw new AppError('ASSIGNMENT_NOT_FOUND', 404, 'Assignment not found', true);
    }

    if (assignment.status !== AssignmentStatus.IN_PROGRESS) {
      throw new AppError('ASSIGNMENT_NOT_VALID', 400, 'The assignment is not in progress of acceptance', true);
    }

    await this.assignmentRepository.changeStatusAssignment(assignmentId, status);
  }
}
