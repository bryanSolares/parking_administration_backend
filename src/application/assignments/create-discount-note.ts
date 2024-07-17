import { AssignmentNotFoundError } from '@src/core/assignments/exceptions/assignment-not-found';
import { PreviewDiscountNoteError } from '@src/core/assignments/exceptions/preview-discount-note';

import { AssignmentRepository } from '@src/core/assignments/repositories/assignment-repository';
import { LocationRepository } from '@src/core/repositories/location-repository';

export class CreateDiscountNote {
  constructor(
    private readonly assignmentRepository: AssignmentRepository,
    private readonly locationRepository: LocationRepository
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
  }
}
