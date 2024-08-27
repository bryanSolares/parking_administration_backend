// import { AssignmentRepository } from '@assignment-module-core/repositories/assignment-repository';
// import { NotificationService } from '../services/notification-service';
// import { AppError } from '@src/server/config/err/AppError';
// import { CostType } from '@src/location/core/entities/slot-entity';

export class CreateDiscountNote {
  constructor() {} //private readonly notificationService: NotificationService //private readonly assignmentRepository: AssignmentRepository,

  async run() //  idAssignment: string
  : Promise<void> {
    // const assignment =
    //   await this.assignmentRepository.getAssignmentById(idAssignment);
    // if (!assignment || assignment.status !== 'ACTIVO') {
    //   throw new AppError(
    //     'ASSIGNMENT_NOT_FOUND',
    //     404,
    //     'Assignment not found or status is not "ACTIVO"',
    //     true
    //   );
    // }
    // if (assignment.slot?.costType !== CostType.DISCOUNT) {
    //   throw new AppError(
    //     'CANT_CREATE_DISCOUNT_NOTE',
    //     400,
    //     'Cant create discount note for assignments type "COMPLEMENTO o SIN_COSTO"',
    //     true
    //   );
    // }
    // if (assignment.discount_note) {
    //   throw new AppError(
    //     'DISCOUNT_NOTE_ALREADY_EXISTS',
    //     400,
    //     'Discount note already exists',
    //     true
    //   );
    // }
    // await this.assignmentRepository.createDiscountNote(idAssignment);
    // //TODO: send email with discount note
    // this.notificationService.createDiscountNoteNotification({
    //   name: assignment.employee.name,
    //   email: assignment.employee.email
    // });
  }
}
