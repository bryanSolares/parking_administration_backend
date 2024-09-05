import { AssignmentEntity } from '../entities/assignment-entity';
import { AssignmentStatus } from '../entities/assignment-entity';
import { DeAssignmentEntity } from '../entities/deassignment-entity';
import { DiscountNoteEntity } from '../entities/discount-note-entity';
import { DiscountNodeStatusSignature } from '../entities/discount-note-entity';
import { EmployeeEntity } from '../entities/employee-entity';
import { ScheduleEntity } from '../entities/schedule-entity';
import { VehicleEntity } from '../entities/vehicle-entity';
import { AssignmentLoadEntity } from '../entities/assignment-load-entity';
import { TagEntity } from '@src/parameters/core/entities/tag-entity';
import { LocationEntity } from '@src/location/core/entities/location-entity';
import { CostType } from '@src/location/core/entities/slot-entity';

export type FinderResultById = {
  id: string;
  assignmentDate: string;
  decisionDate: string;
  parkingCardNumber: string;
  benefitType: CostType;
  status: AssignmentStatus;
  location: LocationEntity;
  employee: EmployeeEntity;
  tags: TagEntity[];
  discountNote?: DiscountNoteEntity;
};

export type AssignmentFinderResult = Promise<{
  pageCounter: number;
  data: Omit<FinderResultById, 'tags'>[];
}>;

export type ReturnType = {
  [key: string]: boolean;
};

export enum ListOfFunctions {
  FN_VERIFY_IF_CAN_CREATE_MORE_ASSIGNMENTS = 'can_create_more_assignments_in_slot',
  FN_EMPLOYEE_HAS_AN_ACTIVE_ASSIGNMENT = 'employee_has_an_active_assignment'
}

export interface AssignmentRepository {
  createAssignment(assignment: AssignmentEntity): Promise<void>;
  getAssignmentById(id: string): Promise<FinderResultById | null>;
  getAssignments(limit: number, page: number): Promise<AssignmentFinderResult>;
  createDeAssignment(deAssignment: DeAssignmentEntity): Promise<void>;
  createDiscountNote(discountNote: DiscountNoteEntity): Promise<void>;
  getDiscountNoteById(id: string): Promise<DiscountNoteEntity | null>;
  updateStatusDiscountNote(
    discountNoteId: string,
    status: DiscountNodeStatusSignature
  ): Promise<void>;
  createAssignmentLoan(assignmentLoan: AssignmentLoadEntity): Promise<void>;
  getAssignmentLoanByIdAssignment(
    assignmentId: string
  ): Promise<AssignmentLoadEntity | null>;
  getAssignmentLoanById(
    assignmentLoanId: string
  ): Promise<AssignmentLoadEntity | null>;
  deleteAssignmentLoan(assignmentLoanId: string): Promise<void>;
  updateAssignmentLoan(
    assignmentLoan: AssignmentLoadEntity,
    vehiclesForDelete: string[]
  ): Promise<void>;

  employeeHasAnActiveAssignment(employeeId: string): Promise<boolean>;
  canCreateMoreSchedulesInSlot(slotId: string): Promise<boolean>;
  upsertEmployee(employee: EmployeeEntity): Promise<string>;
  upsertVehicles(
    vehicles: VehicleEntity[],
    ownerVehicle: string
  ): Promise<void>;
  upsertSchedule(schedule: ScheduleEntity, slot_id: string): Promise<string>;
  updateAssignment(
    assignment: AssignmentEntity,
    vehicleIdsForDelete: string[]
  ): Promise<void>;

  executeFunction(
    functionName: ListOfFunctions,
    parameters: string[]
  ): Promise<ReturnType>;

  changeStatusAssignment(
    assignmentId: string,
    status: AssignmentStatus,
    assignmentDate?: string
  ): Promise<void>;
}
