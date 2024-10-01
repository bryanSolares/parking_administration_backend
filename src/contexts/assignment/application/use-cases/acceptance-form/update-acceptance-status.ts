import { AssignmentStatus } from '@src/contexts/assignment/core/entities/assignment-entity';
import { AssignmentRepository } from '@src/contexts/assignment/core/repositories/assignment-repository';
import { EventType } from '@src/contexts/shared/core/notification_queue';
import { AppError } from '@src/contexts/shared/infrastructure/exception/AppError';
import { EventNotificationService } from '@src/contexts/shared/application/event-notification-service';

export class UpdateAcceptanceStatusUseCase {
  constructor(
    private readonly assignmentRepository: AssignmentRepository,
    private readonly eventNotificationService: EventNotificationService
  ) {}

  async run(assignmentId: string, status: AssignmentStatus.ACCEPTED | AssignmentStatus.CANCELLED | AssignmentStatus.REJECTED) {
    const assignment = await this.assignmentRepository.getAssignmentById(assignmentId);

    if (!assignment) {
      throw new AppError('ASSIGNMENT_NOT_FOUND', 404, 'Assignment not found', true);
    }

    if (assignment.status !== AssignmentStatus.IN_PROGRESS) {
      throw new AppError('ASSIGNMENT_NOT_VALID', 400, 'The assignment is not in progress of acceptance', true);
    }

    await this.assignmentRepository.changeStatusAssignment(assignmentId, status);

    if (status === AssignmentStatus.ACCEPTED) {
      await this.eventNotificationService.publish({
        eventType: EventType.ACCEPTANCE_ASSIGNMENT,
        transactionId: assignment.id,
        destinations: [assignment.employee.email],
        destinationsCC: []
      });
    }
  }
}
