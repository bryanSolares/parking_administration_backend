import { faker } from "@faker-js/faker";

import { LocationMother } from "./location-mother";

import { AssignmentEntity } from '../../src/assignment/core/entities/assignment-entity';
import { AssignmentStatus } from '../../src/assignment/core/entities/assignment-entity';
import { CostType, VehicleType } from "../../src/location/core/entities/slot-entity";
import { EmployeeEntity } from "../../src/assignment/core/entities/employee-entity";
import { VehicleEntity } from "../../src/assignment/core/entities/vehicle-entity";

export class AssignmentMother{
 static createAssignmentEntity({
  id = faker.string.uuid(),
  slot = LocationMother.createSlotEntity(),
  employee = this.createEmployeeEntity({}),
  parkingCardNumber = faker.finance.accountNumber(),
  benefitType = CostType.NO_COST,
  status = AssignmentStatus.ASSIGNED,
  tags = [],
 }): AssignmentEntity{
  return new AssignmentEntity(id, slot, employee, parkingCardNumber, benefitType, status, tags)
 }


 static createEmployeeEntity({
  id = faker.string.uuid(),
  employeeCode = faker.finance.accountNumber(),
  name = faker.person.fullName(),
  workplace = faker.location.streetAddress(),
  identifierDocument = faker.finance.accountNumber(),
  company = faker.company.name(),
  department = faker.commerce.department(),
  subManagement = faker.company.buzzPhrase(),
  management1 = faker.company.buzzPhrase(),
  management2 = faker.company.buzzPhrase(),
  workSite = faker.company.buzzPhrase(),
  address = faker.location.streetAddress(),
  email = faker.internet.email(),
  phone = faker.phone.number(),
  vehicles = [this.createVehicleEntity({})]
 }): EmployeeEntity{
  return new EmployeeEntity(id, employeeCode, name, workplace, identifierDocument, company, department, subManagement, management1, management2, workSite, address, email, phone, vehicles)
 }

 static createVehicleEntity({
  id = faker.string.uuid(),
  badge = faker.commerce.productName(),
  brand = faker.commerce.productName(),
  model = faker.commerce.productName(),
  type = VehicleType.CAR,
  color = faker.commerce.productMaterial(),
 }): VehicleEntity{
  return new VehicleEntity(id, badge, color, brand, model, type)
 }


 static createDataForCreateAssignmentUseCase({
  slotId = faker.string.uuid(),
  parkingCardNumber = faker.finance.accountNumber(),
  employee = {
    id : faker.string.uuid(),
    employeeCode : faker.finance.accountNumber(),
    name : faker.person.fullName(),
    workplace : faker.location.streetAddress(),
    identifierDocument : faker.finance.accountNumber(),
    company : faker.company.name(),
    department : faker.commerce.department(),
    subManagement : faker.company.buzzPhrase(),
    management1 : faker.company.buzzPhrase(),
    management2 : faker.company.buzzPhrase(),
    workSite : faker.company.buzzPhrase(),
    address : faker.location.streetAddress(),
    email : faker.internet.email(),
    phone : faker.phone.number(),
    vehicles : [this.createVehicleEntity({}).toPrimitive()]
  },
  tags = []
 }){
  return {
    slotId,
    parkingCardNumber,
    employee,
    tags
  }
 }
}
