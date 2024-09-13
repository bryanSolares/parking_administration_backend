import { Request, Response } from 'express';
import { NextFunction } from 'express';

import { CreateAssignment } from '@src/assignment/application/user-cases/create-assignment';
import { AssignmentFinder } from '@src/assignment/application/user-cases/assignment-finder';
import { AssignmentFinderById } from '@src/assignment/application/user-cases/assignment-finder-by-id';
import { CreateDiscountNote } from '@src/assignment/application/user-cases/create-discount-note';
import { CreateDeAssignment } from '@src/assignment/application/user-cases/create-de-assignment';
import { GetEmployeeByCode } from '@src/assignment/application/user-cases/get-employee';
import { UpdateAssignmentUseCase } from '@src/assignment/application/user-cases/update-assignment';
import { CreateAssignmentLoan } from '@src/assignment/application/user-cases/assignment-loan/create-assignment-loan';
import { UpdateAssignmentLoanUseCase } from '@src/assignment/application/user-cases/assignment-loan/update-assignment-loan';
import { UpdateStatusDiscountNote } from '@src/assignment/application/user-cases/update-status-discount-note';
import { DeleteAssignmentLoan } from '@src/assignment/application/user-cases/assignment-loan/delete-assignment-loan';
import { GetFormDataOfAcceptanceUseCase } from '@src/assignment/application/user-cases/acceptance-form/get-form-data';
import { CreateAcceptanceProcessUseCase } from '@src/assignment/application/user-cases/acceptance-form/create-acceptance-process';
import { UpdateAcceptanceStatusUseCase } from '@src/assignment/application/user-cases/acceptance-form/update-acceptance-status';

export class AssignmentController {
  constructor(
    private readonly createAssignmentUseCase: CreateAssignment,
    private readonly createDiscountNoteUseCase: CreateDiscountNote,
    private readonly assignmentFinderByIdUseCase: AssignmentFinderById,
    private readonly assignmentFinderUseCase: AssignmentFinder,
    private readonly deAssignmentByIdUseCase: CreateDeAssignment,
    private readonly employeeFinderByCodeUseCase: GetEmployeeByCode,
    private readonly updateAssignmentUseCase: UpdateAssignmentUseCase,
    private readonly createAssignmentLoanUseCase: CreateAssignmentLoan,
    private readonly updateAssignmentLoanUseCase: UpdateAssignmentLoanUseCase,
    private readonly updateDiscountNoteUseCase: UpdateStatusDiscountNote,
    private readonly deleteAssignmentLoanUseCase: DeleteAssignmentLoan,
    private readonly getFormDataOfAcceptanceUseCase: GetFormDataOfAcceptanceUseCase,
    private readonly createAcceptanceProcessUseCase: CreateAcceptanceProcessUseCase,
    private readonly updateAcceptanceStatusUseCase: UpdateAcceptanceStatusUseCase
  ) {}

  async createAssignment(req: Request, res: Response, next: NextFunction) {
    const assignment = req.body;

    try {
      await this.createAssignmentUseCase.run(assignment);

      res.status(201).json({ message: 'Assignment created' });
    } catch (error) {
      next(error);
    }
  }

  async createAssignmentLoan(req: Request, res: Response, next: NextFunction) {
    const data = req.body;
    const assignmentId = req.params.assignment_id;
    try {
      await this.createAssignmentLoanUseCase.run(data, assignmentId);
      res.status(201).json({ message: 'Assignment loan created' });
    } catch (error) {
      next(error);
    }
  }

  async createDiscountNote(req: Request, res: Response, next: NextFunction) {
    const idAssignment = req.params.assignment_id;

    try {
      await this.createDiscountNoteUseCase.run(idAssignment);
      res.status(201).json({ message: 'Discount note created' });
    } catch (error) {
      next(error);
    }
  }

  async updateStatusDiscountNode(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const assignmentId = req.params.discount_note_id;
    const statusSignature = req.body.status;

    try {
      await this.updateDiscountNoteUseCase.run(assignmentId, statusSignature);
      res.status(200).json({ message: 'Discount note updated' });
    } catch (error) {
      next(error);
    }
  }

  async assignmentFinderById(req: Request, res: Response, next: NextFunction) {
    const id = req.params.assignment_id;

    try {
      const assignment = await this.assignmentFinderByIdUseCase.run(id);
      const response = {
        data: assignment
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async assignmentFinder(req: Request, res: Response, next: NextFunction) {
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
      next(error);
    }
  }

  async createDeAssignment(req: Request, res: Response, next: NextFunction) {
    const assignmentId = req.params.assignment_id;
    const deAssignmentData = req.body;

    try {
      await this.deAssignmentByIdUseCase.run({
        assignmentId,
        deAssignmentData
      });
      res.status(201).json({ message: 'De-assignment created' });
    } catch (error) {
      next(error);
    }
  }

  async employeeFinderByCode(req: Request, res: Response, next: NextFunction) {
    const code = req.params.code;

    try {
      const employee = await this.employeeFinderByCodeUseCase.run(code);
      const response = {
        data: employee
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async updateAssignment(req: Request, res: Response, next: NextFunction) {
    const assignmentId = req.params.assignment_id;
    const employee = req.body.employee;
    const vehiclesForDelete = req.body.vehiclesForDelete;
    const tags = req.body.tags;

    try {
      await this.updateAssignmentUseCase.run(
        {
          employee,
          tags,
          vehicleIdsForDelete: vehiclesForDelete
        },
        assignmentId
      );
      res.status(200).json({ message: 'Assignment updated' });
    } catch (error) {
      next(error);
    }
  }

  async deleteAssignmentLoan(req: Request, res: Response, next: NextFunction) {
    const assignmentId = req.params.assignment_loan_id;
    try {
      await this.deleteAssignmentLoanUseCase.run(assignmentId);
      res.status(200).json({ message: 'Assignment loan deleted' });
    } catch (error) {
      next(error);
    }
  }

  async updateAssignmentLoan(req: Request, res: Response, next: NextFunction) {
    const assignmentLoanId = req.params.assignment_loan_id;
    const data = req.body;
    try {
      await this.updateAssignmentLoanUseCase.run(data, assignmentLoanId);
      res.status(200).json({ message: 'Assignment loan updated' });
    } catch (error) {
      next(error);
    }
  }

  async getAcceptanceData(req: Request, res: Response, next: NextFunction) {
    const assignmentId = req.params.assignment_id;
    try {
      const data = await this.getFormDataOfAcceptanceUseCase.run(assignmentId);
      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  }

  async sendAcceptanceForm(req: Request, res: Response, next: NextFunction) {
    const assignmentId = req.params.assignment_id;
    const data = req.body;
    try {
      await this.createAcceptanceProcessUseCase.run(data, assignmentId);
      res.status(200).json({ message: 'The assignment is being processed' });
    } catch (error) {
      next(error);
    }
  }

  async updateStatusAcceptanceForm(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const assignmentId = req.params.assignment_id;
    const { status } = req.body;

    try {
      await this.updateAcceptanceStatusUseCase.run(assignmentId, status);
      res.status(200).json({ message: 'Status of assignment updated' });
    } catch (error) {
      next(error);
    }
  }
}
