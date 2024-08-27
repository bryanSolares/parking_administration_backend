import { EmployeeEntity } from './employee-entity';

import { TokenStatus } from './employee-entity';
import { CostType } from '@location-module-core/entities/slot-entity';
import { SlotEntity } from '@location-module-core/entities/slot-entity';
import { SlotStatus } from '@location-module-core/entities/slot-entity';
import { SlotType } from '@location-module-core/entities/slot-entity';
import { VehicleType } from '@location-module-core/entities/slot-entity';

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
    public readonly assignmentDate?: Date,
    public readonly decisionDate?: Date
    //public readonly assignmentLoan: string,
    //public readonly discountNote: string,
    //public readonly tags: string
  ) {
    this.id = id;
    this.slot = slot;
    this.employee = employee;
    this.assignmentDate = assignmentDate;
    this.decisionDate = decisionDate;
    this.status = status;
    //this.assignmentLoan = assignmentLoan;
    ///this.discountNote = discountNote;
    //this.tags = tags;
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
    assignmentDate?: Date;
    decisionDate?: Date;
    //assignmentLoan: string;
    //discountNote: string;
    //tags: string;
  }): AssignmentEntity {
    return new AssignmentEntity(
      primitiveData.id,
      SlotEntity.fromPrimitives(primitiveData.slot),
      EmployeeEntity.fromPrimitive(primitiveData.employee),
      primitiveData.status,
      primitiveData.assignmentDate,
      primitiveData.decisionDate
      //primitiveData.assignmentLoan,
      //primitiveData.discountNote,
      //primitiveData.tags
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
      status: this.status
      //assignmentLoan: this.assignmentLoan,
      //discountNote: this.discountNote,
      //tags: this.tags
    };
  }
}
