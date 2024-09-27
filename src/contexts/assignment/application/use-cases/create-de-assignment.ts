import { v4 as uuid } from 'uuid';

import { AssignmentRepository } from '@src/contexts/assignment/core/repositories/assignment-repository';
import { AssignmentStatus } from '@src/contexts/assignment/core/entities/assignment-entity';
import { DeAssignmentEntity } from '@src/contexts/assignment/core/entities/deassignment-entity';
import { AppError } from '@src/contexts/shared/infrastructure/exception/AppError';
import { NotificationQueueRepository } from '@src/contexts/shared/core/repositories.ts/notification-queue-repository';
import {
  EventStatus,
  EventType,
  NotificationQueue,
  Payload,
  SenderType,
  TargetType
} from '@src/contexts/shared/core/notification_queue';

export class CreateDeAssignment {
  constructor(
    private readonly assignmentRepository: AssignmentRepository,
    private readonly notification: NotificationQueueRepository
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
    const notification = new NotificationQueue(
      uuid(),
      EventType.MANUAL_DE_ASSIGNMENT,
      {
        transactionId: assignment.id,
        destinations: [
          {
            sender: SenderType.EMAIL,
            address: assignment.employee.email,
            target: TargetType.TO
          }
        ]
      } satisfies Payload,
      EventStatus.PENDING
    );
    await this.notification.create(notification);

    // const owner = {
    //   name: assignment.employee.name,
    //   email: assignment.employee.email
    // };
    // const guest = assignment.assignment_loan
    //   ? {
    //       name: assignment.assignment_loan.employee.name,
    //       email: assignment.assignment_loan.employee.email
    //     }
    //   : null;
    // this.notificationService.createDeAssignmentNotification(owner, guest);
  }
}
