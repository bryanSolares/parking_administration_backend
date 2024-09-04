export class DeAssignmentEntity {
  constructor(
    public readonly id: string,
    public readonly assignmentId: string,
    public readonly reason: string,
    public readonly deAssignmentDate: string,
    public readonly isRpaAction: boolean
  ) {
    this.id = id;
    this.assignmentId = assignmentId;
    this.reason = reason;
    this.deAssignmentDate = deAssignmentDate;
    this.isRpaAction = isRpaAction;
  }

  static fromPrimitives(primitiveData: {
    id: string;
    assignmentId: string;
    reason: string;
    deAssignmentDate: string;
    isRpaAction: boolean;
  }): DeAssignmentEntity {
    return new DeAssignmentEntity(
      primitiveData.id,
      primitiveData.assignmentId,
      primitiveData.reason,
      primitiveData.deAssignmentDate,
      primitiveData.isRpaAction
    );
  }

  toPrimitives() {
    return {
      id: this.id,
      assignment: this.assignmentId,
      reason: this.reason,
      deAssignmentDate: this.deAssignmentDate,
      isRpaAction: this.isRpaAction
    };
  }
}
