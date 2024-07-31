import { v4 as uuid } from "uuid";
import { faker } from "@faker-js/faker";

import { SlotEntity } from "../../src/location/core/entities/slot-entity";
import { LocationEntity } from "../../src/location/core/entities/location-entity";

export class LocationMother{
    static createSlot(): SlotEntity{
    return new SlotEntity(uuid(), uuid(), "S-001", "SIMPLE", "SIN_COSTO", 100, "CARRO", 1, "DISPONIBLE");
  }

  static createLocation(): LocationEntity{
    return new LocationEntity(uuid(), faker.location.secondaryAddress(), faker.location.streetAddress(), [this.createSlot()], faker.person.fullName(), "+(502) 45456595", faker.internet.email(), faker.lorem.sentence(), faker.location.latitude(), faker.location.longitude(), "ACTIVO");
  }
}
