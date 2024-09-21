import { v4 as uuid } from 'uuid';
import { AssignmentLoadEntity } from '@src/contexts/assignment/core/entities/assignment-load-entity';
import { AssignmentLoadStatus } from '@src/contexts/assignment/core/entities/assignment-load-entity';
import { AssignmentRepository } from '@src/contexts/assignment/core/repositories/assignment-repository';
import { VehicleType } from '@src/contexts/location/core/entities/slot-entity';
import { AppError } from '@src/contexts/shared/infrastructure/exception/AppError';
import { Validations } from '../validations';
import { VehicleEntity } from '@src/contexts/assignment/core/entities/vehicle-entity';

export class UpdateAssignmentLoanUseCase {
  constructor(
    private readonly assignmentRepository: AssignmentRepository,
    private readonly validations: Validations
  ) {}

  async run(
    data: {
      startDateAssignment: string;
      endDateAssignment: string;
      employee: {
        vehicles: {
          id: string;
          vehicleBadge: string;
          color: string;
          brand: string;
          model: string;
          type: VehicleType;
        }[];
      };
      vehiclesForDelete: string[];
    },
    assignmentLoanId: string
  ): Promise<void> {
    const assignmentLoanDataBase = await this.assignmentRepository.getAssignmentLoanById(assignmentLoanId);

    if (!assignmentLoanDataBase || assignmentLoanDataBase.status === AssignmentLoadStatus.INACTIVE) {
      throw new AppError('ASSIGNMENT_LOAN_NOT_FOUND', 404, 'Assignment loan not found', true);
    }

    await this.validations.validateIfVehiclesBelongToEmployee(assignmentLoanDataBase.employee.id, data.employee.vehicles);

    await this.validations.validateIfVehiclesBelongToEmployee(
      assignmentLoanDataBase.employee.id,
      data.vehiclesForDelete.map(id => ({ id }))
    );

    const vehicles = data.employee.vehicles.map(vehicle => VehicleEntity.fromPrimitive({ ...vehicle, id: vehicle.id ?? uuid() }));

    assignmentLoanDataBase.employee.vehicles = vehicles;

    const assignmentLoan = new AssignmentLoadEntity(
      assignmentLoanDataBase.id,
      assignmentLoanDataBase.assignmentId,
      assignmentLoanDataBase.employee,
      data.startDateAssignment,
      data.endDateAssignment,
      assignmentLoanDataBase.assignmentDate,
      assignmentLoanDataBase.status
    );

    await this.validations.validateIfRangeOfDaysToAssignmentLoanIsValid(data.startDateAssignment, data.endDateAssignment);

    await this.assignmentRepository.updateAssignmentLoan(assignmentLoan, data.vehiclesForDelete);
  }
}
