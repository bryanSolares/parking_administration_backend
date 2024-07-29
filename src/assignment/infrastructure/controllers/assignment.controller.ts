import { Request, Response } from 'express';

import { CreateAssignment } from '@src/assignment/application/user-cases/create-assignment';
import { AssignmentFinder } from '@src/assignment/application/user-cases/assignment-finder';
import { AssignmentFinderById } from '@src/assignment/application/user-cases/assignment-finder-by-id';
import { CreateDiscountNote } from '@src/assignment/application/user-cases/create-discount-note';
import { CreateDeAssignment } from '@src/assignment/application/user-cases/create-deassignment';
import { GetEmployeeByCode } from '@src/assignment/application/user-cases/get-employee-by-code-from-ws';
import { UpdateAssignment } from '@src/assignment/application/user-cases/update-assignment';
import { CreateAssignmentLoan } from '@src/assignment/application/user-cases/create-assignment-loan';
import { UpdateDiscountNote } from '@src/assignment/application/user-cases/update-discount-note';

import { AssignmentNotFoundError } from '@src/assignment/core/exceptions/assignment-not-found';
import { PreviewDiscountNoteError } from '@src/assignment/core/exceptions/preview-discount-note';
import { DeAssignmentReady } from '@src/assignment/core/exceptions/de-assignment-ready';

export class AssignmentController {
  constructor(
    private readonly createAssignmentUseCase: CreateAssignment,
    private readonly createDiscountNoteUseCase: CreateDiscountNote,
    private readonly assignmentFinderByIdUseCase: AssignmentFinderById,
    private readonly assignmentFinderUseCase: AssignmentFinder,
    private readonly deAssignmentByIdUseCase: CreateDeAssignment,
    private readonly employeeFinderByCodeUseCase: GetEmployeeByCode,
    private readonly updateAssignmentUseCase: UpdateAssignment,
    private readonly createAssignmentLoanUseCase: CreateAssignmentLoan,
    private readonly updateDiscountNoteUseCase: UpdateDiscountNote
  ) {}

  async createAssignment(req: Request, res: Response) {
    const assignment = req.body;

    try {
      await this.createAssignmentUseCase.run(assignment);

      res.status(201).json({ message: 'Assignment created' });
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      }
    }
  }

  async createAssignmentLoan(req: Request, res: Response) {
    const assignment = req.body;
    const assignmentId = req.params.assignment_id;
    try {
      await this.createAssignmentLoanUseCase.run({
        ...assignment,
        assignment_id: assignmentId
      });
      res.status(201).json({ message: 'Assignment loan created' });
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

      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      }
    }
  }

  async assignmentFinderById(req: Request, res: Response) {
    const id = req.params.assignment_id;

    try {
      const assignment = await this.assignmentFinderByIdUseCase.run(id);
      const response = {
        data: assignment
      };

      res.status(200).json(response);
    } catch (error) {
      if (error instanceof AssignmentNotFoundError) {
        return res.status(404).json({ message: error.message });
      }

      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      }
    }
  }

  async assignmentFinder(req: Request, res: Response) {
    const { limit, page } = req.query;

    try {
      const assignments = await this.assignmentFinderUseCase.run(
        Number(limit),
        Number(page)
      );
      const response = {
        data: assignments?.data,
        pageCounter: assignments?.pageCounter
      };

      res.status(200).json(response);
    } catch (error) {
      console.log(error);
      res.status(500).send('Error get all assignments');
    }
  }

  async createDeAssignment(req: Request, res: Response) {
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

      if (error instanceof Error) {
        res.status(500).send(error.message);
      }
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

  async updateAssignment(req: Request, res: Response) {
    const assignmentId = req.params.assignment_id;
    const assignment = req.body;
    const vehiclesForDelete = req.body.vehicles_for_delete;

    try {
      await this.updateAssignmentUseCase.run(
        {
          id: assignmentId,
          ...assignment
        },
        vehiclesForDelete
      );
      res.status(200).json({ message: 'Assignment updated' });
    } catch (error) {
      if (error instanceof AssignmentNotFoundError) {
        return res.status(404).json({ message: error.message });
      }

      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      }
    }
  }

  async updateDiscountNode(req: Request, res: Response) {
    const assignmentId = req.params.assignment_id;
    const statusSignature = req.body.status;

    try {
      await this.updateDiscountNoteUseCase.run(assignmentId, statusSignature);
      res.status(200).json({ message: 'Discount note updated' });
    } catch (error) {
      if (error instanceof AssignmentNotFoundError) {
        return res.status(404).json({ message: error.message });
      }

      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      }
    }
  }
}
