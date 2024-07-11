import { CreateAssignment } from '../../application/assignments/create-assignment';
import { AssignmentFinder } from '../../application/assignments/assignment-finder';
import { AssignmentFinderById } from '../../application/assignments/assignment-finder-by-id';
import { DeAssignmentById } from '../../application/assignments/de-assignment-by-id';
import { GetEmployeeByCode } from '../../application/assignments/get-employee-by-code';

import { AssignmentRepository } from '../../core/assignments//repositories/assignment-repository';
import { EmployeeRepository } from '../../core/assignments/repositories/employee-repository';

import { AssignmentEntity } from '../../core/assignments/entities/assignment-entity';
import { EmployeeEntity } from '../../core/assignments/entities/employee-entity';
import { VehicleEntity } from '../../core/assignments/entities/vehicle-entity';
import { ScheduleEntity } from '../../core/assignments/entities/schedule-entity';
import { DeAssignmentEntity } from '../../core/assignments/entities/deassignment-entity';

const mockAssignmentRepository: jest.Mocked<AssignmentRepository> = {
  createAssignment: jest.fn(),
  getAssignmentById: jest.fn(),
  getAssignments: jest.fn().mockReturnValue([]),
  deAssignmentById: jest.fn()
};

const mockEmployeeRepository: jest.Mocked<EmployeeRepository> = {
  getEmployeeByCode: jest.fn().mockReturnValue({
    id: '1',
    code: '001',
    name: 'Carlos Perez'
  })
};

describe('Assignment Use Cases', () => {
  const assignment = new AssignmentEntity(
    '1',
    'Test Assignment',
    new EmployeeEntity(
      '1',
      '001',
      'Carlos Perez',
      'in site',
      'abc123',
      'claro',
      '',
      '',
      '',
      '',
      '',
      'Guatemala',
      'carlos.perez@gmail.com',
      '50255554568',
      '',
      '',
      [
        new VehicleEntity('1', '1', 'abc', 'blue', 'toyota', '2022', 'CARRO')
      ] as VehicleEntity[]
    ),
    new ScheduleEntity('1', '1', '08:00', '12:00'),
    'ACTIVO',
    new Date()
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new assignment', async () => {
    const createAssignment = new CreateAssignment(mockAssignmentRepository);
    await createAssignment.run(assignment);
    expect(mockAssignmentRepository.createAssignment).toHaveBeenCalledWith(
      expect.any(AssignmentEntity)
    );
  });

  it('should find a assignment by id', async () => {
    const findById = new AssignmentFinderById(mockAssignmentRepository);
    await findById.run('1');
    expect(mockAssignmentRepository.getAssignmentById).toHaveBeenCalledWith(
      '1'
    );
  });

  it('should find all assignments', async () => {
    const getAllAssignments = new AssignmentFinder(mockAssignmentRepository);
    await getAllAssignments.run();
    expect(mockAssignmentRepository.getAssignments).toHaveBeenCalled();
  });

  it('should deassignment a assignment', async () => {
    const deAssignmentById = new DeAssignmentById(mockAssignmentRepository);
    await deAssignmentById.run(
      '1',
      new DeAssignmentEntity('1', '1', 'reason', new Date(), false)
    );
    expect(mockAssignmentRepository.deAssignmentById).toHaveBeenCalledWith(
      '1',
      expect.any(DeAssignmentEntity)
    );
  });

  it('should return employee by code', async () => {
    const getEmployeeByCode = new GetEmployeeByCode(mockEmployeeRepository);
    const employee = await getEmployeeByCode.run('001');
    expect(employee).toEqual({ id: '1', code: '001', name: 'Carlos Perez' });
  });

  it('should throw an error if employee not found', async () => {
    mockEmployeeRepository.getEmployeeByCode.mockResolvedValueOnce(null);
    const getEmployeeByCode = new GetEmployeeByCode(mockEmployeeRepository);
    await expect(getEmployeeByCode.run('001')).rejects.toThrow();
  });
});
