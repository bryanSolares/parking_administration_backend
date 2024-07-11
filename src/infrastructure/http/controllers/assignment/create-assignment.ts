import { Request, Response } from 'express';

import { CreateAssignment } from '@src/application/assignments/create-assignment';

export class CreateAssignmentController {
  constructor(private createAssignmentUseCase: CreateAssignment) {}

  async run(req: Request, res: Response) {
    const assignment = req.body;

    try {
      await this.createAssignmentUseCase.run(assignment);

      res.status(201).json({ message: 'Assignment created' });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      }
    }
  }
}
