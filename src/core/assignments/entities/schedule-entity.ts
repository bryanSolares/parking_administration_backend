export class ScheduleEntity {
  constructor(
    public id: string,
    public slot_id: string,
    public start_time_assignment: string,
    public end_time_assignment: string
  ) {}
}
