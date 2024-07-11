import { Request, Response } from 'express';

import { DeAssignmentById } from '@src/application/assignments/de-assignment-by-id';

export class DeAssignmentByIdController {
  constructor(private readonly DeAssignmentById: DeAssignmentById) {}

  async run(req: Request, res: Response) {
    const assignmentId = req.params.id;
    const deAssignment = req.body;

    try {
      await this.DeAssignmentById.run(assignmentId, deAssignment);
      res.status(201).send({ message: 'DeAssignment created' });
    } catch (error) {
      res.status(500).send('Error creating deAssignment');
    }
  }
}
