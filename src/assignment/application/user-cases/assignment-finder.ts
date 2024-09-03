import { AssignmentRepository } from '@assignment-module-core/repositories/assignment-repository';
import { AssignmentFinderResult } from '@assignment-module-core/repositories/assignment-repository';

export class AssignmentFinder {
  constructor(private readonly assignmentRepository: AssignmentRepository) {}

  async run(limit: number, page: number): Promise<AssignmentFinderResult> {
    return this.assignmentRepository.getAssignments(limit, page);
  }
}
