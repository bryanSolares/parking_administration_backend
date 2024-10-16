import { AssignmentRepository } from '@src/contexts/assignment/core/repositories/assignment-repository';
import { DiscountNodeStatusSignature } from '@src/contexts/assignment/core/entities/discount-note-entity';
import { AppError } from '@src/contexts/shared/infrastructure/exception/AppError';

export class UpdateStatusDiscountNote {
  constructor(private readonly assignmentRepository: AssignmentRepository) {}

  async run(
    id: string,
    status: DiscountNodeStatusSignature.APPROVED | DiscountNodeStatusSignature.REJECTED | DiscountNodeStatusSignature.CANCELED
  ) {
    const discountNote = await this.assignmentRepository.getDiscountNoteById(id);

    if (!discountNote) {
      throw new AppError('DISCOUNT_NOTE_NOT_FOUND', 404, 'Discount note not found', true);
    }

    if (discountNote.statusSignature !== DiscountNodeStatusSignature.PENDING) {
      throw new AppError('DISCOUNT_NOTE_ALREADY_SIGNED', 400, 'Discount note already signed.', true);
    }

    await this.assignmentRepository.updateStatusDiscountNote(id, status);
  }
}
