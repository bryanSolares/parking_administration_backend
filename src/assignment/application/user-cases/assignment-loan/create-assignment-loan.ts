import { v4 as uuid } from 'uuid';

import { AssignmentRepository } from '@assignment-module-core/repositories/assignment-repository';
import { AppError } from '@src/shared/infrastructure/server/config/err/AppError';
import { VehicleType } from '@src/location/core/entities/slot-entity';
import { Validations } from '../validations';
import { AssignmentStatus } from '@src/assignment/core/entities/assignment-entity';
import { AssignmentLoadEntity } from '@src/assignment/core/entities/assignment-load-entity';
import { AssignmentLoadStatus } from '@src/assignment/core/entities/assignment-load-entity';
import { EmployeeEntity } from '@src/assignment/core/entities/employee-entity';
import { format } from '@formkit/tempo';

export class CreateAssignmentLoan {
  constructor(
    private readonly assignmentRepository: AssignmentRepository,
    private readonly validations: Validations
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

    await this.validations.validateIfCanCreateAssignmentLoan(data.employee);

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

    // const owner = assignment.employee;
    // const guest = assignmentLoan.employee;

    //FIXME: location info
    // this.notificationService.createAssignmentLoanNotification(
    //   {
    //     name: owner.name,
    //     email: owner.email
    //   },
    //   {
    //     name: guest.name,
    //     email: guest.email
    //   },
    //   {
    //     startDate: new Date(assignmentLoan.start_date_assignment).toString(),
    //     endDate: new Date(assignmentLoan.end_date_assignment).toString()
    //   },
    //   {
    //     name: "Parqueos 'El pumpim'",
    //     address: 'Parqueos, Guateque, Guatemala',
    //     slotNumber: '223-da5c2'
    //   }
    // );
  }
}
