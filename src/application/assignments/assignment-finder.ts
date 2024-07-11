import { AssignmentEntity } from '@src/core/assignments/entities/assignment-entity';
import { AssignmentRepository } from '@src/core/assignments/repositories/assignment-repository';

export class AssignmentFinder {
  constructor(private readonly assignmentRepository: AssignmentRepository) {}

  async run(): Promise<AssignmentEntity[] | null> {
    return this.assignmentRepository.getAssignments();
  }
}
