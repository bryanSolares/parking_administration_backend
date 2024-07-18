import { AssignmentEntity } from '@src/core/assignments/entities/assignment-entity';
import { AssignmentNotFoundError } from '@src/core/assignments/exceptions/assignment-not-found';
import { AssignmentRepository } from '@src/core/assignments/repositories/assignment-repository';

export class UpdateAssignment {
  constructor(public readonly assignmentRepository: AssignmentRepository) {}

  async run(assignment: AssignmentEntity): Promise<void> {
    const assignmentDatabase =
      await this.assignmentRepository.getAssignmentById(assignment.id);

    if (!assignmentDatabase) {
      throw new AssignmentNotFoundError('Assignment not found');
    }

    if (assignmentDatabase.employee.id !== assignment.employee.id) {
      throw new Error(
        'You can not update an assignment with another employee (owner)'
      );
    }

    if (
      assignmentDatabase.assignment_loan?.employee &&
      assignment.assignment_loan?.employee?.id !==
        assignmentDatabase.assignment_loan?.employee?.id
    ) {
      throw new Error(
        'You can not update an assignment with another employee (guest)'
      );
    }

    if (assignmentDatabase.status === 'INACTIVO') {
      throw new Error('Can not update an inactive assignment');
    }

    if (
      (assignmentDatabase.schedule && !assignment.schedule) ||
      (!assignmentDatabase.schedule && assignment.schedule)
    ) {
      throw new Error(
        'You can not add a schedule if it did exist before and you must provide a schedule if it did exist before'
      );
    }

    await this.assignmentRepository.updateAssignment({
      ...assignment,
      schedule: {
        ...assignment.schedule,
        id: assignmentDatabase.schedule.id
      }
    });
  }
}
