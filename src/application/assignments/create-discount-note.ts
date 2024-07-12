import { AssignmentNotFoundError } from '@src/core/assignments/exceptions/assignment-not-found';
import { PreviewDiscountNoteError } from '@src/core/assignments/exceptions/preview-discount-note';

import { AssignmentRepository } from '@src/core/assignments/repositories/assignment-repository';

export class CreateDiscountNote {
  constructor(private readonly assignmentRespository: AssignmentRepository) {}

  async run(idAssignment: string): Promise<void> {
    const assignment =
      await this.assignmentRespository.getAssignmentById(idAssignment);

    if (!assignment) {
      throw new AssignmentNotFoundError('Assignment not found');
    }

    //TODO: Validate previous discount note
    const discountNote =
      await this.assignmentRespository.getDiscountNoteByIdAssignment(
        idAssignment
      );

    if (discountNote) {
      throw new PreviewDiscountNoteError('Discount note already exists');
    }

    await this.assignmentRespository.createDiscountNote(idAssignment);
  }
}
