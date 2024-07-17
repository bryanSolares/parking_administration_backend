export class EmployeeNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EmployeeNotFoundError';
  }
}
