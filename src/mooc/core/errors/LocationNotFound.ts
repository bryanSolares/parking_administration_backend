export class LocationNotFound extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LocationNotFound';
  }
}
