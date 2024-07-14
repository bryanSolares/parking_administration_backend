import { Router } from 'express';

import { assignmentController } from '@src/infrastructure/repositories/assignment/dependencies';

import { validateRequest } from '@infrastructure/http/middlewares/zod.validate';

import { assignmentCreateSchema } from '@infrastructure/http/schemas/assignment.schemas';
import { getAssignmentByIdSchema } from '@infrastructure/http/schemas/assignment.schemas';
import { createDiscountNodeByIdAssignmentSchema } from '@infrastructure/http/schemas/assignment.schemas';
import { createDeAssignmentParamsSchema } from '@infrastructure/http/schemas/assignment.schemas';
import { createDeAssignmentBodySchema } from '@infrastructure/http/schemas/assignment.schemas';

const routes = Router();

// Employee
routes
  .get(
    '/employee/:code',
    assignmentController.employeeFinderByCode.bind(assignmentController)
  )
  .post(
    '/',
    validateRequest(assignmentCreateSchema, 'body'),
    assignmentController.createAssignment.bind(assignmentController)
  )
  .get('/', assignmentController.assignmentFinder.bind(assignmentController))
  .get(
    '/:id',
    validateRequest(getAssignmentByIdSchema, 'params'),
    assignmentController.assignmentFinderById.bind(assignmentController)
  )
  .post(
    '/:assignment_id/deassignment',
    validateRequest(createDeAssignmentParamsSchema, 'params'),
    validateRequest(createDeAssignmentBodySchema, 'body'),
    assignmentController.deAssignmentById.bind(assignmentController)
  )
  .post(
    '/discount-note/:assignment_id',
    validateRequest(createDiscountNodeByIdAssignmentSchema, 'params'),
    assignmentController.createDiscountNote.bind(assignmentController)
  );
export default routes;
