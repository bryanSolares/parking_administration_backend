import { v4 as uuid } from "uuid";
import { faker } from "@faker-js/faker";

import { LocationMother } from "./location-mother";

import { AssignmentEntity } from '../../src/assignment/core/entities/assignment-entity';
import { AssignmentLoadEntity } from "../../src/assignment/core/entities/assignment-load-entity";
import { VehicleEntity } from "../../src/assignment/core/entities/vehicle-entity";
import { EmployeeEntity } from "../../src/assignment/core/entities/employee-entity";
import { ScheduleEntity } from "../../src/assignment/core/entities/schedule-entity";
import { DeAssignmentEntity } from "../../src/assignment/core/entities/deassignment-entity";
import { DiscountNoteEntity } from "../../src/assignment/core/entities/discount-note-entity";

export class AssignmentMother{

  static createAssignment(): AssignmentEntity{
    return new AssignmentEntity(uuid(), "abc-1", this.createEmployee(), this.createSchedule(), "ACTIVO", this.createAssignmentLoan(), new Date(), LocationMother.createSlot())
  }
  static createAssignmentLoan(): AssignmentLoadEntity{
    return new AssignmentLoadEntity(uuid(), uuid(), this.createEmployee(), new Date(), new Date(), new Date(), "ACTIVO")
  }

  static createVehicle(): VehicleEntity{
    return new VehicleEntity(uuid(), uuid(), "ABC-123-456", "blue", "toyota", "2022", "CARRO");
  }

  static createEmployee(): EmployeeEntity{
    return new EmployeeEntity(uuid(), uuid(), faker.person.fullName(), faker.lorem.word(), faker.lorem.word(), faker.lorem.word(), faker.lorem.word(), faker.lorem.word(), faker.lorem.word(), faker.lorem.word(), faker.lorem.word(), faker.location.streetAddress(), faker.internet.email(), "+(502) 45454545", faker.string.uuid(), "INACTIVO",  [this.createVehicle()]);
  }

  static createSchedule(): ScheduleEntity{
    return new ScheduleEntity(uuid(), uuid(), "08:00", "12:00", "ACTIVO");
  }



  static createDeAssignment(): DeAssignmentEntity{
    return new DeAssignmentEntity(uuid(), uuid(), "Lorem", new Date(), false)
  }

  static createDiscountNote(): DiscountNoteEntity{
    return new DiscountNoteEntity(uuid(), uuid(), 1, 1, 1, new Date(), new Date(), "PENDIENTE", "PENDIENTE")
  }
}
