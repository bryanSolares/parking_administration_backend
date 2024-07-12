import { Router } from 'express';

import { employeeFinderByCodeController } from '@src/infrastructure/repositories/assignment/dependencies';
import { createAssignmentController } from '@src/infrastructure/repositories/assignment/dependencies';
import { assignmentFinderController } from '@src/infrastructure/repositories/assignment/dependencies';
import { assignmentFinderByIdController } from '@src/infrastructure/repositories/assignment/dependencies';
import { deAssignmentByIdController } from '@src/infrastructure/repositories/assignment/dependencies';
import { createDiscountNoteController } from '@src/infrastructure/repositories/assignment/dependencies';

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
    employeeFinderByCodeController.run.bind(employeeFinderByCodeController)
  )
  .post(
    '/',
    validateRequest(assignmentCreateSchema, 'body'),
    createAssignmentController.run.bind(createAssignmentController)
  )
  .get('/', assignmentFinderController.run.bind(assignmentFinderController))
  .get(
    '/:id',
    validateRequest(getAssignmentByIdSchema, 'params'),
    assignmentFinderByIdController.run.bind(assignmentFinderByIdController)
  )
  .post(
    '/:assignment_id/deassignment',
    validateRequest(createDeAssignmentParamsSchema, 'params'),
    validateRequest(createDeAssignmentBodySchema, 'body'),
    deAssignmentByIdController.run.bind(deAssignmentByIdController)
  )
  .post(
    '/discount-note/:assignment_id',
    validateRequest(createDiscountNodeByIdAssignmentSchema, 'params'),
    createDiscountNoteController.run.bind(createDiscountNoteController)
  );
export default routes;
