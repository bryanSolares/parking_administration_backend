import { v4 as uuid } from 'uuid';

import { AssignmentStatus } from '@src/contexts/assignment/core/entities/assignment-entity';
import { AssignmentRepository } from '@src/contexts/assignment/core/repositories/assignment-repository';
import { EventStatus, EventType, NotificationQueue } from '@src/contexts/shared/core/notification_queue';
import { NotificationQueueRepository } from '@src/contexts/shared/core/repositories.ts/notification-queue-repository';
import { AppError } from '@src/contexts/shared/infrastructure/exception/AppError';

export class UpdateAcceptanceStatusUseCase {
  constructor(
    private readonly assignmentRepository: AssignmentRepository,
    private readonly notification: NotificationQueueRepository
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
      const notificationEntity = new NotificationQueue(
        uuid(),
        EventType.ACCEPTANCE_ASSIGNMENT,
        assignment.id,
        EventStatus.PENDING
      );
      await this.notification.create(notificationEntity);
    }
  }
}
