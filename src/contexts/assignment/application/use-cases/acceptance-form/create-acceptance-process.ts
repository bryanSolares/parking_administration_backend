import { AssignmentStatus } from '@src/contexts/assignment/core/entities/assignment-entity';
import { AssignmentRepository } from '@src/contexts/assignment/core/repositories/assignment-repository';
import { EventType } from '@src/contexts/shared/core/notification_queue';
import { AppError } from '@src/contexts/shared/infrastructure/exception/AppError';
import { EventNotificationService } from '@src/contexts/shared/application/event-notification-service';

export class CreateAcceptanceProcessUseCase {
  constructor(
    private readonly assignmentRepository: AssignmentRepository,
    private readonly eventNotificationService: EventNotificationService
  ) {}

  async run(
    data: {
      headEmployeeData: {
        employeeCode: string;
        name: string;
        phone: string;
        email: string;
        subManagement: string;
        management1: string;
      };
      assignmentDate: string;
    },
    assignmentId: string
  ) {
    const assignment = await this.assignmentRepository.getAssignmentById(assignmentId);

    if (!assignment) {
      throw new AppError('ASSIGNMENT_NOT_FOUND', 404, 'Assignment not found', true);
    }

    if (![AssignmentStatus.ASSIGNED, AssignmentStatus.IN_PROGRESS].some(status => status === assignment.status)) {
      throw new AppError(
        'ASSIGNMENT_NOT_VALID',
        400,
        'The assignment is not valid, please check the status of the assignment',
        true
      );
    }

    await this.assignmentRepository.changeStatusAssignment(assignmentId, AssignmentStatus.IN_PROGRESS, data.assignmentDate);

    await this.eventNotificationService.publish({
      eventType: EventType.ACCEPTANCE_FORM,
      transactionId: assignment.id,
      destinations: [assignment.employee.email],
      destinationsCC: []
    });
  }
}
