export class DiscountNoteEntity {
  constructor(
    public readonly id: string,
    public readonly assignmentId: string,
    public readonly maxDispatchAttempts?: number,
    public readonly reminderFrequency?: number,
    public readonly dispatchAttempts?: number,
    public readonly lastNotice?: Date,
    public readonly nextNotice?: Date,
    public readonly statusSignature?: string,
    public readonly statusDispatched?: string
  ) {
    this.reminderFrequency = 2;
    this.maxDispatchAttempts = 3;
  }
}
