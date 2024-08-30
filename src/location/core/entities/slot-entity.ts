import { AppError } from '@src/server/config/err/AppError';

export enum SlotStatus {
  ACTIVE = 'DISPONIBLE',
  INACTIVE = 'INACTIVO',
  OCCUPIED = 'OCUPADO'
}
export enum SlotType {
  SIMPLE = 'SIMPLE',
  MULTIPLE = 'MULTIPLE'
}
export enum CostType {
  NO_COST = 'SIN_COSTO',
  DISCOUNT = 'DESCUENTO',
  COMPLEMENT = 'COMPLEMENTO'
}
export enum VehicleType {
  CAR = 'CARRO',
  CYCLE = 'MOTO',
  TRUCK = 'CAMION'
}

export class SlotEntity {
  readonly id: string;
  readonly slotNumber: string;
  readonly slotType: SlotType;
  readonly limitOfAssignments: number;
  readonly costType: CostType;
  readonly cost: number;
  readonly vehicleType: VehicleType;
  readonly status: SlotStatus;

  constructor(
    id: string,
    slotNumber: string,
    slotType: SlotType,
    limitOfAssignments: number,
    costType: CostType,
    cost: number,
    vehicleType: VehicleType,
    status: SlotStatus
  ) {
    this.validateData({ slotType, limitOfAssignments, costType, cost });
    this.id = id;
    this.slotNumber = slotNumber;
    this.slotType = slotType;
    this.limitOfAssignments = limitOfAssignments;
    this.costType = costType;
    this.cost = cost;
    this.vehicleType = vehicleType;
    this.status = status;
  }

  static fromPrimitives(plainData: {
    id: string;
    slotNumber: string;
    slotType: SlotType;
    limitOfAssignments: number;
    costType: CostType;
    cost: number;
    vehicleType: VehicleType;
    status: SlotStatus;
  }) {
    return new SlotEntity(
      plainData.id,
      plainData.slotNumber,
      plainData.slotType,
      plainData.limitOfAssignments,
      plainData.costType,
      plainData.cost,
      plainData.vehicleType,
      plainData.status
    );
  }

  toPrimitives() {
    return {
      id: this.id,
      slotNumber: this.slotNumber,
      slotType: this.slotType,
      limitOfAssignments: this.limitOfAssignments,
      costType: this.costType,
      cost: this.cost,
      vehicleType: this.vehicleType,
      status: this.status
    };
  }

  private validateData(data: {
    slotType: SlotType;
    limitOfAssignments: number;
    costType: CostType;
    cost: number;
  }) {
    if (
      data.slotType === SlotType.SIMPLE &&
      (data.limitOfAssignments > 1 || data.limitOfAssignments < 1)
    ) {
      throw new AppError(
        'ENTITY_VALIDATIONS',
        400,
        `The number of schedules cannot be greater than 1 or less than 1 for ${SlotType.SIMPLE} type spaces.`,
        true
      );
    }

    if (data.slotType === SlotType.MULTIPLE && data.limitOfAssignments <= 1) {
      throw new AppError(
        'ENTITY_VALIDATIONS',
        400,
        'The number of schedules for a multiple space should be greater than 1.',
        true
      );
    }

    if (
      (data.costType === CostType.DISCOUNT ||
        data.costType === CostType.COMPLEMENT) &&
      data.cost === 0
    ) {
      throw new AppError(
        'ENTITY_VALIDATIONS',
        400,
        `You must assign a value of whether the type of space is ${CostType.DISCOUNT} or ${CostType.COMPLEMENT}.`,
        true
      );
    }

    if (
      data.costType === CostType.NO_COST &&
      (data.cost > 0 || data.cost < 0)
    ) {
      throw new AppError(
        'ENTITY_VALIDATIONS',
        400,
        `You cannot assign a cost value if the type is ${CostType.NO_COST}.`,
        true
      );
    }
  }
}
