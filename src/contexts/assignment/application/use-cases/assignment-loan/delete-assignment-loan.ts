import { AssignmentRepository } from '@src/contexts/assignment/core/repositories/assignment-repository';
import { AssignmentLoadStatus } from '@src/contexts/assignment/core/entities/assignment-load-entity';
import { AppError } from '@src/contexts/shared/infrastructure/exception/AppError';
import { EventNotificationService } from '@src/contexts/shared/application/event-notification-service';
import { EventType } from '@src/contexts/shared/core/notification_queue';

export class DeleteAssignmentLoan {
  constructor(
    private readonly assignmentRepository: AssignmentRepository,
    private readonly eventNotificationService: EventNotificationService
  ) {}

  async run(assignmentLoanId: string): Promise<void> {
    const assignmentLoan = await this.assignmentRepository.getAssignmentLoanById(assignmentLoanId);

    if (!assignmentLoan || assignmentLoan.status === AssignmentLoadStatus.INACTIVE) {
      throw new AppError('ASSIGNMENT_LOAN_NOT_FOUND', 404, 'Assignment loan not found', true);
    }

    await this.assignmentRepository.deleteAssignmentLoan(assignmentLoanId);

    await this.eventNotificationService.publish({
      eventType: EventType.DE_ASSIGNMENT_LOAN,
      transactionId: assignmentLoan.id,
      destinations: [assignmentLoan.employee.email],
      destinationsCC: []
    });
  }
}
