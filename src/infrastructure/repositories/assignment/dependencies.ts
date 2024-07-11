import { SequelizeAssignmentRepository } from './sequelize-postgresql-repository';
import { WSEmployeeRepository } from './ws-employee.repository';

import { GetEmployeeByCode } from '@application/assignments/get-employee-by-code';
import { CreateAssignment } from '@src/application/assignments/create-assignment';
import { AssignmentFinder } from '@src/application/assignments/assignment-finder';
import { AssignmentFinderById } from '@src/application/assignments/assignment-finder-by-id';
import { DeAssignmentById } from '@src/application/assignments/de-assignment-by-id';

import { EmployeeFinderByCodeController } from '@src/infrastructure/http/controllers/assignment/employee-finder-by-code';
import { CreateAssignmentController } from '@src/infrastructure/http/controllers/assignment/create-assignment';
import { AssignmentFinderByIdController } from '@src/infrastructure/http/controllers/assignment/assignment-finder-by-id';
import { AssignmentFinderController } from '@src/infrastructure/http/controllers/assignment/assignment-finder';
import { DeAssignmentByIdController } from '@src/infrastructure/http/controllers/assignment/deassignment-by-id';

const sequelizeAssignmentRepository = new SequelizeAssignmentRepository();
const employeeRepository = new WSEmployeeRepository();

//Use cases
const getEmployeeByCode = new GetEmployeeByCode(employeeRepository);
const createAssignment = new CreateAssignment(sequelizeAssignmentRepository);
const assignmentFinder = new AssignmentFinder(sequelizeAssignmentRepository);
const assignmentFinderById = new AssignmentFinderById(
  sequelizeAssignmentRepository
);
const deAssignmentById = new DeAssignmentById(sequelizeAssignmentRepository);

//Controllers
const employeeFinderByCodeController = new EmployeeFinderByCodeController(
  getEmployeeByCode
);
const createAssignmentController = new CreateAssignmentController(
  createAssignment
);

const assignmentFinderByIdController = new AssignmentFinderByIdController(
  assignmentFinderById
);

const assignmentFinderController = new AssignmentFinderController(
  assignmentFinder
);

const deAssignmentByIdController = new DeAssignmentByIdController(
  deAssignmentById
);

export {
  employeeFinderByCodeController,
  createAssignmentController,
  assignmentFinderByIdController,
  assignmentFinderController,
  deAssignmentByIdController
};
