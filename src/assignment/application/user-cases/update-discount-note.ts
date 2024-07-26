import { AssignmentRepository } from '@assignment-module-core/repositories/assignment-repository';
import { AssignmentNotFoundError } from '@assignment-module-core/exceptions/assignment-not-found';

export class UpdateDiscountNote {
  constructor(private readonly assignmentRepository: AssignmentRepository) {}

  async run(assignmentId: string, status: string) {
    const assignment =
      await this.assignmentRepository.getAssignmentById(assignmentId);

    if (!assignment) {
      throw new AssignmentNotFoundError('Assignment not found');
    }

    const discountNote =
      await this.assignmentRepository.getDiscountNoteByIdAssignment(
        assignmentId
      );

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

    await this.assignmentRepository.updateDiscountNote(assignmentId, status);
  }
}
