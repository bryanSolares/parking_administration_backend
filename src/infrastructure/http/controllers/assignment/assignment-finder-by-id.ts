import { Request, Response } from 'express';

import { AssignmentFinderById } from '../../../../application/assignments/assignment-finder-by-id';

export class AssignmentFinderByIdController {
  constructor(private readonly assignmentFinderById: AssignmentFinderById) {}

  async run(req: Request, res: Response) {
    const id = req.params.id;

    try {
      const assignment = await this.assignmentFinderById.run(id);
      const response = {
        data: assignment
      };

      res.status(200).json(response);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      }
    }
  }
}
