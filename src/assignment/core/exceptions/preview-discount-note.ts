export class PreviewDiscountNoteError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PreviewDiscountNoteError';
  }
}
