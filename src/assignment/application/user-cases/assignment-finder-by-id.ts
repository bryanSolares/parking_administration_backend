import { AssignmentRepository } from '@assignment-module-core/repositories/assignment-repository';
import { AssignmentEntity } from '@assignment-module-core/entities/assignment-entity';
import { AssignmentNotFoundError } from '@assignment-module-core/exceptions/assignment-not-found';

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
