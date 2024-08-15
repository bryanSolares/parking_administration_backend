import { AssignmentRepository } from '@assignment-module-core/repositories/assignment-repository';
import { NotificationService } from '../services/notification-service';
import { DeAssignmentEntity } from '@assignment-module-core/entities/deassignment-entity';
import { AppError } from '@src/server/config/err/AppError';

export class CreateDeAssignment {
  constructor(
    private readonly assignmentRepository: AssignmentRepository,
    private readonly notificationService: NotificationService
  ) {}

  async run(
    assignmentId: string,
    deAssignment: DeAssignmentEntity
  ): Promise<void> {
    const assignment =
      await this.assignmentRepository.getAssignmentById(assignmentId);

    if (!assignment) {
      throw new AppError(
        'ASSIGNMENT_NOT_FOUND',
        404,
        'Assignment not found',
        true
      );
    }

    if (assignment?.status === 'INACTIVO') {
      throw new AppError(
        'INACTIVE_ASSIGNMENT',
        400,
        'Assignment is already inactive',
        true
      );
    }

    await this.assignmentRepository.createDeAssignment(
      assignmentId,
      deAssignment
    );

    const owner = {
      name: assignment.employee.name,
      email: assignment.employee.email
    };

    const guest = assignment.assignment_loan
      ? {
          name: assignment.assignment_loan.employee.name,
          email: assignment.assignment_loan.employee.email
        }
      : null;

    this.notificationService.createDeAssignmentNotification(owner, guest);
  }
}
