import { v4 as uuid } from "uuid";
import { faker } from "@faker-js/faker";

import { CostType, SlotEntity, SlotStatus, SlotType, VehicleType } from "../../src/location/core/entities/slot-entity";
import { LocationEntity, LocationStatus } from "../../src/location/core/entities/location-entity";

export class LocationMother{
    static createSlotEntity(
      id: string = uuid(),
      slotNumber: string = faker.lorem.slug({min: 1, max: 10}),
      slotType: SlotType = SlotType.SIMPLE,
      limitSchedules: number = 1,
      costType: CostType = CostType.NO_COST,
      cost: number = 0,
      vehicleType: VehicleType = VehicleType.CAR,
      status: SlotStatus = SlotStatus.ACTIVE
    ): SlotEntity{
    return new SlotEntity(id, slotNumber, slotType, limitSchedules, costType, cost, vehicleType, status);
  }


  static createLocationEntity(
    id: string = uuid(),
    name: string = faker.location.secondaryAddress(),
    address: string = faker.location.streetAddress(),
    contactReference: string = faker.person.fullName(),
    phone: string = "+(502) 45456595",
    email: string = faker.internet.email(),
    comments: string = faker.lorem.sentence(),
    status: LocationStatus = LocationStatus.ACTIVE,
    slots: SlotEntity[]
  ): LocationEntity{
    return new LocationEntity(id, name, address, contactReference, phone, email, comments, status, slots);
  }

  static createSlotPrimitive(
    id: string = uuid(),
    slotNumber: string = faker.lorem.slug({min: 1, max: 10}),
    slotType: SlotType = SlotType.SIMPLE,
    limitSchedules: number = 1,
    costType: CostType = CostType.NO_COST,
    cost: number = 0,
    vehicleType: VehicleType = VehicleType.CAR,
    status: SlotStatus = SlotStatus.ACTIVE
  ){
    return {
      id,
      slotNumber,
      slotType,
      limitSchedules,
      costType,
      cost,
      vehicleType,
      status
    }
  }

  static createLocationPrimitive(
    id: string = uuid(),
    name: string = faker.location.secondaryAddress(),
    address: string = faker.location.streetAddress(),
    contactReference: string = faker.person.fullName(),
    phone: string = "+(502) 45456595",
    email: string = faker.internet.email(),
    comments: string = faker.lorem.sentence(),
    status: LocationStatus = LocationStatus.ACTIVE
  ){
    return {
      id,
      name,
      address,
      contactReference,
      phone,
      email,
      comments,
      status
    }
  }
}
