import { faker } from '@faker-js/faker';
import {
  LocationEntity,
  LocationStatus
} from '../../../src/location/core/entities/location-entity';
import { CostType, SlotEntity, SlotStatus, SlotType, VehicleType } from '../../../src/location/core/entities/slot-entity';
import { LocationModel } from '../../../src/server/config/database/models/location.model';
import { SlotModel } from '../../../src/server/config/database/models/slot.model';

export class LocationBuilder {

  private locationEntity: LocationEntity;

  constructor() {
    this.locationEntity = this.createLocationEntity({});
  }

  private createLocationEntity({
    id = faker.string.uuid(),
    name = faker.location.secondaryAddress(),
    address = faker.location.streetAddress(),
    contactReference = faker.person.fullName(),
    phone = '+(502) 45456595',
    email = faker.internet.email(),
    comments = faker.lorem.sentence(),
    numberOfIdentifier = faker.lorem.slug({ min: 1, max: 5 }),
    status = faker.helpers.arrayElement(['ACTIVO', 'INACTIVO']) as LocationStatus,
    slots = []
  }: {
    id?: string;
    name?: string;
    address?: string;
    contactReference?: string;
    phone?: string;
    email?: string;
    comments?: string;
    numberOfIdentifier?: string;
    status?: LocationStatus;
    slots?: SlotEntity[];
  }): LocationEntity {
    return new LocationEntity(
      id,
      name,
      address,
      contactReference,
      phone,
      email,
      comments,
      numberOfIdentifier,
      status,
      slots
    );
  }

  public withActiveStatus(): LocationBuilder {
    this.locationEntity = LocationEntity.fromPrimitives({...this.createLocationEntity({}), status: LocationStatus.ACTIVE});
    return this;
  }

  public withInactiveStatus(): LocationBuilder {
    this.locationEntity = LocationEntity.fromPrimitives({...this.createLocationEntity({}), status: LocationStatus.INACTIVE});
    return this;
  }

  public async build(): Promise<LocationEntity> {
    await LocationModel.create({...this.locationEntity.toPrimitives()});
    return this.locationEntity;
  }
}

export class SlotBuilder{
  private _slotEntity: SlotEntity;

  constructor() {
    this._slotEntity = this.createSlotEntity({});
  }

  private createSlotEntity({
    id = faker.string.uuid(),
    slotNumber = faker.lorem.slug({ min: 1, max: 5 }),
    slotType = faker.helpers.arrayElement(['SIMPLE', 'MULTIPLE']) as SlotType,
    limitOfAssignments = slotType === SlotType.SIMPLE ? 1 : faker.number.int({min: 2, max: 5}),
    costType = faker.helpers.arrayElement(['SIN_COSTO', 'DESCUENTO', 'COMPLEMENTO']) as CostType,
    cost = costType === CostType.NO_COST ? 0 : faker.number.int({min: 1, max: 100}),
    vehicleType = faker.helpers.arrayElement(['CARRO', 'MOTO', 'CAMION']) as VehicleType,
    status = faker.helpers.arrayElement(['DISPONIBLE', 'INACTIVO']) as SlotStatus
  }: {
    id?: string;
    slotNumber?: string;
    slotType?: SlotType;
    limitOfAssignments?: number;
    costType?: CostType;
    cost?: number;
    vehicleType?: VehicleType;
    status?: SlotStatus;
  }): SlotEntity {
    return new SlotEntity(
      id,
      slotNumber,
      slotType,
      limitOfAssignments,
      costType,
      cost,
      vehicleType,
      status
    );
  }

  public withTypeSingle(): SlotBuilder{
    this._slotEntity =  SlotEntity.fromPrimitives({
      ...this._slotEntity.toPrimitives(),
      slotType: SlotType.SIMPLE,
      limitOfAssignments: 1
    })

    return this;
  }

  public withTypeMultiple(limit: number): SlotBuilder{
    this._slotEntity =  SlotEntity.fromPrimitives({
      ...this._slotEntity.toPrimitives(),
      slotType: SlotType.MULTIPLE,
      limitOfAssignments: limit
    })

    return this;
  }

  public withOccupiedStatus(): SlotBuilder{
    this._slotEntity =  SlotEntity.fromPrimitives({
      ...this._slotEntity.toPrimitives(),
      status: SlotStatus.OCCUPIED
    })

    return this;
  }

  public withInactiveStatus(): SlotBuilder{
    this._slotEntity =  SlotEntity.fromPrimitives({
      ...this._slotEntity.toPrimitives(),
      status: SlotStatus.INACTIVE
    })

    return this;
  }

  public withAvailableStatus(): SlotBuilder{
    this._slotEntity =  SlotEntity.fromPrimitives({
      ...this._slotEntity.toPrimitives(),
      status: SlotStatus.ACTIVE
    })

    return this;
  }

  public get slotEntity(): SlotEntity{
    return this._slotEntity;
  }

  public async build(locationId: string): Promise<SlotEntity> {
    await SlotModel.create({...this._slotEntity.toPrimitives(), locationId});
    return this._slotEntity;
  }
}
