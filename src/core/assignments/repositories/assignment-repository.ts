import { AssignmentEntity } from '../entities/assignment-entity';
import { DeAssignmentEntity } from '../entities/deassignment-entity';

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
}
