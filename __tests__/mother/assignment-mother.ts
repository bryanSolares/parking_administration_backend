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

  static createAssignment({
    id = uuid(),
    slot_id = 'abc',
    employee = this.createEmployee(),
    schedule =  this.createSchedule(),
    status = "ACTIVO",
    tags = [],
    assignment_loan = this.createAssignmentLoan({}),
    assignment_date = new Date(),
    slot = LocationMother.createSlot(),
    discount_note = undefined
   }): AssignmentEntity{
    return new AssignmentEntity(id, slot_id, employee, schedule, status, tags, assignment_loan, assignment_date, slot, discount_note);
  }
  static createAssignmentLoan({
    id = uuid(),
    assignment_id = uuid(),
    employee = this.createEmployee(),
    start_date_assignment = new Date().toString(),
    end_date_assignment = new Date().toString(),
    assignment_date = new Date().toString(),
    status = "ACTIVO"

  }): AssignmentLoadEntity{
    return new AssignmentLoadEntity(id, assignment_id, employee, new Date(start_date_assignment), new Date(end_date_assignment), new Date(assignment_date), status);
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

  static createDiscountNote({
    id = uuid(),
    assignment_id = uuid(),
    last_notice = new Date(),
    next_notice = new Date(),
    status_signature = "PENDIENTE",
    status_dispatched = "PENDIENTE"

  }): DiscountNoteEntity{
    return new DiscountNoteEntity(id, assignment_id, 1, 1, 1, last_notice, next_notice, status_signature, status_dispatched)
  }
}
