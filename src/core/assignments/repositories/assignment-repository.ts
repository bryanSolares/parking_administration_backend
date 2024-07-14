import { AssignmentEntity } from '../entities/assignment-entity';
import { DeAssignmentEntity } from '../entities/deassignment-entity';
import { DiscountNoteEntity } from '../entities/discount-note-entity';

export interface AssignmentRepository {
  createAssignment(assignment: AssignmentEntity): Promise<void>;
  getAssignmentById(id?: string): Promise<AssignmentEntity | null>;
  getAssignments(): Promise<AssignmentEntity[] | null>;
  deAssignmentById(
    assignmentId: string,
    deAssignment: DeAssignmentEntity
  ): Promise<void>;
  // updateAssignment(assignment: AssignmentEntity): Promise<void>;
  // deleteAssignment(id: string): Promise<void>;
  createDiscountNote(idAssignment: string): Promise<void>;
  getDiscountNoteByIdAssignment(id: string): Promise<DiscountNoteEntity | null>;
  employeeHasAnActiveAssignment(employeeId: string): Promise<boolean>;
  isAValidSlot(slotId: string): Promise<boolean>;
  canCreateMoreSchedulesInSlot(slotId: string): Promise<boolean>;
}
