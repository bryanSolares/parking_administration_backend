import {
  AssignmentByIdResult,
  AssignmentRepository
} from '@assignment-module-core/repositories/assignment-repository';
import { AppError } from '@src/server/config/err/AppError';

export class AssignmentFinderById {
  constructor(private readonly assignmentRepository: AssignmentRepository) {}

  async run(id: string): Promise<AssignmentByIdResult> {
    const assignment = await this.assignmentRepository.getAssignmentById(id);

    if (!assignment) {
      throw new AppError(
        'ASSIGNMENT_NOT_FOUND',
        404,
        'Assignment not found',
        true
      );
    }

    return assignment;
  }
}
