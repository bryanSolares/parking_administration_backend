import { AssignmentRepository } from '../../core/assignments/repositories/assignment-repository';
import { DeAssignmentEntity } from '../../core/assignments/entities/deassignment-entity';

export class DeAssignmentById {
  constructor(private readonly assignmentRepository: AssignmentRepository) {}

  async run(
    assignmentId: string,
    deAssignment: DeAssignmentEntity
  ): Promise<void> {
    return this.assignmentRepository.deAssignmentById(
      assignmentId,
      deAssignment
    );
  }
}
