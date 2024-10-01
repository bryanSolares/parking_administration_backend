import { v4 as uuid } from 'uuid';

import { AssignmentRepository } from '@src/contexts/assignment/core/repositories/assignment-repository';
import { AssignmentStatus } from '@src/contexts/assignment/core/entities/assignment-entity';
import { DeAssignmentEntity } from '@src/contexts/assignment/core/entities/deassignment-entity';
import { AppError } from '@src/contexts/shared/infrastructure/exception/AppError';
import { EventType } from '@src/contexts/shared/core/notification_queue';
import { EventNotificationService } from '@src/contexts/shared/application/event-notification-service';

export class CreateDeAssignment {
  constructor(
    private readonly assignmentRepository: AssignmentRepository,
    private readonly eventNotificationService: EventNotificationService
  ) {}

  async run(data: { deAssignmentData: { reason: string; deAssignmentDate: string }; assignmentId: string }): Promise<void> {
    const assignment = await this.assignmentRepository.getAssignmentById(data.assignmentId);

    if (!assignment) {
      throw new AppError('ASSIGNMENT_NOT_FOUND', 404, 'Assignment not found', true);
    }

    if (assignment.status !== AssignmentStatus.ACCEPTED) {
      throw new AppError('INVALID_ASSIGNMENT', 400, 'This assignment is not accepted, status is not valid', true);
    }

    const deAssignment = new DeAssignmentEntity(
      uuid(),
      assignment.id,
      data.deAssignmentData.reason,
      data.deAssignmentData.deAssignmentDate,
      false
    );

    await this.assignmentRepository.createDeAssignment(deAssignment);

    await this.eventNotificationService.publish({
      eventType: EventType.MANUAL_DE_ASSIGNMENT,
      transactionId: assignment.id,
      destinations: [assignment.employee.email],
      destinationsCC: []
    });
  }
}
