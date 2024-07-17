import { AssignmentEntity } from '@src/core/assignments/entities/assignment-entity';
import { AssignmentNotFoundError } from '@src/core/assignments/exceptions/assignment-not-found';
import { AssignmentRepository } from '@src/core/assignments/repositories/assignment-repository';

export class AssignmentFinderById {
  constructor(private readonly assignmentRepository: AssignmentRepository) {}

  async run(id: string): Promise<AssignmentEntity | null> {
    const assignment = await this.assignmentRepository.getAssignmentById(id);

    if (!assignment) {
      throw new AssignmentNotFoundError('Assignment not found');
    }

    return assignment;
  }
}
