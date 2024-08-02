import { AssignmentRepository } from '@assignment-module-core/repositories/assignment-repository';
import { AssignmentEntity } from '@assignment-module-core/entities/assignment-entity';
import { AssignmentNotFoundError } from '@assignment-module-core/exceptions/assignment-not-found';

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

    // Validate if schedule previously exist
    if (
      (assignmentDatabase.schedule && !assignment.schedule) ||
      (!assignmentDatabase.schedule && assignment.schedule)
    ) {
      throw new Error(
        'You can not add a schedule if it did exist before and you must provide a schedule if it had before'
      );
    }

    // Validate if the assignment have or not a loan
    if (
      (assignment.assignment_loan && !assignmentDatabase.assignment_loan) ||
      (!assignment.assignment_loan && assignmentDatabase.assignment_loan)
    ) {
      throw new Error(
        'You can not update an assignment if it had not loan before or you should provide a loan if it had before'
      );
    }

    // Validate that employee is the same (owner)
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

    await this.assignmentRepository.updateAssignment(
      {
        ...assignment,
        schedule: {
          ...assignment.schedule,
          id: assignmentDatabase.schedule?.id
        }
      },
      vehicleIdsForDelete
    );
  }
}
