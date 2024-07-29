import { AssignmentRepository } from '@assignment-module-core/repositories/assignment-repository';
import { NotificationMailRepository } from '@assignment-module-core/repositories/notification-mail-repository';
import { LocationRepository } from '@location-module-core/repositories/location-repository';
import { AssignmentNotFoundError } from '@assignment-module-core/exceptions/assignment-not-found';
import { PreviewDiscountNoteError } from '@assignment-module-core/exceptions/preview-discount-note';

export class CreateDiscountNote {
  constructor(
    private readonly assignmentRepository: AssignmentRepository,
    private readonly locationRepository: LocationRepository,
    private readonly notificationMailRepository: NotificationMailRepository
  ) {}

  async run(idAssignment: string): Promise<void> {
    const assignment =
      await this.assignmentRepository.getAssignmentById(idAssignment);

    if (!assignment || assignment.status !== 'ACTIVO') {
      throw new AssignmentNotFoundError(
        'Assignment not found or status is not "ACTIVO"'
      );
    }

    if (assignment.slot) {
      const slot = await this.locationRepository.getSlotById(
        assignment.slot.id
      );
      if (slot?.cost_type !== 'DESCUENTO') {
        throw new Error(
          'Cant create discount note for assignments type "COMPLEMENTO o SIN_COSTO"'
        );
      }
    }

    const discountNote =
      await this.assignmentRepository.getDiscountNoteByIdAssignment(
        idAssignment
      );

    if (discountNote) {
      throw new PreviewDiscountNoteError('Discount note already exists');
    }

    await this.assignmentRepository.createDiscountNote(idAssignment);

    //TODO: send email with discount note
    /* eslint-disable  @typescript-eslint/no-floating-promises */
    const employee = assignment.employee;
    this.notificationMailRepository.discountNoteNotification(
      { name: employee.name, email: employee.email },
      { name: 'RRHH', email: 'solares.josue@outlook.com' }
    );
  }
}
