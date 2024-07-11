import { Router } from 'express';

import { employeeFinderByCodeController } from '@src/infrastructure/repositories/assignment/dependencies';
import { createAssignmentController } from '@src/infrastructure/repositories/assignment/dependencies';
import { assignmentFinderController } from '@src/infrastructure/repositories/assignment/dependencies';
import { assignmentFinderByIdController } from '@src/infrastructure/repositories/assignment/dependencies';
import { deAssignmentByIdController } from '@src/infrastructure/repositories/assignment/dependencies';

const routes = Router();

// Employee
routes.get(
  '/employee/:code',
  employeeFinderByCodeController.run.bind(employeeFinderByCodeController)
);

routes.post(
  '/',
  createAssignmentController.run.bind(createAssignmentController)
);

routes.get(
  '/',
  assignmentFinderController.run.bind(assignmentFinderController)
);

routes.get(
  '/:id',
  assignmentFinderByIdController.run.bind(assignmentFinderByIdController)
);

routes.post(
  '/:id/deassignment',
  deAssignmentByIdController.run.bind(deAssignmentByIdController)
);
export default routes;
