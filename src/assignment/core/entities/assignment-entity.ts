import { EmployeeEntity } from './employee-entity';

import { TokenStatus } from './employee-entity';
import { CostType } from '@location-module-core/entities/slot-entity';
import { SlotEntity } from '@location-module-core/entities/slot-entity';
import { SlotStatus } from '@location-module-core/entities/slot-entity';
import { SlotType } from '@location-module-core/entities/slot-entity';
import { VehicleType } from '@location-module-core/entities/slot-entity';
import { TagEntity, TagStatus } from '@src/parameters/core/entities/tag-entity';

export enum AssignmentStatus {
  'CREATED' = 'CREADO',
  'IN_PROGRESS' = 'EN_PROGRESO',
  'CANCELLED' = 'CANCELADO',
  'ACTIVE' = 'ACTIVO',
  'AUTO_DE_ASSIGNMENT' = 'BAJA_AUTOMATICA',
  'MANUAL_DE_ASSIGNMENT' = 'BAJA_MANUAL'
}

export class AssignmentEntity {
  constructor(
    public readonly id: string,
    public readonly slot: SlotEntity,
    public readonly employee: EmployeeEntity,
    public readonly status: AssignmentStatus,
    public readonly tags: TagEntity[],
    public readonly assignmentDate?: Date,
    public readonly decisionDate?: Date
  ) {
    this.id = id;
    this.slot = slot;
    this.employee = employee;
    this.assignmentDate = assignmentDate;
    this.decisionDate = decisionDate;
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
    status: AssignmentStatus;
    tags: {
      id: string;
      name: string;
      description: string;
      status: TagStatus;
    }[];
    assignmentDate?: Date;
    decisionDate?: Date;
  }): AssignmentEntity {
    return new AssignmentEntity(
      primitiveData.id,
      SlotEntity.fromPrimitives(primitiveData.slot),
      EmployeeEntity.fromPrimitive(primitiveData.employee),
      primitiveData.status,
      primitiveData.tags.map(tag => TagEntity.fromPrimitives(tag)) ?? [],
      primitiveData.assignmentDate,
      primitiveData.decisionDate
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
      decisionDate: this.decisionDate,
      status: this.status,
      tags: this.tags.map(tag => tag.toPrimitives()) ?? []
    };
  }
}
