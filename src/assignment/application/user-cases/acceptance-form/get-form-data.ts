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
      ![AssignmentStatus.ASSIGNED, AssignmentStatus.IN_PROGRESS].some(
        status => status === assignment.status
      )
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
        400,
        'Data signatures for acceptance form not found',
        true
      );
    }

    const { id, employeeCode, name, phone, email, subManagement, management1 } =
      assignment.employee;

    const previousAssignment =
      await this.assignmentRepository.getLastAssignmentInactiveBySlotId(
        assignment.location.slots[0].id
      );

    return {
      assignmentId: assignment.id,
      parkingCardNumber: assignment.parkingCardNumber,
      benefitType: assignment.benefitType,
      employee: {
        id,
        employeeCode,
        name,
        phone,
        email,
        subManagement,
        management1,
        vehicles: assignment.employee.vehicles
          ? assignment.employee.vehicles.map(vehicle => vehicle.toPrimitive())
          : []
      },
      previousEmployee: previousAssignment
        ? {
            assignment: {
              id: previousAssignment.id,
              benefitType: previousAssignment.benefitType,
              formDecisionDate: previousAssignment.formDecisionDate,
              parkingCardNumber: previousAssignment.parkingCardNumber,
              status: previousAssignment.status,
              assignmentDate: previousAssignment.assignmentDate
            },
            employee: {
              id: previousAssignment.employee.id,
              employeeCode: previousAssignment.employee.employeeCode,
              name: previousAssignment.employee.name,
              phone: previousAssignment.employee.phone,
              email: previousAssignment.employee.email,
              subManagement: previousAssignment.employee.subManagement,
              management1: previousAssignment.employee.management1,
              vehicles: previousAssignment.employee.vehicles
                ? previousAssignment.employee.vehicles.map(vehicle =>
                    vehicle.toPrimitive()
                  )
                : []
            },
            deAssignment: previousAssignment.deAssignment.toPrimitives()
          }
        : null,
      signatures: signatures.settingValue
    };
  }
}
