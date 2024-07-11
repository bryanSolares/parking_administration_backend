import { AssignmentEntity } from '@src/core/assignments/entities/assignment-entity';
import { AssignmentRepository } from '@src/core/assignments/repositories/assignment-repository';

export class AssignmentFinderById {
  constructor(private readonly assignmentRepository: AssignmentRepository) {}

  async run(id?: string): Promise<AssignmentEntity | null> {
    return this.assignmentRepository.getAssignmentById(id);
  }
}
