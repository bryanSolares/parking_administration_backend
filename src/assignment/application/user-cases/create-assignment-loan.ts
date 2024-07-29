import { AssignmentRepository } from '@assignment-module-core/repositories/assignment-repository';
import { NotificationService } from '../services/notification-service';
import { AssignmentLoadEntity } from '@assignment-module-core/entities/assignment-load-entity';
import { AssignmentNotFoundError } from '@assignment-module-core/exceptions/assignment-not-found';

export class CreateAssignmentLoan {
  constructor(
    private readonly assignmentRepository: AssignmentRepository,
    private readonly notificationService: NotificationService
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

    //FIXME: location info
    this.notificationService.createAssignmentLoanNotification(
      {
        name: owner.name,
        email: owner.email
      },
      {
        name: guest.name,
        email: guest.email
      },
      {
        startDate: new Date(assignmentLoan.start_date_assignment).toString(),
        endDate: new Date(assignmentLoan.end_date_assignment).toString()
      },
      {
        name: "Parqueos 'El pumpim'",
        address: 'Parqueos, Guateque, Guatemala',
        slotNumber: '223-da5c2'
      }
    );
  }
}
