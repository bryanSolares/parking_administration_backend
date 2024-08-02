import { AssignmentRepository } from '@assignment-module-core/repositories/assignment-repository';

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
      throw new Error('Discount note already signed, canceled or rejected');
    }

    await this.assignmentRepository.updateStatusDiscountNote(id, status);
  }
}
