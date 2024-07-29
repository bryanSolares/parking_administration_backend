/* eslint-disable  @typescript-eslint/no-floating-promises */
import { NotificationMailRepository } from '@assignment-module-core/repositories/notification-mail-repository';

export class NotificationService {
  constructor(
    private readonly notificationMailRepository: NotificationMailRepository
  ) {}

  createAssignmentNotification(
    owner: { name: string; email: string; token: string },
    guest: { name: string; email: string } | null,
    scheduleAssignment: {
      startTime: string;
      endTime: string;
    },
    scheduleLoan: {
      startDate: string;
      endDate: string;
    } | null,
    location: {
      name: string;
      address: string;
      slotNumber: string;
    }
  ) {
    //owner
    this.notificationMailRepository.assignmentNotification(
      owner,
      location,
      scheduleAssignment
    );

    if (guest && scheduleLoan) {
      this.notificationMailRepository.assignmentGuestNotification(
        owner,
        guest,
        location,
        {
          startDate: new Date(scheduleLoan.startDate).toLocaleDateString(
            'es-GT',
            {
              timeZone: 'America/Guatemala'
            }
          ),
          endDate: new Date(scheduleLoan.endDate).toLocaleDateString('es-GT', {
            timeZone: 'America/Guatemala'
          })
        }
      );
    }
  }

  createDiscountNoteNotification(owner: { name: string; email: string }) {
    this.notificationMailRepository.discountNoteNotification(owner, {
      name: 'RRHH',
      email: 'solares.josue@outlook.com'
    });
  }

  createDeAssignmentNotification(
    owner: { name: string; email: string },
    guest: { name: string; email: string } | null
  ) {
    this.notificationMailRepository.deAssignmentOwnerNotification({
      name: owner.name,
      email: owner.email
    });

    if (guest) {
      this.notificationMailRepository.deAssignmentGuestNotification({
        name: guest.name,
        email: guest.email
      });
    }
  }

  createAssignmentLoanNotification(
    owner: { name: string; email: string },
    guest: { name: string; email: string },
    scheduleLoan: {
      startDate: string;
      endDate: string;
    },
    location: {
      name: string;
      address: string;
      slotNumber: string;
    }
  ) {
    /* eslint-disable  @typescript-eslint/no-floating-promises */
    this.notificationMailRepository.assignmentGuestNotification(
      owner,
      guest,
      {
        name: location.name,
        address: location.address,
        slotNumber: location.slotNumber
      },
      {
        startDate: new Date(scheduleLoan.startDate).toLocaleDateString(
          'es-GT',
          {
            timeZone: 'America/Guatemala'
          }
        ),
        endDate: new Date(scheduleLoan.endDate).toLocaleDateString('es-GT', {
          timeZone: 'America/Guatemala'
        })
      }
    );
  }
}
