import { v4 as uuid } from 'uuid';
import { AssignmentRepository } from '@src/contexts/assignment/core/repositories/assignment-repository';
import { AssignmentStatus } from '@src/contexts/assignment/core/entities/assignment-entity';
import { AppError } from '@src/contexts/shared/infrastructure/exception/AppError';
import { BenefitType } from '@src/contexts/location/core/entities/slot-entity';
import { DiscountNoteEntity } from '@src/contexts/assignment/core/entities/discount-note-entity';
import { EventType } from '@src/contexts/shared/core/notification_queue';
import { EventNotificationService } from '@src/contexts/shared/application/event-notification-service';

export class CreateDiscountNote {
  constructor(
    private readonly assignmentRepository: AssignmentRepository,
    private readonly eventNotificationService: EventNotificationService
  ) {}

  async run(idAssignment: string): Promise<void> {
    const assignment = await this.assignmentRepository.getAssignmentById(idAssignment);

    if (!assignment || assignment.status !== AssignmentStatus.ACCEPTED) {
      throw new AppError(
        'ASSIGNMENT_NOT_VALID',
        400,
        `Assignment not found or status is not "${AssignmentStatus.ACCEPTED}"`,
        true
      );
    }

    if (assignment.location.slots[0].benefitType !== BenefitType.DISCOUNT) {
      throw new AppError(
        'CANT_CREATE_DISCOUNT_NOTE',
        400,
        `Cant create discount note for assignments type "${BenefitType.COMPLEMENT}" or "${BenefitType.NO_COST}"`,
        true
      );
    }

    if (assignment.discountNote) {
      throw new AppError('DISCOUNT_NOTE_ALREADY_EXISTS', 400, 'Discount note already exists', true);
    }

    const discountNote = new DiscountNoteEntity(uuid(), idAssignment);

    await this.assignmentRepository.createDiscountNote(discountNote);

    await this.eventNotificationService.publish({
      eventType: EventType.DISCOUNT_NOTE,
      transactionId: assignment.id,
      destinations: [assignment.employee.email],
      destinationsCC: []
    });
  }
}
