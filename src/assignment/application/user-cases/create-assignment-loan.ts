import { AssignmentRepository } from '@assignment-module-core/repositories/assignment-repository';
import { NotificationMailRepository } from '@assignment-module-core/repositories/notification-mail-repository';
import { AssignmentLoadEntity } from '@assignment-module-core/entities/assignment-load-entity';
import { AssignmentNotFoundError } from '@assignment-module-core/exceptions/assignment-not-found';

export class CreateAssignmentLoan {
  constructor(
    private readonly assignmentRepository: AssignmentRepository,
    private readonly notificationMailRepository: NotificationMailRepository
  ) {}

  async run(assignmentLoan: AssignmentLoadEntity) {
    const assignment = await this.assignmentRepository.getAssignmentById(
      assignmentLoan.assignment_id
    );
    if (!assignment) {
      throw new AssignmentNotFoundError('Assignment not found');
    }

    //TODO: validate assignment have loan previously
    const assignmentLoanActive =
      await this.assignmentRepository.getAssignmentLoanActiveByIdAssignment(
        assignmentLoan.assignment_id
      );

    if (assignmentLoanActive) {
      throw new Error('Assignment already have loan');
    }

    await this.assignmentRepository.createAssignmentLoan(assignmentLoan);

    const owner = assignment.employee;
    const guest = assignmentLoan.employee;
    /* eslint-disable  @typescript-eslint/no-floating-promises */
    this.notificationMailRepository.assignmentGuestNotification(
      { name: owner.name, email: owner.email },
      { name: guest.name, email: guest.email },
      {
        name: 'Los capitol',
        address: 'Guatemala zona 1',
        slotNumber: 'abc123'
      },
      {
        startDate: new Date(
          assignmentLoan.start_date_assignment
        ).toLocaleDateString('es-GT', {
          timeZone: 'America/Guatemala'
        }),
        endDate: new Date(
          assignmentLoan.end_date_assignment
        ).toLocaleDateString('es-GT', {
          timeZone: 'America/Guatemala'
        })
      }
    );
  }
}
