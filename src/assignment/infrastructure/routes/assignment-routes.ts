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

import { assignmentLoanSchema } from '../utils/assignment-loan-zod-schema';

import { dataForAcceptanceFormSchema } from '../utils/acceptance-zod-schema';
import { statusAcceptanceFormSchema } from '../utils/acceptance-zod-schema';

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
    '/:assignment_id/de-assignment/',
    validateRequest(assignmentIdSchema, 'params'),
    validateRequest(createDeAssignmentBodySchema, 'body'),
    assignmentController.createDeAssignment.bind(assignmentController)
  )
  .post(
    '/:assignment_id/discount-note/',
    validateRequest(assignmentIdSchema, 'params'),
    assignmentController.createDiscountNote.bind(assignmentController)
  )
  .patch(
    '/discount-note/:discount_note_id',
    validateRequest(assignmentIdSchema, 'params'),
    validateRequest(statusDiscountNoteBodySchema, 'body'),
    assignmentController.updateStatusDiscountNode.bind(assignmentController)
  )
  .post(
    '/:assignment_id/loan/',
    validateRequest(assignmentIdSchema, 'params'),
    validateRequest(assignmentLoanSchema, 'body'),
    assignmentController.createAssignmentLoan.bind(assignmentController)
  )
  .delete(
    '/assignment-loan/:assignment_loan_id',
    validateRequest(assignmentIdSchema, 'params'),
    assignmentController.deleteAssignmentLoan.bind(assignmentController)
  )
  .get(
    '/acceptance/:assignment_id/data',
    validateRequest(assignmentIdSchema, 'params'),
    assignmentController.getAcceptanceData.bind(assignmentController)
  )
  .post(
    '/acceptance/:assignment_id',
    validateRequest(assignmentIdSchema, 'params'),
    validateRequest(dataForAcceptanceFormSchema, 'body'),
    assignmentController.sendAcceptanceForm.bind(assignmentController)
  )
  .patch(
    '/acceptance/:assignment_id',
    validateRequest(assignmentIdSchema, 'params'),
    validateRequest(statusAcceptanceFormSchema, 'body'),
    assignmentController.updateStatusAcceptanceForm.bind(assignmentController)
  );

export default routes;
