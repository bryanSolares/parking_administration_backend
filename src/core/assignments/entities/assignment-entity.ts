export class AssignmentEntity {
  constructor(
    public id: string,
    public slot_id: string,
    public employee_id: string,
    public assignment_date: Date,
    public schedule_id: string,
    public status: string
  ) {}
}
