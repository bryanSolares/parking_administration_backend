import { AssignmentStatus } from '@src/assignment/core/entities/assignment-entity';
import { AssignmentRepository } from '@src/assignment/core/repositories/assignment-repository';
import { SettingRepository } from '@src/parameters/core/repositories/setting-repository';
import { SettingKeys } from '@src/parameters/core/repositories/setting-repository';
import { AppError } from '@src/server/config/err/AppError';

export class GetFormDataOfAcceptanceUseCase {
  constructor(
    private readonly assignmentRepository: AssignmentRepository,
    private readonly settingRepository: SettingRepository
  ) {}

  async run(assignmentId: string) {
    const assignment =
      await this.assignmentRepository.getAssignmentById(assignmentId);

    if (!assignment) {
      throw new AppError(
        'ASSIGNMENT_NOT_FOUND',
        404,
        'Assignment not found',
        true
      );
    }

    if (
      assignment.status !==
      (AssignmentStatus.CREATED || AssignmentStatus.IN_PROGRESS)
    ) {
      throw new AppError(
        'ASSIGNMENT_NOT_VALID',
        400,
        'The assignment is not valid, please check the status of the assignment',
        true
      );
    }

    const signatures = await this.settingRepository.getParameterByKey(
      SettingKeys.SIGNATURES_FOR_ACCEPTANCE_FORM
    );

    if (!signatures) {
      throw new AppError(
        'SETTING_NOT_FOUND',
        404,
        'Data signatures for acceptance form not found',
        true
      );
    }

    const { id, employeeCode, name, phone, email, subManagement, management1 } =
      assignment.employee;

    return {
      assignmentId: assignment.id,
      employee: {
        id,
        employeeCode,
        name,
        phone,
        email,
        subManagement,
        management1
      },
      previousEmployee: {
        id,
        employeeCode,
        name,
        phone,
        email,
        subManagement,
        management1
      },
      signatures: signatures.settingValue
    };
  }
}
