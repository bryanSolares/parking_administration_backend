import { AssignmentEntity } from '@src/core/assignments/entities/assignment-entity';
import { AssignmentNotFoundError } from '@src/core/assignments/exceptions/assignment-not-found';
import { AssignmentRepository } from '@src/core/assignments/repositories/assignment-repository';

export class UpdateAssignment {
  constructor(private readonly assignmentRepository: AssignmentRepository) {}

  async run(
    assignment: AssignmentEntity,
    vehicleIdsForDelete: string[]
  ): Promise<void> {
    const assignmentDatabase =
      await this.assignmentRepository.getAssignmentById(assignment.id);

    // Validate if the assignment exists
    if (!assignmentDatabase) {
      throw new AssignmentNotFoundError('Assignment not found');
    }

    // Validate if the assignment is active
    if (assignmentDatabase.status === 'INACTIVO') {
      throw new Error('Can not update an inactive assignment');
    }

    // Validate if the assignment have loan
    if (assignment.assignment_loan && !assignmentDatabase.assignment_loan) {
      throw new Error(
        'You can not update an assignment with loan if it did not exist before'
      );
    }

    // Validate that employee is the same
    if (assignmentDatabase.employee.id !== assignment.employee.id) {
      throw new Error(
        'You can not update an assignment with another employee (owner)'
      );
    }

    // Validate that employee guest is the same
    if (
      assignment.assignment_loan?.employee?.id !==
      assignmentDatabase.assignment_loan?.employee?.id
    ) {
      throw new Error(
        'You can not update an assignment with another employee (guest)'
      );
    }

    // Validate if schedule previously exist
    if (
      (assignmentDatabase.schedule && !assignment.schedule) ||
      (!assignmentDatabase.schedule && assignment.schedule)
    ) {
      throw new Error(
        'You can not add a schedule if it did exist before and you must provide a schedule if it did exist before'
      );
    }

    await this.assignmentRepository.updateAssignment(
      {
        ...assignment,
        schedule: {
          ...assignment.schedule,
          id: assignmentDatabase.schedule.id
        }
      },
      vehicleIdsForDelete
    );
  }
}
