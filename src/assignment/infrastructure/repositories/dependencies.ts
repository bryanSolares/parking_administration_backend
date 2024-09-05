import { SequelizeAssignmentRepository } from './sequelize-mysql-repository';
import { AssignmentController } from '../controllers/assignment.controller';

import { SequelizeMYSQLLocationRepository } from '@src/location/infrastructure/repositories/sequelize-mysql-repository';
import { SequelizeEmployeeRepository } from '@src/assignment/infrastructure/repositories/sequelize-employee.repository';
import { SequelizePostgresRepository } from '@src/parameters/infrastructure/repositories/sequelize-postgres-repository';
import { SequelizeSettingMySQLRepository } from '@src/parameters/infrastructure/repositories/sequelize-setting-mysql-repository';

import { GetEmployeeByCode } from '@assignment-module-application/user-cases/get-employee';
import { CreateAssignment } from '@assignment-module-application/user-cases/create-assignment';
import { AssignmentFinder } from '@assignment-module-application/user-cases/assignment-finder';
import { AssignmentFinderById } from '@assignment-module-application/user-cases/assignment-finder-by-id';
import { CreateDeAssignment } from '@src/assignment/application/user-cases/create-de-assignment';
import { CreateDiscountNote } from '@assignment-module-application/user-cases/create-discount-note';
import { UpdateAssignment } from '@assignment-module-application/user-cases/update-assignment';
import { CreateAssignmentLoan } from '@assignment-module-application/user-cases/create-assignment-loan';
import { UpdateStatusDiscountNote } from '@src/assignment/application/user-cases/update-status-discount-note';
import { DeleteAssignmentLoan } from '@assignment-module-application/user-cases/delete-assignment-loan';

import { GetFormDataOfAcceptanceUseCase } from '@assignment-module-application/user-cases/acceptance-form/get-form-data';
import { CreateAcceptanceProcessUseCase } from '@assignment-module-application/user-cases/acceptance-form/create-acceptance-process';
import { UpdateAcceptanceStatusUseCase } from '@assignment-module-application/user-cases/acceptance-form/update-acceptance-status';

import { Validations } from '@assignment-module-application/user-cases/validations';

import { AssignmentDomainService } from '@assignment-module-application/services/assignment-domain-service';
import { NotificationService } from '@assignment-module-application/services/notification-service';

import { NodemailerNotificationRepository } from '../repositories/nodemailer-notification-repository';

const sequelizeAssignmentRepository = new SequelizeAssignmentRepository();
const sequelizeLocationRepository = new SequelizeMYSQLLocationRepository();
const employeeRepository = new SequelizeEmployeeRepository();
const parameterRepository = new SequelizePostgresRepository();
const settingRepository = new SequelizeSettingMySQLRepository();

const validations = new Validations(
  sequelizeAssignmentRepository,
  employeeRepository
);

const assignmentDomainService = new AssignmentDomainService(
  sequelizeAssignmentRepository,
  sequelizeLocationRepository
);

const nodemailerNotificationRepository = new NodemailerNotificationRepository();

const notificationService = new NotificationService(
  nodemailerNotificationRepository
);

//Use cases
const employeeFinderByCode = new GetEmployeeByCode(
  employeeRepository,
  settingRepository
);
const createAssignment = new CreateAssignment(
  sequelizeAssignmentRepository,
  sequelizeLocationRepository,
  parameterRepository,
  validations
);

const assignmentFinder = new AssignmentFinder(sequelizeAssignmentRepository);
const assignmentFinderById = new AssignmentFinderById(
  sequelizeAssignmentRepository
);
const deAssignmentById = new CreateDeAssignment(sequelizeAssignmentRepository);
const createDiscountNote = new CreateDiscountNote(
  sequelizeAssignmentRepository
);
const createAssignmentLoan = new CreateAssignmentLoan(
  sequelizeAssignmentRepository,
  notificationService,
  assignmentDomainService
);
const updateAssignment = new UpdateAssignment();
//sequelizeAssignmentRepository
const updateDiscountNote = new UpdateStatusDiscountNote(
  sequelizeAssignmentRepository
);
const deleteAssignmentLoan = new DeleteAssignmentLoan(
  sequelizeAssignmentRepository
);
const getFormDataOfAcceptance = new GetFormDataOfAcceptanceUseCase(
  sequelizeAssignmentRepository,
  settingRepository
);

const createAcceptanceProcess = new CreateAcceptanceProcessUseCase(
  sequelizeAssignmentRepository,
  settingRepository
);

const updateStatusAcceptanceAssignment = new UpdateAcceptanceStatusUseCase(
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
  updateDiscountNote,
  deleteAssignmentLoan,
  getFormDataOfAcceptance,
  createAcceptanceProcess,
  updateStatusAcceptanceAssignment
);

export { assignmentController };
