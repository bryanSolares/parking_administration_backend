import { SequelizeAssignmentRepository } from './sequelize-postgresql-repository';
import { SequelizeLocationRepository } from '../location/sequelize-postgresql-repository';
import { WSEmployeeRepository } from './ws-employee.repository';

import { GetEmployeeByCode } from '@application/assignments/get-employee-by-code-from-ws';
import { CreateAssignment } from '@src/application/assignments/create-assignment';
import { AssignmentFinder } from '@src/application/assignments/assignment-finder';
import { AssignmentFinderById } from '@src/application/assignments/assignment-finder-by-id';
import { CreateDeAssignment } from '@src/application/assignments/create-deassignment';
import { CreateDiscountNote } from '@src/application/assignments/create-discount-note';
import { UpdateAssignment } from '@src/application/assignments/update-assignment';

import { AssignmentDomainService } from '@src/application/services/assignment-domain-service';
import { AssignmentController } from '@src/infrastructure/http/controllers/assignment.controller';

const sequelizeAssignmentRepository = new SequelizeAssignmentRepository();
const sequelizeLocationRepository = new SequelizeLocationRepository();
const employeeRepository = new WSEmployeeRepository();

const assignmentDomainService = new AssignmentDomainService(
  sequelizeAssignmentRepository,
  sequelizeLocationRepository
);

//Use cases
const employeeFinderByCode = new GetEmployeeByCode(employeeRepository);
const createAssignment = new CreateAssignment(
  sequelizeAssignmentRepository,
  assignmentDomainService
);
const assignmentFinder = new AssignmentFinder(sequelizeAssignmentRepository);
const assignmentFinderById = new AssignmentFinderById(
  sequelizeAssignmentRepository
);
const deAssignmentById = new CreateDeAssignment(sequelizeAssignmentRepository);
const createDiscountNote = new CreateDiscountNote(
  sequelizeAssignmentRepository,
  sequelizeLocationRepository
);

const updateAssignment = new UpdateAssignment(sequelizeAssignmentRepository);

//Controllers
const assignmentController = new AssignmentController(
  createAssignment,
  createDiscountNote,
  assignmentFinderById,
  assignmentFinder,
  deAssignmentById,
  employeeFinderByCode,
  updateAssignment
);

export { assignmentController };
