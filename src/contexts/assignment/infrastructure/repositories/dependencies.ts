import { AssignmentController } from '../controllers/assignment.controller';
import { SequelizeAssignmentRepository } from './sequelize-mysql-repository';
import { SequelizeMysqlNotificationRepository } from '../../../shared/infrastructure/repositories/sequelize-mysql-notification-repository';

import { SequelizeMYSQLLocationRepository } from '@src/contexts/location/infrastructure/repositories/sequelize-mysql-repository';
import { SequelizeEmployeeRepository } from '@src/contexts/assignment/infrastructure/repositories/sequelize-employee.repository';
import { SequelizePostgresRepository } from '@src/contexts/parameters/infrastructure/repositories/sequelize-postgres-repository';
import { SequelizeSettingMySQLRepository } from '@src/contexts/parameters/infrastructure/repositories/sequelize-setting-mysql-repository';

import { GetEmployeeByCode } from '@src/contexts/assignment/application/use-cases/get-employee';
import { CreateAssignment } from '@src/contexts/assignment/application/use-cases/create-assignment';
import { AssignmentFinder } from '@src/contexts/assignment/application/use-cases/assignment-finder';
import { AssignmentFinderById } from '@src/contexts/assignment/application/use-cases/assignment-finder-by-id';
import { CreateDeAssignment } from '@src/contexts/assignment/application/use-cases/create-de-assignment';
import { CreateDiscountNote } from '@src/contexts/assignment/application/use-cases/create-discount-note';
import { UpdateAssignmentUseCase } from '@src/contexts/assignment/application/use-cases/update-assignment';
import { CreateAssignmentLoan } from '@src/contexts/assignment/application/use-cases/assignment-loan/create-assignment-loan';
import { UpdateStatusDiscountNote } from '@src/contexts/assignment/application/use-cases/update-status-discount-note';
import { DeleteAssignmentLoan } from '@src/contexts/assignment/application/use-cases/assignment-loan/delete-assignment-loan';
import { UpdateAssignmentLoanUseCase } from '@src/contexts/assignment/application/use-cases/assignment-loan/update-assignment-loan';

import { GetFormDataOfAcceptanceUseCase } from '@src/contexts/assignment/application/use-cases/acceptance-form/get-form-data';
import { CreateAcceptanceProcessUseCase } from '@src/contexts/assignment/application/use-cases/acceptance-form/create-acceptance-process';
import { UpdateAcceptanceStatusUseCase } from '@src/contexts/assignment/application/use-cases/acceptance-form/update-acceptance-status';

import { Validations } from '@src/contexts/assignment/application/use-cases/validations';

const sequelizeAssignmentRepository = new SequelizeAssignmentRepository();
const sequelizeLocationRepository = new SequelizeMYSQLLocationRepository();
const employeeRepository = new SequelizeEmployeeRepository();
const parameterRepository = new SequelizePostgresRepository();
const settingRepository = new SequelizeSettingMySQLRepository();

const notificationRepository = new SequelizeMysqlNotificationRepository();

const validations = new Validations(
  sequelizeAssignmentRepository,
  employeeRepository,
  settingRepository,
  sequelizeLocationRepository
);

//Use cases
const employeeFinderByCode = new GetEmployeeByCode(employeeRepository, settingRepository);
const createAssignment = new CreateAssignment(
  sequelizeAssignmentRepository,
  sequelizeLocationRepository,
  parameterRepository,
  validations
);

const assignmentFinder = new AssignmentFinder(sequelizeAssignmentRepository);
const assignmentFinderById = new AssignmentFinderById(sequelizeAssignmentRepository);
const deAssignmentById = new CreateDeAssignment(sequelizeAssignmentRepository, notificationRepository);
const createDiscountNote = new CreateDiscountNote(sequelizeAssignmentRepository, notificationRepository);
const createAssignmentLoan = new CreateAssignmentLoan(sequelizeAssignmentRepository, notificationRepository, validations);
const updateAssignmentLoan = new UpdateAssignmentLoanUseCase(sequelizeAssignmentRepository, validations);
const updateAssignment = new UpdateAssignmentUseCase(sequelizeAssignmentRepository, parameterRepository, validations);

const updateDiscountNote = new UpdateStatusDiscountNote(sequelizeAssignmentRepository);
const deleteAssignmentLoan = new DeleteAssignmentLoan(sequelizeAssignmentRepository);
const getFormDataOfAcceptance = new GetFormDataOfAcceptanceUseCase(sequelizeAssignmentRepository, settingRepository);

const createAcceptanceProcess = new CreateAcceptanceProcessUseCase(
  sequelizeAssignmentRepository,
  settingRepository,
  notificationRepository
);

const updateStatusAcceptanceAssignment = new UpdateAcceptanceStatusUseCase(sequelizeAssignmentRepository, notificationRepository);

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
  updateAssignmentLoan,
  updateDiscountNote,
  deleteAssignmentLoan,
  getFormDataOfAcceptance,
  createAcceptanceProcess,
  updateStatusAcceptanceAssignment
);

export { assignmentController };
