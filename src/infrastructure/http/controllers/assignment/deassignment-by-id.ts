import { Request, Response } from 'express';

import { DeAssignmentById } from '@src/application/assignments/de-assignment-by-id';
import { DeAssignmentReady } from '@src/core/assignments/exceptions/de-assignment-ready';

export class DeAssignmentByIdController {
  constructor(private readonly DeAssignmentById: DeAssignmentById) {}

  async run(req: Request, res: Response) {
    const assignmentId = req.params.id;
    const deAssignment = req.body;

    try {
      await this.DeAssignmentById.run(assignmentId, deAssignment);
      res.status(201).send({ message: 'DeAssignment created' });
    } catch (error) {
      if (error instanceof DeAssignmentReady) {
        res.status(400).send({ message: error.message });
        return;
      }

      res.status(500).send('Error creating deAssignment');
    }
  }
}
