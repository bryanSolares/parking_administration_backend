export class ScheduleEntity {
  constructor(
    public readonly id: string,
    public readonly slot_id: string,
    public readonly start_time_assignment: string,
    public readonly end_time_assignment: string
  ) {}
}

// Value Object for start and end time
