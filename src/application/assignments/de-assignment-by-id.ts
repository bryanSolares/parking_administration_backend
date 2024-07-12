import { AssignmentRepository } from '../../core/assignments/repositories/assignment-repository';
import { DeAssignmentEntity } from '../../core/assignments/entities/deassignment-entity';
import { DeAssignmentReady } from '@src/core/assignments/exceptions/de-assignment-ready';

export class DeAssignmentById {
  constructor(private readonly assignmentRepository: AssignmentRepository) {}

  async run(
    assignmentId: string,
    deAssignment: DeAssignmentEntity
  ): Promise<void> {
    const assignment =
      await this.assignmentRepository.getAssignmentById(assignmentId);

    if (assignment?.status === 'INACTIVO') {
      throw new DeAssignmentReady('Assignment is already inactive');
    }

    return this.assignmentRepository.deAssignmentById(
      assignmentId,
      deAssignment
    );
  }
}
