export class AssignmentNotFoundError extends Error {
  constructor(messsage: string) {
    super(messsage);
    super.name = 'AssignmentNotFoundError';
  }
}
