export enum DiscountNodeStatusSignature {
  PENDING = 'PENDIENTE',
  APPROVED = 'APROBADO',
  REJECTED = 'RECHAZADO',
  CANCELED = 'CANCELADO'
}

export enum DiscountNoteDispatchedStatus {
  SUCCESS = 'EXITOSO',
  FAIL = 'FALLIDO',
  PENDING = 'PENDIENTE',
  TRYING = 'REINTENTANDO'
}

export class DiscountNoteEntity {
  constructor(
    public readonly id: string,
    public readonly assignmentId: string,
    public readonly maxDispatchAttempts?: number,
    public readonly reminderFrequency?: number,
    public readonly dispatchAttempts?: number,
    public readonly lastNotice?: Date,
    public readonly nextNotice?: Date,
    public readonly statusSignature?: DiscountNodeStatusSignature,
    public readonly statusDispatched?: DiscountNoteDispatchedStatus
  ) {
    this.id = id;
    this.assignmentId = assignmentId;
    this.maxDispatchAttempts = maxDispatchAttempts;
    this.reminderFrequency = reminderFrequency;
    this.dispatchAttempts = dispatchAttempts;
    this.lastNotice = lastNotice;
    this.nextNotice = nextNotice;
    this.statusSignature = statusSignature;
    this.statusDispatched = statusDispatched;
    this.reminderFrequency = reminderFrequency;
    this.maxDispatchAttempts = maxDispatchAttempts;
  }

  static fromPrimitives(primitiveData: {
    id: string;
    assignmentId: string;
    maxDispatchAttempts?: number;
    reminderFrequency?: number;
    dispatchAttempts?: number;
    lastNotice?: Date;
    nextNotice?: Date;
    statusSignature?: DiscountNodeStatusSignature;
    statusDispatched?: DiscountNoteDispatchedStatus;
  }): DiscountNoteEntity {
    return new DiscountNoteEntity(
      primitiveData.id,
      primitiveData.assignmentId,
      primitiveData.maxDispatchAttempts,
      primitiveData.reminderFrequency,
      primitiveData.dispatchAttempts,
      primitiveData.lastNotice,
      primitiveData.nextNotice,
      primitiveData.statusSignature,
      primitiveData.statusDispatched
    );
  }

  toPrimitives() {
    return {
      id: this.id,
      assignmentId: this.assignmentId,
      maxDispatchAttempts: this.maxDispatchAttempts,
      reminderFrequency: this.reminderFrequency,
      dispatchAttempts: this.dispatchAttempts,
      lastNotice: this.lastNotice,
      nextNotice: this.nextNotice,
      statusSignature: this.statusSignature,
      statusDispatched: this.statusDispatched
    };
  }
}
