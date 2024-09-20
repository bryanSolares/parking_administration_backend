import { diffDays } from '@formkit/tempo';
import { AssignmentRepository } from '@src/assignment/core/repositories/assignment-repository';
import { LocationRepository } from '@src/location/core/repositories/location-repository';
import { ListOfFunctions } from '@src/assignment/core/repositories/assignment-repository';
import { EmployeeRepository } from '@src/assignment/core/repositories/employee-repository';
import { SlotEntity } from '@src/location/core/entities/slot-entity';
import { SlotStatus } from '@src/location/core/entities/slot-entity';
import { SlotType } from '@src/location/core/entities/slot-entity';
import { TagEntity } from '@src/parameters/core/entities/tag-entity';
import { SettingRepository } from '@src/parameters/core/repositories/setting-repository';
import { SettingKeys } from '@src/parameters/core/repositories/setting-repository';
import { AppError } from '@src/shared/infrastructure/server/config/err/AppError';
import { LocationStatus } from '@src/location/core/entities/location-entity';

export class Validations {
  constructor(
    private readonly assignmentRepository: AssignmentRepository,
    private readonly employeeRepository: EmployeeRepository,
    private readonly settingRepository: SettingRepository,
    private readonly locationRepository: LocationRepository
  ) {}

  public async validateIfCanCreate(data: {
    slot: SlotEntity | null;
    employee: {
      id: string;
      vehicles: {
        id: string;
      }[];
    };
    tags: {
      request: string[];
      database: TagEntity[] | [];
    };
  }): Promise<void> {
    await this.validateIfSlotIsValid(data.slot);
    this.validateIfTagsAreValid(data.tags);
    await this.validateIfCanCreateAssignmentInSlot(data.slot!);
    await this.validateIfVehiclesBelongToEmployee(data.employee.id, data.employee.vehicles);
    await this.validateIfEmployeeHasAnActiveAssignment(data.employee.id);
  }

  public async validateIfCanCreateAssignmentLoan(employee: {
    id: string;
    vehicles: {
      id: string;
    }[];
  }) {
    await this.validateIfEmployeeHasAnActiveAssignment(employee.id);
    await this.validateIfVehiclesBelongToEmployee(employee.id, employee.vehicles);
  }

  private async validateIfSlotIsValid(slot: SlotEntity | null) {
    if (!slot) {
      throw new AppError('SLOT_NOT_FOUND', 404, 'Slot not found', true);
    }

    if (slot.status === SlotStatus.INACTIVE) {
      throw new AppError('SLOT_NOT_AVAILABLE', 400, 'Slot is not available', true);
    }

    if (slot.slotType === SlotType.SIMPLE && slot.status === SlotStatus.OCCUPIED) {
      throw new AppError('SLOT_OCCUPIED', 400, 'Slot is occupied, you can not create an assignment in this slot', true);
    }

    const location = await this.locationRepository.getLocationBySlotId(slot.id);

    if (!location) {
      throw new AppError('LOCATION_NOT_FOUND', 404, 'Location not found', true);
    }

    if (location.status === LocationStatus.INACTIVE) {
      throw new AppError('LOCATION_NOT_AVAILABLE', 400, 'You can not create an assignment if the location is inactive', true);
    }
  }

  private async validateIfCanCreateAssignmentInSlot(slot: SlotEntity) {
    if (slot.slotType === SlotType.MULTIPLE && slot.status !== SlotStatus.INACTIVE) {
      const canCreateMoreAssignments = await this.assignmentRepository.executeFunction(
        ListOfFunctions.FN_VERIFY_IF_CAN_CREATE_MORE_ASSIGNMENTS,
        [slot.id]
      );
      if (!canCreateMoreAssignments) {
        throw new AppError('CAN_NOT_CREATE_MORE_ASSIGNMENTS', 400, 'You can not create more assignments in this slot', true);
      }
    }
  }

  private async validateIfEmployeeHasAnActiveAssignment(employeeId: string) {
    if (employeeId) {
      const employeeHasActiveAssignment = await this.assignmentRepository.executeFunction(
        ListOfFunctions.FN_EMPLOYEE_HAS_AN_ACTIVE_ASSIGNMENT,
        [employeeId]
      );

      if (employeeHasActiveAssignment) {
        throw new AppError('EMPLOYEE_HAS_AN_ACTIVE_ASSIGNMENT', 400, 'Employee has an active assignment', true);
      }
    }
  }

  public async validateIfVehiclesBelongToEmployee(employeeId: string, vehiclesRequest: { id: string }[]) {
    if (!employeeId && vehiclesRequest.some(vehicle => vehicle.id && /\w+/.test(vehicle.id))) {
      throw new AppError('VEHICLE_NOT_VALID', 400, `You cannot add vehicles identified to a new employee.`, true);
    }

    if (employeeId) {
      const employeeDatabase = await this.employeeRepository.getEmployeeByIdFromDatabase(employeeId);

      if (!employeeDatabase) {
        throw new AppError('EMPLOYEE_NOT_FOUND', 400, 'Employee not found', true);
      }

      const vehicles = new Set(employeeDatabase.vehicles.map(vehicle => vehicle.id));

      vehiclesRequest.forEach(vehicle => {
        if (vehicle && vehicle.id && !vehicles.has(vehicle.id)) {
          throw new AppError('VEHICLE_NOT_FOUND', 400, `The vehicle with id ${vehicle.id} does not belong to the employee`, true);
        }
      });
    }
  }

  public validateIfTagsAreValid(tags: { request: string[]; database: TagEntity[] | [] }) {
    if (tags.request.length !== tags.database.length) {
      throw new AppError('TAGS_NOT_VALID', 400, 'Tags are not valid or not exist', true);
    }
  }

  public async validateIfRangeOfDaysToAssignmentLoanIsValid(start: string, end: string) {
    const diffDaysToAssignmentLoan = diffDays(end, start);

    const setting = await this.settingRepository.getParameterByKey(SettingKeys.MAX_DAYS_TO_ASSIGNMENT_LOAN);

    if (!setting) {
      throw new AppError('SETTING_NOT_FOUND', 404, 'Data max days to assignment loan not found', true);
    }

    if (diffDaysToAssignmentLoan > Number(setting.settingValue)) {
      throw new AppError(
        'INVALID_DATE_RANGE',
        400,
        `Date range is invalid, you can only create assignment loan for a maximum of ${setting.settingValue} days`,
        true
      );
    }
  }
}
