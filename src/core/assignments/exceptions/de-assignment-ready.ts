export class DeAssignmentReady extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DeAssignmentReady';
  }
}
