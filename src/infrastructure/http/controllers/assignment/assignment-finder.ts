import { Request, Response } from 'express';

import { AssignmentFinder } from '@src/application/assignments/assignment-finder';

export class AssignmentFinderController {
  constructor(private readonly assignmentFinder: AssignmentFinder) {}

  async run(req: Request, res: Response) {
    const assignments = await this.assignmentFinder.run();
    const response = {
      data: assignments
    };

    res.status(200).json(response);
  }
}
