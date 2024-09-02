import { AssignmentRepository } from '@src/assignment/core/repositories/assignment-repository';
import { ListOfFunctions } from '@src/assignment/core/repositories/assignment-repository';
import { EmployeeRepository } from '@src/assignment/core/repositories/employee-repository';
import { SlotEntity } from '@src/location/core/entities/slot-entity';
import { SlotStatus } from '@src/location/core/entities/slot-entity';
import { SlotType } from '@src/location/core/entities/slot-entity';
import { TagEntity } from '@src/parameters/core/entities/tag-entity';
import { AppError } from '@src/server/config/err/AppError';

export class Validations {
  constructor(
    private readonly assignmentRepository: AssignmentRepository,
    private readonly employeeRepository: EmployeeRepository
  ) {}

  public async validateIfCanCreate(data: {
    slot: SlotEntity | null;
    employee: {
      id: string;
      employeeCode: string;
      vehicles: {
        id: string;
      }[];
    };
    tags: {
      request: string[];
      database: TagEntity[] | [];
    };
  }): Promise<void> {
    this.validateIfSlotIsValid(data.slot);
    await this.validateIfCanCreateAssignmentInSlot(data.slot!);
    await this.validateIfVehiclesBelongToEmployee(
      data.employee.id,
      data.employee.employeeCode,
      data.employee.vehicles
    );
    await this.validateIfEmployeeHasAnActiveAssignment(data.employee.id);
    this.validateIfTagsAreValid(data.tags);
  }

  private validateIfSlotIsValid(slot: SlotEntity | null) {
    if (!slot) {
      throw new AppError('SLOT_NOT_FOUND', 400, 'Slot not found', true);
    }

    if (slot.status === SlotStatus.INACTIVE) {
      throw new AppError(
        'SLOT_NOT_AVAILABLE',
        400,
        'Slot is not available',
        true
      );
    }
  }

  private async validateIfCanCreateAssignmentInSlot(slot: SlotEntity) {
    if (
      slot.slotType === SlotType.SIMPLE &&
      slot.status === SlotStatus.OCCUPIED
    ) {
      throw new AppError(
        'SLOT_OCCUPIED',
        400,
        'Slot is occupied, you can not create an assignment in this slot',
        true
      );
    }

    if (
      slot.slotType === SlotType.MULTIPLE &&
      slot.status !== SlotStatus.INACTIVE
    ) {
      const canCreateMoreAssignments =
        await this.assignmentRepository.executeFunction(
          ListOfFunctions.FN_VERIFY_IF_CAN_CREATE_MORE_ASSIGNMENTS,
          [slot.id]
        );
      if (!canCreateMoreAssignments) {
        throw new AppError(
          'CAN_NOT_CREATE_MORE_ASSIGNMENTS',
          400,
          'You can not create more assignments in this slot',
          true
        );
      }
    }
  }

  private async validateIfEmployeeHasAnActiveAssignment(employeeId: string) {
    if (employeeId) {
      const employeeHasActiveAssignment =
        await this.assignmentRepository.executeFunction(
          ListOfFunctions.FN_EMPLOYEE_HAS_AN_ACTIVE_ASSIGNMENT,
          [employeeId]
        );

      if (employeeHasActiveAssignment) {
        throw new AppError(
          'EMPLOYEE_HAS_AN_ACTIVE_ASSIGNMENT',
          400,
          'Employee has an active assignment',
          true
        );
      }
    }
  }

  private async validateIfVehiclesBelongToEmployee(
    employeeId: string,
    employeeCode: string,
    vehiclesRequest: { id: string }[]
  ) {
    if (
      !employeeId &&
      vehiclesRequest.some(vehicle => vehicle.id && /\w+/.test(vehicle.id))
    ) {
      throw new AppError(
        'VEHICLE_NOT_VALID',
        400,
        `You cannot add vehicles identified to a new employee.`,
        true
      );
    }

    if (employeeId) {
      const employeeDatabase =
        await this.employeeRepository.getEmployeeFromDatabase(employeeCode);

      if (!employeeDatabase) {
        throw new AppError(
          'EMPLOYEE_NOT_FOUND',
          400,
          'Employee not found',
          true
        );
      }

      const vehicles = new Set(
        employeeDatabase.vehicles.map(vehicle => vehicle.id)
      );

      vehiclesRequest.forEach(vehicle => {
        if (vehicle && !vehicles.has(vehicle.id)) {
          throw new AppError(
            'VEHICLE_NOT_FOUND',
            400,
            'You can not add this vehicles because it does not belong to the employee',
            true
          );
        }
      });
    }
  }

  private validateIfTagsAreValid(tags: {
    request: string[];
    database: TagEntity[] | [];
  }) {
    if (tags.request.length !== tags.database.length) {
      throw new AppError(
        'TAGS_NOT_VALID',
        400,
        'Tags are not valid or not exist',
        true
      );
    }
  }
}
