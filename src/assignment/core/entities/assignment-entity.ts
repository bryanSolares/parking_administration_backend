import { AssignmentLoadEntity } from './assignment-load-entity';
import { DiscountNoteEntity } from './discount-note-entity';
import { EmployeeEntity } from './employee-entity';
import { ScheduleEntity } from './schedule-entity';

import { SlotEntity } from '@location-module-core/entities/slot-entity';

export class AssignmentEntity {
  readonly tags: string[];

  constructor(
    public readonly id: string,
    public readonly slot_id: string,
    public readonly employee: EmployeeEntity,
    public readonly schedule: ScheduleEntity,
    public readonly status: string,
    tags: string[],
    public readonly assignment_loan?: AssignmentLoadEntity,
    public readonly assignment_date?: Date,
    public readonly slot?: SlotEntity,
    public readonly discount_note?: DiscountNoteEntity
  ) {
    this.tags = tags;
  }
}
