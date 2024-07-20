import { AssignmentEntity } from '../entities/assignment-entity';
import { DeAssignmentEntity } from '../entities/deassignment-entity';
import { DiscountNoteEntity } from '../entities/discount-note-entity';
import { EmployeeEntity } from '../entities/employee-entity';
import { ScheduleEntity } from '../entities/schedule-entity';
import { VehicleEntity } from '../entities/vehicle-entity';
import { AssignmentLoadEntity } from '../entities/assignment-load-entity';

export type AssignmentFinderResult = Promise<{
  pageCounter: number;
  data: AssignmentEntity[];
}>;

export interface AssignmentRepository {
  createAssignment(assignment: AssignmentEntity): Promise<void>;
  createAssignmentLoan(assignmentLoan: AssignmentLoadEntity): Promise<void>;
  getAssignmentById(id: string): Promise<AssignmentEntity | null>;
  getAssignments(
    limit: number,
    page: number
  ): Promise<AssignmentFinderResult | null>;
  createDeAssignment(
    assignmentId: string,
    deAssignment: DeAssignmentEntity
  ): Promise<void>;
  createDiscountNote(idAssignment: string): Promise<void>;
  getDiscountNoteByIdAssignment(id: string): Promise<DiscountNoteEntity | null>;
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
}
