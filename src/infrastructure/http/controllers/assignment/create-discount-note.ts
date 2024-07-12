import { Request, Response } from 'express';
import { CreateDiscountNote } from '@src/application/assignments/create-discount-note';

import { AssignmentNotFoundError } from '@src/core/assignments/exceptions/assignment-not-found';
import { PreviewDiscountNoteError } from '@src/core/assignments/exceptions/preview-discount-note';

export class CreateDiscountNoteController {
  constructor(private readonly createDiscountNote: CreateDiscountNote) {}

  async run(req: Request, res: Response) {
    const idAssignment = req.params.assignment_id;

    try {
      await this.createDiscountNote.run(idAssignment);
      res.status(200).json({ message: 'Discount note created' });
    } catch (error) {
      if (error instanceof AssignmentNotFoundError) {
        return res.status(404).json({ message: error.message });
      }

      if (error instanceof PreviewDiscountNoteError) {
        return res.status(400).json({ message: error.message });
      }

      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
