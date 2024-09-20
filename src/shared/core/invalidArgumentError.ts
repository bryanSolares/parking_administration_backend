import { HandleError } from './handleError';

export class InvalidArgumentError extends HandleError {
  constructor(message: string) {
    super(message);
  }
}
