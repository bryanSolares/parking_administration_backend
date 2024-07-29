import crypto from 'node:crypto';

import { AssignmentRepository } from '@assignment-module-core/repositories/assignment-repository';
import { AssignmentEntity } from '@assignment-module-core/entities/assignment-entity';
import { AssignmentDomainService } from '../services/assignment-domain-service';
import { NotificationMailRepository } from '@assignment-module-core/repositories/notification-mail-repository';

export class CreateAssignment {
  constructor(
    private readonly assignmentRepository: AssignmentRepository,
    private readonly assignmentDomainService: AssignmentDomainService,
    private readonly notificationMailRepository: NotificationMailRepository
  ) {}

  async run(assignment: AssignmentEntity): Promise<void> {
    const owner = assignment.employee;
    const guest = assignment.assignment_loan?.employee;
    const schedule = assignment.schedule;

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

    if (schedule) {
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

    //owner
    /* eslint-disable  @typescript-eslint/no-floating-promises */
    this.notificationMailRepository.assignmentNotification(
      { name: owner.name, email: owner.email, token: secret },
      {
        name: 'Los capitol',
        address: 'Guatemala zona 1',
        slotNumber: 'abc123'
      },
      {
        startTime: schedule?.start_time_assignment,
        endTime: schedule?.end_time_assignment
      }
    );

    //Guest
    if (guest && assignment.assignment_loan) {
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
            assignment.assignment_loan.start_date_assignment
          ).toLocaleDateString('es-GT', {
            timeZone: 'America/Guatemala'
          }),
          endDate: new Date(
            assignment.assignment_loan.end_date_assignment
          ).toLocaleDateString('es-GT', {
            timeZone: 'America/Guatemala'
          })
        }
      );
    }
  }
}
