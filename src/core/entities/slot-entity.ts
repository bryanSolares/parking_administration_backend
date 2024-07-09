export class SlotEntity {
  constructor(
    public readonly id: string,
    public readonly slot_number: string,
    public readonly slot_type: string,
    public readonly type_cost: string,
    public readonly cost?: number,
    public readonly type_vehicle?: string,
    public readonly limit_schedules?: number,
    public readonly status?: string
  ) {}
}
