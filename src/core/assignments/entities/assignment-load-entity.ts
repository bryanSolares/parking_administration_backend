import { EmployeeEntity } from './employee-entity';

export class AssignmentLoadEntity {
  constructor(
    public readonly id: string,
    public readonly assignment_id: string,
    public readonly employee: EmployeeEntity,
    public readonly start_date_assignment: Date,
    public readonly end_date_assignment: Date,
    public readonly assignment_date: Date,
    public readonly status: string
  ) {}
}
