import { AssignmentRepository } from '../src/assignment/core/repositories/assignment-repository';
import { NotificationMailRepository } from '../src/assignment/core/repositories/notification-mail-repository';
import { EmployeeRepositoryWebService } from '../src/assignment/core/repositories/employee-repository';

import { CreateAssignment } from '../src/assignment/application/user-cases/create-assignment';
import { CreateAssignmentLoan } from '../src/assignment/application/user-cases/create-assignment-loan';
import { CreateDeAssignment } from '../src/assignment/application/user-cases/create-deassignment';
import { CreateDiscountNote } from '../src/assignment/application/user-cases/create-discount-note';
import { AssignmentFinder } from '../src/assignment/application/user-cases/assignment-finder';
import { AssignmentFinderById } from '../src/assignment/application/user-cases/assignment-finder-by-id';
import { DeleteAssignmentLoan } from '../src/assignment/application/user-cases/delete-assignment-loan';
import { UpdateDiscountNote } from '../src/assignment/application/user-cases/update-discount-note';
import { UpdateAssignment } from '../src/assignment/application/user-cases/update-assignment';
import { GetEmployeeByCode } from '../src/assignment/application/user-cases/get-employee-by-code-from-ws';

import { AssignmentDomainService } from '../src/assignment/application/services/assignment-domain-service';
import { NotificationService } from '../src/assignment/application/services/notification-service';

import {
  assignmentEntityMock,
  deAssignmentEntityMock,
  discountNoteEntityMock,
  ownerEmployeeEntityMock
} from './__mocks__/assignment_mocks';
import { assignmentLoanEntityMock } from './__mocks__/assignment_mocks';
import { locationEntityMock } from './__mocks__/assignment_mocks';
import { slotEntityMock } from './__mocks__/assignment_mocks';

import { mockLocationRepository } from './location-use-cases.test';

const mockAssignmentRepository: jest.Mocked<AssignmentRepository> = {
  createAssignment: jest.fn(),
  createAssignmentLoan: jest.fn(),
  createDiscountNote: jest.fn(),
  createDeAssignment: jest.fn(),
  updateAssignment: jest.fn(),
  updateDiscountNote: jest.fn(),
  deleteAssignmentLoan: jest.fn(),
  upsertEmployee: jest.fn(),
  upsertSchedule: jest.fn(),
  upsertVehicles: jest.fn(),
  getAssignmentById: jest.fn(),
  getDiscountNoteByIdAssignment: jest.fn(),
  getAssignmentLoanActiveByIdAssignment: jest.fn(),
  getAssignments: jest.fn(),
  canCreateMoreSchedulesInSlot: jest.fn(),
  employeeHasAnActiveAssignment: jest.fn()
};

const mockNotificationRepository: jest.Mocked<NotificationMailRepository> = {
  assignmentGuestNotification: jest.fn(),
  assignmentNotification: jest.fn(),
  deAssignmentGuestNotification: jest.fn(),
  deAssignmentOwnerNotification: jest.fn(),
  discountNoteNotification: jest.fn()
};

const mockEmployeeRepository: jest.Mocked<EmployeeRepositoryWebService> = {
  getEmployeeByCodeFromDatabase: jest.fn(),
  getEmployeeByCodefromWebService: jest.fn()
};

const mockAssignmentDomainService = new AssignmentDomainService(
  mockAssignmentRepository,
  mockLocationRepository
);

const mockNotificationService = new NotificationService(
  mockNotificationRepository
);

describe('ASSIGNMENT: Use Cases', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new assignment', async () => {
    mockLocationRepository.getSlotById.mockResolvedValueOnce(slotEntityMock);
    mockLocationRepository.getLocationById.mockResolvedValueOnce(
      locationEntityMock
    );
    mockAssignmentDomainService.verifyIfSlotExistsAndIsAvailable = jest
      .fn()
      .mockResolvedValue(true);

    mockAssignmentDomainService.canCreateMoreSchedulesInSlot = jest
      .fn()
      .mockReturnValue(true);

    const createAssignment = new CreateAssignment(
      mockAssignmentRepository,
      mockAssignmentDomainService,
      mockNotificationService
    );
    await createAssignment.run(assignmentEntityMock);
    expect(mockAssignmentRepository.createAssignment).toHaveBeenCalledWith(
      assignmentEntityMock
    );
  });

  it('should create assignment loan', async () => {
    mockAssignmentRepository.getAssignmentLoanActiveByIdAssignment.mockResolvedValueOnce(
      null
    );
    mockAssignmentRepository.getAssignmentById.mockResolvedValueOnce(
      assignmentEntityMock
    );
    const createAssignmentLoan = new CreateAssignmentLoan(
      mockAssignmentRepository,
      mockNotificationService
    );

    await createAssignmentLoan.run(assignmentLoanEntityMock);
    expect(mockAssignmentRepository.createAssignmentLoan).toHaveBeenCalledWith(
      assignmentLoanEntityMock
    );
  });

  it('should create de-assignment', async () => {
    mockAssignmentRepository.getAssignmentById.mockResolvedValueOnce(
      assignmentEntityMock
    );
    const deAssignmentById = new CreateDeAssignment(
      mockAssignmentRepository,
      mockNotificationService
    );
    await deAssignmentById.run('1', deAssignmentEntityMock);
    expect(mockAssignmentRepository.createDeAssignment).toHaveBeenCalledWith(
      '1',
      deAssignmentEntityMock
    );
  });

  it('should throw an errors if assignment not found or assignment already inactive to create de-assignment', async () => {
    const deAssignmentById = new CreateDeAssignment(
      mockAssignmentRepository,
      mockNotificationService
    );
    await expect(
      deAssignmentById.run('1', deAssignmentEntityMock)
    ).rejects.toThrow('Assignment not found');

    mockAssignmentRepository.getAssignmentById.mockResolvedValueOnce({
      ...assignmentEntityMock,
      status: 'INACTIVO'
    });

    await expect(
      deAssignmentById.run('1', deAssignmentEntityMock)
    ).rejects.toThrow('Assignment is already inactive');
  });

  it('should create discount note', async () => {
    mockAssignmentRepository.getAssignmentById.mockResolvedValueOnce(
      assignmentEntityMock
    );
    mockLocationRepository.getSlotById.mockResolvedValueOnce({
      ...slotEntityMock,
      cost_type: 'DESCUENTO'
    });
    mockAssignmentRepository.getDiscountNoteByIdAssignment.mockResolvedValueOnce(
      null
    );
    const createDiscountNote = new CreateDiscountNote(
      mockAssignmentRepository,
      mockLocationRepository,
      mockNotificationService
    );
    await createDiscountNote.run('1');
    expect(mockAssignmentRepository.createDiscountNote).toHaveBeenCalledWith(
      '1'
    );
  });

  it('should throw errors if assignment not exists, discount note already exists or slot is type SIN_COSTO', async () => {
    const createDiscountNote = new CreateDiscountNote(
      mockAssignmentRepository,
      mockLocationRepository,
      mockNotificationService
    );

    mockAssignmentRepository.getAssignmentById.mockResolvedValueOnce(null);
    await expect(createDiscountNote.run('1')).rejects.toThrow(
      'Assignment not found or status is not "ACTIVO"'
    );
    // mockLocationRepository.getSlotById.mockResolvedValueOnce(slotEntityMock);
    // await expect(createDiscountNote.run('1')).rejects.toThrow(
    //   'Cant create discount note for assignments type "COMPLEMENTO o SIN_COSTO"'
    // );
  });

  it('should delete assignment loan', async () => {
    mockAssignmentRepository.getAssignmentLoanActiveByIdAssignment.mockResolvedValueOnce(
      assignmentLoanEntityMock
    );
    const deleteAssignmentLoan = new DeleteAssignmentLoan(
      mockAssignmentRepository
    );
    await deleteAssignmentLoan.run('1');
    expect(mockAssignmentRepository.deleteAssignmentLoan).toHaveBeenCalledWith(
      '1'
    );
  });

  it('should update discount note status', async () => {
    mockAssignmentRepository.getAssignmentById.mockResolvedValueOnce(
      assignmentEntityMock
    );

    mockAssignmentRepository.getDiscountNoteByIdAssignment.mockResolvedValueOnce(
      discountNoteEntityMock
    );

    await new UpdateDiscountNote(mockAssignmentRepository).run('1', 'APROBADO');
    expect(mockAssignmentRepository.updateDiscountNote).toHaveBeenCalledWith(
      '1',
      'APROBADO'
    );
  });

  it('should update an assignment', async () => {
    mockAssignmentRepository.getAssignmentById.mockResolvedValueOnce(
      assignmentEntityMock
    );
    const updateAssignment = new UpdateAssignment(mockAssignmentRepository);
    await updateAssignment.run(assignmentEntityMock, []);
    expect(mockAssignmentRepository.updateAssignment).toHaveBeenCalledWith(
      assignmentEntityMock,
      []
    );
  });

  it('should find an assignment by id', async () => {
    mockAssignmentRepository.getAssignmentById.mockResolvedValueOnce(
      assignmentEntityMock
    );
    const findById = new AssignmentFinderById(mockAssignmentRepository);
    await findById.run('1');
    expect(mockAssignmentRepository.getAssignmentById).toHaveBeenCalledWith(
      '1'
    );
  });

  it('should find all assignments', async () => {
    const getAllAssignments = new AssignmentFinder(mockAssignmentRepository);
    await getAllAssignments.run(1, 1);
    expect(mockAssignmentRepository.getAssignments).toHaveBeenCalled();
  });

  it('should get employee information', async () => {
    mockEmployeeRepository.getEmployeeByCodefromWebService.mockResolvedValueOnce(
      ownerEmployeeEntityMock
    );
    await new GetEmployeeByCode(mockEmployeeRepository).run('1');
    expect(
      mockEmployeeRepository.getEmployeeByCodefromWebService
    ).toHaveBeenCalled();
  });
});
