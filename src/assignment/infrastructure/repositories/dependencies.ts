import { SequelizeAssignmentRepository } from './sequelize-postgresql-repository';
import { WSEmployeeRepository } from './ws-employee.repository';
import { AssignmentController } from '../controllers/assignment.controller';

import { SequelizeLocationRepository } from '@location-module-infrastructure/repositories/sequelize-postgresql-repository';

import { GetEmployeeByCode } from '@assignment-module-application/user-cases/get-employee-by-code-from-ws';
import { CreateAssignment } from '@assignment-module-application/user-cases/create-assignment';
import { AssignmentFinder } from '@assignment-module-application/user-cases/assignment-finder';
import { AssignmentFinderById } from '@assignment-module-application/user-cases/assignment-finder-by-id';
import { CreateDeAssignment } from '@assignment-module-application/user-cases/create-deassignment';
import { CreateDiscountNote } from '@assignment-module-application/user-cases/create-discount-note';
import { UpdateAssignment } from '@assignment-module-application/user-cases/update-assignment';
import { CreateAssignmentLoan } from '@assignment-module-application/user-cases/create-assignment-loan';
import { UpdateDiscountNote } from '@assignment-module-application/user-cases/update-discount-note';

import { AssignmentDomainService } from '@assignment-module-application/services/assignment-domain-service';

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
const createAssignmentLoan = new CreateAssignmentLoan(
  sequelizeAssignmentRepository
);
const updateAssignment = new UpdateAssignment(sequelizeAssignmentRepository);
const updateDiscountNote = new UpdateDiscountNote(
  sequelizeAssignmentRepository
);

//Controllers
const assignmentController = new AssignmentController(
  createAssignment,
  createDiscountNote,
  assignmentFinderById,
  assignmentFinder,
  deAssignmentById,
  employeeFinderByCode,
  updateAssignment,
  createAssignmentLoan,
  updateDiscountNote
);

export { assignmentController };
