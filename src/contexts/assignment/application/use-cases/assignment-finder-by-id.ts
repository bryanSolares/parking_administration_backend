import { AssignmentRepository } from '@src/contexts/assignment/core/repositories/assignment-repository';
import { FinderResultById } from '@src/contexts/assignment/core/repositories/assignment-repository';
import { AppError } from '@src/contexts/shared/infrastructure/exception/AppError';

export class AssignmentFinderById {
  constructor(private readonly assignmentRepository: AssignmentRepository) {}

  async run(id: string): Promise<FinderResultById> {
    const assignment = await this.assignmentRepository.getAssignmentById(id);

    if (!assignment) {
      throw new AppError('ASSIGNMENT_NOT_FOUND', 404, 'Assignment not found', true);
    }

    return assignment;
  }
}
