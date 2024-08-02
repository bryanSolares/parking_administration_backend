import { AssignmentRepository } from '@assignment-module-core/repositories/assignment-repository';
import { NotificationService } from '../services/notification-service';
import { AssignmentNotFoundError } from '@assignment-module-core/exceptions/assignment-not-found';
import { PreviewDiscountNoteError } from '@assignment-module-core/exceptions/preview-discount-note';

export class CreateDiscountNote {
  constructor(
    private readonly assignmentRepository: AssignmentRepository,
    private readonly notificationService: NotificationService
  ) {}

  async run(idAssignment: string): Promise<void> {
    const assignment =
      await this.assignmentRepository.getAssignmentById(idAssignment);

    if (!assignment || assignment.status !== 'ACTIVO') {
      throw new AssignmentNotFoundError(
        'Assignment not found or status is not "ACTIVO"'
      );
    }

    if (assignment.slot?.cost_type !== 'DESCUENTO') {
      throw new Error(
        'Cant create discount note for assignments type "COMPLEMENTO o SIN_COSTO"'
      );
    }

    if (assignment.discount_note) {
      throw new PreviewDiscountNoteError('Discount note already exists');
    }

    await this.assignmentRepository.createDiscountNote(idAssignment);

    //TODO: send email with discount note
    this.notificationService.createDiscountNoteNotification({
      name: assignment.employee.name,
      email: assignment.employee.email
    });
  }
}
