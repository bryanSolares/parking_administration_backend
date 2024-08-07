import { Router } from 'express';
import { Request, Response } from 'express';

import { assignmentController } from '../repositories/dependencies';

import { validateRequest } from '@shared/zod-validator';

import { assignmentCreateSchema } from '../utils/assignment-zod-schemas';
import { createDeAssignmentBodySchema } from '../utils/assignment-zod-schemas';
import { getAssignmentsSchemaForQuery } from '../utils/assignment-zod-schemas';
import { getEmployeeByCodeSchemaForParams } from '../utils/assignment-zod-schemas';
import { assignmentUpdateSchema } from '../utils/assignment-zod-schemas';
import { statusDiscountNoteBodySchema } from '../utils/assignment-zod-schemas';
import { assignmentIdSchema } from '../utils/assignment-zod-schemas';

const routes = Router();

// Employee
routes
  .get('/employee', (_: Request, res: Response) => {
    return res.status(400).json({ message: 'Code employee required' });
  })
  .get(
    '/employee/:code',
    validateRequest(getEmployeeByCodeSchemaForParams, 'params'),
    assignmentController.employeeFinderByCode.bind(assignmentController)
  )
  .post(
    '/',
    validateRequest(assignmentCreateSchema, 'body'),
    assignmentController.createAssignment.bind(assignmentController)
  )
  .post(
    '/loan/:assignment_id',
    assignmentController.createAssignmentLoan.bind(assignmentController)
  )
  .put(
    '/:assignment_id',
    validateRequest(assignmentIdSchema, 'params'),
    validateRequest(assignmentUpdateSchema, 'body'),
    assignmentController.updateAssignment.bind(assignmentController)
  )
  .get(
    '/',
    validateRequest(getAssignmentsSchemaForQuery, 'query'),
    assignmentController.assignmentFinder.bind(assignmentController)
  )
  .get(
    '/:assignment_id',
    validateRequest(assignmentIdSchema, 'params'),
    assignmentController.assignmentFinderById.bind(assignmentController)
  )
  .post(
    '/de_assignment/:assignment_id',
    validateRequest(assignmentIdSchema, 'params'),
    validateRequest(createDeAssignmentBodySchema, 'body'),
    assignmentController.createDeAssignment.bind(assignmentController)
  )
  .post(
    '/discount-note/:assignment_id',
    validateRequest(assignmentIdSchema, 'params'),
    assignmentController.createDiscountNote.bind(assignmentController)
  )
  .patch(
    '/discount-note/:discount_note_id',
    validateRequest(assignmentIdSchema, 'params'),
    validateRequest(statusDiscountNoteBodySchema, 'body'),
    assignmentController.updateStatusDiscountNode.bind(assignmentController)
  )
  .delete(
    '/assignment-loan/:assignment_loan_id',
    validateRequest(assignmentIdSchema, 'params'),
    assignmentController.deleteAssignmentLoan.bind(assignmentController)
  );

export default routes;
