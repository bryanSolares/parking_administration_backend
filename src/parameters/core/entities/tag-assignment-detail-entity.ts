export class TagAssignmentDetailEntity {
  readonly id: string;
  readonly assignmentId: string;
  readonly tagId: string;

  constructor(id: string, assignmentId: string, tagId: string) {
    this.id = id;
    this.assignmentId = assignmentId;
    this.tagId = tagId;
  }

  static fromPrimitives(plainData: {
    id: string;
    assignmentId: string;
    tagId: string;
  }): TagAssignmentDetailEntity {
    return new TagAssignmentDetailEntity(
      plainData.id,
      plainData.assignmentId,
      plainData.tagId
    );
  }
}
