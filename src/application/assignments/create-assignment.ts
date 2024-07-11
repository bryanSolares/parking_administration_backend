import { AssignmentEntity } from '@src/core/assignments/entities/assignment-entity';
import { AssignmentRepository } from '@src/core/assignments/repositories/assignment-repository';

export class CreateAssignment {
  constructor(private readonly assignmentRepository: AssignmentRepository) {}

  async run(assignment: AssignmentEntity): Promise<void> {
    return this.assignmentRepository.createAssignment(assignment);
  }
}
