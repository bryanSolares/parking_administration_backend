import { v4 as uuid } from 'uuid';
import { format } from '@formkit/tempo';

import { AssignmentRepository } from '@src/contexts/assignment/core/repositories/assignment-repository';
import { AppError } from '@src/contexts/shared/infrastructure/exception/AppError';
import { VehicleType } from '@src/contexts/location/core/entities/slot-entity';
import { Validations } from '../validations';
import { AssignmentStatus } from '@src/contexts/assignment/core/entities/assignment-entity';
import { AssignmentLoadEntity } from '@src/contexts/assignment/core/entities/assignment-load-entity';
import { AssignmentLoadStatus } from '@src/contexts/assignment/core/entities/assignment-load-entity';
import { EmployeeEntity } from '@src/contexts/assignment/core/entities/employee-entity';
import { EventType } from '@src/contexts/shared/core/notification_queue';
import { EventNotificationService } from '@src/contexts/shared/application/event-notification-service';

export class CreateAssignmentLoan {
  constructor(
    private readonly assignmentRepository: AssignmentRepository,
    private readonly validations: Validations,
    private readonly eventNotificationService: EventNotificationService
  ) {}

  async run(
    data: {
      startDateAssignment: string;
      endDateAssignment: string;
      employee: {
        id: string;
        employeeCode: string;
        name: string;
        workplace: string;
        identifierDocument: string;
        company: string;
        department: string;
        subManagement: string;
        management1: string;
        management2: string;
        workSite: string;
        address: string;
        email: string;
        phone: string;
        vehicles: {
          id: string;
          vehicleBadge: string;
          color: string;
          brand: string;
          model: string;
          type: VehicleType;
        }[];
      };
    },
    assignmentId: string
  ) {
    const assignment = await this.assignmentRepository.getAssignmentById(assignmentId);

    if (!assignment) {
      throw new AppError('ASSIGNMENT_NOT_FOUND', 404, 'Assignment not found', true);
    }

    if (assignment.status !== AssignmentStatus.ACCEPTED) {
      throw new AppError('INVALID_ASSIGNMENT', 400, 'This assignment is not accepted, status is not valid', true);
    }

    const presentAssignmentLoan = await this.assignmentRepository.getAssignmentLoanByIdAssignment(assignmentId);

    if (presentAssignmentLoan) {
      throw new AppError('ASSIGNMENT_LOAN_ALREADY_EXISTS', 400, 'The assignment already has an active loan', true);
    }

    await this.validations.validateIfCanCreateAssignmentLoan({
      id: data.employee.id,
      vehicles: data.employee.vehicles.map(v => v.id)
    });

    const assignmentLoan = new AssignmentLoadEntity(
      uuid(),
      assignmentId,
      EmployeeEntity.fromPrimitive({
        ...data.employee,
        id: data.employee.id ?? uuid(),
        vehicles: data.employee.vehicles.map(vehicle => {
          return {
            ...vehicle,
            id: vehicle.id ?? uuid()
          };
        })
      }),
      data.startDateAssignment,
      data.endDateAssignment,
      format({
        date: new Date(),
        format: 'YYYY-MM-DD',
        tz: 'America/Guatemala'
      }),
      AssignmentLoadStatus.ACTIVE
    );

    await this.validations.validateIfRangeOfDaysToAssignmentLoanIsValid(data.startDateAssignment, data.endDateAssignment);

    await this.assignmentRepository.createAssignmentLoan(assignmentLoan);

    await this.eventNotificationService.publish({
      eventType: EventType.ASSIGNMENT_LOAN,
      transactionId: assignmentLoan.id,
      destinations: [assignment.employee.email, assignmentLoan.employee.email],
      destinationsCC: []
    });
  }
}
