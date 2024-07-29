import { AssignmentRepository } from '@assignment-module-core/repositories/assignment-repository';
import { NotificationMailRepository } from '@assignment-module-core/repositories/notification-mail-repository';
import { EmployeeRepositoryWebService } from '@assignment-module-core/repositories/employee-repository';
import { DeAssignmentEntity } from '@assignment-module-core/entities/deassignment-entity';
import { DeAssignmentReady } from '@assignment-module-core/exceptions/de-assignment-ready';
import { AssignmentNotFoundError } from '@assignment-module-core/exceptions/assignment-not-found';

export class CreateDeAssignment {
  constructor(
    private readonly assignmentRepository: AssignmentRepository,
    private readonly notificationMailRepository: NotificationMailRepository,
    private readonly employeeRepository: EmployeeRepositoryWebService
  ) {}

  async run(
    assignmentId: string,
    deAssignment: DeAssignmentEntity
  ): Promise<void> {
    const assignment =
      await this.assignmentRepository.getAssignmentById(assignmentId);

    if (!assignment) {
      throw new AssignmentNotFoundError('Assignment not found');
    }

    if (assignment?.status === 'INACTIVO') {
      throw new DeAssignmentReady('Assignment is already inactive');
    }

    await this.assignmentRepository.createDeAssignment(
      assignmentId,
      deAssignment
    );

    const employeeOwner =
      await this.employeeRepository.getEmployeeByCodeFromDatabase(
        assignment.employee.code_employee
      );
    /* eslint-disable  @typescript-eslint/no-floating-promises */
    this.notificationMailRepository.deAssignmentOwnerNotification({
      name: employeeOwner.name,
      email: employeeOwner.email
    });

    //Notification to guest
    const assignmentLoan =
      await this.assignmentRepository.getAssignmentLoanActiveByIdAssignment(
        assignmentId
      );

    if (assignmentLoan) {
      this.notificationMailRepository.deAssignmentGuestNotification({
        name: assignmentLoan.employee.name,
        email: assignmentLoan.employee.email
      });
    }
  }
}
