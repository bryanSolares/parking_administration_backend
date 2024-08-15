import { AssignmentRepository } from '@assignment-module-core/repositories/assignment-repository';
import { AssignmentLoadEntity } from '@assignment-module-core/entities/assignment-load-entity';
import { NotificationService } from '../services/notification-service';
import { AssignmentDomainService } from '../services/assignment-domain-service';
import { AppError } from '@src/server/config/err/AppError';

export class CreateAssignmentLoan {
  constructor(
    private readonly assignmentRepository: AssignmentRepository,
    private readonly notificationService: NotificationService,
    private readonly assignmentService: AssignmentDomainService
  ) {}

  async run(assignmentLoan: AssignmentLoadEntity) {
    const assignment = await this.assignmentRepository.getAssignmentById(
      assignmentLoan.assignment_id
    );

    if (!assignment) {
      throw new AppError(
        'ASSIGNMENT_NOT_FOUND',
        404,
        'Assignment not found',
        true
      );
    }

    //TODO: validate assignment have loan previously
    const assignmentLoanActive =
      await this.assignmentRepository.getAssignmentLoanByIdAssignment(
        assignmentLoan.assignment_id
      );

    if (assignmentLoanActive && assignmentLoanActive.status === 'ACTIVO') {
      throw new Error('Assignment already have loan');
    }

    //TODO: validate if employee has an active assignment
    if (assignmentLoan.employee.id) {
      await this.assignmentService.validateIfEmployeeHasAnActiveAssignment(
        assignmentLoan.employee.id
      );
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
