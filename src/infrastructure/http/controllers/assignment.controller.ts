import { Request, Response } from 'express';

import { CreateAssignment } from '@src/application/assignments/create-assignment';
import { AssignmentFinder } from '@src/application/assignments/assignment-finder';
import { AssignmentFinderById } from '@src/application/assignments/assignment-finder-by-id';
import { CreateDiscountNote } from '@src/application/assignments/create-discount-note';
import { DeAssignmentById } from '@src/application/assignments/de-assignment-by-id';
import { GetEmployeeByCode } from '@src/application/assignments/get-employee-by-code';

import { AssignmentNotFoundError } from '@src/core/assignments/exceptions/assignment-not-found';
import { PreviewDiscountNoteError } from '@src/core/assignments/exceptions/preview-discount-note';
import { DeAssignmentReady } from '@src/core/assignments/exceptions/de-assignment-ready';

export class AssignmentController {
  constructor(
    private readonly createAssignmentUseCase: CreateAssignment,
    private readonly createDiscountNoteUseCase: CreateDiscountNote,
    private readonly assignmentFinderByIdUseCase: AssignmentFinderById,
    private readonly assignmentFinderUseCase: AssignmentFinder,
    private readonly deAssignmentByIdUseCase: DeAssignmentById,
    private readonly employeeFinderByCodeUseCase: GetEmployeeByCode
  ) {}

  async createAssignment(req: Request, res: Response) {
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

  async createDiscountNote(req: Request, res: Response) {
    const idAssignment = req.params.assignment_id;

    try {
      await this.createDiscountNoteUseCase.run(idAssignment);
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

  async assignmentFinderById(req: Request, res: Response) {
    const id = req.params.id;

    try {
      const assignment = await this.assignmentFinderByIdUseCase.run(id);
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

  async assignmentFinder(req: Request, res: Response) {
    const assignments = await this.assignmentFinderUseCase.run();
    const response = {
      data: assignments
    };

    res.status(200).json(response);
  }

  async deAssignmentById(req: Request, res: Response) {
    const assignmentId = req.params.assignment_id;
    const deAssignment = req.body;

    try {
      await this.deAssignmentByIdUseCase.run(assignmentId, deAssignment);
      res.status(201).send({ message: 'DeAssignment created' });
    } catch (error) {
      if (error instanceof DeAssignmentReady) {
        res.status(400).send({ message: error.message });
        return;
      }

      res.status(500).send('Error creating deAssignment');
    }
  }

  async employeeFinderByCode(req: Request, res: Response) {
    const code = req.params.code;

    try {
      const employee = await this.employeeFinderByCodeUseCase.run(code);
      const response = {
        data: employee
      };

      res.status(200).json(response);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      }
    }
  }
}
