import { isBefore } from '@formkit/tempo';
import { isEqual } from '@formkit/tempo';

import { VehicleType } from '@src/location/core/entities/slot-entity';
import { EmployeeEntity, TokenStatus } from './employee-entity';
import { AppError } from '@src/server/config/err/AppError';

export enum AssignmentLoadStatus {
  'ACTIVE' = 'ACTIVO',
  'INACTIVE' = 'INACTIVO'
}

export class AssignmentLoadEntity {
  readonly DATE_FORMAT_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

  constructor(
    public readonly id: string,
    public readonly assignmentId: string,
    public readonly employee: EmployeeEntity,
    public readonly startDateAssignment: string,
    public readonly endDateAssignment: string,
    public readonly assignmentDate: string,
    public readonly status: AssignmentLoadStatus
  ) {
    this.validateDateOfAssignmentLoan(
      startDateAssignment,
      endDateAssignment,
      assignmentDate
    );
    this.id = id;
    this.assignmentId = assignmentId;
    this.employee = employee;
    this.startDateAssignment = startDateAssignment;
    this.endDateAssignment = endDateAssignment;
    this.assignmentDate = assignmentDate;
    this.status = status;
  }

  static fromPrimitives(primitiveData: {
    id: string;
    assignmentId: string;
    employee: {
      id: string;
      employeeCode: string;
      name: string;
      workplace: string;
      identifierDocument: string;
      company: string;
      department: string;
      subManagement: string;
      management1: string;
      management2: string;
      workSite: string;
      address: string;
      email: string;
      phone: string;
      vehicles: {
        id: string;
        vehicleBadge: string;
        color: string;
        brand: string;
        model: string;
        type: VehicleType;
      }[];
      accessToken?: string;
      accessTokenStatus?: TokenStatus;
    };
    startDateAssignment: string;
    endDateAssignment: string;
    assignmentDate: string;
    status: AssignmentLoadStatus;
  }): AssignmentLoadEntity {
    return new AssignmentLoadEntity(
      primitiveData.id,
      primitiveData.assignmentId,
      EmployeeEntity.fromPrimitive(primitiveData.employee),
      primitiveData.startDateAssignment,
      primitiveData.endDateAssignment,
      primitiveData.assignmentDate,
      primitiveData.status
    );
  }

  toPrimitives() {
    return {
      id: this.id,
      assignmentId: this.assignmentId,
      employee: this.employee.toPrimitive(),
      startDateAssignment: this.startDateAssignment,
      endDateAssignment: this.endDateAssignment,
      assignmentDate: this.assignmentDate,
      status: this.status
    };
  }

  private validateDateOfAssignmentLoan(
    start: string,
    end: string,
    assignmentDate: string
  ) {
    if (
      !this.validateFormatDate(start) ||
      !this.validateFormatDate(end) ||
      !this.validateFormatDate(assignmentDate)
    ) {
      throw new AppError(
        'INVALID_DATE_FORMAT',
        400,
        'Date format must be YYYY-MM-DD',
        true
      );
    }

    if (isBefore(start, assignmentDate)) {
      throw new AppError(
        'INVALID_START_DATE',
        400,
        'Start date must be greater or equal than today',
        true
      );
    }

    if (isBefore(end, start)) {
      throw new AppError(
        'INVALID_END_DATE',
        400,
        'End date must be greater than start date',
        true
      );
    }

    if (!isBefore(assignmentDate, end)) {
      throw new AppError(
        'INVALID_END_DATE',
        400,
        'End date must be greater than today',
        true
      );
    }

    if (isEqual(start, end)) {
      throw new AppError(
        'INVALID_START_AND_END_DATE',
        400,
        'Start date must be less than end date',
        true
      );
    }
  }

  private validateFormatDate(date: string): boolean {
    return this.DATE_FORMAT_PATTERN.test(date);
  }
}
