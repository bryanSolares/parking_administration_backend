import { v4 as uuid } from 'uuid';

import { AssignmentStatus } from '@src/contexts/assignment/core/entities/assignment-entity';
import { AssignmentRepository } from '@src/contexts/assignment/core/repositories/assignment-repository';
import { SettingRepository } from '@src/contexts/parameters/core/repositories/setting-repository';
import { SettingKeys } from '@src/contexts/parameters/core/repositories/setting-repository';
import {
  EventStatus,
  EventType,
  NotificationQueue,
  Payload,
  SenderType,
  TargetType
} from '@src/contexts/shared/core/notification_queue';
import { AppError } from '@src/contexts/shared/infrastructure/exception/AppError';
import { NotificationQueueRepository } from '@src/contexts/shared/core/repositories.ts/notification-queue-repository';

// type SignatureEmployee = {
//   employee_code: string;
//   name: string;
// };

export class CreateAcceptanceProcessUseCase {
  constructor(
    private readonly assignmentRepository: AssignmentRepository,
    private readonly settingRepository: SettingRepository,
    private readonly notification: NotificationQueueRepository
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

    const notificationEntity = new NotificationQueue(
      uuid(),
      EventType.ACCEPTANCE_FORM,
      {
        transactionId: assignment.id,
        destinations: [
          {
            sender: SenderType.EMAIL,
            address: assignment.employee.email,
            target: TargetType.TO
          }
        ]
      } satisfies Payload,
      EventStatus.PENDING
    );
    await this.notification.create(notificationEntity);
  }
}
