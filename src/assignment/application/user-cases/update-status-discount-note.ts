import { AssignmentRepository } from '@assignment-module-core/repositories/assignment-repository';
import { AppError } from '@src/server/config/err/AppError';

export class UpdateStatusDiscountNote {
  constructor(private readonly assignmentRepository: AssignmentRepository) {}

  async run(id: string, status: string) {
    const discountNote =
      await this.assignmentRepository.getDiscountNoteById(id);

    if (!discountNote) {
      throw new Error('Discount note not found');
    }

    if (
      discountNote.status_signature &&
      ['APROBADO', 'RECHAZADO', 'CANCELADO'].includes(
        discountNote.status_signature
      )
    ) {
      throw new AppError(
        'DISCOUNT_NOTE_ALREADY_SIGNED',
        400,
        'Discount note already signed, canceled or rejected',
        true
      );
    }

    await this.assignmentRepository.updateStatusDiscountNote(id, status);
  }
}
