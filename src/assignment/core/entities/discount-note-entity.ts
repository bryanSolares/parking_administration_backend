export class DiscountNoteEntity {
  constructor(
    public readonly id: string,
    public readonly assignment_id: string,
    public readonly max_dispatch_attempts?: number,
    public readonly reminder_frequency?: number,
    public readonly dispatch_attempts?: number,
    public readonly last_notice?: Date,
    public readonly next_notice?: Date,
    public readonly status_signature?: string,
    public readonly status_dispatched?: string
  ) {
    this.reminder_frequency = 2;
    this.max_dispatch_attempts = 3;
  }
}
