import { AssignmentRepository } from '@assignment-module-core/repositories/assignment-repository';
import { DeAssignmentEntity } from '@assignment-module-core/entities/deassignment-entity';
import { DeAssignmentReady } from '@assignment-module-core/exceptions/de-assignment-ready';
import { AssignmentNotFoundError } from '@assignment-module-core/exceptions/assignment-not-found';

export class CreateDeAssignment {
  constructor(private readonly assignmentRepository: AssignmentRepository) {}

  async run(
    assignmentId: string,
    deAssignment: DeAssignmentEntity
  ): Promise<void> {
    const assignment =
      await this.assignmentRepository.getAssignmentById(assignmentId);

    if (!assignment) {
      throw new AssignmentNotFoundError('Assignment not found');
    }

    if (assignment?.status === 'INACTIVO') {
      throw new DeAssignmentReady('Assignment is already inactive');
    }

    return this.assignmentRepository.createDeAssignment(
      assignmentId,
      deAssignment
    );
  }
}
