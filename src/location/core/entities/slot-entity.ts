export enum SlotStatus {
  ACTIVE = 'ACTIVO',
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
  readonly limitSchedules: number;
  readonly costType: CostType;
  readonly cost: number;
  readonly vehicleType: VehicleType;
  readonly status: SlotStatus;

  constructor(
    id: string,
    slotNumber: string,
    slotType: SlotType,
    limitSchedules: number,
    costType: CostType,
    cost: number,
    vehicleType: VehicleType,
    status: SlotStatus
  ) {
    this.validateData({ slotType, limitSchedules, costType, cost });
    this.id = id;
    this.slotNumber = slotNumber;
    this.slotType = slotType;
    this.limitSchedules = limitSchedules;
    this.costType = costType;
    this.cost = cost;
    this.vehicleType = vehicleType;
    this.status = status;
  }

  static fromPrimitives(plainData: {
    id: string;
    slotNumber: string;
    slotType: SlotType;
    limitSchedules: number;
    costType: CostType;
    cost: number;
    vehicleType: VehicleType;
    status: SlotStatus;
  }) {
    return new SlotEntity(
      plainData.id,
      plainData.slotNumber,
      plainData.slotType,
      plainData.limitSchedules,
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
      limitSchedules: this.limitSchedules,
      costType: this.costType,
      cost: this.cost,
      vehicleType: this.vehicleType,
      status: this.status
    };
  }

  private validateData(data: {
    slotType: SlotType;
    limitSchedules: number;
    costType: CostType;
    cost: number;
  }) {
    if (
      data.slotType === SlotType.SIMPLE &&
      (data.limitSchedules > 1 || data.limitSchedules < 1)
    ) {
      throw new Error(
        `The number of schedules cannot be greater than 1 or less than 1 for ${SlotType.SIMPLE} type spaces.`
      );
    }

    if (
      data.slotType === SlotType.MULTIPLE &&
      (data.limitSchedules <= 1 || data.limitSchedules > 23)
    ) {
      throw new Error(
        'The number of schedules for a multiple space should be between 2 and 23.'
      );
    }

    if (
      (data.costType === CostType.DISCOUNT ||
        data.costType === CostType.COMPLEMENT) &&
      data.cost === 0
    ) {
      throw new Error(
        `You must assign a value of whether the type of space is ${CostType.DISCOUNT} or ${CostType.COMPLEMENT}.`
      );
    }

    if (
      data.costType === CostType.NO_COST &&
      (data.cost > 0 || data.cost < 0)
    ) {
      throw new Error(
        `You cannot assign a cost value if the type is ${CostType.NO_COST}.`
      );
    }
  }
}
