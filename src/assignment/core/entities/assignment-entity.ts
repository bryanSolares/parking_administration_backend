import { EmployeeEntity } from './employee-entity';

import { TokenStatus } from './employee-entity';
import { CostType } from '@location-module-core/entities/slot-entity';
import { SlotEntity } from '@location-module-core/entities/slot-entity';
import { SlotStatus } from '@location-module-core/entities/slot-entity';
import { SlotType } from '@location-module-core/entities/slot-entity';
import { VehicleType } from '@location-module-core/entities/slot-entity';
import { TagEntity, TagStatus } from '@src/parameters/core/entities/tag-entity';

export enum AssignmentStatus {
  'ASSIGNED' = 'ASIGNADO',
  'IN_PROGRESS' = 'EN_PROGRESO',
  'CANCELLED' = 'CANCELADO',
  'REJECTED' = 'RECHAZADO',
  'ACCEPTED' = 'ACEPTADO',
  'AUTO_DE_ASSIGNMENT' = 'BAJA_AUTOMATICA',
  'MANUAL_DE_ASSIGNMENT' = 'BAJA_MANUAL'
}

export class AssignmentEntity {
  constructor(
    public readonly id: string,
    public readonly slot: SlotEntity,
    public readonly employee: EmployeeEntity,
    public readonly parkingCardNumber: string,
    public readonly benefitType: CostType,
    public readonly status: AssignmentStatus,
    public readonly tags: TagEntity[],
    public readonly assignmentDate?: string,
    public readonly formDecisionDate?: string
  ) {
    this.id = id;
    this.slot = slot;
    this.employee = employee;
    this.assignmentDate = assignmentDate;
    this.formDecisionDate = formDecisionDate;
    this.parkingCardNumber = parkingCardNumber;
    this.benefitType = benefitType;
    this.status = status;
    this.tags = tags;
  }

  public static fromPrimitive(primitiveData: {
    id: string;
    slot: {
      id: string;
      slotNumber: string;
      slotType: SlotType;
      limitOfAssignments: number;
      costType: CostType;
      cost: number;
      vehicleType: VehicleType;
      status: SlotStatus;
    };
    employee: {
      id: string;
      employeeCode: string;
      name: string;
      workplace: string;
      identifierDocument: string;
      company: string;
      department: string;
      subManagement: string;
      management1: string;
      management2: string;
      workSite: string;
      address: string;
      email: string;
      phone: string;
      accessToken: string;
      accessTokenStatus: TokenStatus;
      vehicles: {
        id: string;
        vehicleBadge: string;
        color: string;
        brand: string;
        model: string;
        type: VehicleType;
      }[];
    };
    parkingCardNumber: string;
    benefitType: CostType;
    status: AssignmentStatus;
    tags: {
      id: string;
      name: string;
      description: string;
      status: TagStatus;
    }[];
    assignmentDate?: string;
    formDecisionDate?: string;
  }): AssignmentEntity {
    return new AssignmentEntity(
      primitiveData.id,
      SlotEntity.fromPrimitives(primitiveData.slot),
      EmployeeEntity.fromPrimitive(primitiveData.employee),
      primitiveData.parkingCardNumber,
      primitiveData.benefitType,
      primitiveData.status,
      primitiveData.tags
        ? primitiveData.tags.map(tag => TagEntity.fromPrimitives(tag))
        : [],
      primitiveData.assignmentDate,
      primitiveData.formDecisionDate
    );
  }

  public toPrimitive() {
    return {
      id: this.id,
      slot: this.slot.toPrimitives(),
      employee: {
        ...this.employee.toPrimitive(),
        vehicles: this.employee.vehicles.map(vehicle => vehicle.toPrimitive())
      },
      assignmentDate: this.assignmentDate,
      formDecisionDate: this.formDecisionDate,
      parkingCardNumber: this.parkingCardNumber,
      benefitType: this.benefitType,
      status: this.status,
      tags: this.tags ? this.tags.map(tag => tag.toPrimitives()) : []
    };
  }
}
