import { AssignmentStatus } from '@src/assignment/core/entities/assignment-entity';
import { AssignmentRepository } from '@src/assignment/core/repositories/assignment-repository';
import { SettingRepository } from '@src/parameters/core/repositories/setting-repository';
import { SettingKeys } from '@src/parameters/core/repositories/setting-repository';
import { AppError } from '@src/shared/infrastructure/server/config/err/AppError';

// type SignatureEmployee = {
//   employee_code: string;
//   name: string;
// };

export class CreateAcceptanceProcessUseCase {
  constructor(
    private readonly assignmentRepository: AssignmentRepository,
    private readonly settingRepository: SettingRepository
  ) {}

  async run(
    data: {
      headEmployeeData: {
        employeeCode: string;
        name: string;
        phone: string;
        email: string;
        subManagement: string;
        management1: string;
      };
      assignmentDate: string;
    },
    assignmentId: string
  ) {
    const assignment = await this.assignmentRepository.getAssignmentById(assignmentId);

    if (!assignment) {
      throw new AppError('ASSIGNMENT_NOT_FOUND', 404, 'Assignment not found', true);
    }

    if (![AssignmentStatus.ASSIGNED, AssignmentStatus.IN_PROGRESS].some(status => status === assignment.status)) {
      throw new AppError(
        'ASSIGNMENT_NOT_VALID',
        400,
        'The assignment is not valid, please check the status of the assignment',
        true
      );
    }

    const signatures = await this.settingRepository.getParameterByKey(SettingKeys.SIGNATURES_FOR_ACCEPTANCE_FORM);

    if (!signatures) {
      throw new AppError('SETTING_NOT_FOUND', 400, 'Data signatures for acceptance form not found', true);
    }

    //get employee of assignment
    //const employee = assignment.employee;

    //get previous employee of assignment

    //get boss data
    //const bossData = data;

    //get signatures
    // const signatureData: {
    //   security_boss: SignatureEmployee;
    //   parking_manager: SignatureEmployee;
    //   human_resources_manager: SignatureEmployee;
    //   human_resources_payroll: SignatureEmployee;
    // } = JSON.parse(signatures.settingValue);

    //build form

    //send form

    // update status
    await this.assignmentRepository.changeStatusAssignment(assignmentId, AssignmentStatus.IN_PROGRESS, data.assignmentDate);
  }
}
