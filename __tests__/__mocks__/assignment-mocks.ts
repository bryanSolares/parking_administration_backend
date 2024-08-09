import { mockLocationRepository  } from "./location-mocks";

import { AssignmentRepository } from '../../src/assignment/core/repositories/assignment-repository';
import { NotificationMailRepository } from '../../src/assignment/core/repositories/notification-mail-repository';
import { EmployeeRepositoryWebService } from '../../src/assignment/core/repositories/employee-repository';

import { AssignmentDomainService } from '../../src/assignment/application/services/assignment-domain-service';
import { NotificationService } from '../../src/assignment/application/services/notification-service';

export const mockAssignmentRepository: jest.Mocked<AssignmentRepository> = {
  createAssignment: jest.fn(),
  createAssignmentLoan: jest.fn(),
  createDiscountNote: jest.fn(),
  createDeAssignment: jest.fn(),
  updateAssignment: jest.fn(),
  updateStatusDiscountNote: jest.fn(),
  deleteAssignmentLoan: jest.fn(),
  upsertEmployee: jest.fn(),
  upsertSchedule: jest.fn(),
  upsertVehicles: jest.fn(),
  getAssignmentById: jest.fn(),
  getAssignmentLoanById: jest.fn(),
  getDiscountNoteById: jest.fn(),
  getAssignments: jest.fn(),
  canCreateMoreSchedulesInSlot: jest.fn(),
  employeeHasAnActiveAssignment: jest.fn(),
  getAssignmentLoanByIdAssignment: jest.fn()
};

export const mockNotificationRepository: jest.Mocked<NotificationMailRepository> = {
  assignmentGuestNotification: jest.fn(),
  assignmentNotification: jest.fn(),
  deAssignmentGuestNotification: jest.fn(),
  deAssignmentOwnerNotification: jest.fn(),
  discountNoteNotification: jest.fn()
};

export const mockEmployeeRepository: jest.Mocked<EmployeeRepositoryWebService> = {
  getEmployeeByCodeFromDatabase: jest.fn(),
  getEmployeeByCodefromWebService: jest.fn()
};

export const mockAssignmentDomainService = new AssignmentDomainService(
  mockAssignmentRepository,
  mockLocationRepository
);

export const mockNotificationService = new NotificationService(
  mockNotificationRepository
);
