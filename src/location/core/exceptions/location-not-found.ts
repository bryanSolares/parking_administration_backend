export class LocationNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LocationNotFound';
  }
}
