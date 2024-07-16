import { AssignmentLoadEntity } from './assignment-load-entity';
import { EmployeeEntity } from './employee-entity';
import { ScheduleEntity } from './schedule-entity';

export class AssignmentEntity {
  constructor(
    public readonly id: string,
    public readonly slot_id: string,
    public readonly employee: EmployeeEntity,
    public readonly schedule: ScheduleEntity,
    public readonly status: string,
    public readonly assignment_loan?: AssignmentLoadEntity,
    public readonly assignment_date?: Date
  ) {}
}
