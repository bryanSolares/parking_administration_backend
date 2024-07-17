import {
  AssignmentFinderResult,
  AssignmentRepository
} from '@src/core/assignments/repositories/assignment-repository';

export class AssignmentFinder {
  constructor(private readonly assignmentRepository: AssignmentRepository) {}

  async run(
    limit: number,
    page: number
  ): Promise<AssignmentFinderResult | null> {
    return this.assignmentRepository.getAssignments(limit, page);
  }
}
