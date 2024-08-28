//import crypto from 'node:crypto';

import { v4 as uuid } from 'uuid';

import { AssignmentRepository } from '@assignment-module-core/repositories/assignment-repository';
import { AssignmentEntity } from '@assignment-module-core/entities/assignment-entity';
import { AssignmentStatus } from '@assignment-module-core/entities/assignment-entity';

import { VehicleType } from '@src/location/core/entities/slot-entity';
import { EmployeeEntity } from '@src/assignment/core/entities/employee-entity';
import { LocationRepository } from '@src/location/core/repositories/location-repository';
import { Validations } from './validations';

export class CreateAssignment {
  constructor(
    private readonly assignmentRepository: AssignmentRepository,
    private readonly locationRepository: LocationRepository,
    private readonly validations: Validations
  ) {}

  async run(data: {
    slotId: string;
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
  }): Promise<void> {
    const slot = await this.locationRepository.getSlotById(data.slotId);

    await this.validations.validateIfCanCreate({
      slot,
      employee: { ...data.employee }
    });

    const employeeId = uuid();
    const assignmentId = uuid();

    const employee = EmployeeEntity.fromPrimitive({
      ...data.employee,
      id: !data.employee.id ? employeeId : data.employee.id,
      vehicles: data.employee.vehicles.map(vehicle => {
        return {
          ...vehicle,
          employeeId,
          id: vehicle.id ? vehicle.id : uuid()
        };
      })
    });

    const assignment = new AssignmentEntity(
      assignmentId,
      slot!,
      employee,
      AssignmentStatus.CREATED
    );

    await this.assignmentRepository.createAssignment(assignment);

    // //Generate token for owner
    // const secret = crypto.randomBytes(32).toString('hex');
    // //TODO: Insert token in database
    // const guestInformation = guest
    //   ? { name: guest.name, email: guest.email }
    //   : null;
    // const scheduleAssignmentData = scheduleAssignment
    //   ? {
    //       startTime: scheduleAssignment.start_time_assignment,
    //       endTime: scheduleAssignment.end_time_assignment
    //     }
    //   : null;
    // const scheduleLoan = assignment.assignment_loan
    //   ? {
    //       startDate: new Date(
    //         assignment.assignment_loan.start_date_assignment
    //       ).toString(),
    //       endDate: new Date(
    //         assignment.assignment_loan.end_date_assignment
    //       ).toString()
    //     }
    //   : null;
    // //FIXME: location info
    // this.notificationService.createAssignmentNotification(
    //   { name: owner.name, email: owner.email, token: secret },
    //   guestInformation,
    //   scheduleAssignmentData,
    //   scheduleLoan,
    //   {
    //     name: "Parqueos 'El pumpim'",
    //     address: 'Parqueos, Guateque, Guatemala',
    //     slotNumber: '223-da5c2'
    //   }
    // );
  }
}
