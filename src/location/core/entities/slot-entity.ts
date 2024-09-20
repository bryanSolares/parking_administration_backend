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
export enum BenefitType {
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
  readonly benefitType: BenefitType;
  readonly amount: number;
  readonly vehicleType: VehicleType;
  readonly status: SlotStatus;

  constructor(
    id: string,
    slotNumber: string,
    slotType: SlotType,
    limitOfAssignments: number,
    benefitType: BenefitType,
    amount: number,
    vehicleType: VehicleType,
    status: SlotStatus
  ) {
    this.validateData({ slotType, limitOfAssignments, benefitType, amount });
    this.id = id;
    this.slotNumber = slotNumber;
    this.slotType = slotType;
    this.limitOfAssignments = limitOfAssignments;
    this.benefitType = benefitType;
    this.amount = amount;
    this.vehicleType = vehicleType;
    this.status = status;
  }

  static fromPrimitives(plainData: {
    id: string;
    slotNumber: string;
    slotType: SlotType;
    limitOfAssignments: number;
    benefitType: BenefitType;
    amount: number;
    vehicleType: VehicleType;
    status: SlotStatus;
  }) {
    return new SlotEntity(
      plainData.id,
      plainData.slotNumber,
      plainData.slotType,
      plainData.limitOfAssignments,
      plainData.benefitType,
      plainData.amount,
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
      benefitType: this.benefitType,
      amount: this.amount,
      vehicleType: this.vehicleType,
      status: this.status
    };
  }

  private validateData(data: { slotType: SlotType; limitOfAssignments: number; benefitType: BenefitType; amount: number }) {
    if (data.slotType === SlotType.SIMPLE && (data.limitOfAssignments > 1 || data.limitOfAssignments < 1)) {
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

    if ((data.benefitType === BenefitType.DISCOUNT || data.benefitType === BenefitType.COMPLEMENT) && data.amount <= 0) {
      throw new AppError(
        'ENTITY_VALIDATIONS',
        400,
        `You must assign a value of whether the type of space is ${BenefitType.DISCOUNT} or ${BenefitType.COMPLEMENT}.`,
        true
      );
    }

    if (data.benefitType === BenefitType.NO_COST && (data.amount > 0 || data.amount < 0)) {
      throw new AppError(
        'ENTITY_VALIDATIONS',
        400,
        `You cannot assign an amount value if the type is ${BenefitType.NO_COST}.`,
        true
      );
    }
  }
}
