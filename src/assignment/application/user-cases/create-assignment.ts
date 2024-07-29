import crypto from 'node:crypto';

import { AssignmentRepository } from '@assignment-module-core/repositories/assignment-repository';
import { AssignmentEntity } from '@assignment-module-core/entities/assignment-entity';
import { AssignmentDomainService } from '../services/assignment-domain-service';
import { NotificationService } from '../services/notification-service';

export class CreateAssignment {
  constructor(
    private readonly assignmentRepository: AssignmentRepository,
    private readonly assignmentDomainService: AssignmentDomainService,
    private readonly notificationService: NotificationService
  ) {}

  async run(assignment: AssignmentEntity): Promise<void> {
    const owner = assignment.employee;
    const guest = assignment.assignment_loan?.employee;
    const scheduleAssignment = assignment.schedule;

    await this.assignmentDomainService.verifyIfSlotExistsAndIsAvailable(
      assignment.slot_id
    );

    if (owner.id) {
      await this.assignmentDomainService.validateIfEmployeeHasAnActiveAssignment(
        owner.id
      );
    }

    if (guest?.id) {
      await this.assignmentDomainService.validateIfEmployeeHasAnActiveAssignment(
        guest.id
      );
    }

    if (scheduleAssignment) {
      await this.assignmentDomainService.verifyIfSlotCanHaveSchedules(
        assignment.slot_id
      );

      await this.assignmentDomainService.canCreateMoreSchedulesInSlot(
        assignment.slot_id
      );
    }

    await this.assignmentRepository.createAssignment(assignment);

    //Generate token for owner
    const secret = crypto.randomBytes(32).toString('hex');
    //TODO: Insert token in database

    const guestInformation = guest
      ? { name: guest.name, email: guest.email }
      : null;

    const scheduleLoan = assignment.assignment_loan
      ? {
          startDate: new Date(
            assignment.assignment_loan.start_date_assignment
          ).toString(),
          endDate: new Date(
            assignment.assignment_loan.end_date_assignment
          ).toString()
        }
      : null;

    //FIXME: location info
    this.notificationService.createAssignmentNotification(
      { name: owner.name, email: owner.email, token: secret },
      guestInformation,
      {
        startTime: scheduleAssignment.start_time_assignment,
        endTime: scheduleAssignment.end_time_assignment
      },
      scheduleLoan,
      {
        name: "Parqueos 'El pumpim'",
        address: 'Parqueos, Guateque, Guatemala',
        slotNumber: '223-da5c2'
      }
    );
  }
}
