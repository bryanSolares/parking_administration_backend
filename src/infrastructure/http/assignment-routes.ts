import { Router } from 'express';
import { assignmentController } from '@infrastructure/dependecies';

const routes = Router();

// Employee
routes.get(
  '/employee/:code',
  assignmentController.employeeFinderByCode.run.bind(
    assignmentController.employeeFinderByCode
  )
);

export default routes;
