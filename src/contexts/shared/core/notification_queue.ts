export enum EventType {
  ASSIGNMENT = 'ASSIGNMENT',
  DISCOUNT_NOTE = 'DISCOUNT_NOTE',
  DE_ASSIGNMENT = 'DE_ASSIGNMENT',
  ASSIGNMENT_LOAN = 'ASSIGNMENT_LOAN'
}

export enum EventStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  DISPATCHED = 'DISPATCHED',
  FAILED = 'FAILED',
  RETRYING = 'RETRYING'
}

export class NotificationQueue {
  constructor(
    readonly id: string,
    readonly eventType: EventType,
    readonly payload: string,
    public status: EventStatus
  ) {}

  static fromPrimitives(plainData: { id: string; eventType: EventType; payload: string; status: EventStatus }) {
    return new NotificationQueue(plainData.id, plainData.eventType, plainData.payload, plainData.status);
  }

  toPrimitives() {
    return {
      id: this.id,
      eventType: this.eventType,
      status: this.status,
      payload: this.payload
    };
  }
}
