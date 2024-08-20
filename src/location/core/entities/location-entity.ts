import {
  CostType,
  SlotEntity,
  SlotStatus,
  SlotType,
  VehicleType
} from './slot-entity';

export enum LocationStatus {
  ACTIVE = 'ACTIVO',
  INACTIVE = 'INACTIVO'
}

export class LocationEntity {
  readonly id: string;
  readonly name: string;
  readonly address: string;
  readonly contactReference: string;
  readonly phone: string;
  readonly email: string;
  readonly comments: string;
  readonly status: LocationStatus;
  readonly slots: SlotEntity[];

  constructor(
    id: string,
    name: string,
    address: string,
    contactReference: string,
    phone: string,
    email: string,
    comments: string,
    status: LocationStatus,
    slots: SlotEntity[]
  ) {
    this.id = id;
    this.name = name;
    this.address = address;
    this.slots = slots;
    this.contactReference = contactReference;
    this.phone = phone;
    this.email = email;
    this.comments = comments;
    this.status = status;
  }

  static fromPrimitives(primitiveData: {
    id: string;
    name: string;
    address: string;
    contactReference: string;
    phone: string;
    email: string;
    comments: string;
    status: LocationStatus;
    slots: {
      id: string;
      slotNumber: string;
      slotType: SlotType;
      limitSchedules: number;
      costType: CostType;
      cost: number;
      vehicleType: VehicleType;
      status: SlotStatus;
    }[];
  }) {
    return new LocationEntity(
      primitiveData.id,
      primitiveData.name,
      primitiveData.address,
      primitiveData.contactReference,
      primitiveData.phone,
      primitiveData.email,
      primitiveData.comments,
      primitiveData.status,
      primitiveData.slots.map(slot => SlotEntity.fromPrimitives(slot))
    );
  }

  toPrimitives() {
    return {
      id: this.id,
      name: this.name,
      address: this.address,
      contactReference: this.contactReference,
      phone: this.phone,
      email: this.email,
      comments: this.comments,
      status: this.status,
      slots: this.slots.map(slot => slot.toPrimitives())
    };
  }
}
