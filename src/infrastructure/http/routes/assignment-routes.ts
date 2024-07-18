import { Router } from 'express';
import { Request, Response } from 'express';

import { assignmentController } from '@src/infrastructure/repositories/assignment/dependencies';

import { validateRequest } from '@infrastructure/http/middlewares/zod.validate';

import { assignmentCreateSchema } from '@infrastructure/http/schemas/assignment.schemas';
import { getAssignmentByIdSchema } from '@infrastructure/http/schemas/assignment.schemas';
import { createDiscountNodeByIdAssignmentSchema } from '@infrastructure/http/schemas/assignment.schemas';
import { createDeAssignmentParamsSchema } from '@infrastructure/http/schemas/assignment.schemas';
import { createDeAssignmentBodySchema } from '@infrastructure/http/schemas/assignment.schemas';
import { getAssignmentsSchemaForQuery } from '@infrastructure/http/schemas/assignment.schemas';
import { getEmployeeByCodeSchemaForParams } from '@infrastructure/http/schemas/assignment.schemas';

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
    assignmentController.updateAssignment.bind(assignmentController)
  )
  .get(
    '/',
    validateRequest(getAssignmentsSchemaForQuery, 'query'),
    assignmentController.assignmentFinder.bind(assignmentController)
  )
  .get(
    '/:id',
    validateRequest(getAssignmentByIdSchema, 'params'),
    assignmentController.assignmentFinderById.bind(assignmentController)
  )
  .post(
    '/de_assignment/:assignment_id',
    validateRequest(createDeAssignmentParamsSchema, 'params'),
    validateRequest(createDeAssignmentBodySchema, 'body'),
    assignmentController.createDeAssignment.bind(assignmentController)
  )
  .post(
    '/discount-note/:assignment_id',
    validateRequest(createDiscountNodeByIdAssignmentSchema, 'params'),
    assignmentController.createDiscountNote.bind(assignmentController)
  );
export default routes;
