export enum EventType {
  ACCEPTANCE_FORM = 'ACCEPTANCE_FORM',
  ACCEPTANCE_ASSIGNMENT = 'ACCEPTANCE_ASSIGNMENT',
  MANUAL_DE_ASSIGNMENT = 'MANUAL_DE_ASSIGNMENT',
  AUTO_DE_ASSIGNMENT = 'AUTO_DE_ASSIGNMENT',
  DISCOUNT_NOTE = 'DISCOUNT_NOTE',
  ASSIGNMENT_LOAN = 'ASSIGNMENT_LOAN',
  DE_ASSIGNMENT_LOAN = 'DE_ASSIGNMENT_LOAN'
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
